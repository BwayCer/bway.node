
"use strict";


// jzAdditional
void function () {
    // Object.emptyEnum
    void function () {
         // 空枚舉： 創建一個「乾淨」的空物件陣列。
         // 其運用實例實作比調用 ` Object.create( null ) ` 更有效率。（測試於 v8 v4.9）
         Object.emptyEnum = function emptyEnum( objArgu ) {
             if ( !objArgu ) return;
             var key;
             for ( key in objArgu ) this[ key ] = objArgu[ key ];
         };
         Object.emptyEnum.prototype = Object.create( null );
    }();

    // Object.extend
    void function () {
        var _emptyEnum = Object.emptyEnum;

        /***
         * 擴展： 不限於繼承（inherit）的擴展。
         *
         * @param {*} main - 物件對象。
         * @param {Object} propList - 補充的屬性清單。
         */
        Object.extend = function extend( anyMain, anyChoA, anyChoB ) {
            var key, val;
            if ( typeof anyChoA === 'string' ) _defineProperty( anyMain, anyChoA, anyChoB );
            else for ( key in anyChoA ) _defineProperty( anyMain, key, anyChoA[ key ] );
        };

        function _defineProperty( anyMain, strPropName, anyPropVal ) {
            var anyValType = _classifyVal( anyPropVal );
            var descriptor = new _emptyEnum();

            switch( anyValType ){
                case 'setter':
                    descriptor.set = anyPropVal.set;
                    break;
                case 'getter':
                    descriptor.set = anyPropVal.get;
                    break;
                case 'both':
                    descriptor.set = anyPropVal.set;
                    descriptor.set = anyPropVal.get;
                    break;
                default:
                    descriptor.value = anyPropVal;
                    descriptor.writable = true;
            }
            descriptor.enumerable = false; // 不可枚舉
            descriptor.configurable = true;

            Object.defineProperty( anyMain, strPropName, descriptor );
        }

        /***
         * 分類屬性值。
         *
         * @param {*} propVal - 屬性值。
         * @return {?String} valType
         * <br>
         * * `null`： 使用者賦值。
         * <br>
         * * `setter`： `setter` 類型。
         * <br>
         * * `getter`： `getter` 類型。
         * <br>
         * * `both`： `setter` 和 `getter` 類型。
         */
        function _classifyVal( anyPropVal ) {
            var len, isHasSetter, isHasGetter;
            var anyAns = null;

            if( anyPropVal.constructor === Object ){
                len = Object.keys( anyPropVal ).length;
                isHasSetter = anyPropVal.hasOwnProperty( 'set' );
                isHasGetter = anyPropVal.hasOwnProperty( 'get' );

                if( len === 2 && isHasSetter && isHasGetter ) anyAns = 'both';
                else if( len === 1 && isHasSetter ) anyAns = 'setter';
                else if( len === 1 && isHasGetter ) anyAns = 'getter';
            }

            return anyAns;
        }
    }();

    Object.extend( Array, {
        transClone: function transClone( anyArguOfArray ) {
            var p;
            var len = anyArguOfArray.length;
            var newList = new Array( len );
            for ( p = 0; p < len ; p++ ) newList[ p ] = anyArguOfArray[ p ];
            return newList;
        },
    } );

    Object.extend( Array.prototype, {
        qSplice: function qSplice( numStart, numNum ) {
            var p, newStart, newEnd, newLen, newList;
            var len = this.length;
            var isAllowTypeArgu1 = ( typeof numStart === 'number' && 0 <= numStart && numStart < len );
            var isAllowTypeArgu2 = ( typeof numNum === 'number' && 0 <= numNum );

            if ( isAllowTypeArgu1 && isAllowTypeArgu2 && numStart + numNum <= len ) {
                newStart = numStart;
                newEnd = numStart + numNum;
                newLen = numNum;
            } else if ( isAllowTypeArgu1 ) {
                newStart = numStart;
                newEnd = len;
                newLen = newEnd - newStart;
            } else return new Array( 0 );

            newList = new Array( newLen );
            for ( p = 0; newStart < newEnd ; p++, newStart++ ) newList[ p ] = this[ newStart ];
            return newList;
        },
    } );
}();

