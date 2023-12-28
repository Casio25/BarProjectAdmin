import React from 'react'
import { useTranslations } from 'next-intl';
import { ChangePasswordForm } from '../components/changePasswordForm';
const ChangePasswordPage = () => {
    const t = useTranslations("Change Password")
    return (
        <div className="min-h-screen flex items-center justify-center bg-violet-500">
            <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
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