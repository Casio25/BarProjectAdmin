"use server"
export const getMaxOrderAction = async (storedJwttoken: string | null, categoryId: number) => {
    try {
        const response = await fetch("http://localhost:4000/catalog/get_max_order", {
            cache: 'no-store',
            method: "POST",
            headers: {
                "Authorization": `Bearer ${storedJwttoken}`,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache"
            },
            body: JSON.stringify({
                categoryId: categoryId
            }),
        });

        if (response.status === 401) {
            console.error("Unauthorized access: ", response.statusText);
        }

        const json = await response.json();
        console.log(json);
        return json;

    } catch (error) {
        console.error("Error getting categories: ", error);
    }
};
