"use client"
import React, { useState } from 'react';
import CookiesStore from '../store/cookieStore';

const Cookies = () => {
    const { cookiesStatus, updateCookiesStatus } = CookiesStore();
   

    const handleAcceptClick = () => {

        updateCookiesStatus(true)
    };

    return (
        <>
            {!cookiesStatus && (
                <div className='flex m-2'>
                    <p>This website uses cookies. By accepting, you agree to our cookie policy.</p>
                    <div className='ml-auto'>
                        <button onClick={handleAcceptClick} className="w-32 h-12 px-6 py-4 m-2 bg-zinc-900 rounded-3xl justify-center items-center gap-2 inline-flex">
                            <p className="text-center text-white text-sm font-semibold font-['Work Sans'] leading-none">Accept</p>
                        </button>
                        <button className="w-32 h-12 px-6 py-4 m-2 bg-zinc-900 rounded-3xl justify-center items-center gap-2 inline-flex">
                            <p className="text-center text-white text-sm font-semibold font-['Work Sans'] leading-none">Reject</p>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};


export default Cookies;


