import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
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
