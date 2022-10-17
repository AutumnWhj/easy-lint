import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSpinner } from 'nanospinner'
import { exec } from 'child_process'
import { red, green, cyan } from 'kolorist'

import { root, copy } from './utils'

export const writeTemplateFile = (template: string) => {
  const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../template', `${template}`)
  const files = fs.readdirSync(templateDir)
  console.log('files: ', files)
  for (const file of files) {
    const targetPath = path.join(root, file)
    copy(path.join(templateDir, file), targetPath)
  }
}

export const settingLint = ({ packageList, packageManager, template }) => {
  console.log('packageList: ', packageList)
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
    writeTemplateFile(template)
    spinner.success({ text: green('All done! 🎉'), mark: '✔' })
    console.log(cyan('\n🔥 Reload your editor to activate the settings!'))
  })
}
