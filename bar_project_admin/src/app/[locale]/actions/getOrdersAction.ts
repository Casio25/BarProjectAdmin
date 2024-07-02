"use server"



export const getOrdersAction = async (storedJwtToken: string | null) => {
    try {
        const response = await fetch(`${process.env.SERVER_URL}/orders/get_orders`, {
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