export default {
  extensions: ['ts'],
  verbose: true,
  require: ['ts-node/register/transpile-only', './tests/beforeEach.ts'],
  files: ['tests/**/*.test.ts'],
}
