'use client'
import React, { useEffect, useState } from 'react';
import LayoutHeader from '@/app/Layout/LayoutHeader.jsx';
import Loader from '@/components/Loader/Loader.jsx';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { protectedRoutes } from '@/components/privateRoutes/routes.jsx';
import LoginPopup from '@/app/(auth)/login.jsx';
import FirebaseData from '@/config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchSystemSettings } from '@/store/slices/settingSlice.js';
import { useIsRtl } from '@/utils/index.jsx';
import {fetchDefaultLanguage} from "@/store/slices/languageSlice.js"
const PushNotificationLayout = dynamic( () => import('../../components/firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });
import { setUserVerfied } from '@/store/slices/authSlice.js';
const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = FirebaseData();
  const dispatch = useDispatch()
  const isRtl = useIsRtl();
  const isProtectedRoute = protectedRoutes.some((route) => route.test(pathname));
  const [isLoading, setIsLoading] = useState(true);
  const [isUserVerified, setUserIsVerified] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { language, translatedData } = useSelector((state) => state.Language);
  const {userVerfied,userData} = useSelector((state) => state.Auth)
  

  //check if user looged in and is verfied or not ?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {      
      if (user && user.emailVerified && userData )  {
        setUserIsVerified(true);
        dispatch(setUserVerfied(user));
        console.log("user is Verified",user.emailVerified)
      } else {
        setUserIsVerified(false);
      }
      setIsAuthChecked(true)
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);
  //check the protected routes and status of user
  useEffect(() => {
    if (isAuthChecked) {
      if (isProtectedRoute && !isUserVerified && !userData ) {
        setShowLoginPopup(true);
      } else {
        setShowLoginPopup(false);
      }
    }
  }, [isProtectedRoute, isUserVerified, isAuthChecked]);
  //direction of pages (rtl||ltr)
  useEffect(() => {
    if (isRtl) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }
  }, [language]);
  //  if there is no language get the default language from sysytem 
  useEffect(() => {
    if (translatedData ==null) {
      dispatch(fetchSystemSettings()).then((res) => {
      dispatch(fetchDefaultLanguage(res.payload?.default_language));
      });
    }
  }, [dispatch ]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {isAuthChecked && showLoginPopup ? (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      ) : (
        <PushNotificationLayout>
          <LayoutHeader />
          {children}
        </PushNotificationLayout>
      )}
    </>
  );
};

export default Layout;