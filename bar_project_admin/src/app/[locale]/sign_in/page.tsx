import { LoginStore } from "../store/LoginStore"
import { useTranslations } from 'next-intl';
import React from 'react'
import { SignInForm } from '../components/signInForm';
import { ChangeLanguage } from "../components/changeLanguage";



const SignInPage = () => {
    const t = useTranslations("SignIn")
    return (
        <div className='flex flex-col bg-violet-900'>
            <ChangeLanguage />
            <div className="min-h-screen flex flex-col items-center justify-center bg-violet-900">
                <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-xl shadow-xl'>

                    <SignInForm
                        emailPlaceholder={t("email placeholder")}
                        passwordPlaceholder={t("password placeholder")}
                        loginButton={t("login button")}
                        signupButton={t("signup button")}
                        forgotPasswordButton={t("forgot password button")}
                        inputRequired={t("input required")}
                        invalidEmail={t("invalid email")}
                        shortPasswordError={t("password is short")}
                        longPasswordError={t("password is long")}
                        signinError={t("signin error")}
                        signinErrorWrongEmail={t("signin error (wrong email)")}
                        signinErrorWrongPassword={t("signin error (wrong password)")}
                        or={t("or")}
                    />
                </div>
            </div>
        </div>
    )
}

export default SignInPage