import React, { useEffect, useRef, useState } from 'react';
import {
  Factory,
  Phone,
  EnvelopeSimple,
  MapPin,
  BuildingOffice,
  TrendDown,
  Users,
  Clock,
  CurrencyDollar,
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  YoutubeLogo,
  User,
} from '@phosphor-icons/react';
import Header from './Header';
import Icons from '../../SecureVision/common/Icons';
import OfficeImage from '../../../assets/images/png/secure-solution-1.png';
import FactoryImage from '../../../assets/images/png/secure-solution-2.png';

const securityFeatures = [
  {
    id: 1,
    icon: 'Camera',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    title: 'Camera AI Thông Minh',
    description:
      'Hệ thống camera với AI nhận diện khuôn mặt, phát hiện hành vi bất thường và theo dõi chuyển động trong thời gian thực.',
    learnMoreLink: '#camera-ai',
  },
  {
    id: 2,
    icon: 'SensorNetwork',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-teal-600',
    title: 'Mạng Cảm Biến Tiên Tiến',
    description:
      'Cảm biến chuyển động, nhiệt độ, khói, và rung động tạo thành mạng lưới bảo vệ toàn diện cho cơ sở của bạn.',
    learnMoreLink: '#sensor-network',
  },
  {
    id: 3,
    icon: 'Brain',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    title: 'Phân Tích Thông Minh',
    description:
      'AI phân tích dữ liệu từ nhiều nguồn, dự đoán rủi ro và đưa ra cảnh báo sớm với độ chính xác cao.',
    learnMoreLink: '#ai-analytics',
  },
  {
    id: 4,
    icon: 'Smartphone',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    title: 'Ứng Dụng Di Động',
    description:
      'Theo dõi và điều khiển hệ thống từ xa qua smartphone với giao diện trực quan và thông báo real-time.',
    learnMoreLink: '#mobile-app',
  },
  {
    id: 5,
    icon: 'Bell',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
    title: 'Cảnh Báo Tức Thời',
    description:
      'Nhận thông báo ngay lập tức qua email, SMS và push notification khi phát hiện sự cố.',
    learnMoreLink: '#instant-alerts',
  },
  {
    id: 6,
    icon: 'Lock',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    title: 'Bảo Mật Tuyệt Đối',
    description: 'Mã hóa end-to-end, xác thực đa lớp và tuân thủ các tiêu chuẩn bảo mật quốc tế.',
    learnMoreLink: '#security',
  },
];

const heroStats = [
  { label: 'Dự Án Triển Khai', value: '500+' },
  { label: 'Độ Chính Xác', value: '99.9%' },
  { label: 'Giám Sát Liên Tục', value: '24/7' },
  { label: 'Thời Gian Phản Hồi', value: '5s' },
];

const benefitsData = [
  {
    id: 1,
    icon: <TrendDown />,
    percentage: '85%',
    title: 'Giảm 85% Rủi Ro An Ninh',
    description: 'Phát hiện sớm và ngăn chặn các mối đe dọa trước khi chúng gây thiệt hại',
    color: 'text-red-400',
    iconColor: 'text-red-400',
  },
  {
    id: 2,
    icon: <Clock />,
    percentage: '60%',
    title: 'Tiết Kiệm 60% Thời Gian',
    description: 'Tự động hóa giám sát và báo cáo, giảm thiểu công việc thủ công',
    color: 'text-blue-400',
    iconColor: 'text-blue-400',
  },
  {
    id: 3,
    icon: <Users />,
    percentage: '40%',
    title: 'Tăng 40% Hiệu Quả Nhân Sự',
    description: 'Tối ưu hóa việc phân bố bảo vệ và nhân viên an ninh',
    color: 'text-green-400',
    iconColor: 'text-green-400',
  },
  {
    id: 4,
    icon: <CurrencyDollar />,
    percentage: '50%',
    title: 'Tiết Kiệm Chi Phí 50%',
    description: 'Giảm chi phí vận hành và bảo trì so với hệ thống truyền thống',
    color: 'text-orange-400',
    iconColor: 'text-orange-400',
  },
];

