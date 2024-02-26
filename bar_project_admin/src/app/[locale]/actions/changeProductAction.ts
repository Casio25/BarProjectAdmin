
"use server"
import { ProductsInterface } from './../interface/ProductsInterface';
export const changeProductAction = async(product: ProductsInterface, jwtToken: null | string) => {
    try{
        const response = await fetch("http://localhost:4000/catalog/change", {
            cache: "no-store",
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify(product),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}