// import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "../../store/StoreProvider";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import Footer from "@/components/common/Footer.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import axios from "axios";
//local fonts for optmized when preloading pages
const fonts = localFont({
  src: [
    {
      path: "../../public/fonts/ProximaNova-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-proxima-nova",
});
export const generateMetadata = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-system-settings`
    );
    const favicon = response?.data?.data?.favicon_icon
    const placeApiKey = response?.data?.data?.place_api_key
    return {
      icons: [{ url: favicon }],
      placeApiKey
    }
  } catch (error) {
    console.error("Error fetching MetaData:", error);
    return null;
  }
};

export default async function RootLayout({ children }) {
  const metadata = await generateMetadata(); 
  const placeFirbaseApiKey = metadata?.placeApiKey;

  return (
    <html lang="en">
      <Head>
        {/* just for testing now */}
        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${placeFirbaseApiKey}&libraries=places&loading=async`}></script>
      </Head>
      <body className={` ${fonts.variable} antialiased`}>
        <StoreProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {children}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
