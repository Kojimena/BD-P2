"use client"
import { useState, useEffect } from 'react'
import { useRouter } from "next/router";

const Teacher = () => {
    const router = useRouter()
    const [carrera, setCarrera] = useState('Selecciona tu carrera')
    const [careers, setCareers] = useState([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        fetch('`https://super-trixi-kojimena.koyeb.app/users/careers`')
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw new Error('Error al obtener las carreras')
                }
            })
            .then(data => {
                setCareers(data.careers.map(career => career.nombre_carrera))
            })
            .catch(error => console.error(error))
    }, [])

    return (
        <div className="w-full min-h-screen isolate pt-20 bg-black">
            <h1 className="text-center text-4xl font-montserrat font-bold text-white">Sobre tu carrera</h1>
            <form className='m-20 flex justify-center items-center flex-col'>
                <div className='flex flex-col w-full justify-start'>
                    <div className="sm:col-span-3">
                        <div className="dropdown dropdown-bottom py-2 w-full">
                        <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{carrera}</div>
                        {isOpen && (
                            <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                            {careers.map((career, index) => (
                                <li key={index}><a onClick={() => {setCarrera(career); setIsOpen(false);}}>{career}</a></li>
                            ))}
                            </ul>
                        )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Teacher