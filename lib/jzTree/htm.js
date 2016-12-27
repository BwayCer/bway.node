/**
 * 超文本管理員 HyperText Manager
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link http://bwaycer.github.io}
 */


/*! jzTree/htm - BwayCer CC-BY-4.0 @license: bwaycer.github.io/license/CC-BY-4.0 */

define( 'jzTree/htm', [ 'jzTree/log' ], function ( log ) {
    "use strict";

    /**
     * 超文本管理員
     * @module htm
     */

    log.setMsg( {
    } );

    var _transClone = Array.transClone;
    var _qSplice = Array.prototype.qSplice;

    var _tag, _jcss;
    var _initMarkHel, _setMarkHel;
    var _createElement, _createTextNode, _createNodeList;

    function htm( strViewName, fnOperate ) {}

    /**
     * 設定文件物件。
     * <br>
     * 必須實現之物件：
     * `initMarkHel`、`setMarkHel`、
     * `createElement`、`createTextNode`、`createNodeList`。
     *
     * @memberof module:htm.
     * @func setDocument
     * @param {Object} document
     */
    htm.setDocClass = function setDocument( objDocument ) {
        var key, val;
        for ( key in objDocument ) {
            val = objDocument[ key ];
            switch ( key ) {
                case 'initMarkHel': _initMarkHel = val; break;
                case 'setMarkHel': _setMarkHel = val; break;
                case 'createElement': _createElement = val; break;
                case 'createTextNode': _createTextNode = val; break;
                case 'createNodeList': _createNodeList = val; break;
            }
        }
    };


    /**
     * @memberof module:htm~
     * @namespace _docClass
     */

    // var _initMarkHel, _setMarkHel;
    // var _createElement, _createTextNode, _createNodeList;
    void function () {
        var _initMarkHel, _setMarkHel;
        var _createElement, _createTextNode, _createNodeList;

        var isSeverEnv = typeof global != 'undefined';
        var _createEltMethod;

        // var _initMarkHel, _setMarkHel;
        void function () {
            /**
             * 初始化標記標籤： 只用於維持物件陣列成員的順序。
             * <br>
             * <br>
             * markHel 規範：
             * <br>
             * * 若 `isSeverEnv === true`：
             * <br>
             * <pre>
             * ```
             * { head: 放於頭部段落的文字,
             *   main: 放於身體段落的文字,
             *   script: 用於設定元素標籤之程式碼 }
             * ```
             * </pre>
             * * 若 `isSeverEnv === false`：
             * <br>
             * <pre>
             * ```
             * { main: 主要輸出元素標籤（最後執行的）,
             *   ...key: 追蹤之元素標籤 }
             * ```
             * </pre>
             *
             * @memberof module:htm~_docClass~
             * @func _initMarkHel
             * @param {Object} markHel
             */
            _initMarkHel = isSeverEnv
                ? function ( objMarkHel ) {
                    objMarkHel.head = objMarkHel.head || '';
                    objMarkHel.main = objMarkHel.main || '';
                    objMarkHel.script = objMarkHel.script || '';
                    objMarkHel.tagIDs = objMarkHel.tagIDs || [];
                }
                : function ( objMarkHel ) {
                    objMarkHel.main = objMarkHel.main || null;
                }
            ;


            /**
             * 設定標記標籤： 依 `isSeverEnv` 環境需求使用不同的設定方式。
             *
             * @memberof module:htm~_docClass~
             * @func _setMarkHel
             * @param {Object} markHel
             * @param {(_createElement|_createNodeList)} main
             * @return {?(String|Element|_createNodeList)}
             * 若 `main === _createNodeList` 則為 `_createNodeList`；
             * <br>
             * 若 `isSeverEnv === true` 則為 `String`；
             * 反之則為 `Element`。
             */
            _setMarkHel = function _setMarkHel( objMarkHel, anyMain ) {
                var anyMain = _createEltMethod( objMarkHel, anyMain );

                if ( anyMain == null ) log.assert( true, '_setMarkHel 錯誤', constructorOfChild );
                return anyMain;
            };
        }();

        // var _createElement;
        void function () {
            var _createElement_appendChild, _createElement_getChild;
            var regexUppercase;

            /**
             * 創建元素：
             * <br>
             * 若 `document` 存在，則使用 `document.createElement` 創建元素標籤，
             * 反之使用文字模式。
             *
             * @memberof module:htm~_docClass~
             * @class _createElement
             * @param {String} name
             * @return {_createElement}
             */
            _createElement = function createElement( strName ) {
                this._name = strName;
                this._id = null;
                this._attrs = null;
                this._dataset = null;
                this._childs = null;
                this._onCreate = null;
            };

            _createElement.extend( {
                /**
                 * @memberof module:htm~_docClass~_createElement.
                 * @func setAttribute
                 * @param {String} key
                 * @param {String} val
                 */
                setAttribute: function setAttribute( strKey, strVal ) {
                    if ( !this._attrs ) this._attrs = {};
                    if ( strKey === 'id' ) this._id = strVal;
                    this._attrs[ strKey ] = strVal;
                },

                /**
                 * @memberof module:htm~_docClass~_createElement.
                 * @func dataset
                 * @param {Object} data
                 */
                dataset: function dataset( objData ) {
                    var objDataset = this._dataset || {};
                    for ( key in objData ) objDataset[ key ] = objData[ key ];
                    this._dataset = objDataset;
                },

                /**
                 * @memberof module:htm~_docClass~_createElement.
                 * @func appendChild
                 * @param {*} child
                 */
                appendChild: function appendChild( anyChild ) {
                    var idx;

                    if ( !this._childs ) this._childs = [];

                    if ( anyChild.constructor === _createNodeList )
                        for ( idx in anyChild ) this._childs.push( anyChild[ idx ] );
                    else
                        this._childs.push( anyChild );
                },

                /**
                 * 當創建時： 儲存創建事件。
                 * @memberof module:htm~_docClass~_createElement.
                 * @func onCreate
                 * @param {Function} onCreate
                 */
                onCreate: function onCreate( fnOnCreate ) {
                    this._onCreate = fnOnCreate;
                },
            } );

            /**
             * 創建元素_添加子元素。
             *
             * @memberof module:htm~_docClass~_createElement~
             * @func _createElement_appendChild
             * @param {*} child - 其允許類型見
               創建元素_添加子元素_方法
             * [SeverEnv]{@link module:htm~_docClass~_createElement~_createElement_getChild_ofSeverEnv}
             * 、 [No SeverEnv]{@link module:htm~_docClass~_createElement~_createElement_getChild_ofNoSeverEnv}
             * @return {(String|Element)} 依 `isSeverEnv` 環境需求會有 `String`、`Element` 兩種類型。
             * @throws {Error} 子元素類型錯誤。
             */
            _createElement_appendChild = function ( anyChild ) {
                var anyAns = _createElement_getChild( anyChild );

                if ( anyAns == null ) log.throw( '_arguTypeErr' );
                return anyAns;
            };

            if ( isSeverEnv ) {
                regexUppercase = /([A-Z])/g;

                /**
                 * 元素： 創建元素。
                 *
                 * @memberof module:htm~_docClass~_createElement.
                 * @alias elt_ofSeverEnv
                 * @return {String}
                 */
                _createElement.prototype.elt = function elt() {
                    var item, key;
                    var anyChild, constructorOfChild;
                    // var isHasFnOnCreate = !!this._onCreate;
                    var strAns = '';
                    strAns += '<' + this._name;

                    item = this._attrs;
                    if ( !!item ) for ( key in item ) strAns += ' ' + key + '="' + item[ key ] + '"';

                    item = this._dataset;
                    if ( !!item ) for ( key in item ) {
                        strAns += ' data-' + key.replace( regexUppercase, '-$1' ).toLocaleLowerCase();
                        strAns += '="' + item[ key ] + '"';
                    }

                    strAns += '>';

                    item = this._childs;
                    if ( !!item ) for ( key in item ) strAns += _createElement_appendChild( item[ key ] );

                    strAns += '</' + this._name + '>';

                    return strAns;
                };

                /**
                 * 創建元素_添加子元素_方法： 創建元素的私有添加子元素函式的方法。
                 *
                 * @memberof module:htm~_docClass~_createElement~
                 * @alias _createElement_getChild_ofSeverEnv
                 * @param {String} child
                 * @return {?String}
                 */
                _createElement_getChild = function ( anyChild ) {
                    var typeOfChild = typeof anyChild;
                    var anyAns;

                    if ( typeOfChild === 'string' ) anyAns = anyChild;
                    else anyAns = null;

                    return anyAns;
                };
            } else {
                /**
                 * 元素： 創建元素。
                 *
                 * @memberof module:htm~_docClass~_createElement.
                 * @alias elt_ofNoSeverEnv
                 * @return {Element}
                 */
                _createElement.prototype.elt = function elt() {
                    var item, key;
                    var helAns = document.createElement( this._name );

                    item = this._attrs;
                    if ( !!item ) for ( key in item ) helAns.setAttribute( key, item[ key ] );

                    item = this._dataset;
                    if ( !!item ) for ( key in item ) helAns.dataset[ key ] = item[ key ];

                    item = this._childs;
                    if ( !!item ) for ( key in item ) helAns.appendChild( _createElement_appendChild( item[ key ] ) );

                    // item = this._onCreate;
                    // if ( !!item ) this._onCreate.call( helAns );

                    return helAns;
                };

                /**
                 * 創建元素_添加子元素_方法： 創建元素的私有添加子元素函式的方法。
                 *
                 * @memberof module:htm~_docClass~_createElement~
                 * @alias _createElement_getChild_ofNoSeverEnv
                 * @param {(String|Element)} child
                 * @return {Boolean} 是否成功添加子元素。
                 */
                _createElement_getChild = function ( anyChild ) {
                    var typeOfChild = typeof anyChild;
                    var anyAns;

                    if ( typeOfChild === 'string' ) anyAns = document.createTextNode( anyChild );
                    else if ( anyChild instanceof Element ) anyAns = anyChild;
                    else anyAns = null;

                    return anyAns;
                };
            }
        }();

        // var _createEltMethod;
        // var _createTextNode, _createNodeList;
        void function () {
            var regexWordySpace = /\s+/g;

            _createEltMethod = isSeverEnv
                /**
                 * 創建元素之方式。
                 *
                 * @memberof module:htm~_docClass~
                 * @alias _createEltMethod_ofSeverEnv
                 * @param {Object} markHel
                 * @param {(_createElement|_createNodeList)} main
                 * @return {?(String|_createNodeList)}
                 */
                ? function _createEltMethod( objMarkHel, anyMain ) {
                    var constructorOfMain = anyMain.constructor;
                    var strID;
                    var idx, val;
                    var anyAns;

                    if ( constructorOfMain === _createElement ) {
                        if ( anyMain._onCreate != null ) {
                            if ( anyMain.id != null ) strID = anyMain.id;
                            else {
                                strID = 'TxR' + Math.random().toString().substr( -7 );
                                anyMain.setAttribute( 'id', strID );
                            }

                            objMarkHel.tagIDs.push( strID );
                            objMarkHel.script += ' void function () {'
                                +  anyMain._onCreate.toString().replace( regexWordySpace, ' ' )
                                + '( document.getElementById( "' + strID + '" ) ); }()';
                        }

                        anyAns = objMarkHel.main = anyMain.elt();
                        return anyAns;
                    } else if ( constructorOfMain === _createNodeList ) {
                        anyAns = '';
                        for ( idx in anyMain ) {
                            val = anyMain[ idx ];
                            if ( typeof val !== 'string' ) return null;
                            anyAns += val;
                        }

                        objMarkHel.main = anyAns;
                        return anyMain;
                    }

                    return null;
                }
                /**
                 * 創建元素之方式。
                 *
                 * @memberof module:htm~_docClass~
                 * @alias _createEltMethod_ofNoSeverEnv
                 * @param {Object} markHel
                 * @param {_createElement} main
                 * @return {Element}
                 */
                : function _createEltMethod( objMarkHel, anyMain ) {
                    var constructorOfMain = anyMain.constructor;
                    var anyAns;


                    if ( constructorOfMain === _createElement ) {
                        anyAns = objMarkHel.main = anyMain.elt();
                        if ( anyMain._onCreate != null ) anyMain._onCreate.call( anyAns );
                        return anyAns;
                    } else if ( constructorOfMain === _createNodeList ) {
                        objMarkHel.main = anyMain;
                        return anyMain;
                    }

                    return null;
                }
            ;


            /**
             * 創建文字元素：
             * <br>
             * 若 `document` 存在，則使用 `document.createTextNode` 創建文字元素。
             * 反之使用文字模式。
             *
             * @memberof module:htm~_docClass~
             * @class _createTextNode
             * @param {String} text
             * @return {_createTextNode}
             */
            _createTextNode = function createTextNode( strText ) {
                this._txt = strText;
            };

            _createTextNode.prototype.elt = isSeverEnv
                /**
                 * 元素： 創建元素。
                 *
                 * @memberof module:htm~_docClass~_createTextNode.
                 * @func elt_ofSeverEnv
                 * @return {String}
                 */
                ? function elt() {
                    return this._txt;
                }
                /**
                 * 元素： 創建元素。
                 *
                 * @memberof module:htm~_docClass~_createTextNode.
                 * @alias elt_ofNoSeverEnv
                 * @return {Element}
                 */
                : function elt() {
                    return document.createTextNode( this._txt );
                }
            ;


            /**
             * 創建節點清單： 以 `Object` 仿 `Array` 方式創建，與 `NodeList` 不同。
             *
             * @memberof module:htm~_docClass~
             * @class _createNodeList
             * @param {Array} args - 若子成員為 `undefined` 或 `null` 時將忽略。
             */
            _createNodeList = function _createNodeList( arrArgs ) {
                var p, len, val;
                for ( p = 0, len = arrArgs.length; p < len ; p++ ) {
                    val = arrArgs[ p ];
                    if ( val != null ) this[ p ] = val;
                }
            };
        }();

        htm.setDocClass( {
            initMarkHel: _initMarkHel,
            setMarkHel: _setMarkHel,
            createElement: _createElement,
            createTextNode: _createTextNode,
            createNodeList: _createNodeList,
        } );
    }();


    /**
     * @memberof module:htm~
     * @namespace _tag
     */

    // var _tag;
    void function () {
        /**
         * 元素標籤： 取得元素標籤函式。
         *
         * @memberof module:htm~_tag.
         * @func _tag
         * @param {Object} markHel - 存放被標註的元素標籤物件陣列。
         * 見 [_tag.selfT}]{@link module:htm~_tag.selfT}。
         * @return {Function}
         *
         * @example
         * var markHel = {};
         * _tag( markHel, function ( t ) {
         *     t( 'div', { id: 'LxPostForm' },
         *         t( 'form*postForm', { action: '/postPage', method: 'post', enctype: 'multipart/form-data', _oneCreate: function () {
         *                 this.id = 'tagID';
         *             } },
         *             t.NodeList(
         *                 'First name',
         *                 t( 'input', { type: 'text', name: 'fname' } ),
         *                 t.easyTag( 'br' )
         *             ),
         *             t.NodeList(
         *                 'Last name',
         *                 t( 'input', { type: 'text', name: 'lname' } ),
         *                 t.easyTag( 'br' )
         *             )
         *         ),
         *         t( 'div*tty', function () {
         *             this.className = 'classNamee';
         *         } ),
         *         t( 'div*tty', { 'data-jz': 'jz' } )
         *     );
         * } );
         *
         * // HTML
         * // <div id="LxPostForm">
         * //     <form action="demo_post_enctype.asp" method="post" enctype="multipart/form-data">
         * //         First name: <input type="text" name="fname"><br>
         * //         Last name: <input type="text" name="lname"><br>
         * //         <input type="submit" value="Submit">
         * //     </form>
         * //     <div data-jz="jz"></div>
         * // </div>
         */
        _tag = function _tag( objMarkHel ) {
            var key;
            var objHangFunc = _tag.hangFunc;
            var objInsTag = new _tag.selfT( objMarkHel );
            var fnT = objInsTag.t.bind( objInsTag );
            for ( key in objHangFunc ) fnT[ key ] = objHangFunc[ key ];
            return fnT;
        };

        _tag.hangFunc = {
            /**
             * 簡易創建元素標籤： 創建元素標籤。
             *
             * @memberof! module:htm~_tag.
             * @alias _tag.hangFunc.easyTag
             * @param {String} tagName
             * @return {module:htm~_docClass~_setMarkHel} 依 `isSeverEnv` 環境需求會有 `String`、`Element` 兩種類型。
             */
            easyTag: function easyTag( strTagName ) {
                var helTag = new _createElement( strTagName );
                return this( 'setMarkHelMain', helTag );
            },

            /**
             * 節點清單： 創建 `_createNodeList` 類型的清單。
             *
             * @memberof! module:htm~_tag.
             * @alias _tag.hangFunc.NodeList
             * @param {...(String|Element)} childNode
             * @return {module:htm~_createNodeList}
             */
            NodeList: function NodeList() {
                var objNodeList = new _createNodeList( _transClone( arguments ) );
                return this( 'setMarkHelMain', objNodeList );
            },
        };

        /**
         * 自身作用域： 創建標籤作用域，將綁定於 [標籤函式]{@link module:htm~_tag._tag.selfT.t}。
         *
         * @memberof module:htm~_tag.
         * @class selfT
         * @param {Object} markHel 存放被標註的元素標籤物件陣列。
         */
        _tag.selfT = function selfT( objMarkHel ) {
            _initMarkHel( objMarkHel );
            this.markHel = objMarkHel;
        };

        /**
         * 標籤： 創建元素標籤。
         *
         * @memberof module:htm~_tag.selfT.
         * @func t
         * @param {String} description - 描述標籤名稱及紀錄名稱。
         * @param {?(Object|Function)} [choB] - 設定元素標籤屬性。
         * @param {...Element} [choC] - 子層元素標籤。
         * @return {module:htm~_docClass~_setMarkHel} 依 `isSeverEnv` 環境需求會有 `String`、`Element` 兩種類型。
         */
        _tag.selfT.prototype.t = function t( strDescription ) {
            var objMain;
            var idxMark, isHasMark, tagName, markName;
            var postArgs, arg1, idxArgs, typeOfArg1;

            if ( strDescription === 'setMarkHelMain' ) {
                objMain = arguments[ 1 ];
                return _setMarkHel( this.markHel, objMain );
            }

            idxMark = strDescription.indexOf( '*' );
            isHasMark = idxMark !== -1;
            tagName = isHasMark ? strDescription.substring( 0, idxMark ) : strDescription;
            markName = ( isHasMark && idxMark + 1 < strDescription.length )
                ? strDescription.substring( idxMark + 1 ) : null;

            arg1 = arguments[ 1 ];
            idxArgs = 2;
            typeOfArg1 = ( arg1 == null ) ? null : typeof arg1;

            objMain = new _createElement( tagName );
            if ( markName ) this.markHel[ markName ] = objMain;

            if ( typeOfArg1 === 'function' ) _setAttr( objMain, { onCreate: arg1 } );
            else if ( typeOfArg1 === 'object' ) _setAttr( objMain, arg1 );
            else if ( typeOfArg1 != null ) idxArgs--;

            postArgs = _qSplice.call( arguments, idxArgs );
            _appendChild( objMain, postArgs );

            return _setMarkHel( this.markHel, objMain );
        };

        /**
         * 設定屬性。
         *
         * @memberof module:htm~_tag~
         * @func _setAttr
         * @param {Object} main - 虛擬元素標籤 `new _createElement`。
         * @param {Object} attr
         */
        function _setAttr( objMain, objAttr ) {
            var key, val;
            for ( key in objAttr ) {
                val = objAttr[ key ];

                if ( val == null ) continue;
                switch ( key ) {
                    case 'id': objMain.setAttribute( 'id', val ); break;
                    case 'className': objMain.setAttribute( 'class', val ); break;
                    case 'dataset': objMain.dataset( val ); break;
                    case 'onCreate': objMain.onCreate( val ); break;
                    default: objMain.setAttribute( key, val );
                }
            }
        }

        /**
         * 增加子層。
         *
         * @memberof module:htm~_tag~
         * @func _appendChild
         * @param {Object} main - 虛擬元素標籤 `new _createElement`。
         * @param {Array} childNodes - 若子成員為 `null` 時將略過，其它允許值見
         * [_createElement.appendChild]{@link module:htm~_docClass~_createElement.appendChild}。
         */
        function _appendChild( objMain, arrChildNodes ) {
            var item;
            var idx = 0;
            var lenOfChildNodes = arrChildNodes.length;

            while ( idx < lenOfChildNodes ) {
                item = arrChildNodes[ idx++ ];

                if ( item == null ) continue;
                else objMain.appendChild( item );
            }
        }
    }();

    /**
     * 元素標籤： 將爪哇腳本編寫的程式碼轉換成樣式表，並輸出樣式元素標籤。
     *
     * @memberof module:htm.
     * @func tag
     * @param {(Object|Function)} ChoA
     * * `Object`： 存放被標註的元素標籤物件陣列。
     * <br>
     * * `function`： 同第二項參數。
     * @param {Function} [operate] - 製成操作。
     * @return {module:htm~_docClass~_setMarkHel} 依 `isSeverEnv` 環境需求會有 `String`、`Element` 兩種類型。
     */
    htm.tag = function tag( anyChoA, fnOperate ) {
        var objMarkHel;

        switch ( typeof anyChoA ) {
            case 'object': objMarkHel = anyChoA; break;
            case 'function':
                objMarkHel = {};
                fnOperate = anyChoA;
                break;
        }

        fnOperate( _tag( objMarkHel ) );
        return objMarkHel.main;
    };


    /**
     * @memberof module:htm~
     * @namespace _jcss
     */

    // var _jcss;
    void function () {
        /**
         * @memberof module:htm~_jcss~
         * @var {Boolean} isFormat - 是否格式化。 給開發者除錯使用。
         */
        var isFormat = false;
        var stopResolve = true;
        var styleProp_uppercase = /([A-Z])/g;

        /**
         * 爪哇腳本樣式表： 將爪哇腳本編寫的程式碼轉換成樣式表格式。
         *
         * @memberof module:htm~_jcss.
         * @func _jcss
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
         * @return {String} 若樣式表格式不符則回傳空文字（`''`）。
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
         * //     margin: '0',
         * // }
         * // .TxDiv {
         * //     width: '100%',
         * //     height: '100%',
         * // }
         * // .TxDiv_aLink {
         * //     display: 'block',
         * // }
         * // body.esPc .TxDiv_aLink {
         * //     display: 'none',
         * // }
         */
        _jcss = function _jcss( objStylesheet ) {
            if ( objStylesheet == null || objStylesheet.constructor !== Object ) return '';

            var key, val;
            var parentName;
            var styleValue_child = '';
            var strAns = '';

            stopResolve = false;

            for ( key in objStylesheet ) {
                if ( stopResolve ) break;

                val = objStylesheet[ key ];
                parentName = [];

                if ( val == null || val.constructor !== Object ) {
                    stopResolve = true;
                    break;
                } else {
                    styleValue_child = _objectStylesheet( parentName, key, val );
                    strAns = _cssCombine( strAns, styleValue_child );
                }
            }

            if ( stopResolve ) strAns = '';
            else stopResolve = true;

            return strAns;
        };

        /**
         * 物件陣列樣式表： 以迴圈式解析以物件陣列表達的巢狀樣式表。
         *
         * @memberof module:htm~_jcss~
         * @func _objectStylesheet
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @param {Object} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的件陣列。
         * @return {String} 若樣式表格式不符則回傳空文字（`''`）。
         */
        function _objectStylesheet( arrParentName, strName, objStylesheet ) {
            if ( stopResolve
                 || objStylesheet == null
                 || objStylesheet.constructor !== Object ) return '';

            var key, val;
            var styleValue = {};
            var styleValue_child = '';
            var strAns = '';

            arrParentName.push( strName );

            for ( key in objStylesheet ) {
                if ( stopResolve ) break;

                val = objStylesheet[ key ];

                if ( typeof val == 'string' ) styleValue[ key ] = val;
                else if ( val != null && val.constructor === Object )
                    styleValue_child = _cssCombine( styleValue_child, _objectStylesheet( arrParentName, key, val ) );
                else {
                    stopResolve = true;
                    break;
                }
            }

            arrParentName.pop();

            if ( stopResolve ) return '';
            else {
                strAns = ( Object.keys( styleValue ).length > 0 )? _cssExpression( arrParentName, strName, styleValue ) : '';
                strAns = _cssCombine( strAns, styleValue_child );
                return strAns;
            }
        }

        /**
         * 樣式表結合： 結合並排版。
         *
         * @memberof module:htm~_jcss~
         * @func _cssCombine
         * @param {String} prevSection - 上半部樣式表。
         * @param {String} nextSection - 下半部樣式表。
         * @return {String}
         */
        function _cssCombine( strPrevSection, strNextSection ){
            var strAns;
            var breakWord = isFormat ? '\n' : ' ';

            if ( !!strPrevSection === false && !!strNextSection === false ) strAns = '';
            else if ( !!strNextSection === false ) strAns = strPrevSection;
            else if ( !!strPrevSection === false ) strAns = strNextSection;
            else strAns = strPrevSection + breakWord + strNextSection;

            return strAns;
        }

        /**
         * 樣式表表達式： 樣式表排版。
         *
         * @memberof module:htm~_jcss~
         * @func _cssExpression
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @param {Object} value - 樣式表屬性鍵和值。
         * @return {String}
         */
        function _cssExpression( arrParentName, strName, objValue ){
            var key;
            var strQueryName = _jcssSelector( arrParentName, strName );
            var breakWord = isFormat ? '\n' : '';
            var indent = isFormat ? '    ' : ' ';
            var strAns = '';

            if ( isFormat ) strQueryName = strQueryName.replace( /,/g, ',' + breakWord );
            strAns += strQueryName + ' {' + breakWord;
            for ( key in objValue ) strAns += indent + _styleProp( key ) + ': ' + objValue[ key ] + ';' + breakWord;
            strAns += isFormat ? '}' : ' }';

            return strAns;
        }

        /**
         * 爪哇腳本樣式表選擇器： 與父層名組合，並將 `&` 字符替換成父親名。
         *
         * @memberof module:htm~_jcss~
         * @func _jcssSelector
         * @param {Array} parentName - 父層標籤名稱。
         * @param {String} name - 標籤名稱。
         * @return {String}
         */
        function _jcssSelector( arrParentName, strName ){
            var val;
            var regexSymbol = /&/g;
            var p = 0;
            var len = arrParentName.length;
            var strAns = '';

            while ( p <= len ) {
                val = arrParentName[ p++ ] || strName;

                if( regexSymbol.test( val ) ) strAns = val.replace( regexSymbol, strAns );
                else strAns += ' ' + val;
            }

            strAns = strAns.replace( /(>)/g, ' $1 ' ).replace( /^ +/, '' ).replace( /  +/g, ' ' );
            return strAns;
        }

        /**
         * 樣式屬性名稱： 將名稱轉小寫，並把原大寫前面加橫槓（`-`）。
         *
         * @memberof module:htm~_jcss~
         * @func _styleProp
         * @param {String} prop - 屬性名稱。
         * @return {String}
         */
        function _styleProp( strProp ) {
            var strAns;
            if( styleProp_uppercase.test( strProp ) )
                strAns = strProp.replace( styleProp_uppercase, '-$1' ).toLocaleLowerCase();
            else strAns = strProp;
            return strAns;
        }
    }();

    /**
     * 樣式元素標籤： 將爪哇腳本編寫的程式碼轉換成樣式表，並輸出樣式元素標籤。
     *
     * @memberof module:htm.
     * @func tagStyle
     * @param {(Object|Function)} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
     * @return {module:htm~_docClass~_setMarkHel} 依 `isSeverEnv` 環境需求會有 `String`、`Element` 兩種類型。
     */
    htm.tagStyle = function jcss( anyStylesheet ) {
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

    return htm;
} );

