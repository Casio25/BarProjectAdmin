"use client"
import { cookies } from 'next/headers'
import React, { useState, useEffect } from "react";
import { InputAdornment, IconButton, TextField, Button } from "@mui/material";
import { Schema, Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { LoginStore } from "../store/LoginStore"
import { SignInSchema } from "../validation/SignIn";
import { SignInFormProps } from "../interface/SignInInterface";
import { signInAction } from "../actions/signinAction";
import { z } from "zod"
import { Link, useRouter } from "@/navigation";
import { profileAction } from "../actions/profile";


export const SignInForm: React.FC<SignInFormProps> = ({
    emailPlaceholder,
    passwordPlaceholder,
    loginButton,
    signupButton,
    forgotPasswordButton,
    inputRequired,
    invalidEmail,
    shortPasswordError,
    longPasswordError,
    signinError,
    signinErrorWrongEmail,
    signinErrorWrongPassword,
    or,

}) => {
    type Schema = z.infer<typeof SignInSchema>
    const [formData, setFormData] = useState<Schema>({} as Schema)
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const updateEmail = LoginStore(state => state.updateEmail)
    const updateEmailError = LoginStore(state => state.updateEmailError)
    const updatePasswordError = LoginStore(state => state.updatePasswordError)
    const storedEmail = LoginStore(state => state.email)
    const storedEmailError = LoginStore(state => state.emailError)

    const router = useRouter()


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
            } else {
                setEmailError("")
                setPasswordError("")
                const response = await signInAction(formData)
                console.log("response", response)
                if (response.error) {
                    switch (response.message) {
                        case "Wrong password":
                            setPasswordError(signinErrorWrongPassword);
                            break;
                        case "User with this email doesn't exist":
                            setEmailError(signinErrorWrongEmail)
                            break;
                        default:
                            setEmailError(signinError)
                    }
                } else {
                    
                    const profileResponse = await profileAction(response.access_token)
                    console.log ("profileData", profileResponse)
                    if (!profileResponse.isEmailConfirmed) {
                        
                        updateEmail(formData.email);
                        router.push('/confirm_registration');
                    }else{
                        router.push("/")
                    }
                }

            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form>
            <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', width: '100%', }}
                    className="my-5 h-10 px-2 py-6 rounded-lg border border-slate-600 w-full"
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
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', width: '100%' }}
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
                <Link className="flex mb-4 my-2 mr-auto" href="./forgot_password">
                    <p className='text-zinc-900 text-sm font-normal underline leading-none'>{forgotPasswordButton}</p>
                </Link>
                <button type="button" onClick={() => validateData(formData)} className='w-[360px] h-12 px-6 py-4 bg-violet-900 active:bg-violet-700 rounded-3xl justify-center items-center gap-2 inline-flex'>
                    <p className="text-center text-white text-sm font-semibold font-['Work Sans'] leading-none">{loginButton}</p>
                </button>
                <div className="flex">
                    <p className="w-32 my-5 h-px bg-neutral-200" />
                    <p className='py-2 mx-4'>{or}</p>
                    <p className="w-32 my-5 h-px bg-neutral-200" />
                </div>
                <Link href="./signup">
                    <button type="button" className='w-[360px] h-12 px-6 py-4 rounded-3xl border border-violet-900 justify-center items-center gap-2 inline-flex'>
                        <p className="text-center text-violet-900 text-sm font-semibold font-['Work Sans'] leading-none">{signupButton}</p>
                    </button>
                </Link>
                
            </div>
        </form>
    );
};