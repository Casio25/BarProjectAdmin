import { useTranslations } from 'next-intl';
import SideNavBar from './components/sideNavBar';

export default function Home() {
  const t = useTranslations('Home');
  return (
    <div>
      <h1>{t('title')}</h1>
      <SideNavBar />
    </div>
  );
}
