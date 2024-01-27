import { useTranslations } from 'next-intl'
import React from 'react'
import { GetProductsComponent } from '../components/getProductsExel'
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
                Products={t("Products")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
            <div className='flex flex-col w-full items-center'>
                <div>
                    <p>Orders Page</p>
                    <GetProductsComponent/>
                </div>
                
            </div>
        </div>
    )
}
export default OrdersPage