

import { ChangePasswordInterface } from "../interface/ChangePasswordInterface";

export const ChangePasswordAction = async (formData: ChangePasswordInterface) => {
    try {
        // Check if window is defined (i.e., if the code is running in a browser environment)
        if (typeof window !== 'undefined') {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const queryParams = Object.fromEntries(urlSearchParams.entries());
            const jwtToken = queryParams.token;
            console.log("token in action component: ", jwtToken);

            const response = await fetch("http://localhost:4000/auth/update", {
                cache: "no-store",
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": `Bearer ${jwtToken}`
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
        } else {
            // Handle the case where window is not defined (e.g., server-side rendering)
            console.warn("Window is not defined; code is not running in a browser environment.");
            return null; // or handle it according to your use case
        }

    } catch (error) {
        console.error("Error:", error);
    }
};
