import Image from "next/image";
import Electronics from "../../public/icons/electronics.svg";
import Property from "../../public/icons/property.svg";
import Link from "next/link";
import axios from "axios";
import PageClint from "@/app/PageClient";
import MainLayout from "./Layout/MainLayout";
import JsonLd from "@/app/_seo/JsonLd";
export const generateMetadata = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}seo-settings?page=home`
    );
    const home = response?.data;
    return {
      title: home?.title ? home?.title : process.env.NEXT_PUBLIC_META_TITLE,
      description: home?.description
        ? home?.description
        : process.env.NEXT_PUBLIC_META_DESCRIPTION,
      openGraph: {
        images: home?.image ? [home?.image] : [],
      },
      keywords: home?.keywords
        ? home?.keywords
        : process.env.NEXT_PUBLIC_META_kEYWORDS,
    };
  } catch (error) {
    console.error("Error fetching MetaData:", error);
    return null;
  }
};

export default function Home() {
  return (
    <>
      <JsonLd/>
      <MainLayout>
        <PageClint/>
      </MainLayout>
    </>
  );
}
