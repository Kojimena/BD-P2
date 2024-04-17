"use client";
import React from 'react'
import { useState, useEffect } from 'react'

const FormSign = ({usuario}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [signo, setSigno] = useState('Seleccionar signo')
    const [signos, setSignos] = useState([])
    const [compatibilidad, setCompatibilidad] = useState('')
    const [toggles, setToggles] = useState({
        toggle1 : false,
        toggle2 : false,
    })

    const fetchData = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/signs/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setSignos(data.zodiacalSign.map(sign => sign.nombre))
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCompatibilidad = (e) => {
        setCompatibilidad(e.target.value)
    }

    const handleToggle = (name) => {
        setToggles(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }))
        console.log(toggles)
    }
    
    const handleSubmitSign = async (e) => {
        e.preventDefault()
        const data = {
            "compartir": toggles.toggle2,
            "compatibilidad": parseInt(compatibilidad),
            "influencia": toggles.toggle1,
            "signo": signo,
            "usuario": usuario
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/signs/is`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Signo guardado')
        } else {
            const responseData = await response.json()
            console.log(responseData)
            console.error('Error al guardar signo')
        }
    }

    return (
    <div className="sm:col-span-3 glassmorph p-20 w-1/2">
        <span className="title">Signo Zodiacal</span>
        <div className="dropdown dropdown-bottom py-2 w-full">
            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{signo}</div>
                {isOpen && (
                    <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52 overflow-y-scroll h-40">
                    {signos.map((sign, index) => (
                        <li key={index}><a onClick={() => {setSigno(sign); setIsOpen(false);}}>{sign}</a></li>
                    ))}
                    </ul>
                )}
        </div>

        <div className="sm:col-span-3">
            <label className='label'>Cuánto de identificas con tu signo? [1-5]</label>
            <input className='inputStyle' type='number' placeholder='1' onChange={handleCompatibilidad}/>
        </div>

        <label className="cursor-pointer gap-4 flex justify-start items-center">
            <span className="label">Tu horoscopo influencia en tus decisiones?</span>
            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle1')} />
        </label>

        <label className="cursor-pointer gap-4 flex justify-start items-center">
            <span className="label">Te gusta compartir su signo?</span>
            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle2')} />
        </label>

        <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full" onClick={handleSubmitSign}>Listo</button>
    </div>
    )
}

export default FormSign