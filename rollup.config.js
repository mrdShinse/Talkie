import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';

export default {
  entry: 'src/index.ts',
  format: 'umd',
  moduleName: 'Talkie',
  plugins: [
    builtins(),
    json(),
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    typescript({
      typescript: require('typescript')
    })
  ],
  sourceMap: true,
  dest: 'dist/talkie.min.js'
};
