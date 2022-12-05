export const commonPackages = [
  'husky',
  'lint-staged',
  'eslint',
  'prettier',
  'eslint-plugin-prettier',
  'eslint-config-prettier'
]
export const commitlintPackages = [
  '@commitlint/cli',
  '@commitlint/config-conventional',
  'commitizen',
  'commitlint-config-cz'
]

export const eslintPackages = {
  vanilla: [],
  'vanilla-ts': ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser'],
  vue: ['vue-eslint-parser', 'eslint-plugin-vue'],
  'vue-ts': [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'vue-eslint-parser',
    'eslint-plugin-vue'
  ],
  react: ['eslint-plugin-react'],
  'react-ts': [
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-plugin-react'
  ]
}
