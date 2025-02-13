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


export default async function RootLayout({ children }) {
 
  return (
    <html lang="en">
      <Head>
        {/* just for testing now */}
        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${"AIzaSyDNMOkBx54Xdt8Jp4AQKDHVH8MpDn0NhLY"}&libraries=places&loading=async`}></script>
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
