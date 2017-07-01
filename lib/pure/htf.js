/*! HyperText Forward @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 超文本預告 HyperText Forward
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */


order( [
    '/pure/log',
    '/pure/support',
], function ( log, support ) {
    "use strict";

    /**
     * 超文本預告
     *
     * @module htf
     */

    log.setMsg( {
        htf_canNotCreateEltTag: 'Can\'t create element tag.',
    } );

    var _emptyEnum = support.emptyEnum;

    /**
     * @memberof module:htf~
     * @var {Boolean} isFormat - 是否格式化。 開發者除錯使用。
     */
    var isFormat = false;

    /**
     * @memberof module:htf~
     * @var {Boolean} isPureText - 是否純文本。
     * 以 `typeof global !== 'undefined'` 自動判斷。
     */
    var isPureText = typeof global !== 'undefined';

    var _tag, _jcss;
    var _initMarkHel, _setMarkHel;
    var _createElement, _createNodeList;


    var htf = new function htf() {};


    /**
     * @memberof module:htf~
     * @namespace _docClass
     */

    // var _initMarkHel, _setMarkHel;
    // var _createElement, _createNodeList;
    void function () {
        arguments[ isPureText ? 0 : 1 ]();


        /**
         * 創建節點清單： 以 `Object` 仿 `Array` 方式創建，與 `NodeList` 不同。
         *
         * @memberof module:htf~_docClass.
         * @class _createNodeList
         * @param {Array} args - 若子成員為 `undefined` 或 `null` 時將忽略。
         */
        _createNodeList = function _createNodeList( arrArgs ) {
            var val;
            var len = arrArgs.length;

            while ( len-- ) {
                val = arrArgs[ len ];
                if ( val != null ) this[ len ] = val;
            }
        };
    }(
    function pureText() {
        _initMarkHel = function ( objMarkHel ) {
            objMarkHel.head = objMarkHel.head || '';
            objMarkHel.main = objMarkHel.main || '';
            objMarkHel.script = objMarkHel.script || '';
            objMarkHel.tagIds = objMarkHel.tagIds || [];

            return objMarkHel;
        };

        _setMarkHel = function ( objMarkHel, insMain ) {
            var strElt;

            switch ( insMain && insMain.constructor ) {
                case _createElement:
                    if ( insMain._onCreate ) _setMarkHel_onCreateBindElt( objMarkHel, insMain );

                    strElt = objMarkHel.main = insMain.elt();
                    return strElt;
                case _createNodeList:
                    strElt = _setMarkHel_getNodeListEltString( insMain );
                    if ( strElt == null ) break;

                    objMarkHel.main = strElt;
                    return insMain;
            }

            objMarkHel.main = null;
            throw Error( log.err( 21, 'htf_canNotCreateEltTag' ) );
        };

        var _gapCharacter = isFormat ? '\n' : '';

        function _setMarkHel_onCreateBindElt( objMarkHel, insElement ) {
            var strId = insElement._id;;

            if ( !strId ) {
                strId = 'HTMxR' + Math.random().toString().substr( -7 );
                insElement.setAttribute( 'id', strId );
                objMarkHel.tagIds.push( strId );
            }

            objMarkHel.script += '(' + insElement._onCreate
                + ').call( document.getElementById( "' + strId + '" ) );' + _gapCharacter;
        }

        function _setMarkHel_getNodeListEltString( insNodeList ) {
            var idx, val, strElt;

            for ( idx in insNodeList ) {
                val = insNodeList[ idx ];

                if ( typeof val !== 'string' ) return null;
                strElt += val;
            }

            return strElt;
        }

        /**
         * 創建元素： 見 {@link module:htf~_docClass._createElement} 。
         *
         * @memberof module:htf~_docClass._createElement.
         * @func _createElement_pureText
         */
        _createElement = function createElement( strName, bisSingle ) {
            this._isSingle = bisSingle;
            this._name = strName;
            this._id = null;
            this._attrs = '';
            this._dataset = '';
            this._childs = '';
            this._onCreate = null;
        };

        /**
         * 設定屬性： 見 {@link module:htf~_docClass._createElement#setAttribute} 。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func setAttribute_pureText
         */
        _createElement.prototype.setAttribute = function ( strKey, strVal ) {
            if ( strKey === 'id' ) this._id = strVal;
            this._attrs += ' ' + strKey + '="' + strVal + '"';
        };

        var _regexUppercase = /([A-Z])/g;

        /**
         * 設定元素資料： 見 {@link module:htf~_docClass._createElement#dataset} 。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func dataset_pureText
         */
        _createElement.prototype.dataset = function ( objData ) {
            var key;
            var dataset = '';

            for ( key in objData ) {
                dataset += ' data-'
                    + key.replace( _regexUppercase, '-$1' ).toLowerCase()
                    + '="' + objData[ key ] + '"';
            }

            this._dataset = dataset;
        };

        var _increaseIndent = isFormat
            ? function ( strChild ) { return strChild.replace( /(.+)/gm, '    $1' ) + '\n'; }
            : function ( strChild ) { return strChild; };

        /**
         * 增加子元素： 見 {@link module:htf~_docClass._createElement#appendChild} 。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func appendChild_pureText
         */
        _createElement.prototype.appendChild = function ( anyChild ) {
            var idx, val, txtChild;

            switch ( anyChild.constructor ) {
                case String:
                    txtChild = _increaseIndent( anyChild );
                    break;
                case _createNodeList:
                    txtChild = '';

                    for ( idx in anyChild ) {
                        val = anyChild[ idx ];

                        if ( typeof val !== 'string' ) {
                            txtChild = null;
                            break;
                        }

                        txtChild += _increaseIndent( val );
                    }
                    break;
            }

            if ( txtChild != null ) this._childs += txtChild;
            else throw TypeError( log.err( 21, '_typeError' ) );
        };

        var _regexWordySpace = /\s+/g;

        var _clearWordySpaceScript = isFormat
            ? function ( fnOnCreate ) { return fnOnCreate.toString(); }
            : function ( fnOnCreate ) {
                return fnOnCreate.toString().replace( _regexWordySpace, ' ' );
            };

        /**
         * 當創建時調用： 見 {@link module:htf~_docClass._createElement#onCreate} 。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func onCreate_pureText
         */
        _createElement.prototype.onCreate = function ( fnOnCreate ) {
            this._onCreate = _clearWordySpaceScript( fnOnCreate );
        };

        /**
         * 元素： 創建元素。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func elt_pureText
         * @return {String}
         */
        _createElement.prototype.elt = function elt() {
            var item, key;
            var tagName = this._name;
            var strAns = '';

            strAns += '<' + tagName + this._attrs + this._dataset;

            if ( this._isSingle ) strAns += ' />';
            else {
                strAns += '>';

                item = this._childs;
                if ( item ) strAns += _gapCharacter + item;

                strAns += '</' + tagName + '>';
            }

            return strAns;
        };
    },
    function HyperText() {
        /**
         * 初始化標記標籤。
         * <br>
         * <br>
         * markHel 規範：
         * <br>
         * * 若 `isPureText === true`：
         * <br>
         * <pre>
         * ```
         * { head: 放於頭部段落的文字,
         *   main: 放於身體段落的文字,
         *   script: 用於設定元素標籤之腳本
         *   tagIds: 對元素標籤標記識別碼的亂數清單 }
         * ```
         * </pre>
         * * 若 `isPureText === false`：
         * <br>
         * <pre>
         * ```
         * { main: 主要輸出元素標籤（最後執行的）,
         *   ...key: 追蹤之元素標籤 }
         * ```
         * </pre>
         *
         * @memberof module:htf~_docClass.
         * @func _initMarkHel
         * @param {Object} markHel
         * @return {Object} 初始化的標記標籤
         */
        _initMarkHel = function ( objMarkHel ) {
            objMarkHel.main = objMarkHel.main || null;

            return objMarkHel;
        };

        /**
         * 設定標記標籤： 依 `isPureText` 環境需求使用不同的設定方式。
         *
         * @memberof module:htf~_docClass.
         * @func _setMarkHel
         * @param {Object} markHel
         * @param {(module:htf~_docClass._createElement|module:htf~_docClass._createNodeList)} main
         * @throws {Error} 創建元素失敗。 (21, htf_canNotCreateEltTag)
         * @return {module:htf~_docClass._createNodeList} 當 `main instanceof _createNodeList` 時。
         * @return {String} 當 `isPureText === true` 時。
         * @return {Element} 當 `isPureText === false` 時。
         */
        _setMarkHel = function ( objMarkHel, insMain ) {
            var helElt;

            switch ( insMain && insMain.constructor ) {
                case _createElement:
                    helElt = objMarkHel.main = insMain.elt();
                    if ( insMain._onCreate ) insMain._onCreate.call( helElt );
                    return helElt;
                case _createNodeList:
                    objMarkHel.main = insMain;
                    return insMain;
            }

            objMarkHel.main = null;
            throw Error( log.err( 21, 'htf_canNotCreateEltTag' ) );
        };


        /**
         * 創建元素： 若 `isPureText === true`，使用文字模式；
         * 反之則使用 `document.createElement` 創建的元素標籤，
         *
         * @memberof module:htf~_docClass.
         * @class _createElement
         * @param {String} name - 元素名稱。
         */
        _createElement = function createElement( strName ) {
            this._name = strName;
            this._id = null;
            this._attrs = new _emptyEnum();
            this._dataset = null;
            this._childs = [];
            this._onCreate = null;
        };

        /**
         * 設定屬性。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func setAttribute
         * @param {String} key
         * @param {String} val
         */
        _createElement.prototype.setAttribute = function ( strKey, strVal ) {
            if ( strKey === 'id' ) this._id = strVal;
            this._attrs[ strKey ] = strVal;
        };

        /**
         * 設定元素資料： 設定元素專用的 `dataset`。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func dataset
         * @param {Object} data
         */
        _createElement.prototype.dataset = function ( objData ) {
            var key, dataset;

            dataset = this._dataset = new _emptyEnum();

            for ( key in objData ) dataset[ key ] = objData[ key ];
        };

        /**
         * 增加子元素。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func appendChild
         * @param {(String|Element|module:htf~_docClass._createNodeList)} child
         * @throws {TypeError} 參數值類型不符合期待。 (21, _typeError)
         */
        _createElement.prototype.appendChild = function ( anyChild ) {
            var childs = this._childs;

            if ( typeof anyChild === 'string' ) childs.push( document.createTextNode( anyChild ) );
            else if ( anyChild instanceof Element ) childs.push( anyChild );
            else if ( anyChild.constructor !== _createNodeList
                || !_appendNodeListChild( childs, anyChild ) ) {
                throw TypeError( log.err( 21, '_typeError' ) );
            }
        };

        function _appendNodeListChild( arrChilds, insNodeList ) {
            var idx, val;

            for ( idx in insNodeList ) {
                val = insNodeList[ idx ];

                if ( typeof val === 'string' ) arrChilds.push( document.createTextNode( val ) );
                else if ( val instanceof Element ) arrChilds.push( val );
                else return false;
            }

            return true;
        }

        /**
         * 當創建時調用。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func onCreate
         * @param {Function} onCreate
         */
        _createElement.prototype.onCreate = function ( fnOnCreate ) {
            this._onCreate = fnOnCreate;
        };

        var document = window.document;

        /**
         * 元素： 創建元素。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func elt
         * @return {Element}
         */
        _createElement.prototype.elt = function elt() {
            var item, key;
            var helAns = document.createElement( this._name );

            item = this._attrs;
            for ( key in item ) helAns.setAttribute( key, item[ key ] );

            item = this._dataset;
            if ( item ) for ( key in item ) helAns.dataset[ key ] = item[ key ];

            item = this._childs;
            if ( item.length ) for ( key in item ) helAns.appendChild( item[ key ] );

            return helAns;
        };
    }
    );


    /**
     * @memberof module:htf~
     * @namespace _tag
     */

    // var _tag;
    void function () {
        /**
         * 元素標籤： 取得元素標籤函式。
         *
         * @memberof module:htf~_tag.
         * @func _tag
         * @param {Object} markHel - 存放被標註的元素標籤的物件陣列。
         * @return {Function}
         */
        _tag = function _tag( objMarkHel ) {
            var fnT = t.bind( _initMarkHel( objMarkHel ) );
            fnT.singleTag = _tag.singleTag;
            fnT.nodeList = _tag.nodeList;
            return fnT;
        };

        /**
         * 創建單元素標籤。
         *
         * @memberof! module:htf~_tag.
         * @alias _tag.singleTag
         * @func  _tag.singleTag
         * @param {String} tagName - 元素標籤名。
         * @param {Object} [attr] - 元素標籤屬性。
         * @return {(String|Element)}
         */
        _tag.singleTag = function singleTag( strTagName, objAttr ) {
            var insTag = new _createElement( strTagName, true );
            if ( objAttr ) _setAttr( insTag, objAttr );
            return this( 'HYPERTEXT_setMarkHel', insTag );
        };

        /**
         * 節點清單： 創建
         * [`_createNodeList`]{@link module:htf~_docClass._createNodeList}
         * 類型的清單。
         *
         * @memberof! module:htf~_tag.
         * @alias _tag.nodeList
         * @func  _tag.nodeList
         * @param {...(String|Element)} childNode
         * @return {module:htf~_docClass._createNodeList}
         */
        _tag.nodeList = function nodeList() {
            var insNodeList = new _createNodeList( arguments );
            return this( 'HYPERTEXT_setMarkHel', insNodeList );
        };


        /**
         * 標籤： 創建元素標籤。
         *
         * @memberof module:htf~_tag~
         * @func t
         * @param {String} tagMark - 標籤與標記。
         * @param {Object} [attr] - 元素標籤屬性。
         * @param {Function} [onCreate] - 創建時事件。
         * @param {...Element} [subElt] - 子層元素標籤。
         * @return {(String|Element|module:htf~_docClass._createNodeList)}
         * 見 {@link module:htf~_docClass._setMarkHel|_docClass._setMarkHel} 。
         *
         * @example
         * t( 'div', { id: 'TxPostForm', onCreate: function () {
         *         console.log( this.id );
         *     } },
         *     t( 'form*postForm', { className: 'whatName', action: '/postPage', method: 'post', enctype: 'multipart/form-data' },
         *         t.nodeList(
         *             'First name',
         *             t( 'input', { type: 'text', name: 'fname' } ),
         *             t.singleTag( 'br' )
         *         ),
         *         t.nodeList(
         *             'Last name',
         *             t( 'input', { type: 'text', name: 'lname' } ),
         *             t.singleTag( 'br' )
         *         ),
         *         t( 'input', { type: 'submit', value: "Submit" } )
         *     ),
         *     t( 'div*tty', { dataset: { imHyperText: true, toMarkThisTag: 'tty' } },
         *         function () {
         *             this.className = 'TxTty';
         *         }
         *     )
         * );
         *
         * // HTML
         * // <div id="TxPostForm">
         * //     <form class="whatName" action="/postPage" method="post" enctype="multipart/form-data">
         * //         First name
         * //         <input type="text" name="fname" />
         * //         <br />
         * //         Last name
         * //         <input type="text" name="lname" />
         * //         <br />
         * //         <input type="submit" value="Submit" />
         * //     </form>
         * //     <div data-im-hyper-text="true" data-to-mark-this-tag="tty"></div>
         * // </div>"
         */
        function t( strTagMark ) {
            if ( strTagMark === 'HYPERTEXT_setMarkHel' )
                return _setMarkHel( this, arguments[ 1 ] );

            var anyAns;
            var splitName = strTagMark.split( '*' );
            var tagName = splitName[ 0 ];
            var markName = splitName[ 1 ] || null;
            var insMainElt = new _createElement( tagName );

            _handleTag( insMainElt, arguments );
            anyAns = _setMarkHel( this, insMainElt );

            if ( markName ) this[ markName ] = this.main;

            return anyAns;
        }

        /**
         * 標籤處理。
         *
         * @memberof module:htf~_tag~
         * @func _handleTag
         * @param {module:htf~_docClass._createElement} mainElt - 當前主要的創建元素。
         * @param {Array} args - 若子成員為 `null` 時將略過，其它允許值見
         * {@link module:htf~_docClass._createElement.appendChild|_docClass._createElement.appendChild}。
         */
        function _handleTag( insMainElt, objArgs ) {
            var idxArgs = 1;
            var argVal = objArgs[ 1 ];
            var lenArgs = objArgs.length;

            if ( argVal && argVal.constructor === Object ) {
                _setAttr( insMainElt, argVal );
                argVal = objArgs[ ++idxArgs ];
            }

            if ( typeof argVal === 'function' ) {
                insMainElt.onCreate( argVal );
                ++idxArgs;
            }

            while ( idxArgs < lenArgs ) {
                argVal = objArgs[ idxArgs++ ];

                if ( argVal != null ) insMainElt.appendChild( argVal );
            }
        }

        /**
         * 設定屬性。
         *
         * @memberof module:htf~_tag~
         * @func _setAttr
         * @param {module:htf~_docClass._createElement} mainElt - 當前主要的創建元素。
         * @param {Object} attr - 元素標籤屬性。
         */
        function _setAttr( insMainElt, objAttr ) {
            var key, val;
            for ( key in objAttr ) {
                val = objAttr[ key ];

                if ( val == null ) continue;
                switch ( key ) {
                    case 'id':        insMainElt.setAttribute( 'id', val ); break;
                    case 'className': insMainElt.setAttribute( 'class', val ); break;
                    case 'dataset':   insMainElt.dataset( val ); break;
                    case 'onCreate':  insMainElt.onCreate( val ); break;
                    default:          insMainElt.setAttribute( key, val );
                }
            }
        }
    }();

    /**
     * 元素標籤： 將爪哇腳本編寫的程式碼轉換成超文本標記標籤。
     *
     * @memberof module:htf.
     * @func tag
     * @param {Object} [markHel] - 存放被標註的元素標籤的物件陣列。
     * @param {Function} operate - 製成操作。
     * @return {(String|Element|module:htf~_docClass._createNodeList)}
     * 類似 {@link module:htf~_docClass._setMarkHel|_docClass._setMarkHel}
     * ，但當 `isPureText === true` 時一律為文字。
     */
    htf.tag = function tag( objMarkHel, fnOperate ) {
        if ( typeof objMarkHel === 'function' ) {
            fnOperate = objMarkHel;
            objMarkHel = {};
        }

        fnOperate( _tag( objMarkHel ) );
        return objMarkHel.main;
    };


    /**
     * @memberof module:htf~
     * @namespace _jcss
     */

    // var _jcss;
    void function () {
        var stopResolve = true;

        /**
         * 爪哇腳本樣式表： 將爪哇腳本編寫的程式碼轉換成樣式表格式。
         *
         * @memberof module:htf~_jcss.
         * @func _jcss
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
         * @return {String} 若樣式表格式不符則回傳 `''` 空文字。
         *
         * @example
         * _jcss( {
         *     'body': {
         *         margin: '0',
         *     },
         *
         *     '.TxDiv': {
         *         width: '100%',
         *         height: '100%',
         *
         *         '&_aLink': {
         *             display: 'block',
         *
         *             'body.esPc &': {
         *                 display: 'none',
         *             },
         *         },
         *     },
         * } );
         *
         * // CSS
         * // body {
         * //     margin: '0';
         * // }
         * // .TxDiv {
         * //     width: '100%';
         * //     height: '100%';
         * // }
         * // .TxDiv_aLink {
         * //     display: 'block';
         * // }
         * // body.esPc .TxDiv_aLink {
         * //     display: 'none';
         * // }
         */
        _jcss = function _jcss( objStylesheet ) {
            if ( !objStylesheet || objStylesheet.constructor !== Object ) return '';

            var key;
            var subStyleValue = '';
            var strAns = '';

            stopResolve = false;

            for ( key in objStylesheet ) {
                subStyleValue = _objectStylesheet( '', key, objStylesheet[ key ] );
                if ( stopResolve ) return '';
                strAns = _cssCombine( strAns, subStyleValue );
            }

            stopResolve = true;

            return strAns;
        };

        var _gapCharacter = isFormat ? '\n' : '';
        var _gapPart2 = isFormat ? '    ' : ' ';
        var _gapPart3 = ';' + _gapCharacter;
        var _gapPart4 = isFormat ? '}' : ' }';
        var _regexCommaGap = /, ?/g;

        /**
         * 物件陣列樣式表： 以迴圈式解析以物件陣列表達的巢狀樣式表。
         *
         * @memberof module:htf~_jcss~
         * @func _objectStylesheet
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的件陣列。
         * @return {String} 若樣式表格式不符則回傳空文字（`''`）。
         */
        function _objectStylesheet( strParentName, strName, objStylesheet ) {
            if ( !objStylesheet || objStylesheet.constructor !== Object ) {
                stopResolve = true;
                return '';
            }

            var key, val;
            var myName = _jcssSelector( strParentName, strName );
            var styleValue = '';
            var subStyleValue = '';
            var newSubStyleValue = '';

            for ( key in objStylesheet ) {
                val = objStylesheet[ key ];

                if ( typeof val === 'string' )
                    styleValue += _gapPart2 + _styleProp( key ) + ': ' + val + _gapPart3;
                else {
                    newSubStyleValue = _objectStylesheet( myName, key, val );
                    if ( stopResolve ) return '';
                    subStyleValue = _cssCombine( subStyleValue, newSubStyleValue );
                }
            }

            if ( styleValue ) {
                if ( _gapCharacter ) myName = myName.replace( _regexCommaGap, ',\n' );
                styleValue = myName + ' {' + _gapCharacter + styleValue + _gapPart4;
            }

            return _cssCombine( styleValue, subStyleValue );
        }

        /**
         * 樣式表結合。
         *
         * @memberof module:htf~_jcss~
         * @func _cssCombine
         * @param {String} prevSection - 上半部樣式表。
         * @param {String} nextSection - 下半部樣式表。
         * @return {String}
         */
        function _cssCombine( strPrevSection, strNextSection ){
            var gapWord = ( strPrevSection && strNextSection ) ? _gapCharacter : '';
            return strPrevSection + gapWord + strNextSection;
        }

        // 測試每次創建正規表示法和取用範圍鏈的速度比為 6 : 7
        // 取用範圍鏈略快些
        var _regexSymbol = /&/g;
        var _regexSublayer = />/g;
        var _regexWordySpace = /  +/g;
        var _regexSpaceOnSide = /(^ | $)/g;

        /**
         * 爪哇腳本樣式表選擇器： 將 `&` 字符替換成父層名和格式化。
         *
         * @memberof module:htf~_jcss~
         * @func _jcssSelector
         * @param {String} parentName - 父層名稱。
         * @param {String} name - 標籤名稱。
         * @return {String}
         */
        function _jcssSelector( strParentName, strName ) {
            var strAns = strName
                .replace( _regexSublayer, ' > ' )
                .replace( _regexWordySpace, ' ' ).replace( _regexSpaceOnSide, '' );

            return !strParentName
                ? strAns
                : _regexSymbol.test( strAns )
                ? strAns.replace( _regexSymbol, strParentName )
                : strParentName + ' ' + strAns;
        }

        var _regexUppercase = /([A-Z])/g;

        /**
         * 樣式屬性名稱： 將每個大寫字轉換成 橫槓（`-`） + 小寫。
         *
         * @memberof module:htf~_jcss~
         * @func _styleProp
         * @param {String} prop - 屬性名稱。
         * @return {String}
         */
        function _styleProp( strProp ) {
            return _regexUppercase.test( strProp )
                ? strProp.replace( _regexUppercase, '-$1' ).toLowerCase()
                : strProp;
        }
    }();

    /**
     * 樣式元素標籤： 將爪哇腳本編寫的程式碼轉換成樣式表，並輸出樣式元素標籤。
     *
     * @memberof module:htf.
     * @func tagStyle
     * @param {(Object|Function)} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
     * @return {(String|Element)}
     */
    htf.tagStyle = function jcss( anyStylesheet ) {
        var helStyle;
        var objStylesheet;

        switch ( typeof anyStylesheet ) {
            case 'object': objStylesheet = anyStylesheet; break;
            case 'function':
                anyStylesheet( function jcss( objCallbackStylesheet ) {
                    objStylesheet = objCallbackStylesheet;
                } );
                break;
        }

        helStyle = new _createElement( 'style' );
        helStyle.appendChild( _jcss( objStylesheet ) );
        return helStyle.elt();
    };

    return htf;
} );

