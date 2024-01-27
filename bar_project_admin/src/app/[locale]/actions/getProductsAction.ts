"use server"



export const getProductsAction = async (storedJwtToken: string) => {
    try {
        console.log("token in server: ", storedJwtToken);
        const response = await fetch("http://localhost:4000/catalog", {
            cache: "no-store",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${storedJwtToken}`
            },
        });

        if (response.status === 401) {
            // Unauthorized access
            console.error("Unauthorized access:", response.statusText);
            // You can handle unauthorized access here, e.g., redirect to login page
            return response.status;
        }
        const json = await response.json();
        return json;

    } catch (error) {
        console.error("Error:", error);
    }
};