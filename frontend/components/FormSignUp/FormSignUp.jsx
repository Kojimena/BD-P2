"use client";
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import PopUp from '../PopUp/PopUp';
import FormRol from '../FormRol/FormRol';


const FormSignUp = () => {
  const router = useRouter();
  const [nameInput, setNameInput] = useState('')
  const [apellidoInput, setApellidoInput] = useState('')
  const [fechaInput, setFechaInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [showPopUp, setShowPopUp] = useState(false)
  const [gender, setGender] = useState('Género')
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2 , setIsOpen2] = useState(false)
  const [role, setRole] = useState('Rol')
  const [datasend, setDatasend] = useState({})
  const [showForm, setShowForm] = useState(false)

  const handleNameChange = (e) => {
    setNameInput(e.target.value)
  }

  const handleApellidoChange = (e) => {
    setApellidoInput(e.target.value)
  }

  const handleUsername = (e) => {
    setUsernameInput(e.target.value)
  }

  const handleAddressChange = (e) => {
    setAddressInput(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value)
  }

  const handleFechaChange = (e) => {
    setFechaInput(e.target.value)
  }

  useEffect(() => {
    if (Object.keys(datasend).length > 0) {
      setShowForm(true)
    }
  }, [datasend])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const data = {
      "apellido": apellidoInput,
      "fecha_nacimiento": fechaInput,
      "genero": gender,
      "nombre": nameInput,
      "password": passwordInput,
      "usuario": usernameInput,
      "conexiones":[""],
      "publicaciones":[""],
    }
    setDatasend(data)
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <form className=' p-10 flex justify-start items-center'>
      {showPopUp ? <PopUp error={error} /> : 
      <><div className="w-1/2">
          <div className="flex flex-col">
            <h2 className="font-montserrat text-base font-semibold leading-7 text-white">Personal Information</h2>
            <div className="flex flex-col">
              <div className="sm:col-span-3">
                <label className="label">
                  Nombres
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="given-name"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                    onChange={handleNameChange} />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="label">
                  Apellidos
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="given-name"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                    onChange={handleApellidoChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="label">
                  Fecha de nacimiento
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    autoComplete="bday"
                    onChange={handleFechaChange}
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="dropdown dropdown-bottom py-2 w-full">
                  <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen(!isOpen)}>{gender}</div>
                  {isOpen && (
                    <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                      <li><a onClick={() => {setGender('Femenino'); setIsOpen(false);}}>Femenino</a></li>
                      <li><a onClick={() => {setGender('Masculino'); setIsOpen(false);}}>Masculino</a></li>
                      <li><a onClick={() => {setGender('Otro'); setIsOpen(false);}}>Otro</a></li>
                    </ul>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
              <div className="dropdown dropdown-bottom py-2 w-full">
                  <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full" onClick={() => setIsOpen2(!isOpen2)}>{role}</div>
                  {isOpen2 && (
                    <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                      <li><a onClick={() => {setRole('student'); setIsOpen2(false);}}>Estudiante</a></li>
                      <li><a onClick={() => {setRole('teacher'); setIsOpen2(false);}}>Maestro</a></li>
                      <li><a onClick={() => {setRole('teacher-student'); setIsOpen2(false);}}>Ambas</a></li>
                    </ul>
                  )}
                </div>
              </div>


              <div className="sm:col-span-3">
                <label className="label">
                  Nombre de Usuario
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="username"
                    onChange={handleUsername}
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label  className="label">
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="street-address"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                    onChange={handlePasswordChange} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-x-6 lg:flex-row flex-col">
            <button
              type="button"
              onClick={handleLogin}
              className="font-montserrat flex items-center gap-x-2 text-sm font-semibold leading-6 hover:text-kaqui text-white p-2">
              Already have an account? - Login
            </button>
            <div className="flex items-center gap-x-2">
            <button
              type="submit"
              onClick={handleFormSubmit}
              className="font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none"
            >
              Continuar
            </button>
            </div>
          </div>
        </div>
        </>
      }
      <div className="w-1/2 flex justify-center">
        {showForm && <FormRol lastdata={datasend} role={role} />}
      </div>
    </form>
  )
}

export default FormSignUp