"use client"
import React, { useState, useEffect } from "react";
import { InputAdornment, IconButton, TextField, Button} from "@mui/material";
import { Schema, Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {LoginStore} from "../store/LoginStore"
import {SignInSchema} from "../validation/SignIn";
import { SignInFormProps } from "../interface/SignInInterface";
import { signInAction } from "../actions/signinAction";
import {z} from "zod"
import { Link } from "@/navigation";


export const SignInForm: React.FC<SignInFormProps> = ({
    emailPlaceholder,
    passwordPlaceholder,
    loginButton,
    signupButton,
    inputRequired,
    invalidEmail,
    shortPasswordError,
    longPasswordError,
    or,
}) => {
    type Schema = z.infer<typeof SignInSchema>
    const [formData, setFormData] = useState<Schema>({} as Schema)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const updateEmail = LoginStore(state=>state.updateEmail)
    const updateJwtToken = LoginStore(state=>state.updateJwtToken)
    const updateEmailError = LoginStore(state=>state.updateEmailError)
    const updatePasswordError = LoginStore(state=>state.updatePasswordError)
    const storedEmail = LoginStore(state => state.email)
    const storedEmailError = LoginStore(state => state.emailError)


    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const validateData = async (e: Schema) => {
        try {
            const result = SignInSchema.safeParse(formData)
            if (!result.success) {
                const validationError = result.error.format()
                validationError.password !== undefined
                    ? (() => {
                        switch (validationError.password._errors[0]) {
                            case "Required":
                                setPasswordError(inputRequired)
                                break;
                            case "String must contain at least 8 character(s)":
                                setPasswordError(shortPasswordError)
                                break;
                            case "String must contain at most 20 character(s)":
                                setPasswordError(longPasswordError)
                                break;
                            // Add more cases if needed
                            default:
                                setPasswordError(validationError.password._errors[0]);
                        }
                    })()
                    : setPasswordError("");
                validationError.email !== undefined
                    ? (() => {
                        switch (validationError.email._errors[0]) {
                            case "Required":
                                setEmailError(inputRequired);
                                break;
                            case "Invalid email":
                                setEmailError(invalidEmail);
                                break;
                            // Add more cases if needed
                            default:
                                setEmailError(validationError.email._errors[0]);
                        }
                    })()
                    : setEmailError("");
            }else{
                setEmailError("")
                setPasswordError("")
                const response = await signInAction(formData)
                if (response.error){
                    console.log(response.error)
                }else{
                    console.log("success")
                    console.log(response.access_token)
                    updateJwtToken(response.access_token)
                }
            }
        }catch (error){
            console.log(error)
        }
    }

    return (
        <form>
            <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={ emailPlaceholder}
                    onChange={(e)=> setFormData({...formData, email: e.target.value})}
                    InputProps={{startAdornment: (
                        <InputAdornment position="start">
                            <EmailIcon />
                        </InputAdornment>
                    )}}
                />
                <p className="mt-4 text-red-600">{emailError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={passwordPlaceholder}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type={passwordShown ? "text" : "password"}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={togglePassword}>
                                    {passwordShown ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        )
                    }
                }
                />
                <p className="mt-4 text-red-600">{passwordError}</p>
                <button type="button" onClick={()=> validateData(formData)} className='w-80 mt-8  py-2 text-center font-semibold text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{loginButton}</button>
                <p className='py-2'>{or}</p>
                <Link href="./signup">
                    <button type="button" className='w-80  py-2 text-center  text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{signupButton}</button>
                </Link>
            </div>
        </form>
    );
};