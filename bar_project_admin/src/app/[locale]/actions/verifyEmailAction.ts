"use server"

const VerifyEmailAction = async() => {
    try {

        const urlSearchParams = new URLSearchParams(window.location.search)
        const queryParams = Object.fromEntries(urlSearchParams.entries())
        const jwtToken = queryParams.token
        console.log("token in action component: ", jwtToken)
        const response = await fetch("http://localhost:4000/auth/verify", {
            method: "GET", headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Authorization": `Bearer ${jwtToken}` },

        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {

    }
}

export default VerifyEmailAction