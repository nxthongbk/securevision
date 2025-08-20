import { MenuItem, Typography } from '@mui/material';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import SelectCustom from '~/components/SelectCustom';
import { LANG_OPTIONS } from '~/constants/rule.constant';

export default function Language() {
  const [t] = useTranslation('', { keyPrefix: 'setting' });

  const onChange = (event) => {
    i18next.changeLanguage(event.target.value);
    localStorage.setItem('cft-language', event.target.value);
  };
  return (
    <div className='min-w-[640px]'>
      <Typography variant='h4'>{t('language')}</Typography>
      <div className='mt-6'>
        <SelectCustom value={i18next.language || LANG_OPTIONS.LANG_VI} onChange={onChange}>
          <MenuItem value={LANG_OPTIONS.LANG_VI}>
            <Typography variant='body3'>{t('vi')}</Typography>
          </MenuItem>
          <MenuItem value={LANG_OPTIONS.LANG_ENG}>
            <Typography variant='body3'>{t('en')}</Typography>
          </MenuItem>
        </SelectCustom>
      </div>
    </div>
  );
}
