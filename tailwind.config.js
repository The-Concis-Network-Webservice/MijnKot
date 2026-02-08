/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary: Warm Sage (main accent)

        // Mijn Kot color palette:
        // #e7e0d5 → Beige = Secondary
        // #ca4b1c → Orange = Accent
        // #4d5935 → Primary Green = Primary
        // #434341 → Gray = Text

        primary: {
          // New custom palette for mijn kot branding:
          50: '#dcf8a5',
          100: '#c8e490',
          200: '#a7bf77',
          300: '#899d61',
          400: '#6a7a4b',
          500: '#4d5935', // Main sage accent (primary)
          600: '#3e482a',
          700: '#30381f',
          800: '#202614',
          900: '#13170a',
          950: '#0c0f06',

          // Original palette:
          // 50: '#f4f7f5',
          // 100: '#e8eeeb',
          // 200: '#d1ddd6',
          // 300: '#b9ccc1',
          // 400: '#a2bbac',
          // 500: '#8FA89A', // Main sage accent
          // 600: '#748a7b',
          // 700: '#5a6b5e',
          // 800: '#414d45',
          // 900: '#2d362f',
        },

        // Secondary: Pale Sage (subtle UI)
        secondary: {
          // New custom palette for mijn kot branding:
          50: '#fdfcfb',
          100:' #faf9f7',
          200:' #f6f3f0',
          300:' #f1ede8',
          400:' #ede7e0',
          500:' #e7e0d5', // Main pale sage accent (secondary)
          600:' #b9af9f',
          700:' #888074',
          800:' #59544c',
          900:' #2f2c27',
          950:' #1b1916',

          // Original palette:
          // 50: '#fafcfb',
          // 100: '#f5f9f7',
          // 200: '#ebf3ef',
          // 300: '#e0ede7',
          // 400: '#d6e7df',
          // 500: '#C9D8CF', // Pale sage
          // 600: '#a8bab0',
          // 700: '#879d91',
          // 800: '#687d73',
          // 900: '#4a5d55',
        },

        accent: {
          // New custom palette for mijn kot branding:
          50: '#feedeb',
          100: '#fddbd6',
          200: '#fbb5ab',
          300: '#fa8972',
          400: '#f45c24',
          500: '#ca4b1c', // Main orange accent (for highlights and calls to action)
          600: '#a13a14',
          700: '#7a2a0c',
          800: '#591c06',
          900: '#370e02',
          950: '#250701',
        },

        // Surface backgrounds
        surface: {
          // New custom palette for mijn kot branding:
          main: '#F8FAF9',      // Soft off-white background
          card: '#FFFFFF',       // Card/surface white
          subtle: '#e7e0d5',     // Very subtle variation

          // // Original palette:
          // main: '#F8FAF9',      // Soft off-white background
          // card: '#FFFFFF',       // Card/surface white
          // subtle: '#F0F4F2',     // Very subtle variation
        },

        neutral: {
          // New custom palette for mijn kot branding:
           50:  '#9F9F9C',
            100: '#959592',
            200: '#81817D',
            300: '#6C6C69',
            400: '#585855',
            500: '#434341', // Main gray for text and neutral elements
            600: '#272725',
            700: '#0A0A0A',
            800: '#000000',
            900: '#000000',
            950: '#000000',
        },

        // Text colors
        text: {
          // New custom palette for mijn kot branding:
          main: '#434341', // Gray
          secondary: '#e7e0d5', // Beige
          muted: '#8B9690',      // Lighter grey-green
          light: '#A8B4AE',      // Very light for meta

          // Original palette:
          // main: '#2B2F2C',       // Graphite
          // secondary: '#6E7C75',  // Grey-green
          // muted: '#8B9690',      // Lighter grey-green
          // light: '#A8B4AE',      // Very light for meta
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

