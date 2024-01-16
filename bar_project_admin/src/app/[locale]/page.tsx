import { useTranslations } from 'next-intl';
import SideNavBar from './components/sideNavBar';

export default function Home() {
  const h = useTranslations('Home');
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
      <h1>{h('title')}</h1>
    </div>
  );
}
