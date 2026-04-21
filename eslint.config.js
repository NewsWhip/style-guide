// @ts-check
import { defineConfig } from 'eslint/config';
import angular from 'angular-eslint';
import nwStyleGuideTsFiles from './projects/nw-style-guide/src/linting-config/ts-files.js';
import nwStyleGuideHtmlFiles from './projects/nw-style-guide/src/linting-config/html-files.js';

export default defineConfig([
    // Library files
    {
        files: ['./projects/nw-style-guide/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './projects/nw-style-guide/tsconfig.eslint.json'
            }
        },
        extends: [angular.configs.tsRecommended, nwStyleGuideTsFiles],
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'nw',
                    style: 'camelCase'
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: ['element', 'attribute'],
                    prefix: 'nw',
                    style: 'kebab-case'
                }
            ],
            '@angular-eslint/prefer-inject': 'warn',
            '@angular-eslint/prefer-standalone': 'warn'
        }
    },
    // Demo app files
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: './src/tsconfig.eslint.json'
            }
        },
        extends: [angular.configs.tsRecommended, nwStyleGuideTsFiles],
        rules: {
            '@angular-eslint/prefer-inject': 'warn',
            '@angular-eslint/prefer-standalone': 'warn'
        }
    },
    {
        files: ['**/*.html'],
        extends: [nwStyleGuideHtmlFiles]
    }
]);
