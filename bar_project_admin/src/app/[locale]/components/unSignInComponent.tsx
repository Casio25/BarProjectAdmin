"use client"

import { LoginStore } from "../store/LoginStore"

export const UnSignInComponent = () => {
    const updateJwtToken = LoginStore(state => state.updateJwtToken)
    return (
        <>
        <div>
                <button onClick={()=> {updateJwtToken("")}}>LOg out</button>
        </div>
        </>
    )
}