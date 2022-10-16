'use strict';

var path = require('path');
var prompts = require('prompts');
var kolorist = require('kolorist');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var prompts__default = /*#__PURE__*/_interopDefaultLegacy(prompts);

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

console.log('TEMPLATES: ', TEMPLATES);
process.cwd();
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
    const templateDir = path__default["default"].resolve('./template', `${template}`);
    console.log('templateDir: ', templateDir);
}
init();

if(typeof window !== 'undefined') {
  window._VERSION_ = '1.0.0'
}
