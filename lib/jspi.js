/**
 * 爪哇腳本程式介面 JavaScript Programming Interface
 *
 * @module jspi
 */

// amdCacher_notFoundObject: '%s not found "%s" object.',
// jspi_lackCtor: 'lack "constructor" object.',


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
}

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
}

