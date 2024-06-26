"use server"
import { RegistrationInterface } from "../interface/RegistrationInterface";

export const signUpAction = async (formData: RegistrationInterface) => {
    try {
        const response = await fetch("http://localhost:4000/auth/signup", {
            cache: "no-store",
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
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
//
