import React, {useState} from 'react'

const PopUp = ({error, onCancel}) => {  
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
            <div className='bg-white p-10 rounded-md'>
            <div className='flex justify-end w-full'>
                <button className='font-montserrat bg-brown px-2 py-1 rounded-full text-white' onClick={onCancel}>X</button>
            </div>
            <h1 className='font-montserrat text-center text-2xl font-bold mt-0'>Error</h1>
            <p className='font-montserrat text-center'>{error}</p>
        </div>
    </div>
  )
}

export default PopUp