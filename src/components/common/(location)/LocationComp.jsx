'use client'
import React, { useEffect, useState } from 'react'
import SeachLocation from "@/components/common/(location)/SeachLocationInput";
import { IoIosArrowDown } from "react-icons/io";
import { GrLocation } from "react-icons/gr";
import CurrentLocationMaps from "@/components/common/(location)/CurrentLocationMaps";
import { formatLocation } from '@/utils';
import { useDispatch, useSelector } from 'react-redux';
import { getCityData } from '@/store/slices/locationSlice';
import { saveLocationUser } from "@/store/slices/locationSlice";

export default function DropdownMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { language } = useSelector((state) => state.Language)
    const [currentLocation, setCurrentLocation] = useState("")
    const [IsLocationModalOpen, setIsLocationModalOpen] = useState("")
    const dispatch = useDispatch()
    const UserDatad = useSelector(getCityData)

    useEffect(() => {
      setCurrentLocation(UserDatad.country=="" &&language == "ar" ? "مصر" : "Egypt")  
    }, [language]);
    const c = useSelector(getCityData)
    
    return (
        <div className="relative inline-block text-left w-full">
            <div>
                <button
                    type="button"
                    className="flex relative justify-between w-full  gap-x-1.5 rounded-md px-3 py-2.5  font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={` ${language == "ar" ? " absolute top-1/2  right-5 transform -translate-x-1/2 -translate-y-1/2" : "absolute top-1/2  left-5 transform -translate-x-1/2 -translate-y-1/2"}  text-xl text-red-600`}><GrLocation /></span>
                    <span className={` text-[14px] truncate ${language == "ar" ? "ps-12" : "px-6"} `}>
                         {UserDatad?.lat!==""?formatLocation(UserDatad):currentLocation}
                         
                          </span>
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
                            <SeachLocation  />
                            <div className="mt-5 hidden ">
                                <CurrentLocationMaps IsLocationModalOpen={IsLocationModalOpen} />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
