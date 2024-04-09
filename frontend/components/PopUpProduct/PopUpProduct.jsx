import React from 'react'

const PopUp = ({ message, onCancel, onConfirm }) => {
    return (
        <div className='fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center'>
        <div className='bg-white p-10 rounded-md'>
            <div className='flex justify-end w-full'>
                <button className='font-montserrat bg-brown px-2 py-1 rounded-full text-white' onClick={onCancel}>X</button>
            </div>
            <h1 className='font-montserrat text-center text-2xl font-bold mt-0'>Confirmation</h1>
            <p className='font-montserrat text-center'>{message}</p>
            <div className="flex justify-center mt-4">
                <button onClick={onConfirm} className="font-montserrat bg-kaqui text-white px-4 py-2 rounded-md mr-4">Confirm</button>
                <button onClick={onCancel} className="font-montserrat bg-gray-300 text-gray-700 px-4 py-2 rounded-md">Cancel</button>
            </div>
        </div>
        </div>
    );
};

export default PopUp;