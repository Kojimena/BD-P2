"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"


const PeoplePage = () => {
    const router = useRouter()
  const [people, setPeople] = useState([])

  const fetchPeople = async () => {
    const response = await fetch(`https://super-trixi-kojimena.koyeb.app/users/recommendation/${localStorage.getItem('user')}`)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      setPeople(data.matches)
    } else {
      console.error('Error al obtener los usuarios')
    }
  }

    useEffect(() => {
        fetchPeople()
    }
    , [])


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
        <span className="font-montserrat text-bold text-2xl text-white font-normal">Haz click en el usuario para ver su perfil</span>
        <div className="flex flex-wrap py-10 gap-10">
            {console.log(people)}
            {
                Object.keys(people).map((key) => {
                    return (
                        <div className="flex flex-col items-center" key={key}>
                            <div className='flex justify-between glassmorph rounded-lg p-4 flex-col cursor-pointer w-60 relative' onClick={() => router.push(`/profile/${key}`)}>
                                <span className='text-white font-bold text-2xl'>{key}</span>
                                <span className='bg-kaqui text-white font-bold text-2xl absolute top-0 right-0 rounded-xl py-2 px-4'>{people[key]}</span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        </div>
    </div>
  )
}

export default PeoplePage