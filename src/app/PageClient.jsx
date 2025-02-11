"use client";
import Image from "next/image";
import dynamic from 'next/dynamic';
import Electronics from "../../public/icons/electronics.svg";
import Property from "../../public/icons/property.svg";
import JsonLd from "@/app/_seo/JsonLd";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useCallback } from "react";
import { setCateData } from "@/store/slices/categorySlice";
import Link from "next/link";
import axios from "axios";
import { CategoryData } from "@/store/slices/categorySlice";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchAllProducts, fetchFeaturedSections } from '@/store/slices/productsSlice';
import { setJsonLdData } from "@/store/slices/SeoJsonLdSlice";
const CatgoriesMin = dynamic(() => import('@/components/categories/CatgoriesMin'), { ssr: false });

export default function Home() {
  const dispatch = useDispatch();
  const { cateData, totalCatItems, catLastPage, catCurrentPage } = useSelector((state) => state.Category);
  const { productsData, featuredSections } = useSelector((state) => state.Products);

  useEffect(() => {
    if (cateData.length === 0) {
      dispatch(fetchCategories());
    }
    if (productsData.length === 0) {
      dispatch(fetchAllProducts());
    }
    if (featuredSections.length === 0) {
      dispatch(fetchFeaturedSections());
    }
  }, [dispatch, cateData.length, productsData.length, featuredSections.length]);

  const existingSlugs = useMemo(() => new Set(productsData.map(product => product.slug)), [productsData]);

  const featuredItems = useMemo(() => {
    const items = [];
    featuredSections?.forEach((section) => {
      section?.section_data?.slice(0, 4).forEach(item => {
        if (!existingSlugs.has(item.slug)) {
          items.push(item);
          existingSlugs.add(item.slug);
        }
      });
    });
    return items;
  }, [featuredSections, existingSlugs]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      ...cateData.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Thing",
          name: category?.name,
          url: `${process.env.NEXT_PUBLIC_WEB_URL}/category/${category?.slug}`
        }
      })),
      ...productsData.map((product, index) => ({
        "@type": "ListItem",
        position: cateData?.length + index + 1,
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
        position: cateData.length + productsData.length + index + 1,
        item: {
          "@type": "Product",
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
  }), [cateData, productsData, featuredItems]);

  useEffect(() => {
    if (cateData.length > 0 && productsData.length > 0 && featuredSections.length > 0) {
      dispatch(setJsonLdData(jsonLd));
    }
  }, [dispatch, cateData.length, productsData.length, featuredSections.length, jsonLd]);

  return (
    <>
      <div className="">
        <CatgoriesMin />
        {/* <Link href="/ads">test</Link> */}
      </div>
    </>
  );
}