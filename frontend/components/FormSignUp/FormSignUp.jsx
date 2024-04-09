"use client";
import { useState } from 'react'
import { useRouter } from "next/navigation";
import PopUp from '../PopUp/PopUp';


const FormSignUp = () => {
  const router = useRouter();
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [addressInput, setAddressInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [showPopUp, setShowPopUp] = useState(false)

  const handleNameChange = (e) => {
    setNameInput(e.target.value)
  }

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value)
  }

  const handleAddressChange = (e) => {
    setAddressInput(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const data = {
      "name": nameInput,
      "address": addressInput,
      "email": emailInput,
      "password": passwordInput
    }
    if (!nameInput || !emailInput || !addressInput || !passwordInput) {
      setShowPopUp(true)
      setError("Por favor complete todos los campos.")
      return
    }
    const response = await fetch('https://bd2-markalbrand56.koyeb.app/user/signup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response.ok) {
      router.push('/login')
    } else {
      setShowPopUp(true)
      setError("No se pudo registrar. Intente nuevamente.")
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  return (
    <form className=' p-10 flex justify-center items-center flex-col'>
      {showPopUp ? <PopUp error={error} /> : 
      <><div className="w-1/3">
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
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="label">
                  Número de teléfono
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="tel"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
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
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <div className="dropdown dropdown-bottom py-2 w-full">
                  <div tabIndex={0} role="button" className="btn m-1 bg-kaqui hover:bg-brown text-white w-full">Género</div>
                  <ul tabIndex={0} className="dropdown-content bg-kaqui z-[1] menu p-2 shadow-md text-white rounded-box w-52">
                    <li><a>Femenino</a></li>
                    <li><a>Masculino</a></li>
                    <li><a>Otro</a></li>
                  </ul>
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
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown sm:text-sm sm:leading-6 focus-visible:outline-none"
                    onChange={handlePasswordChange} />
                </div>
              </div>
            </div>
          </div>
        </div><div className="mt-6 flex items-center justify-between gap-x-6 lg:flex-row flex-col">
            <button
              type="button"
              onClick={handleLogin}
              className="font-montserrat flex items-center gap-x-2 text-sm font-semibold leading-6 hover:text-kaqui text-white p-2">
              Already have an account? - Login
            </button>
            <div className="flex items-center gap-x-2">
              <button
                type="submit"
                className="font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none"
                onClick={handleFormSubmit}
              >
                Sign up
              </button>
            </div>
          </div></>
      }
    </form>
  )
}

export default FormSignUp