"use client"; 
import React, { memo } from "react";
import Link from "next/link"
import { useSelector, shallowEqual } from "react-redux";
import { IoIosArrowForward } from "react-icons/io";
import { t } from "@/utils/index";

const HomeCategories = () => {
    const { cateData } = useSelector((state) => ({ cateData: state.Category.cateData }),shallowEqual );
    const { productsData } = useSelector((state) => state.Products);
    const { language, translatedData } = useSelector((state) => state.Language);

    // func to filter products by category 
    const getProductsByCategory = (categoryId) => {
        return productsData?.filter((product) => product.category_id === categoryId);
    };

    return (
        <div className="home-categories py-8 ">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-start mb-8">
                    <span> {t('popularCategories')}</span>
                </h2>
                 {/* all categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cateData?.map((category) => (
                        <div key={category.id} className=" overflow-hidden hover:shadow-lg transition-shadow duration-300" >
                            {/* Category Image */}
                            <div className="box-cat flex items-center gap-3 ">
                                <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded-[50%] " />
                                {/* Category Name & Description */}
                                <div className=" flex justify-center">
                                    <span className=" sm:text-xl  text-start line-clamp-1 ">
                                        {language === "en" ? category.name : category?.translations?.map((translation, i) => (
                                            <span key={i}>
                                                {translation.name}
                                            </span>
                                        ))}
                                    </span>
                                </div>
                            </div>

                            {/* all sub categories */}
                            <div className="box-cat flex items-center gap-3 ">
                                <div className=" flex justify-center">
                                    <span className=" group sm:text-[16px] flex gap-2 items-center  text-start line-clamp-1  text-red-600 ">
                                    {language === "en" ? <span >{category.name}</span> : category?.translations?.map((translation, i) => (
                                            <span className="flex gap-2 items-center" key={i}>
                                                {translatedData?.file_name?.allItems} {language == "en" ? "in" : "في"}   {translation.name}
                                            </span>
                                        ))}
                                        {/* {language === "en" ? <Link href={`/category/${category.slug}`}>{category.name}</Link> : category?.translations?.map((translation, i) => (
                                            <Link href={`/category/${category.slug}`} className="flex gap-2 items-center" key={i}>
                                                {translatedData?.file_name?.allItems} {language == "en" ? "in" : "في"}   {translation.name}
                                            </Link>
                                        ))} */}
                                        <IoIosArrowForward  className={`${language=="ar"?"rotate-180 ":" "}`}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(HomeCategories);
