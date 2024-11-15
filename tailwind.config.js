/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,ts}'];
export const theme = {
  extend: {
    fontFamily: {
      console: ['Inconsolata', 'monospace'],
      script: ['Playwrite', 'cursive']
    },
    colors: {
      primary: 'rgba(104, 192, 210, 1)',
      primary_dark: 'rgb(77, 156, 172)',
      primary_light: 'rgb(135, 220, 237)',
      secondary: 'rgba(169, 196, 120, 1)'
    }
  }
};
export const plugins = [];
