/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        camlife: {
          primary: '#0D47A1',
          secondary: '#1565C0',
          navy: '#0A2540',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          emergency: '#E53935',
          success: '#16A34A',
          warning: '#F59E0B',
          teal: '#0891B2',
          purple: '#7E57C2',
          pink: '#EC4899',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B',
          // Legacy mappings for backwards compatibility during refactor
          deep: '#0D47A1',
          action: '#0D47A1',
          'action-hover': '#1565C0',
          light: '#EFF6FF',
          gold: '#F59E0B',
          'gold-light': '#FEF3C7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Kantumruy Pro', 'Kantumruuy Pro', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        khmer: ['Kantumruy Pro', 'Kantumruuy Pro', 'Hanuman', 'sans-serif']
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 12px 24px -4px rgba(13, 71, 161, 0.09), 0 4px 8px -2px rgba(13, 71, 161, 0.04)',
        'dropdown': '0 20px 25px -5px rgba(10, 37, 64, 0.12), 0 8px 10px -6px rgba(10, 37, 64, 0.06)'
      },
      borderRadius: {
        '2xl': '16px',
        'xl': '12px'
      }
    },
  },
  plugins: [],
}
