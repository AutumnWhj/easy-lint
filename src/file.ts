import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSpinner } from 'nanospinner'
import { exec } from 'child_process'
import { red, green, cyan } from 'kolorist'
import { commonPackages, eslintPackages, commitlintPackages } from './constants/config'
import { getEslintConfig, getStylelintConfig, getStylelintPackages } from './shared'

import { root, copy, generatePackageJson, getPackageManager, writeJsonFile } from './utils'

const writeTemplateFile = (otherLint: any[], isVscode) => {
  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../template')
  const files: string[] = fs.readdirSync(templateDir)
  let filterResult: string[] = files
  if (otherLint.indexOf('stylelint') === -1) {
    filterResult = filterResult.filter((file) => file !== '.stylelintignore')
  }

  if (otherLint.indexOf('commitlint') === -1) {
    filterResult = filterResult.filter(
      (file) => file !== '.cz-config.cjs' && file !== '.commitlintrc.json'
    )
  }
  if (!isVscode) {
    filterResult = filterResult.filter((file) => file !== '.vscode' && file !== 'settings.json')
  }
  for (const file of filterResult) {
    const targetPath = path.join(root, file)
    copy(path.join(templateDir, file), targetPath)
  }
}

const execHuskyCommand = (otherLint) => {
  const initGit = 'git init'
  const initHusky = 'npx husky install'
  const preCommit = `npx husky add .husky/pre-commit "npm run lint:lint-staged"`

  if (!fs.existsSync(path.join(root, '.git'))) {
    exec(initGit, { cwd: root }, (error) => {
      if (error) {
        console.error(error)
        return
      }
    })
  }

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
    result = [...result, ...getStylelintPackages(variant)]
  }
  if (otherLint.includes('commitlint')) {
    result = [...result, ...commitlintPackages]
  }
  return [...commonPackages, ...eslintPackages[variant], ...result]
}

export const setLint = ({ otherLint, variant, isVscode }) => {
  const packageManager = getPackageManager()

  const packageList = getPackageList({ otherLint, variant })

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

    writeJsonFile('.eslintrc.json', getEslintConfig(variant))
    writeJsonFile('.stylelintrc.json', getStylelintConfig(variant))

    spinner.success({ text: green('All done! 🎉'), mark: '✔' })
    console.log(cyan('\n🔥 Reload your editor to activate the settings!'))
  })
}
