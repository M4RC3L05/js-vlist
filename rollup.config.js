import babel from 'rollup-plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default [
    {
        input: './src/index.js',
        output: {
            file: 'dist/vlist.js',
            format: 'cjs',
            indent: false
        },
        plugins: [babel()]
    },

    {
        input: './src/index.js',
        output: {
            file: './dist/umd/vlist.dev.js',
            format: 'umd',
            name: 'VirtualList',
            indent: true,
            sourcemap: 'inline'
        },
        plugins: [
            babel({
                exclude: 'node_modules/**'
            })
        ]
    },
    {
        input: './src/index.js',
        output: {
            file: './dist/umd/vlist.prod.js',
            format: 'umd',
            name: 'VirtualList',
            indent: false
        },
        plugins: [
            babel({
                exclude: 'node_modules/**'
            }),
            terser({
                compress: {
                    unsafe: true,
                    warnings: false
                }
            })
        ]
    }
]
