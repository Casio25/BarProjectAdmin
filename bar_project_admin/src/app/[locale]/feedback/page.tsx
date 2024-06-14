import React from 'react'
import SideNavBar from '../components/sideNavBar'
import { useTranslations } from 'next-intl';
const FeedbackPage = () => {
    const t = useTranslations("SideNavBar")
    return (
        <div className='flex'>
            <SideNavBar
            Promotions={t("Promotions")}
            Orders={t("Orders")}
            Home={t("Home")}
            PaymentDetails = {t("PaymentDetails")}
            Products={t("Products")}
            FAQ={t("FAQ")}
            Settings={t("Settings")}
            Feedback={t("Feedback")} />
            <p>Feedback page</p>
        </div>
    )
}
export default FeedbackPage