import React from 'react'
import  PageNavigation  from '../components/pageNavigation'
import SideNavBar from '../components/sideNavBar'
import { useTranslations } from 'next-intl';
const PromotionPage = () => {
  const t = useTranslations("Promotion Page Header")
  const s = useTranslations("SideNavBar")
  const promotionItems = [
    { link: "/promotions/new", label: `${t("prom header new")}`},
    {link: "/promotions/accepted", label: `${t("prom header accepted")}`},
    {link: "/promotions/finished", label: `${t("prom header finished")}` }
  ];
  return (
    <div className='flex'>
      <SideNavBar
        Promotions={s("Promotions")}
        Orders={s("Orders")}
        Home={String("Home")}
        PaymentDetails={s("PaymentDetails")}
        Products={t("Products")}
        FAQ={s("FAQ")}
        Settings={s("Settings")}
        Feedback={s("Feedback")} />
      <PageNavigation items={promotionItems}/>
    </div>
  )
}
export default PromotionPage
