import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Factory,
  Phone,
  EnvelopeSimple,
  MapPin,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  User
} from '@phosphor-icons/react';
import Header from './Header';
import Icons from './Icons';

import { getSecureLandingData } from './secureLandingData';

export default function SecureLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language || 'vi');

  const {
    securityFeatures,
    heroStats,
    benefitsData,
    testimonials,
    solutions,
    contactMethods,
    commitments,
    footerLinks
  } = getSecureLandingData(t);

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrolled(scrollContainerRef.current.scrollTop > 10);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={scrollContainerRef} className='overflow-y-auto max-h-screen secure-landing-page'>
      <Header scrolled={scrolled} lang={lang} handleChangeLang={handleChangeLang} />
      <section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900'>
        <div className='absolute inset-0 opacity-20'>
          <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse'></div>
          <div className='absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000'></div>
          <div className='absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000'></div>
        </div>
        <div className='relative z-10 max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8 text-center'>
          <div className='mb-8'>
            <div className='inline-flex items-center px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-6'>
              <Icons.Zap className='w-4 h-4 mr-2' />
              {t('secureLandingPage.hero.tag')}
            </div>
            <h1 className='text-3xl tablet:text-3xl miniLaptop:text-6xl font-extrabold text-white mb-6 leading-tight'>
              {t('secureLandingPage.hero.titlePart1')}
              <br />
              <span
                className='block text-4xl tablet:text-5xl miniLaptop:text-7xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mt-2'
                style={{ letterSpacing: '-0.03em', lineHeight: 1.175 }}
              >
                {t('secureLandingPage.hero.titlePart2')}
              </span>
            </h1>
            <p className='text-xl smallLaptop:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
              {t('secureLandingPage.hero.subtitle')}
            </p>
          </div>
          <div className='flex flex-col tablet:flex-row gap-4 justify-center items-center mb-12'>
            <button className='group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-xl'>
              {t('secureLandingPage.hero.cta.freeConsultation')}
              <Icons.Shield className='inline-block w-5 h-5 ml-2 group-hover:rotate-12 transition-transform' />
            </button>
            <button className='group flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all'>
              <Icons.Play className='w-5 h-5 mr-2 group-hover:scale-110 transition-transform' />
              {t('secureLandingPage.hero.cta.watchDemo')}
            </button>
          </div>
          <div className='grid grid-cols-2 smallLaptop:grid-cols-4 gap-8 max-w-4xl mx-auto'>
            {heroStats.map((stat, idx) => (
              <div key={idx} className='text-center'>
                <div className='text-3xl smallLaptop:text-4xl font-bold text-white mb-2'>{stat.value}</div>
                <div className='text-gray-300'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className='absolute top-20 left-20 text-blue-400 animate-bounce animation-delay-1000'>
          <Icons.Eye className='w-8 h-8' />
        </div>
        <div className='absolute bottom-20 right-20 text-teal-400 animate-bounce animation-delay-3000'>
          <Icons.Shield className='w-8 h-8' />
        </div>
      </section>

      <section id='features' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4'>
              {t('secureLandingPage.features.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>{t('secureLandingPage.features.subtitle')}</p>
          </div>

          <div className='grid tablet:grid-cols-2 smallLaptop:grid-cols-3 gap-8'>
            {securityFeatures.map((feature) => {
              const renderIcon = () => {
                switch (feature.icon) {
                  case 'Camera':
                    return <Icons.Camera className='w-8 h-8' />;
                  case 'SensorNetwork':
                    return <Icons.SensorNetwork className='w-8 h-8' />;
                  case 'Brain':
                    return <Icons.Brain className='w-8 h-8' />;
                  case 'Smartphone':
                    return <Icons.Smartphone className='w-8 h-8' />;
                  case 'Bell':
                    return <Icons.Bell className='w-8 h-8' />;
                  case 'Lock':
                    return <Icons.Lock className='w-8 h-8' />;
                  default:
                    return <Icons.Shield className='w-8 h-8' />;
                }
              };

              return (
                <div
                  key={feature.id}
                  className='group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
                >
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} text-white mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {renderIcon()}
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>{feature.title}</h3>
                  <p className='text-gray-600 leading-relaxed'>{feature.description}</p>
                  <a
                    href={feature.learnMoreLink}
                    className='mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors'
                  >
                    {t('secureLandingPage.features.learnMore')}
                    <Icons.ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id='solutions' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
              {t('secureLandingPage.solutions.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>{t('secureLandingPage.solutions.subtitle')}</p>
          </div>
          <div className='space-y-20'>
            {solutions.map((solution) => {
              const IconComponent = solution.icon;
              const isReversed = solution.reverse;

              return (
                <div
                  key={solution.id}
                  className={`flex flex-col smallLaptop:flex-row items-center gap-12 ${isReversed ? 'smallLaptop:flex-row-reverse' : ''}`}
                >
                  <div className='flex-1'>
                    <div className='flex items-center mb-6'>
                      <div className='p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl mr-4'>
                        <IconComponent
                          className='w-12 h-12'
                          {...(solution.icon === Factory ? { mirrored: true } : {})}
                        />
                      </div>
                      <h3 className='text-2xl smallLaptop:text-3xl font-bold text-gray-900'>{solution.title}</h3>
                    </div>

                    <p className='text-lg text-gray-600 mb-8 leading-relaxed'>{solution.description}</p>
                    <div className='space-y-4 mb-8'>
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className='flex items-start'>
                          <Icons.ShieldCheck className='w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0' />
                          <span className='text-gray-700'>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={solution.learnMoreLink}
                      className={`inline-block ${solution.buttonColor} text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105`}
                    >
                      {t('secureLandingPage.solutions.learnMore')}
                    </a>
                  </div>
                  <div className='flex-1'>
                    <div className='relative group'>
                      <img
                        src={solution.image}
                        alt={solution.alt}
                        className='w-full h-80 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl'></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id='benefits' className='py-20 bg-gradient-to-b from-[#0B1E3C] to-[#183B6B]'>
        <div className='max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8'>
          <h2 className='text-3xl smallLaptop:text-4xl font-bold text-white mb-2 text-center'>
            {t('secureLandingPage.benefits.title')}
          </h2>
          <p className='text-lg text-blue-100 mb-12 text-center'>{t('secureLandingPage.benefits.subtitle')}</p>
          <div className='grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-8 mb-10'>
            {benefitsData.map((benefit) => {
              return (
                <div
                  key={benefit.id}
                  className='bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2'
                >
                  <div className='flex justify-center mb-6'>
                    <div
                      className={`mb-4 p-4 rounded-xl bg-white/10 flex items-center justify-center ${benefit.iconColor}`}
                    >
                      {React.cloneElement(benefit.icon, {
                        className: `w-8 h-8 ${benefit.iconColor}`
                      })}
                    </div>
                  </div>

                  <div className={`text-4xl font-bold mb-2 ${benefit.color}`}>{benefit.percentage}</div>
                  <div className='text-xl font-bold text-white text-center mb-2 leading-tight'>{benefit.title}</div>
                  <div className='text-blue-100 text-center text-base leading-relaxed'>{benefit.description}</div>
                </div>
              );
            })}
          </div>
          <div className='flex justify-center'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all'>
              {t('secureLandingPage.benefits.cta')}
            </button>
          </div>
        </div>
      </section>

      <section id='testimonials' className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8'>
          <h2 className='text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4 text-center'>
            {t('secureLandingPage.testimonials.title')}
          </h2>
          <p className='text-lg text-gray-600 mb-10 text-center'>{t('secureLandingPage.testimonials.subtitle')}</p>
          <div className='grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-3 gap-8'>
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2'
              >
                <div className='flex items-center mb-4'>
                  <Icons.Quotes className='w-8 h-8 text-blue-600 mr-2' />
                  <span className='flex text-yellow-500 mr-2'>
                    {[...Array(t.rating)].map((_, i) => (
                      <Icons.Star key={i} className='w-5 h-5' />
                    ))}
                  </span>
                </div>
                <p className='text-gray-700 mb-6 leading-relaxed italic'>"{t.quote}"</p>
                <div className='flex items-center mt-auto pt-4'>
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className='w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-100'
                    />
                  ) : (
                    <div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 border-2 border-blue-100'>
                      <User className='w-7 h-7 text-gray-400' />
                    </div>
                  )}
                  <div>
                    <div className='font-semibold text-gray-900'>{t.name}</div>
                    <div className='text-gray-600 text-sm'>{t.position}</div>
                    <a href={t.companyUrl} className='text-blue-600 text-sm hover:underline font-medium'>
                      {t.company}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className='flex justify-center mt-10'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all'>
              {t('secureLandingPage.testimonials.cta')}
            </button>
          </div>
        </div>
      </section>

      <section id='contact' className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4'>
              {t('secureLandingPage.contact.title')}
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>{t('secureLandingPage.contact.subtitle')}</p>
          </div>
          <div className='grid grid-cols-1 smallLaptop:grid-cols-2 gap-12'>
            {(() => {
              return (
                <div className='rounded-2xl p-8 flex flex-col justify-center'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-8'>{t('secureLandingPage.contact.infoTitle')}</h3>
                  {contactMethods.map((method, idx) => (
                    <div className='flex items-start mb-6' key={method.label + idx}>
                      <div className='bg-blue-100 p-3 rounded-xl mr-4 flex items-center justify-center'>
                        {method.icon}
                      </div>
                      <div>
                        <div className='font-bold text-gray-900 mb-1'>{method.label}</div>
                        {method.values.map((v, i) => (
                          <div className='text-gray-700 leading-tight' key={i}>
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className='mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100'>
                    <div className='font-bold text-gray-900 mb-3'>
                      {t('secureLandingPage.contact.commitmentsTitle')}
                    </div>
                    <ul className='space-y-2'>
                      {commitments.map((c, i) => (
                        <li className='flex items-center text-green-600' key={i}>
                          <Icons.CheckCircle className='w-5 h-5 mr-2' />
                          <span className='text-gray-700'>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            <div className='bg-white p-8'>
              <form className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('secureLandingPage.contact.form.fullName')} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none'
                      placeholder={t('secureLandingPage.contact.form.fullNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('secureLandingPage.contact.form.phone')} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='tel'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none'
                      placeholder={t('secureLandingPage.contact.form.phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('secureLandingPage.contact.form.email')} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='email'
                      required
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none'
                      placeholder={t('secureLandingPage.contact.form.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      {t('secureLandingPage.contact.form.company')} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none'
                      placeholder={t('secureLandingPage.contact.form.companyPlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t('secureLandingPage.contact.form.projectDescription')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none'
                    placeholder={t('secureLandingPage.contact.form.projectDescriptionPlaceholder')}
                  ></textarea>
                </div>
                <button
                  type='submit'
                  className='w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center justify-center'
                >
                  <Icons.PaperPlaneTilt className='lucide lucide-send w-5 h-5 mr-2' />
                  {t('secureLandingPage.contact.form.cta')}
                </button>
                <div className='text-sm text-gray-500 text-center mt-2'>
                  {t('secureLandingPage.contact.privacyNotice')}{' '}
                  <a href='#' className='text-blue-600 hover:underline'>
                    {t('secureLandingPage.contact.privacyPolicy')}
                  </a>{' '}
                  {t('secureLandingPage.contact.ofUs')}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className='bg-[#101828] text-gray-400 pt-14 pb-8'>
        <div className='max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8 flex flex-col smallLaptop:flex-row gap-12 smallLaptop:gap-0 justify-between'>
          <div className='flex-1 mb-8 md:mb-0'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='bg-blue-600 p-2 rounded-xl flex items-center justify-center'>
                <Icons.Shield className='w-7 h-7 text-white' />
              </div>
              <span className='text-2xl font-bold text-white'>SecureVision</span>
            </div>
            <p className='text-gray-300 leading-relaxed mb-6 max-w-xs'>{t('secureLandingPage.footer.description')}</p>
            <div className='space-y-2 mb-6'>
              <div className='flex items-center text-gray-300 text-sm'>
                <Phone className='w-5 h-5 mr-2 text-blue-400' />
                1900 1212 (24/7)
              </div>
              <div className='flex items-center text-gray-300 text-sm'>
                <EnvelopeSimple className='w-5 h-5 mr-2 text-blue-400' />
                info@securevision.com
              </div>
              <div className='flex items-center text-gray-300 text-sm'>
                <MapPin className='w-5 h-5 mr-2 text-blue-400' />
                <span
                  className='line-clamp-2'
                  dangerouslySetInnerHTML={{ __html: t('secureLandingPage.footer.address') }}
                />
              </div>
            </div>

            <div className='flex gap-3 mt-4'>
              {[
                {
                  href: '#',
                  label: 'Facebook',
                  icon: <FacebookLogo className='w-5 h-5 text-white' />
                },
                {
                  href: '#',
                  label: 'Twitter',
                  icon: <TwitterLogo className='w-5 h-5 text-white' />
                },
                {
                  href: '#',
                  label: 'LinkedIn',
                  icon: <LinkedinLogo className='w-5 h-5 text-white' />
                },
                {
                  href: '#',
                  label: 'YouTube',
                  icon: <YoutubeLogo className='w-5 h-5 text-white' />
                }
              ].map((item, idx) => (
                <a
                  key={item.label + idx}
                  href={item.href}
                  className='bg-[#1D2939] hover:bg-blue-600 transition-colors p-2 rounded-lg'
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className='flex-[2] grid grid-cols-2 smallLaptop:grid-cols-4 gap-10 smallLaptop:ml-4'>
            {footerLinks.map((col, idx) => (
              <div key={col.title + idx}>
                <h4 className='text-white font-semibold mb-4'>{col.title}</h4>
                <ul className='space-y-2'>
                  {col.links.map((link, lidx) => (
                    <li key={link.label + lidx}>
                      <a href={link.href} className='hover:text-white transition text-nowrap'>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className='border-[#1D2939] my-8 max-w-7xl mx-auto' />
        <div className='max-w-7xl mx-auto px-4 tablet:px-6 smallLaptop:px-8 flex flex-col smallLaptop:flex-row justify-between items-center text-sm text-gray-500 gap-2'>
          <div>{t('secureLandingPage.footer.copyright')}</div>
          <div className='flex flex-wrap gap-4 mt-2 smallLaptop:mt-0'>
            {[
              { label: t('secureLandingPage.footer.termOfUse'), href: '#' },
              { label: t('secureLandingPage.footer.privacyPolicy'), href: '#' },
              { label: t('secureLandingPage.footer.cookiePolicy'), href: '#' }
            ].map((item) => (
              <a key={item.label} href={item.href} className='hover:text-white transition'>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
