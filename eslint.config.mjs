import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from '@tanstack/eslint-plugin-query';
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...pluginQuery.configs['flat/recommended'],
  {
    plugins: {
      "@typescript-eslint": typescriptEslint, // 用于 TypeScript 的 ESLint 插件
      "simple-import-sort": simpleImportSort, // 用于导入排序
      "unused-imports": unusedImports, // 用于未使用的导入
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",  // 使用最新的 ECMAScript 特性
      sourceType: "module",   // 使用 ES 模块
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      // 强制使用 type import
      "@typescript-eslint/consistent-type-imports": ["warn", {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      }],

      // 忽略以_开头的未使用变量
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
      }],

      // 导入排序
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "warn",

      // 未使用的导入
      "unused-imports/no-unused-imports": "error",
    },
  },
  ...compat.extends("plugin:@typescript-eslint/recommended-requiring-type-checking").map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })), {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    rules: {
      // 关闭 Promise 相关的误用检查
      "@typescript-eslint/no-misused-promises": "off",

      // 关闭不安全调用检查
      "@typescript-eslint/no-unsafe-call": "off",

      // 关闭不安全成员访问检查
      "@typescript-eslint/no-unsafe-member-access": "off",

      // 关闭不安全赋值检查
      "@typescript-eslint/no-unsafe-assignment": "off",

      // 保持不安全返回值检查为错误级别
      "@typescript-eslint/no-unsafe-return": "error",

      // 关闭不安全参数检查
      "@typescript-eslint/no-unsafe-argument": "off"
    },
  }
];
