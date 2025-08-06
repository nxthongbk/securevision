import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollar,
  ChartLineUp,
  Leaf,
  Clock,
  Lightning,
  ChartBar,
  Shield,
  DeviceMobileCamera,
} from '@phosphor-icons/react';
import GetStartedModal from './GetStartedModal';
import energyLogo from '~/assets/images/png/energy-flatform-logo.png';

const features = [
  {
    icon: <Lightning color="#3b82f6" size={32} />,
    title: 'Real-Time Monitoring',
    desc: 'Track energy consumption across all your facilities in real-time with instant updates.',
  },
  {
    icon: <ChartBar color="#22c55e" size={32} />,
    title: 'Advanced Analytics',
    desc: 'Gain deep insights with AI-powered analytics, predictive modeling, and actionable recommendations.',
  },
  {
    icon: <CurrencyDollar color="#eab308" size={32} />,
    title: 'Cost Optimization',
    desc: 'Identify energy waste, optimize usage patterns, and reduce operational costs by up to 30%.',
  },
  {
    icon: <Shield color="#a855f7" size={32} />,
    title: 'Smart Alerts',
    desc: 'Get instant notifications for anomalies, equipment failures, and optimization opportunities.',
  },
  {
    icon: <DeviceMobileCamera color="#6366f1" size={32} />,
    title: 'Mobile Access',
    desc: 'Monitor and control your energy systems from anywhere with our responsive mobile platform.',
  },
  {
    icon: <Leaf color="#10b981" size={32} />,
    title: 'Sustainability Tracking',
    desc: 'Track carbon footprint, measure environmental impact, and achieve your sustainability goals.',
  },
];

const howItWorksSteps = [
  {
    number: '01',
    title: 'Connect & Install',
    desc: 'Quick installation of smart sensors and meters across your facilities',
  },
  {
    number: '02',
    title: 'Monitor & Analyze',
    desc: 'Real-time data collection and AI-powered analysis of energy patterns',
  },
  {
    number: '03',
    title: 'Optimize & Save',
    desc: 'Implement recommendations and track savings with automated reporting',
  },
];

const whyChooseChecklist = [
  'Reduce energy costs by 20-40%',
  'Prevent equipment downtime',
  'Meet sustainability targets',
  'Improve operational efficiency',
  'Gain real-time visibility',
  'Automate energy management',
];

const whyChooseStats = [
  { value: '40%', label: 'Cost Reduction' },
  { value: '24/7', label: 'Monitoring' },
  { value: '99.9%', label: 'Uptime' },
  { value: '1M+', label: 'Data Points' },
];

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses',
    price: '$99',
    period: '/month',
    button: { label: 'Start Free Trial', color: 'bg-gray-900 text-white hover:bg-gray-800' },
    features: [
      'Up to 10 monitoring points',
      'Real-time monitoring',
      'Basic analytics',
      'Email alerts',
      'Mobile app access',
      '24/7 support',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Ideal for growing companies',
    price: '$299',
    period: '/month',
    button: { label: 'Start Free Trial', color: 'bg-blue-600 text-white hover:bg-blue-700' },
    features: [
      'Up to 100 monitoring points',
      'Advanced AI analytics',
      'Predictive insights',
      'Custom dashboards',
      'API access',
      'Priority support',
      'White-label reports',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    period: '',
    button: { label: 'Contact Sales', color: 'bg-green-600 text-white hover:bg-green-700' },
    features: [
      'Unlimited monitoring points',
      'Custom integrations',
      'Dedicated account manager',
      'On-premise deployment',
      'SLA guarantees',
      'Training & onboarding',
      'Custom development',
    ],
    popular: false,
  },
];

const includedFeatures = [
  {
    icon: <Shield size={36} color="#3b82f6" />,
    label: 'Enterprise Security',
  },
  {
    icon: <Clock size={36} color="#22c55e" />,
    label: '99.9% Uptime SLA',
  },
  {
    icon: <DeviceMobileCamera size={36} color="#a855f7" />,
    label: 'Mobile & Web Apps',
  },
  {
    icon: <Leaf size={36} color="#10b981" />,
    label: 'Carbon Tracking',
  },
];

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated.',
  },
  {
    question: 'Is there a setup fee?',
    answer:
      'No setup fees for any plan. We provide free installation support and onboarding for all customers.',
  },
  {
    question: "What's included in the free trial?",
    answer:
      'Full access to all features of your chosen plan for 30 days. No credit card required to start.',
  },
  {
    question: 'Do you offer custom solutions?',
    answer:
      'Yes, our Enterprise plan includes custom development and integrations tailored to your specific needs.',
  },
];

