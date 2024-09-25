"use server"

import { cookies } from "next/headers";

export const getMaxOrderAction = async (categoryId: number) => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try {
        const response = await fetch(`${process.env.SERVER_URL}/catalog/get_max_order`, {
            cache: 'no-store',
            method: "POST",
            headers: {
                "Authorization": `Bearer ${storedJwtToken}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify({
                categoryId: categoryId
            }),
        });

        if (response.status === 401) {
            console.error("Unauthorized access: ", response.statusText);
        }

        const json = await response.json();
        
        return json;

    } catch (error) {
        console.error("Error getting categories: ", error);
    }
};
