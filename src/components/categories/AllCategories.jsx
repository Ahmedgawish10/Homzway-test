"use client";
import { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, translatedData } = useSelector((state) => state.Language);
  const { cateData } = useSelector((state) => state.Category, shallowEqual);

  const togglePopupCategories = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);
console.log(cateData);

  return (
    <div className="relative">
      <span onClick={togglePopupCategories} className="px-5 cursor-pointer">
        {translatedData?.file_name?.allCategories}
      </span>

      {isOpen && (
        <div className="fixed w-[100vw] top-0 right-0 z-20 h-[100vh] flex">
          <div className="w-screen flex-auto overflow-y-auto rounded-[40px] bg-white text-sm ring-1 shadow-lg ring-gray-900/5">
            <div className="p-4">
              <h2 onClick={togglePopupCategories} className="text-[26px] cursor-pointer">
                <IoClose />
              </h2>
              {cateData?.map((category, index) => {
                return (
                  <div key={index} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
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
                        <span className="absolute inset-0"></span>
                      </a>
                      {category.description && <p className="mt-1 text-gray-600">{category.description}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
