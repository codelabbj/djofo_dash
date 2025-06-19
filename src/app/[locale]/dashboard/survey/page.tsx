import { useTranslations } from 'next-intl';

export default function SurveyPage() {
  const t = useTranslations();
  return <div>{t('Bientôt disponible')}</div>;
} 