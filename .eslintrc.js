module.exports = {
  extends: ['react-app', 'eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-duplicate-imports': 'error',
    'no-console': 'warn',
    'no-useless-computed-key': 'off',
    'no-unused-vars': 'warn',
  },
}
