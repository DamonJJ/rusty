import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow console statements in development
      "no-console": "off",
      // Allow img elements for user-uploaded content
      "@next/next/no-img-element": "off",
      // Allow any type when explicitly needed with comment
      "@typescript-eslint/no-explicit-any": "error",
      // Allow require imports when needed with comment
      "@typescript-eslint/no-require-imports": "error",
      // Allow unused vars that start with underscore
      "@typescript-eslint/no-unused-vars": [
        "error",
        { 
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ]
    }
  }
];

export default eslintConfig;
