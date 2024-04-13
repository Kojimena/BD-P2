import React from 'react'
import { useState, useEffect } from 'react'


const FormSong = ({type, usuario}) => {

    const [songs, setSongs] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [song, setSong] = useState('Seleccionar canción')
    const [desde, setDesde] = useState('2021-10-10')
    const [como, setComo] = useState('')
    const [frecuencia, setFrecuencia] = useState('')
    const [porque , setPorque] = useState('')
    const [intensidad, setIntensidad] = useState(0)

    const [toggles, setToggles] = useState({
        toggle1 : false,
        toggle2 : false,
        toggle3 : false,
        toggle4 : false
    })

    const handleToggle = (name) => {
        setToggles(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }))
        console.log(toggles)
    }


    const handleDesde = (e) => {
        setDesde(e.target.value)
    }

    const handleComo = (e) => {
        setComo(e.target.value)
    }

    const handleFrecuencia = (e) => {
        setFrecuencia(e.target.value)
    }

    const handlePorque = (e) => {
        setPorque(e.target.value)
    }

    const handleIntensidad = (e) => {
        setIntensidad(e.target.value)
    }


    useEffect(() => {
        fetchDataSongs()
    }, [])

    const fetchDataSongs = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setSongs(data.songs.map(song => song.nombre))
    }

    const handleSubmitSong = async (e) => {
        e.preventDefault()

    let data;

    switch (type) {
        case "likes":
            data = {
                "cancion": song,
                "como": como,
                "escucha": toggles.toggle1,
                "mas_artista": toggles.toggle2,
                "usuario" : usuario
            }
            break
        case "favorite":
            data = {
                "cancion": song,
                "como": como,
                "cuando": desde,
                "frecuencia": frecuencia,
                "usuario": usuario
            }
            break
        case "dislikes":
            data = {
                "cambiar": toggles.toggle3,
                "cancion": song,
                "intensidad": parseInt(intensidad),
                "motivo": porque,
                "usuario": usuario
            }
            break
        default:
            console.error('Tipo desconocido:', type)
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Canción guardada')
        } else {
            console.error('Error al guardar canción')
        }
    }

  return (
    <div className="sm:col-span-3 glassmorph p-20 w-1/2 ">
        {
            type === "likes" ? (
                <span className="title">Canción que te gusta</span>
            ) : null
        }
        {
            type === "favorite" ? (
                <span className="title">Canción favorita</span>
            ) : null
        }
        {
            type === "dislikes" ? (
                <span className="title">Canción que no te gusta</span>
            ) : null
        }
        <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{song}</div>
        {isOpen && (
            <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
            {songs.map((song, index) => (
                <li key={index}><a onClick={() => {setSong(song); setIsOpen(false);}}>{song}</a></li>
            ))}
            </ul>
        )}
        {
            type === "favorite" ? (
                <div className="dropdown dropdown-bottom py-2 w-full">
                     <div className="sm:col-span-3">
                            <label className='label'>Desde cuándo te gusta</label>
                            <input type="date" value={desde} onChange={handleDesde} className='inputStyle' />
                    </div>
                    <div className="sm:col-span-3">
                        <label className='label'>Cómo la conociste?</label>
                        <input type="text" value={como} onChange={handleComo} className='inputStyle' />
                    </div>
                    <div className="sm:col-span-3">
                        <select className="select select-bordered w-full max-w-xs my-2" onChange={handleFrecuencia}>
                            <option disabled selected>Frecuencia con la que la escuchas</option>
                            <option>Diario</option>
                            <option>Semanal</option>
                            <option>Mensual</option>
                        </select>
                    </div>
                </div>
            ) : null
        }
        {
            type === "likes" ? (
                <div className="dropdown dropdown-bottom py-2 w-full">
                    <div className="sm:col-span-3">
                        <label className='label'>Cómo la conociste?</label>
                        <input type="text" value={como} onChange={handleComo} className='inputStyle' />
                    </div>
                    <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">La escuchas seguido?</span>
                            <input type="checkbox" className="toggle toggle-success" checked={toggles.toggle1} onChange={() => handleToggle('toggle1')} />
                    </label>
                    <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Escuchas más de este artista?</span>
                            <input type="checkbox" className="toggle toggle-success" checked={toggles.toggle2} onChange={() => handleToggle('toggle2')} />
                    </label>
                </div>
            ) : null
        }
        {
            type === "dislikes" ? (
                <div className="dropdown dropdown-bottom py-2 w-full">
                    <div className="sm:col-span-3">
                        <label className='label'>Por qué no te gusta?</label>
                        <input type="text" value={porque} onChange={handlePorque} className='inputStyle' />
                    </div>
                    <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Cambiarías de opinión?</span>
                            <input type="checkbox" className="toggle toggle-success" checked={toggles.toggle3} onChange={() => handleToggle('toggle3')} />
                    </label>
                    <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Intensidad de disgusto [1-5]</span>
                            <input type="number" className='inputStyle' value={intensidad} onChange={handleIntensidad} />
                    </label>
                </div>
            ) : null
        }
        <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full" onClick={handleSubmitSong}>Listo</button>
    </div>
  )
}

export default FormSong