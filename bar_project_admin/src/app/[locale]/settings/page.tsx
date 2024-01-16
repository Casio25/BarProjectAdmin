import React from 'react'
import PageNavigation from '../components/pageNavigation'
import SideNavBar from '../components/sideNavBar'
import { useTranslations } from 'next-intl';
import { ChangeLanguage } from '../components/changeLanguage';
const SettingsPage = () => {
    const t = useTranslations("SideNavBar")
    return (
        <div className='flex'>
            <SideNavBar
                Promotions={t("Promotions")}
                Orders={t("Orders")}
                Home={t("Home")}
                PaymentDetails={t("PaymentDetails")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
            <ChangeLanguage/>
        </div>
    )
}

export default SettingsPage