import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        files: ["src/**/*.ts"],
        ignores: ["src/test/**"],
    },
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
            prettier: (await import("eslint-plugin-prettier")).default,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
        },
        rules: {
            // Naming convention for imports
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "import",
                    format: ["camelCase", "PascalCase"],
                },
            ],
            // General code style
            curly: "warn",
            eqeqeq: "warn",
            "no-throw-literal": "warn",
            semi: "warn",
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
];