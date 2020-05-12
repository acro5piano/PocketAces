export default {
  extensions: ['ts'],
  verbose: true,
  require: ['ts-node/register/transpile-only', './src/bootstrap.ts'],
  files: ['tests/**/*.test.ts'],
}
