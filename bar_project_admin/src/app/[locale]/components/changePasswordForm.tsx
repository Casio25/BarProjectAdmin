"use client"
import React, { useEffect, useState } from 'react'
import { InputAdornment, IconButton, TextField, Button } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ChangePasswordAction } from '../actions/changePasswordAction';
import LockIcon from '@mui/icons-material/Lock';
import { ChangePasswordSchema } from "../validation/ChangePassword";
import { useRouter } from "@/navigation";
import { z } from "zod";
// Password Strength Imports
import { passwordStrength } from "check-password-strength";
import { Input } from "@nextui-org/react";
import { PasswordStrengthBar } from "../components/passwordStrengthBar"
import { ChangePasswordInterface } from '../interface/ChangePasswordInterface';


interface ChangePasswordFormProps {

    newPasswordPlaceholder: string
    confirmPasswordPlaceholder: string,
    changePasswordButton: string
    inputRequired: string
    passwordsDidNotMatch: string
    passwordRecommendation: string
    changeStatusSuccess: string
    changeErrorUnknown: string
}

type Strength = 0 | 1 | 2 | 3;

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
    newPasswordPlaceholder,
    confirmPasswordPlaceholder,
    changePasswordButton,
    inputRequired,
    passwordsDidNotMatch,
    passwordRecommendation,
    changeStatusSuccess,
    changeErrorUnknown
}) => {
    type Schema = z.infer<typeof ChangePasswordSchema>
    const [formData, setFormData] = useState<Schema>({} as Schema)
    const [email, setEmail] = useState("")
    const [passwordError, setPasswordError] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [changeError, setChangeError] = useState("");
    const [changeStatus, setChangeStatus] = useState("")
    //password strength usestates
    const [passwordStrengthBar, setPasswordStrengthBar] = useState<Strength>(0)
    const [inputedPassword, setInputedPassword] = useState("");
    const passwordSecurityLevel = passwordStrength(inputedPassword).value

    const router = useRouter()

    useEffect(() => {
        setPasswordStrengthBar(passwordStrength(inputedPassword).id as Strength)
    }, [passwordSecurityLevel, inputedPassword])


    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const validateData = async (e: Schema) => {
        try {
            const result = ChangePasswordSchema.safeParse(formData)
            if (!result.success) {
                const validationError = result.error.format()
                console.log(validationError)
                validationError._errors !== undefined
                    ? (() => {
                        switch (validationError._errors[0]) {
                            case "Required":
                                setConfirmPasswordError(inputRequired);
                                break;
                            case "The passwords did not match":
                                setConfirmPasswordError(passwordsDidNotMatch);
                                break;
                            default:
                                setConfirmPasswordError(validationError._errors[0]);
                        }
                    })()
                    : setConfirmPasswordError("");
                validationError.password !== undefined
                    ? (() => {
                        switch (validationError.password._errors[0]) {
                            case "Required":
                                setPasswordError(inputRequired);
                                break;
                            default:
                                setPasswordError(validationError.password._errors[0]);
                        }
                    })()
                    : setPasswordError("");
            } else if (passwordStrengthBar >= 2 ) {
                setPasswordError("")
                setConfirmPasswordError("")
                const response = await ChangePasswordAction(formData)
                console.log("formData: ", formData)

                if (response.error) {
                    console.log(response.error)
                    switch (response.error) {
                        case ("User already exists"):
                            break
                        default:
                            setChangeError(changeErrorUnknown)
                    }

                } else {
                    setChangeError('');
                    setChangeStatus(changeStatusSuccess);

                    // Use router.push for navigation
                    router.push('/signin');

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
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={newPasswordPlaceholder}
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
                    inputedPassword ? (
                        <div>
                            <div className="items-center">
                                <div className="flex items-center">
                                    <PasswordStrengthBar strength={passwordStrengthBar} />
                                </div>

                            </div>
                            <div>
                                {passwordStrengthBar < 2 && (
                                    <div className="bg-yellow-400 rounded-md mt-2">
                                        {passwordRecommendation.split('\n').map((line, index) => (
                                            <p key={index} className="mb-1">{line}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    ) : null
                }

                <p className="mt-4 text-red-600">{passwordError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={confirmPasswordPlaceholder}
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
                <button type="button" onClick={() => validateData(formData)} className='w-80 mt-8  py-2 text-center font-semibold text-lg bg-cyan-300 hover:bg-cyan-500 active:bg-cyan-700 rounded-xl'>{changePasswordButton}</button>

            </div>
        </form>
    )
}