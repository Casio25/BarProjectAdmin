"use client"
import React from 'react'
import { LoginStore } from "../store/LoginStore"

interface ResendEmailProps {
    ResendEmailText: string,
    ResendEmailButton: string,
}

export const ResendEmail: React.FC<ResendEmailProps> = ({
    ResendEmailText,
    ResendEmailButton
}) => {

  const storedEmail = LoginStore(state => state.email)

  const resendEmail = (storedEmail: string) => {
    console.log("stored Email: ", storedEmail)
  }




  return (
    <div className='flex flex-col items-center'>
        <p>{ResendEmailText}</p>
      <button onClick={() => resendEmail(storedEmail)} className=' p-2 mt-4 text-center font-semibold text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{ResendEmailButton}</button>
    </div>
  )
}

