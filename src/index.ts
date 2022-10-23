import { TEMPLATES } from './constants'
import { askForProjectLint } from './utils'
import { settingLint } from './file'
import { green } from 'kolorist'
import { commonPackages, eslintPackages } from './constants/config'
console.log('TEMPLATES: ', TEMPLATES)

async function init() {
  const result = await askForProjectLint()
  console.log('result-----', result)
  console.log(green('will integrates the default with husky and lint-stage'))
  settingLint(result)
}
init()
