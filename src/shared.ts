const eslintConfig = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  overrides: []
}
const eslintOverrides = {
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

export const getEslintConfig = (variant) => {
  return { ...eslintConfig, overrides: eslintOverrides[variant] }
}

const stylelintPackages = [
  'stylelint',
  'stylelint-config-prettier',
  'stylelint-config-rational-order',
  'stylelint-config-standard',
  'stylelint-order'
]
export const getStylelintPackages = (variant: string): string[] => {
  if (variant.includes('vue')) {
    return [...stylelintPackages, 'postcss-html', 'stylelint-config-recommended-vue']
  }
  return stylelintPackages
}

const stylelintConfig = {
  root: true,
  plugins: ['stylelint-order'],
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin']
      }
    ],
    'no-empty-source': null,
    'named-grid-areas-no-invalid': null,
    'unicode-bom': 'never',
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested']
      }
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        'declarations',
        {
          type: 'at-rule',
          name: 'supports'
        },
        {
          type: 'at-rule',
          name: 'media'
        },
        'rules'
      ],
      { severity: 'warning' }
    ],
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'float',
      'width',
      'height',
      'max-width',
      'max-height',
      'min-width',
      'min-height',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'margin-collapse',
      'margin-top-collapse',
      'margin-right-collapse',
      'margin-bottom-collapse',
      'margin-left-collapse',
      'overflow',
      'overflow-x',
      'overflow-y',
      'clip',
      'clear',
      'font',
      'font-family',
      'font-size',
      'font-smoothing',
      'osx-font-smoothing',
      'font-style',
      'font-weight',
      'hyphens',
      'src',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'color',
      'text-align',
      'text-decoration',
      'text-indent',
      'text-overflow',
      'text-rendering',
      'text-size-adjust',
      'text-shadow',
      'text-transform',
      'word-break',
      'word-wrap',
      'white-space',
      'vertical-align',
      'list-style',
      'list-style-type',
      'list-style-position',
      'list-style-image',
      'pointer-events',
      'cursor',
      'background',
      'background-attachment',
      'background-color',
      'background-image',
      'background-position',
      'background-repeat',
      'background-size',
      'border',
      'border-collapse',
      'border-top',
      'border-right',
      'border-bottom',
      'border-left',
      'border-color',
      'border-image',
      'border-top-color',
      'border-right-color',
      'border-bottom-color',
      'border-left-color',
      'border-spacing',
      'border-style',
      'border-top-style',
      'border-right-style',
      'border-bottom-style',
      'border-left-style',
      'border-width',
      'border-top-width',
      'border-right-width',
      'border-bottom-width',
      'border-left-width',
      'border-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
      'border-top-left-radius',
      'border-radius-topright',
      'border-radius-bottomright',
      'border-radius-bottomleft',
      'border-radius-topleft',
      'content',
      'quotes',
      'outline',
      'outline-offset',
      'opacity',
      'filter',
      'visibility',
      'size',
      'zoom',
      'transform',
      'box-align',
      'box-flex',
      'box-orient',
      'box-pack',
      'box-shadow',
      'box-sizing',
      'table-layout',
      'animation',
      'animation-delay',
      'animation-duration',
      'animation-iteration-count',
      'animation-name',
      'animation-play-state',
      'animation-timing-function',
      'animation-fill-mode',
      'transition',
      'transition-delay',
      'transition-duration',
      'transition-property',
      'transition-timing-function',
      'background-clip',
      'backface-visibility',
      'resize',
      'appearance',
      'user-select',
      'interpolation-mode',
      'direction',
      'marks',
      'page',
      'set-link-source',
      'unicode-bidi',
      'speak'
    ]
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
export const getStylelintConfig = (variant: string) => {
  if (variant.includes('vue')) {
    return {
      ...stylelintConfig,
      extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue']
    }
  }
  return stylelintConfig
}
