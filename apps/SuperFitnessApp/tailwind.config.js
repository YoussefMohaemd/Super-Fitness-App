const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'apps/SuperFitnessApp/src/**/!(*.stories|*.spec).{ts,html,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff4100',
        darkText: '#333333',
      },
      borderRadius: {
        xl: '20px',
      },
      fontFamily: {
        baloo: ['BalooThambi2', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
};
