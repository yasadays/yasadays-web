// @ts-check

import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{js,ts}"],
  extends: [
    eslintPluginAstro.configs.recommended,
    js.configs.recommended,
    tseslint.configs.recommended,
  ],
});
