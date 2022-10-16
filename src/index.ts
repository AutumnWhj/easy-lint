import prompts from 'prompts'
import { reset, red } from 'kolorist'
import { FRAMEWORKS, TEMPLATES } from './constants'
import type { Framework } from './constants'
console.log('TEMPLATES: ', TEMPLATES)
const cwd = process.cwd()

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
}
init()
