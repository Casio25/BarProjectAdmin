"use server"

import { cookies } from "next/headers";

export const getVenueAction = async() => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try{
        const response = await fetch (`${process.env.SERVER_URL}/venue`, {
            cache: "no-store",
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization':`Bearer ${storedJwtToken}`,
                'Cache-Control': 'no-cache'
            }
        });
        if (response.status === 401){
            console.error("Unauthorized access: ", response.statusText) 
            return response.status;
        }
        if (response.status === 404){
            console.error("Venue not found: ", response.statusText)
            return response.status;
        }
        return response.json();

    }catch (error){
        console.error(
            "Error getting venue info", error
        ) 
    }

}