// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig({
    extends: [
        eslint.configs.recommended,
        tseslint.configs.recommended,
        tseslint.configs.stylistic,
        angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
        "@angular-eslint/no-input-rename": "off",
        "@angular-eslint/no-output-native": "warn",
        "@typescript-eslint/dot-notation": [
            "error",
            {
                "allowPrivateClassPropertyAccess": true,
                "allowProtectedClassPropertyAccess": true
            }
        ],
        "@typescript-eslint/consistent-type-definitions": ["off"],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/consistent-generic-constructors": "warn",
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: "interface",
                format: [
                    "PascalCase"
                ],
                custom: {
                    regex: "^I[A-Z]",
                    match: true
                }
            },
            {
                selector: "variable",
                format: [
                    "camelCase",
                    "UPPER_CASE",
                    "PascalCase"
                ],
                leadingUnderscore: "allow",
                trailingUnderscore: "forbid"
            },
            {
                selector: "memberLike",
                modifiers: [
                    "private"
                ],
                format: [
                    "camelCase"
                ],
                leadingUnderscore: "require"
            }
        ],
        "no-restricted-imports": [
            "error",
            {
                paths: [
                    "lodash",
                    "ngx-bootstrap/popover",
                    "ngx-bootstrap/tooltip"
                ]
            }
        ],
        "@typescript-eslint/no-deprecated": "warn"
    }
});
