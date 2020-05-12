import typescript from 'rollup-plugin-typescript2'

// prettier-ignore
export default {
  input: './src/index.ts',
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "ESNext",
        },
      },
    })
  ],
  external: id => !id.startsWith('.') && !id.startsWith('/') && id !== 'tslib' && id !== 'refrect-metadata',
  output: [
    {
      file: 'build/index.js',
      format: 'cjs',
      name: 'pocket-ace',
      sourcemap: true,
    },
    {
      file: 'build/index.es.js',
      format: 'es',
      sourcemap: true,
    },
  ],
}