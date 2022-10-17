import { TEMPLATES, commonPackages } from './constants'
import type { FrameworkVariant } from './constants'
import { getPackageManager, askForProjectLint } from './utils'
import { settingLint } from './file'
console.log('TEMPLATES: ', TEMPLATES)

async function init() {
  const result = await askForProjectLint()
  console.log('result-----', result)
  console.log('run------------')
  // user choice associated with prompts
  const { framework, overwrite, packageName, variant } = result

  // determine template
  const template: string = variant || framework?.name

  const currentFrame: FrameworkVariant = framework?.variants.find(({ name }) => name === template)
  const { packageList = [] } = currentFrame
  const packageManager = getPackageManager()
  settingLint({
    packageList: [...commonPackages, ...packageList],
    packageManager,
    template
  })
}
init()
