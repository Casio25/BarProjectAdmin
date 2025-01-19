import { useTranslations } from 'next-intl';
import SideNavBar from './components/sideNavBar';
import { VenueStore } from './store/venueStore';

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
        Products={t("Products")}
        FAQ={t("FAQ")}
        Settings={t("Settings")}
        Feedback={t("Feedback")} />
      <div>
        <h1 className='font-semibold p-6'>Головна сторінка сервісу Bar Admin</h1>
        <p className='p-6'>Наш сервіс - це сучасний веб-додаток, що надає можливість користувачам замовляти
           та переглядати продукти за допомогою інтуїтивного і зручного інтерфейсу. 
           Він також включає у себе функціонал управління замовленнями та категоріями продуктів
            для адміністраторів. Наш сервіс побудований на основі сучасних технологій,
             що забезпечують його ефективність, надійність та швидкодію.</p>
        </div>
      
    </div>
  );
}
