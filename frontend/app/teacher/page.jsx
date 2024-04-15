"use client"
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import FormPlace from '@/components/FormPlace/FormPlace'
import FormSign from '@/components/FormSign/FormSign'
import FormSong from '@/components/FormSong/FormSong'
import FormEquipo from '@/components/FormEquipo/FormEquipo'

const Teacher = () => {
    const router = useRouter()
    const [places, setPlaces] = useState([])
    const [user , setUser] = useState('')

    /* LUGARES CREATE */
    const [departamento, setDepartamento] = useState('')
    const [direccion, setDireccion] = useState('')
    const [foto, setFoto] = useState('')
    const [nombre, setNombre] = useState('')
    const [tipo, setTipo] = useState('')

    const handleChangedepartamento = (e) => {
        setDepartamento(e.target.value)
    }
    
    const handleChangedireccion = (e) => {
        setDireccion(e.target.value)
    }

    const handleChangefoto = (e) => {
        setFoto(e.target.value)
    }

    const handleChangenombre = (e) => {
        setNombre(e.target.value)
    }

    const handleChangetipo = (e) => {
        setTipo(e.target.value)
    }

    /* EQUIPOS CREATE */
    const [nombreEquipo, setNombreEquipo] = useState('')
    const [deporte, setDeporte] = useState('')
    const [division, setDivision] = useState('')
    const [fechaEstablecimiento, setFechaEstablecimiento] = useState('')
    const [pais, setPais] = useState('')

    const handleChangenombreEquipo = (e) => {
        setNombreEquipo(e.target.value)
    }

    const handleChangedeporte = (e) => {
        setDeporte(e.target.value)
    }

    const handleChangedivision = (e) => {
        setDivision(e.target.value)
    }

    const handleChangefechaEstablecimiento = (e) => {
        setFechaEstablecimiento(e.target.value)
    }

    const handleChangepais = (e) => {
        setPais(e.target.value)
    }

    /* CANCIONES CREATE */
    const [nombreCancion, setNombreCancion] = useState('')
    const [genero, setGenero] = useState('')
    const [duracion, setDuracion] = useState(0)
    const [fechaLanzamiento, setFechaLanzamiento] = useState('')
    const [disco, setDisco] = useState('')

    const handleChangenombreCancion = (e) => {
        setNombreCancion(e.target.value)
    }

    const handleChangeGenero = (e) => {
        setGenero(e.target.value)
    }

    const handleChangeDuracion = (e) => {
        setDuracion(e.target.value)
    }

    const handleChangefechaLanzamiento = (e) => {
        setFechaLanzamiento(e.target.value)
    }

    const handleChangeDisco = (e) => {
        setDisco(e.target.value)
    }

    const fetchDataPlaces = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/places/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setPlaces(data.places.map(place => place.nombre))
    }

    useEffect(() => {
        setUser(localStorage.getItem('user'))
        fetchDataPlaces()
    }, [])

    const handleSubmitPlace = async (e) => {
        e.preventDefault()
        const data = {
            "departamento": departamento,
            "direccion": direccion,
            "foto": foto,
            "nombre": nombre,
            "tipo": tipo
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/places/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Lugar guardado')
        } else {
            console.error('Error al guardar lugar')
        }
    }

    const handleSubmitTeam = async (e) => {
        e.preventDefault()
        const data = {
            "nombre": nombreEquipo,
            "deporte": deporte,
            "division": division,
            "fecha_establecimiento": fechaEstablecimiento,
            "pais": pais
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/teams/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Nuevo equipo guardado')
        } else {
            console.error('Error al guardar nuevo equipo')
        }
    }

    const handleSubmitSong = async (e) => {
        e.preventDefault()
        const data = {
            "nombre": nombreCancion,
            "genero": genero,
            "duracion": parseFloat(duracion),
            "fecha_lanzamiento": fechaLanzamiento,
            "disco": disco,
            "usuario": user
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/`, {
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
        <div className="w-full isolate pt-20">
            <h1 className='text-4xl text-center font-montserrat font-bold'>Hola <span className='text-kaqui'>{user}!</span> Completa tu perfil</h1>
            {/*LUGARES*/}
            <form className='m-20 justify-start items-center gap-10'>
                <div className='flex gap-10'>
                    <FormPlace type={'visited'} places={places} usuario={user}/>
                    <FormPlace type={'dislikes'} places={places} usuario={user}/>
                </div>
                No encuentras el lugar que buscas?
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                        <svg tabIndex={0} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div tabIndex={0} className="card compact dropdown-content z-[1] shadow bg-gray-500 rounded-box w-64">
                        <div tabIndex={0} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                Nombre del lugar
                                </label>
                                <input type="text" className="input input-bordered" placeholder="Nombre del lugar"  onChange={handleChangenombre}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Dirección
                                </label>
                                <input type="text" className="input input-bordered" placeholder="Dirección" onChange={handleChangedireccion}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Departamento
                                </label>
                                <input type="text" className="input input-bordered" placeholder="Departamento" onChange={handleChangedepartamento}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Foto
                                </label>
                                <input type="text" className="input input-bordered" placeholder="Foto" onChange={handleChangefoto}/>
                            </div>
                            <div className="form-control">
                                <select  className="select select-bordered" onChange={handleChangetipo}>
                                <option>Selecciona una categoría</option>
                                <option>Familiar</option>
                                <option>Amigos</option>
                                <option>Trabajo</option>
                                <option>Estudio</option>
                                <option>Pet friendly</option>
                                </select>
                            </div>
                            <button className="btn btn-primary bg-kaqui border-non" onClick={handleSubmitPlace}>Guardar</button>
                        </div>
                    </div>
                </div>

            </form>
            
            {/*Signo Zodiacal*/}
            <form className='m-20 justify-start items-center gap-10'>
                <FormSign type={'sign'} usuario={user}/>
            </form>

            {/*Canciones*/}
            <form className='m-20 justify-start items-center gap-10'>
                <div className='flex gap-10'>
                    <FormSong type={'likes'} usuario={user} />
                    <FormSong type={'favorite'} usuario={user} />
                    <FormSong type={'dislikes'} usuario={user} />
                </div>
                No encuentras alguna canción?
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                        <svg tabIndex={0} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div tabIndex={0} className="card compact dropdown-content z-[1] shadow bg-gray-500 rounded-box w-64">
                        <div tabIndex={0} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                Nombre
                                </label>
                                <input type="text" className="input input-bordered" onChange={handleChangenombreCancion}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Género
                                </label>
                                <input type="text" className="input input-bordered" onChange={handleChangeGenero}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Duración
                                </label>
                                <input type="number" className="input input-bordered" onChange={handleChangeDuracion}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Fecha de lanzamiento
                                </label>
                                <input type="date" className="input input-bordered" onChange={handleChangefechaLanzamiento}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Disco
                                </label>
                                <input type="text" className="input input-bordered" onChange={handleChangeDisco}/>
                            </div>
                            <button className="btn btn-white bg-kaqui border-non" onClick={handleSubmitSong}>Guardar</button>
                        </div>
                    </div>
                </div>

            </form>

            {/*Equipos*/}
            <form className='m-20 justify-start items-center gap-10'>
                <div className='flex gap-10'>
                    <FormEquipo type={'likes'} usuario={user} />
                    <FormEquipo type={'dislikes'} usuario={user} />
                </div>
                No encuentras algún equipo?
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                        <svg tabIndex={0} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div tabIndex={0} className="card compact dropdown-content z-[1] shadow bg-gray-500 rounded-box w-64">
                        <div tabIndex={0} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                Nombre del equipo
                                </label>
                                <input type="text" className="input input-bordered" placeholder=""  onChange={handleChangenombreEquipo}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Deporte
                                </label>
                                <input type="text" className="input input-bordered" placeholder="Futbol, basketball"  onChange={handleChangedeporte}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Divisón
                                </label>
                                <input type="text" className="input input-bordered" placeholder=""  onChange={handleChangedivision}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                Fecha de establecimiento
                                </label>
                                <input type="date" className="input input-bordered" placeholder="Futbol, basketball"  onChange={handleChangefechaEstablecimiento}/>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                País
                                </label>
                                <input type="text" className="input input-bordered" placeholder=""  onChange={handleChangepais}/>
                            </div>
                            <button className="btn btn-white bg-kaqui border-non" onClick={handleSubmitTeam}>Guardar</button>
                        </div>
                    </div>
                </div>
            </form>
            <div className='flex justify-center items-center w-full'>
            <button className="btn btn-white hover:bg-kaqui border-non w-1/2" onClick={() => router.push('/people')}>Continuar</button>
            </div>
        </div>
    )
}

export default Teacher