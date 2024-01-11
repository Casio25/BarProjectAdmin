import React from 'react'
import { useTranslations } from 'next-intl';
import { ChangePasswordForm } from '../components/changePasswordForm';
import { Link } from "@/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const ChangePasswordPage = () => {
    const t = useTranslations("Change Password")
    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-900">
            <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
                <button className="mr-auto border-2 border-violet-500 flex rounded-full active:ring-4 ">
                    <Link href="./signin"><ArrowBackIcon /></Link>
                </button>
                <h2 className='text-center font-semibold text-lg'>{t("change password title")}</h2>
                <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                    <ChangePasswordForm
                        newPasswordPlaceholder={t("new password placeholder")}
                        changePasswordButton={t("change password button")}
                        confirmPasswordPlaceholder={t("confirm password placeholder")}
                        inputRequired={t("input required")}
                        passwordsDidNotMatch={t("passwords didn't match")}
                        passwordRecommendation={t("password recommendation")}
                        changeErrorUnknown={t("change password error")}
                        changeStatusSuccess={t("change password success")}
                    />
                </div>

            </div>
        </div>
    )
}

export default ChangePasswordPage