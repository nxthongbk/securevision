import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../SecureVision/common/Icons';

export default function Header({ scrolled }: { scrolled: boolean }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // const handleSignIn = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   setMenuOpen(false);
  //   navigate('/login');
  // };

	const navItems = [
		{ label: 'Tính Năng', href: '#features' },
		{ label: 'Giải Pháp', href: '#solutions' },
		{ label: 'Lợi Ích', href: '#benefits' },
		{ label: 'Khách Hàng', href: '#customers' },
		{ label: 'Liên Hệ', href: '#contact' },
	];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all ${
          scrolled ? 'bg-white shadow text-gray-900' : 'bg-transparent text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 smallLaptop:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Icons.Shield className="w-6 h-6 text-white" />
            </div>
            <span className={`${scrolled ? 'text-gray-900' : 'text-white'}`}>SecureVision</span>
          </div>

          <nav className="hidden smallLaptop:flex space-x-8">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className="font-medium text-inherit hover:text-blue-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden smallLaptop:flex items-center space-x-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate('/login');
              }}
              className="px-4 py-2 rounded-lg font-medium text-inherit hover:bg-gray-100 transition-colors duration-300"
            >
              Đăng Nhập
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 rounded-lg font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-transform transform hover:scale-105">
              Tư Vấn Miễn Phí
            </button>
          </div>

          <button
            className="smallLaptop:hidden p-2 rounded-lg text-inherit hover:bg-white/10 transition-colors duration-300"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu w-6 h-6"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-6 p-6 smallLaptop:hidden">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-gray-600 text-2xl"
          >
            ✕
          </button>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="text-lg font-semibold text-gray-800"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate('/login');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg mt-4"
          >
            Đăng Nhập
          </button>
        </div>
      )}
    </>
  );
}
