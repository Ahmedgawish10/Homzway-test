'use client'
import { usePathname } from "next/navigation"
// import LandingPageHeader from "./LandingPageHeader"
import Header from "./Header"



const MainHeader = () => {
  const pathname = usePathname()
   
  return (
    <div className="sm:mb-[90px]" >
      {pathname === '/home' ? (
        <>ffff</>
        // <LandingPageHeader />
      )
        : (
          <Header />
        )}
    </div>
  )
}

export default MainHeader