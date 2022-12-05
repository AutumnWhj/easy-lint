import { askForProjectLint } from './utils'
import { setLint } from './file'
import { cyan } from 'kolorist'

import { checkPackageFile } from './utils'

async function init() {
  if (!checkPackageFile()) return
  const result = await askForProjectLint()
  console.log(cyan('will integrates the default with husky and lint-stage'))
  setLint(result)
}
init()
