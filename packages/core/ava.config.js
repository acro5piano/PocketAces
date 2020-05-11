export default {
  extensions: ['ts'],
  verbose: true,
  require: ['ts-node/register/transpile-only', './src/bootstrap.ts', './tests/beforeEach.ts'],
  files: ['tests/**/*.test.ts'],
}