const testimonials = [
  {
    rating: 5,
    quote:
      'Hệ thống SecureVision đã giúp chúng tôi phát hiện và ngăn chặn 15 vụ xâm nhập bất hợp pháp trong 6 tháng qua. Độ chính xác của AI thật sự ấn tượng.',
    name: 'Nguyễn Văn Minh',
    position: 'Giám Đốc An Ninh',
    company: 'Tập Đoàn ABC',
    companyUrl: '#',
    avatar: '',
  },
  {
    rating: 5,
    quote:
      'Từ khi triển khai, chúng tôi tiết kiệm được 40% chi phí nhân sự bảo vệ và hoàn toàn yên tâm về an ninh 24/7. Đội ngũ hỗ trợ rất chuyên nghiệp.',
    name: 'Trần Thị Lan',
    position: 'Quản Lý Vận Hành',
    company: 'Nhà Máy XYZ',
    companyUrl: '#',
    avatar: '',
  },
  {
    rating: 5,
    quote:
      'Giao diện ứng dụng rất trực quan, dễ sử dụng. Báo cáo chi tiết giúp chúng tôi có cái nhìn tổng quan về tình hình an ninh và đưa ra quyết định kịp thời.',
    name: 'Lê Hoàng Nam',
    position: 'CEO',
    company: 'Tech Solutions Ltd',
    companyUrl: '#',
    avatar: '',
  },
];

const solutions = [
  {
    id: 1,
    icon: BuildingOffice,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    tagColor: 'bg-blue-100 text-blue-700',
    buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    title: 'Tòa Nhà Văn Phòng',
    description:
      'Giải pháp an ninh toàn diện cho các tòa nhà văn phòng với kiểm soát ra vào thông minh và giám sát 24/7.',
    features: [
      'Kiểm soát ra vào bằng thẻ từ và nhận diện khuôn mặt',
      'Giám sát hành lang, thang máy và khu vực công cộng',
      'Phát hiện xâm nhập sau giờ làm việc',
      'Tích hợp với hệ thống báo cháy',
    ],
    image: OfficeImage,
    alt: 'Office Building Security',
    learnMoreLink: '#office-solution',
    reverse: false,
  },
  {
    id: 2,
    icon: Factory,
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    tagColor: 'bg-blue-100 text-blue-700',
    buttonColor: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    title: 'Nhà Máy Sản Xuất',
    description:
      'Bảo vệ tài sản và đảm bảo an toàn lao động với hệ thống giám sát công nghiệp chuyên biệt',
    features: [
      'Giám sát khu vực sản xuất và kho bãi',
      'Phát hiện vi phạm an toàn lao động',
      'Cảnh báo rò rỉ khí độc, cháy nổ',
      'Tối ưu quy trình và giảm thiểu rủi ro',
    ],
    image: FactoryImage,
    alt: 'Manufacturing Plant Security',
    learnMoreLink: '#manufacturing-solution',
    reverse: true,
  },
];

