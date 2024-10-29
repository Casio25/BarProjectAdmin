"use server"
import { cookies } from 'next/headers';
import { ProductsInterface, Product } from './../interface/ProductsInterface';
export const changeProductAction = async(product: Product | undefined) => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try{
        const response = await fetch(`${process.env.SERVER_URL}/product/update`, {
            cache: "no-store",
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storedJwtToken}`
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