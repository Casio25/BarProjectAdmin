import { LoginStore } from "../store/LoginStore"
import { useTranslations } from 'next-intl';
import React from 'react'
import { SignUpForm } from '../components/signUpForm';



const SingInPage = () => {
    const t = useTranslations("Register")
    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-500">
            <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
                <h2 className='text-center font-semibold text-lg'>{t("signup title")}</h2>
                <SignUpForm
                    firstNamePlaceholder={t("first name placeholder")}
                    secondNamePlaceholder={t("second name placeholder")}
                    emailPlaceholder={t("email placeholder")}
                    passwordPlaceholder={t("password placeholder")}
                    confirmPasswordPlaceholder={t("confirm password placeholder")}
                    registerButton={t("register button")}
                    passwordRecommendation={t("password recommendation")}
                />
            </div>
        </div>
    )
}

export default SingInPage