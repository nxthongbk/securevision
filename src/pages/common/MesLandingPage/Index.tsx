import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Lightning,
  ChartBar,
  Shield,
  List,
  Factory,
  ArrowRight,
  Monitor,
  Users,
  Phone,
  EnvelopeSimple,
  MapPin,
} from '@phosphor-icons/react';

const features = [
  {
    icon: <Monitor className="text-blue-600" size={32} />,
    title: 'Giám sát thời gian thực',
    desc: 'Theo dõi toàn bộ quy trình sản xuất 24/7 với dashboard trực quan',
  },
  {
    icon: <ChartBar className="text-blue-600" size={32} />,
    title: 'Báo cáo chi tiết',
    desc: 'Phân tích hiệu suất, chất lượng và tối ưu hóa quy trình sản xuất',
  },
  {
    icon: <Users className="text-blue-600" size={32} />,
    title: 'Quản lý nhân sự',
    desc: 'Theo dõi năng suất, chấm công và phân công công việc hiệu quả.',
  },
  {
    icon: <Clock className="text-blue-600" size={32} />,
    title: 'Lên kế hoạch sản xuất',
    desc: 'Tối ưu hóa lịch trình và tài nguyên để tăng hiệu suất sản xuất',
  },
  {
    icon: <Shield className="text-blue-600" size={32} />,
    title: 'Kiểm soát chất lượng',
    desc: 'Đảm bảo tiêu chuẩn chất lượng cao với hệ thống kiểm tra tự động',
  },
  {
    icon: <Lightning className="text-blue-600" size={32} />,
    title: 'Tự động hóa',
    desc: 'Giảm thiểu công việc thủ công và tăng độ chính xác',
  },
];

const howItWorksSteps = [
  {
    number: '1',
    title: 'Phân tích & Tư vấn',
    desc: 'Khảo sát thực tế và đưa ra giải pháp phù hợp với quy mô nhà máy',
  },
  {
    number: '2',
    title: 'Triển khai & Cài đặt',
    desc: 'Cài đặt hệ thống và tích hợp với các thiết bị hiện có',
  },
  {
    number: '3',
    title: 'Đào tạo & Vận hành',
    desc: 'Đào tạo nhân viên và hỗ trợ vận hành 24/7',
  },
];

const dashboards = [
  {
    name: 'Dây chuyền A',
    efficiency: 98,
    color: 'text-green-600 bg-green-50',
  },
  {
    name: 'Dây chuyền B',
    efficiency: 95,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'Dây chuyền C',
    efficiency: 92,
    color: 'text-yellow-600 bg-yellow-50',
  },
];

const benefits = [
  'Tăng năng suất lên đến 30%',
  'Giảm thời gian chết máy 25%',
  'Cải thiện chất lượng sản phẩm',
  'Tiết kiệm chi phí vận hành',
  'Báo cáo tự động và chính xác',
  'Tuân thủ tiêu chuẩn quốc tế',
];

const testimonials = [
  {
    rating: 5,
    quote:
      'Hệ thống MES đã giúp chúng tôi tăng hiệu suất sản xuất đáng kể và giảm thiếu sót trong quy trình.',
    name: 'Nguyễn Tấn Dũng',
    position: 'Giám đốc sản xuất',
    company: 'Công ty May Poseidon',
    companyUrl: '#',
  },
  {
    rating: 5,
    quote: 'Giao diện trực quan và dễ sử dụng. Nhân viên có thể làm quen nhanh chóng với hệ thống.',
    name: 'Trần Nguyễn Duy Anh',
    position: 'Quản lý nhà máy',
    company: 'Tập đoàn Dệt May Đức Phát Gia Lai',
    companyUrl: '#',
  },
];

