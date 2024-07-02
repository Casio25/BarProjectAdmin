"use server"

import { NewProduct } from "../interface/ProductsInterface"


export const addProductAction = async (product: NewProduct, storedJwtToken: string | null) => {
    try {
        console.log("product addProductAction", product);
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

        console.log("creating product", response.status);
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Error adding product to category: ", error);
    }
};
