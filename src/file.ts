import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSpinner } from 'nanospinner'
import { exec } from 'child_process'
import { red, green, cyan } from 'kolorist'
import { eslintConfig, eslintOverrides, commonPackages, eslintPackages } from './constants/config'
import { root, copy, formatPackageJson, getPackageManager } from './utils'

export const writeTemplateFile = (otherLint: any[]) => {
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
  // for (const file of files) {
  //   const targetPath = path.join(root, file)
  //   copy(path.join(templateDir, file), targetPath)
  // }
}
const writeEslintFile = (eslint) => {
  const eslintFile = path.join(root, '.eslintrc.json')
  fs.writeFileSync(eslintFile, JSON.stringify(eslint, null, 2))
}

export const settingLint = ({ otherLint, variant }) => {
  const packageManager = getPackageManager()
  const eslint = { ...eslintConfig, overrides: eslintOverrides[variant] }
  const packageList = [...commonPackages, ...eslintPackages[variant]]
  console.log('packageList: ', packageList)

  formatPackageJson(otherLint)
  const commandMap = {
    npm: `npm install --save-dev ${packageList.join(' ')}`,
    yarn: `yarn add --dev ${packageList.join(' ')}`,
    pnpm: `pnpm install --save-dev ${packageList.join(' ')}`
  }
  const installCommand = commandMap[packageManager]
  const spinner = createSpinner('Installing packages...').start()
  exec(`${installCommand}`, { cwd: root }, (error) => {
    if (error) {
      spinner.error({
        text: red('Failed to install packages!'),
        mark: '✖'
      })
      console.error(error)
      return
    }

    writeTemplateFile(otherLint)
    writeEslintFile(eslint)

    spinner.success({ text: green('All done! 🎉'), mark: '✔' })
    console.log(cyan('\n🔥 Reload your editor to activate the settings!'))
  })
}
