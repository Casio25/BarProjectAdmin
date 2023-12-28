"use server"
import { LoginInterface } from "../interface/LoginInterface";
export const resendEmailAction = async (formData: LoginInterface) => {
    try {
        console.log(formData)
        
        const response = await fetch("http://localhost:4000/auth/resend_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(formData),
        })
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if response body is empty before parsing JSON
        const body = await response.text();
        const json = body ? JSON.parse(body) : {};

        return json;
    } catch (error){
        console.error("Error:", error);
    }
}