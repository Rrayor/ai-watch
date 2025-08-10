import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    // Main production code configuration
    {
        files: ["src/**/*.ts"],
        ignores: ["src/**/*.test.ts", "src/test/**/*.ts", "out/**", "dist/**", "node_modules/**"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier: (await import("eslint-plugin-prettier")).default,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            // === Core TypeScript rules to address DeepSource issues ===

            // JS-0323: Detected usage of the any type - CRITICAL
            "@typescript-eslint/no-explicit-any": "error",

            // JS-0331: Found explicit type declarations - MAJOR
            "@typescript-eslint/no-inferrable-types": "error",

            // JS-0339: Found non-null assertions - MAJOR
            "@typescript-eslint/no-non-null-assertion": "error",

            // JS-0242: Use const declarations for variables that are never reassigned - MINOR
            "prefer-const": "error",

            // JS-0246: Require template literals instead of string concatenation - MINOR
            "prefer-template": "error",

            // JS-0105: Class methods should utilize this - MINOR
            "class-methods-use-this": "error",

            // JS-0047: No default cases in switch statements - MINOR
            "default-case": "error",
            "default-case-last": "error",

            // JS-0054: Avoid using lexical declarations in case clauses - MINOR
            "no-case-declarations": "error",

            // JS-R1002: Found unused objects - MINOR
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "vars": "all",
                    "args": "after-used",
                    "ignoreRestSiblings": false,
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_"
                }
            ],
            "no-unused-vars": "off", // Turn off base rule

            // JS-C1003: Avoid using wildcard imports - MINOR
            // Use custom rule to specifically target wildcard import syntax: import * as name from 'module'
            "no-restricted-syntax": [
                "error",
                {
                    "selector": "ImportNamespaceSpecifier",
                    "message": "Wildcard imports (import * as name from 'module') are not allowed. Use named imports instead."
                }
            ],

            // JS-R1005: Function with cyclomatic complexity higher than threshold - MINOR
            "complexity": ["error", { "max": 10 }],

            // === Additional TypeScript quality rules ===
            "@typescript-eslint/explicit-function-return-type": [
                "error",
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true
                }
            ],
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@typescript-eslint/no-empty-function": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/prefer-optional-chain": "error",

            // === General JavaScript rules ===
            "curly": ["error", "all"],
            "eqeqeq": ["error", "always"],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-eval": "error",
            "no-implied-eval": "error",
            "no-magic-numbers": [
                "warn",
                {
                    ignore: [-1, 0, 1, 2, 24, 60, 1000],
                    ignoreArrayIndexes: true,
                    enforceConst: true,
                    detectObjects: false
                }
            ],
            "no-param-reassign": "error",
            "no-throw-literal": "error",
            "no-var": "error",
            "object-shorthand": "error",
            "prefer-arrow-callback": "error",
            "prefer-destructuring": [
                "error",
                {
                    array: true,
                    object: true
                }
            ],
            "semi": ["error", "always"],

            // Prettier integration
            ...((await import("eslint-config-prettier")).default?.rules || {}),
            "prettier/prettier": [
                "error",
                {
                    singleQuote: true,
                    trailingComma: "all",
                    printWidth: 100,
                    tabWidth: 2,
                    semi: true,
                },
            ],
        },
    },
    // Test files configuration with relaxed rules
    {
        files: ["src/**/*.test.ts", "src/test/**/*.ts"],
        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier: (await import("eslint-plugin-prettier")).default,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
                project: "./tsconfig.test.json",
                tsconfigRootDir: process.cwd(),
            },
        },
        rules: {
            // Relaxed rules for test files
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-non-null-assertion": "warn",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "no-magic-numbers": "off",
            "complexity": "off",
            // Allow wildcard imports in tests for convenience
            "no-restricted-syntax": "off",
            // Prettier integration for test files
            "prettier/prettier": [
                "error",
                {
                    singleQuote: true,
                    trailingComma: "all",
                    printWidth: 100,
                    tabWidth: 2,
                    semi: true,
                },
            ],
        },
    },
];
