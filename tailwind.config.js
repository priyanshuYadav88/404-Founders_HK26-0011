/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0B0F17',
          secondary: '#111827',
          surface: '#151D2C',
          elevated: '#1E293B',
          card: '#0E1626'
        },
        border: {
          DEFAULT: '#1E293B',
          subtle: '#192434',
          accent: '#0E7490'
        },
        soc: {
          cyan: '#06B6D4',
          cyanHover: '#0891B2',
          cyanSubtle: 'rgba(6, 182, 212, 0.12)',
          red: '#EF4444',
          redSubtle: 'rgba(239, 68, 68, 0.12)',
          amber: '#F59E0B',
          amberSubtle: 'rgba(245, 158, 11, 0.12)',
          green: '#10B981',
          greenSubtle: 'rgba(16, 185, 129, 0.12)',
          blue: '#3B82F6',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
