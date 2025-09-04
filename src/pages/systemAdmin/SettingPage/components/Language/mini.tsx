import { useState } from 'react';
import i18next from 'i18next';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';
import { LANG_OPTIONS } from '~/constants/rule.constant';

// Map language codes to flag SVG URLs
const FLAG_URLS: Record<string, string> = {
  VI: 'https://flagicons.lipis.dev/flags/4x3/vn.svg',
  EN: 'https://flagicons.lipis.dev/flags/4x3/us.svg'
};

export default function LanguageMini() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleClose = (lang?: string) => {
    if (lang) {
      i18next.changeLanguage(lang);
      localStorage.setItem('cft-language', lang);
    }
    setAnchorEl(null);
  };

  const currentLang = (i18next.language || LANG_OPTIONS.LANG_VI).toUpperCase();
  const flagSrc = FLAG_URLS[currentLang] || FLAG_URLS['EN'];

  return (
    <>
      {/* Mini circular language button */}
      <IconButton
        onClick={handleClick}
        size="small"
        className="
          flex items-center gap-1
          bg-white/20 text-white
          px-2 py-1
          rounded-full
          hover:bg-white/30
          border border-white/40
        "
      >
        {/* Flag */}
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
          <img src={flagSrc} alt={currentLang} className="w-full h-full object-cover" />
        </div>

        {/* Short language code */}
        <Typography className="font-saira font-medium text-sm uppercase text-white">
          {currentLang}
        </Typography>
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={() => handleClose(LANG_OPTIONS.LANG_VI)}>
          <img src={FLAG_URLS.VI} alt="VI" className="w-5 h-5 rounded-full mr-2" />
          VI
        </MenuItem>
        <MenuItem onClick={() => handleClose(LANG_OPTIONS.LANG_ENG)}>
          <img src={FLAG_URLS.EN} alt="EN" className="w-5 h-5 rounded-full mr-2" />
          EN
        </MenuItem>
      </Menu>
    </>
  );
}
