import { useTranslations } from 'next-intl'
import React from 'react'
import { GetProductsExel} from '../components/getProductsExel'
import OrdersMenu from '../components/ordersMenu'
import SideNavBar from '../components/sideNavBar'

const OrdersPage = () => {
    const t = useTranslations("SideNavBar")
    
    return (
        <div className='flex w-full min-h-screen bg-zinc-100'>
            <SideNavBar
                Promotions={t("Promotions")}
                Orders={t("Orders")}
                Home={t("Home")}
                PaymentDetails={t("PaymentDetails")}
                Products={t("Products")}
                FAQ={t("FAQ")}
                Settings={t("Settings")}
                Feedback={t("Feedback")} />
            <OrdersMenu/>
        </div>
    )
}
export default OrdersPage