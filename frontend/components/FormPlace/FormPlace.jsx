import React from 'react'
import { useState, useEffect } from 'react'

const FormPlace = ({type, places, usuario}) => {

    const [categoria, setCategoria] = useState(0)
    const [cuando, setCuando] = useState('2021-10-10')
    const [place, setPlace] = useState('Seleccionar lugar')
    const [rating, setRating] = useState(5)
    const [isOpen, setIsOpen] = useState(false)

    const handleCategoria = (e) => {
        setCategoria(e.target.value)
    }

    const handleCuando = (e) => {
        setCuando(e.target.value)
    }

    const handleRating = (e) => {
        setRating(e.target.value)
    }

    const handleSubmitPlaceVisited = async (e) => {
        e.preventDefault()
        const data = {
            "categoria": categoria,
            "cuando": cuando,
            "lugar": place,
            "rating": parseInt(rating),
            "usuario": usuario
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/places/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Lugar visitado guardado')
        } else {
            console.error('Error al guardar lugar visitado')
        }
    }
        

    return (
    <div className="sm:col-span-3 glassmorph p-20 w-1/2">
                        <span className="title">{type === 'visited' ? 'Lugar visitado' : 'Lugar que te disgusta'}</span>
                        <div className="dropdown dropdown-bottom py-2 w-full">
                            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{place}</div>
                                {isOpen && (
                                    <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52 overflow-y-scroll h-40">
                                    {places.map((place, index) => (
                                        <li key={index}><a onClick={() => {setPlace(place); setIsOpen(false);}}>{place}</a></li>
                                    ))}
                                    </ul>
                                )}
                        </div>
                        <div className="sm:col-span-3">
                            <label className='label'>Categoria</label>
                            <div className="form-control" onChange={handleCategoria}>
                                    <select className="select select-bordered">
                                    <option>Selecciona una categoría</option>
                                    <option>Familiar</option>
                                    <option>Amigos</option>
                                    <option>Trabajo</option>
                                    <option>Estudio</option>
                                    <option>Pet friendly</option>
                                    </select>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label className='label'>Cuándo lo visitó?</label>
                            <input className='inputStyle' type="date" placeholder='date' onChange={handleCuando} />
                        </div>
                        <div className="sm:col-span-3">
                            <label className='label'>Rating [1-5]</label>
                            <input className='inputStyle' type='number' placeholder='1-5' onChange={handleRating} />
                        </div>
            <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full mt-10" onClick={handleSubmitPlaceVisited}>Listo</button>
    </div>
    )
}

export default FormPlace