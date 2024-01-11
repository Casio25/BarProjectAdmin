"use client"
import React, { useState, useEffect } from "react";
import { InputAdornment, IconButton, TextField, Button, Checkbox } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { LoginStore } from "../store/LoginStore"
import { SignUpSchema } from "../validation/SignUp";
import { SignUpFormProps } from "../interface/SignUpInterface";
import { z } from "zod";
import { useRouter, redirect } from "@/navigation";
// Password Strength Imports
import { passwordStrength } from "check-password-strength";
import { Input } from "@nextui-org/react";
import { PasswordStrengthBar } from "../components/passwordStrengthBar"
import {signUpAction } from "../actions/signupAction"
import ReCAPTCHA from "react-google-recaptcha";
//recaptcha imports 


type Strength = 0 | 1 | 2 | 3;



export const SignUpForm: React.FC<SignUpFormProps> = ({
    firstNamePlaceholder,
    secondNamePlaceholder,
    emailPlaceholder,
    passwordPlaceholder,
    confirmPasswordPlaceholder,
    inputRequired,
    passwordsDidNotMatch,
    registerButton,
    passwordRecommendation,
    registrationStatusSuccess,
    registrationErrorUnknown,
    registrationErrorUserAlreadyExists,
}) => {
    type Schema = z.infer<typeof SignUpSchema>
    const [formData, setFormData] = useState<Schema>({} as Schema)
    const [firstNameError, setFirstNameError] = useState("")
    const [secondNameError, setSecondNameError] = useState("")
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const [registrationError, setRegistrationError] = useState("")
    const [registrationStatus, setRegistrationStatus] = useState("")
    //password strength usestates
    const [passwordStrengthBar, setPasswordStrengthBar] = useState<Strength>(0)
    const [inputedPassword, setInputedPassword] = useState("");
    const passwordSecurityLevel = passwordStrength(inputedPassword).value
    //store fucntions
    const updateEmail = LoginStore(state => state.updateEmail)
    const updateEmailError = LoginStore(state => state.updateEmailError)
    const updatePasswordError = LoginStore(state => state.updatePasswordError)
    const storedEmail = LoginStore(state => state.email)
    const storedEmailError = LoginStore(state => state.emailError)
    //recaptcha
    const [captcha, setCaptcha] = useState<string | null>();
    


    const router = useRouter()

    useEffect(() => {
        setPasswordStrengthBar(passwordStrength(inputedPassword).id as Strength)
    }, [passwordSecurityLevel, inputedPassword])


    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    const validateData = async (e: Schema) => {
        try {
            const result = SignUpSchema.safeParse(formData)
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
                            // Add more cases if needed
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
                            // Add more cases if needed
                            default:
                                setEmailError(validationError.email._errors[0]);
                        }
                    })()
                    : setEmailError("");
                validationError.firstName !== undefined
                    ? (() => {
                        switch (validationError.firstName._errors[0]) {
                            case "Required":
                                setFirstNameError(inputRequired);
                                break;
                            // Add more cases if needed
                            default:
                                setFirstNameError(validationError.firstName._errors[0]);
                        }
                    })()
                    : setFirstNameError("");
                validationError.secondName?._errors !== undefined
                    ? (() => {
                        switch (validationError.secondName._errors[0]) {
                            case "Required":
                                setSecondNameError(inputRequired);
                                break;
                            // Add more cases if needed
                            default:
                                setSecondNameError(validationError.secondName._errors[0]);
                        }
                    })()
                    : setSecondNameError("");

            } else if (passwordStrengthBar >= 2 && captcha) {
                setEmailError("")
                setPasswordError("")
                setConfirmPasswordError("")
                setFirstNameError("")
                setSecondNameError("")
                const response = await signUpAction(formData)
                console.log("formData: ", formData)
                
                if (response.error){
                    console.log(response.error)
                    switch(response.error){
                        case ("User already exists"):
                        setRegistrationError(registrationErrorUserAlreadyExists)
                        break
                        default:
                        setRegistrationError(registrationErrorUnknown)
                    }
                    
                } else {
                    setRegistrationError('');
                    setRegistrationStatus(registrationStatusSuccess);
                    updateEmail(formData.email);

                    // Use router.push for navigation
                    router.push('/confirm_registration');

                    // The code below will execute after the navigation is complete
                    console.log(storedEmail);
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
                    placeholder={firstNamePlaceholder}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}

                />
                <p className="mt-4 text-red-600">{firstNameError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={ secondNamePlaceholder }
                    onChange={(e) => setFormData({ ...formData, secondName: e.target.value })}

                />
                <p className="mt-4 text-red-600">{secondNameError}</p>
                <TextField
                    style={{ margin: '1rem 0', height: '2.5rem', padding: '0.5rem 1rem', width: '100%' }}
                    className="my-5 h-10 px-2 rounded-lg border border-slate-600 w-full"
                    placeholder={ emailPlaceholder}
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
                    placeholder={passwordPlaceholder }
                    onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setInputedPassword(e.target.value)

                    }}
                    type={passwordShown ? "text" : "password"}
                    inputProps={{
                        maxLength: 11,
                    }}
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
                    inputProps={{
                        maxLength: 11,
                    }}
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
                <ReCAPTCHA sitekey="6Le-JiwpAAAAAN3Z-d0XX0CWxpMJ7h0lP5Ue7p_2" onChange={setCaptcha} className="mt-10"/>

                <p className="mt-4 text-red-600">{confirmPasswordError}</p>
                <p className="mt-4 text-red-600 text-lg">{registrationError}</p>
                
                <button type="button" onClick={() => validateData(formData)} className='w-[360px] h-12 px-6 py-4 bg-violet-900 active:bg-violet-700 rounded-3xl justify-center items-center gap-2 inline-flex'>
                    <p className="text-center text-white text-sm font-semibold leading-none">{registerButton}</p>
                </button>

            </div>
        </form>
    );
};