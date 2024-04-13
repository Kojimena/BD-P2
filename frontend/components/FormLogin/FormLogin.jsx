"use client";
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import PopUp from '../PopUp/PopUp'

const FormLogin = () => {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')
  const [showPopUp, setShowPopUp] = useState(false)

  const handleEmail = (e) => {
    setEmailInput(e.target.value)
  }

  const handlePassword = (e) => {
    setPasswordInput(e.target.value)
  }

  const handleSignUp = () => {
    router.push('/')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const data = {
      "email": emailInput,
      "password": passwordInput
    }
    
    if (!emailInput || !passwordInput) {
      setShowPopUp(true)
      setError("Por favor complete todos los campos.")
      return
    }

    if (emailInput === "admin" && passwordInput === "admin") {
      router.push('/admin')
      return
    }

      const response = await fetch('https://bd2-markalbrand56.koyeb.app/user/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const data = await response.json()
        router.push('/people')
        localStorage.setItem('userId', data._id)
      }else {
        setShowPopUp(true)
        setError("No se pudo iniciar sesión. Intente nuevamente.")
      }
  }
    
  return (
    <form className='m-20 flex justify-center items-center flex-col'>
      {showPopUp ? <PopUp error={error} /> :
        <><div className="w-1/3">
            <h2 className="font-montserrat text-bold text-4xl text-kaqui">Iniciar sesión</h2>
          <div className="flex flex-col">
            <div className="flex flex-col">
            <div className="sm:col-span-3">
            <label className="label">
                  Correo electrónico
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    autoComplete="email"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown focus-visible:outline-none sm:text-sm sm:leading-6"
                    onChange={handleEmail}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label className="label">
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="password"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown focus-visible:outline-none sm:text-sm sm:leading-6"
                    onChange={handlePassword}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-x-6 lg:flex-row flex-col">
              <button 
                  type="button" 
                  onClick={handleSignUp}
                  className="font-montserrat flex items-center gap-x-2 text-sm font-semibold leading-6 hover:text-kaqui text-white p-2">
              Crear una cuenta
              </button>
              <button
              type="submit"
              className="font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none"
              onClick={handleLogin}
              >
              Ingresar
              </button>
        </div> </>
      }
    </form>
  )
}

export default FormLogin