"use client"
import React, { useState } from 'react'
import { useRouter } from "next/navigation"


const PeoplePage = () => {
    const router = useRouter()
  const [people, setPeople] = useState([
    { name: 'Juan', lastName: 'Perez', career: 'Ingeniería' },
    { name: 'koji', lastName: 'Gomez', career: 'Medicina' },
  ])

  return (
    <div className="w-full isolate">
        <div className='flex justify-end items-center p-2'>
            <div className="avatar online">
                <div className="w-14 rounded-full cursor-pointer" onClick={() => router.push(`/profile/${localStorage.getItem('user')}`)}>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
                </div>
            </div>
        </div>
        <div className='flex justify-center items-center flex-col pt-10'>
        <h2 className="font-montserrat text-bold text-4xl text-kaqui font-bold">Mira tus matchs!</h2>
        <div className="flex flex-wrap py-10 gap-10">
            {people.map((person, index) => (
                <div key={index} className="p-5 glassmorph">
                    <h3 className="font-montserrat text-bold text-white">{person.name} {person.lastName}</h3>
                    <p className="font-montserrat text-white">Carrera: {person.career}</p>
                    <button className="mt-2 font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none" onClick={() => router.push(`/profile/${person.name}`)}>
                        Ver perfil
                    </button>
                </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default PeoplePage