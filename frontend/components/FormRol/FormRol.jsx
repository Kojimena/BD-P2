"use client";
import { useState } from 'react'
import { useRouter } from "next/navigation"

const FormRol = ({lastdata , role}) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [carnet, setCarnet] = useState('')
    const [correoStudent, setCorreoStudent] = useState('')
    const [colegio, setColegio] = useState('')
    const [codigo, setCodigo] = useState('')
    const [departamento, setDepartamento] = useState('')
    const [correoTeacher, setCorreoTeacher] = useState('')
    const [jornada, setJornada] = useState('')
    const [maestria, setMaestria] = useState('')
    let data = {}
    console.log(role)
    console.log(lastdata)


    const [toggles, setToggles] = useState({
        toggle1 : false,
        toggle2 : false,
    })

    const handleToggle = (name) => {
        setToggles(prevState => ({
            ...prevState,
            [name]: !prevState[name]
        }))
        console.log(toggles)
    }

    const handleCarnetChange = (e) => {
        setCarnet(e.target.value)
    }

    const handleCorreoStudentChange = (e) => {
        setCorreoStudent(e.target.value)
    }

    const handleColegioChange = (e) => {
        setColegio(e.target.value)
    }

    const handleCodigoChange = (e) => {
        setCodigo(e.target.value)
    }

    const handleDepartamentoChange = (e) => {
        setDepartamento(e.target.value)
    }


    const handleCorreoTeacherChange = (e) => {
        setCorreoTeacher(e.target.value)
    }

    const handleMaestriaChange = (e) => {
        setMaestria(e.target.value)
    }

    const handleFormSubmit = async (e,role) => {
        e.preventDefault()
        
        role === 'student' ? data = {
            "carnet": carnet,
            "correo": correoStudent,
            "parqueo": toggles.toggle1,
            "foraneo": toggles.toggle2,
            "colegio": colegio
        } : null

        role === 'teacher' ? data = {
            "code": codigo,
            "correo_profesor": correoTeacher,
            "departamento": departamento,
            "maestria": maestria,
            "jornada": jornada
        } : null

        role === 'teacher-student' ? data = {
            "carnet": carnet,
            "correo": correoStudent,
            "parqueo": toggles.toggle1,
            "foraneo": toggles.toggle2,
            "colegio": colegio,
            "code": codigo,
            "correo_profesor": correoTeacher,
            "departamento": departamento,
            "maestria": maestria,
            "jornada": jornada
        } : null

        data = {...lastdata, ...data}
        console.log(data)

        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/users/${role}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            if (role === 'student') {
                router.push('/student')
            } else if (role === 'teacher') {
                router.push('/teacher')
            } else if (role === 'teacher-student') {
                router.push('/studentTeacher')
            }
        } else {
            const responseData = await response.json()
            console.log(responseData)
        }
    }

    return (
        <form className='w-full flex justify-start items-center flex-col p-10'>
            {role === 'student' ? (
                <div className='flex flex-col w-full justify-start'>
                    <div className="sm:col-span-3">
                        <label className='label'>Carnet</label>
                        <input className='inputStyle' type='number' placeholder='Carnet' onChange={handleCarnetChange}/>
                    </div>
                    <div className="sm:col-span-3">
                        <label className='label'>Correo de Estudiante</label>
                        <input className='inputStyle' type='email' placeholder='Correo' onChange={handleCorreoStudentChange}/>
                    </div>
                    <div className="form-control p-4">
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Parqueo?</span> 
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle1')} checked={toggles.toggle1} />
                        </label>
                    </div>
                    <div className="form-control p-4">
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Foraneo?</span> 
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle2')} checked={toggles.toggle2} />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className='label'>Colegio</label>
                        <input className='inputStyle' type='text' placeholder='Colegio' onChange={handleColegioChange}/>
                    </div>
                </div>
            ) : null}

            {role === 'teacher' ? (
                <div className='flex flex-col w-full justify-start'>
                    <div className="sm:col-span-3">
                        <label className='label'>Código</label>
                        <input className='inputStyle' type='number' placeholder='Código' onChange={handleCodigoChange} />
                    </div>

                    <div className="sm:col-span-3">
                        <label className='label'>Correo de Maestro</label>
                        <input className='inputStyle' type='email' placeholder='Correo' onChange={handleCorreoTeacherChange}/>
                    </div>

                    <div className="sm:col-span-3">
                        <label className='label'>Departamento</label>
                        <input className='inputStyle' type='email' placeholder='Departamento' onChange={handleDepartamentoChange}/>
                    </div>

                    <div className="sm:col-span-3">
                            <span className="label">Maestría</span> 
                            <input type="text" className='inputStyle' placeholder='Maestría' onChange={handleMaestriaChange}/>
                    </div>

                    <div className="sm:col-span-3">
                        <div className="dropdown dropdown-bottom py-2 w-full">
                            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{jornada? jornada : 'Jornada'}</div>
                            {isOpen && (
                                <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                                    <li><a onClick={() => setJornada('Matutina')}>Matutina</a></li>
                                    <li><a onClick={() => setJornada('Vespertina')}>Vespertina</a></li>
                                    <li><a onClick={() => setJornada('Ambas')}>Ambas</a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

            ) : null}

            {role === 'teacher-student' ? (
                <div className='flex flex-col w-full justify-start'>
                    <div className="sm:col-span-3">
                        <label className='label'>Carnet</label>
                        <input className='inputStyle' type='number' placeholder='Carnet' onChange={handleCarnetChange}/>
                    </div>
                    <div className="sm:col-span-3">
                        <label className='label'>Correo de Estudiante</label>
                        <input className='inputStyle' type='email' placeholder='Correo' onChange={handleCorreoStudentChange}/>
                    </div>
                    <div className="form-control p-4">
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Parqueo?</span> 
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle1')} checked={toggles.toggle1} />
                        </label>
                    </div>
                    <div className="form-control p-4">
                        <label className="cursor-pointer gap-4 flex justify-start items-center">
                            <span className="label">Foraneo?</span> 
                            <input type="checkbox" className="toggle toggle-success" onChange={() => handleToggle('toggle2')} checked={toggles.toggle2} />
                        </label>
                    </div>
                    <div className="form-control">
                        <label className='label'>Colegio</label>
                        <input className='inputStyle' type='text' placeholder='Colegio' onChange={handleColegioChange}/>
                    </div>
                    <div className="sm:col-span-3">
                        <label className='label'>Código</label>
                        <input className='inputStyle' type='number' placeholder='Código' onChange={handleCodigoChange} />
                    </div>

                    <div className="sm:col-span-3">
                        <label className='label'>Correo de Maestro</label>
                        <input className='inputStyle' type='email' placeholder='Correo' onChange={handleCorreoTeacherChange}/>
                    </div>

                    <div className="sm:col-span-3">
                        <label className='label'>Departamento</label>
                        <input className='inputStyle' type='email' placeholder='Departamento' onChange={handleDepartamentoChange}/>
                    </div>

                    <div className="sm:col-span-3">
                            <span className="label">Maestría</span> 
                            <input type="text" className='inputStyle' placeholder='Maestría' onChange={handleMaestriaChange}/>
                    </div>

                    <div className="sm:col-span-3">
                        <div className="dropdown dropdown-bottom py-2 w-full">
                            <label className='label'>Jornada</label>
                            <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{jornada? jornada : 'Jornada'}</div>
                            {isOpen && (
                                <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                                    <li><a onClick={() => setJornada('Matutina')}>Matutina</a></li>
                                    <li><a onClick={() => setJornada('Vespertina')}>Vespertina</a></li>
                                    <li><a onClick={() => setJornada('Ambas')}>Ambas</a></li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}   
            <div className="flex items-center py-4 justify-end w-full">
                        <button
                            type="submit"
                            className="font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none"
                            onClick={(e) => handleFormSubmit(e, role)}
                        >
                            Submit Info
                        </button>
                    </div>  
        </form>
    )
}

export default FormRol
