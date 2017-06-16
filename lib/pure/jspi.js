/*! JavaScript Programming Interface @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 爪哇腳本程式介面 JavaScript Programming Interface
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */

"use strict";


/**
 * 爪哇腳本程式介面
 * <br><br>
 * 在複雜的還境下維持乾淨的範圍鏈，並提供針對單一函式的測試可能。
 *
 * @module jspi
 */

order( '/pure/jspi', [
    '/pure/log',
    '/pure/internWaiter',
], function ( log, internWaiter ) {
    log.setMsg( {
        jspi_notFoundCtor: 'Not found "constructor" object.',
    } );

    /**
     * 爪哇腳本程式介面。
     *
     * @see module:jspi~_callJspi
     *
     * @memberof module:jspi.
     * @func jspi
     * @param {(null|String|Array)} option - 提問選項或路徑名稱。
     * @param {?Array} [dependencies] - 依賴模組。
     * @param {?*} factory - 模組物件。
     * @throws {Error} 非法調用。 Error(21, _illegalInvocation)
     * @return {?*} 當有提問選項時，會有對應的回傳值。
     */
    function jspi( anyOption ) {
        var order = this.order;

        if ( !order ) throw Error( log.err( 21, '_illegalInvocation' ) );

        var pickOpt;
        var args = arguments;
        var lenArgs = args.length;

        if ( lenArgs < 2 ) {
            if ( anyOption == null ) pickOpt = 'JSPI_PICKALL';
            else switch ( anyOption.constructor ) {
                case String: pickOpt = anyOption;
                case Array: pickOpt = anyOption;
            }

            if ( pickOpt ) return this.pick( pickOpt );
        }

        if ( typeof anyOption !== 'string' ) throw TypeError( log.err( 21, '_typeError' ) );

        switch ( lenArgs ) {
            case 2: return order( anyOption, args[ 1 ] );
            default: return order( anyOption, args[ 1 ], args[ 2 ] );
        }
    }

    /**
     * 創建： 啟用專屬物件的爪哇腳本程式介面。
     *
     * @memberof! module:jspi.
     * @alias jspi.create
     * @func jspi.create
     * @param {...Object} [preStore] - 預設佇存物。
     * @param {Function} [factory] - 工廠。 提供隔離空間並縮排編寫。
     * @throws {TypeError} （棄用） preStore 為 Object 類型。 TypeError(21, _restrictedType)
     * @return {Function} 以 `bind()` 創建的 {@link module:jspi.jspi}。
     * @return {*} 若有 `factory()` 時以其回傳值回應。
     */
    jspi.create = function () {
        var p, assign;
        var args = arguments;
        var len = args.length;
        var factory = args[ len - 1 ];
        var insWaiter = new internWaiter();
        var cache = insWaiter._cache;
        var newSelf = {
            cache: cache,
            order: insWaiter.order,
            pick: this.pick,
        };
        var fnAns;

        insWaiter._blockParseId = true;
        insWaiter.setMaxTimeout( 200 );

        if ( typeof factory === 'function' ) len--;
        else factory = null;

        if ( len ) {
            assign = internWaiter.assign;
            for ( p = 0; p < len ; p++ ) assign( cache, args[ p ] );
        }

        fnAns = jspi.bind( newSelf );

        fnAns.construct = this.construct;
        fnAns.makeup = this.makeup;
        fnAns.makeupAll = this.makeupAll;
        fnAns.clear = this._getClearFunc( newSelf );

        if ( factory ) factory( fnAns );

        return fnAns;
    };

    /**
     * 提取。
     *
     * @memberof! module:jspi.
     * @alias jspi.pick
     * @func jspi.pick
     * @param {(String|Array)} option - 提問選項。
     * @return {*}
     */
    jspi.pick = function ( anyOption ) {
        var p, len, key;
        var cache = this.cache;
        var anyAns;

        if ( anyOption === 'JSPI_PICKALL' ) {
            anyAns = {};
            for ( key in cache ) anyAns[ key ] = cache[ key ];
        } else if ( typeof anyOption === 'string' ) {
            anyAns = cache[ anyOption ] || null;
        } else {
            anyAns = {};
            for ( p = 0, len = anyOption.length; p < len ; p++ ) {
                key = anyOption[ p ];
                anyAns[ key ] = cache[ key ] || null;
            }
        }

        return anyAns;
    };

    /**
     * 取得清除函式。
     *
     * @memberof! module:jspi.
     * @alias jspi._getClearFunc
     * @func jspi._getClearFunc
     * @param {Object} self - 創建的 this 對象。
     * @return {Function}
     */
    jspi._getClearFunc = function _getClearFunc( objSelf ) {
        return function ( anyProduct ) {
            delete objSelf.cache;
            delete objSelf.order;
            delete objSelf.pick;
            delete this.construct;
            delete this.makeup;
            delete this.makeupAll;
            delete this.clear;
        };
    };

    /**
     * 建構： 自動組裝類物件。
     * 組裝完成後清除給予的物件及爪哇腳本介面的 this 及掛載。
     *
     * @memberof! module:jspi.
     * @alias jspi.construct
     * @func jspi.construct
     * @param {Function} [makeup] - 組裝創建函式。
     * @throws {Error} 找不到 "constructor" 物件。 Error(21, jspi_notFoundCtor)
     * @return {Function}
     */
    jspi.construct = function ( fnMakeup ) {
        var classAns;
        var key, proto;
        var pickRoute = _pickRoute( this );
        var publicRoute = pickRoute[ 0 ];

        if ( publicRoute.hasOwnProperty( 'constructor' ) ) classAns = publicRoute.constructor;
        if ( typeof classAns !== 'function' ) throw Error( log.err( 21, 'jspi_notFoundCtor' ) );

        proto = classAns.prototype;
        delete publicRoute.constructor;
        for ( key in publicRoute ) proto[ key ] = publicRoute[ key ];

        if ( fnMakeup ) {
            fnMakeup( classAns, publicRoute, pickRoute[ 1 ] );
            _destroy( pickRoute[ 1 ] );
        }

        this.clear( classAns );
        return classAns;
    };

    /**
     * 組裝： 只提取公開路由用於組裝。
     * 組裝全部： 給予全部路由資料用於組裝。
     * 組裝完成後清除給予的物件及爪哇腳本介面的 this 及掛載。
     *
     * @memberof! module:jspi.
     * @alias jspi.makeup
     * @func jspi.makeup
     * @param {Function} makeup - 組裝創建函式。
     * @return {?*}
     */
    jspi.makeup = function ( fnMakeup ) {
        var pickRoute = _pickRoute( this );
        var anyAns = fnMakeup( pickRoute[ 0 ], pickRoute[ 1 ] );
        _destroy( pickRoute[ 1 ] );
        this.clear( anyAns );
        return anyAns;
    };

    /**
     * 提取公開路由。
     *
     * @memberof module:jspi~
     * @func _pickRoute
     * @param {module:jspi.jspi} self - 該物件啟用的爪哇腳本程式介面對象。
     * @return {Object}
     */
    function _pickRoute( insSelf ) {
        var key, val;
        var objRoute = insSelf();
        var publicRoute = {};
        var privateRoute = {};
        var regexUnderline = /^_/;

        for ( key in objRoute ) {
            val = objRoute[ key ];
            if ( regexUnderline.test( key ) ) privateRoute[ key ] = val;
            else publicRoute[ key ] = val
        }

        return [ publicRoute, privateRoute ];
    }

    /**
     * 銷毀。
     *
     * @memberof module:jspi~
     * @func _destroy
     * @param {Object} target - 銷毀對象。
     */
    function _destroy( objTarget ) {
        var key;
        for ( key in objTarget ) delete objTarget[ key ];
    }

    return jspi;
} );

