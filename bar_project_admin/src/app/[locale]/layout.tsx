import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import Header from './components/header'
import './globals.css'
import SingInPage from './signIn/page'

const inter = Inter({ subsets: ['latin'] })

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
        {children}
        </body>
    </html>
  )
}