export default function EnergyLandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="overflow-y-auto max-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header>
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 mobile:px-6 miniLaptop:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <img src={energyLogo} alt="Energy Platform Logo" className="w-[54px] h-[46px]" />
                </div>
                <span className="text-xl font-bold text-gray-900">Energy Platform</span>
              </div>
              <div className="hidden tablet:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  How It Works
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </a>
              </div>

              <div className="hidden tablet:flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={handleSignIn}
                >
                  Sign In
                </a>
                <button
                  onClick={() => setShowGetStarted(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>

              <div className="tablet:hidden">
                <button
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6"
                  >
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 pointer-events-auto">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30 transition-opacity"
            onClick={() => setMenuOpen(false)}
            tabIndex={-1}
            aria-hidden="true"
          />
          {/* Top-docked Drawer */}
          <div className="relative w-full bg-white border-b border-gray-200 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className=" flex items-center justify-center">
                  <img src={energyLogo} alt="Energy Platform Logo" className="w-[54px] h-[46px]" />
                </div>
                <span className="text-xl font-bold text-gray-900">Energy Platform</span>
              </div>
              <button
                className="text-2xl text-gray-600 hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                &times;
              </button>
            </div>
            <nav className="flex flex-col gap-4 px-4 py-2">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                How It Works
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
              <hr className="my-2" />
              <button
                className="text-gray-700 hover:text-blue-600 text-base text-left py-2"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <a
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                onClick={() => {
                  setMenuOpen(false);
                  setShowGetStarted(true);
                }}
              >
                Get Started
              </a>
            </nav>
          </div>
        </div>
      )}

      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8">
          <div className="text-center">
            <h1 className="text-5xl miniLaptop:text-7xl font-bold text-gray-900 mb-6">
              Smart Energy{' '}
              <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
                Monitoring
              </span>
            </h1>
            <p className="text-xl miniLaptop:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your energy management with real-time monitoring, AI-powered insights, and
              automated optimization to reduce costs and environmental impact.
            </p>
            <div className="flex flex-col mobile:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setShowGetStarted(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Trial →
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check w-4 h-4 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check w-4 h-4 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span>30-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check w-4 h-4 text-green-500"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl miniLaptop:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to monitor, analyze, and optimize your energy consumption
            </p>
          </div>

          <div className="grid tablet:grid-cols-2 miniLaptop:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-transparent hover:border-gray-200"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl miniLaptop:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in three simple steps and start saving energy immediately
            </p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-12">
            {howItWorksSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-base">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8 flex flex-col miniLaptop:flex-row items-center gap-10 miniLaptop:gap-16">
          {/* Left: Text and Checklist */}
          <div className="flex-1 max-w-xl w-full">
            <h2 className="text-4xl miniLaptop:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Why Choose <br className="hidden mobile:block" />
              TMA Energy Platform?
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Join thousands of companies already saving millions on energy costs while reducing
              their environmental footprint.
            </p>
            <ul className="space-y-4">
              {whyChooseChecklist.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3">
                  <svg
                    className="lucide lucide-check-circle w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <path d="m9 11 3 3L22 4"></path>
                  </svg>
                  <span className="text-lg text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <button className="mt-8 bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
              Learn More
            </button>
          </div>
          {/* Right: Stats */}
          <div className="flex-1 flex justify-center w-full">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl px-12 py-10 grid grid-cols-2 gap-x-16 gap-y-8 w-full max-w-xl text-white">
              {whyChooseStats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-md opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl miniLaptop:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your energy monitoring needs. All plans include our core
              features with no hidden fees.
            </p>
          </div>
          <div className="flex flex-col miniLaptop:flex-row gap-8 justify-center items-stretch">
            {pricingPlans.map(plan => (
              <div
                key={plan.name}
                className={`relative flex-1 bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular ? 'border-blue-500 z-10 scale-105' : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-5 py-1 rounded-full text-sm font-semibold shadow-md">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="flex items-end mb-6">
                  <span
                    className={`text-5xl font-bold ${plan.popular ? 'text-blue-600' : 'text-gray-900'} `}
                  >
                    {plan.price}
                  </span>
                  <span className=" text-gray-600 ">{plan.period}</span>
                </div>
                <button
                  onClick={() => setShowGetStarted(true)}
                  className={`w-full py-4 rounded-xl font-semibold mb-8 transition-all duration-300 ${plan.button.color}`}
                >
                  {plan.button.label}
                </button>
                <ul className="space-y-4 w-full">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center space-x-3">
                      <svg
                        className="lucide lucide-check-circle w-5 h-5 text-green-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="m9 11 3 3L22 4"></path>
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">All plans include:</h3>
            <div className="grid tablet:grid-cols-2 miniLaptop:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {includedFeatures.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[160px]">
                  <div className="mb-3">{item.icon}</div>
                  <div className="text-gray-700 font-medium">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="grid tablet:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</div>
                  <div className="text-gray-600">{faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-green-600">
        <div className="max-w-4xl mx-auto px-4 mobile:px-6 laptop:px-8 text-center">
          <h2 className="text-4xl miniLaptop:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Energy Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Start your free trial today and discover how much you can save with intelligent energy
            monitoring.
          </p>
          <div className="flex flex-col mobile:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8 flex flex-col miniLaptop:flex-row gap-12 miniLaptop:gap-0 justify-between">
          {/* Logo and Description */}
          <div className="flex-1 mb-8 miniLaptop:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center">
                <img src={energyLogo} alt="Energy Platform Logo" className="w-[54px] h-[46px]" />
              </div>
              <span className="text-xl font-bold text-white">TMA Energy Platform</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 miniLaptop:max-w-xs">
              Empowering businesses to monitor, analyze, and optimize their energy consumption for a
              sustainable future.
            </p>
            <div className="flex space-x-4 text-gray-400 text-xl">
              <Clock size={22} />
              <ChartLineUp size={22} />
              <Leaf size={22} />
            </div>
          </div>
          {/* Links */}
          <div className="flex-[2] grid grid-cols-1 tablet:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#api" className="text-gray-400 hover:text-white transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#integrations" className="text-gray-400 hover:text-white transition">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#blog" className="text-gray-400 hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#careers" className="text-gray-400 hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#docs" className="text-gray-400 hover:text-white transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#help" className="text-gray-400 hover:text-white transition">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#cases" className="text-gray-400 hover:text-white transition">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a href="#whitepapers" className="text-gray-400 hover:text-white transition">
                    Whitepapers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-gray-700 my-8 max-w-7xl mx-auto" />
        <div className="text-center text-gray-400 text-sm">
          © 2025 TMA Energy Platform. All rights reserved.
        </div>
      </footer>

      <GetStartedModal open={showGetStarted} onClose={() => setShowGetStarted(false)} />
    </div>
  );
}
