export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: { 'oklab-function': true },
      browsers: 'defaults',
    },
  },
}

