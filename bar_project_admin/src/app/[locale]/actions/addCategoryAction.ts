"use server"

import { cookies } from "next/headers"
import { ICreateCategory } from "../interface/CategoriesInterface"

export const addCategoryAction = async (categoryName: ICreateCategory) => {
    const storedJwtToken = cookies().get("jwtToken")?.value || null
    try {
        const response = await fetch(`${process.env.SERVER_URL}/category/create_category`, {
            cache: 'no-store',
            method: "POST",
            headers: {
                "Authorization": `Bearer ${storedJwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(categoryName),
        })
        if (response.status === 401) {
            console.error("Unauthorized access: ", response.statusText)
        }
        if (response.status === 201) {
            return response.status;
        } else {
            const json = await response.json();
            return json
        }

    } catch (error) {
        console.error("Error getting categories: ", error)
    }
}