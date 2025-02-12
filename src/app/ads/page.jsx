"use client";
import { useState } from "react";
import MainLayout from "../Layout/MainLayout";
const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MainLayout>
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-x-1 text-sm font-semibold text-gray-900"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Solutions</span>
        <svg
          className="size-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm ring-1 shadow-lg ring-gray-900/5">
            <div className="p-4">
              555555
            </div>
          </div>
        </div>
      )}
    </div>
    </MainLayout>
  );
};



export default DropdownMenu;
