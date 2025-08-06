/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        textPrimary: '#3A3D41',
        primary: '#007EF5'
      }
    },
    screens: {
      mobile: '480px',
      tablet: '744px',
			miniLaptop: '1280px',
      smallLaptop: '1024px',
      laptop: '1440px',
      desktop: '1728px'
    }
  },
  plugins: []
};
