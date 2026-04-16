// @ts-check
import { defineConfig } from 'eslint/config';
import angular from 'angular-eslint';

export default defineConfig({
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    processor: angular.processInlineTemplates,
    rules: {
        '@angular-eslint/template/prefer-control-flow': 'warn',
        '@angular-eslint/template/click-events-have-key-events': 'warn',
        '@angular-eslint/template/alt-text': 'warn',
        '@angular-eslint/template/interactive-supports-focus': 'warn',
        '@angular-eslint/template/label-has-associated-control': 'warn',
        '@angular-eslint/template/elements-content': 'warn',
        '@angular-eslint/template/eqeqeq': [
            'error',
            {
                allowNullOrUndefined: true
            }
        ]
    }
});
