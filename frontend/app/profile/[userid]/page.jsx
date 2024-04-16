"use client"
import { data } from 'autoprefixer'
import React, { useState, useEffect } from 'react'
import { IoMdHeart } from "react-icons/io"
import { FaHeartBroken } from "react-icons/fa"
import { TbMusicPlus } from "react-icons/tb"
import { TbMusicOff } from "react-icons/tb"

const Profile = ({params}) => {
    const [userData, setUserData] = useState(null)
    const [addPost, setAddPost] = useState(false)
    const [contenido, setContenido] = useState('')
    const [showAddPost, setShowAddPost] = useState(false)
    const [showDeletePost, setShowDeletePost] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [remindSomeone, setRemindSomeone] = useState("")
    const [musicPlayer, setMusicPlayer] = useState("")
    const [showMusicPlayer, setShowMusicPlayer] = useState(false)


    const fetchData = async () => {
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/users/details/${params.userid}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setUserData(data)
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
        setAddPost(false)
        setRefreshKey(oldKey => oldKey + 1) 

    }

    const veryfyUser = () => {
        if (localStorage.getItem('user') === params.userid) {
            setShowAddPost(true)
            setShowDeletePost(true)
            setShowMusicPlayer(true)
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
        setRefreshKey(oldKey => oldKey + 1) 

    }

    useEffect(() => {
        fetchData()
    }, [params.userid,refreshKey])

    const handleChangeRemind = (e) => {
        setRemindSomeone(e.target.value)
    }

    const handleAddRemind = async ({song}) => {
        const data = {
                "cancion": song,
                "me_recuerda_a": remindSomeone,
                "usuario": params.userid
            }
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/remembers`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) { 
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const responseData = await response.json()
        console.log(responseData)
    }

    const handleRemoveRemind = async ({song}) => {
        const data = {
                "cancion": song,
                "usuario": params.userid
            }
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/remembers/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const responseData = await response.json()
        console.log(responseData)
    }

    const handleChangeMusicPlayer = (e) => {
        setMusicPlayer(e.target.value)
    }

    const handleAddMusicPlayer = async () => {
        const data = {
                "music_player": musicPlayer,
                "usuario": params.userid
            }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/music-player`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const responseData = await response.json()
        console.log(responseData)
    }

    const handleRemoveMusicPlayer = async () => {
        const username = params.userid
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/songs/music-player/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const responseData = await response.json()
        console.log(responseData)
    }

    if (!userData) {
        return <div>Loading...</div>
    }
    
    return (
        <div className='isolate w-full flex justify-center items-center flex-col p-10'>
            <div className="avatar shadow-xl">
                {console.log(userData)}
                {
                    userData.data.properties.Verified && (
                        <label className="bg-green-500 text-white rounded-full p-2 absolute left-14 top-0 text-xs">Verificado</label>
                    )
                }
                {
                    userData.data.properties.Normal && (
                        <label className="bg-blue-500 text-white rounded-full p-2 absolute left-14 top-0 text-xs">Normal</label>
                    )
                }
                {
                    userData.data.properties.Offender && (
                        <label className="bg-red-500 text-white rounded-full p-2 absolute left-14 top-0 text-xs">Ofensor</label>
                    )
                }
                <div className="w-24 rounded-full cursor-pointer" onClick={() => router.push(`/profile/${localStorage.getItem('user')}`)}>
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />
                </div>
            </div>
            <h1 className='text-2xl font-bold mb-4 text-white'>{userData.data.properties.Nombre} {userData.data.properties.Apellido}</h1>
            <div className='flex gap-10 w-full'>
            <div className='grid grid-cols-3 gap-4 w-full'>
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
                    {
                        userData.data.properties.Code && (
                            <div className='bg-gray-100 p-4 rounded-lg'>
                                <h2 className='font-bold text-kaqui'>Code</h2>
                                <p>{userData.data.properties.Code}</p>
                            </div>
                        )
                    }
                    {
                        userData.data.properties.CorreoProfesor && (
                            <div className='bg-gray-100 p-4 rounded-lg'>
                                <h2 className='font-bold text-kaqui'>Correo Profesor</h2>
                                <p>{userData.data.properties.CorreoProfesor}</p>
                            </div>
                        )
                    }
                    {
                        userData.data.properties.Departamento && (
                            <div className='bg-gray-100 p-4 rounded-lg'>
                                <h2 className='font-bold text-kaqui'>Departamento</h2>
                                <p>{userData.data.properties.Departamento}</p>
                            </div>
                        )
                    }
                    {
                        userData.data.properties.Jornada && (
                            <div className='bg-gray-100 p-4 rounded-lg'>
                                <h2 className='font-bold text-kaqui'>Jornada</h2>
                                <p>{userData.data.properties.Jornada}</p>
                            </div>
                        )
                    }
                    {
                        userData.data.properties.Maestria && (
                            <div className='bg-gray-100 p-4 rounded-lg'>
                                <h2 className='font-bold text-kaqui'>Maestría</h2>
                                <p>{userData.data.properties.Maestria}</p>
                            </div>
                        )
                    }
            </div>
            </div>
            <div className='flex justify-start items-center gap-4 mt-4 flex-col w-full'>
                <h1 className='font-bold text-brown m-0'>Top song</h1>
                { userData.data.relations && userData.data.relations.length > 0 && (
                    userData.data.relations.map((relation, index) => (
                        Object.keys(relation).map((key, index) => (
                            <div key={index} className='glassmorph p-4 rounded-lg w-full'>
                                {
                                    relation[key] !== null && (
                                        Object.keys(relation[key]).map((key2, index) => (
                                            typeof relation[key][key2] === 'object' && relation[key][key2] !== null
                                                ? Object.entries(relation[key][key2]).map(([subKey, value]) => (
                                                    <p key={subKey}>{subKey}: {value}</p>
                                                ))
                                                : <p key={index}>{key2}: {relation[key][key2]}</p>
                                        ))
                                    )
                                }
                            </div>
                        ))
                    ))
                )}
                { userData.data.relations && (
                <div className='justify-between w-full flex gap-4 items-center'>
                        <div className='flex gap-4'>
                            Te recuerda a alguien?
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                                    <IoMdHeart className='text-kaqui text-xl' />
                                </div>
                                <div tabIndex={0} className="card compact dropdown-content z-[1] shadow glassmorph rounded-box w-60">
                                    <div tabIndex={0} className="card-body">
                                        <h2 className="card-title text-white w-full">A quién te recuerda?</h2> 
                                        <select className="select w-full max-w-xs" onChange={handleChangeRemind}>
                                            <option disabled selected>Selecciona</option>
                                            <option>A un familiar</option>
                                            <option>A un amigo</option>
                                            <option>A mi novio/a</option>
                                            <option>A mi mascota</option>
                                            <option>A mi ex</option>
                                        </select>
                                        <button className="bg-kaqui text-white py-2 px-4 rounded-lg mt-4" onClick={() => handleAddRemind({song: userData.data.relations[0].Cancion.Nombre})}>Agregar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                            <FaHeartBroken className='text-kaqui text-xl' onClick={() => handleRemoveRemind({song: userData.data.relations[0].Cancion.Nombre})} />
                        </div>
                </div>
                )}
                { userData.data && (
                <div className='justify-between w-full flex gap-4 items-center'>
                        <div className='flex gap-4'>
                            Selecciona tu reproductor de música
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                                    <TbMusicPlus className='text-kaqui text-xl' />
                                </div>
                                <div tabIndex={0} className="card compact dropdown-content z-[1] shadow glassmorph rounded-box w-60">
                                    <div tabIndex={0} className="card-body">
                                        <h2 className="card-title text-white w-full">Cuál reproductor de música usas?</h2> 
                                        <select className="select w-full max-w-xs" onChange={handleChangeMusicPlayer}>
                                            <option disabled selected>Selecciona</option>
                                            <option>Spotify</option>
                                            <option>Apple Music</option>
                                            <option>Google Play Music</option>
                                            <option>Amazon Music</option>
                                            <option>Youtube Music</option>
                                            <option>Other</option>
                                        </select>
                                        <button 
                                            className="bg-kaqui text-white py-2 px-4 rounded-lg mt-4" 
                                            onClick={() => {
                                                if (userData && userData.data && musicPlayer) {
                                                    handleAddMusicPlayer()
                                                }
                                            }}
                                        >
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div tabIndex={0} role="button" className="btn btn-circle btn-ghost btn-xs text-info">
                            <TbMusicOff className='text-kaqui text-xl' onClick={() => handleRemoveMusicPlayer()} />
                        </div>
                </div>
                )}
            </div>
            <div className='flex justify-start items-center gap-4 mt-4 flex-col w-full'>
                <h1 className='font-bold text-kaqui'>Posts</h1>
                <div className='flex flex-wrap gap-4'>
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