"use client"
import React, { useState, useEffect } from "react";
import { InputAdornment, IconButton, TextField, Button, Checkbox } from "@mui/material";
import {Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { LoginStore } from "../store/LoginStore"
import { SignUpSchema } from "../validation/SignUp";
import { z } from "zod";
// Password Strength Imports
import {passwordStrength} from "check-password-strength";
import {Input} from "@nextui-org/react";
import {PasswordStrengthBar} from "../components/passwordStrengthBar"

type Strength = 0 | 1 | 2 | 3;

interface SignUpFormProps {
    firstNamePlaceholder: string;
    secondNamePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    registerButton: string
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
    firstNamePlaceholder,
    secondNamePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    confirmPasswordPlaceholder,
    registerButton,
}) => {
    type Schema = z.infer<typeof SignUpSchema>
    const [formData, setFormData] = useState<Schema>({} as Schema)
    const [firstNameError, setFirstNameError] = useState("")
    const [secondNameError, setSecondNameError] = useState("")
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    //password strength usestates
    const [passwordStrengthBar, setPasswordStrengthBar] = useState<Strength>(0)
    const [inputedPassword, setInputedPassword] = useState("");
    const passwordSecurityLevel = passwordStrength(inputedPassword).value

    const updateEmail = LoginStore(state => state.updateEmail)
    const updateEmailError = LoginStore(state => state.updateEmailError)
    const updatePasswordError = LoginStore(state => state.updatePasswordError)
    const storedEmail = LoginStore(state => state.email)
    const storedEmailError = LoginStore(state => state.emailError)

    useEffect(() => {
        setPasswordStrengthBar(passwordStrength(inputedPassword).id as Strength)
    }, [passwordSecurityLevel, inputedPassword])


    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    

    const validateData = (e: Schema) => {
        try {
            const result = SignUpSchema.safeParse(formData)
            if (!result.success) {
                const validationError = result.error.format()
                console.log(validationError)
                validationError._errors !== undefined
                    ? setConfirmPasswordError(validationError._errors[0])
                    : setConfirmPasswordError("")
                validationError.password !== undefined
                    ? setPasswordError(validationError.password._errors[0])
                    : setPasswordError("")
                validationError.email !== undefined
                    ? setEmailError(validationError.email._errors[0])
                    : setEmailError("")
                validationError.firstName !== undefined
                    ? setFirstNameError(validationError.firstName._errors[0])
                    : setFirstNameError("")
                validationError.secondName?._errors !== undefined
                    ? setSecondNameError(validationError.secondName._errors[0])
                    : setSecondNameError("")
            } else {
                setEmailError("")
                setPasswordError("")
                setConfirmPasswordError("")
                setFirstNameError("")
                setSecondNameError("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form>
            <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={firstNameError == "" ? firstNamePlaceholder : firstNameError}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}

                />
                <p className="mt-4 text-red-600">{firstNameError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={secondNameError == "" ? secondNamePlaceholder : secondNameError}
                    onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}

                />
                <p className="mt-4 text-red-600">{secondNameError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={emailError == "" ? emailPlaceholder : emailError}
                    onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        
                    }}
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
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={passwordError == '' ? passwordPlaceholder : passwordError}
                    onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setInputedPassword(e.target.value)
                        
                    }}
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
                {
                    inputedPassword ?
                    <div>
                        <PasswordStrengthBar strength={passwordStrengthBar}/>
                    </div>
                    : <div>Obama</div>
                }
                <p className="mt-4 text-red-600">{passwordError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={passwordError == '' ? confirmPasswordPlaceholder : passwordError}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                <p className="mt-4 text-red-600">{confirmPasswordError}</p>
                <button type="button" onClick={() => validateData(formData)} className='w-80 mt-8  py-2 text-center font-semibold text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{registerButton}</button>
                
            </div>
        </form>
    );
};