export default {
  extensions: ['ts'],
  verbose: true,
  require: [
    'ts-node/register/transpile-only',
    'tsconfig-paths/register',
    './src/bootstrap.ts',
  ],
  files: ['tests/**/*.test.ts'],
  environmentVariables: {
    POCKET_ACE_JWT_SECRET: 'secret',
  },
}
