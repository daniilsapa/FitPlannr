module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'indent': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'prettier/prettier': ['error', {
      'endOfLine': 'auto',
      'printWidth': 80,
      'trailingComma': 'es5',
      'singleQuote': true,
      'useTabs': true,
      'tabWidth': 2,
    }],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    'no-underscore-dangle':  ['error', { 'allow': ['_id'] }]
  }
};