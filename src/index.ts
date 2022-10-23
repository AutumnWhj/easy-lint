import { TEMPLATES } from './constants'
import { getPackageManager, askForProjectLint } from './utils'
import { settingLint } from './file'
import { green } from 'kolorist'
import { commonPackages, eslintPackages } from './constants/config'
console.log('TEMPLATES: ', TEMPLATES)

async function init() {
  const result = await askForProjectLint()
  console.log('result-----', result)
  console.log(green('will integrates the default with husky and lint-stage'))
  // user choice associated with prompts
  const { framework, otherLint, variant } = result

  // determine template
  const template: string = variant || framework?.name

  const packageManager = getPackageManager()
  settingLint({
    packageList: [...commonPackages, ...eslintPackages[variant]],
    packageManager,
    template,
    otherLint
  })
}
init()
