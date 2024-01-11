"use client"
import React, { useEffect, useState } from 'react';
import VerifyEmailAction from '../actions/verifyEmailAction';
import { VerifyPageProps } from '../interface/VerifyPageInterface';

export const VerifyEmail: React.FC<VerifyPageProps> = ({
    VerifyEmailSuccess,
    VerifyEmailFail
}) => {
    const [responseStatus, setResponseStatus] = useState(false);


    if (typeof window !== 'undefined') {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const queryParams = Object.fromEntries(urlSearchParams.entries());
        const jwtToken = queryParams.token;
        console.log("token in action component: ", jwtToken);
    

        const fetchData = async () => {
            try {
                const response = await VerifyEmailAction(jwtToken);
                console.log(response)
                if (response === 200) {
                    
                    setResponseStatus(true);
                }
            } catch (error) {
                // Handle error if VerifyEmailAction fails
                console.error('Error verifying email:', error);
            }
        };

    fetchData();
    }


return (
    <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg">
        {responseStatus ? (
            <p>{VerifyEmailSuccess}</p>
        ) : (
            <p>{VerifyEmailFail}</p>
        )}
    </div>
);
};
