"use server"

import { LoginStore } from "../store/LoginStore"

export const profile = async() => {
    try{
    const storedJwtToken = LoginStore(state => state.jwtToken)
    const response = await fetch("http://localhost:4000/auth/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Authorization": `Bearer ${storedJwtToken}` },
    })

    if (!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
}catch(error){

}
}