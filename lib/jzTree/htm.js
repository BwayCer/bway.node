/**
 * 超文本管理員 HyperText Manager
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link http://bwaycer.github.io}
 */


/*! jzTree/htm - BwayCer CC-BY-4.0 @license: bwaycer.github.io/license/CC-BY-4.0 */

define( 'jzTree/htm', function () {
    "use strict";

    /**
     * 超文本管理員
     * @module htm
     */

    var _transClone = Array.transClone;
    var _qSplice = Array.prototype.qSplice;

    var _tag, _jcss;

    function htm( strViewName, fnOperate ) {}


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
             * @return {Element}
             */
            easyTag: function easyTag( strTagName ) {
                return document.createElement( strTagName );
            },

            /**
             * 節點清單： 創建 `NodeList` 節點清單類型。
             *
             * @memberof! module:htm~_tag.
             * @alias _tag.hangFunc.NodeList
             * @param {...Element} tagName
             * @return {module:htm~_tag~_nodeList}
             */
            NodeList: function NodeList() {
                var objNodeList = _nodeList( _transClone( arguments ) );
                this( 'setMarkHelMain', objNodeList );
                return objNodeList;
            },
        };

        /**
         * 自身作用域： 創建標籤作用域，將綁定於 [標籤函式]{@link module:htm~_tag._tag.selfT.t}。
         *
         * @memberof module:htm~_tag.
         * @class selfT
         * @param {Object} markHel - 存放被標註的元素標籤物件陣列。 `markHel.main` 放最後執行的元素標籤。
         */
        _tag.selfT = function selfT( objMarkHel ) {
            if (! 'main' in objMarkHel ) objMarkHel.main || null;
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
         * @return {Element}
         */
        _tag.selfT.prototype.t = function t( strDescription ) {
            var anyAns;
            var idxMark, isHasMark, tagName, markName;
            var postArgs, arg1, idxArgs, typeOfArg1;

            if( strDescription === 'setMarkHelMain' ) {
                anyAns = arguments[ 1 ];
                this.markHel.main = anyAns;
                return anyAns;
            }

            idxMark = strDescription.indexOf( '*' );
            isHasMark = idxMark !== -1;
            tagName = isHasMark ? strDescription.substring( 0, idxMark ) : strDescription;
            markName = ( isHasMark && idxMark + 1 < strDescription.length )
                ? strDescription.substring( idxMark + 1 ) : null;

            arg1 = arguments[ 1 ];
            idxArgs = 2;
            typeOfArg1 = ( arg1 == null ) ? null : typeof arg1;

            anyAns = document.createElement( tagName );
            if ( markName ) this.markHel[ markName ] = anyAns;

            if ( typeOfArg1 === 'function' ) arg1.call( anyAns );
            else if ( typeOfArg1 === 'object' ) _setAttr( anyAns, arg1 );
            else if ( typeOfArg1 != null ) idxArgs--;

            postArgs = _qSplice.call( arguments, idxArgs );
            _appendChild( anyAns, postArgs );

            this.markHel.main = anyAns;
            return anyAns;
        };

        /**
         * 設定屬性。
         *
         * @memberof module:htm~_tag~
         * @func _setAttr
         * @param {Element} main
         * @param {Object} attr
         */
        function _setAttr( helMain, objAttr ) {
            var key, val;
            var key_ofData;
            for ( key in objAttr ) {
                val = objAttr[ key ];

                if ( val == null ) continue;
                switch ( key ) {
                    case 'id': helMain.id = val; break;
                    case 'className': helMain.className = val; break;
                    case 'dataset':
                        for ( key_ofData in val ) helMain.dataset[ key_ofData ] = val[ key_ofData ];
                        break;
                    case 'onCreate':
                        objAttr.onCreate.call( helMain );
                        break;
                    default:
                        helMain.setAttribute( key, val );
                }
            }
        }

        /**
         * 增加子層。
         *
         * @memberof module:htm~_tag~
         * @func _appendChild
         * @param {Element} main
         * @param {Array} childNodes
         * 其值可包含：
         * <br>
         * * `null`
         * <br>
         * * `String`
         * <br>
         * * `Element`
         * <br>
         * * `NodeList`
         */
        function _appendChild( helMain, arrChildNodes ) {
            var p, len, item, childNode;
            var idx = 0;
            var lenOfChildNodes = arrChildNodes.length;

            while ( idx < lenOfChildNodes ) {
                childNode = arrChildNodes[ idx++ ];
                if ( childNode == null ) continue;
                else if ( typeof childNode === 'string' )
                    helMain.appendChild( document.createTextNode( childNode ) );
                else if ( childNode instanceof Element ) helMain.appendChild( childNode );
                else if ( childNode.constructor === NodeList )
                    while ( item = childNode[ 0 ] ) helMain.appendChild( item );
                else throw Error();
            }
        }

        /**
         * 創建節點清單： 並非直接創建 `NodeList` 類函式。 是先創建元素標籤，在取用節點清單。
         *
         * @memberof module:htm~_tag~
         * @func _setAttr
         * @param {Element} main
         * @param {Array} childNodes
         */
        function _nodeList( arrArgs ) {
            var helContainer = document.createElement( 'div' );
            _appendChild( helContainer, arrArgs );
            return helContainer.childNodes;
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
     * @return {Element}
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
     * @return {Element}
     */
    htm.tagStyle = function jcss( anyStylesheet ) {
        var helStyle, helText;
        var objStylesheet;

        switch ( typeof anyStylesheet ) {
            case 'object': objStylesheet = anyStylesheet; break;
            case 'function':
                anyStylesheet( function jcss( objCallbackStylesheet ) {
                    objStylesheet = objCallbackStylesheet;
                } );
                break;
        }

        helStyle = document.createElement( 'style' );
        helText = document.createTextNode( _jcss( objStylesheet ) );
        helStyle.appendChild( helText );
        return helStyle;
    };

    return htm;
} );