export default function SecureLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    <div ref={scrollContainerRef} className="overflow-y-auto max-h-screen secure-landing-page">
      <Header scrolled={scrolled} />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-6">
              <Icons.Zap className="w-4 h-4 mr-2" />
              Công Nghệ AI Tiên Tiến
            </div>
            <h1 className="text-3xl tablet:text-3xl smallLaptop:text-6xl font-extrabold text-white mb-6 leading-tight">
              Giải Pháp Giám Sát
              <br />
              <span
                className="block text-4xl tablet:text-5xl smallLaptop:text-7xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 mt-2"
                style={{ letterSpacing: '-0.03em', lineHeight: 1.175 }}
              >
                An Ninh Thông Minh
              </span>
            </h1>
            <p className="text-xl smallLaptop:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Hệ thống camera AI và cảm biến tiên tiến bảo vệ tòa nhà và nhà máy của bạn 24/7 với
              khả năng phát hiện và cảnh báo thông minh
            </p>
          </div>
          <div className="flex flex-col tablet:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-xl">
              Tư Vấn Miễn Phí
              <Icons.Shield className="inline-block w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
            </button>
            <button className="group flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all">
              <Icons.Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Xem Demo
            </button>
          </div>
          <div className="grid grid-cols-2 smallLaptop:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {heroStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl smallLaptop:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-20 left-20 text-blue-400 animate-bounce animation-delay-1000">
          <Icons.Eye className="w-8 h-8" />
        </div>
        <div className="absolute bottom-20 right-20 text-teal-400 animate-bounce animation-delay-3000">
          <Icons.Shield className="w-8 h-8" />
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4">
              Tính Năng Vượt Trội
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Giải pháp toàn diện với công nghệ tiên tiến nhất để bảo vệ tài sản và con người
            </p>
          </div>

          <div className="grid tablet:grid-cols-2 smallLaptop:grid-cols-3 gap-8">
            {securityFeatures.map(feature => {
              const renderIcon = () => {
                switch (feature.icon) {
                  case 'Camera':
                    return <Icons.Camera className="w-8 h-8" />;
                  case 'SensorNetwork':
                    return <Icons.SensorNetwork className="w-8 h-8" />;
                  case 'Brain':
                    return <Icons.Brain className="w-8 h-8" />;
                  case 'Smartphone':
                    return <Icons.Smartphone className="w-8 h-8" />;
                  case 'Bell':
                    return <Icons.Bell className="w-8 h-8" />;
                  case 'Lock':
                    return <Icons.Lock className="w-8 h-8" />;
                  default:
                    return <Icons.Shield className="w-8 h-8" />;
                }
              };

              return (
                <div
                  key={feature.id}
                  className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradientFrom} ${feature.gradientTo} text-white mb-6 group-hover:scale-110 transition-transform`}
                  >
                    {renderIcon()}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <a
                    href={feature.learnMoreLink}
                    className="mt-6 flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors"
                  >
                    Tìm hiểu thêm
                    <Icons.ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="solutions" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4">
              Giải Pháp Chuyên Biệt
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tùy chỉnh theo từng loại hình kinh doanh với các tính năng phù hợp
            </p>
          </div>
          <div className="space-y-20">
            {solutions.map(solution => {
              const IconComponent = solution.icon;
              const isReversed = solution.reverse;

              return (
                <div
                  key={solution.id}
                  className={`flex flex-col smallLaptop:flex-row items-center gap-12 ${isReversed ? 'smallLaptop:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center mb-6">
                      <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl mr-4">
                        <IconComponent
                          className="w-12 h-12"
                          {...(solution.icon === Factory ? { mirrored: true } : {})}
                        />
                      </div>
                      <h3 className="text-2xl smallLaptop:text-3xl font-bold text-gray-900">
                        {solution.title}
                      </h3>
                    </div>

                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {solution.description}
                    </p>
                    <div className="space-y-4 mb-8">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start">
                          <Icons.ShieldCheck className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <a
                      href={solution.learnMoreLink}
                      className={`inline-block ${solution.buttonColor} text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105`}
                    >
                      Tìm Hiểu Chi Tiết
                    </a>
                  </div>
                  <div className="flex-1">
                    <div className="relative group">
                      <img
                        src={solution.image}
                        alt={solution.alt}
                        className="w-full h-80 object-cover rounded-2xl shadow-2xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 bg-gradient-to-b from-[#0B1E3C] to-[#183B6B]">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <h2 className="text-3xl smallLaptop:text-4xl font-bold text-white mb-2 text-center">
            Lợi Ích Vượt Trội
          </h2>
          <p className="text-lg text-blue-100 mb-12 text-center">
            Những con số thực tế từ khách hàng đã triển khai hệ thống
          </p>
          <div className="grid grid-cols-1 tablet:grid-cols-2 smallLaptop:grid-cols-4 gap-8 mb-10">
            {benefitsData.map(benefit => {
              return (
                <div
                  key={benefit.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-6">
                    <div
                      className={`mb-4 p-4 rounded-xl bg-white/10 flex items-center justify-center ${benefit.iconColor}`}
                    >
                      {React.cloneElement(benefit.icon, {
                        className: `w-8 h-8 ${benefit.iconColor}`,
                      })}
                    </div>
                  </div>

                  <div className={`text-4xl font-bold mb-2 ${benefit.color}`}>
                    {benefit.percentage}
                  </div>
                  <div className="text-xl font-bold text-white text-center mb-2 leading-tight">
                    {benefit.title}
                  </div>
                  <div className="text-blue-100 text-center text-base leading-relaxed">
                    {benefit.description}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all">
              Tính Toán ROI Cho Dự Án
            </button>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <h2 className="text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4 text-center">
            Khách Hàng Nói Gì
          </h2>
          <p className="text-lg text-gray-600 mb-10 text-center">
            Hơn 500 khách hàng tin tưởng và hài lòng với dịch vụ của chúng tôi
          </p>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center mb-4">
                  <Icons.Quotes className="w-8 h-8 text-blue-600 mr-2" />
                  <span className="flex text-yellow-500 mr-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Icons.Star key={i} className="w-5 h-5" />
                    ))}
                  </span>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center mt-auto pt-4">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 border-2 border-blue-100">
                      <User className="w-7 h-7 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-gray-600 text-sm">{t.position}</div>
                    <a
                      href={t.companyUrl}
                      className="text-blue-600 text-sm hover:underline font-medium"
                    >
                      {t.company}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg transition-all">
              Xem Thêm Case Study
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Liên Hệ Tư Vấn</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Để lại thông tin để nhận tư vấn miễn phí và báo giá chi tiết
            </p>
          </div>
          <div className="grid grid-cols-1 smallLaptop:grid-cols-2 gap-12">
            {(() => {
              const contactMethods = [
                {
                  icon: <Phone size={28} className="text-blue-600" />,
                  label: 'Hotline',
                  values: ['1900 1234 (24/7)', '028 1234 5678'],
                },
                {
                  icon: <EnvelopeSimple size={28} className="text-blue-600" />,
                  label: 'Email',
                  values: ['info@securevision.com', 'sales@securevision.com'],
                },
                {
                  icon: <MapPin size={28} className="text-blue-600" />,
                  label: 'Địa Chỉ',
                  values: ['123 Đường Nguyễn Văn Linh', 'Quận 7, TP. Hồ Chí Minh'],
                },
              ];
              const commitments = [
                'Tư vấn miễn phí 24/7',
                'Khảo sát hiện trường miễn phí',
                'Bảo hành 3 năm toàn diện',
                'Hỗ trợ kỹ thuật 24/7',
              ];
              return (
                <div className="rounded-2xl p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Thông Tin Liên Hệ</h3>
                  {contactMethods.map((method, idx) => (
                    <div className="flex items-start mb-6" key={method.label + idx}>
                      <div className="bg-blue-100 p-3 rounded-xl mr-4 flex items-center justify-center">
                        {method.icon}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">{method.label}</div>
                        {method.values.map((v, i) => (
                          <div className="text-gray-700 leading-tight" key={i}>
                            {v}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="font-bold text-gray-900 mb-3">Cam Kết Của Chúng Tôi</div>
                    <ul className="space-y-2">
                      {commitments.map((c, i) => (
                        <li className="flex items-center text-green-600" key={i}>
                          <Icons.CheckCircle className="w-5 h-5 mr-2" />
                          <span className="text-gray-700">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            <div className="bg-white p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 smallLaptop:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số Điện Thoại *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                      placeholder="0901 234 567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                      placeholder="email@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Công Ty</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                      placeholder="Tên công ty"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô Tả Dự Án *
                  </label>
                  <textarea
                    rows={4}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    placeholder="Mô tả ngắn gọn về dự án, diện tích cần giám sát, yêu cầu đặc biệt..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <Icons.PaperPlaneTilt className="lucide lucide-send w-5 h-5 mr-2" />
                  Gửi Yêu Cầu Tư Vấn
                </button>
                <div className="text-sm text-gray-500 text-center mt-2">
                  Bằng việc gửi form, bạn đồng ý với{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    Chính sách bảo mật
                  </a>{' '}
                  của chúng tôi
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#101828] text-gray-400 pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8 flex flex-col smallLaptop:flex-row gap-12 md:gap-0 justify-between">
          <div className="flex-1 mb-8 smallLaptop:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-xl flex items-center justify-center">
                <Icons.Shield className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">SecureVision</span>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-xs">
              Chuyên cung cấp giải pháp giám sát an ninh thông minh với công nghệ AI tiên tiến, bảo
              vệ tài sản và con người 24/7.
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-5 h-5 mr-2 text-blue-400" />
                1900 1234 (24/7)
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <EnvelopeSimple className="w-5 h-5 mr-2 text-blue-400" />
                info@securevision.com
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                123 Nguyễn Văn Linh, Q7, HCM
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              {[
                {
                  href: '#',
                  label: 'Facebook',
                  icon: <FacebookLogo className="w-5 h-5 text-white" />,
                },
                {
                  href: '#',
                  label: 'Twitter',
                  icon: <TwitterLogo className="w-5 h-5 text-white" />,
                },
                {
                  href: '#',
                  label: 'LinkedIn',
                  icon: <LinkedinLogo className="w-5 h-5 text-white" />,
                },
                {
                  href: '#',
                  label: 'YouTube',
                  icon: <YoutubeLogo className="w-5 h-5 text-white" />,
                },
              ].map((item, idx) => (
                <a
                  key={item.label + idx}
                  href={item.href}
                  className="bg-[#1D2939] hover:bg-blue-600 transition-colors p-2 rounded-lg"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex-[2] grid grid-cols-2 smallLaptop:grid-cols-4 gap-8">
            {[
              {
                title: 'Sản Phẩm',
                links: [
                  { label: 'Camera An Ninh', href: '#' },
                  { label: 'Hệ Thống Cảm Biến', href: '#' },
                  { label: 'Phần Mềm Giám Sát', href: '#' },
                  { label: 'Ứng Dụng Di Động', href: '#' },
                  { label: 'Báo Cáo Phân Tích', href: '#' },
                ],
              },
              {
                title: 'Giải Pháp',
                links: [
                  { label: 'Tòa Nhà Văn Phòng', href: '#' },
                  { label: 'Nhà Máy Sản Xuất', href: '#' },
                  { label: 'Khu Dân Cư', href: '#' },
                  { label: 'Trung Tâm Thương Mại', href: '#' },
                  { label: 'Kho Bãi', href: '#' },
                ],
              },
              {
                title: 'Hỗ Trợ',
                links: [
                  { label: 'Tài Liệu Kỹ Thuật', href: '#' },
                  { label: 'Video Hướng Dẫn', href: '#' },
                  { label: 'FAQ', href: '#' },
                  { label: 'Liên Hệ Hỗ Trợ', href: '#' },
                  { label: 'Đặt Lịch Tư Vấn', href: '#' },
                ],
              },
              {
                title: 'Công Ty',
                links: [
                  { label: 'Giới Thiệu', href: '#' },
                  { label: 'Tin Tức', href: '#' },
                  { label: 'Tuyển Dụng', href: '#' },
                  { label: 'Đối Tác', href: '#' },
                  { label: 'Chính Sách Bảo Mật', href: '#' },
                ],
              },
            ].map((col, idx) => (
              <div key={col.title + idx}>
                <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, lidx) => (
                    <li key={link.label + lidx}>
                      <a href={link.href} className="hover:text-white transition">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="border-[#1D2939] my-8 max-w-7xl mx-auto" />
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8 flex flex-col smallLaptop:flex-row justify-between items-center text-sm text-gray-500 gap-2">
          <div>© 2025 SecureVision. Tất cả quyền được bảo lưu.</div>
          <div className="flex flex-wrap gap-4 mt-2 md:mt-0">
            {[
              { label: 'Điều Khoản Sử Dụng', href: '#' },
              { label: 'Chính Sách Bảo Mật', href: '#' },
              { label: 'Cookie Policy', href: '#' },
            ].map(item => (
              <a key={item.label} href={item.href} className="hover:text-white transition">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
