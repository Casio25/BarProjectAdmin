"use server"

import { Category, Product, ProductsInterface } from "../interface/ProductsInterface"

export const DeleteCategoryAction = async (category: Category, storedJwtToken: string | null) => {
    try {
        const response = await fetch(`${process.env.SERVER_URL}/catalog/delete_category`, {
            cache: "no-store",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${storedJwtToken}`
            },
            body: JSON.stringify(category)
        })
        console.log(response)
        const json = await response.json();
        return json;
    } catch (error) {
        console.log("Error deleting products: ", error)
    }
}