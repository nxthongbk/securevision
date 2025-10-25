import {
  Factory,
  Phone,
  EnvelopeSimple,
  MapPin,
  BuildingOffice,
  TrendDown,
  Users,
  Clock,
  CurrencyDollar
} from '@phosphor-icons/react';
import OfficeImage from '../../../assets/images/png/secure-solution-1.png';
import FactoryImage from '../../../assets/images/png/secure-solution-2.png';

export const getSecureLandingData = (t) => {
  const securityFeatures = [
    {
      id: 1,
      icon: 'Camera',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      title: t('secureLandingPage.features.cameraAI.title'),
      description: t('secureLandingPage.features.cameraAI.description'),
      learnMoreLink: '#camera-ai'
    },
    {
      id: 2,
      icon: 'SensorNetwork',
      gradientFrom: 'from-teal-500',
      gradientTo: 'to-teal-600',
      title: t('secureLandingPage.features.sensorNetwork.title'),
      description: t('secureLandingPage.features.sensorNetwork.description'),
      learnMoreLink: '#sensor-network'
    },
    {
      id: 3,
      icon: 'Brain',
      gradientFrom: 'from-purple-500',
      gradientTo: 'to-purple-600',
      title: t('secureLandingPage.features.brain.title'),
      description: t('secureLandingPage.features.brain.description'),
      learnMoreLink: '#ai-analytics'
    },
    {
      id: 4,
      icon: 'Smartphone',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-orange-600',
      title: t('secureLandingPage.features.smartPhone.title'),
      description: t('secureLandingPage.features.smartPhone.description'),
      learnMoreLink: '#mobile-app'
    },
    {
      id: 5,
      icon: 'Bell',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600',
      title: t('secureLandingPage.features.instantAlert.title'),
      description: t('secureLandingPage.features.instantAlert.description'),
      learnMoreLink: '#instant-alerts'
    },
    {
      id: 6,
      icon: 'Lock',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
      title: t('secureLandingPage.features.security.title'),
      description: t('secureLandingPage.features.security.description'),
      learnMoreLink: '#security'
    }
  ];

  const heroStats = [
    { label: t('secureLandingPage.hero.stats.projects'), value: '500+' },
    { label: t('secureLandingPage.hero.stats.accuracy'), value: '99.9%' },
    { label: t('secureLandingPage.hero.stats.monitoring'), value: '24/7' },
    { label: t('secureLandingPage.hero.stats.responseTime'), value: '5s' }
  ];

  const benefitsData = [
    {
      id: 1,
      icon: <TrendDown />,
      percentage: '85%',
      title: t('secureLandingPage.benefits.riskReduction.title'),
      description: t('secureLandingPage.benefits.riskReduction.description'),
      color: 'text-red-400',
      iconColor: 'text-red-400'
    },
    {
      id: 2,
      icon: <Clock />,
      percentage: '60%',
      title: t('secureLandingPage.benefits.timeSaving.title'),
      description: t('secureLandingPage.benefits.timeSaving.description'),
      color: 'text-blue-400',
      iconColor: 'text-blue-400'
    },
    {
      id: 3,
      icon: <Users />,
      percentage: '40%',
      title: t('secureLandingPage.benefits.staffEfficiency.title'),
      description: t('secureLandingPage.benefits.staffEfficiency.description'),
      color: 'text-green-400',
      iconColor: 'text-green-400'
    },
    {
      id: 4,
      icon: <CurrencyDollar />,
      percentage: '50%',
      title: t('secureLandingPage.benefits.costSaving.title'),
      description: t('secureLandingPage.benefits.costSaving.description'),
      color: 'text-orange-400',
      iconColor: 'text-orange-400'
    }
  ];

  const testimonials = [
    {
      rating: 5,
      quote: t('secureLandingPage.testimonials.quote1'),
      name: t('secureLandingPage.testimonials.name1'),
      position: t('secureLandingPage.testimonials.position1'),
      company: t('secureLandingPage.testimonials.company1'),
      companyUrl: '#',
      avatar: ''
    },
    {
      rating: 5,
      quote: t('secureLandingPage.testimonials.quote2'),
      name: t('secureLandingPage.testimonials.name2'),
      position: t('secureLandingPage.testimonials.position2'),
      company: t('secureLandingPage.testimonials.company2'),
      companyUrl: '#',
      avatar: ''
    },
    {
      rating: 5,
      quote: t('secureLandingPage.testimonials.quote3'),
      name: t('secureLandingPage.testimonials.name3'),
      position: t('secureLandingPage.testimonials.position3'),
      company: t('secureLandingPage.testimonials.company3'),
      companyUrl: '#',
      avatar: ''
    }
  ];

  const solutions = [
    {
      id: 1,
      icon: BuildingOffice,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      tagColor: 'bg-blue-100 text-blue-700',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      title: t('secureLandingPage.solutions.office.title'),
      description: t('secureLandingPage.solutions.office.description'),
      features: t('secureLandingPage.solutions.office.features', { returnObjects: true }),
      image: OfficeImage,
      alt: t('secureLandingPage.solutions.office.alt'),
      learnMoreLink: '#office-solution',
      reverse: false
    },
    {
      id: 2,
      icon: Factory,
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      tagColor: 'bg-blue-100 text-blue-700',
      buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      title: t('secureLandingPage.solutions.factory.title'),
      description: t('secureLandingPage.solutions.factory.description'),
      features: t('secureLandingPage.solutions.factory.features', { returnObjects: true }),
      image: FactoryImage,
      alt: t('secureLandingPage.solutions.factory.alt'),
      learnMoreLink: '#manufacturing-solution',
      reverse: true
    }
  ];

  const contactMethods = [
    {
      icon: <Phone size={28} className='text-blue-600' />,
      label: t('secureLandingPage.contact.hotline'),
      values: ['1900 1212 (24/7)', '0383 927 0958']
    },
    {
      icon: <EnvelopeSimple size={28} className='text-blue-600' />,
      label: t('secureLandingPage.contact.email'),
      values: ['info@securevision.com', 'sales@securevision.com']
    },
    {
      icon: <MapPin size={28} className='text-blue-600' />,
      label: t('secureLandingPage.contact.address'),
      values: t('secureLandingPage.contact.addressValues', { returnObjects: true })
    }
  ];

  const commitments = t('secureLandingPage.contact.commitments', { returnObjects: true });

  const footerLinks = t('secureLandingPage.footer.links', { returnObjects: true });

  return {
    securityFeatures,
    heroStats,
    benefitsData,
    testimonials,
    solutions,
    contactMethods,
    commitments,
    footerLinks
  };
};