const footerLinks = [
  {
    title: 'Sản phẩm',
    links: [
      { label: 'Hệ thống MES', href: '#home' },
      { label: 'Dashboard', href: '#pricing' },
      { label: 'Báo cáo', href: '#api' },
      { label: 'Tích hợp', href: '#integrations' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Tài liệu', href: '#about' },
      { label: 'Đào tạo', href: '#blog' },
      { label: 'Hỗ trợ kỹ thuật', href: '#careers' },
      { label: 'FAQ', href: '#contact' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về chúng tôi', href: '#docs' },
      { label: 'Tin tức', href: '#help' },
      { label: 'Tuyển dụng', href: '#cases' },
      { label: 'Liên hệ', href: '#whitepapers' },
    ],
  },
];

export default function MesLandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <div className="overflow-y-auto max-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header>
        <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 mobile:px-6 miniLaptop:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Factory size={48} className="text-blue-600 p-1 rounded-md mr-2" mirrored />
                  <span className="text-xl font-bold text-gray-900">TMES</span>
                </div>
              </div>
              <div className="hidden tablet:flex space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tính năng
                </a>
                <a href="#benefits" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Lợi ích
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Đánh giá
                </a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Liên hệ
                </a>
              </div>

              <div className="hidden tablet:flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={handleSignIn}
                >
                  Đăng nhập
                </a>
                <a
                  href="#contact"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dùng thử miễn phí
                </a>
              </div>

              <div className="tablet:hidden">
                <button
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setMenuOpen(true)}
                  aria-label="Open menu"
                >
                  <List size={24} />
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
          <div className="relative w-full bg-white border-b border-gray-200 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className=" flex items-center justify-center">
                  <Factory size={48} className="text-blue-600 p-1 rounded-md mr-2" mirrored />
                  <span className="text-xl font-bold text-gray-900">TMES</span>
                </div>
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
                Tính năng
              </a>
              <a
                href="#benefits"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                Lợi ích
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                Đánh giá
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-600 text-base py-2"
                onClick={() => setMenuOpen(false)}
              >
                Liên hệ
              </a>
              <hr className="my-2" />
              <button
                className="text-gray-700 hover:text-blue-600 text-base text-left py-2"
                onClick={handleSignIn}
              >
                Đăng nhập
              </button>
              <a
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
                href="#contact"
              >
                Dùng thử miễn phí
              </a>
            </nav>
          </div>
        </div>
      )}

      <section id="home" className="pt-24 pb-12 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="grid tablet:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl smallLaptop:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Hệ thống MES<span className="text-blue-600 block">cho nhà máy may</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Tối ưu hóa quy trình sản xuất, tăng năng suất và kiểm soát chất lượng với giải pháp
                MES hàng đầu dành riêng cho ngành dệt may.
              </p>
              <div className="flex flex-col tablet:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
                  Dùng thử miễn phí 30 ngày
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors">
                  Xem demo
                </button>
              </div>
            </div>
            <div className="smallLaptop:pl-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard Sản Xuất</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {dashboards.map((dashboard, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-3  rounded-lg ${dashboard.color.split(' ')[1]}`}
                    >
                      <span className="text-sm font-medium text-gray-700">{dashboard.name}</span>
                      <span className={` ${dashboard.color.split(' ')[0]}`}>
                        {dashboard.efficiency}% hiệu suất
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng sản lượng hôm nay</span>
                    <span className="font-semibold text-gray-900">2,847 sản phẩm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Giải pháp toàn diện để quản lý và tối ưu hóa mọi khía cạnh của nhà máy may
            </p>
          </div>

          <div className="grid tablet:grid-cols-2 smallLaptop:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="grid smallLaptop:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-6">
                Lợi ích vượt trội cho doanh nghiệp
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Hệ thống TMES mang lại hiệu quả thiết thực, giúp doanh nghiệp tăng cường cạnh
                tranh và phát triển bền vững.
              </p>
              <div className="space-y-4">
                {benefits.map((item, idx) => (
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
              </div>
            </div>
            <div className="smallLaptop:pl-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Kết quả sau 6 tháng triển khai
                </h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">30%</div>
                    <div className="text-gray-600">Tăng năng suất</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">25%</div>
                    <div className="text-gray-600">Giảm lãng phí</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                    <div className="text-gray-600">Độ chính xác</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl miniLaptop:text-4xl font-bold text-gray-900 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình triển khai đơn giản và hiệu quả
            </p>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-12">
            {howItWorksSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-blue-600">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <h2 className="text-3xl smallLaptop:text-4xl font-bold text-gray-900 mb-4 text-center">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 mb-10 text-center">
            Hơn 500+ nhà máy may tin tưởng sử dụng TMES
          </p>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-8">
                <div className="flex items-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-award h-8 w-8 text-yellow-500 mr-3"
                  >
                    <circle cx="12" cy="8" r="6"></circle>
                    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
                  </svg>
                  <span className="text-yellow-500 font-bold">{'★'.repeat(t.rating)}</span>
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.quote}"</p>
                <hr className="mb-4" />
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-gray-600 text-sm">{t.position}</div>
                  <a href={t.companyUrl} className="text-blue-600 text-sm hover:underline">
                    {t.company}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 mobile:px-6 smallLaptop:px-8">
          <h2 className="text-3xl smallLaptop:text-4xl font-bold text-white mb-6">
            Sẵn sàng tối ưu hóa nhà máy của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bắt đầu dùng thử miễn phí 30 ngày và trải nghiệm sức mạnh của MES Pro
          </p>
          <div className="flex flex-col tablet:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors">
              Dùng thử miễn phí
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Tư vấn miễn phí
            </button>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 smallLaptop:px-8">
          <div className="grid smallLaptop:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-lg text-gray-600 mb-8">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone size={24} className="text-blue-600 mr-4" />
                  <span className="text-gray-700">+84 909 774 543</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeSimple size={24} className="text-blue-600 mr-4" />
                  <span className="text-gray-700">ttnghiep@tma.com.vn</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={24} className="text-blue-600 mr-4" />
                  <span className="text-gray-700"></span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tin nhắn</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    placeholder="Mô tả yêu cầu của bạn..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 mobile:px-6 laptop:px-8 flex flex-col miniLaptop:flex-row gap-12 miniLaptop:gap-0 justify-between">
          <div className="flex-1 mb-8 miniLaptop:mb-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center">
                <Factory size={48} className="text-blue-600 p-1 rounded-md mr-2" mirrored />
                <span className="text-xl font-bold text-white">TMES</span>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 miniLaptop:max-w-xs">
              Giải pháp MES hàng đầu cho ngành dệt may Việt Nam, giúp tối ưu hóa sản xuất và nâng
              cao hiệu quả.
            </p>
          </div>
          <div className="flex-[2] grid grid-cols-1 tablet:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href={link.href} className="text-gray-400 hover:text-white transition">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <hr className="border-gray-700 my-8 max-w-7xl mx-auto" />
        <div className="text-center text-gray-400 text-sm">
          © 2025 TMA MES. Tất cả quyền được bảo lưu.
        </div>
      </footer>
    </div>
  );
}
