'use client'
import React, { useEffect, useState } from 'react'
import SeachLocation from "@/components/common/SeachLocationInput";
import { IoIosArrowDown } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import { useDispatch, useSelector } from 'react-redux';
import CurrentLocationMaps from "@/components/common/CurrentLocationMaps";

export default function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useSelector((state) => state.Language)
    const [currentLocation, setCurrentLocation] = useState("")
    const [IsLocationModalOpen, setIsLocationModalOpen] = useState("")
    const userLocationFun = (userLoaction) => {
        setCurrentLocation(userLoaction)
    }

    useEffect(() => {
        setCurrentLocation(language == "ar" ? "مصر" : "Egypt")
    }, [language]);
    // console.log("ll",language);
    const userLocationFun22 = (userLoaction) => {
        setCurrentLocation(userLoaction)
    }

    return (
        <div className="relative inline-block text-left w-full">
            <div>
                <button
                    type="button"
                    className="flex relative justify-between w-full  gap-x-1.5 rounded-md px-3 py-4 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={` ${language == "ar" ? "absolute top-1/2  right-5 transform -translate-x-1/2 -translate-y-1/2" : "absolute top-1/2  left-5 transform -translate-x-1/2 -translate-y-1/2"}  text-2xl text-red-600`}><GrLocation /></span>
                    <span className={` ${language == "ar" ? "ps-12" : "px-6"} text-xl `}>  {currentLocation}</span>
                    {isOpen ? <IoIosArrowDown className="rotate-[180deg] text-2xl" /> : <IoIosArrowDown className="text-2xl" />}
                </button>
            </div>

            {isOpen && (
                <div
                    className="absolute right-[0px] z-10 w-full  origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden transition ease-out duration-100 transform opacity-100 scale-100"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex="-1"
                >
                    <div className="py-1" role="none">
                        <form method="POST" action="#" role="none">
                            <SeachLocation userLocationFun={userLocationFun} />
                            <div className="mt-5 hidden ">
                                <CurrentLocationMaps IsLocationModalOpen={IsLocationModalOpen} onClose2={() => setShowLoginPopup(false)} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
