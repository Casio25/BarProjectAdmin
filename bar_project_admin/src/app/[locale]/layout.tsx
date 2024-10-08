import type { Metadata } from 'next'
import { Inter, Work_Sans, Montserrat } from 'next/font/google'

import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import Header from './components/header'
import  Cookies  from './components/cookies'
import './globals.css'
import { Providers } from './providers'
import { ChangeLanguage } from './components/changeLanguage'
import { LoginStore } from './store/LoginStore'
import { LoginStoreComponent } from './components/LoginStoreComponent'
import 'react-image-crop/dist/ReactCrop.css'


const inter = Montserrat({ subsets: ['latin', 'cyrillic'] })


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

const locales = ['en', 'ua']
export default function RootLayout({
  children
}: {
  children: React.ReactNode
  params: any
}) {
  const locale = useLocale()
if (!locales.includes(locale as any)) notFound();
  return (

    <html lang={locale}>
      <body className={inter.className}>
        <Providers>
        {children}
        <Cookies/>
        </Providers>
        </body>
    </html> 

  )
}
