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

    /**
     * 超文本管理員
     * @module htm
     */

    log.setMsg( {
        htf_canNotCreateEltTag: 'Can\'t create element tag.',
    } );

    var _emptyEnum = support.emptyEnum;
    var _arraySlice = Array.prototype.slice;

    /**
     * @memberof module:htf~
     * @var {Boolean} isFormat - 是否格式化。 開發者除錯使用。
     */
    var isFormat = false;

    /**
     * @memberof module:htf~
     * @var {Boolean} isPureText - 是否純文本。 設定之後不再修改。
     */
    var isPureText = typeof global !== 'undefined';

    var _tag, _jcss;
    var _initMarkHel, _setMarkHel;
    var _createElement, _createNodeList;

    function htm( strViewName, fnOperate ) {}


    /**
     * @memberof module:htf~
     * @namespace _docClass
     */

    // var _initMarkHel, _setMarkHel;
    // var _createElement, _createNodeList;
    void function () {
        arguments[ isPureText ? 0 : 1 ]();
        arguments[ 2 ]();
    }(
    function pureText() {
        _initMarkHel = function ( objMarkHel ) {
            objMarkHel.head = objMarkHel.head || '';
            objMarkHel.main = objMarkHel.main || '';
            objMarkHel.script = objMarkHel.script || '';
            objMarkHel.tagIDs = objMarkHel.tagIDs || [];

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

        var _regexWordySpace = /\s+/g;

        var _makeupFollowScript = isFormat
            ? function ( strID, fnOnCreate ) {
                return '(' + fnOnCreate.toString()
                    + ').call( document.getElementById( "' + strID + '" ) );\n';
            }
            : function ( strID, fnOnCreate ) {
                return '(' + fnOnCreate.toString().replace( _regexWordySpace, ' ' )
                    + ').call( document.getElementById( "' + strID + '" ) ); ';
            };

        function _setMarkHel_onCreateBindElt( objMarkHel, insElement ) {
            var followScript;
            var strID = insElement._id;;

            if ( !strID ) {
                strID = 'HTMxR' + Math.random().toString().substr( -7 );
                insElement.setAttribute( 'id', strID );
                objMarkHel.tagIDs.push( strID );
            }

            objMarkHel.script += _makeupFollowScript( strID, insElement._onCreate );
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
        _createElement = function createElement( strName ) {
            this._name = strName;
            this._id = null;
            this._attrs = '';
            this._dataset = '';
            this._childs = [];
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

        /**
         * 增加子元素： 見 {@link module:htf~_docClass._createElement#appendChild} 。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func appendChild_pureText
         */
        _createElement.prototype.appendChild = function ( anyChild ) {
            var childs = this._childs;

            switch ( anyChild.constructor ) {
                case String:
                    childs.push( anyChild );
                    return;
                case _createNodeList:
                    if ( _appendNodeListChild( childs, anyChild ) ) return;
            }

            throw TypeError( log.err( 21, '_typeError' ) );
        };

        function _appendNodeListChild( arrChilds, insNodeList ) {
            var idx, val;

            for ( idx in insNodeList ) {
                val = insNodeList[ idx ];

                if ( typeof val !== 'string' ) return false;
                arrChilds.push( val );
            }

            return true;
        }

        /**
         * 元素： 創建元素。
         *
         * @memberof module:htf~_docClass._createElement#
         * @func elt_pureText
         * @return {String}
         */
        _createElement.prototype.elt = function elt() {
            var item, key;
            var strAns = '';

            strAns += '<' + this._name + this._attrs + this._dataset + '>';

            item = this._childs;
            if ( item.length ) for ( key in item ) strAns += item[ key ];

            strAns += '</' + this._name + '>';

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
         *   script: 用於設定元素標籤之程式碼 }
         * ```
         * </pre>
         * * 若 `isPureText === false`：
         * <br>
         * <pre>
         * ```
         * { main: 主要輸出元素標籤（最後執行的）}
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
            var idx, val, helChild;

            for ( idx in insNodeList ) {
                val = insNodeList[ idx ];

                if ( typeof val === 'string' ) helChild = document.createTextNode( val );
                else if ( val instanceof Element ) childs.push( val );
                else return false;

                arrChilds.push( val );
            }

            return true;
        }

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
    },
    function () {
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
    }
    );


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
             * @return {(String|Element|module:htf~_docClass._createNodeList)}
             * 見 {@link module:htf~_docClass._setMarkHel|_docClass._setMarkHel} 。
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
                var objNodeList = new _createNodeList( arguments );
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
            this.markHel = _initMarkHel( objMarkHel );
        };

        /**
         * 標籤： 創建元素標籤。
         *
         * @memberof module:htm~_tag.selfT.
         * @func t
         * @param {String} description - 描述標籤名稱及紀錄名稱。
         * @param {?(Object|Function)} [choB] - 設定元素標籤屬性。
         * @param {...Element} [choC] - 子層元素標籤。
         * @return {(String|Element|module:htf~_docClass._createNodeList)}
         * 見 {@link module:htf~_docClass._setMarkHel|_docClass._setMarkHel} 。
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
            typeOfArg1 = ( arg1 == null ) ? null : arg1.constructor;

            objMain = new _createElement( tagName );
            if ( markName ) this.markHel[ markName ] = objMain;

            if ( typeOfArg1 === Function ) _setAttr( objMain, { onCreate: arg1 } );
            else if ( typeOfArg1 === Object ) _setAttr( objMain, arg1 );
            else if ( typeOfArg1 != null ) idxArgs--;

            postArgs = _arraySlice.call( arguments, idxArgs );
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
     * @return {(String|Element|module:htf~_docClass._createNodeList)}
     * 與 {@link module:htf~_docClass._setMarkHel|_docClass._setMarkHel}
     * 的回傳值些微不同，當 `isPureText === true` 時一律為文字。
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

        /**
         * @memberof module:htf~_jcss~
         * @var {Boolean} _gapPart - 間隔零件（格式化相關）。
         */
        var _gapPart = isFormat
            ? [  true, '\n', ' {\n', '    ', ';\n',  '}' ]
            : [ false,  ' ',   ' {',    ' ',   ';', ' }' ];
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
            var gapPart3 = _gapPart[ 3 ];
            var gapPart4 = _gapPart[ 4 ];

            for ( key in objStylesheet ) {
                val = objStylesheet[ key ];

                if ( typeof val === 'string' )
                    styleValue += gapPart3 + _styleProp( key ) + ': ' + val + gapPart4;
                else {
                    newSubStyleValue = _objectStylesheet( myName, key, val );
                    if ( stopResolve ) return '';
                    subStyleValue = _cssCombine( subStyleValue, newSubStyleValue );
                }
            }

            if ( styleValue ) {
                if ( _gapPart[ 0 ] ) myName = myName.replace( _regexCommaGap, ',\n' );
                styleValue = myName + _gapPart[ 2 ] + styleValue + _gapPart[ 5 ];
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
            var gapWord = ( strPrevSection && strNextSection ) ? _gapPart[ 1 ] : '';
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
     * @memberof module:htm.
     * @func tagStyle
     * @param {(Object|Function)} stylesheet - 爪哇腳本的樣式表。 是 `String` 與 `Object` 組成的物件陣列。
     * @return {(String|Element|module:htf~_docClass._createNodeList)}
     * 與 {@link module:htf~_docClass._setMarkHel|_docClass._setMarkHel}
     * 的回傳值些微不同，當 `isPureText === true` 時一律為文字。
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

