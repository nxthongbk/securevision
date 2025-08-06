import Backend from 'i18next-http-backend';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: localStorage.getItem('cft-language')?.toString() ?? 'en',
    backend: {
      loadPath: `${publicUrl}/i18n/{{lng}}.json`
    },
    fallbackLng: 'en',
    defaultNS: 'translations'
  });

export default i18next;
