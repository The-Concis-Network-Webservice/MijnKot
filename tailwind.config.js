/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary: Warm Sage (main accent)

        // Mijn Kot color palette:
        // #e7e0d5 → Beige
        // #ca4b1c → Orange
        // #4d5935 → Primary Green
        // #434341 → Gray

        primary: {
          50: '#f4f7f5',
          100: '#e8eeeb',
          200: '#d1ddd6',
          300: '#b9ccc1',
          400: '#a2bbac',
          500: '#8FA89A', // Main sage accent
          600: '#748a7b',
          700: '#5a6b5e',
          800: '#414d45',
          900: '#2d362f',
        },
        // Secondary: Pale Sage (subtle UI)
        secondary: {
          50: '#fafcfb',
          100: '#f5f9f7',
          200: '#ebf3ef',
          300: '#e0ede7',
          400: '#d6e7df',
          500: '#C9D8CF', // Pale sage
          600: '#a8bab0',
          700: '#879d91',
          800: '#687d73',
          900: '#4a5d55',
        },
        // Surface backgrounds
        surface: {
          main: '#F8FAF9',      // Soft off-white background
          card: '#FFFFFF',       // Card/surface white
          subtle: '#F0F4F2',     // Very subtle variation
        },
        // Text colors
        text: {
          main: '#2B2F2C',       // Graphite
          secondary: '#6E7C75',  // Grey-green
          muted: '#8B9690',      // Lighter grey-green
          light: '#A8B4AE',      // Very light for meta
        },
        // Borders & dividers
        border: {
          light: '#E3ECE7',      // Very subtle
          DEFAULT: '#D1DED6',    // Default border
          medium: '#B8C9BF',     // Slightly visible
        },
        // State colors (calm versions)
        state: {
          success: '#6B9E7F',    // Calm green
          warning: '#C9A86A',    // Warm amber
          error: '#C17B7B',      // Soft red
          info: '#7B9BC1',       // Soft blue
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.65' }],
        'lg': ['1.125rem', { lineHeight: '1.7' }],
        'xl': ['1.25rem', { lineHeight: '1.7' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        '3xl': ['1.875rem', { lineHeight: '1.3' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
      },
      borderRadius: {
        'sm': '0.375rem',
        DEFAULT: '0.5rem',
        'md': '0.625rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(43, 47, 44, 0.04), 0 1px 2px 0 rgba(43, 47, 44, 0.03)',
        'soft': '0 4px 6px -1px rgba(43, 47, 44, 0.06), 0 2px 4px -1px rgba(43, 47, 44, 0.04)',
        'medium': '0 10px 15px -3px rgba(43, 47, 44, 0.08), 0 4px 6px -2px rgba(43, 47, 44, 0.04)',
        'large': '0 20px 25px -5px rgba(43, 47, 44, 0.08), 0 10px 10px -5px rgba(43, 47, 44, 0.03)',
      }
    }
  },
  plugins: []
};

