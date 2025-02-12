"use client";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import LangIcon from "../../../public/icons/lang.svg";

import { SiMicrodotblog, SiWhatsapp } from "react-icons/si";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { TbFileSpreadsheet } from "react-icons/tb";
import { LuCamera,LuHeart } from "react-icons/lu";
import { FaFacebookF } from "react-icons/fa6";
import { BsInstagram, BsTwitterX } from "react-icons/bs";
import { LiaSignOutAltSolid,LiaAdSolid } from "react-icons/lia";
import { FiUser } from "react-icons/fi"
import { IoMdNotificationsOutline } from "react-icons/io"
import { BiChat, BiDollarCircle, BiReceipt } from "react-icons/bi"
import {MdOutlineRateReview } from "react-icons/md"
import { RiLogoutCircleLine } from "react-icons/ri"

import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import useLanguage from "@/hooks/useLanguage";
import { userLogout } from '@/store/slices/authSlice';
import { saveOfferData } from "@/store/slices/offerSlice";
import { t } from "@/utils";
import FirebaseData from '@/config/firebase';

export default function DropdownMenu({ isMenuOpen, setShowLoginPopup }) {
  const dispatch = useDispatch()
  const { signOut } = FirebaseData();
  const { language, translatedData } = useSelector((state) => state.Language);
  const { handleLanguageChange } = useLanguage();
  const { userVerfied, userData } = useSelector((state) => state.Auth)
  // userListsProfile
  const userListsProfile = [
    {
      key: 1,
      href: '/profile/edit-profile',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><FiUser size={16} /></span>
          <span>{t('myProfile')}</span>
        </div>
      )
    },
    {
      key: 2,
      href: '/notifications',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><IoMdNotificationsOutline size={16} /></span>
          <span>{t('notification')}</span>
        </div>
      )
    },
    {
      key: 3,
      href: '/chat',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><BiChat size={16} /></span>
          <span>{t('chat')}</span>
        </div>
      )
    },
    {
      key: 4,
      href: '/user-subscription',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><BiDollarCircle size={16} /></span>
          <span>{t('subscription')}</span>
        </div>
      )
    },
    {
      key: 5,
      href: '/ads',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><LiaAdSolid size={16} /></span>
          <span>{t('ads')}</span>
        </div>
      )
    },
    {
      key: 6,
      href: '/favourites',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><LuHeart size={16} /></span>
          <span>{t('favorites')}</span>
        </div>
      )
    },
    {
      key: 7,
      href: '/transactions',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><BiReceipt size={16} /></span>
          <span>{t('transaction')}</span>
        </div>
      )
    },
    {
      key: 8,
      href: '/reviews',
      label: (
        <div className="profDropIconCont flex gap-2 items-center ">
          <span><MdOutlineRateReview size={16} /></span>
          <span>{t('myReviews')}</span>
        </div>
      )
    }
  ]
  // handle logout 
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
        // router.push('/')
        saveOfferData([]);
        toast.success(t('signOutSuccess'));
      } else {
        // toast.error(t('signOutCancelled'));
      }
    });
  };
  // global class for each item in menu Link
  const menuItemClass = "p-3 hover:bg-gray-100 cursor-pointer text-[18px] flex gap-2 items-center";
  return (
    <div className={`fixed z-10 block md:hidden top-[50px] left-0 w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "min-h-[100vh] opacity-100 py-2" : "max-h-0 opacity-0 py-0"}`}>
      <ul className="flex flex-col divide-y divide-gray-300 h-[70vh] overflow-auto ">
        <li className={menuItemClass}> <LuCamera /> {translatedData?.file_name?.buySell}</li>
        {userData && (
          <>
          {userListsProfile.map(({ key, href, label }) => (
              <li className={menuItemClass} key={key}>
                <a key={key} href={href}
                  className="flex items-center gap-2  " role="menuitem">
                  {label}
                </a>
              </li>
          ))}
        </>
        )}

        <li className={menuItemClass}><TbFileSpreadsheet /> {translatedData?.file_name?.myAds}</li>
        <li className={menuItemClass}> <SiMicrodotblog /> {translatedData?.file_name?.blog}</li>
        <li className={menuItemClass} onClick={() => handleLanguageChange(language)}>
          <Image src={LangIcon} alt="Language Icon" width={24} height={24} />
          <span>{language === "en" ? "ألعربيه" : "English"}</span>
        </li>
        {!userData ? <li className="p-3 hover:bg-gray-100 cursor-pointer text-[18px] flex justify-center gap-2">
          <button onClick={() => setShowLoginPopup(true)}
            className="font-medium text-[1.2rem] cursor-pointer bg-red-700 w-[80%] text-center rounded-md py-3 text-white" >
            {translatedData?.file_name?.login}
          </button>
        </li> :
          <li className={menuItemClass}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2  "
              role="menuitem"
            >
              <LiaSignOutAltSolid className="text-2xl" />
              {t('signOut')}
            </button>
          </li>
        }
      </ul>

      {/* Follow Us section */}
      <div className="py-4">
        <h1 className="text-center mb-3">Follow Us</h1>
        <div className="bg-white w-full h-auto flex items-center justify-center gap-2 flex-wrap">
          {[
            { icon: <FaFacebookF />, link: "#" },
            { icon: <BsInstagram />, link: "#" },
            { icon: <BsTwitterX />, link: "#" },
            { icon: <SiWhatsapp />, link: "#" }
          ].map(({ icon, link }, index) => (
            <a
              key={index}
              href={link}
              className="p-2 rounded-lg flex items-center border border-gray-300 justify-center transition-all duration-500 hover:border-gray-100 hover:bg-gray-100"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
