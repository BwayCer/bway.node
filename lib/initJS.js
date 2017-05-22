/*! Initialize JavaScript @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 爪哇腳本初始化 Initialize JavaScript
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */

"use strict";


/**
 * 爪哇腳本初始化
 * @module initJS
 */

void function () {
    var idx = 0;
    var args = arguments;
    var _strins, _supportJS, _parseAMDArgs;
    var logMsgPkg, cacher;

    logMsgPkg     = args[ idx++ ];
    _strins       = args[ idx++ ]( logMsgPkg );
    _supportJS    = args[ idx++ ]();
    cacher        = args[ idx++ ]( _supportJS );
    _parseAMDArgs = args[ idx++ ]( _strins );
}(
// logMsgPackage
{
    _undefined: 'Error log is undefined.',
    parseAMDArgs_notAllowed: 'The arguments of "define" function is not allowed type.',
},
// _strins
function ( logMsgPackage ) {
    var _regexSpecifySymbol = /%(.)/g;

    /**
     * 文字插入。
     *
     * @memberof module:initJS.
     * @func _strins
     * @param {String} txt - 訊息。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {?String}
     */
    function _strins( strCode ) {
        var txt = logMsgPackage[ strCode ];

        if ( typeof txt !== 'string' ) return logMsgPackage._undefined;
        if ( arguments.length === 1 ) return txt;

        var idx = 1;
        var args = arguments;

        return txt.replace( _regexSpecifySymbol, function () {
            switch ( arguments[ 1 ] ) {
                case '%': return '%';
                case 's': return args[ idx++ ];
                default: return 'undefined';
            }
        } );
    }

    return _strins;
},
// _supportJS
function () {
    /**
     * 空枚舉： 創建一個「乾淨」的空物件陣列。
     * <br>
     * 其運用實例實作比調用 `Object.create( null )` 更有效率。（測試於 v8 v4.9）
     *
     * @memberof module:initJS~
     * @func emptyEnum
     *
     * @see [nodejs/node v7.x > events.js#L5 - github]{@link https://github.com/nodejs/node/blob/v7.x/lib/events.js#L5}
     */
    function emptyEnum() {}
    emptyEnum.prototype = Object.create( null );

    /**
     * 一單位接合。
     * 其效率比 `Array#splice` 使用兩個參數的狀況還快約 1.5 倍。（翻譯自 node 注釋）
     * <br>
     * 但測試結果，陣列項目需少於 16 樣時才有明顯效果。
     * 當陣列長度為 16 時，效率與 `Array#splice` 相比可達近一倍快，且項目愈少愈快。
     *
     * @memberof module:initJS~
     * @func spliceOne
     * @param {Array} list - 目標陣列。
     * @param {Number} index - 刪除項目的引索位置。
     * @return {?*} 移除的物件。
     *
     * @see [nodejs/node > events.js#L492 - github]{@link https://github.com/nodejs/node/blob/master/lib/events.js#L492}
     */
    function spliceOne( arrList, numIndex ) {
        var idxNext = numIndex + 1;
        var len = arrList.length;
        var anyAns = arrList[ numIndex ];

        while ( idxNext < len ) {
            arrList[ numIndex ] = arrList[ idxNext ];
            numIndex++;
            idxNext++;
        }
        arrList.pop();

        return anyAns;
    }

    return {
        emptyEnum: emptyEnum,
        spliceOne: spliceOne
    };
},
/**
 * 捕手： 鍵值快取器。
 *
 * @memberof module:initJS.
 * @class cacher
 */
function ( supportJS ) {
    function cacher() {
        // 將物件名稱存為陣列可解決取得物件名稱的方式與空枚舉無法計數問題。
        // 取得物件名稱的方式： `Object.keys()、`Reflect.ownKeys()`。
        this._index = new Array( 0 );
        this._cache = new cacher.emptyEnum();
    }

    /**
     * 空枚舉。
     *
     * @memberof module:initJS.cacher.
     * @func emptyEnum
     *
     * @see [initJS~emptyEnum]{@link module:initJS~emptyEnum}
     */
    cacher.emptyEnum = supportJS.emptyEnum;

    /**
     * 一單位接合。
     *
     * @memberof module:initJS.cacher.
     * @func spliceOne
     *
     * @see [initJS~spliceOne]{@link module:initJS~spliceOne}
     */
    cacher.spliceOne = supportJS.spliceOne;

    /**
     * 增加： 新增快取資料。
     *
     * @memberof module:initJS.cacher#
     * @func add
     * @param {String} key - 該鍵名稱。
     * @param {?*} val - 該值物件。
     * @return {Boolean} 是否新增成功。
     */
    cacher.prototype.add = function ( strKey, anyVal ) {
        var _index = this._index;

        if ( !~_index.indexOf( strKey ) ) _index.push( strKey );
        this._cache[ strKey ] = anyVal;
        return true;
    };

    /**
     * 移除： 移除快取資料。
     *
     * @memberof module:initJS.cacher#
     * @func rm
     * @param {String} key - 該鍵名稱。
     * @return {Boolean} 是否移除成功。
     */
    cacher.prototype.rm = function ( strKey ) {
        var _index = this._index;
        var _cache = this._cache;
        var idx = _index.indexOf( strKey );
        var bisExist = strKey in _cache;

        if ( ~idx ) {
            cacher.spliceOne( _index, idx );
            idx = _index.indexOf( strKey );
        }

        if ( bisExist ) bisExist = delete _cache[ strKey ];

        return !~idx && bisExist;
    };

    /**
     * 挑選： 指定索取的快取資料。
     *
     * @memberof module:initJS.cacher#
     * @func pick
     * @param {String} key - 該鍵名稱。
     * @return {?*}
     */
    cacher.prototype.pick = function ( strKey ) {
        return ~this._index.indexOf( strKey ) ? this._cache[ strKey ] : null;
    };

    return cacher;
},
// _parseAMDArgs
function ( _strins ) {
    /**
     * 解析異步模組定義參數。
     * _parseAMDArgs
     *
     * @memberof module:initJS~
     * @func _parseAMDArgs
     * @param {Number} lenOfDefineArgs - 定義函式所接受到的參數長度。
     * @param {String} [filePath] - 模組識別碼。
     * @param {?Array} [dependencies] - 依賴模組。
     * @param {*} factory - 模組工廠。
     * 若 `dependencies` 有參考的依賴模組，則 `factory` 為 `Function` 型別；
     * 反之則任意型別。
     * @return [ filePath, dependencies, factory ]
     *
     * @example
     * // [ null, null, anyChoA ]
     * _parseAMDArgs( 1, anyChoA );
     *
     * // [ strChoA, null, anyChoB ]
     * _parseAMDArgs( 2, strChoA, anyChoB );
     *
     * // [ null, 'indep', fnChoB ]
     * _parseAMDArgs( 2, null, fnChoB );
     *
     * // [ strChoA, arrChoB, fnChoC ]
     * _parseAMDArgs( 3, strChoA, arrChoB, fnChoC );
     *
     * // [ strChoA, 'indep', fnChoC ]
     * _parseAMDArgs( 3, strChoA, null, fnChoC );
     */
    function _parseAMDArgs( lenOfDefineArgs ) {
        var bisNotAllowed = true;
        var filePath = null;
        var dependencies = null;
        var factory;
        var bisChoA, bisChoC, anyDepType;

        switch ( lenOfDefineArgs ) {
            case 1:
                bisNotAllowed = false;
                factory = arguments[ 1 ];
                break;
            case 2:
                factory = arguments[ 2 ];
                if ( typeof typeofArgu === 'string' ) {
                    bisNotAllowed = false;
                    filePath = arguments[ 1 ];
                } else {
                    anyDepType = _parseDependency( 2, arguments[ 1 ] );
                    if ( anyDepType !== false && typeof factory === 'function' ) {
                        bisNotAllowed = false;
                        dependencies = anyDepType;
                    }
                }
                break;
            case 3:
                bisChoA = typeof arguments[ 1 ] === 'string';
                bisChoC = typeof arguments[ 3 ] === 'function';
                anyDepType = _parseDependency( 3, arguments[ 2 ] );
                if ( bisChoA && bisChoC && anyDepType !== false ) {
                    bisNotAllowed = false;
                    filePath = arguments[ 1 ];
                    dependencies = anyDepType;
                    factory = arguments[ 3 ];
                }
                break;
        }

        if ( bisNotAllowed ) throw TypeError( _strins( 'parseAMDArgs_notAllowed' ) );

        return [ filePath, dependencies, factory ];
    }

    function _parseDependency( lenOfArgs, anyDeps ) {
        var anyAns = false;

        if ( lenOfArgs < 2 || 3 < lenOfArgs ) return false;

        if ( anyDeps == null ) return 'indep';

        if ( lenOfArgs === 3 && anyDeps.constructor === Array ) {
            if ( anyDeps.length === 0 ) anyAns = 'indep';
            else anyAns = anyDeps;
        }

        return anyAns;
    }

    return _parseAMDArgs;
}
);

