import prompts from 'prompts'
import { reset, red } from 'kolorist'
import { FRAMEWORKS, TEMPLATES, commonPackages } from './constants'
import type { Framework, FrameworkVariant } from './constants'
import { pkgFromUserAgent } from './utils'
import { settingLint } from './file'
console.log('TEMPLATES: ', TEMPLATES)

async function init() {
  let result: prompts.Answers<'projectName' | 'overwrite' | 'packageName' | 'framework' | 'variant'>
  try {
    result = await prompts(
      [
        {
          type: 'select',
          name: 'framework',
          message: reset('Select a framework:'),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework
            }
          })
        },
        {
          type: (framework: Framework) => (framework && framework.variants ? 'select' : null),
          name: 'variant',
          message: reset('Select a variant:'),
          choices: (framework: Framework) =>
            framework.variants.map((variant) => {
              const variantColor = variant.color
              return {
                title: variantColor(variant.display || variant.name),
                value: variant.name
              }
            })
        }
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ' Operation cancelled')
        }
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    return
  }
  console.log('result-----', result)
  console.log('run------------')
  // user choice associated with prompts
  const { framework, overwrite, packageName, variant } = result

  // determine template
  const template: string = variant || framework?.name

  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)

  const packageManager = pkgInfo ? pkgInfo.name : 'npm'

  // const templateDir = path.resolve('./template', `${template}`)
  const currentFrame: FrameworkVariant = framework?.variants.find(({ name }) => name === template)
  const { packageList = [] } = currentFrame
  const resultList = [...commonPackages, ...packageList]

  settingLint({
    packageList: resultList,
    packageManager,
    template
  })
}
init()
