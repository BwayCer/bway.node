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
 *
 * @module initJS
 */

void function () {
    var idx = 0;
    var args = arguments;
    var defaultMsgTable, logMsgTable, _supportJS, _parseOrderArgs;
    var classLog, log, cacher;

    defaultMsgTable = args[ idx++ ];
    logMsgTable     = args[ idx++ ];
    classLog        = args[ idx++ ]( defaultMsgTable );
    log             = new classLog( true, logMsgTable );
    _supportJS      = args[ idx++ ]();
    cacher          = args[ idx++ ]( _supportJS );
    _parseOrderArgs = args[ idx++ ]( log );
}(
// defaultMsgTable
{
    _undefined: 'Unexpected log message.',
    _illegalInvocation: 'Illegal invocation.',
    _typeError: 'a value is not of the expected type.',
    _restrictedType: '"%s" argument must be a `%s` type.',
},
// logMsgTable
{
    parseOrderArgs_notAllowed: 'The arguments of "order" function is not allowed type.',
},
// classLog
function ( defaultMsgTable ) {
    /**
     * 日誌類物件
     *
     * @memberof module:initJS.
     * @class classLog
     * @param {?Boolean} print - 是否打印（皆允許拋錯）。
     * @param {?Object} preMsgTable - 預設訊息表。
     * 其訊息表的原型鏈會指向 {@link module:initJS.classLog#defaultMsgTable}。
     */
    function classLog( bisPrint, objPreMsgTable ) {
        this._isPrint = ( typeof bisPrint === 'boolean' ) ? bisPrint : true;
        this.msgTable = objPreMsgTable
            ? Object.setPrototypeOf( objPreMsgTable, this.defaultMsgTable )
            : Object.create( this.defaultMsgTable );
    }

    /**
     * 接收器： 用戶可以此獲取日誌並打印於其他地放。
     *
     * @abstract
     * @memberof module:initJS.classLog#
     * @func receiver
     * @param {String} origName - 執行來源。 其值有 `tell`、`warn`、`err`。
     * @param {Number} code - 訊息代碼。 其中 `2x` 開頭表示本物件。
     * @param {String} msg - 訊息。
     */
    classLog.prototype.receiver = null;

    /**
     * 預設訊息表。
     * <br>
     * 關於訊息表的名稱建議以 `(...(來源)_)(內容資訊)` 的方式命名，預設值加以 `_` 為前綴。
     *
     * @memberof module:initJS.classLog#
     * @var {Object} defaultMsgTable
     */
    classLog.prototype.defaultMsgTable = Object.setPrototypeOf( defaultMsgTable, null );

    var _arraySlice = Array.prototype.slice;

    var _regexSpecifySymbol = /%(.)/g;

    /**
     * 文字插入。
     *
     * @memberof module:initJS.classLog~
     * @func _strins
     * @param {String} msg - 訊息。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {String}
     */
    function _strins( strTxt ) {
        if ( !_regexSpecifySymbol.test( strTxt ) ) return strTxt;

        var idx = 1;
        var args = arguments;

        return strTxt.replace( _regexSpecifySymbol, function () {
            switch ( arguments[ 1 ] ) {
                case '%': return '%';
                case 's': return args[ idx++ ];
                default: return 'undefined';
            }
        } );
    }

    /**
     * 口述。
     *
     * @memberof module:initJS.classLog#
     * @func tell
     * @param {Number} code - 訊息代碼。
     * @param {String} msg - 打印訊息。
     * @param {...String} [replaceMsg] - 替代訊息。
     */
    classLog.prototype.tell = function ( numCode, strMsg ) {
        var txt;
        var bisSendMsg = typeof this.receiver === 'function';

        if ( typeof strMsg !== 'string' ) txt = this.msgTable._undefined;
        else if ( arguments.length === 2 ) txt = _strins.call( null, strMsg );
        else txt = _strins.apply( null, _arraySlice.call( arguments, 1 ) );

        if ( bisSendMsg ) this.receiver( 'tell', numCode, 'log_tell', txt );
        if ( this._isPrint ) console.log( txt );
    };

    /**
     * 解析警告訊息。
     *
     * @memberof module:initJS.classLog~
     * @func _parseWarnTxt
     * @param {Number} code - 訊息代碼。
     * @param {String} msgCode - 打印訊息的日誌代碼。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {String}
     */
    function _parseWarnTxt( numCode, strMsgCode ) {
        var msgTable = this.msgTable;

        if ( typeof strMsgCode !== 'string' ) return msgTable._undefined;

        var args;
        var msg = msgTable[ strMsgCode ];
        var strAns;

        if ( !msg ) return msgTable._undefined;

        if ( arguments.length === 2 ) strAns = _strins.call( null, msg );
        else {
            args = _arraySlice.call( arguments, 1 );
            args[ 0 ] = msg;
            strAns = _strins.apply( null, args );
        }

        return strAns;
    }

    /**
     * 警告。
     *
     * @memberof module:initJS.classLog#
     * @func warn
     * @param {Number} code - 訊息代碼。
     * @param {String} msgCode - 打印訊息的日誌代碼。
     * @param {...String} [replaceMsg] - 替代訊息。
     */
    classLog.prototype.warn = function ( numCode, strMsgCode ) {
        var txt = _parseWarnTxt.apply( this, arguments );
        var bisSendMsg = typeof this.receiver === 'function';

        if ( bisSendMsg ) this.receiver( 'warn', numCode, strMsgCode, txt );
        if ( this._isPrint ) console.error( txt );
    };

    /**
     * 錯誤。
     *
     * @memberof module:initJS.classLog#
     * @func err
     * @param {Number} code - 訊息代碼。
     * @param {String} msgCode - 打印訊息的日誌代碼。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {String} 錯誤訊息。
     */
    classLog.prototype.err = function ( numCode, strMsgCode ) {
        var txt = _parseWarnTxt.apply( this, arguments );
        var bisSendMsg = typeof this.receiver === 'function';

        if ( bisSendMsg ) this.receiver( 'err', numCode, strMsgCode, txt );
        return txt;
    };

    /**
     * 設定訊息表。
     *
     * @memberof module:initJS.classLog#
     * @func setMsg
     * @param {(String|Object)} msgOption - 訊息選項，可為名稱或清單。
     * @param {String} msg - 訊息內容。
     */
    classLog.prototype.setMsg = function ( anyMsgOption, strMsg ) {
        var typeOfMsgOption = anyMsgOption ? anyMsgOption.constructor : null;
        var bisMsgStrType = typeof strMsg === 'string';

        if ( !( typeOfMsgOption === Object || ( typeOfMsgOption === String && bisMsgStrType ) ) )
            throw TypeError( this.err( 21, '_typeError' ) );

        var key;
        var msgTable = this.msgTable;

        switch ( typeOfMsgOption ) {
            case String:
                msgTable[ anyMsgOption ] = strMsg;
                break;
            case Object:
                for( key in anyMsgOption ) msgTable[ key ] = anyMsgOption[ key ];
                break;
        }
    };

    /**
     * 取得訊息表內容。
     *
     * @memberof module:initJS.classLog#
     * @func getMsg
     * @param {String} msgCode - 訊息代碼的日誌代碼。
     * @return {String} 其訊息代碼或 `_undefined` 代碼的內容。
     */
    classLog.prototype.getMsg = function ( strMsgCode ) {
        var msgTable = this.msgTable;
        return msgTable[ strMsgCode ] || msgTable._undefined;
    };

    return classLog;
},
// _supportJS
function () {
    /**
     * 空枚舉： 創建一個「乾淨」的空物件陣列。
     * <br>
     * 其運用實例實作比調用 `Object.create( null )` 更有效率。（翻譯自 node 注釋）
     *
     * @see [nodejs/node v7.x > events.js#L5 - GitHub]{@link https://github.com/nodejs/node/blob/v7.x/lib/events.js#L5}
     *
     * @memberof module:initJS~
     * @func emptyEnum
     */
    function emptyEnum() {}
    emptyEnum.prototype = Object.create( null );

    /**
     * 陣列的重新包裝。
     *
     * @memberof module:initJS~
     * @func rewrapArr
     * @param {Array} target - 複製目標對象。
     * @return {Array}
     */
    function rewrapArr( arrTarget ) {
        var len = arrTarget.length;
        var arrAns = new Array( len );

        while ( len-- ) arrAns[ len ] = arrTarget[ len ];
        return arrAns;
    }

    /**
     * 一單位接合。
     * 其效率比 `Array#splice` 使用兩個參數的狀況還快約 1.5 倍。（翻譯自 node 注釋）
     * <br>
     * 但測試結果，陣列項目需少於 16 樣時才有明顯效果。
     * 當陣列長度為 16 時，效率與 `Array#splice` 相比可達近一倍快，且項目愈少愈快。
     *
     * @see [nodejs/node v8.x > events.js#L492 - GitHub]{@link https://github.com/nodejs/node/blob/v8.x/lib/events.js#L492}
     *
     * @memberof module:initJS~
     * @func spliceOne
     * @param {Array} list - 目標陣列。
     * @param {Number} index - 刪除項目的引索位置。
     * @return {?*} 移除的物件。
     */
    function spliceOne( arrList, numIndex ) {
        if ( numIndex === -1 ) return null;

        var len = arrList.length - 1;
        var anyAns = arrList[ numIndex ];

        while ( numIndex < len ) arrList[ numIndex ] = arrList[ ++numIndex ];
        arrList.pop();

        return anyAns;
    }

    return {
        emptyEnum: emptyEnum,
        rewrapArr: rewrapArr,
        spliceOne: spliceOne
    };
},
// cacher
function ( _supportJS ) {
    var _emptyEnum = _supportJS.emptyEnum;
    var _spliceOne = _supportJS.spliceOne;

    /**
     * 捕手： 鍵值快取器。
     * <br><br>
     * 把物件名稱存為陣列替代 `Object.keys()` 、
     * [`Reflect.ownKeys()`]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys}
     * 取得物件名稱的方式。 以解決物件名稱的取得及空枚舉無法計數問題。
     *
     * @memberof module:initJS.
     * @class cacher
     */
    function cacher() {
        this._index = [];
        this._cache = new _emptyEnum();
    }

    /**
     * 有否： 是否有指定的快取資料存在。
     *
     * @memberof module:initJS.cacher#
     * @func has
     * @param {String} key - 該鍵名稱。
     * @return {Boolean}
     */
    cacher.prototype.has = function ( strKey ) {
        return !!~this._index.indexOf( strKey );
    };

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
            _spliceOne( _index, idx );
            idx = _index.indexOf( strKey );
        }

        if ( bisExist ) bisExist = delete _cache[ strKey ];

        return !~idx && bisExist;
    };

    /**
     * 重置： 重置快取資料夾。
     * <br><br>
     * 原快取資料夾的取用者應自負使用責任。
     *
     * @memberof module:initJS.cacher#
     * @func reset
     */
    cacher.prototype.reset = function () {
        this._index.length = 0;
        this._cache = new _emptyEnum();
    };

    /**
     * 提取： 指定索取的快取資料。
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
// _parseOrderArgs
function ( log ) {
    /**
     * 解析訂單參數。
     *
     * @memberof module:initJS~
     * @func _parseOrderArgs
     * @param {Number} lenOrderArgs - 訂單函式所接受到的參數長度。
     * @param {String} [id] - 識別碼。
     * @param {?Array} [dependencies] - 依賴包。
     * @param {?*} factory - 工廠。
     * @return {Array} [ id, dependencies, factory ]
     *
     * @example
     * // [ null, null, anyChoA ]
     * _parseOrderArgs( 1, anyChoA );
     *
     * // [ strChoA, null, anyChoB ]
     * _parseOrderArgs( 2, strChoA, anyChoB );
     *
     * // [ null, arrChoA, anyChoB ]
     * _parseOrderArgs( 2, arrChoA, anyChoB );
     *
     * // [ null, 'indep', fnChoB ]
     * _parseOrderArgs( 2, null, fnChoB );
     *
     * // [ strChoA, arrChoB, fnChoC ]
     * _parseOrderArgs( 3, strChoA, arrChoB, fnChoC );
     *
     * // [ strChoA, 'indep', fnChoC ]
     * _parseOrderArgs( 3, strChoA, null, fnChoC );
     */
    function _parseOrderArgs( lenOrderArgs ) {
        var bisNotAllowed = true;
        var id = null;
        var dependencies = null;
        var factory;
        var bisChoA, bisChoC, anyDepType;

        switch ( lenOrderArgs ) {
            case 1:
                bisNotAllowed = false;
                factory = arguments[ 1 ];
                break;
            case 2:
                factory = arguments[ 2 ];
                if ( typeof arguments[ 1 ] === 'string' ) {
                    bisNotAllowed = false;
                    id = arguments[ 1 ];
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
                    id = arguments[ 1 ];
                    dependencies = anyDepType;
                    factory = arguments[ 3 ];
                }
                break;
        }

        if ( bisNotAllowed ) throw TypeError( log.err( 21, 'parseOrderArgs_notAllowed' ) );

        return [ id, dependencies, factory ];
    }

    function _parseDependency( lenArgs, anyDeps ) {
        var anyAns = false;

        if ( lenArgs < 2 || 3 < lenArgs ) return false;

        if ( anyDeps == null ) return 'indep';

        if ( anyDeps.constructor === Array ) {
            if ( anyDeps.length === 0 ) anyAns = 'indep';
            else anyAns = anyDeps;
        }

        return anyAns;
    }

    return _parseOrderArgs;
}
);

