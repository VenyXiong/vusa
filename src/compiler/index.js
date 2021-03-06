/**
 * @file compiler
 * @author cxtom(cxtom2008@gmail.com)
 */

import buildInModules from './modules/index';
import {compile as vueCompile} from 'vue-template-compiler';
import stringify from './stringify';
import getCssModules from './modules/cssmodules';
import atom from './modules/atom';
import {isEmpty} from 'lodash';
import {parseTemplate} from 'san';
import optimize from './optimize-anode';

export function compile(source, options = {}) {

    const {
        modules = [],
        cssModules = null,
        scopeId = '',
        strip = true,
        atom: isAtom = false
    } = options;

    if (!isEmpty(cssModules)) {
        modules.unshift(getCssModules(cssModules));
    }

    if (isAtom) {
        modules.unshift(atom);
    }

    const errors = [];
    const compilerOptions = {
        modules: [
            ...buildInModules,
            ...modules
        ],
        preserveWhitespace: false,
        useDynamicComponent: false,
        refs: [],
        error(msg) {
            console.error(`[vusa error] ${msg}`);
            errors.push(msg);
        },
        strip
    };

    // console.log(source);

    const {ast} = vueCompile(source.trim(), compilerOptions);

    const template = stringify(ast, { scopeId, strip, atom: isAtom });
    console.log(template);
    const aNode = parseTemplate(template, {
        trimWhitespace: 'blank'
    }).children[0];

    return {
        ast,
        aNode: optimize(aNode),
        template,
        refs: compilerOptions.refs,
        errors
    };
}
