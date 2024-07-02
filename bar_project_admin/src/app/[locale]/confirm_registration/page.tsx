import React from 'react'

import { useTranslations } from 'next-intl';
import { ResendEmail } from '../components/resendEmail';
import { ConfirmEmailIcon } from '../components/svgs';
import { Link } from "@/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ChangeLanguage } from '../components/changeLanguage';


const ConfirmRegistrationPage = () => {
    const t = useTranslations("Successfull Registration")
    const r = useTranslations("Resend Email")
  return (
      <div className='flex flex-col bg-violet-900'>
          <ChangeLanguage />
      <div className="min-h-screen flex flex-col items-center justify-center bg-violet-900">
          <div className='w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
              <button className="mr-auto border-2 border-violet-500 flex rounded-full active:ring-4 ">
                  <Link href="./sign_in"><ArrowBackIcon /></Link>
              </button>
              <ConfirmEmailIcon/>
              <h2 className='text-center font-semibold text-lg'>{t("sucreg title")}</h2>
              <div className="w-full flex flex-col items-center max-w-md p-6 rounded-lg shadow-lg'">
                <p className='my-2'>{t("sucreg text")}</p>
                <ResendEmail
                      ResendEmailText={r("resend email text")}
                      ResendEmailButton={r("resend email button")}
                      ResendCurrentEmail={r("resend current email")} />
              </div>
              
          </div>
      </div>
      </div>
  )
}

export default ConfirmRegistrationPage