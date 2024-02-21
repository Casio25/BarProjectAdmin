"use server"

export const getCategoriesAction = async(storedJwttoken: string | null) => {
    try{
        const response = await fetch("http://localhost:4000/catalog/get_categories",{
            cache: 'no-store',
            method: "GET",
            headers: {
                "Authorization": `Bearer ${storedJwttoken}`,
                "Content-Type": "application/json"
            }
        })
        if (response.status === 401){
            console.error("Unauthorized access: ", response.statusText)
        }
        const json = await response.json()
        return json;

    }catch(error){
        console.error("Error getting categories: ", error)
    }
}