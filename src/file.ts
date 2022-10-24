import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSpinner } from 'nanospinner'
import { exec } from 'child_process'
import { red, green, cyan } from 'kolorist'
import {
  eslintConfig,
  eslintOverrides,
  commonPackages,
  eslintPackages,
  commitlintPackages,
  stylelintPackages
} from './constants/config'
import { root, copy, generatePackageJson, getPackageManager } from './utils'

export const writeTemplateFile = (otherLint: any[], isVscode) => {
  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../template')
  const files: string[] = fs.readdirSync(templateDir)
  let filterResult: string[] = files
  if (otherLint.indexOf('stylelint') === -1) {
    filterResult = filterResult.filter(
      (file) => file !== '.stylelintignore' && file !== '.stylelintrc.json'
    )
  }

  if (otherLint.indexOf('commitlint') === -1) {
    filterResult = filterResult.filter(
      (file) => file !== '.cz-config.cjs' && file !== '.commitlintrc.json'
    )
  }
  if (!isVscode) {
    filterResult = filterResult.filter((file) => file !== '.vscode')
  }
  for (const file of filterResult) {
    const targetPath = path.join(root, file)
    copy(path.join(templateDir, file), targetPath)
  }
}
const writeEslintFile = (eslint) => {
  const eslintFile = path.join(root, '.eslintrc.json')
  fs.writeFileSync(eslintFile, JSON.stringify(eslint, null, 2))
}
const execHuskyCommand = (otherLint) => {
  const packageManager = getPackageManager()
  const initHusky = 'npx husky install'
  const preCommit = `npx husky add .husky/pre-commit "npm run lint:lint-staged"`

  exec(initHusky, { cwd: root }, (error) => {
    if (error) {
      console.error(error)
      return
    }
    exec(preCommit, { cwd: root }, (error) => {
      if (error) {
        console.error(error)
        return
      }
    })
    if (otherLint.includes('commitlint')) {
      const commitMsg = `npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`
      exec(commitMsg, { cwd: root }, (error) => {
        if (error) {
          console.error(error)
          return
        }
      })
    }
  })
}

const getPackageList = ({ otherLint, variant }) => {
  let result: string[] = []
  if (otherLint.includes('stylelint')) {
    result = [...result, ...stylelintPackages]
  }
  if (otherLint.includes('commitlint')) {
    result = [...result, ...commitlintPackages]
  }
  return [...commonPackages, ...eslintPackages[variant], ...result]
}
export const settingLint = ({ otherLint, variant, isVscode }) => {
  const packageManager = getPackageManager()
  const eslint = { ...eslintConfig, overrides: eslintOverrides[variant] }
  const packageList = getPackageList({ otherLint, variant })
  console.log('packageList: ', packageList)

  generatePackageJson({ otherLint, variant })
  const commandMap = {
    npm: `npm install --save-dev ${packageList.join(' ')}`,
    yarn: `yarn add --dev ${packageList.join(' ')}`,
    pnpm: `pnpm install --save-dev ${packageList.join(' ')}`
  }

  const installCommand = commandMap[packageManager]
  const spinner = createSpinner('Installing packages...').start()
  exec(installCommand, { cwd: root }, (error) => {
    if (error) {
      spinner.error({
        text: red('Failed to install packages!'),
        mark: '✖'
      })
      console.error(error)
      return
    }

    execHuskyCommand(otherLint)
    writeTemplateFile(otherLint, isVscode)
    writeEslintFile(eslint)

    spinner.success({ text: green('All done! 🎉'), mark: '✔' })
    console.log(cyan('\n🔥 Reload your editor to activate the settings!'))
  })
}
