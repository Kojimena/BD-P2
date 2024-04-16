"use client";
import React, { useEffect, useState } from 'react'
import { BarChart } from '@mui/x-charts/BarChart';

const StatsPage = () => {

    const [stats, setStats] = useState([])
    const [keys , setKeys] = useState([])
    const [values , setValues] = useState([])

    const fetchAllMetrics = async () => {
        const response = await fetch('https://super-trixi-kojimena.koyeb.app/admin/metrics')
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            setKeys(Object.keys(data.metrics))
            setValues(Object.values(data.metrics))
        } else {
            console.error('Error al obtener los usuarios')
        }
    }

    useEffect(() => {
        fetchAllMetrics()
    }, [])

    return (
        <div className='h-screen w-full  p-4 flex font-montserrat flex-col '>
            <h1 className='text-4xl font-bold text-brown text-center'>Estadísticas</h1>
            {keys.length > 0 && values.length > 0 && 
                <BarChart skipAnimation
                yAxis={[
                {
                    id: 'barCategories',
                    data: keys,
                    scaleType: 'band',
                },
                ]}
                series={[
                {
                    data: values,
                },
                ]}
                layout='horizontal'
                colors={['#fe3c72']}
                
            />
                }
        </div>
      )
}

export default StatsPage