/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}',
    './src/**/*.{js,jsx,ts,tsx}', 
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#F72585',
        'deep-purple': '#6D08B1',
        'light-gray': '#E3EAE3',
        'sand': '#EAD2AC',
        'muted-purple': '#74327D',
        'beige': '#F5F5DC',
        'pale-yellow': '#E3E0A3',
        'olive': '#9AB973',
        'sea-green': '#3A976F',
        'royal-blue': '#312599',
        'forest-green': '#21421E',
        'dark-green': '#123524',
        'bright-blue': '#4CC9F0',
        'teal': '#3A0CA3',
        'indigo': '#3F37C9',
      },
      backgroundImage: {
        'custom-gradient': 'radial-gradient(125% 125% at 50% 10%, #000 40%, #63e 100%)',
        'pink-purple-gradient': 'linear-gradient(to right, #F72585, #3A0CA3)',
        'green-purple-gradient': 'linear-gradient(to right, #3A976F, #3A0CA3)',
        'green-purple-liquid': "url('./public/green-purple-liquid.avif')",
        // 'custom-image': "url('/path/to/your/image.jpg')"
      },
    },
  },
  plugins: [],
}

