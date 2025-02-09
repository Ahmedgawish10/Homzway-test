'use client'
import React, { useEffect, useState } from 'react';
import LayoutHeader from '@/app/Layout/LayoutHeader.jsx';
import Loader from '@/components/Loader/Loader.jsx';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { protectedRoutes } from '@/components/routes/routes';
import { isLogin, t } from '@/utils/index.jsx';
import LoginPopup from '@/app/(auth)/login.jsx';
import FirebaseData from '@/config/firebase.js'; 
import { onAuthStateChanged } from 'firebase/auth';
const PushNotificationLayout = dynamic(() => import('../../components/firebaseNotification/PushNotificationLayout.jsx'), { ssr: false });

const Layout = ({ children }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { auth } = FirebaseData()
    const privateRoutes = protectedRoutes.some(route => route.test(pathname));
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUserVerified, setUserIsVerified] = useState(false); 
    //follow the status of user is loggedin or is verified or not all.
    useEffect(() => {
        setIsLoading(true);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (user.emailVerified) {
                    setUserIsVerified(true);
                    setShowLoginPopup(false)
                } else {
                    setUserIsVerified(false);
                }
            } else {
                setUserIsVerified(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);
    //if user not verified show the popup login in the ptrotected routes only.
    useEffect(() => {
        if (!auth.currentUser || setUserIsVerified === false) {
            setShowLoginPopup(true);
        }
    }, [auth.currentUser, isUserVerified]);
    // here all the public routes that can users access it without login.
    useEffect(() => {
        if (!privateRoutes) {
            setShowLoginPopup(false);
        }
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
                    <PushNotificationLayout>
                        <LayoutHeader  />
                        {children}
                    </PushNotificationLayout>
                </>
            )}
        </>
    );
};

export default Layout;
