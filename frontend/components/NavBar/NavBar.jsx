"use client";
import { IoMdLogOut } from "react-icons/io";
import { useRouter } from "next/navigation"
import { FaShoppingCart } from "react-icons/fa";
import { GiCoffeeBeans } from "react-icons/gi";



const NavBar = () => {
  const router = useRouter();
  return (
    <header className="font-montserrat bg-white p-4 fixed inset-x-0 top-0 z-50 shadow-md mb-20 lg:mb-0">
      <div className="flex items-center justify-between w-full">
        <GiCoffeeBeans className="text-kaqui text-4xl cursor-pointer" onClick={() => router.push('/store')} />
          <div className="flex items-center gap-8">
          <FaShoppingCart className="font-montserrat text-brown text-2xl cursor-pointer" onClick={() => router.push('/cart')} />
          <IoMdLogOut className="font-montserrat text-brown text-2xl cursor-pointer" onClick={() => router.push('/login')} />
          </div>
      </div>
    </header>
  )
}

export default NavBar
