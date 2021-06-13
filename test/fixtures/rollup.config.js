/* eslint-disable import/no-extraneous-dependencies */

import babel from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';

const fixtures = ['full', 'lazyload', 'minimal', 'simple'];
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const htmlTemplate = `<!doctype html>
<meta charset=utf-8>
<script src=index.js type=module defer></script>`;

export default fixtures.map((name) => ({
  input: path.join(__dirname, name, 'index.tsx'),
  output: {
    assetFileNames: '[name][extname]',
    entryFileNames: '[name].js',
    chunkFileNames: '[name].js',
    dir: path.join(__dirname, 'dist', name),
    format: 'esm',
    sourcemap: true,
  },
  preserveEntrySignatures: false,
  plugins: [
    nodeResolve({
      extensions,
    }),
    babel({
      include: [/\.tsx?$/],
      extensions,
      babelrc: false,
      babelHelpers: 'bundled',
      presets: ['@babel/preset-typescript', 'babel-preset-solid'],
      skipPreflightCheck: true,
    }),
    {
      name: 'custom',
      generateBundle() {
        this.emitFile({
          fileName: 'index.html',
          source: htmlTemplate,
          type: 'asset',
        });
        this.emitFile({
          fileName: 'favicon.ico',
          source: '', // empty
          type: 'asset',
        });
      },
    },
  ],
}));
