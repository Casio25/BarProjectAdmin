import React from 'react'
import { useTranslations } from 'next-intl';
import { ForgotPasswordForm } from '../components/forgotPasswordForm';
import { Link } from "@/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChangeLanguage } from '../components/changeLanguage';
const ForgotPasswordPage = () => {
    const t = useTranslations("Forgot Password")
  return (
      <div className='flex flex-col bg-violet-900'>
          <ChangeLanguage />
      <div className="min-h-screen flex flex-col items-center justify-center bg-violet-900">
        
          <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
              <button className="mr-auto border-2 border-violet-500 flex rounded-full active:ring-4 ">
                  <Link href="./sign_in"><ArrowBackIcon /></Link>
              </button>
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
      </div>
  )
}

export default ForgotPasswordPage