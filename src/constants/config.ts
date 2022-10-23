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

export const stylelintPackages = [
  'stylelint',
  'stylelint-config-prettier',
  'stylelint-config-rational-order',
  'stylelint-config-standard',
  'stylelint-order'
]

export const eslintConfig = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  overrides: []
}
export const eslintOverrides = {
  vanilla: [
    {
      files: ['*.js'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended']
    }
  ],
  'vanilla-ts': [
    {
      files: ['*.js'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended']
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
      ]
    }
  ],
  vue: [
    {
      files: ['*.js'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended']
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ],
  'vue-ts': [
    {
      files: ['*.js'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended']
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
      ]
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:prettier/recommended'
      ],
      rules: {
        'vue/multi-word-component-names': 'off'
      }
    }
  ],
  react: [
    {
      files: ['*.js', '*.jsx'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'],
      rules: {
        'react/react-in-jsx-scope': 'off'
      }
    }
  ],
  'react-ts': [
    {
      files: ['*.js'],
      extends: ['eslint:recommended', 'plugin:prettier/recommended']
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended'
      ],
      rules: {
        'react/react-in-jsx-scope': 'off'
      }
    }
  ]
}

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
