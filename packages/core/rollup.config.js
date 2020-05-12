import typescript from 'rollup-plugin-typescript2'

// prettier-ignore
export default {
  input: './src/index.ts',
  plugins: [
    typescript()
  ],
  external: id => !id.startsWith('.') && !id.startsWith('/') && id !== 'tslib' && id !== 'refrect-metadata',
  output: [
    {
      dir: 'build',
      format: 'cjs',
      name: 'pocket-ace',
      sourcemap: true,
    },
  ],
}
