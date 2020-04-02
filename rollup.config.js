import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from "rollup-plugin-serve";
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    context: 'window',
    output: {
        file: 'dist/stimulus-reactive.es.js',
        format: 'es',
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        serve(),
    ]
}