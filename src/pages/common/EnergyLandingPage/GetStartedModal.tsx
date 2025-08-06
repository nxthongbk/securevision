import React, { useState } from 'react';
import { User, Phone, Envelope, Building, Users } from '@phosphor-icons/react';

interface GetStartedModalProps {
  open: boolean;
  onClose: () => void;
}

const plans = [
  { key: 'starter', label: 'Starter', price: '$99/month', cta: 'Start Free Trial' },
  { key: 'professional', label: 'Professional', price: '$299/month', cta: 'Start Free Trial' },
  { key: 'enterprise', label: 'Enterprise', price: 'Custom', cta: 'Contact Sales' },
];

const GetStartedModal: React.FC<GetStartedModalProps> = ({ open, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  if (!open) return null;

  const mainCta = plans.find(p => p.key === selectedPlan)?.cta || 'Start Free Trial';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Get Started with EnergyFlow</h2>
              <p className=" text-gray-600">
                Fill out the form below and we'll contact you within 24 hours
              </p>
            </div>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors text-3xl"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Envelope className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your.email@company.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Your company name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Size</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option className="text-gray-800" value="">
                      Select company size
                    </option>
                    <option className="text-gray-800" value="1-10">
                      1-10 employees
                    </option>
                    <option className="text-gray-800" value="11-50">
                      11-50 employees
                    </option>
                    <option className="text-gray-800" value="51-200">
                      51-200 employees
                    </option>
                    <option className="text-gray-800" value="201-1000">
                      201-1000 employees
                    </option>
                    <option className="text-gray-800" value="1000+">
                      1000+ employees
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interested Plan
              </label>
              <div className="flex gap-2 mt-1">
                {plans.map(plan => (
                  <button
                    key={plan.key}
                    type="button"
                    className={`flex-1 px-4 py-3 text-center rounded-lg border-2 transition-all
                      ${
                        selectedPlan === plan.key
                          ? 'border-2 border-blue-600 bg-blue-50 text-blue-600 shadow'
                          : 'border hover:border-blue-500 focus:ring-2 focus:ring-blue-500'
                      }
                    `}
                    onClick={() => setSelectedPlan(plan.key)}
                  >
                    <div className="font-semibold text-gray-900">{plan.label}</div>

                    <span className="text-sm text-gray-600">{plan.price}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Information
              </label>
              <textarea
                name="message"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your energy monitoring needs, current challenges, or any specific requirements..."
              ></textarea>
            </div>
            <div className="flex flex-col mobile:flex-row gap-4 pt-4">
              <button
                style={{ minHeight: 56 }}
                type="submit"
                className="flex-[2] bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                {mainCta}
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                style={{ minHeight: 56 }}
                type="button"
                className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>

            <div className="text-sm text-gray-500 text-center pt-4 border-t border-gray-200">
              <span>
                By submitting this form, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
                .
              </span>
              <br className="hidden mobile:block" />
              <span className="block mt-1">
                We'll never share your information with third parties.
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetStartedModal;
