"use client"
import React, { useState } from 'react'

const PeoplePage = () => {
  const [people, setPeople] = useState([
    { name: 'Juan', lastName: 'Perez', career: 'Ingeniería' },
    { name: 'Ana', lastName: 'Gomez', career: 'Medicina' },
  ])

  return (
    <div className="w-full min-h-screen isolate pt-10 bg-black">
        <h2 className="font-montserrat text-bold text-4xl text-kaqui">Personas que pueden ser de tu interés</h2>
        <div className="grid grid-cols-3 p-10 gap-5">
            {people.map((person, index) => (
                <div key={index} className="p-5">
                    <h3 className="font-montserrat text-bold text-white">{person.name} {person.lastName}</h3>
                    <p className="font-montserrat text-white">Carrera: {person.career}</p>
                    <button className="mt-2 font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none">
                        Ver perfil
                    </button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default PeoplePage