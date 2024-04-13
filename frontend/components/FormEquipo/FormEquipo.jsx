import React from 'react'
import { useState, useEffect } from 'react'


const FormEquipo = ({type}) => {

    const [teams, setTeams] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [equipo, setEquipo] = useState('Seleccionar equipo')
    const [desde, setDesde] = useState('2021-10-10')
    const [porque , setPorque] = useState('')
    const [desde2, setDesde2] = useState('2021-10-10')
    const [porque2, setPorque2] = useState('')

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

    const handleDesde2 = (e) => {
        setDesde2(e.target.value)
    }

    const handlePorque = (e) => {
        setPorque(e.target.value)
    }

    const handlePorque2 = (e) => {
        setPorque2(e.target.value)
    }

    useEffect(() => {
        fetchDataTeams()
    }, [])

    const fetchDataTeams = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/teams/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setTeams(data.teams.map(equipo => equipo.nombre))
    }

    const handleSubmitTeam = async (e) => {
        e.preventDefault()

    let data;

    switch (type) {
        case "likes":
            data = {
                "equipo": equipo,
                "fecha": desde,
                "mira_partidos": toggles.toggle1,
                "por_que": porque,
                "usuario" : usuario
            }
            break
        case "dislikes":
            data = {
                "equipo": equipo,
                "fecha": desde2,
                "mira_partidos": toggles.toggle2,
                "por_que": porque2,
                "usuario" : usuario
            }
            break
        default:
            console.error('Tipo desconocido:', type)
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/teams/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('equipo guardado')
        } else {
            console.error('Error al guardar equipo')
        }
    }

    return (
        <div className="sm:col-span-3 glassmorph p-20 w-1/2">
            {
                type === "likes" ? (
                    <span className="title">Equipo que apoya</span>
                ) : null
            }
            {
                type === "dislikes" ? (
                    <span className="title">Equipo que le disgusta</span>
                ) : null
            }
            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{equipo}</div>
            {isOpen && (
                <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                {teams.map((equipo, index) => (
                    <li key={index}><a onClick={() => {setEquipo(equipo); setIsOpen(false);}}>{equipo}</a></li>
                ))}
                </ul>
            )}
            {
                type === "likes" ? (
                    <div className="dropdown dropdown-bottom py-2 w-full">
                        <div className="sm:col-span-3">
                                <label className='label'>Desde cuándo lo apoya</label>
                                <input type="date" value={desde} onChange={handleDesde} className='inputStyle' />
                        </div>
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                                <span className="label">Mira sus partidos?</span>
                                <input type="checkbox" className="toggle toggle-success" checked={toggles.toggle1} onChange={() => handleToggle('toggle1')} />
                        </label>
                        <div className="sm:col-span-3">
                            <label className='label'>Por qué lo apoya?</label>
                            <input type="text" value={porque} onChange={handlePorque} className='inputStyle' />
                        </div>
                    </div>
                ) : null
            }
            {
                type === "dislikes" ? (
                    <div className="dropdown dropdown-bottom py-2 w-full">
                        <div className="sm:col-span-3">
                            <label className='label'>Desde cuándo le disgusta?</label>
                            <input type="date" value={desde2} onChange={handleDesde2} className='inputStyle' />
                        </div>
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                                <span className="label">Mira sus partidos?</span>
                                <input type="checkbox" className="toggle toggle-success" checked={toggles.toggle2} onChange={() => handleToggle('toggle2')} />
                        </label>
                        <div className="sm:col-span-3">
                            <label className='label'>Por qué le disguta?</label>
                            <input type="text" value={porque2} onChange={handlePorque2} className='inputStyle' />
                        </div>
                    </div>
                ) : null
            }
            <button className="btn bg-white hover:bg-brown hover:text-white text-kaqui w-full" onClick={handleSubmitTeam}>Listo</button>
        </div>
    )
}

export default FormEquipo