"use server"

import { cookies } from "next/headers";
import { NewProduct } from "../interface/ProductsInterface"


export const addProductAction = async (product: NewProduct) => {
  

   

    
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    
    try {
        const response = await fetch(`${process.env.SERVER_URL}/catalog/add_product`, {
            cache: 'no-store',
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${storedJwtToken}`,
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify(product),
        });

        if (response.status === 401) {
            console.error("Unauthorized access: ", response.statusText);
        }
        if (response.status === 201) {
            return response.status;
        } else {
            const json = await response.json();
            return json 
        }

        
        

    } catch (error) {
        console.error("Error adding product to category: ", error);
    }
};
