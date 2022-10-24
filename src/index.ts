import { askForProjectLint } from './utils'
import { settingLint } from './file'
import { cyan } from 'kolorist'

async function init() {
  const result = await askForProjectLint()
  console.log(cyan('will integrates the default with husky and lint-stage'))
  settingLint(result)
}
init()
