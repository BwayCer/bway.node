/**
 * 爪哇腳本語言支援補充包 support_pure
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */


order( [ '/pure/support' ], function ( support ) {
    "use strict";

    /***
     * 空枚舉： 創建一個「乾淨」的空物件陣列。
     * <br>
     * 其運用實例實作比調用 `Object.create( null )` 更有效率。（翻譯自 node 注釋）
     *
     * @see [nodejs/node v7.x > events.js#L5 - GitHub]{@link https://github.com/nodejs/node/blob/v7.x/lib/events.js#L5}
     *
     * @func emptyEnum
     */
    support.emptyEnum = function emptyEnum() {};
    support.emptyEnum.prototype = Object.create( null );

    /***
     * 陣列的重新包裝。
     *
     * @func rewrapArr
     * @param {Array} target - 複製目標對象。
     * @return {Array}
     */
    support.rewrapArr = function rewrapArr( arrTarget ) {
        var len = arrTarget.length;
        var arrAns = new Array( len );

        while ( len-- ) arrAns[ len ] = arrTarget[ len ];
        return arrAns;
    };

    /***
     * 一單位接合。
     * 其效率比 `Array#splice` 使用兩個參數的狀況還快約 1.5 倍。（翻譯自 node 注釋）
     * <br>
     * 但測試結果，陣列項目需少於 16 樣時才有明顯效果。
     * 當陣列長度為 16 時，效率與 `Array#splice` 相比可達近一倍快，且項目愈少愈快。
     *
     * @see [nodejs/node v8.x > events.js#L492 - GitHub]{@link https://github.com/nodejs/node/blob/v8.x/lib/events.js#L492}
     *
     * @func spliceOne
     * @param {Array} list - 目標陣列。
     * @param {Number} index - 刪除項目的引索位置。
     * @return {?*} 移除的物件。
     */
    support.spliceOne = function spliceOne( arrList, numIndex ) {
        if ( numIndex === -1 ) return null;

        var len = arrList.length - 1;
        var anyAns = arrList[ numIndex ];

        while ( numIndex < len ) arrList[ numIndex ] = arrList[ ++numIndex ];
        arrList.pop();

        return anyAns;
    };
} );

void function ( support ) {
    support
        .checkProp(
            [ Object, 'defineProperty' ],
            'JS Run Platform Not Support。(%object).(%propname)'
        )
        .addProp( String.prototype, {
            repeat: function repeat( numCount ){
                if( numCount < 0 ) throw RangeError('Invalid count value');

                numCount = parseInt( numCount );

                var strOrigTxt = this;
                var strAns = '';

                while ( numCount-- ) strAns += strOrigTxt;

                return strAns;
            },
        } )
        .addProp( Array.prototype, {
            map: function map( fnCallback ){
                var p, len;
                for ( p = 0, len = this.length; p < len ; p++ ) fnCallback( this[ p ], p, this );
            },
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
        } )
        .addProp( Function.prototype, {
            extend: function extend( objPropList ) {
                Object.extend( this.prototype, objPropList );
                return this;
            },
        } )
    ;

    function _whatType( anyChoA ){
        return !anyChoA ? null : anyChoA.constructor;
    }




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

    // Object.batchSetProperty
    // and Object.prototype.setProperty
    void function(){
        Object.batchSetProperty = batchSetProperty;
        Object.prototype.setProperty = function ( anyPropVal ) {
            return batchSetProperty( this, anyPropVal );
        };

        /**
         * 批量設定屬性。
         *
         * @param {Object} main
         * @param {Object} propList - 批量的屬性清單。
         */
        function batchSetProperty( objMain, objPropList ) {
            var key, item;
            for ( key in objPropList )
                batchSetProperty.oneSetProperty( objMain, key, objPropList[ key ] );
            return objMain;
        };

        batchSetProperty._regex = /^(set|get) ((?:.+)?[^\s])\(\)/;

        batchSetProperty.oneSetProperty = function oneSetProperty( objMain, strName, anyPropVal ) {
            var descriptor;
            var regex = this._regex || /^(set|get) ((?:.+)?[^\s])\(\)/;
            var matchPropClassify = strName.match( regex );

            if ( !matchPropClassify ) {
                objMain[ strName ] = anyPropVal;
                // descriptor = { enumerable: true, configurable: true, writable: true };
                // descriptor.value = anyPropVal;
                // Object.defineProperty( objMain, strProperty, descriptor );
            } else {
                descriptor = { enumerable: true, configurable: true };
                descriptor[ ( matchPropClassify[0] === 'set' )? 'set' : 'get' ] = anyPropVal;
                Object.defineProperty( objMain, strProperty, descriptor );
            }

            return objMain;
        };
    }();

    void function(){
        initAMD.support
            .checkProp( Object, [ 'defineProperty' ], 'JS Run Platform Not Support。（ %main.%method ）' )
            .addProp( String.prototype, {
                repeat: function repeat( count ) {
                    count = parseInt( count );

                    if( count < 0 ) throw RangeError('Invalid count value');

                    var strAns = '';
                    while ( count-- ) strAns += this;
                    return strAns;
                },
                splice: function splice( numIdx, rmLen, strInsert ) {
                    rmLen = rmLen > 0 ? parseInt( rmLen ) : 0;
                    return this.slice( 0, numIdx ) + strInsert + this.slice( numIdx + Math.abs( rmLen ) );
                },
            } )
            .addProp( Array.prototype, {
                map: function map( fnCallback ) {
                    for (var p = 0, len = this.length; p < len ; p++)
                        fnCallback( this[ p ], p, this );
                },
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
                    for (p = 0; newStart < newEnd ; p++, newStart++) newList[ p ] = this[ newStart ];
                    return newList;
                },
            } )
            .addProp( Function.prototype, {
                extend: function extend( objPropList ){
                    var selfProto = this.prototype;
                    Object.batchSetProperty( selfProto, objPropList );
                    return this;
                },
                closBind: function closBind( objSelf ) {
                    var p, len, lenOfPushArgus;
                    var self = this;
                    var pushArgus = [];
                    for (p = 2, len = arguments.length; p < len ; p++) pushArgus.push( arguments[ p ] );
                    lenOfPushArgus = pushArgus.length;
                    return function () {
                        var newPushArgus;
                        if ( !!arguments.length ) {
                            newPushArgus = Array.transClone( pushArgus );
                            for ( p = lenOfPushArgus, len = arguments.length; p < len ; p++) newPushArgus.push( arguments[ p ] );
                        } else newPushArgus = pushArgus;

                        return self.apply( objSelf, newPushArgus );
                    };
                },
            } )
        ;
    }();
};

