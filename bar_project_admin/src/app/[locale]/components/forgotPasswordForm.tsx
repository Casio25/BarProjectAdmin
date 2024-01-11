"use client"
import React, {useState} from 'react'
import { InputAdornment, IconButton, TextField, Button } from "@mui/material";
import { z } from "zod"
import { ForgotPasswordSchema } from '../validation/ForgotPassword';
import { Schema, Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import { forgotPasswordAction } from "../actions/forgotPasswordAction"


interface ForgotPasswordFormProps{
    emailPlaceholder: string
    forgotPasswordButton: string
}


export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    emailPlaceholder,
    forgotPasswordButton
}) => {
    type Schema = z.infer<typeof ForgotPasswordSchema>
    const [formData, setFormData] = useState<Schema>({} as Schema)
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")

    const validateData = async(formData: Schema) => {
        const res = await forgotPasswordAction(formData)
        console.log(formData)
    }
  return (
      <form>
          <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
              <TextField
                type="string"
                  style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                  className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                  placeholder={emailPlaceholder}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{
                      startAdornment: (
                          <InputAdornment position="start">
                              <EmailIcon />
                          </InputAdornment>
                      )
                  }}
              />
              <p className="mt-4 text-red-600">{emailError}</p>
              <button type="button" onClick={() => validateData(formData)} className='w-[360px] h-12 px-6 py-4 bg-violet-900 active:bg-violet-700 rounded-3xl justify-center items-center gap-2 inline-flex'>
                  <p className='text-center text-white text-sm font-semibold leading-none'>{forgotPasswordButton}</p>
              </button>
             
          </div>
      </form>
  )
}

