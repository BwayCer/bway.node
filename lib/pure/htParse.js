/*! HyperText Parse @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */


/**
 * 超文本解析 HyperText Parse
 *
 * @module htParse
 */

function HTParse() {

    /**
     * @memberof module:htParse#
     * @namespace jcss
     */
    void function (HTParseSelf) {
        var stopResolve = true;
        var styleProp_uppercase = /([A-Z])/g;

        /**
         * 爪哇腳本樣式表： 將爪哇腳本編寫的程式碼轉換成樣式表格式。
         *
         * @memberof module:htParse#jcss.
         * @func jcss
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
         * @return {String} 若樣式表格式不符則回傳空文字（`''`）。
         *
         * @example
         * jcss({
         *     'body': {
         *         margin: '0',
         *     },
         *
         *     '.TxDiv': {
         *         width: '100%',
         *         height: '100%',
         *
         *         '&_aLink, &_bLink': {
         *             display: 'block',
         *
         *             'body.esPc &': {
         *                 display: 'none',
         *             },
         *         },
         *     },
         * });
         *
         * // CSS (格式化)
         * // body {
         * //     margin: '0',
         * // }
         * // .TxDiv {
         * //     width: '100%',
         * //     height: '100%',
         * // }
         * // .TxDiv_aLink,
         * // .TxDiv_bLink {
         * //     display: 'block',
         * // }
         * // body.esPc .TxDiv_aLink {
         * //     display: 'none',
         * // }
         */
        HTParseSelf.jcss = function jcss(stylesheet) {
            if (stylesheet == null || stylesheet.constructor !== Object) {
                return '';
            }

            var key, val;
            var parentName;
            var styleValue_child = '';
            var strAns = '';

            stopResolve = false;

            for (key in stylesheet) {
                if (stopResolve) {
                    break;
                }

                val = stylesheet[key];
                parentName = [];

                if (val == null || val.constructor !== Object) {
                    stopResolve = true;
                    break;
                } else {
                    styleValue_child = _objectStylesheet(parentName, key, val);
                    strAns = _cssCombine(strAns, styleValue_child);
                }
            }

            if (stopResolve) {
                strAns = '';
            } else {
                stopResolve = true;
            }

            return strAns;
        };

        /**
         * 物件陣列樣式表： 以遞迴解析物件陣列表達的巢狀樣式表。
         *
         * @memberof module:htParse#jcss~
         * @func _objectStylesheet
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的件陣列。
         * @return {String} 若樣式表格式不符則回傳空文字（`''`）。
         */
        function _objectStylesheet(parentName, name, stylesheet) {
            if (stopResolve
                || stylesheet == null
                || stylesheet.constructor !== Object) {
                return '';
            }

            var key, val;
            var styleValue = {};
            var styleValue_child = '';
            var strAns = '';

            parentName.push(name);

            for (key in stylesheet) {
                if (stopResolve) {
                    break;
                }

                val = stylesheet[key];

                if (typeof val == 'string') {
                    styleValue[key] = val;
                } else if (val != null && val.constructor === Object) {
                    styleValue_child = _cssCombine(
                        styleValue_child,
                        _objectStylesheet(parentName, key, val)
                    );
                } else {
                    stopResolve = true;
                    break;
                }
            }

            parentName.pop();

            if (stopResolve) {
                return '';
            } else {
                strAns = Object.keys(styleValue).length > 0
                    ? _cssExpression(parentName, name, styleValue)
                    : ''
                ;
                strAns = _cssCombine(strAns, styleValue_child);
                return strAns;
            }
        }

        /**
         * 樣式表結合： 結合並排版。
         *
         * @memberof module:htParse#jcss~
         * @func _cssCombine
         * @param {String} prevSection - 上半部樣式表。
         * @param {String} nextSection - 下半部樣式表。
         * @return {String}
         */
        function _cssCombine(prevSection, nextSection) {
            var strAns;
            var breakWord = ' ';

            if (!!prevSection === false && !!nextSection === false) {
                strAns = '';
            } else if (!!nextSection === false) {
                strAns = prevSection;
            } else if (!!prevSection === false) {
                strAns = nextSection;
            } else {
                strAns = prevSection + breakWord + nextSection;
            }

            return strAns;
        }

        /**
         * 樣式表表達式： 樣式表排版。
         *
         * @memberof module:htParse#jcss~
         * @func _cssExpression
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @param {Object} value - 樣式表屬性鍵和值。
         * @return {String}
         */
        function _cssExpression(parentName, name, value) {
            var key;
            var strQueryName = _jcssSelector(parentName, name);
            var breakWord = '';
            var indent = ' ';
            var strAns = '';

            strAns += strQueryName + ' {' + breakWord;
            for (key in value) {
                strAns += indent + _styleProp(key)
                    + ': ' + value[key] + ';' + breakWord;
            }
            strAns += ' }';

            return strAns;
        }

        /**
         * 爪哇腳本樣式表選擇器： 與父層名組合，並將 `&` 字符替換成父親名。
         *
         * @memberof module:htParse#jcss~
         * @func _jcssSelector
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @return {String}
         */
        function _jcssSelector(parentName, name) {
            var val;
            var regexSymbol = /&/g;
            var p = 0;
            var len = parentName.length;
            var strAns = '';

            while (p <= len) {
                val = parentName[p++] || name;

                if (regexSymbol.test(val)) {
                    strAns = val.replace(regexSymbol, strAns);
                } else {
                    strAns += ' ' + val;
                }
            }

            strAns = strAns.replace(/(>)/g, ' $1 ').replace(/^ +/, '').replace(/  +/g, ' ');
            return strAns;
        }

        /**
         * 樣式屬性名稱： 將名稱轉小寫，並把原大寫前面加橫槓（`-`）。
         *
         * @memberof module:htParse#jcss~
         * @func _styleProp
         * @param {String} prop - 屬性名稱。
         * @return {String}
         */
        function _styleProp(prop) {
            var strAns;
            if(styleProp_uppercase.test(prop)) {
                strAns = prop.replace(styleProp_uppercase, '-$1').toLocaleLowerCase();
            } else {
                strAns = prop;
            }
            return strAns;
        }
    }(this);
}

const htParse = new HTParse();

console.log(htParse.jcss({
    'body': {
        margin: '0',
    },

    '.TxDiv': {
        width: '100%',
        height: '100%',

        '&_aLink, &_bLink': {
            display: 'block',

            'body.esPc &': {
                display: 'none',
            },
        },
    },
}));

