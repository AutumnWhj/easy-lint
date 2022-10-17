import prompts from 'prompts';
import { yellow, blue, green, cyan, reset, red } from 'kolorist';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const FRAMEWORKS = [
    {
        name: 'vanilla',
        display: 'Vanilla',
        color: yellow,
        variants: [
            {
                name: 'vanilla',
                display: 'JavaScript',
                color: yellow
            },
            {
                name: 'vanilla-ts',
                display: 'TypeScript',
                color: blue
            }
        ]
    },
    {
        name: 'vue',
        display: 'Vue',
        color: green,
        variants: [
            {
                name: 'vue',
                display: 'JavaScript',
                color: yellow
            },
            {
                name: 'vue-ts',
                display: 'TypeScript',
                color: blue
            }
        ]
    },
    {
        name: 'react',
        display: 'React',
        color: cyan,
        variants: [
            {
                name: 'react',
                display: 'JavaScript',
                color: yellow
            },
            {
                name: 'react-ts',
                display: 'TypeScript',
                color: blue
            }
        ]
    }
];
const TEMPLATES = FRAMEWORKS.map((f) => (f.variants && f.variants.map((v) => v.name)) || [f.name]).reduce((a, b) => a.concat(b), []);

const root = process.cwd();
function pkgFromUserAgent(userAgent) {
    if (!userAgent)
        return undefined;
    const pkgSpec = userAgent.split(' ')[0];
    const pkgSpecArr = pkgSpec.split('/');
    return {
        name: pkgSpecArr[0],
        version: pkgSpecArr[1]
    };
}
function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    }
    else {
        fs.copyFileSync(src, dest);
    }
}
function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
}

const writeTemplateFile = (template) => {
    const templateDir = path.resolve(fileURLToPath(import.meta.url), '../../template', `${template}`);
    const files = fs.readdirSync(templateDir);
    console.log('files: ', files);
    for (const file of files) {
        const targetPath = path.join(root, file);
        copy(path.join(templateDir, file), targetPath);
    }
};

console.log('TEMPLATES: ', TEMPLATES);
async function init() {
    let result;
    try {
        result = await prompts([
            {
                type: 'select',
                name: 'framework',
                message: reset('Select a framework:'),
                initial: 0,
                choices: FRAMEWORKS.map((framework) => {
                    const frameworkColor = framework.color;
                    return {
                        title: frameworkColor(framework.display || framework.name),
                        value: framework
                    };
                })
            },
            {
                type: (framework) => (framework && framework.variants ? 'select' : null),
                name: 'variant',
                message: reset('Select a variant:'),
                choices: (framework) => framework.variants.map((variant) => {
                    const variantColor = variant.color;
                    return {
                        title: variantColor(variant.display || variant.name),
                        value: variant.name
                    };
                })
            }
        ], {
            onCancel: () => {
                throw new Error(red('✖') + ' Operation cancelled');
            }
        });
    }
    catch (cancelled) {
        console.log(cancelled.message);
        return;
    }
    console.log('result-----', result);
    console.log('run------------');
    // user choice associated with prompts
    const { framework, overwrite, packageName, variant } = result;
    // determine template
    const template = variant || framework?.name;
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
    const pkgManager = pkgInfo ? pkgInfo.name : 'npm';
    pkgManager === 'yarn' && pkgInfo?.version.startsWith('1.');
    // const templateDir = path.resolve('./template', `${template}`)
    writeTemplateFile(template);
}
init();

if(typeof window !== 'undefined') {
  window._VERSION_ = '1.0.0'
}
