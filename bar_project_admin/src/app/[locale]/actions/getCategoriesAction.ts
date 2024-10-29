"use server"

import { cookies } from "next/headers"

export const getCategoriesAction = async() => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    
    try{
        const response = await fetch(`${process.env.SERVER_URL}/category/get_categories`,{
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storedJwtToken}`,
                "Content-Type": "application/json"
            }
        })
        if (response.status === 401){
            console.error("Unauthorized access: ", response.statusText)
        }
        const json = await response.json()
        return json;

    }catch(error){
        console.error("Error getting categories: ", error)
    }
}