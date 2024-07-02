"use server"

import { ICreateCategory } from "../interface/CategoriesInterface"

export const addCategoryAction = async (categoryName: ICreateCategory, storedJwtToken: string | null) => {
    try {
        const response = await fetch(`${process.env.SERVER_URL}/catalog/create_category`, {
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
        console.log("creating category", response)
        const json = await response.json()
        return json;

    } catch (error) {
        console.error("Error getting categories: ", error)
    }
}