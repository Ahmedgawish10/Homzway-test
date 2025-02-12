"use client"
import React, { useEffect, useState, useRef } from 'react'
import Slider from "react-slick";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { fetchMainSlider } from "@/store/slices/sliderSlice"
import Image from 'next/image'

export default function SimpleSlider() {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchMainSlider())
    }, []);
    const { cateData } = useSelector((state) => ({ cateData: state.Category.cateData }), shallowEqual);
    const { language, translatedData } = useSelector((state) => state.Language);
    const { slider } = useSelector((state) => state.Slider);
    console.log(slider)
    var settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <div className=" overflow-hidden h-[330px] ">

            <Slider {...settings} className='h-[300px] sm:container mx-auto '>
                {slider.map((sliderItem, index) => {
                    return (
                        <div className={`cursor-pointer w-full relative flex-1   `}
                            key={index}>
                            <div className="img-slider w-full flex justify-center  group ">
                                <div className="rounded-full p-2  w-full ">
                                    {/* <Image src={sliderItem.image}  alt="v" width={100} height={100} className=" object-cover w-full h-full " /> */}
                                    <Image src={sliderItem.image} width={983} height={300} alt={sliderItem.id} className="offer_slider_img  w-[100%] h-[300px] " />
                                </div>
                            </div>

                        </div>
                    );
                })}
            </Slider>

        </div>

    );
}

