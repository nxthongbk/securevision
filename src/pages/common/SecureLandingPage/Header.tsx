import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from './Icons';
import { useTranslation } from 'react-i18next';

export default function Header({
  scrolled,
  lang,
  handleChangeLang
}: {
  scrolled: boolean;
  lang?: string;
  handleChangeLang?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate('/login');
  };

  const navItems = [
    { label: t('secureLandingPage.menuItems.features'), href: '#features' },
    { label: t('secureLandingPage.menuItems.solutions'), href: '#solutions' },
    { label: t('secureLandingPage.menuItems.benefits'), href: '#benefits' },
    { label: t('secureLandingPage.menuItems.testimonials'), href: '#testimonials' },
    { label: t('secureLandingPage.menuItems.contact'), href: '#contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled ? 'bg-white shadow text-gray-900' : 'bg-transparent text-white'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 smallLaptop:px-8 py-4 flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center'>
              <Icons.Shield className='w-6 h-6 text-white' />
            </div>
            <span className={` text-xl font-bold transition-colors ${scrolled ? 'text-gray-900 ' : 'text-white'}`}>
              SecureVision
            </span>
          </div>

          <nav className='hidden smallLaptop:flex space-x-8'>
            {navItems.map((item, idx) => (
              <a key={idx} href={item.href} className='font-medium text-inherit hover:text-blue-500 transition-colors'>
                {item.label}
              </a>
            ))}
          </nav>

          <div className='hidden smallLaptop:flex items-center space-x-4'>
            <button
              onClick={handleSignIn}
              className='px-4 py-2 rounded-lg font-medium text-inherit hover:bg-gray-100 transition-colors duration-300'
            >
              {t('secureLandingPage.header.signIn')}
            </button>
            <button className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 rounded-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-transform transform hover:scale-105'>
              {t('secureLandingPage.header.freeConsultation')}
            </button>
            {lang && handleChangeLang && (
              <select
                value={lang}
                onChange={handleChangeLang}
                className='py-2 rounded-lg border text-blue-900 border-gray-300  shadow text-sm font-medium focus:outline-none'
                style={{ minWidth: 90 }}
              >
                <option value='en'>{t('secureLandingPage.languages.en')}</option>
                <option value='vi'>{t('secureLandingPage.languages.vi')}</option>
                <option value='ja'>{t('secureLandingPage.languages.ja')}</option>
              </select>
            )}
          </div>

          <button
            className='smallLaptop:hidden p-2 rounded-lg text-inherit hover:bg-white/10 transition-colors duration-300'
            onClick={() => setMenuOpen(true)}
            aria-label='Open menu'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='lucide lucide-menu w-6 h-6'
            >
              <line x1='4' y1='6' x2='20' y2='6' />
              <line x1='4' y1='12' x2='20' y2='12' />
              <line x1='4' y1='18' x2='20' y2='18' />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className='fixed inset-0 z-50 pointer-events-auto'>
          <div
            className='absolute inset-0 bg-black bg-opacity-30 transition-opacity'
            onClick={() => setMenuOpen(false)}
            tabIndex={-1}
            aria-hidden='true'
          >
            <div className='relative w-full bg-white border-b border-gray-200 max-h-screen overflow-y-auto'>
              <div className='flex items-center justify-between px-4 py-4 border-b border-gray-100'>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center'>
                    <Icons.Shield className='w-6 h-6 text-white' />
                  </div>
                  <span className='text-xl font-bold text-gray-900'>SecureVision</span>
                </div>
                <button
                  className='text-2xl text-gray-600 hover:text-blue-600'
                  onClick={() => setMenuOpen(false)}
                  aria-label='Close menu'
                >
                  &times;
                </button>
              </div>
              <nav className='flex flex-col gap-4 px-4 py-2'>
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className='text-gray-700 hover:text-blue-600 text-base text-left py-2'
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <hr className='my-2' />
                <button className='text-gray-700 hover:text-blue-600 text-base text-left py-2' onClick={handleSignIn}>
                  {t('secureLandingPage.header.signIn')}
                </button>
                <a
                  className='mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition'
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  {t('secureLandingPage.header.freeConsultation')}
                </a>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
