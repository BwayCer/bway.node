/*! HyperText Manager (PureText) @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 超文本管理員（文字模式） HyperText Manager (PureText Mode)
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */


order( [
    '/pure/log',
], function ( log ) {
    "use strict";

    log.setMsg( {
        htf_canNotCreateEltTag: 'Can\'t create element tag.',
    } );


    /**
     * 超文本管理員（文字模式）
     *
     * @module htm
     */

    /**
     * @memberof module:htf~
     * @var {Boolean} isFormat - 是否格式化。 開發者除錯使用。
     */
    var _isFormat = false;

    var _jspiScope = function () {
        var idx = 0;
        var len = arguments.length - 1;
        var pushArgs = new Array( len );

        while ( idx < len ) pushArgs[ idx ] = arguments[ idx++ ];
        return arguments[ idx ].apply( null, pushArgs );
    };


    /**
     * @memberof module:htm~
     * @module _docClass
     */

    var _initMarkHel, _setMarkHel;
    var _createElement, _createNodeList;
    // mark, replace

    void function () {
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
                    strElt = _setMarkHel_getNodeList( insMain );
                    if ( strElt == null ) break;

                    objMarkHel.main = strElt;
                    return insMain;
            }

            objMarkHel.main = null;
            throw Error( log.err( 21, 'htf_canNotCreateEltTag' ) );
        };

        var _gapCharacter = _isFormat ? '\n' : '';

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

        function _setMarkHel_getNodeList( insNodeList ) {
            var idx, val;
            var strElt = '';

            for ( idx in insNodeList ) {
                val = insNodeList[ idx ];

                if ( typeof val !== 'string' ) return null;
                strElt += val;
            }

            return strElt;
        }

        /**
         * 創建元素： 見 {@link module:htm~_docClass._createElement} 。
         *
         * @memberof module:htm~_docClass._createElement.
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
         * 設定屬性： 見 {@link module:htm~_docClass._createElement#setAttribute} 。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func setAttribute_pureText
         */
        _createElement.prototype.setAttribute = function ( strKey, strVal ) {
            if ( strKey === 'id' ) this._id = strVal;
            this._attrs += ' ' + strKey + '="' + strVal + '"';
        };

        var _regexUppercase = /([A-Z])/g;

        /**
         * 設定元素資料： 見 {@link module:htm~_docClass._createElement#dataset} 。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func dataset_pureText
         */
        _createElement.prototype.dataset = function ( objData ) {
            var key, val;
            var dataset = '';

            for ( key in objData ) {
                val = objData[ key ];
                dataset += ' data-'
                    + key.replace( _regexUppercase, '-$1' ).toLowerCase()
                    + '="' + ( typeof val === 'string' ? val : val.toString() ) + '"';
            }

            this._dataset = dataset;
        };

        var _regexStartPoint = /^/gm;
        var _increaseIndent = _isFormat
            ? function ( strChild ) { return strChild.replace( _regexStartPoint, '    ' ) + '\n'; }
            : function ( strChild ) { return strChild; };

        /**
         * 增加子元素： 見 {@link module:htm~_docClass._createElement#appendChild} 。
         *
         * @memberof module:htm~_docClass._createElement#
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

        var _clearWordySpaceScript = _isFormat
            ? function ( fnOnCreate ) { return fnOnCreate.toString(); }
            : function ( fnOnCreate ) {
                return fnOnCreate.toString().replace( _regexWordySpace, ' ' );
            };

        /**
         * 當創建時調用： 見 {@link module:htm~_docClass._createElement#onCreate} 。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func onCreate_pureText
         */
        _createElement.prototype.onCreate = function ( fnOnCreate ) {
            this._onCreate = _clearWordySpaceScript( fnOnCreate );
        };

        /**
         * 創建元素： 見 {@link module:htm~_docClass._createElement#elt} 。
         *
         * @memberof module:htm~_docClass._createElement#
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


        /**
         * 創建節點清單： 見 {@link module:htm~_docClass._createElement#_createNodeList} 。
         *
         * @memberof module:htm~_docClass.
         * @class _createNodeList_pureText
         */
        _createNodeList = function _createNodeList( arrArgs ) {
            var val;
            var len = arrArgs.length;

            while ( len-- ) {
                val = arrArgs[ len ];
                if ( val != null ) this[ len ] = val;
            }
        };
    }();


    /**
     * 超文本預告
     *
     * @module htf
     */

    var _tag, _tagStyle, _jelt, _jcss;

    void function () {
        /**
         * 初始化標記標籤。
         * <br>
         * <br>
         * markHel 規範：<br>
         * * 純文本模式：<br>
         * <pre>
         * ```
         * { main: 放於身體段落的文字,
         *   head: 放於頭部段落的文字,
         *   script: 用於設定元素標籤之腳本
         *   tagIds: 對元素標籤標記識別碼的亂數清單 }
         * ```
         * </pre>
         * * 超文本模式：<br>
         * <pre>
         * ```
         * { main: 主要輸出元素標籤（最後執行的）,
         *   ...key: 追蹤之元素標籤 }
         * ```
         * </pre>
         *
         * @abstract
         * @memberof module:htm~_docClass.
         * @func _initMarkHel
         * @param {Object} markHel
         * @return {Object} 初始化的標記標籤
         */

        /**
         * 設定標記標籤： 依 `純文本`、`超文本` 模式需求使用不同的設定方式。
         *
         * @abstract
         * @memberof module:htm~_docClass.
         * @func _setMarkHel
         * @param {Object} markHel
         * @param {(module:htm~_docClass._createElement|module:htm~_docClass._createNodeList)} main
         * @throws {Error} 創建元素失敗。 (21, htf_canNotCreateEltTag)
         * @return {module:htm~_docClass._createNodeList} 當 `main instanceof _createNodeList` 時。
         * @return {String} 純文本模式。
         * @return {Element} 超文本模式。
         */


        /**
         * 創建元素： 若為超文本模式時使用 `document.createElement` 所創建的元素標籤，
         *
         * @abstract
         * @memberof module:htm~_docClass.
         * @class _createElement
         * @param {String} name - 元素名稱。
         * @param {Boolean} [isSingle] - 是否為單標籤。（文字模式需求）
         */

        /**
         * 設定屬性。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func setAttribute
         * @param {String} key
         * @param {String} val
         */

        /**
         * 設定元素資料： 設定元素專用的 `dataset`。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func dataset
         * @param {Object} data - 鍵值對清單（值類型為文字）。
         */

        /**
         * 增加子元素。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func appendChild
         * @param {(String|Element|module:htm~_docClass._createNodeList)} child
         * @throws {TypeError} 參數值類型不符合期待。 (21, _typeError)
         */

        /**
         * 當創建時調用。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func onCreate
         * @param {Function} onCreate
         */

        /**
         * 元素： 創建元素。
         *
         * @memberof module:htm~_docClass._createElement#
         * @func elt
         * @return {String} 純文本模式。
         * @return {Element} 超文本模式。
         */


        /**
         * 創建節點清單： 以 `Object` 仿 `Array` 方式創建，與 `NodeList` 不同。
         *
         * @memberof module:htm~_docClass.
         * @class _createNodeList
         * @param {Array} args - 若子成員為 `undefined` 或 `null` 時將忽略。
         */



        /**
         * 爪哇腳本元素： 取得元素標籤函式。
         *
         * @memberof module:htf.
         * @func _jelt
         * @param {Object} markHel - 存放被標註的元素標籤的物件陣列。
         * @return {Function}
         */
        _jelt = function _jelt( objMarkHel ) {
            var fnT = t.bind( _initMarkHel( objMarkHel ) );
            fnT.singleTag = _jelt.singleTag;
            fnT.nodeList = _jelt.nodeList;
            return fnT;
        };

        /**
         * 創建單元素標籤。
         *
         * @memberof! module:htf.
         * @alias _jelt.singleTag
         * @func  _jelt.singleTag
         * @param {String} tagName - 元素標籤名。
         * @param {Object} [attr] - 元素標籤屬性。
         * @return {(String|Element)}
         */
        _jelt.singleTag = function singleTag( strTagName, objAttr ) {
            var insTag = new _createElement( strTagName, true );
            if ( objAttr ) _setAttr( insTag, objAttr );
            return this( 'HYPERTEXT_setMarkHel', insTag );
        };

        /**
         * 節點清單： 創建
         * {@link module:htm~_docClass._createNodeList|_docClass._createNodeList}
         * 類型的清單。
         *
         * @memberof! module:htf.
         * @alias _jelt.nodeList
         * @func  _jelt.nodeList
         * @param {...(String|Element)} childNode
         * @return {module:htm~_docClass._createNodeList}
         */
        _jelt.nodeList = function nodeList() {
            var insNodeList = new _createNodeList( arguments );
            return this( 'HYPERTEXT_setMarkHel', insNodeList );
        };


        /**
         * 標籤： 創建元素標籤。
         *
         * @memberof! module:htf.
         * @alias _jelt~t
         * @func  _jelt~t
         * @param {String} tagMark - 標籤與標記。
         * @param {Object} [attr] - 元素標籤屬性。
         * @param {Function} [onCreate] - 創建時事件。
         * @param {...Element} [subElt] - 子層元素標籤。
         * @return {(String|Element|module:htm~_docClass._createNodeList)}
         * 見 {@link module:htm~_docClass._setMarkHel|_docClass._setMarkHel} 。
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
         * @memberof! module:htf.
         * @alias _jelt~_handleTag
         * @func  _jelt~_handleTag
         * @param {module:htm~_docClass._createElement} mainElt - 當前主要的創建元素。
         * @param {Array} args - 若子成員為 `null` 時將略過，其它允許值見
         * {@link module:htm~_docClass._createElement.appendChild|_docClass._createElement.appendChild}。
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
         * @memberof! module:htf.
         * @alias _jelt~_setAttr
         * @func  _jelt~_setAttr
         * @param {module:htm~_docClass._createElement} mainElt - 當前主要的創建元素。
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


        /**
         * 元素標籤： `純文本`、`超文本` 模式都維持相同使用方式。
         * 將爪哇腳本轉換成超文本標記標籤。
         *
         * @memberof module:htf.
         * @func tag
         * @param {Object} [markHel] - 存放被標註的元素標籤的物件陣列。
         * @param {Function} operate - 製成操作。
         * @return {String} 純文本模式。
         * @return {(Element|module:htm~_docClass._createNodeList)} 超文本模式，類似
         * {@link module:htm~_docClass._setMarkHel|_docClass._setMarkHel} 。
         */
        _tag = function tag( objMarkHel, fnOperate ) {
            if ( typeof objMarkHel === 'function' ) {
                fnOperate = objMarkHel;
                objMarkHel = {};
            }

            fnOperate( _jelt( objMarkHel ) );
            return objMarkHel.main;
        };


        var stopResolve = true;

        /**
         * 爪哇腳本樣式表： 將爪哇腳本編寫的程式碼轉換成樣式表格式。
         *
         * @memberof module:htf.
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

        /**
         * 物件陣列樣式表： 以迴圈式解析以物件陣列表達的巢狀樣式表。
         *
         * @memberof! module:htf.
         * @alias _jcss~_objectStylesheet
         * @func  _jcss~_objectStylesheet
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的件陣列。
         * @return {String} 若樣式表格式不符則回傳空文字（`''`）。
         */
        var _objectStylesheet = _jspiScope(
            _isFormat ? '    ' : ' ',
            ';' + _gapCharacter,
            isFormat ? '}' : ' }',
            /, ?/g,
            function ( _gapPart2, _gapPart3, _gapPart4, _regexCommaGap ) {
                return function ( strParentName, strName, objStylesheet ) {
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
                };
            }
        );

        /**
         * 樣式表結合。
         *
         * @memberof! module:htf.
         * @alias _jcss~_cssCombine
         * @func  _jcss~_cssCombine
         * @param {String} prevSection - 上半部樣式表。
         * @param {String} nextSection - 下半部樣式表。
         * @return {String}
         */
        function _cssCombine( strPrevSection, strNextSection ){
            var gapWord = ( strPrevSection && strNextSection ) ? _gapCharacter : '';
            return strPrevSection + gapWord + strNextSection;
        }

        /**
         * 爪哇腳本樣式表選擇器： 將 `&` 字符替換成父層名和格式化。
         *
         * @memberof! module:htf.
         * @alias _jcss~_jcssSelector
         * @func  _jcss~_jcssSelector
         * @param {String} parentName - 父層名稱。
         * @param {String} name - 標籤名稱。
         * @return {String}
         */
        var _jcssSelector = _jspiScope(
            // 測試每次創建正規表示法和取用範圍鏈的速度比為 6 : 7
            // 取用範圍鏈略快些
            /&/g, />/g, /  +/g, /(^ | $)/g,
            function ( _regexSymbol, _regexSublayer, _regexWordySpace, _regexSpaceOnSide ) {
                return function ( strParentName, strName ) {
                    var strAns = strName
                        .replace( _regexSublayer, ' > ' )
                        .replace( _regexWordySpace, ' ' ).replace( _regexSpaceOnSide, '' );

                    return !strParentName
                        ? strAns
                        : _regexSymbol.test( strAns )
                        ? strAns.replace( _regexSymbol, strParentName )
                        : strParentName + ' ' + strAns;
                };
            }
        );

        var _regexUppercase = /([A-Z])/g;

        /**
         * 樣式屬性名稱： 將每個大寫字轉換成 橫槓（`-`） + 小寫。
         *
         * @memberof! module:htf.
         * @alias _jcss~_styleProp
         * @func  _jcss~_styleProp
         * @param {String} prop - 屬性名稱。
         * @return {String}
         */
        function _styleProp( strProp ) {
            return _regexUppercase.test( strProp )
                ? strProp.replace( _regexUppercase, '-$1' ).toLowerCase()
                : strProp;
        }

        /**
         * 樣式元素標籤： `純文本`、`超文本` 模式都維持相同使用方式。
         * 將爪哇腳本轉換成樣式表，並輸出超文本標記標籤。
         *
         * @memberof module:htf.
         * @func tagStyle
         * @param {(Object|Function)} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
         * @return {String} 純文本模式。
         * @return {Element} 超文本模式。
         */
        _tagStyle = function tagStyle( anyStylesheet ) {
            var helStyle;
            var objStylesheet;

            switch ( typeof anyStylesheet ) {
                case 'object': objStylesheet = anyStylesheet; break;
                case 'function':
                    anyStylesheet( function tagStyle( objCallbackStylesheet ) {
                        objStylesheet = objCallbackStylesheet;
                    } );
                    break;
            }

            helStyle = new _createElement( 'style' );
            helStyle.appendChild( _jcss( objStylesheet ) );
            return helStyle.elt();
        };
    }();


    /**
     * @example
     * html( {} )
     *     .head
     *         .title()
     *         .meta( {} )
     *         .meta( {} )
     *     .body( {} )
     *         .noscript( '' )
     *         .comment( '' )
     *         .txt( '' )
     *         .singleTag( '[[uuu]]', {} )
     *         .tag( '', {}, '' )
     * ;
     *
     * txtHtml( title, txtHead, txtBody );
     *
     * html()
     *     .head
     *         .title()
     *         .meta( {} )
     *         .comment( '' )
     *         .txt( '' )
     *         .tag( '', {}, '' )
     *         .singleTag( '', {} )
     * .mth();
     */


    // share
    var _share_increaseIndent = _isFormat
        ? function ( strSpace, strChild ) { return strChild.replace( /(.+)/gm, strSpace + '$1' ) + '\n'; }
        : function ( strSpace, strChild ) { return strChild; };

    // docClass
    var htf_tag, htf_tagStyle;

    void function () {
    }();


    // HTML Layout
    var htmLayout;

    void function () {
        var _increaseIndent = _share_increaseIndent;

        var _gapCharacter = _isFormat ? '\n' : '';
        var _gapPartA = _gapCharacter ? '    ' : '';
        var _gapPartB = _gapPartA + _gapPartA;

        var _wrapProcedure = 0;
        var _isHasTitle = false;
        var _isHasHeadChild = false;
        var _isHasBodyChild = false;
        var _txtHtml = '';

        htmLayout = function htmLayout( objAttr ) {
            _wrapProcedure = 1;
            _isHasTitle = false;
            _isHasHeadChild = false;
            _isHasBodyChild = false;

            _txtHtml = '<html' + _parseAttr( objAttr ) + '>';
            return htmLayout;
        };

        htmLayout.head = head;

        function mth() {
            if ( _wrapProcedure < 3 ) body();

            var fnAns = Function( 'param',
                'return `' + _txtHtml
                + _gapCharacter + _gapPartA + '</body>'
                + _gapCharacter + '</html>`;'
            );

            fnAns._isHasTitle = _isHasTitle;
            fnAns._isHasHeadChild = _isHasHeadChild;
            fnAns._isHasBodyChild = _isHasBodyChild;

            _wrapProcedure = 0;
            _isHasTitle = false;
            _isHasHeadChild = false;
            _isHasBodyChild = false;
            _txtHtml = '';

            return fnAns;
        }

        function head() {
            if ( _wrapProcedure > 1 ) throw Error( '重複調用頭元素標記。' );
            if ( _wrapProcedure < 1 ) htmLayout();

            _wrapProcedure = 2;
            _txtHtml += _gapCharacter + _gapPartB + '<head>';
            return head;
        }

        head.mth = mth;
        head.body = body;
        head.child = childHead;
        head.title = title;
        head.tag = tag;
        head.singleTag = singleTag;
        head.meta = meta;
        head.txt = txt;
        head.comment = comment;

        function body( objAttr ) {
            if ( _wrapProcedure > 2 ) throw Error( '重複調用身元素標記。' );
            if ( _wrapProcedure < 2 ) head();

            _wrapProcedure = 3;
            _txtHtml += _gapCharacter + _gapPartA + '</head>'
                + _gapCharacter + _gapPartA + '<body' + _parseAttr( objAttr ) + '>';

            return body;
        }

        body.mth = mth;
        body.child = childBody;
        body.tag = tag;
        body.singleTag = singleTag;
        body.txt = txt;
        body.comment = comment;

        function childHead() {
            if ( _isHasHeadChild ) throw Error( '重複調用子元素標記。' );

            _parseWrapProcedure( this );

            _isHasHeadChild = true;
            _txtHtml += _gapCharacter + '${ param.HTMLAYOUT_HeadChild || "" }';
            return this;
        }

        function childBody() {
            if ( _isHasBodyChild ) throw Error( '重複調用子元素標記。' );

            _parseWrapProcedure( this );

            _isHasBodyChild = true;
            _txtHtml += _gapCharacter + '${ param.HTMLAYOUT_BodyChild || "" }';
            return this;
        }

        function title() {
            if ( _isHasTitle ) throw Error( '重複調用標題元素標記。' );

            _parseWrapProcedure( this );

            _isHasTitle = true;
            _txtHtml += _gapCharacter + _gapPartB
                + '<title>${ param.HTMLAYOUT_Title || "" }</title>';

            return head;
        }

        function tag( strTagName, objAttr, strChild ) {
            _parseWrapProcedure( this );

            var txt = _gapCharacter;

            txt += _gapPartB + '<' + strTagName + _parseAttr( objAttr ) + '>';

            if ( strChild ) {
                strChild = _matchKeyWord( _increaseIndent( '            ', strChild ) );
                txt += _gapCharacter + strChild;
            }

            txt += _gapPartB + '</' + strTagName + '>';
            _txtHtml += txt;

            return this;
        }

        function singleTag( strTagName, objAttr ) {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapPartB
                + '<' + strTagName + _parseAttr( objAttr ) + ' />';

            return this;
        }

        function meta( objAttr ) {
            return this.singleTag( 'meta', objAttr );
        }

        function txt( strVal ) {
            _parseWrapProcedure( this );

            if ( !strVal ) return this;

            _txtHtml += _gapCharacter + _gapCharacter
                + _matchKeyWord( _increaseIndent( '        ', strVal ) );

            return this;
        }

        function comment( strVal ) {
            _parseWrapProcedure( this );

            if ( !strVal ) return this;

            _txtHtml += _gapCharacter + _gapPartB + '<!--';
                + _gapCharacter
                + _matchKeyWord( _increaseIndent( '            ', strVal ) )
                + _gapPartB + ' -->';

            return this;
        }

        function _parseWrapProcedure( fnSelf ) {
            switch ( fnSelf ) {
                case head:
                    if ( _wrapProcedure < 2 ) fnSelf();
                    break;
                case body:
                    if ( _wrapProcedure < 3 ) fnSelf();
                    break;
            }
        }

        function _parseAttr( objAttr ) {
            if ( !objAttr ) return '';

            var key;
            var txtAttr = '';

            for ( key in objAttr )
                txtAttr += ' ' + key + '="' + _matchKeyWord( objAttr[ key ] ) + '"';

            return txtAttr;
        }

        var _regexKeyWord = /\{\{([$_0-9A-Za-z]+)\}\}/g;

        function _matchKeyWord( strVal ) {
            return _regexKeyWord.test( strVal )
                ? strVal.replace( _regexKeyWord, '${ param.$1 || "" }' )
                : strVal;
        }
    }();

    // htmLayout.tag = htf.tag;
    // htmLayout.tagStyle = htf.tagStyle;

    // htmLayout.html = htf.tagStyle;
} );