void function ( fnGetTransDefineArgs, fnGetSimpleDefine ) {
    var topJS;
    var _transDefineArgs = fnGetTransDefineArgs();
    var rootearth = new Object.emptyEnum();
    var define = fnGetSimpleDefine( rootearth, _transDefineArgs );

    if ( typeof exports !== undefined ) topJS = global;
    else if ( typeof window !== undefined ) topJS = window;
    else throw Error();

    topJS.rootearth = rootearth;
    console.log( rootearth );
}(
function () {
    function _whatType( anyChoA ){
        return !anyChoA ? null : anyChoA.constructor;
    }

    /**
     * 轉譯定義參數。
     *
     * @memberof module:initAMD~
     * @func _transDefineArgs
     * @param {Number} lenOfDefineArgs - 定義函式所接受到的參數長度。
     * @param {String} [filePath] - 模組識別碼。
     * @param {Array} [dependencies] - 依賴模組。
     * @param {*} factory - 模組物件。
     * 若 `dependencies` 有參考的依賴模組，則 `factory` 為 `Function` 型別；
     * 反之則任意型別。
     */
    function _transDefineArgs( lenOfDefineArgs ) {
        var isNotAllowed = true;
        var filePath = null;
        var dependencies = null;
        var factory;
        var typeofArgu0;
        var Argu0IsString, Argu1IsArray;

        switch( lenOfDefineArgs ){
            case 1:
                isNotAllowed = false;
                factory = arguments[ 1 ];
                break;
            case 2:
                typeofArgu0 = _whatType( arguments[ 1 ] );
                factory = arguments[ 2 ];
                if( typeofArgu0 === String ){
                    isNotAllowed = false;
                    filePath = arguments[ 1 ];
                }else if( typeofArgu0 === Array && typeof factory === 'function' ){
                    isNotAllowed = false;
                    dependencies = arguments[ 1 ];
                }
                break;
            case 3:
                Argu0IsString = typeof arguments[ 1 ] === 'string';
                Argu1IsArray = _whatType( arguments[ 2 ] ) === Array;
                if( Argu0IsString && Argu1IsArray ){
                    isNotAllowed = false;
                    filePath = arguments[ 1 ];
                    dependencies = arguments[ 2 ];
                    factory = arguments[ 3 ];
                }
                break;
        }

        if( isNotAllowed ) throw TypeError('The arguments type of define function is not allowed.');

        return [ filePath, dependencies, factory ];
    }

    return _transDefineArgs;
},
function ( cache, _transDefineArgs ) {
    function defaultId() {
        return 'module_r' + Math.random().toString().substr( -7 );
    }

    function simpleDefine( strId, arrDeps, fnExport ) {
        var anyModule;
        var p, len, val, arrDepArgs;
        var arrDefineArgs = _transDefineArgs( arguments.length, strId, arrDeps, fnExport );

        strId = arrDefineArgs[ 0 ] || defaultId();
        arrDeps = arrDefineArgs[ 1 ];
        fnExport = arrDefineArgs[ 2 ];

        len = !arrDeps ? 0 : arrDeps.length;
        if ( len > 0 ) {
            arrDepArgs = [];
            for ( p = 0; p < len ; p++ ) {
                val = arrDeps[ p ];
                if ( val in cache ) arrDepArgs.push( cache[ val ] );
                else throw Error( 'Not Found: ' +  val );
            }
            anyModule = fnExport.apply( null, arrDepArgs );
        } else {
            anyModule = fnExport.call( null );
        }

        cache[ strId ] = anyModule;
    }

    return simpleDefine;
}
);



/**
 * 初始化異步模組定義 initAMD
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link http://bwaycer.github.io}
 */

"use strict";

// console.log( global );

(function( global ){
    console.log( global );
    console.log( global.hasOwnProperty );
}( this ));


/*
    var domain = require('domain');
    var EventEmitter = require('events');
    const inherits = require('util').inherits;

    var tryCatch = new EventEmitter();

    //抛出一个异步异常
    function callbackError() {
        console.log( this );
        var emitter2 = new EventEmitter();
        setTimeout( function(){
            throw new Error("一个异步异常");
            // emitter2.emit( 'error', new Error('通过 domain2 处理') );
        }, 100 );
    }

    // callbackError.on( 'error', function( err ) {
    //     console.log( 'domain', err );
    // } );

    process.on( 'uncaughtException', function( err ){
        console.log( arguments );
        // process.exit() // throw err;
    } );

    // var d = domain.create();
    // d.on( 'error', function( err ) {
    //     console.log( 'domain', err );
    // } );
    // d.run( callbackError );
    callbackError();
 */


