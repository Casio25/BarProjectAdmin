"use server"

import { NewProduct } from "../interface/ProductsInterface"


export const addProductAction = async (product: NewProduct, storedJwtToken: string | null) => {
    try {
        const response = await fetch("http://localhost:4000/catalog", {
            cache: 'no-store',
            method: "POST",
            headers: {
                "Authorization": `Bearer ${storedJwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product),
        })
        if (response.status === 401) {
            console.error("Unauthorized access: ", response.statusText)
        }
        console.log("creating product", response)
        const json = await response.json()
        return json;

    } catch (error) {
        console.error("Error adding product to category: ", error)
    }
}