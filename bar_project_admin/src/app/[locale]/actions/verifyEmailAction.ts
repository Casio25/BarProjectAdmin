"use server"

const VerifyEmailAction = async(jwtToken: string) => {

    try {
        const response = await fetch("http://localhost:4000/auth/verify", {
            method: "GET", headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Authorization": `Bearer ${jwtToken}` },

        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
            return response.status;
    } catch (error) {
        console.error("Verification failde:", error)
        
    }
}

export default VerifyEmailAction