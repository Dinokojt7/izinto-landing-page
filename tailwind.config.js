// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1' }],
        'display-md': ['2.5rem', { lineHeight: '1.2' }],
        'display-sm': ['2rem', { lineHeight: '1.3' }],
      },
      colors: {
        primary: '#121212',
        cartBlue: 'rgba(0, 0, 191, 0.737)',
        accent: '#cfc5a5',
        notice: '#3b82f6'
      }
    }
  }
}