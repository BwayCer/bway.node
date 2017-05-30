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
    var defaultMsgTable, logMsgTable, _supportJS, _parseAMDArgs, _amdCacher;
    var classLog, log, cacher, jspi, eventEmitter;

    defaultMsgTable = args[ idx++ ];
    logMsgTable     = args[ idx++ ];
    classLog        = args[ idx++ ]( defaultMsgTable );
    log             = new classLog( true, logMsgTable );
    _supportJS      = args[ idx++ ]();
    cacher          = args[ idx++ ]( _supportJS );
    _parseAMDArgs   = args[ idx++ ]( log );
    _amdCacher      = args[ idx++ ]( log, cacher );
    jspi            = args[ idx++ ]( log, _parseAMDArgs, _amdCacher );
    eventEmitter    = args[ idx++ ]( jspi, log, _supportJS, cacher );
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
    parseAMDArgs_notAllowed: 'The arguments of "define" function is not allowed type.',
    amdCacher_notFoundObject: '%s not found "%s" object.',
    jspi_lackCtor: 'lack "constructor" object.',
    eventEmitter_positiveNumber: '%s is a positive number.',
    eventEmitter_emitError: 'eventEmitter "error" event. %s',
    eventEmitter_addExcessListener: 'Possible EventEmitter memory leak detected.（%s "%s" listeners added.）',
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
// _parseAMDArgs
function ( log ) {
    /**
     * 解析異步模組定義參數。
     *
     * @memberof module:initJS~
     * @func _parseAMDArgs
     * @param {Number} lenAMDArgs - 異步模組定義函式所接受到的參數長度。
     * @param {String} [filePath] - 模組識別碼。
     * @param {?Array} [dependencies] - 依賴模組。
     * @param {?*} factory - 模組工廠。
     * 若 `dependencies` 有參考的依賴模組，則 `factory` 為 `Function` 型別；
     * 反之則任意型別。
     * @return {Array} [ filePath, dependencies, factory ]
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
    function _parseAMDArgs( lenAMDArgs ) {
        var bisNotAllowed = true;
        var filePath = null;
        var dependencies = null;
        var factory;
        var bisChoA, bisChoC, anyDepType;

        switch ( lenAMDArgs ) {
            case 1:
                bisNotAllowed = false;
                factory = arguments[ 1 ];
                break;
            case 2:
                factory = arguments[ 2 ];
                if ( typeof arguments[ 1 ] === 'string' ) {
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

        if ( bisNotAllowed ) throw TypeError( log.err( 21, 'parseAMDArgs_notAllowed' ) );

        return [ filePath, dependencies, factory ];
    }

    function _parseDependency( lenArgs, anyDeps ) {
        var anyAns = false;

        if ( lenArgs < 2 || 3 < lenArgs ) return false;

        if ( anyDeps == null ) return 'indep';

        if ( lenArgs === 3 && anyDeps.constructor === Array ) {
            if ( anyDeps.length === 0 ) anyAns = 'indep';
            else anyAns = anyDeps;
        }

        return anyAns;
    }

    return _parseAMDArgs;
},
// _amdCacher
function ( log, cacher ) {
    /**
     * 異步模組定義專用的鍵值快取器。
     *
     * @memberof module:initJS~
     * @class _amdCacher
     * @param {String} name - 快取器名稱。
     * @param {Object} preStore - 預設佇存物。
     */
    function _amdCacher( strName, objPreStore ) {
        this._name = strName;
        this._cacher = new cacher;

        if ( objPreStore ) assign( this._cacher, objPreStore );
    }

    /**
     * 分配： 鍵值淺複製。
     *
     * @memberof module:initJS~_amdCacher.
     * @func assign
     * @param {module:initJS.cacher} main - 主物件。
     * @param {Object} source - 來源物件。
     */
    _amdCacher.assign = assign;

    function assign( insCacher, objSource ) {
        var key;
        for ( key in objSource ) insCacher.add( key, objSource[ key ] );
    }

    /**
     * 增加： 新增模組。
     *
     * @memberof module:initJS~_amdCacher#
     * @func add
     * @param {String} name - 模組名稱。
     * @param {?*} cobj - 模組物件。
     * @return {Boolean} 是否新增成功。
     */
    _amdCacher.prototype.add = function ( strName, anyCobj ) {
        return this._cacher.add( strName, anyCobj );
    };

    /**
     * 移除： 移除模組。
     *
     * @memberof module:initJS~_amdCacher#
     * @func rm
     * @param {String} name - 模組名稱。
     * @return {Boolean} 是否移除成功。
     */
    _amdCacher.prototype.rm = function ( strName ) {
        return this._cacher.rm( strName );
    };

    /**
     * 重置： 重置快取資料夾。
     *
     * @memberof module:initJS~_amdCacher#
     * @func reset
     */
    _amdCacher.prototype.reset = function () {
        return this._cacher.reset();
    };

    /**
     * 單項提取： 提取單樣模組。
     *
     * @memberof module:initJS~_amdCacher#
     * @func pickOne
     * @param {String} name - 模組名稱。
     * @throws {Error} 找不到指定物件。
     * @return {?*}
     */
    _amdCacher.prototype.pickOne = function ( strName ) {
        if ( ~this._cacher._index.indexOf( strName ) ) return this._cacher.pick( strName );
        throw Error( log.err( 21, 'amdCacher_notFoundObject', this._name, strName ) );
    };

    /**
     * 提取： 提取多樣模組。
     *
     * @memberof module:initJS~_amdCacher#
     * @func pick
     * @param {(String|Array)} name - 模組名稱。
     * @throws {Error} 找不到指定物件。
     * @return {Object}
     */
    _amdCacher.prototype.pick = function ( anyNames ) {
        var objAns = {};
        var p, len, val;
        var _index = this._cacher._index;
        var _cache = this._cacher._cache;

        if ( anyNames === 'all' ) {
            for ( p = 0, len = _index.length; p < len ; p++ ) {
                val = _index[ p ];
                objAns[ val ] = _cache[ val ];
            }
        } else {
            for ( p = 0, len = anyNames.length; p < len ; p++ ) {
                val = anyNames[ p ];
                if ( ~_index.indexOf( val ) ) objAns[ val ] = _cache[ val ];
                else throw Error( log.err( 21, 'amdCacher_notFoundObject', this._name, val ) );
            }
        }

        return objAns;
    };

    /**
     * 提取函數參數： 提取所需依賴，以陣列型態回傳。
     *
     * @memberof module:initJS~_amdCacher#
     * @func pickArgs
     * @param {Array} deps - 模組依賴。
     * @throws {Error} 找不到指定物件。
     * @return {Array}
     */
    _amdCacher.prototype.pickArgs = function ( arrDeps ) {
        var arrAns = [];
        var p, len, val;
        var _index = this._cacher._index;
        var _cache = this._cacher._cache;

        for ( p = 0, len = arrDeps.length; p < len ; p++ ) {
            val = arrDeps[ p ];
            if ( ~_index.indexOf( val ) ) arrAns[ p ] = _cache[ val ];
            else throw Error( log.err( 21, 'amdCacher_notFoundObject', this._name, val ) );
        }

        return arrAns;
    };

    return _amdCacher;
},
/**
 * 爪哇腳本程式介面 JavaScript Programming Interface
 *
 * @module jspi
 */
