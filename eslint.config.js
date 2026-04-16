// @ts-check
const { defineConfig } = require('eslint/config');
const angular = require('angular-eslint');
const nwStyleGuideTsFiles = require('./projects/nw-style-guide/src/linting-config/ts-files');
const nwStyleGuideHtmlFiles = require('./projects/nw-style-guide/src/linting-config/html-files');

module.exports = defineConfig([
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
