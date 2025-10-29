/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'dark-bg': '#000000',
        'dark-panel': '#0a0a0a',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
        'neon-magenta': '0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff',
        'glow': '0 0 10px currentColor',
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

