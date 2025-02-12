'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import Link from 'next/link';
// import 'swiper/css';
import { getSlug, isEmptyObject, placeholderImage, t, truncate } from '@/utils/index';
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
import LocationComp from "@/components/common/(location)/LocationComp";
import { getCityData } from '@/store/slices/locationSlice';
import MenuMobile from "@/components/common/MenuMobile"
import useLanguage from '@/hooks/useLanguage';
import { handleFirebaseAuthError } from "@/utils";
import { useIsRtl } from '@/utils/index';
import { BiChat, BiDollarCircle, BiReceipt } from "react-icons/bi"
import { FiUser } from "react-icons/fi"
import { IoMdNotificationsOutline } from "react-icons/io"
import { LiaAdSolid } from "react-icons/lia"
import { LuHeart } from "react-icons/lu"
import { RiLogoutCircleLine } from "react-icons/ri"
import {MdOutlineRateReview } from "react-icons/md"

const Header = ({ ToggleLoginPopupFunc }) => {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const UserData = useSelector(userSignUpData)
    const isRtl = useIsRtl();
    const { signOut } = FirebaseData();
    const catCurrentPage = useSelector(CurrentPage)
    const { data } = useSelector((state) => state.Settings)
    const { language, translatedData } = useSelector((state) => state.Language)
    const { userVerfied } = useSelector((state) => state.Auth)
    const { handleLanguageChange } = useLanguage()
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [loading, setLoading] = useState(0);
    const [isPageScrolled, setIsPageScrolled] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // header func sticky on scroll 
    const prevScrollState = useRef(false);
    useEffect(() => {
        const handleScroll = () => {
            const shouldBeScrolled = window.scrollY > 200;
            if (prevScrollState.current !== shouldBeScrolled) {
                prevScrollState.current = shouldBeScrolled;
                setIsPageScrolled(shouldBeScrolled);
                // console.log("Scroll state changed:", shouldBeScrolled);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // toogle menu in tablet or less screen
    const handleToggleMenu = (newState) => {
        setIsMenuOpen((prev) => {
            const newState = !prev;
            document.body.style.overflow = newState ? "hidden" : "auto";
            return newState;
        });
    };
    // toogle loggin model
    const TooglePoupLogin = () => {
        setShowLoginPopup(true);
        document.body.style.overflow = "hidden";
    }
    // open profile user toggle
    const TooglePoupProfile = () => {
        setIsProfileOpen((prev) => !prev)
    }
    // userListsProfile
    const userListsProfile = [
        {
            key: 1,
            href: '/profile/edit-profile',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><FiUser size={16} /></span>
                    <span>{t('myProfile')}</span>
                </div>
            )
        },
        {
            key: 2,
            href: '/notifications',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><IoMdNotificationsOutline size={16} /></span>
                    <span>{t('notification')}</span>
                </div>
            )
        },
        {
            key: 3,
            href: '/chat',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><BiChat size={16} /></span>
                    <span>{t('chat')}</span>
                </div>
            )
        },
        {
            key: 4,
            href: '/user-subscription',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><BiDollarCircle size={16} /></span>
                    <span>{t('subscription')}</span>
                </div>
            )
        },
        {
            key: 5,
            href: '/ads',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><LiaAdSolid size={16} /></span>
                    <span>{t('ads')}</span>
                </div>
            )
        },
        {
            key: 6,
            href: '/favourites',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><LuHeart size={16} /></span>
                    <span>{t('favorites')}</span>
                </div>
            )
        },
        {
            key: 7,
            href: '/transactions',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><BiReceipt size={16} /></span>
                    <span>{t('transaction')}</span>
                </div>
            )
        },
        {
            key: 8,
            href: '/reviews',
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><MdOutlineRateReview size={16} /></span>
                    <span>{t('myReviews')}</span>
                </div>
            )
        },
        {
            key: 9,
            label: (
                <div className="profDropIconCont flex gap-2">
                    <span><RiLogoutCircleLine size={16} /></span>
                    <span>{t('signOut')}</span>
                </div>
            )
        },
    ]
    // handle logout func
    const handleLogout = () => {
        Swal.fire({
            title: `${t('areYouSure')} \u200E`,
            text: `${t('logoutConfirmation')} \u200E`,
            icon: "warning",
            showCancelButton: true,
            customClass: {
                confirmButton: 'Swal-confirm-buttons',
                cancelButton: "Swal-cancel-buttons"
            },
            confirmButtonText: t("yes"),
        }).then((result) => {
            if (result.isConfirmed) {
             // Clear the recaptchaVerifier by setting it to null
                // window.recaptchaVerifier = null;
                // logoutSuccess();
                signOut()
                router.push('/')
                saveOfferData([]);
                toast.success(t('signOutSuccess'));
            } else {
                // toast.error(t('signOutCancelled'));
            }
        });
    };
    return (
        <>
            <header className="bg-white py-3 z-[5] sm:px-4 fixed top-0 w-full hidden sm:block ">
                <div className="mx-auto container px-3 sm:px-0 ">
                    <div className="flex gap-3  items-center justify-between">
                        {/* location user comp */}
                        <div className="location flex-[0.5]  ">
                            <LocationComp />
                        </div>
                        {/* search */}
                        <div className="flex-1  ">
                            <div className="relative">
                                <form action="" >
                                    <input className="w-full bg-transparent placeholder:text-[17px] md:placeholder:text-xl placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                        placeholder={t('searchItem')} />
                                    <button className="absolute h-full top-0  right-[1px] flex items-center rounded bg-red-600 py-1 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                        type="submit" >
                                        <IoSearchOutline className='text-2xl' />
                                    </button>
                                </form>
                            </div>
                        </div>
                        {/* language & auth(login||user) */}
                        <div className="flex md:items-center justify-between md:justify-end items-center md:gap-2 flex-1 md:flex-none">
                            <nav aria-label="Global" className="">
                                <ul className="flex items-center gap-6 text-sm">
                                    <li className=''>
                                            <span className="font-meduim text-[1.2rem]  cursor-pointer hover:text-red-700 transition-all "
                                                onClick={() => handleLanguageChange(language)}>
                                                {language === "en" ? "ألعربيه" : "English"}
                                            </span>
                                    </li>
                                    {!userVerfied?.emailVerified && (
                                        <li className='flex-1'>
                                            <span onClick={TooglePoupLogin}
                                                className="font-meduim text-[1.2rem]  cursor-pointer " >
                                                {translatedData?.file_name?.login}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </nav>

                            <div className=" md:relative flex  gap-2">
                                <div className="Sell">
                                    <span
                                        onClick={() => setShowLoginPopup(true)}
                                        className="group cursor-pointer relative inline-flex transition-all hover:bg-red-500 items-center overflow-hidden rounded-[7px] bg-red-600 px-8 py-4 text-white focus:ring-3 focus:outline-hidden"
                                    >
                                        <span className="text-xl font-medium ">{translatedData?.file_name?.selling}  </span>
                                    </span>
                                </div>
                                {userVerfied?.emailVerified && (
                                    <div className="profile order-[-2]">
                                        <div className="profile-img h-full flex items-center">
                                            <button
                                                type="button"
                                                onClick={TooglePoupProfile}
                                                className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
                                            >
                                                <img
                                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D"
                                                    alt=""
                                                    className="size-10 object-cover"
                                                />
                                            </button>
                                        </div>

                                        {isProfileOpen && (
                                            <div className="absolute end-0 z-10 mt-4 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg" role="menu" >
                                                <div className="p-2">
                                                    {userListsProfile.map(({ key, href, label }) => (
                                                        href ? (
                                                            <a
                                                                key={key}
                                                                href={href}
                                                                className="flex items-center gap-2  rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                                                role="menuitem"
                                                            >
                                                                {label}
                                                            </a>
                                                        ) : (
                                                            <button
                                                                key={key}
                                                                onClick={handleLogout}
                                                                className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                                                role="menuitem"
                                                            >
                                                                {label}
                                                            </button>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* tablet navbar and less screen */}
            <header className="tablet-screen block sm:hidden  relative">
                <div className=" block md:hidden border-b mb-3 py-2">
                    <div className=" flex items-center relative  md:hidden container mx-auto px-3 " >
                        <HiOutlineMenuAlt3 className='text-red-600 text-2xl cursor-pointer ' onClick={handleToggleMenu} />
                        <MenuMobile isMenuOpen={isMenuOpen} handleToggleMenu={handleToggleMenu} setShowLoginPopup={setShowLoginPopup} />
                        {data?.header_logo && (
                            <Link href="/">
                                <Image priority src={data.header_logo} width={200} height={100}
                                    className="!h-[30px] w-[160px]" alt="Logo" />
                            </Link>
                        )}
                    </div>
                </div>
                {/* location section */}
                <div className="container mx-auto px-3 sm:px-0">
                    {isPageScrolled ? "LocationComp" : <LocationComp />}
                    <div className={`flex-1 mt-3  ${isPageScrolled ? " w-[90%] fixed left-1/2 transform -translate-x-1/2 container mx-auto" : ""} top-0 bg-white z-50 shadow-md`}>
                        <div className="relative container mx-auto ">
                            <input
                                className="w-full bg-transparent placeholder:text-[18px] placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-4 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                placeholder={t('searchItem')}
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













