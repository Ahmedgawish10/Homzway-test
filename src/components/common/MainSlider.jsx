"use client"
import React from "react";
import Slider from "react-slick";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Image from 'next/image'

export default function SimpleSlider() {
    const { cateData } = useSelector((state) => ({ cateData: state.Category.cateData }), shallowEqual);
    const { language, translatedData } = useSelector((state) => state.Language);
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className=" overflow-hidden h-[200px] bg-orange-700">

            <Slider {...settings}>
            {cateData
                                ?.slice(0, 5)
                                .map((category, index) => {
                                    return (
                                        <div className={`cursor-pointer w-full relative flex-1 `}
                                            key={index}>
                                            <div className="img-cat flex justify-center  group ">
                                                <div className="rounded-full  w-[100vw] h-[300px]p-2 ">
                                                    {/* <Image src={category?.image} width={100} height={100} className=" w-[100vw] h-[300px] " /> */}
                                                    <img src={category?.image} className=" w-[100vw] h-[300px] " />

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

    );
}