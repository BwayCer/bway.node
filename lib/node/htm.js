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
        htm_canNotCreateEltTag: 'Can\'t create element tag.',
        htm_doubleCall: '"%s" function is called double.',
    } );


    /**
     * 超文本管理員（文字模式）
     *
     * @module htm
     */

    /**
     * @memberof module:htm~
     * @var {Boolean} _isFormat - 是否格式化。 開發者除錯使用。
     */
    var _isFormat = false;

    var _jspiScope = function () {
        var idx = 0;
        var len = arguments.length - 1;
        var pushArgs = new Array( len );

        while ( idx < len ) pushArgs[ idx ] = arguments[ idx++ ];
        return arguments[ idx ].apply( null, pushArgs );
    };

    var _regexStartPoint = /^/gm;
    var _share_increaseIndent = _isFormat
        ? function ( strSpace, strChild ) {
            return strChild.replace( _regexStartPoint, strSpace ) + '\n';
        }
        : function ( strSpace, strChild ) { return strChild; };

    var _share_getRandom = function () {
        return Math.random().toString().substr( -7 );
    };


    /**
     * 仿文件類物件
     *
     * @module _docClass
     */

    var _initMarkHel, _setMarkHel;
    var _createElement, _createNodeList, _createPositioning;

    void function () {
        var _increaseIndent = _share_increaseIndent;
        var _getRandom = _share_getRandom;


        var _gapCharacter = _isFormat ? '\n' : '';


        /**
         * 初始化標記標籤： 見 {@link module:_docClass._initMarkHel} 。
         *
         * @memberof module:_docClass.
         * @func _initMarkHel_pureText
         */
        _initMarkHel = function ( objMarkHel ) {
            objMarkHel.head = objMarkHel.head || '';
            objMarkHel.main = objMarkHel.main || '';
            objMarkHel.script = objMarkHel.script || '';

            return objMarkHel;
        };

        /**
         * 設定標記標籤： 見 {@link module:_docClass._setMarkHel} 。
         *
         * @memberof module:_docClass.
         * @func _setMarkHel_pureText
         */
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
                case _createPositioning:
                    strElt = objMarkHel.main = insMain.point;
                    return strElt;
            }

            objMarkHel.main = null;
            throw Error( log.err( 21, 'htm_canNotCreateEltTag' ) );
        };

        function _setMarkHel_onCreateBindElt( objMarkHel, insElement ) {
            var strId = insElement._id;
            var txtScript = '(' + insElement._onCreate + ').call';

            if ( !strId )  {
                strId = 'HTMxR' + _getRandom();
                insElement.setAttribute( 'id', strId );

                txtScript = '(function ( hel ) {' + _gapCharacter
                    + 'hel.removeAttribute( "id" );' + _gapCharacter
                    + txtScript + '( hel );' + _gapCharacter + '})';
            }

            objMarkHel.script += txtScript
                + '( document.getElementById( "' + strId + '" ) );' + _gapCharacter;
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
         * 創建元素： 見 {@link module:_docClass._createElement} 。
         *
         * @memberof module:_docClass._createElement.
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
         * 設定屬性： 見 {@link module:_docClass._createElement#setAttribute} 。
         *
         * @memberof module:_docClass._createElement#
         * @func setAttribute_pureText
         */
        _createElement.prototype.setAttribute = function ( strKey, strVal ) {
            if ( strKey === 'id' ) this._id = strVal;
            this._attrs += ' ' + strKey + '="' + strVal + '"';
        };

        var _regexUppercase = /([A-Z])/g;

        /**
         * 設定元素資料： 見 {@link module:_docClass._createElement#dataset} 。
         *
         * @memberof module:_docClass._createElement#
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

        /**
         * 增加子元素： 見 {@link module:_docClass._createElement#appendChild} 。
         *
         * @memberof module:_docClass._createElement#
         * @func appendChild_pureText
         */
        _createElement.prototype.appendChild = function ( anyChild ) {
            var idx, val, txtChild;

            switch ( anyChild.constructor ) {
                case String:
                    txtChild = _increaseIndent( '    ', anyChild );
                    break;
                case _createNodeList:
                    txtChild = '';

                    for ( idx in anyChild ) {
                        val = anyChild[ idx ];

                        if ( typeof val !== 'string' ) {
                            txtChild = null;
                            break;
                        }

                        txtChild += _increaseIndent( '    ', val );
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
         * 當創建時調用： 見 {@link module:_docClass._createElement#onCreate} 。
         *
         * @memberof module:_docClass._createElement#
         * @func onCreate_pureText
         */
        _createElement.prototype.onCreate = function ( fnOnCreate ) {
            this._onCreate = _clearWordySpaceScript( fnOnCreate );
        };

        /**
         * 創建元素： 見 {@link module:_docClass._createElement#elt} 。
         *
         * @memberof module:_docClass._createElement#
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
         * 創建節點清單： 見 {@link module:_docClass._createNodeList} 。
         *
         * @memberof module:_docClass._createNodeList#
         * @func _createNodeList_pureText
         */
        _createNodeList = function createNodeList( arrArgs ) {
            var val;
            var len = arrArgs.length;

            while ( len-- ) {
                val = arrArgs[ len ];
                if ( val != null ) this[ len ] = val;
            }
        };

        /**
         * 定位點的正規表示式：
         * `/^(?:([SN]{2})_)?([$_0-9A-Za-z]+)$/` 。
         * <br>
         * 前三位符 `SN_` 的搭配組合是用以決定格式化下換行符的使用方式，`N` 換行，`S` 不變。
         *
         * @memberof module:_docClass._createPositioning~
         * @var {RegExp} _regexPositioning_pureText
         */
        var _regexPositioning = /^(?:([SN]{2})_)?([$_0-9A-Za-z]+)$/;

        /**
         * 創建定位點： 見 {@link module:_docClass._createPositioning} 。
         *
         * @memberof module:_docClass._createPositioning#
         * @func _createPositioning_pureText
         */
        _createPositioning = function createPositioning( strName, preCobj ) {
            var matchName = strName.match( _regexPositioning );

            if ( !matchName ) throw Error( log.err( 21, 'Can\'t to positioning.' ) );

            var strAns = '${ param.' + matchName[ 2 ] + ' || "' + ( preCobj || '' ) + '" }';

            switch ( matchName[ 1 ] ) {
                case 'NN': strAns = _gapCharacter + strAns + _gapCharacter; break;
                case 'NS': strAns = _gapCharacter + strAns; break;
                case 'SN': strAns += _gapCharacter; break;
            }

            this.point = strAns;
        };

        /**
         * 替換： 見 {@link module:_docClass._createPositioning#replace} 。
         *
         * @memberof module:_docClass._createPositioning#
         * @func replace_pureText
         */
        _createPositioning.prototype.replace = function replace() {};
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
         *   script: 用於設定元素標籤之腳本 }
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
         * @memberof module:_docClass.
         * @func _initMarkHel
         * @param {Object} markHel
         * @return {Object} 初始化的標記標籤
         */

        /**
         * 設定標記標籤： 依 `純文本`、`超文本` 模式需求使用不同的設定方式。
         *
         * @abstract
         * @memberof module:_docClass.
         * @func _setMarkHel
         * @param {Object} markHel
         * @param {(module:_docClass._createElement|module:_docClass._createNodeList)} main
         * @throws {Error} 創建元素失敗。 (21, htm_canNotCreateEltTag)
         * @return {module:_docClass._createNodeList} 當 `main instanceof _createNodeList` 時。
         * @return {String} 純文本模式。
         * @return {Element} 超文本模式。
         */


        /**
         * 創建元素： 若為超文本模式時使用 `document.createElement` 所創建的元素標籤，
         *
         * @abstract
         * @memberof module:_docClass.
         * @class _createElement
         * @param {String} name - 元素名稱。
         * @param {Boolean} [isSingle] - 是否為單標籤。（文字模式需求）
         */

        /**
         * 設定屬性。
         *
         * @memberof module:_docClass._createElement#
         * @func setAttribute
         * @param {String} key
         * @param {String} val
         */

        /**
         * 設定元素資料： 設定元素專用的 `dataset`。
         *
         * @memberof module:_docClass._createElement#
         * @func dataset
         * @param {Object} data - 鍵值對清單（值類型為文字）。
         */

        /**
         * 增加子元素。
         *
         * @memberof module:_docClass._createElement#
         * @func appendChild
         * @param {(String|Element|module:_docClass._createNodeList)} child
         * @throws {TypeError} 參數值類型不符合期待。 (21, _typeError)
         */

        /**
         * 當創建時調用。
         *
         * @memberof module:_docClass._createElement#
         * @func onCreate
         * @param {Function} onCreate
         */

        /**
         * 元素： 創建元素。
         *
         * @memberof module:_docClass._createElement#
         * @func elt
         * @return {String} 純文本模式。
         * @return {Element} 超文本模式。
         */


        /**
         * 創建節點清單： 以 `Object` 仿 `Array` 方式創建，與 `NodeList` 不同。
         *
         * @memberof module:_docClass.
         * @class _createNodeList
         * @param {Array} args - 若子成員為 `undefined` 或 `null` 時將忽略。
         */


        /**
         * 創建定位點： 給以事後能替換的標記。
         *
         * @memberof module:_docClass.
         * @class _createPositioning
         * @param {String} name - 標記點命名。
         * @param {(String|Element)} preCobj - 預設物件。
         * 純文本模式為 `String`； 超文本模式為 `Element`。
         */

        /**
         * 替換： 純文本模式此功能為空函式，主要用於在超文本時簡化其替換的操作。
         *
         * @memberof module:_docClass._createPositioning#
         * @func replace
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
            fnT.loop = _jelt.loop;
            fnT.nodeList = _jelt.nodeList;
            fnT.pos = _jelt.positioning;
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
            return _setMarkHel( this( 'HYPERTEXT_getMarkHel' ), insTag );
        };

        // tagFor
        /**
         * 循環： 對數組或物件陣列依次讀取方式來創建元素標籤。
         * <br>
         * 本函式採用 `for( key in target )` 的循環方式，若提供物件陣列不予保證執行順序。
         * <br>
         * 本函式有限定 `this` 物件為 {@link module:htf._jelt|htf._jelt}
         * 所產生的物件，請勿分離使用。
         *
         * @memberof! module:htf.
         * @alias _jelt.loop
         * @func  _jelt.loop
         * @param {(Array|Object)} list - 循環清單。
         * @param {Function} operate - 製成操作。 可接收到 `( t, val, key, list )` 的參數。
         * @return {(String|Element)}
         */
        _jelt.loop = function loop( anyList, fnOperate ) {
            var key, insNodeList;
            var markHel = this( 'HYPERTEXT_getMarkHel' );
            var tagList = [];

            for ( key in anyList ) {
                fnOperate( this, anyList[ key ], key, anyList );
                tagList.push( markHel.main );
            }

            return _setMarkHel( markHel, new _createNodeList( tagList ) );
        };

        /**
         * 節點清單： 創建
         * {@link module:_docClass._createNodeList|_docClass._createNodeList}
         * 類型的清單。
         *
         * @memberof! module:htf.
         * @alias _jelt.nodeList
         * @func  _jelt.nodeList
         * @param {...(String|Element)} childNode
         * @return {module:_docClass._createNodeList}
         */
        _jelt.nodeList = function nodeList() {
            var insNodeList = new _createNodeList( arguments );
            return _setMarkHel( this( 'HYPERTEXT_getMarkHel' ), insNodeList );
        };

        /**
         * 節點清單： 創建
         * {@link module:_docClass._createNodeList|_docClass._createNodeList}
         * 類型的清單。
         *
         * @memberof! module:htf.
         * @alias _jelt.positioning
         * @func  _jelt.positioning
         * @param {String} name - 標記點命名。
         * @param {(String|Element)} preCobj - 預設物件。
         * @return {module:_docClass._createNodeList}
         */
        _jelt.positioning = function positioning( strName, anyPreCobj ) {
            var insPos = new _createPositioning( strName, anyPreCobj );
            return _setMarkHel( this( 'HYPERTEXT_getMarkHel' ), insPos );
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
         * @return {(String|Element|module:_docClass._createNodeList)}
         * 見 {@link module:_docClass._setMarkHel|_docClass._setMarkHel} 。
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
            if ( strTagMark === 'HYPERTEXT_getMarkHel' ) return this;

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
         * @param {module:_docClass._createElement} mainElt - 當前主要的創建元素。
         * @param {Array} args - 若子成員為 `null` 時將略過，其它允許值見
         * {@link module:_docClass._createElement.appendChild|_docClass._createElement.appendChild}。
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
         * @param {module:_docClass._createElement} mainElt - 當前主要的創建元素。
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
         * @func _tag
         * @param {Object} [markHel] - 存放被標註的元素標籤的物件陣列。
         * @param {Function} operate - 製成操作。
         * @return {String} 純文本模式。
         * @return {(Element|module:_docClass._createNodeList)} 超文本模式，類似
         * {@link module:_docClass._setMarkHel|_docClass._setMarkHel} 。
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

        var _gapCharacter = _isFormat ? '\n' : '';

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
            _isFormat ? '}' : ' }',
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
         * @func _tagStyle
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


    // createItem

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




    // HTML Layout
    var htmLayout;

    void function () {
        var _increaseIndent = _share_increaseIndent;
        var _getRandom = _share_getRandom;

        var _gapCharacter = _isFormat ? '\n' : '';
        var _gapPartA = _gapCharacter ? '    ' : '';
        var _gapPartB = _gapPartA + _gapPartA;

        var _wrapProcedure = 0;
        var _markHel = null;
        var _endScript = null;
        var _txtHtml = '';


        function resetSetting() {
            _wrapProcedure = 0;
            _markHel = null;
            _endScript = null;
            _txtHtml = '';
        }

        /**
         * 超文本規劃。
         * <br>
         * <br>
         * 必須執行到 {@link module:htm.mth} 才算完成。
         *
         * @memberof module:htm.
         * @func htmLayout
         * @param {String} [docType] - 自訂文件類型。
         * @param {Object} [attr] - 元素標籤屬性。
         * @return {module:htm.htmLayout}
         */
        htmLayout = function htmLayout( strDocType, objAttr ) {
            _wrapProcedure = 1;

            if ( arguments.length <= 1 ) {
                objAttr = strDocType;
                strDocType = '<!DOCTYPE html>';
            }

            _markHel = {};
            _endScript = null;
            _txtHtml = strDocType + _gapCharacter + '<html' + _parseAttr( objAttr ) + '>';
            return htmLayout;
        };

        htmLayout.head = head;

        /**
         * 本文超： 結尾函式。
         *
         * @memberof module:htm.
         * @func mth
         * @return {Function} 超文本規劃書，函式有 `title`, `param`
         * 兩參數，並帶有 `markHel` 物件成員。
         */
        function mth() {
            if ( _wrapProcedure < 3 ) body();
            if ( _endScript == null ) endScript();

            var fnAns = Function( 'title', 'param = {}',
                'param.HTMLAYOUT_Title = title;'
                + 'return `' + _txtHtml
                + _gapCharacter + _endScript
                + _gapCharacter + _gapPartA + '</body>'
                + _gapCharacter + '</html>`;'
            );

            fnAns.markHel = _markHel;

            resetSetting();
            return fnAns;
        }

        /**
         * 文件頭部。
         *
         * @memberof module:htm.
         * @func head
         * @throws {Error} 重複調用函式。 (21, htm_doubleCall)
         * @return {module:htm.head}
         */
        function head() {
            if ( _wrapProcedure > 1 ) {
                resetSetting();
                throw Error( log.err( 21, 'htm_doubleCall', 'head' ) );
            }
            if ( _wrapProcedure < 1 ) htmLayout();

            _wrapProcedure = 2;
            _txtHtml += _gapCharacter + _gapPartA + '<head>';
            return head;
        }

        head.mth = mth;
        head.body = body;
        head.child = child;
        head.title = title;
        head.meta = meta;

        head.tag = layoutTag;
        head.singleTag = layoutSingleTag;
        head.txt = layoutTxt;
        head.comment = comment;

        /**
         * 文件身體。
         *
         * @memberof module:htm.
         * @func body
         * @param {Object} [attr] - 元素標籤屬性。
         * @throws {Error} 重複調用函式。 (21, htm_doubleCall)
         * @return {module:htm.body}
         */
        function body( objAttr ) {
            if ( _wrapProcedure > 2 ) {
                resetSetting();
                throw Error( log.err( 21, 'htm_doubleCall', 'body' ) );
            }
            if ( _wrapProcedure < 2 ) head();

            _wrapProcedure = 3;
            _txtHtml += _gapCharacter + _gapPartA + '</head>'
                + _gapCharacter + _gapPartA + '<body' + _parseAttr( objAttr ) + '>';

            return body;
        }

        body.mth = mth;
        body.child = child;
        body.endScript = endScript;

        body.tag = layoutTag;
        body.singleTag = layoutSingleTag;
        body.txt = layoutTxt;
        body.comment = comment;

        /**
         * 子元素。
         *
         * @memberof module:htm.
         * @func child
         * @param {Function} tagOperate - 標籤操作。
         * 見 {@link module:htf._tag|htf._tag} 。
         * @return {(module:htm.head|module:htm.body)} 視當時的 `this` 而定。
         */
        function child( fnTagOpt ) {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapCharacter
                + _increaseIndent( '        ', _tag( _markHel, fnTagOpt ) );
            return this;
        }

        /**
         * 標題。
         *
         * @memberof module:htm.
         * @func title
         * @return {module:htm.head}
         */
        function title() {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapPartB
                + '<title>${ param.HTMLAYOUT_Title || "" }</title>';

            return head;
        }

        /**
         * 元素標籤： 快速布局使用，功能侷限。
         *
         * @memberof module:htm.
         * @func layoutTag
         * @param {String} tagName - 元素標籤名。
         * @param {Object} [attr] - 元素標籤屬性。
         * @param {String} child - 子元素。
         * @return {(module:htm.head|module:htm.body)} 視當時的 `this` 而定。
         */
        function layoutTag( strTagName, objAttr, strChild ) {
            _parseWrapProcedure( this );

            var txt = _gapCharacter;

            txt += _gapPartB + '<' + strTagName + _parseAttr( objAttr ) + '>';

            if ( strChild ) {
                txt += _gapCharacter
                    + _matchpositioning( _increaseIndent( '            ', strChild ) );
            }

            txt += _gapPartB + '</' + strTagName + '>';
            _txtHtml += txt;

            return this;
        }

        /**
         * 單元素標籤： 快速布局使用，功能侷限。
         *
         * @memberof module:htm.
         * @func layoutSingleTag
         * @param {String} tagName - 元素標籤名。
         * @param {Object} [attr] - 元素標籤屬性。
         * @return {(module:htm.head|module:htm.body)} 視當時的 `this` 而定。
         */
        function layoutSingleTag( strTagName, objAttr ) {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapPartB
                + '<' + strTagName + _parseAttr( objAttr ) + ' />';

            return this;
        }

        /**
         * 元數據標籤： 為 {@link module:htm.layoutSingleTag} 的擴充。
         *
         * @memberof module:htm.
         * @func meta
         * @param {String} tagName - 元素標籤名。
         * @param {Object} [attr] - 元素標籤屬性。
         * @return {module:htm.head}
         */
        function meta( objAttr ) {
            return this.singleTag( 'meta', objAttr );
        }

        /**
         * 自訂超文本。
         *
         * @memberof module:htm.
         * @func layoutTxt
         * @param {String} val - 自訂值。
         * @return {(module:htm.head|module:htm.body)} 視當時的 `this` 而定。
         */
        function layoutTxt( strVal ) {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapCharacter
                + _matchPositioning( _increaseIndent( '        ', strVal ) );

            return this;
        }

        /**
         * 註解。
         *
         * @memberof module:htm.
         * @func comment
         * @param {String} val - 自訂值。
         * @return {(module:htm.head|module:htm.body)} 視當時的 `this` 而定。
         */
        function comment( strVal ) {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapPartB + '<!--';
                + _gapCharacter
                + _matchPositioning( _increaseIndent( '            ', strVal ) )
                + _gapPartB + ' -->';

            return this;
        }

        /**
         * 結尾腳本： 文件末的腳本。
         * 注意！ 此腳本標籤最後將被移除。
         *
         * @memberof module:htm.
         * @func endScript
         * @param {Functin} [script] - 欲執行函式。
         * @return {module:htm.body}
         */
        function endScript( fnScript ) {
            _parseWrapProcedure( this );

            var currentScript = '';
            var noteScript = _markHel.script;

            _endScript = '';

            var tagId = 'HTMxEndxR' + _getRandom();
            var insScript = new _createElement( 'script' );

            insScript.setAttribute( 'id', tagId );

            if ( fnScript ) {
                insScript.onCreate( fnScript );
                currentScript = '(' + insScript._onCreate + ')();' + _gapCharacter;
            }

            insScript.appendChild(
                noteScript + currentScript
                + '${ ( param.endScript || "" ) && "(" + param.endScript.toString() + ")();" }'
                + _gapCharacter
                + 'document.getElementById( "' + tagId + '" ).remove();'
            );

            _endScript = _gapCharacter + _increaseIndent( '        ', insScript.elt() );

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
                txtAttr += ' ' + key + '="' + _matchPositioning( objAttr[ key ] ) + '"';

            return txtAttr;
        }

        var _regexPositioning = /\{\{(?:([SN]{2})_)?([$_0-9A-Za-z]+)\}\}/g;

        function _matchPositioning( strVal ) {
            return strVal.replace( _regexPositioning, function () {
                var strAns = '${ param.' + arguments[ 2 ] + ' || "" }';

                switch ( arguments[ 1 ] ) {
                    case 'NN': strAns = _gapCharacter + strAns + _gapCharacter; break;
                    case 'NS': strAns = _gapCharacter + strAns; break;
                    case 'SN': strAns += _gapCharacter; break;
                }

                return strAns;
            } );
        }
    }();

    // htmLayout.tag = htf.tag;
    // htmLayout.tagStyle = htf.tagStyle;

    // htmLayout.html = htf.tagStyle;
} );

