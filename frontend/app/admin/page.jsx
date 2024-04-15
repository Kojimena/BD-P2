"use client"
import React, {useState, useEffect} from 'react'
import { useRouter } from "next/navigation"
import { FaCircleCheck } from "react-icons/fa6"
import { GiCardDiscard } from "react-icons/gi"


const AdminPage = () => {
    const router = useRouter()
    const [addTags , setAddTags] = useState(false)
    const [deleteUsers, setDeleteUsers] = useState(false)
    const [tag, setTag] = useState('')
    const [deleteInput, setDeleteInput] = useState('')
    const [tagUsers, setTagUsers] = useState('')
    
    const listUsers = [
            {
                "name": "Juan",
                "lastName": "Perez",
                "email": "juanPerez@gmail.com",
            },
            {
                "name": "koji",
                "lastName": "Gomez",
                "email": "Koji@gmail.com",
            }
        ]

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

    const handleTag = (e) => {
        setTag(e.target.value)
    }

    const handleTagUsers = (e) => {
        setTagUsers(e.target.value)
    }

    const handleDeleteUsers = (e) => {
        setDeleteInput(e.target.value)
    }

    const handleAddTags = async () => {

        const data = {
            "tag": tag,
            "users": tagUsers.split(',').map(user => user.trim()),
            "value": toggles.toggle1
        }
        console.log(data)
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/admin/tag`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

        })
        if (response.ok) {
            console.log('Tags agregados')
        } else {
            console.error('Error al agregar tags')

        }
    }

    const handleDeleteTags = async () => {
        const data = {
            "tag": tag,
            "users": tagUsers.split(',').map(user => user.trim())
        }
        
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/admin/tag/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log('Tags eliminados')
        } else {
            console.error('Error al eliminar tags')
        }
    }
    
    const handleDelete = async () => {
        const users = deleteInput.split(',').map(user => user.trim());
        const response = await fetch(`https://super-trixi-kojimena.koyeb.app/admin/users/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                users: users,
            }),
        });
    
        if (response.ok) {
            console.log('Usuarios eliminados');
        } else {
            console.error('Error al eliminar usuarios');
        }
    
        setDeleteUsers(!deleteUsers);
    }

    return (
        <div className="w-full isolate">

            <div className='flex justify-center items-center flex-col pt-10'>
                <h2 className="font-montserrat text-bold text-4xl text-kaqui font-bold">Usuarios</h2>
                <div className="flex flex-wrap py-10 gap-10">
                    {listUsers.map((user, index) => (
                        <div key={index} className="p-5 glassmorph">
                            <h3 className="font-montserrat text-bold text-white">{user.name} {user.lastName}</h3>
                            <p className="font-montserrat text-white">Email: {user.email}</p>
                            <button className="mt-2 font-montserrat rounded-md bg-white px-3 py-2 text-sm font-semibold text-kaqui shadow-sm hover:bg-kaqui hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-none" onClick={() => router.push(`/profile/${user.name}`)}>
                                Ver perfil
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className='fixed bottom-0 right-0 p-4 flex flex-col gap-2'>
                <button className='mt-4 bg-kaqui text-white hover:bg-white hover:text-kaqui py-4 px-6 rounded-full' onClick={() => setAddTags(!addTags)}>Añadir tags</button>
                <button className='mt-4 bg-kaqui text-white hover:bg-white hover:text-kaqui py-4 px-6 rounded-full' onClick={() => setDeleteUsers(!deleteUsers)}>Eliminar usuarios</button>
            </div>
            {
                addTags && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                        <div className='glassmorph p-10 rounded-lg w-1/2'>
                            <button className='absolute top-2 right-2 text-white' onClick={() => setAddTags(!addTags)}>X</button>
                            <h2 className='font-bold text-white py-2'>Tags</h2>
                            <div className='flex flex-col gap-4'>
                                <select className="select w-full" onChange={handleTag}>
                                    <option disabled selected>Selecciona el tag</option>
                                    <option>Verified</option>
                                    <option>Normal User</option>
                                    <option>Offender</option>
                                </select>
                                <label className='text-white'>Usuarios</label>
                                <input type='text' placeholder='Usuario1, Usuario2, ...' className='p-2 rounded-md' onChange={handleTagUsers} />
                                <label className="cursor-pointer gap-4 flex justify-start items-center">
                                    <span className="label">False/True</span>
                                    <input type="checkbox" className="toggle toggle-success" checked={toggles.toggle1} onChange={() => handleToggle('toggle1')} />
                                </label>
                                <div className='flex gap-4 justify-end'>
                                    <button className='bg-kaqui text-white py-2 px-4 rounded-md hover:brightness-50' onClick={handleDeleteTags}> <GiCardDiscard /></button>
                                    <button className='bg-green-500 text-white py-2 px-4 rounded-md hover:brightness-50' onClick={handleAddTags}> <FaCircleCheck /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                deleteUsers && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
                        <div className='glassmorph p-10 rounded-lg w-1/2'>
                            <button className='absolute top-2 right-2 text-white' onClick={() => setDeleteUsers(!deleteUsers)}>X</button>
                            <h2 className='font-bold text-white py-2'>Eliminar usuarios</h2>
                            <div className='flex flex-col gap-4'>
                                <input type='text' placeholder='Usuario1, Usuario2, ...' className='p-2 rounded-md' onChange={handleDeleteUsers} />
                                <button className='bg-kaqui text-white py-2 px-4 rounded-md' onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}


export default AdminPage