"use server"


export const profileAction = async (storedJwtToken: string) => {
    try {
        console.log("token in server: ", storedJwtToken)
        const response = await fetch("http://localhost:4000/user/find", {
            cache: "no-store",
            method: "GET",
            headers: { "Content-Type": "application/json",
             "Access-Control-Allow-Origin": "*",
             "Authorization": `Bearer ${storedJwtToken}` 
    },

        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json)


        return json;

    } catch (error) {
        console.error("Error:", error);
    }
}