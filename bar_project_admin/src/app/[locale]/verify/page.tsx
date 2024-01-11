import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { VerifyEmail } from '../components/verifyEmail';

const VerifyPage = () => {
  const t = useTranslations("Verify Email")

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-500">
      <div className='mt-10 w-full flex flex-col items-center max-w-md p-6 bg-white rounded-lg shadow-lg'>
        <VerifyEmail
          VerifyEmailSuccess={t("verify email success")}
          VerifyEmailFail={t("verify email fail")} />
      </div>
    </div>
  );
}

export default VerifyPage;

