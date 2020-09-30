module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'ref', 'perf', 'docs', 'test', 'ci'],
    ],
  },
}
