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
        router.push('/store')
        localStorage.setItem('userId', data._id)
      }else {
        setShowPopUp(true)
        setError("No se pudo iniciar sesión. Intente nuevamente.")
      }
  }
    
  return (
    <form className='p-20'>
      {showPopUp ? <PopUp error={error} /> :
        <><div className="w-full">
            <h2 className="text-4xl">Login</h2>
          <div className="flex flex-col">
            <div className="flex flex-col">
              <div className="sm:col-span-4">
                <label  className="font-montserrat block text-sm font-medium leading-6 text-gray-900">
                  Correo electrónico
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    autoComplete="email"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown focus-visible:outline-none sm:text-sm sm:leading-6"
                    onChange={handleEmail}
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label htmlFor="password" className="font-montserrat block text-sm font-medium leading-6 text-gray-900">
                  Contraseña
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    autoComplete="password"
                    className="font-montserrat block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brown focus-visible:outline-none sm:text-sm sm:leading-6"
                    onChange={handlePassword}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-x-6">
              <button 
                  type="button" className="text-sm font-semibold leading-6 text-black" onClick={() => router.push('/')}>
              Sign up
              </button>
              <button
              type="submit"
              className="font-montserrat rounded-md bg-kaqui px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-grayish focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-none"
              onClick={handleLogin}
              >
              Login
              </button>
        </div> </>
      }
    </form>
  )
}

export default FormLogin