'use client'
import { usePathname } from "next/navigation"
// import LandingPageHeader from "./LandingPageHeader"
import Header from "./Header"

const MainHeader = () => {
  const pathname = usePathname()

  return (
    <div className="layout-header mb-3 " >
      {pathname === '/home' ? (
        <>...</>
        // <LandingPageHeader />
      ): (
          <Header />
        )}
    </div>
  )
}

export default MainHeader