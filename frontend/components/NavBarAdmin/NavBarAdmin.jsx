"use client"
import React, {useState} from 'react'
import { useRouter } from "next/navigation"
import { IoMdLogOut } from "react-icons/io"



const NavBarAdmin = () => {
  const [showNav , setShowNav] = useState(false)
  const router = useRouter();
  return (
    <header className="bg-white p-4 fixed inset-x-0 top-0 z-50 shadow-md mb-20 lg:mb-0">
      <nav className=" mx-auto lg:ml-auto lg:w-full flex flex-wrap items-center justify-between">
        <div className="w-full lg:w-auto lg:flex-grow lg:flex lg:items-center">
          <button className="font-montserrat text-kaqui text-4xl lg:hidden w-full flex justify-end" onClick={() => setShowNav(!showNav)}>{showNav ? 'X' : '☰'}</button>
          {
            setShowNav &&
            <ul className={`flex flex-col lg:flex-row list-none lg:ml-auto ${showNav ? '' : 'hidden'} lg:hidden`}>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  onClick={() => router.push('/admin')}
                >
                  Products
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  onClick={() => router.push('/admin-clients')}
                >
                  Clients
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  onClick={() => router.push('/admin-promotions')}
                >
                  Promotions
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  onClick={() => router.push('/admin-orders')}
                >
                  Orders
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  href="#"
                  onClick={() => router.push('/admin-stats')}
                >
                  Stats
                </button>

              </li>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  onClick={() => router.push('/charts')}
                >
                  Charts
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75 bg-kaqui text-white rounded-md"
                  onClick={() => router.push('/store')}
                >
                  My store
                </button>
              </li>
              <li className="nav-item">
                <IoMdLogOut className="font-montserrat text-brown text-2xl cursor-pointer mt-4" onClick={() => router.push('/login')} />
              </li>
              
            </ul>

          }
          <ul className="lg:flex flex-col lg:flex-row list-none lg:ml-auto hidden items-center">
            <li className="nav-item">
              <button
                className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                onClick={() => router.push('/admin')}
              >
                Products
              </button>
            </li>
            <li className="nav-item">
              <button
                className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                onClick={() => router.push('/admin-clients')}
              >
                Clients
              </button>
            </li>
            <li className="nav-item">
              <button
                className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                onClick={() => router.push('/admin-promotions')}
              >
                Promotions
              </button>
            </li>
            <li className="nav-item">
              <button
                className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                onClick={() => router.push('/admin-orders')}
              >
                Orders
              </button>
            </li>
            <li className="nav-item">
              <button
                className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                onClick={() => router.push('/admin-stats')}
              >
                Stats
              </button>

            </li>
            <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:opacity-75"
                  onClick={() => router.push('/charts')}
                >
                  Charts
                </button>
              </li>
            <li className="nav-item">
                <button
                  className="font-montserrat px-3 py-2 flex items-center text-l uppercase font-bold leading-snug text-black hover:bg-brown bg-kaqui text-white rounded-md"
                  onClick={() => router.push('/store')}
                >
                  My store
                </button>
              </li>
              <li className="nav-item">
                <IoMdLogOut className="ml-4 font-montserrat text-brown text-2xl cursor-pointer" onClick={() => router.push('/login')} />
              </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default NavBarAdmin
