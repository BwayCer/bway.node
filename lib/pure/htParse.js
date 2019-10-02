/*! HyperText Parse @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */


/**
 * 超文本解析 HyperText Parse
 *
 * @module htParse
 */

    /**
     * 創建的元素標籤。
     *
     * @abstract
     * @memberof module:htParse~
     * @class _CreateElement
     * @param {String} name - 元素名稱。
     * @param {Boolean} ynSingle - 是否為單元素標籤。
     */

        /**
         * 設定屬性。
         *
         * @memberof module:htParse~_CreateElement#
         * @func setAttribute
         * @param {String} key
         * @param {String} val
         */

        /**
         * 設定元素資料： 設定元素專用的 `dataset`。
         *
         * @memberof module:htParse~_CreateElement#
         * @func dataset
         * @param {Object} data
         */

        /**
         * 增加子元素。
         *
         * @memberof module:htParse~_CreateElement#
         * @func appendChild
         * @param {(String|module:htParse~_CreateElement~insHel|module:htParse~_createNodeList)} child
         * @throws {TypeError} 參數值類型不符合期待。 (_typeError)
         */

        /**
         * 當創建時調用。
         *
         * @memberof module:htParse~_CreateElement#
         * @func onCreate
         * @param {Function} onCreate
         */

        /**
         * 由 {@link module:htParse~_CreateElement#elt} 取得的回傳值。
         *
         * @memberof module:htParse~_CreateElement~
         * @typedef {(String|Element|*)} insHel
         */

        /**
         * 元素： 創建元素。
         *
         * @memberof module:htParse~_CreateElement#
         * @func elt
         * @return {module:htParse~_CreateElement~insHel}
         */

    /**
     * 創建節點清單： 以 `Object` 仿 `Array` 方式創建，與 `NodeList` 不同。
     *
     * @abstract
     * @memberof module:htParse~
     * @class _CreateNodeList
     * @param {Array} args
     * @param {...?(module:htParse~_CreateElement~insHel)} childNode - 若為 `undefined` 或 `null` 時則忽略。
     */

/**
 * 超文本解析 HyperText Parse
 *
 * @memberof module:htParse.
 * @class HTParse
 * @param {class} CreateElement - {@link module:htParse~_CreateElement}
 * @param {class} CreateNodeList - {@link module:htParse~_CreateNodeList}
 */
function HTParse(CreateElement, CreateNodeList) {
    /**
     * @memberof module:htParse.HTParse#
     * @namespace tag
     */
    void function (HTParseSelf, CreateElement, CreateNodeList) {
        /**
         * 標籤： 創建元素標籤。
         *
         * @memberof module:htf~tag~
         * @func t
         * @param {String} tagMark - 標籤與標記。
         * @param {Object} [attr] - 元素標籤屬性。
         * @param {Function} [onCreate] - 創建時事件。
         * @param {...Element} [subElt] - 子層元素標籤。
         * @return {(String|Element|module:htParse~_CreateNodeList)}
         * 見 {@link module:htParse~_setMarkHel|_docClass._setMarkHel} 。
         *
         * @example
         * t('div', {id: 'postForm'},
         *     function () {
         *         console.log(this.id);
         *     },
         *     t('form#postForm',
         *         {
         *             action: '/postPage',
         *             method: 'post',
         *             enctype: 'multipart/form-data'
         *         },
         *         t.nodeList(
         *             'First name',
         *             t('input', {type: 'text', name: 'fname'}),
         *             t.singleTag('br')
         *         ),
         *         t.nodeList(
         *             'Last name',
         *             t('input', {type: 'text', name: 'lname'}),
         *             t.singleTag('br')
         *         ),
         *         t('input', {type: 'submit', value: 'Submit'})
         *     ),
         *     t('div#tty.tty', {
         *         dataset: {imHyperText: true, toMarkThisTag: 'tty'},
         *         onCreate: function () {
         *             console.log(this.className);
         *         },
         *     })
         * );
         *
         * // HTML (格式化)
         * // <div id="postForm">
         * //     <form action="/postPage" method="post" enctype="multipart/form-data">
         * //         First name
         * //         <input type="text" name="fname" />
         * //         <br />
         * //         Last name
         * //         <input type="text" name="lname" />
         * //         <br />
         * //         <input type="submit" value="Submit" />
         * //     </form>
         * //     <div class="tty" data-im-hyper-text="true" data-to-mark-this-tag="tty"></div>
         * // </div>"
         */
        HTParseSelf.tag = function tag() {
            // ...
        };
    }(this, CreateElement, CreateNodeList);

    /**
     * @memberof module:htParse.HTParse#
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

