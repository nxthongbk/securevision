import { useTranslation } from 'react-i18next';

export const translation = (text: string, keyPrefix?: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [t] = useTranslation('', { keyPrefix: keyPrefix });
  return t(text);
};

export const capitalizedFirst = (text: string) => {
  return text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
};

export const translationCapitalFirst = (text: string, keyPrefix?: string) => {
  return capitalizedFirst(translation(text, keyPrefix));
};
