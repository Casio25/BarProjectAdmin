import React from 'react'
import { useTranslations } from 'next-intl';
import { Link } from "@/navigation";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { UserErrorIcon } from '../components/svgs';

const UserErrorPage = () => {
    const t = useTranslations("User Error")
  return (
      <div className="min-h-screen flex items-center justify-center bg-violet-900">
          <div className='mt-10 w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
              <button className="mr-auto border-2 border-violet-500 flex rounded-full active:ring-4 ">
                  <Link href="./signin"><ArrowBackIcon /></Link>
              </button>

              <UserErrorIcon />
              <h2 className='text-center font-semibold text-lg'>{t("error title")}</h2>
              <p>{t("error text")}</p>

              

          </div>
      </div>
  )
}
export default UserErrorPage
