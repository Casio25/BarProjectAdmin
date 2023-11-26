"use client"
import React, { useState } from "react";
import { InputAdornment, IconButton, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface SignInFormProps {
    emailPlaceholder: string;
    passwordPlaceholder: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
    emailPlaceholder,
    passwordPlaceholder,
}) => {
    const [passwordShown, setPasswordShown] = useState(false);

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <form>
            <div className="p-7">
                <TextField
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={emailPlaceholder}
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
                    }
                }
                />
            </div>
        </form>
    );
};