'use strict';

var Benchmark = require( 'benchmark' );
var suite_create = new Benchmark.Suite;
var suite_use = new Benchmark.Suite;

Benchmark.prototype.setup = function() {
    var _supportJS = (function () {
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
    }());

    var emptyEnum = _supportJS.emptyEnum;

    var emptyEnumCacher = (function ( _supportJS ) {
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
            var oIdx = idx;
            var oIsExist = bisExist;

            if ( !~oIdx ) {
                // console.log(_index, _cache);
                console.log(_index.join( ', ' ));
                console.log(strKey, oIdx, oIsExist);
            }

            if ( ~idx ) {
                _spliceOne( _index, idx );
                idx = _index.indexOf( strKey );
            }

            if ( bisExist ) bisExist = delete _cache[ strKey ];

            if ( !(!~idx && bisExist) ) {
                // console.log(_index, _cache);
                console.log(strKey, oIdx, oIsExist);
                console.log(!~idx, bisExist);
            }

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
    }( _supportJS ));

    var pairCacher = (function ( _supportJS ) {
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
            this._cache = [];
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
            var _cache = this._cache;
            var idx = _index.indexOf( strKey );

            if ( ~idx ) _cache[ idx ] = anyVal;
            else {
                _index.push( strKey );
                _cache.push( anyVal );
            }

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

            if ( ~idx ) {
                _spliceOne( _index, idx );
                _spliceOne( _cache, idx );
                idx = _index.indexOf( strKey );
            }

            return !~idx;
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
            this._cache.length = 0;
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
            var idx = this._index.indexOf( strKey );
            return ~idx ? this._cache[ idx ] : null;
        };

        return cacher;
    }( _supportJS ));


    var word = [
        '$', '_',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ];
    var keys = [];
    var pickNumber = [];

    for ( idx = 0; idx < 99 ; idx++ ) {
        var random = Math.random().toString();
        var key = word[ random.slice( -2 ) ]
            + word[ random.slice( -4, -2 ) ]
            + word[ random.slice( -6, -4 ) ]
            + word[ random.slice( -8, -6 ) ]
            + word[ random.slice( -10, -8 ) ];
        keys.push( key );
        if ( idx % 30 === 0 ) pickNumber.push( key );
    }
};


suite_create
    .add( '由 {} 建立', function () {
        var ans = {};
    } )
    .add( '由 emptyEnum 建立', function () {
        var ans = new emptyEnum();
    } )
    .add( '由 emptyEnumCacher 建立', function () {
        var ans = new emptyEnumCacher();
    } )
    .add( '由 pairCacher 建立', function () {
        var ans = new pairCacher();
    } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '實例最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;

suite_use
    .add( '使用 {} 方式', function () {
        var idx, len, val;
        var commonCobj = {};
        for ( idx = 0, len = keys.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            commonCobj[ val ] = val;
        }
        for ( idx = 0, len = pickNumber.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            if ( commonCobj[ val ] !== val ) {
                console.log( '由 {} 提取失敗' );
                throw Error('由 {} 提取失敗');
            }
            if ( !( delete commonCobj[ val ] ) ) {
                console.log( '由 {} 移除失敗' );
                throw Error( '由 {} 移除失敗' );
            }
        }
    } )
    .add( '使用 emptyEnum 方式', function () {
        var idx, len, val;
        var emptyEnumCobj = new emptyEnum();
        for ( idx = 0, len = keys.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            emptyEnumCobj[ val ] = val;
        }
        for ( idx = 0, len = pickNumber.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            if ( emptyEnumCobj[ val ] !== val ) {
                console.log( '由 {} 提取失敗' );
                throw Error('由 {} 提取失敗');
            }
            if ( !( delete emptyEnumCobj[ val ] ) ) {
                console.log( '由 {} 移除失敗' );
                throw Error( '由 {} 移除失敗' );
            }
        }
    } )
    .add( '使用 emptyEnumCacher 方式', function () {
        var idx, len, val;
        var insEmptyEnumCacher = new emptyEnumCacher();
        for ( idx = 0, len = keys.length; idx < len ; idx++ ) {
            val = keys[ idx ];
        }
        for ( idx = 0, len = keys.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            insEmptyEnumCacher.add( val, val );
        }
        for ( idx = 0, len = pickNumber.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            if ( insEmptyEnumCacher.pick( val ) !== val ) {
                console.log( '由 emptyEnumCacher 提取失敗' );
                throw Error( '由 emptyEnumCacher 提取失敗' );
            }
            if ( !insEmptyEnumCacher.rm( val ) ) {
                console.log( '由 emptyEnumCacher 移除失敗' );
                throw Error( '由 emptyEnumCacher 移除失敗' );
            }
        }
    } )
    .add( '由 pairCacher 新增', function () {
        var idx, len, val;
        var insPairCacher = new emptyEnumCacher();
        for ( idx = 0, len = keys.length; idx < len ; idx++ ) {
            val = keys[ idx ];
        }
        for ( idx = 0, len = keys.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            insPairCacher.add( val, val );
        }
        for ( idx = 0, len = pickNumber.length; idx < len ; idx++ ) {
            val = keys[ idx ];
            if ( insPairCacher.pick( val ) !== val ) {
                console.log( '由 emptyEnumCacher 提取失敗' );
                throw Error( '由 emptyEnumCacher 提取失敗' );
            }
            if ( !insPairCacher.rm( val ) ) {
                console.log( '由 emptyEnumCacher 移除失敗' );
                throw Error( '由 emptyEnumCacher 移除失敗' );
            }
        }
    } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '實例最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;

