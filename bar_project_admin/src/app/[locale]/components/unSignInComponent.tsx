"use client"

import { cookies } from "next/headers"
import { LoginStore } from "../store/LoginStore"

export const UnSignInComponent = () => {

    return (
        
        <div>
                <button onClick={()=> {cookies().set("jwtToken", "", {secure: true})}}>LOg out</button>
        </div>
    )
}