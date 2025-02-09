'use client'
import { usePathname } from "next/navigation"
// import LandingPageHeader from "./LandingPageHeader"
import Header from "./Header"



const MainHeader = () => {
  const pathname = usePathname()
   
  return (
    <>
      {pathname === '/home' ? (
        <>ffff</>
        // <LandingPageHeader />
      )
        : (
          <Header />
        )}
    </>
  )
}

export default MainHeader