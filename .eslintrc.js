module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue'
  ],
  plugins: [
    'prettier'
  ],
  // add your custom rules here
  rules: {
    'vue/no-v-html': 'off',
    'nuxt/no-cjs-in-config': 'off',
    'no-console': 'off',
    'camelcase': 'off',
    'no-sequences': 'off'
  }
}
