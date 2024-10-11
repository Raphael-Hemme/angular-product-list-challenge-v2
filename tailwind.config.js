/** @type {import('tailwindcss').Config} */
export const content = ['./src/**/*.{html,ts}'];
export const theme = {
  extend: {
    fontFamily: {
      console: ['Inconsolata', 'monospace'],
      script: ['Playwrite', 'cursive']
    }
  }
};
export const plugins = [];
