// import { Geist, Geist_Mono } from "next/font/google";
import { StoreProvider } from "../../store/StoreProvider";
import localFont from 'next/font/local'
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

//local fonts for optmized when preloading pages
const fonts = localFont({
  src: [
    {
      path: '../../public/fonts/ProximaNova-Regular.otf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-proxima-nova', 
})
export const metadata = {
  title: "Homzway",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>

      
      <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${'AIzaSyDNMOkBx54Xdt8Jp4AQKDHVH8MpDn0NhLY'}&libraries=places&loading=async`}></script>

      </Head>


      <body className={` ${fonts.variable} antialiased`}>
        <StoreProvider>
        <Toaster position="top-center" reverseOrder={false} />
          {children}
          </StoreProvider>
      </body>
    </html>
  );
}
