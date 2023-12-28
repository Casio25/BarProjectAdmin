import React from 'react'
import { useTranslations } from 'next-intl';
import { ForgotPasswordForm } from '../components/forgotPasswordForm';
const ForgotPasswordPage = () => {
    const t = useTranslations("Forgot Password")
  return (
      <div className="min-h-screen flex items-center justify-center bg-violet-500">
          <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
              <h2 className='text-center font-semibold text-lg'>{t("forgot password title")}</h2>
              <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                  <p>{t("forgot password text")}</p>
                  <ForgotPasswordForm 
                      emailPlaceholder={t("email placeholder")}
                      forgotPasswordButton={t("forgot password button")}
                  />
              </div>

          </div>
      </div>
  )
}

export default ForgotPasswordPage