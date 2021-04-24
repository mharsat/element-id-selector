#!/usr/bin/env node
const { build } = require('estrella');

build({
  entry: ['src/selector.tsx'],
  outdir: './dist',
  tslint: false,
  bundle: true,
  sourcemap: true,
  minify: false,
  define: {
    'process.env.NODE_ENV': '"development"'
  }
});
