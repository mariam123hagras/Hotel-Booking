import js from "@eslint/js";
import globals from "globals";
import security from "eslint-plugin-security";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    plugins: { security },
    rules: {
      ...js.configs.recommended.rules,
      ...security.configs.recommended.rules,
    },
    languageOptions: {
      globals: globals.node,
    },
  },
]);
