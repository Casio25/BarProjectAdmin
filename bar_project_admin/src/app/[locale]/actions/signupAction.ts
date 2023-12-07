import { RegistrationInterface } from "../interface/RegistrationInterface";

export const signUpAction = async (formData : RegistrationInterface) => {
    try{
        const response = await fetch("http://localhost:4000/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(formData)
        });
    } catch (error) {
        console.error("Error:", error);
    }
}