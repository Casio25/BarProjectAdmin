"use server"
import { RegistrationInterface } from "../interface/RegistrationInterface";

export const signUpAction = async (formData: RegistrationInterface) => {
    try {
        const response = await fetch("http://localhost:4000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        return json; // Return the JSON response

    } catch (error) {
        console.error("Error:", error);
        throw error; // Re-throw the error for handling in the main file
    }
};