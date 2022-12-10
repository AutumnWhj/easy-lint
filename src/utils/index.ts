import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import { reset, red, underline } from 'kolorist'
import { FRAMEWORKS } from '../constants'
import type { Framework } from '../constants'

export const root = process.cwd()
function pkgFromUserAgent(userAgent: string | undefined) {
  if (!userAgent) return undefined
  const pkgSpec = userAgent.split(' ')[0]
  const pkgSpecArr = pkgSpec.split('/')
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  }
}
export const getPackageManager = () => {
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
  return pkgInfo ? pkgInfo.name : 'pnpm'
}

export function copy(src: string, dest: string) {
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    copyDir(src, dest)
  } else {
    fs.copyFileSync(src, dest)
  }
}
function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true })
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file)
    const destFile = path.resolve(destDir, file)
    copy(srcFile, destFile)
  }
}

export const askForProjectLint = async () => {
  let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'>
  try {
    result = await prompts(
      [
        {
          type: 'select',
          name: 'framework',
          message: reset('Select a framework:'),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework
            }
          })
        },
        {
          type: (framework: Framework) => (framework && framework.variants ? 'select' : null),
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name
              }
            })
        },
        {
          type: 'multiselect',
          name: 'otherLint',
          message: underline('Pick other lint'),
          choices: [
            { title: 'commitlint', value: 'commitlint' },
            { title: 'stylelint', value: 'stylelint' }
          ],
          hint: '- Space to select. Return to submit'
        },
        {
          type: 'confirm',
          name: 'isVscode',
          message: underline('loading default vscode setting?'),
          initial: true
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
    return result
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
}

const write = (file: string, content?: string) => {
  const targetPath = path.join(root, file)
  if (content) {
    fs.writeFileSync(targetPath, content)
  } else {
    copy(path.join(root, file), targetPath)
  }
}
// TODO: add husky config and lint-stage config
export const generatePackageJson = ({ otherLint, variant }) => {
  const huskyConfig = {
    hooks: {
      'pre-commit': 'lint-staged'
    }
  }
  const lintStagedConfig = {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
    '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
    'package.json': ['prettier --write'],
    '*.md': ['prettier --write']
  }
  let scripts = {
    'lint:eslint': 'eslint --cache --max-warnings 0  "{src,mock}/**/*.{vue,ts,tsx}" --fix',
    'lint:prettier': 'prettier --write  "src/**/*.{js,json,tsx,css,less,scss,vue,html,md}"',
    'lint:lint-staged': 'lint-staged',
    prepare: 'husky install'
  }

  if (otherLint.includes('stylelint')) {
    lintStagedConfig['*.{scss,less,styl}'] = ['stylelint --fix', 'prettier --write']
    scripts['lint:stylelint'] =
      'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" --cache --cache-location node_modules/.cache/stylelint/'
  }
  if (variant.includes('vue')) {
    if (otherLint.includes('stylelint')) {
      lintStagedConfig['*.vue'] = ['eslint --fix', 'prettier --write', 'stylelint --fix']
    } else {
      lintStagedConfig['*.vue'] = ['eslint --fix', 'prettier --write']
    }
  }

  const pkg = JSON.parse(fs.readFileSync(path.join(root, `package.json`), 'utf-8'))
  pkg.scripts = {
    ...pkg.scripts,
    ...scripts
  }
  pkg['lint-staged'] = {
    ...pkg['lint-staged'],
    ...lintStagedConfig
  }
  pkg['husky'] = {
    ...pkg['husky'],
    ...huskyConfig
  }
  write('package.json', JSON.stringify(pkg, null, 2))
}

export const writeJsonFile = (fileName, json) => {
  const filePath = path.join(root, fileName)
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2))
}

export const checkPackageFile = () => {
  if (!fs.existsSync(path.join(root, 'package.json'))) {
    console.log(red('✖') + 'no such file or directory: package.json')
    return false
  }
  return true
}
