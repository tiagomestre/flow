module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/recommended',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parserOptions: {
        ecmaVersion: 2020,
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        'vue/html-indent': ['error', 4],
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
};
