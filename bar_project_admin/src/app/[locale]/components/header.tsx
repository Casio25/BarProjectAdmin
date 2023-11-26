import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ChangeLanguage } from './changeLanguage'

const Header = () => {
  const t = useTranslations("Header")

  return (
    <div>
      <Link href="/">{t('home link')}</Link>
      <Link href="/signin">{t('signIn link')}</Link>
      <ChangeLanguage/>
    </div>
  )
}

export default Header