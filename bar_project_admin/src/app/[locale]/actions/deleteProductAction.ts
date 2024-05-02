"use server"

import { Product, ProductsInterface } from "../interface/ProductsInterface"

export const DeleteProductAction = async(product: Product, storedJwtToken: string | null) => {
    try{
        const response = await fetch("http://localhost:4000/catalog/delete", {
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