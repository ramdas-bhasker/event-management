import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: 'var(--brand-green)',
          'green-hover': 'var(--brand-green-hover)',
          'green-light': 'var(--brand-green-light)',
          ivory: 'var(--brand-ivory)',
          'ivory-hover': 'var(--brand-ivory-hover)',
          'ivory-subtle': 'var(--brand-ivory-subtle)',
          gold: 'var(--brand-gold)',
          'gold-light': 'var(--brand-gold-light)',
          'gold-border': 'var(--brand-gold-border)',
          'gold-dark': 'var(--brand-gold-dark)',
          white: 'var(--brand-white)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          default: 'var(--border-default)',
          focus: 'var(--border-focus)',
        },
        state: {
          success: 'var(--state-success)',
          'success-bg': 'var(--state-success-bg)',
          warning: 'var(--state-warning)',
          'warning-bg': 'var(--state-warning-bg)',
          error: 'var(--state-error)',
          'error-hover': 'var(--state-error-hover)',
          'error-bg': 'var(--state-error-bg)',
          info: 'var(--state-info)',
          'info-bg': 'var(--state-info-bg)',
        },
        whatsapp: {
          DEFAULT: 'var(--whatsapp-green)',
          hover: 'var(--whatsapp-green-hover)',
          tint: 'var(--whatsapp-green-tint)',
          border: 'var(--whatsapp-green-border)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        header: 'var(--shadow-header)',
      },
      maxWidth: {
        container: 'var(--container-max)',
        wide: 'var(--container-wide)',
      },
    },
  },
  plugins: [],
};

export default config;
