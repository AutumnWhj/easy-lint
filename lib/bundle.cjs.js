'use strict';

var prompts = require('prompts');
var kolorist = require('kolorist');
var fs = require('fs');
var path = require('path');
var url = require('url');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var prompts__default = /*#__PURE__*/_interopDefaultLegacy(prompts);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

const FRAMEWORKS = [
    {
        name: 'vanilla',
        display: 'Vanilla',
        color: kolorist.yellow,
        variants: [
            {
                name: 'vanilla',
                display: 'JavaScript',
                color: kolorist.yellow
            },
            {
                name: 'vanilla-ts',
                display: 'TypeScript',
                color: kolorist.blue
            }
        ]
    },
    {
        name: 'vue',
        display: 'Vue',
        color: kolorist.green,
        variants: [
            {
                name: 'vue',
                display: 'JavaScript',
                color: kolorist.yellow
            },
            {
                name: 'vue-ts',
                display: 'TypeScript',
                color: kolorist.blue
            }
        ]
    },
    {
        name: 'react',
        display: 'React',
        color: kolorist.cyan,
        variants: [
            {
                name: 'react',
                display: 'JavaScript',
                color: kolorist.yellow
            },
            {
                name: 'react-ts',
                display: 'TypeScript',
                color: kolorist.blue
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
    const stat = fs__default["default"].statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    }
    else {
        fs__default["default"].copyFileSync(src, dest);
    }
}
function copyDir(srcDir, destDir) {
    fs__default["default"].mkdirSync(destDir, { recursive: true });
    for (const file of fs__default["default"].readdirSync(srcDir)) {
        const srcFile = path__default["default"].resolve(srcDir, file);
        const destFile = path__default["default"].resolve(destDir, file);
        copy(srcFile, destFile);
    }
}

const writeTemplateFile = (template) => {
    const templateDir = path__default["default"].resolve(url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('bundle.cjs.js', document.baseURI).href))), '../../template', `${template}`);
    const files = fs__default["default"].readdirSync(templateDir);
    console.log('files: ', files);
    for (const file of files) {
        const targetPath = path__default["default"].join(root, file);
        copy(path__default["default"].join(templateDir, file), targetPath);
    }
};

console.log('TEMPLATES: ', TEMPLATES);
async function init() {
    let result;
    try {
        result = await prompts__default["default"]([
            {
                type: 'select',
                name: 'framework',
                message: kolorist.reset('Select a framework:'),
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
                message: kolorist.reset('Select a variant:'),
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
                throw new Error(kolorist.red('✖') + ' Operation cancelled');
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
