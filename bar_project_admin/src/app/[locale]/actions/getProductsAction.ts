"use server"

import { cookies } from "next/headers";




export const getProductsAction = async () => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try {
        // Build query parameters from productInfo if it's not null
        // const queryParams = productInfo ? new URLSearchParams(productInfo as any).toString() : '';
        // const url = `http://localhost:4000/catalog${queryParams ? `?${queryParams}` : ''}`;
        const url = `${process.env.SERVER_URL}/product`
        const response = await fetch(url, {
            cache: "no-store",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${storedJwtToken}`
            }
        });

        if (response.status === 401) {
            
            console.error("Unauthorized access:", response.statusText);
            return response.status;
        }
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Error:", error);
    }
};