import React from 'react'
import PageNavigation from '../components/pageNavigation'
import SideNavBar from '../components/sideNavBar'
import { useTranslations } from 'next-intl';
import { ChangeLanguage } from '../components/changeLanguage';
import { UnSignInComponent } from '../components/unSignInComponent';
const SettingsPage = () => {
    const t = useTranslations("SideNavBar")
    return (
        <div className='flex'>
            <SideNavBar
                Promotions={t("Promotions")}
                Orders={t("Orders")}
                Home={t("Home")}
                PaymentDetails={t("PaymentDetails")}
                Products={t("Products")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
            <ChangeLanguage color='blue'/>
            {/* <UnSignInComponent/> */}
        </div>
    )
}

export default SettingsPage