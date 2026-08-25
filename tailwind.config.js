/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070912',
          900: '#0b0e1a',
          850: '#0f1322',
          800: '#131829',
          750: '#181d33',
          700: '#1e2440',
          600: '#283056',
          500: '#36406e',
        },
        violet: {
          glow: '#7c5cff',
          400: '#9b7cff',
          500: '#7c5cff',
          600: '#6a3fff',
        },
        indigo: {
          neon: '#4f7bff',
        },
        cyan: {
          neon: '#3df0e6',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,92,255,0.35), 0 8px 40px -8px rgba(124,92,255,0.45)',
        'glow-cyan': '0 0 0 1px rgba(61,240,230,0.3), 0 8px 40px -8px rgba(61,240,230,0.35)',
        panel: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 20px 60px -20px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(124,92,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'bar-rise': {
          '0%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease both',
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'bar-rise': 'bar-rise 0.8s cubic-bezier(0.16,1,0.3,1) both',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
