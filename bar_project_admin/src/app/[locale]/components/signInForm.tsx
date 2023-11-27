"use client"
import React, { useState } from "react";
import { InputAdornment, IconButton, TextField, Button} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import {LoginStore} from "../store/LoginStore"

interface SignInFormProps {
    emailPlaceholder: string;
    passwordPlaceholder: string;
    loginButton: string;
    signupButton: string
    or: string
}

export const SignInForm: React.FC<SignInFormProps> = ({
    emailPlaceholder,
    passwordPlaceholder,
    loginButton,
    signupButton,
    or,
}) => {
    const [passwordShown, setPasswordShown] = useState(false);
    const updateEmail = LoginStore(state=>state.updateEmail)
    const email = LoginStore(state => state.email)

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <form>
            <div className="w-full flex flex-col items-center max-w-md p-6 bg-purple-100 rounded-lg shadow-lg'">
                <TextField
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={emailPlaceholder}
                    onChange={(e)=> updateEmail(e.target.value)}
                    InputProps={{startAdornment: (
                        <InputAdornment position="start">
                            <EmailIcon />
                        </InputAdornment>
                    )}}
                />
                <TextField
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={passwordPlaceholder}
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
                <button type="button" className='w-80 mt-4  py-2 text-center font-semibold text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{loginButton}</button>
                <p className='py-2'>{or}</p>
                <button type="button" className='w-80  py-2 text-center  text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{signupButton}</button>
            </div>
        </form>
    );
};