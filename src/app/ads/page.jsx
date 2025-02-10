"use client";
import { useState } from "react";
import Layout from "../Layout/MainLayout";

export default function DropdownMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   const ToggleMenu=()=>{
    setIsMenuOpen((prev) => {
      const newState = !prev; 
      document.body.style.overflow = newState ? "hidden" : "auto";
      return newState;
    });
    
  }
  return (
    <Layout>
    <div className="relative w-full block md:hidden">
      <button
        onClick={ToggleMenu}
        className="p-2 bg-gray-200 rounded-md focus:outline-none flex items-center gap-2"
      >       
       <span>Menu</span>
      </button>
      <div
        className={`absolute left-0  w-full bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "min-h-[100vh] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <ul className="flex flex-col divide-y divide-gray-300">
          <li className="p-3 hover:bg-gray-100 cursor-pointer">Home</li>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">Services</li>
          <li className="p-3 hover:bg-gray-100 cursor-pointer">Contact</li>
        </ul>
      </div>
    </div>
    </Layout>

  );
}
