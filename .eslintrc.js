module.exports = {
  extends: ['react-app', 'eslint:recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-duplicate-imports': 'error',
    'no-console': 'warn',
    'no-useless-computed-key': 'off',
  },
}
