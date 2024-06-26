import { Link } from '@/navigation'
import { useTranslations } from 'next-intl'
import React from 'react'
import { ChangeLanguage } from './changeLanguage'
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';


const Header = () => {
  const t = useTranslations("Header")

  return (
    <div className='flex'>
      <div className='space-x-2'>
        <Navbar fluid rounded>

          <div className="flex sm:order-2">
            <NavbarToggle />
          </div>
          
            <NavbarCollapse>
              <Link className=' text-lg ' href="/">{t('home link')}</Link>
            <Link className=' text-lg'  href="/signin">{t('signin link')}</Link>

            </NavbarCollapse>
          
        </Navbar>

      </div>
      
    </div>
  )
}

export default Header