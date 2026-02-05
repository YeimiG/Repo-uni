/* tailwind config */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ieproes: {
          primary: '#78D1F5',
          light: '#D1E9F6', 
          dark: '#4A90E2',
          accent: '#F0F8FF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
    },
  },
};