import { useTranslations } from 'next-intl';
import React from 'react'

const SingInPage = () => {
  const t = useTranslations("SignIn")
  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  )
}

export default SingInPage