'use client'
import React, { useEffect, useState } from 'react';
import LayoutHeader from '@/app/Layout/LayoutHeader.jsx';
import Loader from '@/components/Loader/Loader.jsx';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import dynamic from 'next/dynamic';
import { protectedRoutes } from '@/components/routes/routes';
import LoginPopup from '@/app/(auth)/login.jsx';
import FirebaseData from '@/config/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchSystemSettings } from '@/store/slices/settingSlice.js';
import { useIsRtl } from '@/utils/index.jsx';
import {fetchDefaultLanguage} from "@/store/slices/languageSlice.js"
const PushNotificationLayout = dynamic( () => import('../../components/firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });
import useLanguage from '@/hooks/useLanguage';

const Layout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { auth } = FirebaseData();
  const dispatch = useDispatch()
  const { handleLanguageChange } = useLanguage()
  const isRtl = useIsRtl();
  const isProtectedRoute = protectedRoutes.some((route) => route.test(pathname));
  const [isLoading, setIsLoading] = useState(true);
  const [isUserVerified, setUserIsVerified] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [defaultSystem, setDefaultSystem] = useState(false);
  const { language, translatedData } = useSelector((state) => state.Language)
  const { data } = useSelector((state) => state.Settings)

  //check if user looged in and is verfied or not ?
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setUserIsVerified(true);
        // console.log(user?.emailVerified);
      } else {
        setUserIsVerified(false);
        // console.log(user?.emailVerified);
      }
      setIsAuthChecked(true);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);
  //check the protected routes and status of user
  useEffect(() => {
    if (isAuthChecked) {
      if (isProtectedRoute && !isUserVerified) {
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

  useEffect(() => {
    if (translatedData ==null) {
      dispatch(fetchSystemSettings()).then((res) => {
      dispatch(fetchDefaultLanguage(res.payload?.default_language));
      });
    }
  }, [dispatch ]);

  //  console.log(data);

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