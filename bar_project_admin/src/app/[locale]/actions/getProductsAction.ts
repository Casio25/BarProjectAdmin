"use server"



export const getProductsAction = async (storedJwtToken: string | null) => {
    try {
        console.log("token in server: ", storedJwtToken);
        const response = await fetch("http://localhost:4000/catalog", {
            cache: "no-store",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Authorization": `Bearer ${storedJwtToken}`
            },
        });

        if (response.status === 401) {
            console.error("Unauthorized access:", response.statusText);
            return response.status;
        }
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Error:", error);
    }
};