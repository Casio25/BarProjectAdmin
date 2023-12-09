import React from 'react'
import { useTranslations } from 'next-intl';
import { ResendEmail } from '../components/resendEmail';

const SuccessfullRegistrationPage = () => {
    const t = useTranslations("Successfull Registration")
    const r = useTranslations("Resend Email")
  return (
      <div className="min-h-screen flex items-center justify-center bg-violet-500">
          <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
              <h2 className='text-center font-semibold text-lg'>{t("sucreg title")}</h2>
              <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                <p>{t("sucreg text")}</p>
                <ResendEmail
                      ResendEmailText={r("resend email text")}
                      ResendEmailButton={r("resend email button")} />
              </div>
              
          </div>
      </div>
  )
}

export default SuccessfullRegistrationPage