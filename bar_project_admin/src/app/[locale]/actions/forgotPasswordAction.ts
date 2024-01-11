"use server"
import { ForgotPasswordInterface } from "../interface/ForgotPasswordInterface";

export const forgotPasswordAction = async (formData: ForgotPasswordInterface) => {
    try {
        const response = await fetch("http://localhost:4000/auth/forgot_password", {
            cache: "no-store",
            method: "POST",
            headers: { "Content-Type": "application/json", 
            "Access-Control-Allow-Origin": "*"

},
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Check if response body is empty before parsing JSON
        const body = await response.text();
        const json = body ? JSON.parse(body) : {};

        return json;

    } catch (error) {
        console.error("Error:", error);
    }
};