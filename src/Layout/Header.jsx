'use client'
import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getSlug, isEmptyObject, placeholderImage, t, truncate } from '@/utils/index';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { logoutSuccess, userSignUpData } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import FirebaseData from '@/config/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { CategoryData, CurrentPage, LastPage, setCatCurrentPage, setCatLastPage, setCateData, setTreeData } from '@/store/slices/categorySlice'
import { saveOfferData } from '@/store/slices/offerSlice';
import LoginPopup from '@/app/(auth)/login.jsx';
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoSearchOutline } from "react-icons/io5";
import { LiaAdSolid } from "react-icons/lia"
import { LuHeart } from "react-icons/lu"
import { RiLogoutCircleLine } from "react-icons/ri"
import { MdOutlineRateReview } from "react-icons/md"
import { FiUser } from "react-icons/fi"
import { IoMdNotificationsOutline } from "react-icons/io"
import LocationComp from "@/components/common/(location)/LocationComp";
import MenuMobile from "@/components/common/MenuMobile"
import useLanguage from '@/hooks/useLanguage';
import { useIsRtl } from '@/utils/index';
import { BiChat, BiDollarCircle, BiReceipt } from "react-icons/bi"
import { setUserVerfied } from '@/store/slices/authSlice';
import { userLogout } from '@/store/slices/authSlice';
import { CgProfile } from "react-icons/cg";

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
    const { userVerfied, userData } = useSelector((state) => state.Auth)
    const { cateData } = useSelector((state) => state.Category, shallowEqual);

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
        // document.body.style.overflow = "hidden";
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
                signOut()
                dispatch(userLogout(null))
                router.push('/')
                saveOfferData([]);
                toast.success(t('signOutSuccess'));
                console.log("fffffffffffffffffffffff");
                
            } else {
                // toast.error(t('signOutCancelled'));
            }
        });
    };
    const TooglePoupSell = () => {
        if (!userData) {
            setShowLoginPopup(true);
        } else {
            router.push("/sell")
        }

    }

    return (
        <>
            <header className=" header-lg  bg-white py-3 z-10 sm:px-4 fixed top-0 w-full  !sm:block ">
                <div className="mx-auto container px-3 sm:px-0 ">
                    {/* header one overlay */}
                    <div className="overlay-header flex gap-3 items-center pb-3 ">
                        {data?.header_logo && (
                            <Link href="/">
                                <Image priority src={data.header_logo} width={120} height={100}
                                    className="" alt="Logo" />
                            </Link>
                        )}
                        {cateData?.slice(0,3).map((category, index) => {
                            return (
                                <div key={index} className=" header-category group relative flex gap-x-2 rounded-lg  hover:bg-gray-50">
                                    <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <img src={category.image} alt={category.image} className="size-6" width={100} height={100} />
                                    </div>
                                    <div>
                                        <a href={category.link || "#"} className="font-semibold text-gray-900">
                                            <div className="flex justify-center pt-3">
                                                <span className="pb-1 line-clamp-1 text-center font-semibold">
                                                    {language === "en"
                                                        ? category.name
                                                        : category?.translations?.map((translation, i) => (
                                                            <span key={i}>{translation.name}</span>
                                                        ))}
                                                </span>
                                            </div>
                                            <span className="absolute "></span>
                                        </a>
                                        {category.description && <p className="mt-1 text-gray-600">{category.description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* main header  */}
                    <div className="flex gap-3  items-center justify-between">
                        {/* location user comp */}
                        <div className="location" style={{flex:"0.5"}}>
                            <LocationComp />
                        </div>
                        {/* search */}
                        <div className="flex-1">
                            <div className="relative">
                                <form action="" >
                                    <input className={`${isRtl?"custom-padding":"custom-padding"} search-input-item w-full   bg-transparent placeholder:text-[17px] md:placeholder:text-xl placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" `} 
                                        placeholder={t('searchItem')} />
                                    <button className="search-button"
                                        type="submit" >
                                        <IoSearchOutline className='text-2xl' />
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* language & auth(login||user) */}
                        <div className="flex md:items-center justify-between md:justify-end items-center md:gap-2  md:flex-none">
                            <nav aria-label="Global" className=" px-2">
                                <ul className="flex items-center gap-2 text-sm">
                                    <li className=''>
                                        <span className="font-meduim text-[1.2rem]  cursor-pointer hover:text-red-700 transition-all "
                                            onClick={() => handleLanguageChange(language)}>
                                            {language === "en" ? "ألعربيه" : "English"}
                                        </span>
                                    </li>
                                    {!userData && (
                                        <li className='flex-1'>
                                            <span onClick={TooglePoupLogin}
                                                className="font-meduim text-[1.2rem]  cursor-pointer " >
                                                {translatedData?.file_name?.login}
                                            </span>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                            {/* Sell */}

                            <div className=" md:relative flex  gap-2">
                                <div className="sell">
                                    <button onClick={TooglePoupSell} className="sell-button py-2    ">
                                        <span className="text-xl font-medium ">
                                            {translatedData?.file_name?.selling}
                                        </span>
                                    </button>
                                </div>
                                {userData && (
                                    <div className="profile order-[-2]">
                                        <div className="profile-img h-full w-[20px] flex items-center cursor-pointer " onClick={TooglePoupProfile}>
                                            <CgProfile className=" text-3xl !w-[180px] !h-[180px] " style={{ fontSize: "50px" }} />
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
                                <Image priority src={data.header_logo} width={120} height={20}
                                    className="" alt="Logo" />
                            </Link>
                        )}
                        {cateData?.slice(0, 1).map((category, index) => {
                            return (
                                <div key={index} className=" header-category group relative flex gap-x-2 rounded-lg  hover:bg-gray-50">
                                    <div className="mt-1 flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <img src={category.image} alt={category.image} className="size-6" width={100} height={100} />
                                    </div>
                                    <div>
                                        <a href={category.link || "#"} className="font-semibold text-gray-900">
                                            <div className="flex justify-center pt-3">
                                                <span className="pb-1 text-center font-semibold">
                                                    {language === "en"
                                                        ? category.name
                                                        : category?.translations?.map((translation, i) => (
                                                            <span key={i}>{translation.name}</span>
                                                        ))}
                                                </span>
                                            </div>
                                            <span className="absolute "></span>
                                        </a>
                                        {category.description && <p className="mt-1 text-gray-600">{category.description}</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* location section */}
                <div className="container mx-auto px-3 sm:px-0">
                    {isPageScrolled ? "LocationComp" : <LocationComp />}
                    <div className={`flex-1 mt-3  rounded-md ${isPageScrolled ? "  fixed  w-[90%]  container mx-auto" : ""} top-0 bg-white z-50 shadow-md`}>
                        <div className={`relative container mx-auto  ${isPageScrolled ? " px-0  container":""} `}>
                        <input className={`${isRtl?"custom-padding":"custom-padding"} search-input-item w-full   bg-transparent placeholder:text-[17px] md:placeholder:text-xl placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" `} 

                                placeholder={t('searchItem')}
                            />
                            <button className="search-button"
                                type="submit" >
                                <IoSearchOutline className='text-2xl' />
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
