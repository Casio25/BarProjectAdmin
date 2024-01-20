"use client"
import { LoginStore } from '../store/LoginStore'
import React from 'react'
import { getProductsAction } from '../actions/getProductsAction'
import { useRouter } from '@/navigation'

export const GetProductsComponent = () => {
    const router = useRouter()
    const storedJwtToken = LoginStore(state => state.jwtToken);
    const getProducts = async (jwtToken: string) => {
        try {
            const response = await getProductsAction(jwtToken)
            console.log("response from exel: ", response)
            if (response == 401){
                router.push('/signin')
            }
        }
        catch (error) {
            console.log("Error during getting products: ", error)
        }
    }
    return (
            <button onClick={() => getProducts(storedJwtToken)} className='h-12 px-6 py-3 bg-violet-900 active:bg-violet-700 rounded-3xl flex-col justify-center items-center gap-2'>
                <p className='text-white text-sm font-semibold'>Get Orders</p>
            </button>   
    )

}
