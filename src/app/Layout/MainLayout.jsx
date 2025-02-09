'use client'
import React, { useEffect, useState } from 'react';
import LayoutHeader from '@/app/Layout/LayoutHeader.jsx';
import Loader from '@/components/Loader/Loader.jsx';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { protectedRoutes } from '@/components/routes/routes';
import LoginPopup from '@/app/(auth)/login.jsx';
import FirebaseData from '@/config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const PushNotificationLayout = dynamic(
  () => import('../../components/firebaseNotification/PushNotificationLayout.jsx'),
  { ssr: false }
);

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = FirebaseData();
  const isProtectedRoute = protectedRoutes.some((route) => route.test(pathname));

  const [isLoading, setIsLoading] = useState(true);
  const [isUserVerified, setUserIsVerified] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track if auth state is checked

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setUserIsVerified(true);
      } else {
        setUserIsVerified(false);
      }
      setIsAuthChecked(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthChecked) {
      if (isProtectedRoute && !isUserVerified) {
        setShowLoginPopup(true);
      } else {
        setShowLoginPopup(false); 
      }
    }
  }, [isProtectedRoute, isUserVerified, isAuthChecked]);


  if (isLoading) return <Loader />; 
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