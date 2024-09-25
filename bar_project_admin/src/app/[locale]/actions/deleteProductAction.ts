"use server"

import { cookies } from "next/headers"
import { Product, ProductsInterface } from "../interface/ProductsInterface"

export const DeleteProductAction = async(product: Product) => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try{
        const response = await fetch(`${process.env.SERVER_URL}/catalog/delete`, {
            cache: "no-store",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${storedJwtToken}`
            },
            body: JSON.stringify(product)
        })
        console.log(response)
        const json = await response.json();
        return json;
    }catch(error){
        console.log("Error deleting products: ", error)
    }
}