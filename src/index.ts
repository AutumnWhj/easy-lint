import { askForProjectLint } from './utils'
import { settingLint } from './file'
import { green } from 'kolorist'

async function init() {
  const result = await askForProjectLint()
  console.log('result-----', result)
  console.log(green('will integrates the default with husky and lint-stage'))
  settingLint(result)
}
init()
