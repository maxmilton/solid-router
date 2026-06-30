import js from "@eslint/js";
import mm from "@maxmilton/eslint-config";
import vitest from "@vitest/eslint-plugin";
import { defineConfig } from "eslint/config";
import unicorn from "eslint-plugin-unicorn";
import ts from "typescript-eslint";

export default defineConfig(
  js.configs.recommended,
  ts.configs.strictTypeChecked,
  ts.configs.stylisticTypeChecked,
  unicorn.configs.recommended,
  mm.configs.recommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "error",
      reportUnusedInlineConfigs: "error",
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-plusplus": "off", // byte savings
      "unicorn/consistent-boolean-name": "off",
      "unicorn/prefer-await": "off",
      "unicorn/prefer-global-this": "off",
      "unicorn/prefer-node-protocol": "off", // we support node v12+
      "unicorn/prefer-string-raw": "off", // byte savings
    },
  },
  {
    files: ["test/e2e/**"],
    rules: {
      "@typescript-eslint/no-deprecated": "warn",
    },
  },
  {
    files: ["test/unit/**/*.test.tsx", "test/unit/**/*.test.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      "@typescript-eslint/no-deprecated": "warn",
      "vitest/max-expects": "off",
      "vitest/no-hooks": "off",
      "vitest/padding-around-all": "off",
      "vitest/padding-around-expect-groups": "off",
      "vitest/padding-around-test-blocks": "off",
      "vitest/require-top-level-describe": "off",
    },
  },
  { ignores: ["**/*.bak", "**/dist/**", "coverage/**"] },
);
