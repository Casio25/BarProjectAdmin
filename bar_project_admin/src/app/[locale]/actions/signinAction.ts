"use server"
import { cookies } from "next/headers";
import { LoginInterface } from "../interface/LoginInterface";

export const signInAction = async (formData: LoginInterface) => {
    try {
        const response = await fetch(`${process.env.SERVER_URL}/auth/sign_in`, {
            cache: "no-store",
            method: "POST",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const json = await response.json();
            return json;
        }
        
        const json = await response.json();
        cookies().set("jwtToken", json.access_token, { secure: true })
        return json;

        

    } catch (error) {
        console.error("Error:", error);
    }
};
