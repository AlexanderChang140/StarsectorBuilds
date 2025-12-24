import baseConfig from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';

export default defineConfig({
    ...baseConfig.configs.recommended,
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
        parser: tsParser,
        parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: './tsconfig.json',
        },
    },
    plugins: {
        '@typescript-eslint': tsPlugin,
        import: importPlugin,
    },
    rules: {
        ...tsPlugin.configs.recommended.rules,
        '@typescript-eslint/no-unused-vars': 'warn',
        'import/order': [
            'warn',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    ['parent', 'sibling', 'index'],
                ],
                pathGroups: [
                    {
                        pattern: '@/**',
                        group: 'internal',
                        position: 'before',
                    },
                ],
                pathGroupsExcludedImportTypes: ['builtin'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/newline-after-import': 'warn',
        'import/no-duplicates': 'error',
    },
    settings: {
        'import/resolver': {
            typescript: {},
            node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        },
    },
});
