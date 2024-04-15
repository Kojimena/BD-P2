"use client"
import React, { useState, useEffect } from 'react'

const Profile = ({params}) => {
  const [userData, setUserData] = useState(null)
  const [addPost, setAddPost] = useState(false)
  const [contenido, setContenido] = useState('')
  const [showAddPost, setShowAddPost] = useState(false)
  const [deletePost, setDeletePost] = useState(false)
  const [showDeletePost, setShowDeletePost] = useState(false)

  const fetchData = async () => {
    const response = await fetch(`https://super-trixi-kojimena.koyeb.app/users/details/${params.userid}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    setUserData(data)
    console.log(data)
  }

    useEffect(() => {
        if (params.userid) {
            fetchData()
            veryfyUser()
        }
    }, [params.userid])

    const handleContenido = (e) => {
        setContenido(e.target.value)
    }

    const handleAddPost = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/users/post`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "contenido": contenido,
                "usuario": params.userid
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
        setAddPost(false)
    }

    const veryfyUser = () => {
        if (localStorage.getItem('user') === params.userid) {
            setShowAddPost(true)
            setShowDeletePost(true)
        }
    }

    const handleDeletePost = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/users/clear/${params.userid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        console.log(data)
    }


    if (!userData) {
        return <div>Loading...</div>
      }
      
      return (
        <div className='isolate w-full flex justify-center items-center flex-col p-10'>
            <div className="avatar online">
                <div className="w-14 rounded-full cursor-pointer" onClick={() => router.push(`/profile/${localStorage.getItem('user')}`)}>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
                </div>
            </div>
          <h1 className='text-2xl font-bold mb-4'>{userData.data.properties.Nombre} {userData.data.properties.Apellido}</h1>
          <div className='grid grid-cols-3 gap-4'>
          {userData.data.properties.Carnet && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Carnet</h2>
                <p>{userData.data.properties.Carnet}</p>
            </div>
            )}
            {userData.data.properties.Colegio && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Colegio</h2>
                <p>{userData.data.properties.Colegio}</p>
            </div>
            )}
            {userData.data.properties.Correo && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Correo</h2>
                <p>{userData.data.properties.Correo}</p>
            </div>
            )}
            {userData.data.properties.FechaNacimiento && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Fecha de Nacimiento</h2>
                <p>{new Date(userData.data.properties.FechaNacimiento).toLocaleDateString()}</p>
            </div>
            )}
            {userData.data.properties.Foraneo !== undefined && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Foraneo</h2>
                <p>{userData.data.properties.Foraneo ? 'Sí' : 'No'}</p>
            </div>
            )}
            {userData.data.properties.Genero && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Género</h2>
                <p>{userData.data.properties.Genero}</p>
            </div>
            )}
            {userData.data.properties.Parqueo !== undefined && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Parqueo</h2>
                <p>{userData.data.properties.Parqueo ? 'Sí' : 'No'}</p>
            </div>
            )}
            {userData.data.properties.Usuario && (
            <div className='bg-gray-100 p-4 rounded-lg'>
                <h2 className='font-bold text-kaqui'>Usuario</h2>
                <p>{userData.data.properties.Usuario}</p>
            </div>
            )}
          </div>
            <div className='flex justify-start items-center gap-4 mt-4 flex-col w-full'>
                <h1 className='font-bold text-kaqui'>Posts</h1>
                <div className='flex flex-wrap gap-4'>
                    {console.log(userData.data.properties.Publicaciones && userData.data.properties.Publicaciones)}
                    {
                        userData.data.properties.Publicaciones && userData.data.properties.Publicaciones.map((post, index) => (
                            <div key={index} className='glassmorph p-4 rounded-lg w-full'>
                                <h3 className=' text-white'>{post}</h3>
                                <p>{post.body}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                showAddPost && (
                    <button className='fixed bottom-10 right-10 bg-kaqui text-white py-4 px-6 rounded-full' onClick={() => setAddPost(true)}>Agregar post</button>
                )
            }
            
            {
                addPost && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                        <div className='bg-white p-4 rounded-lg'>
                            <div className='flex justify-end'>
                                <button onClick={() => setAddPost(false)}>X</button>
                            </div>
                            <h2 className='font-bold text-kaqui py-2'>Nuevo post</h2>
                            <textarea placeholder='Contenido' className='w-full p-2 rounded-lg mt-4 min-h-32' onChange={handleContenido}>
                            </textarea>
                            <button className='bg-kaqui text-white py-2 px-4 rounded-lg mt-4' onClick={handleAddPost}>Agregar</button>
                        </div>
                    </div>
                )
            }
            {
                showDeletePost && (
                    <button className='fixed bottom-24 right-10 bg-brown text-white py-4 px-6 rounded-full' onClick={() => handleDeletePost()}>Eliminar posts</button>
                )
            }
        </div>
      )

  
}

export default Profile