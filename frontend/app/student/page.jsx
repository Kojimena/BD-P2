"use client"
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"

const Student = () => {
    const router = useRouter()
    const [carrera, setCarrera] = useState('Seleccionar carrera')
    const [carrera2, setCarrera2] = useState('Seleccionar carrera')
    const [careers, setCareers] = useState([])
    const [places, setPlaces] = useState([])
    const [place, setPlace] = useState('Seleccionar lugar')
    const [place2, setPlace2] = useState('Seleccionar lugar')
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen2, setIsOpen2] = useState(false)
    const [year , setYear] = useState(0)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)

    /* LUGARES */
    const [departamento, setDepartamento] = useState('')
    const [direccion, setDireccion] = useState('')
    const [foto, setFoto] = useState('')
    const [nombre, setNombre] = useState('')
    const [tipo, setTipo] = useState('')

    const [categoria, setCategoria] = useState(0)
    const [cuando, setCuando] = useState('2021-10-10')
    const [lugar, setLugar] = useState('')
    const [rating, setRating] = useState(5)

    const [categoria2, setCategoria2] = useState(0)
    const [cuando2, setCuando2] = useState('2021-10-10')
    const [lugar2, setLugar2] = useState('')
    const [rating2, setRating2] = useState(5)



    
    let usuario = "koji"
    
    const handleChangedepartamento = (e) => {
        setDepartamento(e.target.value)
    }
    
    const handleChangedireccion = (e) => {
        setDireccion(e.target.value)
    }

    const handleChangefoto = (e) => {
        setFoto(e.target.value)
    }

    const handleCategoria = (e) => {
        setCategoria(e.target.value)
    }

    const handleCuando = (e) => {
        setCuando(e.target.value)
    }

    const handleLugar = (e) => {
        setLugar(e.target.value)
    }

    const handleRating = (e) => {
        setRating(e.target.value)
    }

    const handleCategoria2 = (e) => {
        setCategoria2(e.target.value)
    }

    const handleCuando2 = (e) => {
        setCuando2(e.target.value)
    }

    const handleLugar2 = (e) => {
        setLugar2(e.target.value)
    }

    const handleRating2 = (e) => {
        setRating2(e.target.value)
    }


    const handleChangenombre = (e) => {
        setNombre(e.target.value)
    }

    const handleChangetipo = (e) => {
        setTipo(e.target.value)
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
        setIsButtonDisabled(true)
        const data = {
            "carrera": carrera,
            "activo": toggles.toggle4,
            "apasiona": toggles.toggle3,
            "usuario": usuario,
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
        setIsButtonDisabled(false)
    }

    const handleSubmitInterest = async (e) => {
        e.preventDefault()
        setIsButtonDisabled(true)
        const data = {
            "carrera": carrera2,
            "estudiara": toggles.toggle1,
            "intereses": selectedOptions,
            "recomendado": toggles.toggle2,
            "usuario": usuario
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
        setIsButtonDisabled(false)
    }

    const handleSubmitPlace = async (e) => {
        e.preventDefault()
        setIsButtonDisabled(true)
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
        setIsButtonDisabled(false)
    }


    const handleSubmitPlaceVisited = async (e) => {
        e.preventDefault()
        setIsButtonDisabled(true)
        const data = {
            "categoria": categoria,
            "cuando": cuando,
            "lugar": place,
            "rating": parseInt(rating),
            "usuario": usuario
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/places/visited`, {
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
        setIsButtonDisabled(false)
    }

    const handleSubmitPlaceDislike = async (e) => {
        e.preventDefault()
        setIsButtonDisabled(true)
        const data = {
            "categoria": categoria2,
            "cuando": cuando2,
            "lugar": place2,
            "rating": parseInt(rating2),
            "usuario": usuario
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/places/dislikes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Lugar que disgusta guardado')
        } else {
            console.error('Error al guardar lugar que disgusta')
        }
        setIsButtonDisabled(false)
    }

    return (
        <div className="w-full isolate pt-20">
            {/*CARRERAS*/}
            <form className='m-20 flex justify-start items-center gap-10'>
                <div className="sm:col-span-3 glassmorph p-20 w-1/2">
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

                <div className="sm:col-span-3 glassmorph p-20 w-1/2">
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
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">La estudiarías?</span>
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle1')} />
                        </label>
                        
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Te la recomendaron?</span>
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle2')} />
                        </label>
                        <div className="form-control p-4">
                            <label className="label">Qué interesa de esa carrera?</label>
                            <select multiple className="select select-bordered w-full max-w-xs" onChange={handleSelectChange}>
                                <option disabled>Selecciona una opción</option>
                                <option>La malla curricular</option>
                                <option>El prestigio de la universidad</option>
                                <option>El campo laboral</option>
                                <option>La calidad de los profesores</option>
                                <option>Otro</option>
                            </select>
                        </div>
                    </div>
                    <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full mt-10" onClick={handleSubmitInterest}>Listo</button>
                </div>
            </form>

            {/*LUGARES*/}
            <form className='m-20 justify-start items-center gap-10'>
                <div className='flex gap-10'>
                    <div className="sm:col-span-3 glassmorph p-20 w-1/2">
                        <span className="title">Lugares visitados</span>
                        <div className="dropdown dropdown-bottom py-2 w-full">
                            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{place}</div>
                                {isOpen && (
                                    <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
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
                            <input className='inputStyle' type="date" placeholder='date'/>
                        </div>
                        <div className="sm:col-span-3">
                            <label className='label'>Rating [1-5]</label>
                            <input className='inputStyle' type='number' placeholder='1-5' onChange={handleRating} />
                        </div>
                        <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full mt-10" onClick={handleSubmitPlaceVisited}>Listo</button>
                    </div>

                    <div className="sm:col-span-3 glassmorph p-20 w-1/2">
                        <span className="title">Lugares que te disgustan</span>
                        <div className="dropdown dropdown-bottom py-2 w-full">
                            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen2(!isOpen2)}>{place2}</div>
                                {isOpen2 && (
                                    <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                                    {places.map((place2, index) => (
                                        <li key={index}><a onClick={() => {setPlace2(place2); setIsOpen2(false);}}>{place2}</a></li>
                                    ))}
                                    </ul>
                                )}
                        </div>
                        <div className="sm:col-span-3">
                            <label className='label'>Categoria</label>
                            <div className="form-control" onChange={handleCategoria2}>
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
                            <label className='label' >Cuándo lo visitó?</label>
                            <input className='inputStyle' type="date" placeholder='date' onChange={handleCuando2}/>
                        </div>
                        <div className="sm:col-span-3">
                            <label className='label' >Rating [1-5]</label>
                            <input className='inputStyle' type='number' placeholder='1'onChange={handleRating2}/>
                        </div>
                        <button className="btn bg-white hover:bg-brown hsover:text-white text-kaqui w-full mt-10" onClick={handleSubmitPlaceDislike}>Listo</button>
                    </div>
                </div>
                No encuentras el lugar que buscas?
                    <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                        <svg tabIndex={0} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div tabIndex={0} className="card compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-64">
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

        </div>
    )
}

export default Student