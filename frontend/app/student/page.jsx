"use client"
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import FormPlace from '@/components/FormPlace/FormPlace'
import FormSign from '@/components/FormSign/FormSign'
import FormSong from '@/components/FormSong/FormSong'
import FormEquipo from '@/components/FormEquipo/FormEquipo'

const Student = () => {
    const router = useRouter()
    const [carrera, setCarrera] = useState('Seleccionar carrera')
    const [carrera2, setCarrera2] = useState('Seleccionar carrera')
    const [careers, setCareers] = useState([])
    const [places, setPlaces] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [year , setYear] = useState(0)
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


    const fetchDataCareers = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/careers/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setCareers(data.careers.map(career => career.nombre_carrera))
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
        fetchDataCareers(),
        fetchDataPlaces()
    }, [])

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

    const handleYear = (e) => {
        setYear(e.target.value)
    }

    const [selectedOptions, setSelectedOptions] = useState([])

    const handleSelectChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value)
        setSelectedOptions(selected)
    }

    const handleSubmitStudies = async (e) => {
        e.preventDefault()
        const data = {
            "carrera": carrera,
            "activo": toggles.toggle4,
            "apasiona": toggles.toggle3,
            "usuario": user,
            "year": parseInt(year)
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/careers/studies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Estudios guardados')
        } else {
            console.error('Error al guardar estudios')
        }
    }

    const handleSubmitInterest = async (e) => {
        e.preventDefault()
        const data = {
            "carrera": carrera2,
            "estudiara": toggles.toggle1,
            "intereses": selectedOptions,
            "recomendado": toggles.toggle2,
            "usuario": user
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/careers/interests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Intereses guardados')
        } else {
            console.error('Error al guardar intereses')
        }
    }

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

    return (
        <div className="w-full isolate pt-20">
            <h1 className='text-4xl text-center font-montserrat font-bold'>Hola <span className='text-kaqui'>{user}!</span> Completa tu perfil</h1>
            {/*CARRERAS*/}
            <form className='m-20 flex justify-start items-center gap-10'>
                <div className="sm:col-span-3 glassmorph p-20 w-1/2 h-[400px]">
                    <span className="title">Sobre tu carrera</span>
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
                    <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Te apasiona?</span>
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle3')} />
                    </label>
                    <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Eres estudiante activo?</span>
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle4')} />
                    </label>
                    <div className="sm:col-span-3">
                        <label className='label'>Año en curso</label>
                        <input className='inputStyle' type='number' placeholder='1' onChange={handleYear} />
                    </div>
                    <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full mt-10" onClick={handleSubmitStudies}>Listo</button>
                    
                </div>

                <div className="sm:col-span-3 glassmorph p-20 w-1/2 h-[400px]">
                    <span className="title">Sobre tu carrera de interés</span>
                    <div className="dropdown dropdown-bottom py-2 w-full">
                        <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{carrera2}</div>
                            {isOpen && (
                                <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                                    {careers.map((career, index) => (
                                    <li key={index}><a onClick={() => {setCarrera2(career); setIsOpen(false)}}>{career}</a></li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    
                    <div className="form-control p-4">
                        <div className='flex'>
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">La estudiarías?</span>
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle1')} />
                        </label>
                        
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Te la recomendaron?</span>
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle2')} />
                        </label>
                        </div>
                        <div className="form-control p-2">
                        <select className="select select-primary w-full" multiple onChange={handleSelectChange}>
                            <option disabled selected>Qué te interesa de esa carrera?</option>
                                <option>La malla curricular</option>
                                <option>El prestigio de la universidad</option>
                                <option>El campo laboral</option>
                                <option>Otro</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full" onClick={handleSubmitInterest}>Listo</button>
                </div>
            </form>

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
            <form className='m-20 flex justify-start items-center gap-10'>
                <FormSong type={'likes'} usuario={user} />
                <FormSong type={'favorite'} usuario={user} />
                <FormSong type={'dislikes'} usuario={user} />
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

export default Student