/*! jzTree/initAMD - BwayCer CC-BY-4.0 @license: bwaycer.github.io/license/CC-BY-4.0 */

/**
 * 初始化異步模組定義
 * @module initAMD
 */

throw 123;
throw {a:234};
throw 'rrr';
void function ( fnGetParseDefineArgs, fnGetSimpleDefine, fnExport ) {
    var initAMD, insInitAMD;
    var _parseDefineArgs = fnGetParseDefineArgs();
    var rootearth = {};
    var define = fnGetSimpleDefine( rootearth, _parseDefineArgs );

    global.define = define;
    require( './support' );
    require( './log' );
    require( './eventEmitter' );

    initAMD = fnExport(
        _parseDefineArgs,
        rootearth[ 'jzTree/log' ],
        rootearth[ 'jzTree/eventEmitter' ]
    );
    rootearth[ 'jzTree/initAMD' ] = initAMD;
    // insInitAMD = new initAMD;
    // insInitAMD.cache = cache;
    // global.define = insInitAMD.define.bind( insInitAMD );

    console.log( rootearth );
}(
function () {
    function _whatType( anyChoA ){
        return !anyChoA ? null : anyChoA.constructor;
    }

    /**
     * 解析定義參數。
     *
     * @memberof module:initAMD~
     * @func _parseDefineArgs
     * @param {Number} lenOfDefineArgs - 定義函式所接受到的參數長度。
     * @param {String} [filePath] - 模組識別碼。
     * @param {Array} [dependencies] - 依賴模組。
     * @param {*} factory - 模組物件。
     * 若 `dependencies` 有參考的依賴模組，則 `factory` 為 `Function` 型別；
     * 反之則任意型別。
     */
    function _parseDefineArgs( lenOfDefineArgs ) {
        var isNotAllowed = true;
        var filePath = null;
        var dependencies = null;
        var factory;
        var typeofArgu0;
        var argu0IsString, argu1IsArray, argu2IsFunc;

        switch( lenOfDefineArgs ){
            case 1:
                isNotAllowed = false;
                factory = arguments[ 1 ];
                break;
            case 2:
                typeofArgu0 = _whatType( arguments[ 1 ] );
                factory = arguments[ 2 ];
                if( typeofArgu0 === String ){
                    isNotAllowed = false;
                    filePath = arguments[ 1 ];
                }else if( typeofArgu0 === Array && typeof factory === 'function' ){
                    isNotAllowed = false;
                    dependencies = arguments[ 1 ];
                }
                break;
            case 3:
                argu0IsString = typeof arguments[ 1 ] === 'string';
                argu1IsArray = _whatType( arguments[ 2 ] ) === Array;
                argu2IsFunc = typeof arguments[ 3 ] === 'function';
                if( argu0IsString && argu1IsArray && argu2IsFunc ){
                    isNotAllowed = false;
                    filePath = arguments[ 1 ];
                    dependencies = arguments[ 2 ];
                    factory = arguments[ 3 ];
                }
                break;
        }

        if( isNotAllowed ) throw TypeError('The arguments type of define function is not allowed.');

        return [ filePath, dependencies, factory ];
    }

    return _parseDefineArgs;
},
function ( cache, _parseDefineArgs ) {
    function defaultId() {
        return 'module_r' + Math.random().toString().substr( -7 );
    }

    function simpleDefine( strId, arrDeps, fnExport ) {
        var anyModule;
        var p, len, val, arrDepArgs;
        var arrDefineArgs = _parseDefineArgs( arguments.length, strId, arrDeps, fnExport );

        strId = arrDefineArgs[ 0 ] || defaultId();
        arrDeps = arrDefineArgs[ 1 ];
        fnExport = arrDefineArgs[ 2 ];

        len = !arrDeps ? 0 : arrDeps.length;
        if ( len > 0 ) {
            arrDepArgs = [];
            for ( p = 0; p < len ; p++ ) {
                val = arrDeps[ p ];
                if ( val in cache ) arrDepArgs.push( cache[ val ] );
                else throw Error( 'Not Found: ' +  val );
            }
            anyModule = fnExport.apply( null, arrDepArgs );
        } else {
            anyModule = fnExport.call( null );
        }

        cache[ strId ] = anyModule;
    }

    return simpleDefine;
}
);


