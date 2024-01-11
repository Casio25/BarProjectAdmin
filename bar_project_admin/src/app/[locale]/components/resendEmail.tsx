"use client"
import React, {useState, useEffect} from 'react'
import { SignInSchema } from '../validation/SignIn'
import { z } from "zod"
import { LoginStore } from "../store/LoginStore"
import {resendEmailAction} from "../actions/resendEmailAction"

interface ResendEmailProps {
    ResendEmailText: string,
    ResendEmailButton: string,
    ResendCurrentEmail: string,
}

export const ResendEmail: React.FC<ResendEmailProps> = ({
    ResendEmailText,
    ResendEmailButton,
    ResendCurrentEmail
}) => {
  type Schema = z.infer<typeof SignInSchema>
  const [formData, setFormData] = useState<Schema>({} as Schema)

  const storedEmail = LoginStore(state => state.email);

  const resendEmail = (storedEmail: string) => {
    setFormData({ ...formData, email: storedEmail });
    console.log('stored Email: ', storedEmail);
    console.log('formData for email:', formData);
    resendEmailAction(formData);
  };

  return (
    <div className='flex flex-col items-center'>
      {ResendEmailText.split("\n").map((line: string, index: number) => (
        <p key={index}>{line}</p>
      ))}
      <p className='mr-auto mt-2 font-bold'>{ResendCurrentEmail}</p>
      <p>{storedEmail}</p>
      <button onClick={() => resendEmail(storedEmail)} className='w-[360px] h-12 px-6 py-4 bg-violet-900 active:bg-violet-700 rounded-3xl justify-center items-center gap-2 inline-flex'>
        <p className='text-center text-white text-sm font-semibold leading-none'>{ResendEmailButton}</p>
        </button>
    </div>
  );

}