function ( log, _parseAMDArgs, _amdCacher ) {
    /**
     * 爪哇腳本程式介面。
     *
     * @see module:initJS~_parseAMDArgs
     * @see module:jspi~_callJspi
     *
     * @memberof module:jspi.
     * @func jspi
     * @param {(null|String|Array)} option - 提問選項或路徑名稱。
     * @param {?Array} [dependencies] - 依賴模組。
     * @param {?*} factory - 模組物件。
     * 若 `dependencies` 有參考的依賴模組，則 `factory` 為 `Function` 型別；
     * 反之則任意型別。
     * @throws {Error} 非法調用。
     * @return {?*} 當有提問選項時，會有對應的回傳值。
     */
    function jspi( strPathName, arrDeps, anyFactory ) {
        if ( this._cobjName == null ) throw Error( log.err( 21, '_illegalInvocation' ) );
        return _callJspi( this._router, arguments.length, strPathName, arrDeps, anyFactory );
    }

    /**
     * 爪哇腳本程式介面調用。
     *
     * @memberof module:jspi~
     * @func _callJspi
     * @param {module:initJS~_amdCacher} router - 路由器。
     * @param {Number} lenArgs - 參數長度。
     * @param {(null|String|Array)} option - 提問選項或路徑名稱。
     * @param {?Array} [dependencies] - 依賴模組。
     * @param {?*} factory - 模組物件。
     * 若 `dependencies` 有參考的依賴模組，則 `factory` 為 `Function` 型別；
     * 反之則任意型別。
     * @return {?*} 當有提問選項時，會有對應的回傳值。
     */
    function _callJspi( insRouter, lenArgs, anyOption, arrDeps, anyFactory ) {
        var arrAMDArgs;

        if ( lenArgs <= 1 ) {
            if ( anyOption == null ) return insRouter.pick( 'all' );
            switch ( anyOption.constructor ) {
                case String: return insRouter.pickOne( anyOption );
                case Array: return insRouter.pick( anyOption );
            }
        }

        if ( typeof anyOption !== 'string' ) throw TypeError( log.err( 21, '_typeError' ) );

        var arrAMDArgs = _parseAMDArgs( lenArgs, anyOption, arrDeps, anyFactory );
        var strPathName = arrAMDArgs[ 0 ];
        var anyDeps = arrAMDArgs[ 1 ];
        var anyFactory = arrAMDArgs[ 2 ];
        var anyProperty;

        switch ( anyDeps ) {
            case null:
                anyProperty = anyFactory;
                break;
            case 'indep':
                anyProperty = anyFactory();
                break;
            default:
                anyProperty = anyFactory.apply( null, insRouter.pickArgs( anyDeps ) );
        }

        insRouter.add( strPathName, anyProperty );
    }

    /**
     * 創建： 啟用專屬物件的爪哇腳本程式介面。
     *
     * @memberof module:jspi.
     * @func create
     * @param {String} cobjName - 物件名稱。
     * @param {...Object} [preStore] - 預設佇存物。
     * @param {Function} [factory] - 工廠。 提供隔離空間並縮排編寫。
     * @throws {TypeError} 非法調用。
     * @throws {TypeError} preStore 為 Object 類型。
     * @return {Function} 以 `bind()` 創建的 {@link module:jspi.jspi}。
     */
    jspi.create = function ( strCobjName ) {
        if ( typeof strCobjName !== 'string' ) throw TypeError( log.err( 21, '_illegalInvocation' ) );

        var p, val;
        var args = arguments;
        var len = args.length;
        var factory = ( len > 1 ) ? args[ len - 1 ] : null;
        var bisFuncType = typeof factory === 'function';
        var _router = new _amdCacher( strCobjName );
        var newSelf = {
            _cobjName: strCobjName || null,
            _router: _router
        };
        var fnAns;

        if ( bisFuncType ) len--;

        if ( len > 1 ) {
            for ( p = 1; p < len ; p++ ) {
                val = args[ p ];
                if ( val != null && val.constructor === Object ) _amdCacher.assign( _router, val );
                else throw TypeError( log.err( 21, '_restrictedType', 'preStore', 'Object' ) );
            }
        }

        fnAns = jspi.bind( newSelf );

        fnAns.construct = this.construct;
        fnAns.makeup = this.makeup;
        fnAns.makeupAll = this.makeupAll;
        fnAns.clear = _getClearFunc( newSelf );

        if ( bisFuncType ) factory( fnAns );

        return fnAns;
    };

    /**
     * 取得清除函式。
     *
     * @memberof module:jspi~
     * @func _getClearFunc
     * @param {Object} self - 創建的 this 對象。
     * @return {Function}
     */
    function _getClearFunc( objSelf ) {
        return function ( anyProduct ) {
            delete objSelf._cobjName;
            delete objSelf._router;
            delete this.construct;
            delete this.makeup;
            delete this.makeupAll;
            delete this.clear;
        };
    }

    /**
     * 建構： 自動組裝類物件 class。
     * 組裝完成後清除給予的物件及爪哇腳本介面的 this 及掛載。
     *
     * @memberof module:jspi.
     * @func construct
     * @throws {Error} 缺少 "constructor" 物件。
     * @return {Object}
     */
    jspi.construct = function () {
        var classAns;
        var key, objPrototype;
        var objPickRoute = _pickPublicRoute( this );

        if ( objPickRoute.hasOwnProperty( 'constructor' ) ) classAns = objPickRoute.constructor;
        if ( typeof classAns !== 'function' ) throw Error( log.err( 21, 'jspi_lackCtor' ) );

        objPrototype = classAns.prototype;
        delete objPickRoute.constructor;
        for ( key in objPickRoute ) objPrototype[ key ] = objPickRoute[ key ];

        this.clear( classAns );
        return classAns;
    };

    /**
     * 組裝： 只提取公開路由用於組裝。
     * 組裝完成後清除給予的物件及爪哇腳本介面的 this 及掛載。
     *
     * @memberof module:jspi.
     * @func makeup
     * @param {Function} makeup - 組裝創建函式。
     * @return {?*}
     */
    jspi.makeup = function ( fnMakeup ) {
        var anyAns = _makeup( fnMakeup, _pickPublicRoute( this ) );
        this.clear( anyAns );
        return anyAns;
    };

    /**
     * 組裝全部： 給予全部路由資料用於組裝。
     * 組裝完成後清除給予的物件及爪哇腳本介面的 this 及掛載。
     *
     * @memberof module:jspi.
     * @func makeupAll
     * @param {Function} makeup - 組裝創建函式。
     * @return {?*}
     */
    jspi.makeupAll = function ( fnMakeup ) {
        var anyAns = _makeup( fnMakeup, this() );
        this.clear( anyAns );
        return anyAns;
    };

    /**
     * 提取公開路由。
     *
     * @memberof module:jspi~
     * @func _pickPublicRoute
     * @param {module:jspi.jspi} self - 該物件啟用的爪哇腳本程式介面對象。
     * @return {Object}
     */
    function _pickPublicRoute( insSelf ) {
        var key;
        var objRoute = insSelf();
        var pickRoute = {};
        var regexUnderline = /^_/;

        for ( key in objRoute ) {
            if ( regexUnderline.test( key ) ) continue;
            pickRoute[ key ] = objRoute[ key ];
        }

        return pickRoute;
    }

    /**
     * 組裝： 組裝輔助。
     *
     * @memberof module:jspi~
     * @func _makeup
     * @param {Function} makeup - 組裝創建函式。
     * @param {Object} pickRoute - 挑選使用的路由。
     * @return {?*}
     */
    function _makeup( fnMakeup, objPickRoute ) {
        var key;
        var anyAns = fnMakeup( objPickRoute );
        for ( key in objPickRoute) delete objPickRoute[ key ];
        return anyAns;
    }

    return jspi;
},
// 事件發射員 Event Emitter
function ( jspi, log, _supportJS, cacher ) {
    var jspiEventEmitter = jspi.create( 'eventEmitter', {
        _log: log,
        _cacher: cacher,
        _arraySlice: Array.prototype.slice,
        _rewrapArr: _supportJS.rewrapArr,
        _spliceOne: _supportJS.spliceOne,
    } );

    /**
     * 事件發射員
     *
     * @memberof module:initJS.
     * @class eventEmitter
     * @param {Boolean} emitOrder - 發射順序，是否順序添加監聽至佇列。
     * `true`： 顺序： `false`： 倒序。
     * @param {Number} maxListeners - 最大監聽數。
     */
    var jspiConstructor = function ( cacher, _loadAddListenerInOrder ) {
        return function eventEmitter( bisEmitOrder, numMaxListeners ) {
            bisEmitOrder = ( typeof bisEmitOrder === 'boolean' ) ? bisEmitOrder : true;
            numMaxListeners = numMaxListeners || 0;

            this._cacher = new cacher();
            this._maxListeners = 0;

            this.setMaxListeners( numMaxListeners );
            _loadAddListenerInOrder( this, bisEmitOrder );
        };
    };

    /**
     * 設定最大監聽數。
     * <br>
     * 預設為 `0` 表示不限制數量。
     *
     * @memberof module:initJS.eventEmitter#
     * @func setMaxListeners
     * @param {Number} maxListeners - 最大監聽數。
     * @throws {TypeError} maxListeners 是為正整數。
     * @return {this}
     */
    jspiEventEmitter( 'setMaxListeners', [ '_log' ], function ( log ) {
        return function setMaxListeners( numMaxListeners ) {
            if ( typeof numMaxListeners === 'number' && numMaxListeners >= 0 )
                this._maxListeners = numMaxListeners;
            else
                throw TypeError( log.err( 21, 'eventEmitter_positiveNumber', 'setMaxListeners' ) );
            return this;
        };
    } );

    /**
     * 取得最大監聽數。
     *
     * @memberof module:initJS.eventEmitter#
     * @func getMaxListeners
     * @return {Number}
     */
    jspiEventEmitter( 'getMaxListeners', function getMaxListeners() {
        return this._maxListeners;
    } );

    /**
     * 事件名稱： 列出正監聽中的事件清單。
     *
     * @memberof module:initJS.eventEmitter#
     * @func eventNames
     * @return {Array}
     */
    jspiEventEmitter( 'eventNames', [ '_rewrapArr' ], function ( _rewrapArr ) {
        return function eventNames() {
            return _rewrapArr( this._cacher._index );
        };
    } );

    /**
     * 事件計數： 計算正監聽中的事件數量。
     *
     * @memberof module:initJS.eventEmitter#
     * @func eventCount
     * @return {Number}
     */
    jspiEventEmitter( 'eventCount', function eventCount() {
        return this._cacher._index.length;
    } );

    /**
     * 監聽函式： 取得某事件的所有監聽函式。
     *
     * @memberof module:initJS.eventEmitter#
     * @func listeners
     * @param {String} evtName - 事件名稱。
     * @return {Array}
     */
    jspiEventEmitter( 'listeners', function listeners( strEvtName ) {
        var p, len, val;
        var arrEvtQueue = this._cacher.pick( strEvtName );
        var arrAns;

        if ( !arrEvtQueue ) return [];

        len = arrEvtQueue.length;
        arrAns = new Array( len );
        for ( p = 0; p < len ; p++ ) {
            val = arrEvtQueue[ p ];
            arrAns[ p ] = val.listener || val;
        }

        return arrAns;
    } );

    /**
     * 監聽函式計數： 取得某事件監聽的數量。
     *
     * @memberof module:initJS.eventEmitter#
     * @func listenerCount
     * @param {String} evtName - 事件名稱。
     * @return {Number}
     */
    jspiEventEmitter( 'listenerCount', function listenerCount( strEvtName ) {
        var arrEvtQueue = this._cacher.pick( strEvtName );
        return !arrEvtQueue ? 0 : arrEvtQueue.length;
    } );

    /**
     * 發射堆： `emitMany` 為節點的原始函式名，用以區分執行 1、2、3 或多個參數的函式名。
     * 不過經測試 `call` 與 `apply` 之間並無明顯差異，所以棄用。
     * <br>
     * <br>
     * 添加 `try catch` 參考瀏覽器事件間錯誤不互相影響。
     *
     * @memberof module:initJS.eventEmitter~
     * @func _emitMany
     * @param {Array} evtQueue - 事件佇列。
     * @param {Array} pushArgs - 需連帶發射的參數陣列。
     * @throws `try catch` 所捕獲的錯誤。
     * @throws `return` 所捕獲的錯誤。
     */
    jspiEventEmitter( '_emitMany', function emitMany( arrEvtQueue, arrPushArgs ) {
        var errStopProcess;
        var p = 0;
        var len = arrEvtQueue.length;
        while ( p < len ) {
            try {
                errStopProcess = arrEvtQueue[ p++ ].apply( null, arrPushArgs );
            } catch ( err ) {
                // 事件間錯誤不互相影響
                setTimeout( function () { throw err } );
            }

            // 停止原程式繼續執行
            if ( errStopProcess ) throw errStopProcess;
        }
    } );

    /**
     * 發射。
     *
     * @see [nodejs/node v6.x > events.js#L130 - GitHub]{@link https://github.com/nodejs/node/blob/v6.x/lib/events.js#L130}
     *
     * @memberof module:initJS.eventEmitter#
     * @func emit
     * @param {String} evtName - 事件名稱。
     * @throws 見 {@link module:eventEmitter.eventEmitter~_emitMany} 。
     * @throws `try catch` 所捕獲的錯誤。
     * @throws `return` 所捕獲的錯誤。
     * @throws 觸發 "error" 事件。
     * @return {Boolean} 事件是否執行成功。
     */
    jspiEventEmitter( 'emit', [
        '_log',
        '_rewrapArr',
        '_arraySlice',
        '_emitMany'
    ],
    function ( log, _rewrapArr, _arraySlice, _emitMany ) {
        return function emit( strEvtName ) {
            var txtArgs;
            var evtQueue = this._cacher.pick( strEvtName );

            if ( !!evtQueue ) {
                // 參考節點作法，隔離此時的監聽陣列
                // 防止當在事件觸發時再添加事件有可能造成迴圈？
                _emitMany( _rewrapArr( evtQueue ), _arraySlice.call( arguments, 1 ) );
                return true;
            }

            // 節點將 `error` 的事件視為關鍵字
            // 此處將其與 `log` 結合使用
            // 原始邏輯：
            //     var err;
            //     if ( anyErr instanceof Error ) throw anyErr;
            //     else {
            //         err = new Error( 'eventEmitter "error" event. ( ' + anyErr + ' )' );
            //         err.context = anyErr;
            //         throw err;
            //     }
            if ( strEvtName === 'error' ) {
                txtArgs = ( arguments.length > 1 )
                    ? '(' + _arraySlice.call( arguments, 1 ).join( ', ' ) + ')'
                    : '';
                throw Error( log.err( 21, 'eventEmitter_emitError', txtArgs ) );
            }

            return false;
        };
    } );

    /**
     * 反向的索引位置。
     *
     * @memberof module:initJS.eventEmitter~
     * @func _invertedIndexOf
     * @param {?Array} evtQueue - 事件佇列。
     * 提供 `null` 因為 {@link module:initJS.cacher#pick} 的關係。
     * @param {Function} listener - 欲索引的監聽函式。
     * @return {Number}
     */
    jspiEventEmitter( '_invertedIndexOf', function _invertedIndexOf( arrEvtQueue, fnListener ) {
        if ( arrEvtQueue == null ) return -1;

        var val;
        var idx = arrEvtQueue.length;

        while ( idx-- ) {
            val = arrEvtQueue[ idx ];
            if ( val === fnListener || val.listener === fnListener ) return idx;
        }

        return -1;
    } );

    /**
     * 一次性包覆。
     *
     * @memberof module:initJS.eventEmitter~
     * @func _onceWrap
     * @param {module:initJS.eventEmitter} self - 綁定的 `this`。
     * @param {String} evtName - 事件名稱。
     * @param {Function} listener - 監聽函式。
     * @return {Function}
     */
    jspiEventEmitter( '_onceWrap', function _onceWrap( insSelf, strEvtName, fnListener ) {
        // 可測試其與節點之效能比
        // 原始邏輯：
        //     function _onceWrap(target, type, listener) {
        //         var fired = false;
        //         function g() {
        //             target.removeListener(type, g);
        //             if ( fired ) return;
        //             fired = true;
        //             listener.apply(target, arguments);
        //         }
        //         g.listener = listener;
        //         return g;
        //     }
        function tem() {
            if ( tem.fired ) return;

            var target = tem.target;
            var listener = tem.listener;

            tem.fired = true;
            target.removeListener( tem.evtName, listener );
            listener.apply( null, arguments );
        }
        tem.fired = false;
        tem.target = insSelf;
        tem.evtName = strEvtName;
        tem.listener = fnListener;
        return tem;
    } );

    /**
     * 添加監聽： 添加監聽函式工具。
     * <br><br>
     * 因
     * [nodejs v6.x > events.js#L229 - GitHub]{@link https://github.com/nodejs/node/blob/v6.x/lib/events.js#L229}
     * 此段註解了解原來會有「改寫事件佇列」行為。
     * 但由於採用 {@link module:initJS.cacher} 快取器的關係，提醒此行為者注意正確使用。
     *
     * @see [nodejs/node v6.x > events.js#L223（不理解的節點註解） - GitHub]{@link https://github.com/nodejs/node/blob/v6.x/lib/events.js#L223}
     *
     * @memberof module:initJS.eventEmitter~
     * @func _addListener
     * @param {module:initJS.eventEmitter} self - 綁定的 `this`。
     * @param {String} evtName - 事件名稱。
     * @param {Function} listener - 監聽函式。
     * @param {Boolean} onceWrap - 是否使用一次性包覆。
     * @param {Boolean} emitOrder - 發射順序，是否順序添加監聽至佇列。
     * @throws {TypeError} listener 為 Function 類型。
     * @return {module:initJS.eventEmitter} 回傳第一項參數 `self`。
     */
    jspiEventEmitter( '_addListener', [
        '_log',
        '_invertedIndexOf',
        '_onceWrap'
    ],
    function ( log, _invertedIndexOf, _onceWrap ) {
        return function _addListener( insSelf, strEvtName, fnListener, bisOnceWrap, bisEmitOrder ) {
            if ( typeof fnListener !== 'function' )
                throw TypeError( log.err( 21, '_restrictedType', 'listener', 'Function' ) );

            var numMaxListeners;
            var evtCacher = insSelf._cacher;
            var evtQueue = evtCacher.pick( strEvtName );
            var evtNameOfNew = 'newListener';

            // 參考瀏覽器在一事件佇列不能存在相同函式。
            if ( ~_invertedIndexOf( evtQueue, fnListener ) ) return insSelf;

            // 不理解其邏輯的節點註解：
            //     以防 `strEvtName === "newListener"` 所造成的無限迴圈，在添加監聽至佇列前先執行事件。
            if ( evtCacher.has( evtNameOfNew ) )
                insSelf.emit( evtNameOfNew, strEvtName, fnListener );

            // 重置 有可能被 `newListener` 改寫
            evtQueue = evtCacher.pick( strEvtName );

            // 不模仿節點優化單一的監聽佇列，不以數組陣列存放。
            if ( !evtQueue ) {
                evtQueue = [];
                evtCacher.add( strEvtName, evtQueue );
            }

            if ( bisOnceWrap ) fnListener = _onceWrap( insSelf, strEvtName, fnListener );

            if ( bisEmitOrder ) evtQueue.push( fnListener );
            else evtQueue.unshift( fnListener );

            // 以防記憶體漏失（memory leak），預防性檢查監聽數量限制。
            // 原始邏輯：
            //     var err = new Error( '...' );
            //     err.name = 'MaxListenersExceededWarning';
            //     err.emitter = insSelf;
            //     err.type = strEvtName;
            //     err.count = evtQueue.length;
            //     process.emitWarning(w);
            numMaxListeners = insSelf._maxListeners;
            if ( !evtQueue.warned && numMaxListeners !== 0 && evtQueue.length > numMaxListeners ) {
                evtQueue.warned = true;
                log.warn( 'eventEmitter_addExcessListener', evtQueue.length, strEvtName );
            }

            return insSelf;
        };
    } );

    /**
     * 依順序選項挑選裝載的添加監聽。
     *
     * @memberof module:initJS.eventEmitter~
     * @func _loadAddListenerInOrder
     * @param {module:initJS.eventEmitter} self - 綁定的 `this`。
     * @param {Boolean} emitOrder - 發射順序，是否順序添加監聽至佇列。
     */

    /**
     * 添加監聽。
     *
     * @memberof module:initJS.eventEmitter#
     * @func on
     * @alias addListener
     * @param {String} evtName - 事件名稱。
     * @param {Function} listener - 監聽函式。
     * @return {module:initJS.eventEmitter} `this`。
     */

    /**
     * 添加單次監聽。
     *
     * @memberof module:initJS.eventEmitter#
     * @func once
     * @param {String} evtName - 事件名稱。
     * @param {Function} listener - 監聽函式。
     * @return {module:initJS.eventEmitter} `this`。
     */
    jspiEventEmitter( '_loadAddListenerInOrder', [ '_addListener' ], function ( _addListener ) {
        function addListener( strEvtName, fnListener ) {
            return _addListener( this, strEvtName, fnListener, false, true );
        }

        function prependListener( strEvtName, fnListener ) {
            return _addListener( this, strEvtName, fnListener, false, false );
        }

        function addOnceListener( strEvtName, fnListener ) {
            return _addListener( this, strEvtName, fnListener, true, true );
        }

        function prependOnceListener( strEvtName, fnListener ) {
            return _addListener( this, strEvtName, fnListener, true, false );
        }

        return function _loadAddListenerInOrder( insSelf, bisEmitOrder ) {
            // 添加監聽之次序在新創時就決定，與節點不同。
            insSelf.on
                = insSelf.addListener
                = bisEmitOrder ? addListener : prependListener;

            insSelf.once = bisEmitOrder ? addOnceListener : prependOnceListener;
        };
    } );

    jspiEventEmitter( 'constructor', [ '_cacher', '_loadAddListenerInOrder' ], jspiConstructor );

    /**
     * 移除監聽： 移除監聽函式工具。
     *
     * @memberof module:initJS.eventEmitter~
     * @func _removeListener
     * @param {module:initJS.eventEmitter} self - 綁定的 `this`。
     * @param {String} evtName - 事件名稱。
     * @param {Array} evtQueue - 事件佇列。
     * @param {Number} idxListener - 監聽函式索引位置。
     * @param {Function} notify - 是否通知。
     * @return {module:initJS.eventEmitter} 回傳第一項參數 `self`。
     */
    jspiEventEmitter( '_removeListener', [ '_spliceOne' ], function ( _spliceOne ) {
        return function _removeListener( insSelf, strEvtName, arrEvtQueue, idxListener, bisNotify ) {
            var fnListener;
            var evtCacher = insSelf._cacher;

            if ( bisNotify ) {
                fnListener = arrEvtQueue[ idxListener ];
                fnListener = fnListener.listener || fnListener;
            }

            if ( arrEvtQueue.length === 1 ) {
                arrEvtQueue.length = 0;
                evtCacher.rm( strEvtName );
            } else {
                _spliceOne( arrEvtQueue, idxListener );
            }

            if ( bisNotify ) insSelf.emit( 'removeListener', strEvtName, fnListener );

            return insSelf;
        };
    } );

    /**
     * 移除監聽。
     *
     * @memberof module:initJS.eventEmitter#
     * @func removeListener
     * @param {String} evtName - 事件名稱。
     * @param {Function} listener - 監聽函式。
     * @throws {TypeError} listener 為 Function 類型。
     * @return {module:initJS.eventEmitter} `this`。
     */
    jspiEventEmitter( 'removeListener', [
        '_log',
        '_invertedIndexOf',
        '_removeListener'
    ],
    function ( log, _invertedIndexOf, _removeListener ) {
        return function removeListener( strEvtName, fnListener ) {
            if ( typeof fnListener !== 'function' )
                throw TypeError( log.err( 21, '_restrictedType', 'listener', 'Function' ) );

            var bisNotify
            var evtCacher = this._cacher;
            var evtQueue = evtCacher.pick( strEvtName );
            var idxListener = _invertedIndexOf( evtQueue, fnListener );

            if ( !~idxListener ) return insSelf;

            bisNotify = evtCacher.has( 'removeListener' );
            return _removeListener( this, strEvtName, evtQueue, idxListener, bisNotify );
        };
    } );

    /**
     * 移除一項事件的所有監聽。
     *
     * @memberof module:initJS.eventEmitter~
     * @func _removeOneEvtListeners
     * @param {module:initJS.eventEmitter} self - 綁定的 `this`。
     * @param {String} evtName - 事件名稱。
     * @param {Function} notify - 是否通知。
     * @return {module:initJS.eventEmitter} 回傳第一項參數 `self`。
     */
    jspiEventEmitter( '_removeOneEvtListeners', [
        '_rewrapArr',
        '_removeListener'
    ],
    function (  _rewrapArr, _removeListener ) {
        return function _removeOneEvtListeners( insSelf, strEvtName, bisNotify ) {
            var evtCacher = insSelf._cacher;

            if ( !evtCacher.has( strEvtName ) ) return insSelf;

            var len;
            var evtQueue = evtCacher.pick( strEvtName );
            var copyEvtQueue = _rewrapArr( evtQueue );

            if ( bisNotify ) {
                len = copyEvtQueue.length;
                // 後進先出 LIFO order
                while ( len-- ) {
                    _removeListener( insSelf, strEvtName, copyEvtQueue, len, bisNotify );
                }
            } else {
                evtCacher.rm( strEvtName );
            }

            evtQueue.length = 0;

            return insSelf;
        };
    } );

    /**
     * 移除全部監聽。
     *
     * @memberof module:initJS.eventEmitter#
     * @func removeAllListeners
     * @param {String} [evtName] - 事件名稱。
     * @return {module:initJS.eventEmitter} `this`。
     */
    jspiEventEmitter( 'removeAllListeners', [
        '_removeOneEvtListeners'
    ],
    function ( _removeOneEvtListeners ) {
        return function removeAllListeners( strEvtName ) {
            var val, len, evtNames;
            var evtCacher = this._cacher;
            var bisNotify = evtCacher.has( evtNameOfRm );
            var evtNameOfRm = 'removeListener';

            if ( arguments.length ) {
                _removeOneEvtListeners( this, strEvtName, bisNotify );
            } else {
                evtNames = evtCacher._index;
                len = evtNames.length;

                while ( len-- ) {
                    val = evtNames[ len ];
                    if ( val === evtNameOfRm ) continue;
                    _removeOneEvtListeners( this, val, bisNotify );
                }

                if ( bisNotify ) _removeOneEvtListeners( this, evtNameOfRm, bisNotify );
            }

            return this;
        };
    } );

    return jspiEventEmitter.construct();
}
);

