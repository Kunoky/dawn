module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
    "./.eslintrc-auto-import.json",
  ],
  "overrides": [
    {
      "files": ["src/test/*/*.js", "*.config.js"],
      "rules": {
        "no-undef": 0
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': [2, { allow: ['warn', 'error'] }],
    'prettier/prettier': 'error',
    "eqeqeq": ["error", "always"],
    "no-unused-expressions": ['error', { "allowShortCircuit": true, "allowTernary": true }],
    'vue/multi-word-component-names': 0,
  },
  globals: {
    __APP_NAME__: "readonly",
    __TOKEN_KEY__: "readonly",
    // ElMessage: "readonly",
    // ElMessageBox: "readonly",
    // ElLoading: "readonly",
  }
}
