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
 * @param {?String} markName - 標記名稱。
 * @param {Boolean} [ynSingle] - 是否為單元素標籤 (預設為 `false`)。
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
     * @param {String} key
     * @param {String} val
     */

    /**
     * 有效的子元素類型。
     *
     * @memberof module:htParse~_CreateElement~
     * @typedef {(String|module:htParse~_CreateElement|module:htParse~_CreateNodeList)} allowChild
     */

    /**
     * 增加子元素。
     *
     * @memberof module:htParse~_CreateElement#
     * @func appendChild
     * @param {module:htParse~_CreateElement~allowChild} child
     * @throws {TypeError} 參數值類型不符合期待。 (_typeError)
     */

    /**
     * 當創建時調用。
     *
     * @memberof module:htParse~_CreateElement#
     * @func onCreate
     * @param {Function} action
     */

    /**
     * 元素： 創建元素。
     *
     * @memberof module:htParse~_CreateElement#
     * @func elt
     * @return {(String|Element|*)}
     */

/**
 * 創建節點清單： 以 `Object` 仿 `Array` 方式創建，與 `NodeList` 不同。
 *
 * @abstract
 * @memberof module:htParse~
 * @class _CreateNodeList
 * @param {Array.<?module:htParse~_CreateElement~allowChild>} childNode -
 * 若為 `null` 時則忽略。
 * @throws {TypeError} 參數值類型不符合期待。 (_typeError)
 *
 * @example
 * new _CreateNodeList(
 *     new _CreateElement('i.a'),
 *     null,
 *     new _CreateElement('i.c')
 * )
 *
 * // { 0: new _CreateElement('i.a'),
 * //   1: new _CreateElement('i.c'),
 * //   length: 2
 * // }
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
    // tag
    void function (HTParseSelf, CreateElement, CreateNodeList) {
        /**
         * 標籤： 創建元素標籤。
         *
         * @memberof module:htParse.HTParse#
         * @func tag
         * @param {String} tagMark - 標籤與標記。
         * @param {Object} [attr] - 元素標籤屬性。
         * @param {Function} [onCreate] - 創建時事件。
         * @param {...?module:htParse~_CreateElement~allowChild} [subElt] - 子層元素標籤。
         * 若為 `null` 時則忽略。
         * @throws {Error} 標籤與標記不符合期待。
         * ({@link module:htParse.HTParse.logMsgTable|htParse_notConformTagMarkRule})
         * @return {module:htParse~_CreateElement}
         *
         * @example
         * (function (t) {
         *     t('div', {id: 'postForm'},
         *         function () {
         *             console.log(this.id);
         *         },
         *         t('form#postForm',
         *             {
         *                 action: '/postPage',
         *                 method: 'post',
         *                 enctype: 'multipart/form-data'
         *             },
         *             t.nodeList(
         *                 'First name',
         *                 t('input', {type: 'text', name: 'fname'}),
         *                 t.singleTag('br')
         *             ),
         *             t.nodeList(
         *                 'Last name',
         *                 t('input', {type: 'text', name: 'lname'}),
         *                 t.singleTag('br')
         *             ),
         *             t('input', {type: 'submit', value: 'Submit'})
         *         ),
         *         t('div#tty.tty', {
         *             dataset: {imHyperText: true, toMarkThisTag: 'tty'},
         *             onCreate: function () {
         *                 console.log(this.className);
         *             },
         *         })
         *     );
         * }(tag);
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
        HTParseSelf.tag = function t(tagMark) {
            var matchTagMark = tagMark.match(_regexTagMark);
            if (matchTagMark === null || matchTagMark[1] == null) {
                throw Error(HTParse.logMsgTable.htParse_notConformTagMarkRule);
            }

            var tagName   = matchTagMark[1];
            var markName  = matchTagMark[2] || null;
            var className = matchTagMark[3] || null;

            var argVal;
            var args = arguments;
            var idxArgs = 1;
            var lenArgs = args.length;
            var insMainElt = new CreateElement(tagName, markName);

            if (className) {
                insMainElt.setAttribute('class', className);
            }

            argVal = args[idxArgs++];
            if (argVal && argVal.constructor === Object) {
                _setAttr(insMainElt, argVal);
                argVal = args[idxArgs++];
            }
            if (typeof argVal === 'function') {
                insMainElt.onCreate(argVal);
                idxArgs++;
            }
            idxArgs--;

            while (idxArgs < lenArgs) {
                argVal = args[idxArgs++];
                if (argVal !== null) {
                    insMainElt.appendChild(argVal);
                }
            }

            return insMainElt;
        };

        /**
         * 創建單元素標籤。
         *
         * @memberof! module:htParse.HTParse#
         * @alias tag.singleTag
         * @func  tag.singleTag
         * @param {String} tagName - 元素標籤名。
         * @param {Object} [attr] - 元素標籤屬性。
         * @return {module:htParse~_CreateElement}
         */
        HTParseSelf.tag.singleTag = function singleTag(tagName, attr) {
            var insTag = new CreateElement(tagName, null, true);
            if (attr) {
                _setAttr(insTag, attr);
            }
            return insTag;
        };

        /**
         * 節點清單： 創建
         * {@link module:htParse~_CreateNodeList}
         * 類型的清單。
         *
         * @memberof! module:htParse.HTParse#
         * @alias tag.nodeList
         * @func  tag.nodeList
         * @param {...?module:htParse~_CreateElement} childNode
         * @return {module:htParse~_CreateNodeList}
         */
        HTParseSelf.tag.nodeList = function nodeList() {
            return new CreateNodeList(Array.prototype.slice.call(arguments));
        };

        /**
         * @memberof module:htParse.HTParse~
         * @namespace _tag
         */

        /**
         * 標籤與標記的正規表示式：
         * `/^([-_0-9A-Za-z]+)(#[-_0-9A-Za-z]+)?((?:\.[-_0-9A-Za-z]+)*)$/` 。
         *
         * @memberof module:htParse.HTParse~_tag.
         * @var _regexTagMark
         */
        var _regexTagMark = /^([-_0-9A-Za-z]+)(#[-_0-9A-Za-z]+)?((?:\.[-_0-9A-Za-z]+)*)$/;

        /**
         * "data" 屬性的正規表示式：
         * `/.Data$/` 。
         *
         * @memberof module:htParse.HTParse~_tag.
         * @var _regexDataAttr
         */
        var _regexDataAttr = /.Data$/;

        /**
         * 設定屬性。
         *
         * @memberof module:htParse.HTParse~_tag.
         * @func _setAttr
         * @param {module:htParse~_CreateElement} insMainElt - 當前主要的創建元素。
         * @param {Object} attr - 元素標籤屬性。
         */
        function _setAttr(insMainElt, attr) {
            var key, val;
            for (key in attr) {
                val = attr[key];

                if (val != null) {
                    switch (key) {
                        case 'className': insMainElt.setAttribute('class', val); break;
                        case 'onCreate':  insMainElt.onCreate(val); break;
                        // 避免 "data" 屬性判斷
                        case 'id':
                        case 'title':
                        case 'alt':
                        case 'style':     insMainElt.setAttribute(key, val); break;
                        default:
                            if (_regexDataAttr.test(key)) {
                                insMainElt.dataset(key.substr(0, key.length - 4), val);
                            } else {
                                insMainElt.setAttribute(key, val);
                            }
                    }
                }
            }
        }
    }(this, CreateElement, CreateNodeList);

    // jcss
    void function (HTParseSelf) {
        var stopResolve = true;
        var styleProp_uppercase = /([A-Z])/g;

        /**
         * 爪哇腳本樣式表： 將爪哇腳本編寫的程式碼轉換成樣式表格式。
         *
         * @memberof module:htParse.HTParse#
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
         * @memberof module:htParse.HTParse~
         * @namespace _jcss
         */

        /**
         * 物件陣列樣式表： 以遞迴解析物件陣列表達的巢狀樣式表。
         *
         * @memberof module:htParse.HTParse~_jcss.
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
         * @memberof module:htParse.HTParse~_jcss.
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
         * @memberof module:htParse.HTParse~_jcss.
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
         * @memberof module:htParse.HTParse~_jcss.
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
         * @memberof module:htParse.HTParse~_jcss.
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

/**
 * 日誌訊息表。
 *
 * @memberof module:htParse.HTParse.
 * @var {Object.<String, String>} logMsgTable
 * @property {String} htParse_notConformTagMarkRule - 標籤與標記不符合 {@link module:htParse.HTParse~_tag._regexTagMark} 期待。
 */
HTParse.logMsgTable = {
    _typeError: 'a value is not of the expected type.',
    htParse_notConformTagMarkRule:
        'The "tagMark" not meeting'
        + ' `/^([-_0-9A-Za-z]+)(#[-_0-9A-Za-z]+)?((?:\\.[-_0-9A-Za-z]+)*)$/`'
        + ' rules expectations.',
};

