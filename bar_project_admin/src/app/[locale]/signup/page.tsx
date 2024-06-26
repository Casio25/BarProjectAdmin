import { LoginStore } from "../store/LoginStore"
import { useTranslations } from 'next-intl';
import { Link } from "@/navigation";
import React from 'react'
import { SignUpForm } from '../components/signUpForm';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChangeLanguage } from "../components/changeLanguage";



const SignUpPage = () => {
    const t = useTranslations("Register")
    return (
        <div className='flex flex-col bg-violet-900'>
            <ChangeLanguage />
        <div className="min-h-screen flex flex-col items-center justify-center bg-violet-900">
            <div className='mt-10 w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
                <button className="mr-auto border-2 border-violet-500 flex rounded-full active:ring-4 ">
                    <Link href="./signin"><ArrowBackIcon /></Link>
                </button>
                
                <h2 className='text-center font-semibold text-lg'>{t("signup title")}</h2>
                <SignUpForm
                    firstNamePlaceholder={t("first name placeholder")}
                    secondNamePlaceholder={t("second name placeholder")}
                    emailPlaceholder={t("email placeholder")}
                    passwordPlaceholder={t("password placeholder")}
                    confirmPasswordPlaceholder={t("confirm password placeholder")}
                    registerButton={t("register button")}
                    passwordRecommendation={t("password recommendation")}
                    registrationStatusSuccess={t("registration status success")}
                    registrationErrorUnknown={t("registration error")}
                    registrationErrorUserAlreadyExists={t("registration error (user already exists)")}
                    inputRequired={t("input required")}
                    passwordsDidNotMatch={t("passwords didn't match")}

                />
                
            </div>
        </div>
        </div>
    )
}

export default SignUpPage