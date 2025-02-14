'use client'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import firebase from "firebase/compat/app"
import { getAuth,GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import toast from 'react-hot-toast';
 import { getFcmToken } from '@/store/slices/settingSlice';
import { createStickyNote,handleFirebaseAuthError, t } from "@/utils/index";
import { userSignUpApi } from "@/api/apiCalling";

const FirebaseData = () => {
  let firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  const messagingInstance = async () => {
    try {
      const isSupportedBrowser = await isSupported();
      if (isSupportedBrowser) {
        return getMessaging(firebaseApp);
      } else {
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error('Error checking messaging support:', err);
      return null;
    }
  };
  const fetchToken = async (setFcmToken) => {    
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = await messagingInstance();
        if (!messaging) {
          console.error('Messaging not supported.');
          return;
        }
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          })
            .then((currentToken) => {
              if (currentToken) {
                 getFcmToken(currentToken);
                setFcmToken(currentToken);
              } else {
                setTokenFound(false);
                toast.error(t('permissionRequired'));
              }
            })
            .catch((err) => {
              // console.error('Error retrieving token:', err);
              // If the error is "no active Service Worker", try to register the service worker again
              if (err.message.includes('no active Service Worker')) {
                registerServiceWorker();
              }
            });
        } else {
          setTokenFound(false);
          // toast.error('Permission is required for notifications.');
        }
      }
    } catch (err) {
      // console.error('Error requesting notification permission:', err);
    }
  };

  const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful with scope: ', registration.scope);
          // After successful registration, try to fetch the token again
          fetchToken();
        })
        .catch((err) => {
          console.log('Service Worker registration failed: ', err);
        });
    }
  };

  const onMessageListener = async () => {
    const messaging = await messagingInstance();
    if (messaging) {
      return new Promise((resolve) => {
        onMessage(messaging, (payload) => {
          resolve(payload);
        });
      });
    } else {
      console.error('Messaging not supported.');
      return null;
    }
  };
  const signOut = () => {
    return auth.signOut()
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const response = await signInWithPopup(auth, provider);
        return response;
    } catch (error) {
        const errorCode = error.code;
        handleFirebaseAuthError(errorCode);
    }
};


  return { firebase, auth, fetchToken, onMessageListener, signOut,handleGoogleSignup }
}

export default FirebaseData;
