'use client'
import React, { useEffect, useState,useRef  } from 'react'
import Image from 'next/image'
import { IoIosAddCircleOutline } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import dynamic from 'next/dynamic';
import { GrLocation } from "react-icons/gr";
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
// import 'swiper/css';
import { getSlug, isEmptyObject, placeholderImage, t, truncate } from '@/utils/index';
import { BiPlanet } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { logoutSuccess, userSignUpData } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import FirebaseData from '@/config/firebase';
import { settingsData } from '@/store/slices/settingSlice';
import { getLanguageApi, getLimitsApi } from '@/api/apiCalling';
import { CurrentLanguageData, setCurrentLanguage } from '@/store/slices/languageSlice';
import { useRouter, usePathname } from 'next/navigation';
import { setSearch } from "@/store/slices/searchSlice"
import { isLogin } from '@/utils/index';
import { CategoryData, CurrentPage, LastPage, setCatCurrentPage, setCatLastPage, setCateData, setTreeData } from '@/store/slices/categorySlice'
import { categoryApi } from '@/api/apiCalling'
// import FilterTree from '../Category/FilterTree';
import { saveOfferData } from '@/store/slices/offerSlice';
// import HeaderCategories from './HeaderCategories';
import LoginPopup from '@/app/(auth)/login.jsx';
// const ProfileDropdown = dynamic(() => import('../Profile/ProfileDropdown.jsx'))
const MailSentSucessfully = dynamic(() => import('@/app/(auth)/MailSentSucessfully.jsx'), { ssr: false })
// const LoginModal = dynamic(() => import('@/app/(auth)/LoginModal.jsx'), { ssr: false })
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import fetchCategories from "@/store/slices/settingSlice"
// import G from "@/app/(auth)/LoginModal"
// import { fetchSystemSettings } from '@/store/slices/SsdSlice';
import { fetchSystemSettings } from "@/store/slices/settingSlice";
import { IoSearchOutline } from "react-icons/io5";
import { setTranslatedData } from '@/store/slices/languageSlice';
import LocationComp from "@/components/common/LocationComp"
const Header = ({ ToggleLoginPopupFunc }) => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const UserData = useSelector(userSignUpData)
    const { signOut } = FirebaseData();
    const catCurrentPage = useSelector(CurrentPage)
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const { data } = useSelector((state) => state.Settings)
    const { language,translatedData } = useSelector((state) => state.Language)

    //dispatch the system settings and fire and get default the language of sysytem and save it in store
    useEffect(() => {
        dispatch(fetchSystemSettings())
            .unwrap()
            .then(async(response) => {
                // console.log('Fetched Data:', response);
                   let c= await handleLanguageChange(response?.default_language);                
                dispatch(setCurrentLanguage(c?.data?.data?res?.data?.data:response?.default_language));
                
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fetch Error:', err);
            });
    }, [dispatch]);
    //chnage the language to Ar or En in default lang is En current we customized two languages
    const handleLanguageChange = async (language_code) => {
        try {
            const res = await getLanguageApi.getLanguage({ language_code, type: 'web' });
            if (res?.data?.error) {
                toast.error(res?.data?.message);
            } else {
                // console.log(res?.data?.data); 
                dispatch(setCurrentLanguage(language_code));
                dispatch(setTranslatedData(res?.data?.data));
                // toast.success(`Language changed to ${language_code}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // dircetion page rtl or ltr
    useEffect(() => {
        if (language == "ar") {
            document.documentElement.dir = "rtl";
        } else {
            document.documentElement.dir = "ltr";
        }
    }, [language]);

    const [isPageScrolled, setIsPageScrolled] = useState(false);
    const prevScrollState = useRef(false); 
    useEffect(() => {
        const handleScroll = () => {
            const shouldBeScrolled = window.scrollY > 200;
            // Only update state if it has actually changed            
            if (prevScrollState.current !== shouldBeScrolled) {
                prevScrollState.current = shouldBeScrolled;
                setIsPageScrolled(shouldBeScrolled);
                // console.log("Scroll state changed:", shouldBeScrolled);
            }
        };

        // Use passive listener for better performance
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  
    return (
        <>
            <header className="bg-white py-3 md:px-2 fixed top-0 w-full">
                <div className="mx-auto container px-3 sm:px-0 ">
                    <div className="flex gap-3  items-center justify-between">
                        {/* location */}
                        <div className="location flex-[0.5] hidden md:block  ">
                            <LocationComp />
                        </div>
                        {/* search */}
                        <div className="flex-1 hidden md:block ">
                            <div className="relative">
                                <form action="" >
                                <input
                                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                    placeholder={t('searchItem')} 
                                />
                                <button
                                    className="absolute h-full top-0  right-[1px] flex items-center rounded bg-red-600 py-1 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                    type="submit"
                                >
                                    <IoSearchOutline className='text-2xl' />
                                </button>
                                </form>
                            </div>
                        </div>

                        {/* language & auth(login||user) */}
                        <div className="md:flex md:items-center md:gap-2">
                            <nav aria-label="Global" className=" hidden md:block">
                                <ul className="flex items-center gap-6 text-sm">
                                    <li className=''>
                                        {loading ? (
                                            <div className="text-gray-500  w-[40px] opacity-0"></div>
                                        ) : (
                                            <>
                                                <span
                                                    className="font-meduim text-[1.2rem]  cursor-pointer "
                                                    onClick={() => handleLanguageChange(language === 'ar' ? 'en' : 'ar')}>
                                                    {language === "en" ? "ألعربيه" : "English"}
                                                </span>
                                            </>
                                        )}
                                    </li>
                                    <li className='flex-1'>
                                        <span onClick={() => setShowLoginPopup(true)}
                                            className="font-meduim text-[1.2rem]  cursor-pointer " >
                                            {language === "en" ? "Login" : "تسجيل الدخول"}
                                        </span>
                                    </li>


                                </ul>
                            </nav>

                            <div className="hidden md:relative md:block">
                                <div className="Sell">
                                    <span
                                        onClick={() => setShowLoginPopup(true)}
                                        className="group cursor-pointer relative inline-flex transition-all hover:bg-red-500 items-center overflow-hidden rounded-[7px] bg-red-600 px-8 py-4 text-white focus:ring-3 focus:outline-hidden"
                                    >
                                        <span className="text-xl font-medium ">  {language === "en" ? "Sell" : "بيع"} </span>
                                    </span>
                                </div>

                                <div className="profile hidden">
                                    <button
                                        type="button"
                                        className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
                                    >
                                        <span className="sr-only">Toggle dashboard menu</span>

                                        <img
                                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            alt=""
                                            className="size-10 object-cover"
                                        />
                                    </button>

                                    <div
                                        className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                                        role="menu"
                                    >
                                        <div className="p-2">
                                            <a
                                                href="#"
                                                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                role="menuitem"
                                            >
                                                My profile
                                            </a>

                                            <a
                                                href="#"
                                                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                role="menuitem"
                                            >
                                                Billing summary
                                            </a>

                                            <a
                                                href="#"
                                                className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                role="menuitem"
                                            >
                                                Team settings
                                            </a>
                                        </div>

                                        <div className="p-2">
                                            <form method="POST" action="#">
                                                <button
                                                    type="submit"
                                                    className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                                    role="menuitem"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="size-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                                                        />
                                                    </svg>

                                                    Logout
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className=" block md:hidden ">
                              <HiOutlineMenuAlt3 className='text-red-600 text-2xl  '/>
                            </div>
                        </div>

                    </div>
                </div>
            </header>



        <header className="block sm:hidden tablet-screen relative">
            <div className="container mx-auto px-3 sm:px-0">
                {/* Hide Location when scrolled */}
                {isPageScrolled ? "LocationComp" :<LocationComp />}
                
                <div className={`flex-1 mt-5  ${isPageScrolled?"fixed w-[100%]":""}  top-0 bg-white z-50 shadow-md`}>
                    <div className="relative container ">
                        <input
                            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                            placeholder="UI Kits, Dashboards..."
                        />
                        <button
                            className="absolute h-full top-0 right-[1px] flex items-center rounded bg-red-600 py-1 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                        >
                            <IoSearchOutline className="text-2xl" />
                        </button>
                    </div>
                </div>
            </div>
        </header>


      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
        </>
    )
}
export default Header

{/* <LoginModal IsLoginModalOpen={IsLoginModalOpen} setIsLoginModalOpen={setIsLoginModalOpen} setIsRegisterModalOpen={setIsRegisterModalOpen} IsMailSentOpen={IsMailSentOpen} setIsMailSentOpen={setIsMailSentOpen} IsRegisterModalOpen={IsRegisterModalOpen} openSentMailModal={openSentMailModal} />

<MailSentSucessfully IsMailSentOpen={IsMailSentOpen} OnHide={() => setIsMailSentOpen(false)} IsLoginModalOpen={() => setIsLoginModalOpen(true)} />

<LocationModal IsLocationModalOpen={IsLocationModalOpen} OnHide={() => setIsLocationModalOpen(false)} /> */}













