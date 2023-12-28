"use client"
import React, { useEffect, useState } from 'react'
import VerifyEmailAction from '../actions/verifyEmailAction'
import { VerifyPageProps } from '../interface/VerifyPageInterface'

export const VerifyEmail: React.FC<VerifyPageProps> = ({
    VerifyEmailSuccess,
    VerifyEmailFail
}) => {
    const [responseStatus, setResponseStatus] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const urlSearchParams = new URLSearchParams(window.location.search);
                const queryParams = Object.fromEntries(urlSearchParams.entries());
                const jwtToken = queryParams.token;
                console.log("token in useEffect: ", jwtToken);

                const response = await fetch("http://localhost:4000/auth/verify", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        "Authorization": `Bearer ${jwtToken}`
                    },
                });

                if (!response.ok) {
                    setResponseStatus(false)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                } else {
                    setResponseStatus(true)
                }
            } catch (error) {
                // Handle errors
                console.error("Error in useEffect:", error);
            }
        };

        fetchData();

    }, []);

    return (
        <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg">
            {responseStatus ? (
                <p>{VerifyEmailSuccess}</p>
            ) : (
                <p>{VerifyEmailFail}</p>
            )}
        </div>
    );

}