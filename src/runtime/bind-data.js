/**
 * @file 数据绑定
 * @author cxtom(cxtom2008@gmail.com)
 */

import {extend, def} from '../shared/util';
import {ExprType} from 'san';
import calcComputed from './calc-computed';

const defaultExpr = {
    type: ExprType.ACCESSOR,
    paths: []
};

export function getExpr(key) {
    return extend({}, defaultExpr, {
        paths: [{
            type: 1,
            value: key
        }]
    });
}

export default function () {
    const keys = [...this._dataKeys, ...this._propKeys];
    const keyLength = keys.length;

    const context = this;

    for (let i = 0; i < keyLength; i++) {
        const key = keys[i];
        def(context, key, {
            get() {
                return context.data.get(getExpr(key));
            },
            set(newVal) {
                context.data.set(getExpr(key), newVal);
            }
        });
    }

    this.data.owner = this;
    this.data._dep = new Dep();

    // define computed
    for (let i = 0; i < this._computedKeys.length; i++) {
        const key = this._computedKeys[i];
        def(this, key, {
            get() {
                return me.data.get(getExpr(key));
            }
        });
        calcComputed.call(this, key);
    }
}
