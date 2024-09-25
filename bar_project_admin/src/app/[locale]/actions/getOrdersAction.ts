"use server"

import { cookies } from "next/headers";



export const getOrdersAction = async () => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try {
        const response = await fetch(`${process.env.SERVER_URL}/orders/get_orders`, {
            cache: "no-store",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${storedJwtToken}`
            },
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