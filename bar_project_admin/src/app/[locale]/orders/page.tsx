import { useTranslations } from 'next-intl'
import React from 'react'
import SideNavBar from '../components/sideNavBar'
const OrdersPage = () => {
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
            <div className='flex flex-col w-full items-center'>
                <p>Orders Page</p>
                <button className='h-12 px-6 py-3 bg-violet-900 active:bg-violet-700 rounded-3xl flex-col justify-center items-center gap-2'>
                    <p className='text-white text-sm font-semibold'>Get Orders</p>
                </button>
            </div>
        </div>
    )
}
export default OrdersPage