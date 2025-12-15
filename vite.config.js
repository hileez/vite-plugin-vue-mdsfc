import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            formats: ['es', 'cjs'],
            name: 'MyLib',
            fileName: (format) => {
                return format === 'es' ? 'index.mjs' : 'index.cjs'
            },
        },
        rollupOptions: {
            external: ['markdown-it', 'crypto', 'highlight.js'],
            output: {
                exports: 'named',
                globals: {},
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})
