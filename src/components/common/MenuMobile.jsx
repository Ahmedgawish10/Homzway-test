"use client";
import { useState } from "react";

export default function DropdownMenu({isMenuOpen,handleToggleMenu}) {

  return (

      <div
        className={`fixed z-50  block md:hidden  top-[60px]  left-0  w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "min-h-[100vh] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <ul className="flex flex-col divide-y divide-gray-300  ">
          <li className="p-3 hover:bg-gray-100 cursor-pointer">Home</li>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">Services</li>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">Contact</li>
        </ul>
      </div>
  );
}
