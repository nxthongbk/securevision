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
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
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
            <button
              onClick={() => {
                const scrollContainer = document.querySelector('.secure-landing-page');
                const targetSection = document.querySelector('#contact');
                if (scrollContainer && targetSection) {
                  scrollContainer.scrollTo({
                    top: targetSection.getBoundingClientRect().top + scrollContainer.scrollTop,
                    behavior: 'smooth'
                  });
                }
              }}
              className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 rounded-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-transform transform hover:scale-105'
            >
              {t('secureLandingPage.header.freeConsultation')}
            </button>

            {lang && handleChangeLang && (
              <div className='relative'>
                <button
                  type='button'
                  className={`flex items-center py-2 px-3 rounded-lg border text-blue-900 border-gray-300 ${!scrolled ? 'bg-white/90' : 'bg-gray-50'} text-sm font-medium focus:outline-none min-w-[110px]`}
                  onClick={() => setLangDropdownOpen((open) => !open)}
                  aria-haspopup='listbox'
                  aria-expanded={langDropdownOpen}
                >
                  <img
                    src={
                      lang === 'en'
                        ? '/flag_en_icon.svg'
                        : lang === 'vi'
                        ? '/flag_vn_icon.svg'
                        : '/flag_jp_icon.svg'
                    }
                    alt={lang}
                    className='mr-2 h-5 w-6 object-cover align-middle'
                    style={{ display: 'inline-block', verticalAlign: 'middle' }}
                  />
                  {lang === 'en' && t('secureLandingPage.languages.en')}
                  {lang === 'vi' && t('secureLandingPage.languages.vi')}
                  {lang === 'ja' && t('secureLandingPage.languages.ja')}
                  <span className='ml-2 flex items-center justify-center h-5'>
                    <Icons.ChervonDown className='w-5 h-5 text-gray-400 align-middle' />
                  </span>
                </button>
                {langDropdownOpen && (
                  <ul
                    className='absolute right-0 mt-2 min-w-[110px] text-blue-900 bg-white/90 border text-sm border-gray-200 rounded-sm shadow-lg z-50'
                    role='listbox'
                  >
                    <li
                      className={`flex items-center px-3 py-2 cursor-pointer hover:bg-blue-100 ${lang === 'en' ? 'font-bold' : ''}`}
                      onClick={() => {
                        handleChangeLang({ target: { value: 'en' } } as React.ChangeEvent<HTMLSelectElement>);
                        setLangDropdownOpen(false);
                      }}
                      role='option'
                      aria-selected={lang === 'en'}
                    >
                      <img src={'/flag_en_icon.svg'} className='mr-2 h-5 w-5' alt='English' />{' '}
                      {t('secureLandingPage.languages.en')}
                    </li>
                    <li
                      className={`flex items-center px-3 py-2 cursor-pointer hover:bg-blue-100 ${lang === 'vi' ? 'font-bold' : ''}`}
                      onClick={() => {
                        handleChangeLang({ target: { value: 'vi' } } as React.ChangeEvent<HTMLSelectElement>);
                        setLangDropdownOpen(false);
                      }}
                      role='option'
                      aria-selected={lang === 'vi'}
                    >
                      <img src={'/flag_vn_icon.svg'} className='mr-2 h-5 w-5' alt='Tiếng Việt' />{' '}
                      {t('secureLandingPage.languages.vi')}
                    </li>
                    <li
                      className={`flex items-center px-3 py-2 cursor-pointer hover:bg-blue-100 ${lang === 'ja' ? 'font-bold' : ''}`}
                      onClick={() => {
                        handleChangeLang({ target: { value: 'ja' } } as React.ChangeEvent<HTMLSelectElement>);
                        setLangDropdownOpen(false);
                      }}
                      role='option'
                      aria-selected={lang === 'ja'}
                    >
                      <img src={'/flag_jp_icon.svg'} className='mr-2 h-5 w-5' alt='日本語' />{' '}
                      {t('secureLandingPage.languages.ja')}
                    </li>
                  </ul>
                )}
              </div>
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
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    const section = document.querySelector('#contact');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className='bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 rounded-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-transform transform hover:scale-105'
                >
                  {t('secureLandingPage.header.freeConsultation')}
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
