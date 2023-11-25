import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'

const Header = () => {
  const t = useTranslations("Header")
  return (
    <div>
      <Link href="/">{t('home link')}</Link>
      <Link href="/signin">{t('signIn link')}</Link>
    </div>
  )
}

export default Header