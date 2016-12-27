/**
 * 讀者樹補充包
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link http://bwaycer.github.io}
 */

"use strict";


// Object.extend
void function () {
    Object.extend = function extend( objMain, objPropList ){
        var p, len, method, val;
        var anyClassify, descriptor;
        var arrKeys = Object.keys( objPropList );

        for ( p = 0, len = arrKeys.length; p < len ; p++ ) {
            method = arrKeys[ p ];
            val = objPropList[ method ];
            anyClassify = _classify( val );
            descriptor = {};

            switch( anyClassify ){
                case 'setter':
                    descriptor.set = val.set;
                    break;
                case 'getter':
                    descriptor.set = val.get;
                    break;
                case 'both':
                    descriptor.set = val.set;
                    descriptor.set = val.get;
                    break;
                default:
                    descriptor.value = val;
                    descriptor.writable = true;
            }
            descriptor.enumerable = false; // 不可枚舉
            descriptor.configurable = true;

            Object.defineProperty( objMain, method, descriptor );
        }
    };

    function _classify( anyPropVal ){
        var arrPropNameList, isHaveSetter, isHaveGetter;
        var anyAns = null;

        if( anyPropVal.constructor === Object ){
            arrPropNameList = Object.keys( anyPropVal );
            isHaveSetter = arrPropNameList.indexOf('set') !== -1;
            isHaveGetter = arrPropNameList.indexOf('get') !== -1;

            if( arrPropNameList.length === 2 && isHaveSetter && isHaveGetter ) anyAns = 'both';
            else if( arrPropNameList.length === 1 && isHaveSetter ) anyAns = 'setter';
            else if( arrPropNameList.length === 1 && isHaveGetter ) anyAns = 'getter';
        }

        return anyAns;
    };
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


/*! jzTree/initAMD - BwayCer CC-BY-4.0 @license: bwaycer.github.io/license/CC-BY-4.0 */

var initAMD;
void function () {
    /**
     * 初始化異步模組定義 initAMD
     * @class initAMD
     */
    initAMD = function initAMD() {
        this.cache = {};
    }

    /**
     * @memberof initAMD.
     * @func define
     * @see {@link initAMD~_transDefineArgs}
     */
    initAMD.prototype.define = function define( strId, arrDeps, fnExport ) {
        var anyModule;
        var p, len, val, arrDepArgs;
        var cache = this.cache;
        var arrDefineArgs = _transDefineArgs.apply( null, arguments );

        strId = arrDefineArgs[ 0 ] || 'module_r' + Math.random().toString().substr( -7 );
        arrDeps = arrDefineArgs[ 1 ];
        fnExport = arrDefineArgs[ 2 ];

        len = !arrDeps ? 0 : arrDeps.length;
        if ( len > 0 ) {
            arrDepArgs = [];
            for ( p = 0; p < len ; p++ ) {
                val = arrDeps[ p ];
                if ( val in cache ) arrDepArgs.push( cache[ val ] );
                else throw Error();
            }
            anyModule = fnExport.apply( null, arrDepArgs );
        } else {
            anyModule = fnExport.apply( null );
        }

        cache[ strId ] = anyModule;
    };

    function _whatType( anyChoA ){
        return !anyChoA ? null : anyChoA.constructor;
    }

    /**
     * 轉譯定義參數。
     *
     * @memberof initAMD~
     * @func _transDefineArgs
     * @param {String} [filePath] - 模組識別碼。
     * @param {Array} [dependencies] - 依賴模組。
     * @param {*} factory - 模組物件。
     * 若 ` dependencies ` 有參考的依賴模組，則 ` factory ` 為 ` Function ` 型別；
     * 反之則任意型別。
     */
    function _transDefineArgs() {
        var isNotAllowed = true;
        var filePath = null;
        var dependencies = null;
        var factory;
        var typeofArgu0;
        var Argu0IsString, Argu1IsArray;

        switch( arguments.length ){
            case 1:
                isNotAllowed = false;
                factory = arguments[0];
                break;
            case 2:
                typeofArgu0 = _whatType( arguments[0] );
                factory = arguments[1];
                if( typeofArgu0 === String ){
                    isNotAllowed = false;
                    filePath = arguments[0];
                }else if( typeofArgu0 === Array && typeof factory === 'function' ){
                    isNotAllowed = false;
                    dependencies = arguments[0];
                }
                break;
            case 3:
                Argu0IsString = typeof arguments[0] === 'string';
                Argu1IsArray = _whatType( arguments[1] ) === Array;
                if( Argu0IsString && Argu1IsArray ){
                    isNotAllowed = false;
                    filePath = arguments[0];
                    dependencies = arguments[1];
                    factory = arguments[2];
                }
                break;
        }

        if( isNotAllowed ) throw TypeError('The arguments type of define function is not allowed.');

        return [ filePath, dependencies, factory ];
    }
}();

var browserAMD = new initAMD();
window.define = browserAMD.define.bind( browserAMD );

