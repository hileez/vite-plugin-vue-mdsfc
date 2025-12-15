import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import prettierConfigsRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
    {
        files: ['src/**/*.{js,mjs,cjs}', 'src/**/*.{ts,mts,cts}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            semi: 'error',
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
            'no-console': 'warn',
            'no-empty': ['error', { allowEmptyCatch: true }],
        },
    },
    tseslint.configs.recommended,
    prettierConfigsRecommended,
])
