'use client'
import React, { useEffect, useState } from 'react';
import LayoutHeader from '@/Layout/LayoutHeader.jsx';
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
const PushNotificationLayout = dynamic( () => import('../components/firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });
import Footer from "@/components/common/Footer.jsx"
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified && userData) {
        setUserIsVerified(true);
        dispatch(setUserVerfied(user));        
      } else {
        setUserIsVerified(false);
      }
      setIsAuthChecked(true);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth, dispatch, userData]);

  useEffect(() => {
    if (isAuthChecked && isProtectedRoute && isUserVerified === false) {
      setShowLoginPopup(true);
    }
  }, [isProtectedRoute, isUserVerified, isAuthChecked]);

//direction of pages (rtl||ltr)
useEffect(() => {
    document.documentElement.dir = isRtl?"rtl":"ltr";
}, [language]);
//  if there is no language get the default language from sysytem 
useEffect(() => {
  if (!translatedData) {
    dispatch(fetchSystemSettings()).then((res) => {
    dispatch(fetchDefaultLanguage(res.payload?.default_language));
    });
  }
}, [dispatch ]);

  const handleClosePopup = () => {
    setShowLoginPopup(false);
    router.replace("/"); 
  };

  if (!isAuthChecked || isLoading) {
    return <Loader />;
  }

  return (
    <PushNotificationLayout>
      {!isProtectedRoute || isUserVerified ? <LayoutHeader /> : null}
      {isProtectedRoute && isUserVerified === false && showLoginPopup && (<LoginPopup onClose={handleClosePopup}/> )}
      {!isProtectedRoute || isUserVerified ? <main className='flex-1'>{children}</main> : null}
      {!isProtectedRoute || isUserVerified ? <Footer /> : null}
    </PushNotificationLayout>
  );
};

export default Layout;
