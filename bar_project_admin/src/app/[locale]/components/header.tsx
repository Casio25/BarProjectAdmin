import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ChangeLanguage } from './changeLanguage'

const Header = () => {
  const t = useTranslations("Header")

  return (
    <div className='flex p-2'>
      <div className='space-x-2'>
        <Link href="/">{t('home link')}</Link>
        <Link href="/signin">{t('signIn link')}</Link>
      </div>
      <div className='ml-auto'>
        <ChangeLanguage />
      </div>
    </div>
  )
}

export default Header