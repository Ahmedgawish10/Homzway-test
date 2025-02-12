"use client";
import React, { memo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { handleFirebaseAuthError, t } from "@/utils";
import AllCategories from "@/components/categories/AllCategories"
function CatgoriesMin() {
    const { cateData } = useSelector((state) => ({ cateData: state.Category.cateData }), shallowEqual);
    const { productsData } = useSelector((state) => state.Products);
    const { language, translatedData } = useSelector((state) => state.Language);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 320,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };


    return (
        <div className="catgoriesMin-lg border-t border-slate-200 py-3">
            <div className="container mx-auto px-3">
                <div className="hidden sm:flex justify-between gap-2">
                    {cateData?.slice(0, 5).map((category, index) => {
                        const categoryProducts = productsData?.filter((product) => product.category.name === category.name);
                        return (
                            <div className={`cursor-pointer w-full relative flex-1 ${categoryProducts.length === 0 ? "" : "group"} ${index >= 3 ? "hidden md:block" : ""}`}
                                key={index}>
                                <div className=" flex justify-center">
                                    <span className=" text-xl  box-border border-b-2 border-white hover:text-red-600 hover:border-b-2 pb-1 hover:border-cyan-700 line-clamp-1 text-center">
                                        {language === "en" ? category.name : category?.translations?.map((translation, i) => (
                                            <span key={i}>
                                                {translation.name}
                                            </span>
                                        )
                                        )}
                                    </span>
                                </div>
                                  {/* overlay sub categories */}
                                {categoryProducts.length > 0 && (
                                    <ul className="hidden absolute w-auto left-0 top-[30px] bg-white shadow-md p-2 space-y-1 group-hover:block">
                                        <div className="text-xl line-clamp-1">
                                            Subcategories1
                                        </div>
                                        <div className="text-xl line-clamp-1">
                                            Subcategories2
                                        </div>
                                        <div className="text-xl line-clamp-1">
                                            Subcategories3
                                        </div>
                                        {categoryProducts.map((product) => (
                                            <li key={product.id} className="text-sm text-gray-600" >
                                                {product.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )})}
                </div>
                {/* catgory style for tablets and less screens*/}
                <div className="sm:hidden catgories-mobile overflow-hidden bg-red-000 py-[30px]">
                    <h2 className="text-[18px] pb-6 flex justify-between">
                        <span> {t('popularCategories')}</span>
                        <AllCategories />
                    </h2>
                    <div className=" container mx-auto ">
                        <Slider {...settings}>
                            {cateData
                                ?.slice(0, 5)
                                .map((category, index) => {
                                    return (
                                        <div className={`cursor-pointer w-full relative flex-1 `}
                                            key={index}>
                                            <div className="img-cat flex justify-center  group ">
                                                <div className="rounded-full w-[120px] h-[120px] border hover:border-gray-700 transition-all border-gray-300 p-2 ">
                                                    <img src={category?.image} className="rounded-full w-[100px] h-[100px] " />
                                                </div>
                                            </div>
                                            <div className=" flex justify-center pt-3 ">
                                                <span className="  pb-1 text-center font-semibold ">
                                                    {language === "en"
                                                        ? category.name
                                                        : category?.translations?.map(
                                                            (translation, i) => (
                                                                <span key={i}>
                                                                    {translation.name}
                                                                </span>
                                                            )
                                                        )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(CatgoriesMin);