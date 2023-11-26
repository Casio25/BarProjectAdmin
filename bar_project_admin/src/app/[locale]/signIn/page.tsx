
import { useTranslations } from 'next-intl';
import React from 'react'
import { SignInForm } from '../components/signInForm';

interface IParams {
  params: {
  email: string,
  password: string
  }
}

const SingInPage = ({params}: IParams) => {
  const t = useTranslations("SignIn")
  return (
    <div className="min-h-screen flex items-center justify-center bg-teal-400">
      <div className='w-full max-w-md p-6 bg-purple-100 rounded-lg shadow-lg'>
        <h2 className='text-center font-semibold text-lg'>{t("title")}</h2>
        <SignInForm
          emailPlaceholder={t("email placeholder")}
          passwordPlaceholder={t("password placeholder")}
        />
        <button className='py-1 px-7 text-center font-semibold text-lg bg-cyan-500 rounded-xl'>{t("login button")}</button>
      </div>

    </div>
  )
}

export default SingInPage