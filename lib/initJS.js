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
    var envDev = false;

    var idx = 0;
    var args = arguments;
    var _strins, _supportJS, _parseAMDArgs, _amdCacher;
    var logMsgPkg, cacher, jspi;

    logMsgPkg     = args[ idx++ ];
    _strins       = args[ idx++ ]( logMsgPkg );
    _supportJS    = args[ idx++ ]();
    cacher        = args[ idx++ ]( _supportJS );
    _parseAMDArgs = args[ idx++ ]( _strins );
    _amdCacher    = args[ idx++ ]( _strins, cacher );

    jspi    = args[ idx++ ]( envDev, _strins, _parseAMDArgs, _amdCacher );
}(
/**
 * 日誌訊息包
 *
 * @memberof module:initJS.
 * @var {Object} logMsgPackage
 */
{
    _undefined: 'Error log is undefined.',
    _illegalInvocation: 'Illegal invocation.',
    _typeError: 'a value is not of the expected type.',
    _restrictedType: '%s is %s type.',
    parseAMDArgs_notAllowed: 'The arguments of "define" function is not allowed type.',
    amdCacher_notFoundObject: '%s not found "%s" object.',
    jspi_lackCtor: 'lack "constructor" object.',
},
// _strins
function ( logMsgPackage ) {
    var _regexSpecifySymbol = /%(.)/g;

    /**
     * 文字插入。
     *
     * @memberof module:initJS~
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
// cacher
function ( supportJS ) {
    var emptyEnum = supportJS.emptyEnum;
    var spliceOne = supportJS.spliceOne;

    /**
     * 捕手： 鍵值快取器。
     *
     * @memberof module:initJS.
     * @class cacher
     */
    function cacher() {
        // 將物件名稱存為陣列可解決取得物件名稱的方式與空枚舉無法計數問題。
        // 取得物件名稱的方式： `Object.keys()、`Reflect.ownKeys()`。
        this._index = new Array( 0 );
        this._cache = new emptyEnum();
    }

    /**
     * 空枚舉。
     *
     * @memberof module:initJS.cacher.
     * @func emptyEnum
     *
     * @see module:initJS~emptyEnum
     */
    cacher.emptyEnum = emptyEnum;

    /**
     * 一單位接合。
     *
     * @memberof module:initJS.cacher.
     * @func spliceOne
     *
     * @see module:initJS~spliceOne
     */
    cacher.spliceOne = spliceOne;

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
            spliceOne( _index, idx );
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
        this._cache = new emptyEnum();
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
function ( _strins ) {
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

        if ( bisNotAllowed ) throw TypeError( _strins( 'parseAMDArgs_notAllowed' ) );

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
function ( _strins, cacher ) {
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
        throw Error( _strins( 'amdCacher_notFoundObject', this._name, strName ) );
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
                else throw Error( _strins( 'amdCacher_notFoundObject', this._name, val ) );
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
            else throw Error( _strins( 'amdCacher_notFoundObject', this._name, val ) );
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
function ( envDev, _strins, _parseAMDArgs, _amdCacher ) {
    /**
     * 爪哇腳本程式介面。
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
     *
     * @see module:initJS~_parseAMDArgs
     * @see module:jspi~_callJspi
     */
    function jspi( strPathName, arrDeps, anyFactory ) {
        if ( this._cobjName == null ) throw Error( _strins( '_illegalInvocation' ) );
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

        if ( typeof anyOption !== 'string' ) throw TypeError( _strins( '_typeError' ) );

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
        if ( typeof strCobjName !== 'string' ) throw TypeError( _strins( '_illegalInvocation' ) );

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
                else throw TypeError( _strins( '_restrictedType', 'preStore', 'Object' ) );
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

    if ( envDev ) jspi.dev = {};

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
            if ( envDev ) {
                var devCobj = jspi.dev[ objSelf._cobjName ] = objSelf._router.pick( 'all' );
                devCobj.jspiProduct = anyProduct;
            }

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
        if ( typeof classAns !== 'function' ) throw Error( _strins( 'jspi_lackCtor' ) );

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
    function _pickPublicRoute( self ) {
        var key;
        var objRoute = self();
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
}
);

