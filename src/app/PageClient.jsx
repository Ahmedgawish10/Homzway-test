"use client";
import Image from "next/image";
import Test from "@/components/test";
import Electronics from "../../public/icons/electronics.svg";
import Property from "../../public/icons/property.svg";
import JsonLd from "@/app/_seo/JsonLd";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import { setCateData } from "@/store/slices/categorySlice";
import Link from "next/link";
import axios from "axios";
import { CategoryData } from "@/store/slices/categorySlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchAllProducts, fetchFeaturedSections } from '@/store/slices/productsSlice';
import { setJsonLdData } from "@/store/slices/SeoJsonLdSlice";

export default function Home() {
  const dispatch = useDispatch();
  //   const AllCaetgories = useSelector(CategoryData);
  const { cateData, totalCatItems, catLastPage, catCurrentPage } = useSelector((state) => state.Category);
  const { productsData, featuredSections } = useSelector((state) => state.Products);

  useEffect(() => {
    //fetch all categories and saved it to sote 
    cateData?.length > 0 ? console.log(" all catgories from store to reduce requests on server", cateData) :
      dispatch(fetchCategories())
    //fetch all products and saved it to sote 
    productsData?.length > 0 ? console.log(" all productsData from store to reduce requests on server", productsData) :
      dispatch(fetchAllProducts())
    //fetch all featuredSections and saved it to sote 
    featuredSections?.length > 0 ? console.log(" all FeaturedSections data from store to reduce requests on server", featuredSections) :
      dispatch(fetchFeaturedSections())

  }, [])
   
  const existingSlugs = new Set(productsData.map(product => product.slug));
  let featuredItems = [];
  featuredSections?.forEach((section) => {
    //   section?.section_data?.slice(0, 4).forEach(item => {
    //        console.log(item);

    // });

    section?.section_data?.slice(0, 4).forEach(item => {
      if (!existingSlugs.has(item.slug)) {
        featuredItems.push(item);
        existingSlugs.add(item.slug);  // Mark this item as included
      }
    });
  });
   //seo of homzway json 
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      ...cateData.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing", // No "Category" type in Schema.org
          name: category?.name,
          url: `${process.env.NEXT_PUBLIC_WEB_URL}/category/${category?.slug}`
        }
      })),
      ...productsData.map((product, index) => ({
        "@type": "ListItem",
        position: cateData?.length + index + 1, // Ensure unique positions
        item: {
          "@type": "Product",
          name: product?.name,
          productID: product?.id,
          description: product?.description,
          image: product?.image,
          url: `${process.env.NEXT_PUBLIC_WEB_URL}/product-details/${product?.slug}`,
          category: product?.category?.name,
          "offers": {
            "@type": "Offer",
            price: product?.price,
            priceCurrency: "USD",
          },
          countryOfOrigin: product?.country
        }
      })),
      ...featuredItems.map((item, index) => ({
        "@type": "ListItem",
        position: cateData.length + productsData.length + index + 1, // Ensure unique positions
        item: {
          "@type": "Product", // Assuming items from featured sections are products
          name: item?.name,
          productID: item?.id,
          description: item?.description,
          image: item?.image,
          url: `${process.env.NEXT_PUBLIC_WEB_URL}/product-details/${item?.slug}`,
          category: item?.category?.name,
          "offers": {
            "@type": "Offer",
            price: item?.price,
            priceCurrency: "USD",
          },
          countryOfOrigin: item?.country
        }
      }))
    ]
  };
   //set seo of website to store when it ready
  useEffect(() => {
    if (cateData.length > 0 && productsData.length > 0 && featuredSections.length > 0) {
      dispatch(setJsonLdData(jsonLd));
    }
  }, [cateData.length, productsData.length, featuredSections.length]);
  
  return (
    <>
      <div className="">
        {/* <Test /> */}
        {/* <h2 onClick={()=>dispatch(fetchCategories())}>ggggggggggg</h2> */}
        {/* <Image src={Electronics} alt=""  /> */}
        <Link href="/ads">test</Link>
      </div>
    </>
  );
}
