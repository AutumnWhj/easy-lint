import { blue, green, cyan, yellow } from 'kolorist'
type ColorFunc = (str: string | number) => string
export interface Framework {
  name: string
  display: string
  color: ColorFunc
  variants: FrameworkVariant[]
}
export interface FrameworkVariant {
  name: string
  display: string
  color: ColorFunc
  customCommand?: string
  packageList?: string[]
}

export const commonPackages = [
  'eslint',
  'prettier',
  'eslint-plugin-prettier',
  'eslint-config-prettier'
]

export const FRAMEWORKS: Framework[] = [
  {
    name: 'vanilla',
    display: 'Vanilla',
    color: yellow,
    variants: [
      {
        name: 'vanilla',
        display: 'JavaScript',
        color: yellow,
        packageList: []
      },
      {
        name: 'vanilla-ts',
        display: 'TypeScript',
        color: blue,
        packageList: ['@typescript-eslint/eslint-plugin', '@typescript-eslint/parser']
      }
    ]
  },
  {
    name: 'vue',
    display: 'Vue',
    color: green,
    variants: [
      {
        name: 'vue',
        display: 'JavaScript',
        color: yellow,
        packageList: ['vue-eslint-parser', 'eslint-plugin-vue']
      },
      {
        name: 'vue-ts',
        display: 'TypeScript',
        color: blue,
        packageList: [
          '@typescript-eslint/eslint-plugin',
          '@typescript-eslint/parser',
          'vue-eslint-parser',
          'eslint-plugin-vue'
        ]
      }
    ]
  },
  {
    name: 'react',
    display: 'React',
    color: cyan,
    variants: [
      {
        name: 'react',
        display: 'JavaScript',
        color: yellow,
        packageList: ['eslint-plugin-react']
      },
      {
        name: 'react-ts',
        display: 'TypeScript',
        color: blue,
        packageList: [
          '@typescript-eslint/eslint-plugin',
          '@typescript-eslint/parser',
          'eslint-plugin-react'
        ]
      }
    ]
  }
]
export const TEMPLATES = FRAMEWORKS.map(
  (f) => (f.variants && f.variants.map((v) => v.name)) || [f.name]
).reduce((a, b) => a.concat(b), [])
