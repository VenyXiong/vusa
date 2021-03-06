/**
 * @file 覆盖 san 原生的 _calcComputed
 * @author cxtom(cxtom2008@gmail.com)
 */

import {resetTarget, cleanTarget, Dep} from './bind-data-proxy';

export default function calcComputed(key) {
    let computedDeps = this.computedDeps[key];
    if (!computedDeps) {
        computedDeps = this.computedDeps[key] = {};
    }

    const me = this;

    const oldValue = this.data.get(key);

    resetTarget();
    const value = this.computed[key].call(this);
    const deps = Dep.target;
    cleanTarget();
    console.log(key, deps);
    for (let i = 0; i < deps.length; i++) {
        const dep = deps[i];
        const {expr, context} = dep;
        const exprPrefix = this === context ? '' : 'upper';
        const exprSuffix = expr.paths.map(a => a.value).join('.');
        const exprStr = exprPrefix + exprSuffix;
        if (!computedDeps[exprStr]) {
            computedDeps[exprStr] = 1;
            delete expr.changeCache;
            context.watch(expr, function (change) {
                calcComputed.call(me, key);
            });
        }
    }

    this.data.raw[key] = value;
}
