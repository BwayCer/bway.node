/**
 * 事件發射員 Event Emitter
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */

"use strict";


/**
 * 事件發射員
 *
 * @module evtEmitter
 */

order( '/pure/eventEmitter', [
    '/pure/log',
    '/pure/internWaiter',
    '/pure/jspi',
], function ( log, internWaiter, jspi ) {
    log.setMsg( {
        eventEmitter_positiveNumber: '%s is a positive number.',
        eventEmitter_emitError: 'eventEmitter "error" event. %s',
        eventEmitter_addExcessListener: 'Possible EventEmitter memory leak detected.（%s "%s" listeners added.）',
    } );

    function emptyEnum() {}
    emptyEnum.prototype = Object.create( null );

    var jspiEventEmitter = jspi.create( {
        _log: log,
        _arraySlice: Array.prototype.slice,
        _emptyEnum: emptyEnum,
        // 陣列的重新包裝
        _rewrapArr: function rewrapArr( arrTarget ) {
            var len = arrTarget.length;
            var arrAns = new Array( len );

            while ( len-- ) arrAns[ len ] = arrTarget[ len ];
            return arrAns;
        },
        // 一單位接合
        _spliceOne: function spliceOne( arrList, numIndex ) {
            if ( numIndex === -1 ) return null;

            var len = arrList.length - 1;
            var anyAns = arrList[ numIndex ];

            while ( numIndex < len ) arrList[ numIndex ] = arrList[ ++numIndex ];
            arrList.pop();

            return anyAns;
        },
    } );


    /**
     * 事件發射員
     * <br><br>
     * 把物件名稱存為陣列替代 `Object.keys()` 、
     * [`Reflect.ownKeys()`]{@link https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys}
     * 取得物件名稱的方式。 以解決物件名稱的取得及空枚舉無法計數問題。
     *
     * @memberof module:initJS.
     * @class eventEmitter
     * @param {Boolean} emitOrder - 發射順序，是否順序添加監聽至佇列。
     * `true`： 顺序： `false`： 倒序。
     * @param {Number} maxListeners - 最大監聽數。
     */
    jspiEventEmitter( 'constructor', [
        '_emptyEnum',
        '_loadAddListenerInOrder'
    ],
    function ( _emptyEnum, _loadAddListenerInOrder ) {
        return function eventEmitter( bisEmitOrder, numMaxListeners ) {
            bisEmitOrder = ( typeof bisEmitOrder === 'boolean' ) ? bisEmitOrder : true;

            this._index = [];
            this._cache = new _emptyEnum();
            this._maxListeners = 0;

            this.setMaxListeners( numMaxListeners || 0 );
            _loadAddListenerInOrder( this, bisEmitOrder );
        };
    } );


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
            var bisPositive = typeof numMaxListeners === 'number' && numMaxListeners >= 0;

            if ( bisPositive ) this._maxListeners = numMaxListeners;
            else throw TypeError( log.err( 21, 'eventEmitter_positiveNumber', 'maxListeners' ) );
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
            return _rewrapArr( this._index );
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
        return this._index.length;
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
        var arrEvtQueue = this._cache[ strEvtName ];
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
        var arrEvtQueue = this._cache[ strEvtName ];
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
                setTimeout( function () { throw err; } );
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
     * @throws 見 {@link module:eventEmitter.eventEmitter~_emitMany|eventEmitter~_emitMany} 。
     * @throws 觸發 "error" 事件。 Error(21, eventEmitter_emitError)
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
            var evtQueue = this._cache[ strEvtName ];

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
     * 提供 `null` 因為寫法上的方便，不必當下判斷是否有值存在 ^,^。
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
     * 此段註解才了解會有「改寫事件佇列」的行為。
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
            var index = insSelf._index;
            var cache = insSelf._cache;
            var evtQueue = cache[ strEvtName ];
            var evtNameOfNew = 'newListener';

            // 參考瀏覽器在一事件佇列不能存在相同函式。
            if ( ~_invertedIndexOf( evtQueue, fnListener ) ) return insSelf;

            // 不理解其邏輯的節點註解：
            //     以防 `strEvtName === "newListener"` 所造成的無限迴圈，在添加監聽至佇列前先執行事件。
            if ( ~index.indexOf( evtNameOfNew ) )
                insSelf.emit( evtNameOfNew, strEvtName, fnListener );

            // 重置 有可能被 `newListener` 改寫
            evtQueue = cache[ strEvtName ];

            // 不模仿節點優化單一的監聽佇列，不以數組陣列存放。
            if ( !evtQueue ) {
                evtQueue = [];
                index.push( strEvtName );
                cache[ strEvtName ] = evtQueue;
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
            var index, fnListener;

            if ( bisNotify ) {
                fnListener = arrEvtQueue[ idxListener ];
                fnListener = fnListener.listener || fnListener;
            }

            if ( arrEvtQueue.length === 1 ) {
                index = insSelf._index;
                _spliceOne( index, index.indexOf( strEvtName ) );
                arrEvtQueue.length = 0;
                delete insSelf._cache[ strEvtName ];
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

            var bisNotify;
            var evtQueue = this._cache[ strEvtName ];
            var idxListener = _invertedIndexOf( evtQueue, fnListener );

            if ( !~idxListener ) return insSelf;

            bisNotify = !!~this._index.indexOf( 'removeListener' );
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
        '_spliceOne',
        '_removeListener'
    ],
    function (  _rewrapArr, _spliceOne, _removeListener ) {
        return function _removeOneEvtListeners( insSelf, strEvtName, bisNotify ) {
            var index = insSelf._index;
            var cache = insSelf._cache;
            var idx = index.indexOf( strEvtName );

            if ( !~idx ) return insSelf;

            var len;
            var evtQueue = cache[ strEvtName ];
            var copyEvtQueue = _rewrapArr( evtQueue );

            if ( bisNotify ) {
                len = copyEvtQueue.length;
                // 後進先出 LIFO order
                while ( len-- ) {
                    _removeListener( insSelf, strEvtName, copyEvtQueue, len, bisNotify );
                }
            } else {
                _spliceOne( index, idx );
                delete cache[ strEvtName ];
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
            var val;
            var index = this._index;
            var bisNotify = index.indexOf( evtNameOfRm );
            var evtNameOfRm = 'removeListener';

            if ( arguments.length ) {
                _removeOneEvtListeners( this, strEvtName, bisNotify );
            } else {
                while ( index[ 0 ] ) {
                    val = index[ 0 ];
                    if ( val === evtNameOfRm ) continue;
                    _removeOneEvtListeners( this, val, bisNotify );
                }

                if ( bisNotify ) _removeOneEvtListeners( this, evtNameOfRm, bisNotify );
            }

            return this;
        };
    } );

    return jspiEventEmitter.construct();
} );

