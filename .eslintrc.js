module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    "no-restricted-syntax": [
      'error',
      {
        selector: "CallExpression[callee.object.name='document'][callee.property.name='querySelector']",
        message: "Квериселекторы запрещены"
      }
    ]
  },
};
