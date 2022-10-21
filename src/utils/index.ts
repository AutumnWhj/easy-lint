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
  return pkgInfo ? pkgInfo.name : 'npm'
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
        }
        // {
        //   type: 'confirm',
        //   name: 'withTool',
        //   message: underline('Install husky and lint-stage tool?'),
        //   initial: true
        // }
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
export const formatPackageJson = (otherLint: any) => {
  let script = {
    'lint:eslint': 'eslint --cache --max-warnings 0  "{src,mock}/**/*.{vue,ts,tsx}" --fix',
    'lint:prettier': 'prettier --write  "src/**/*.{js,json,tsx,css,less,scss,vue,html,md}"',
    'lint:lint-staged': 'lint-staged -c ./.lintstagedrc.json'
  }
  if (otherLint.includes('stylelint')) {
    script['lint:stylelint'] =
      'stylelint --cache --fix "**/*.{vue,less,postcss,css,scss}" --cache --cache-location node_modules/.cache/stylelint/'
  }
  const pkg = JSON.parse(fs.readFileSync(path.join(root, `package.json`), 'utf-8'))
  pkg.script = {
    ...pkg.script,
    ...script
  }
  write('package.json', JSON.stringify(pkg, null, 2))
}
