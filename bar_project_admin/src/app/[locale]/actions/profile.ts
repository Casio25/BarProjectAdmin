"use server"


export async function profileAction(storedJwtToken: string) {
    try {
        
        const response = await fetch(`${process.env.SERVER_URL}/auth/get_profile`, {
            cache: "no-store",
            method: "GET",
            headers: { "Content-Type": "application/json",
             "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${storedJwtToken}`
    },

        })

        

        // if (!response.ok) {
        //     console.log ("no response", response)
        //     throw new Error(`HTTP error! Status: ${response.status}`);
        // }

        


        return await response.json();

    } catch (error) {
        console.error("Error:", error);
    }
}