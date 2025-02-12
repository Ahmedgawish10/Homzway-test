"use client";
import {useSelector } from "react-redux";
import useLanguage from "@/hooks/useLanguage";
import Image from "next/image";
import LangIcon from "../../../public/icons/lang.svg";
import { SiMicrodotblog,  SiWhatsapp } from "react-icons/si";
import {IoChatbubbleEllipses } from "react-icons/io5";
import {TbFileSpreadsheet } from "react-icons/tb";
import {LuCamera } from "react-icons/lu";
import {FaFacebookF } from "react-icons/fa6";
import {BsInstagram, BsTwitterX } from "react-icons/bs";

export default function DropdownMenu({ isMenuOpen, setShowLoginPopup }) {
  const { language, translatedData } = useSelector((state) => state.Language);
  const { handleLanguageChange } = useLanguage();

  // global class for each item in menu Link
  const menuItemClass = "p-3 hover:bg-gray-100 cursor-pointer text-[18px] flex gap-2 items-center";
  return (
    <div  className={`fixed z-10 block md:hidden top-[50px] left-0 w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? "min-h-[100vh] opacity-100 py-2" : "max-h-0 opacity-0 py-0" }`}>
      <ul className="flex flex-col divide-y divide-gray-300">
        <li className={menuItemClass}> <LuCamera /> {translatedData?.file_name?.buySell}</li>
        <li className={menuItemClass}><TbFileSpreadsheet /> {translatedData?.file_name?.myAds}</li>
        <li className={menuItemClass}><IoChatbubbleEllipses /> {translatedData?.file_name?.chat}</li>
        <li className={menuItemClass}> <SiMicrodotblog /> {translatedData?.file_name?.blog}</li>
        <li className={menuItemClass} onClick={() => handleLanguageChange(language)}>
          <Image src={LangIcon} alt="Language Icon" width={24} height={24} />
          <span>{language === "en" ? "ألعربيه" : "English"}</span>
        </li>
        <li className="p-3 hover:bg-gray-100 cursor-pointer text-[18px] flex justify-center gap-2">
          <button onClick={() => setShowLoginPopup(true)}
            className="font-medium text-[1.2rem] cursor-pointer bg-red-700 w-[80%] text-center rounded-md py-3 text-white" >
            {translatedData?.file_name?.login}
          </button>
        </li>
      </ul>

      {/* Follow Us section */}
      <div className="py-8">
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
