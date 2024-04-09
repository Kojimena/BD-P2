"use client";
import React from 'react'
import { useRouter } from "next/navigation"



const PopCart = ({product}) => {
    const router = useRouter();

    const continueShopping = () => {
        router.push('/store');
    }

    const goToCart = () => {
        router.push('/cart');
    }

  return (
    <div className="fixed top-5 right-5 md:right-10 lg:right-20 xl:right-12 2xl:right-80 bg-white shadow-lg p-4 rounded-lg max-w-sm w-full z-50">
      <h2 className="text-lg font-semibold">Carrito de Compras</h2>
      <p className = "font-montserrat">Se ha agregado {product.name} al carrito</p>
        <img src={product.url} alt={product.nombre} className="w-20 h-20 object-cover rounded-md" />
        <div className="flex flex-col justify-evenly items-center">
            <button className="font-montserrat w-full mt-4 px-4 py-2 bg-brown text-white rounded transition duration-300" onClick={continueShopping}>Go to store</button>
            <button className="font-montserrat w-full mt-4 px-4 py-2 border-2 border-kaqui text-kaqui rounded hover:bg-kaqui hover:text-white transition duration-300" onClick={goToCart}>Go to cart</button>
        </div>
    </div>
  )
}

export default PopCart