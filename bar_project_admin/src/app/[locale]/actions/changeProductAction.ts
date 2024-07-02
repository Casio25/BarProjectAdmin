"use server"
import { ProductsInterface, Product } from './../interface/ProductsInterface';
export const changeProductAction = async(product: Product | undefined, jwtToken: null | string) => {
    try{
        const response = await fetch(`${process.env.SERVER_URL}/catalog/change`, {
            cache: "no-store",
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
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