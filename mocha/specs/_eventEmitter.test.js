"use strict";

// 爪哇腳本初始化
let [ jspi, _log, initAMD, eventEmitter, classLog, cacher ] = require( '../../lib/initJS' ).initJS;
let [ log, devRegistry ] = require( '../../lib/devBackdoor' )( _log, jspi );


describe( 'eventEmitter 事件發射員', function () {
    it( 'eventEmitter 是否載入', function () {
        assert.notEqual( eventEmitter, null, 'eventEmitter 不存在。' );
    } );

    var rtnAns, insCobj;
    var evalFuncTxt = 'target[ 0 ]++;';
    var defaultListener = [
        new Function( 'target', evalFuncTxt ),
        new Function( 'target', evalFuncTxt ),
        new Function( 'target', evalFuncTxt )
    ];

    beforeEach( function () {
        rtnAns = undefined;
        insCobj = new eventEmitter( true, 100 );
        insCobj.on( 'test', defaultListener[ 0 ] );
        insCobj.on( 'test', defaultListener[ 1 ] );
        insCobj.on( 'test', defaultListener[ 2 ] );
    } );

    describe( '#setMaxListeners 設定最大監聽數', function () {
        it( '設定最大監聽數 為 0', function () {
            rtnAns = insCobj.setMaxListeners( 0 );
            assert.strictEqual( insCobj._maxListeners, 0, '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '設定最大監聽數 為 100', function () {
            rtnAns = insCobj.setMaxListeners( 100 );
            assert.strictEqual( insCobj._maxListeners, 100, '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '錯誤測試： 設定最大監聽數 為 -3', function () {
            log.catchErr(
                function () {
                    insCobj.setMaxListeners( -3 )
                },
                TypeError, 21, 'eventEmitter_positiveNumber',
                '不符合預期的錯誤。'
            );
        } );
    } );

    describe( '#getMaxListeners 取得最大監聽數', function () {
        it( '取得最大監聽數 為 100', function () {
            insCobj.setMaxListeners( 100 );
            rtnAns = insCobj.getMaxListeners();
            assert.strictEqual( rtnAns, 100, '不符合預期的回傳值。');
        } );
    } );

    describe( '#eventNames 事件名稱： 列出正監聽中的事件清單', function () {
        it( '取得不為原參考位置事件名稱', function () {
            rtnAns = insCobj.eventNames();
            assert.notStrictEqual( rtnAns, insCobj._cacher._index, '不符合預期的參考位置。');
            assert.deepEqual( rtnAns, [ 'test' ], '不符合預期的回傳值。');
        } );
    } );

    describe( '#eventCount 事件計數： 計算正監聽中的事件數量', function () {
        it( '取得事件數量 為 1', function () {
            rtnAns = insCobj.eventCount();
            assert.strictEqual( rtnAns, 1, '不符合預期的回傳值。');
        } );
    } );

    describe( '#listeners 監聽函式： 取得某事件的所有監聽函式', function () {
        it( '取得虛假事件的監聽函式清單', function () {
            rtnAns = insCobj.listeners( 'fake' );
            assert.strictEqual( rtnAns.constructor, Array, '不符合預期的回傳值類型。');
            assert.strictEqual( rtnAns.length, 0, '不符合預期的回傳值。');
        } );

        it( '取得事件的監聽函式清單', function () {
            rtnAns = insCobj.listeners( 'test' );
            assert.deepEqual( rtnAns, defaultListener, '不符合預期的回傳值。');
        } );

        it( '取得有單一事件的監聽函式清單', function () {
            var refFunc = new Function;
            var refFuncList = Array.prototype.slice.call( defaultListener, 0 );
            refFuncList.push( refFunc );
            insCobj.once( 'test', refFunc );
            rtnAns = insCobj.listeners( 'test' );
            assert.deepEqual( rtnAns, refFuncList, '不符合預期的回傳值。');
        } );
    } );

    describe( '#listenerCount 監聽函式計數： 取得某事件監聽的數量', function () {
        it( '取得虛假事件的監聽函式數量', function () {
            rtnAns = insCobj.listenerCount( 'fake' );
            assert.strictEqual( rtnAns, 0, '不符合預期的回傳值。');
        } );

        it( '取得事件的監聽函式數量', function () {
            rtnAns = insCobj.listenerCount( 'test' );
            assert.strictEqual( rtnAns, 3, '不符合預期的回傳值。');
        } );
    } );

    describe( '#emit 發射', function () {
        it( '發射虛假事件', function () {
            rtnAns = insCobj.emit( 'fake' );
            assert.strictEqual( rtnAns, false, '不符合預期的回傳值。');
        } );

        it( '發射事件', function () {
            var target = [ 0 ];
            rtnAns = insCobj.emit( 'test', target );
            assert.strictEqual( target[ 0 ], 3, '不符合預期的執行結果。');
            assert.strictEqual( rtnAns, true, '不符合預期的回傳值。');
        } );

        it( '發射事件 - 事件執行中會增加事件', function () {
            var target = [ 0 ];
            insCobj.on( 'test', function () {
                target[ 0 ]++;
                var evtQueue = insCobj._cacher.pick( 'test' );
                evtQueue.splice( evtQueue.length - 1, 0, function () { target[ 0 ] = '干擾'; } );
            } );
            insCobj.on( 'test', function () {
                target[ 0 ]++;
            } );
            rtnAns = insCobj.emit( 'test', target );
            assert.strictEqual( target[ 0 ], 5, '不符合預期的執行結果。');
            assert.strictEqual( rtnAns, true, '不符合預期的回傳值。');
        } );

        it( '錯誤測試： 發射 "error" 事件', function () {
            log.catchErr(
                function () {
                    insCobj.emit( 'error' );
                },
                Error, 21, 'eventEmitter_emitError',
                '不符合預期的錯誤。'
            );
        } );
    } );

    describe( '#on 添加監聽', function () {
        it( '相同函式不能存在同一事件佇列', function () {
            var sameFunc = new Function;
            insCobj.on( 'testOn', sameFunc );
            rtnAns = insCobj.on( 'testOn', sameFunc );
            assert.strictEqual( insCobj.listenerCount( 'testOn' ), 1, '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '順序添加監聽', function () {
            var refFunc1 = new Function;
            var refFunc2 = new Function;
            insCobj.on( 'testOn', refFunc1 );
            rtnAns = insCobj.on( 'testOn', refFunc2 );
            assert.deepEqual( insCobj.listeners( 'testOn' ), [ refFunc1, refFunc2 ], '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '倒序添加監聽', function () {
            var insCobj = new eventEmitter( false );
            var refFunc1 = new Function;
            var refFunc2 = new Function;
            insCobj.on( 'testOn', refFunc1 );
            rtnAns = insCobj.on( 'testOn', refFunc2 );
            assert.deepEqual( insCobj.listeners( 'testOn' ), [ refFunc2, refFunc1 ], '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '監聽新增事件', function () {
            var target = 0;
            insCobj.on( 'newListener', function () { target++; } );
            insCobj.on( 'testOn', function () { target++; } );
            insCobj.on( 'newListener', function () { target++; } );
            rtnAns = insCobj.on( 'testOn', function () { target++; } );
            assert.strictEqual( target, 4, '不符合預期的執行結果。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '錯誤測試： 監聽函式為 Function 類型', function () {
            log.catchErr(
                function () {
                    insCobj.on( 'testOn', [] );
                },
                TypeError, 21, '_restrictedType',
                '不符合預期的錯誤。'
            );
        } );
    } );

    describe( '#once 添加單次監聽', function () {
        it( '確認單次監聽', function () {
            var refFunc = new Function;
            insCobj.once( 'testOnce', refFunc );
            var evtQueue = insCobj._cacher.pick( 'testOnce' );
            assert.notStrictEqual( evtQueue[ 0 ], refFunc, '不符合預期。');
        } );

        it( '順序添加監聽', function () {
            var refFunc1 = new Function;
            var refFunc2 = new Function;
            insCobj.once( 'testOn', refFunc1 );
            rtnAns = insCobj.once( 'testOn', refFunc2 );
            assert.deepEqual( insCobj.listeners( 'testOn' ), [ refFunc1, refFunc2 ], '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '倒序添加監聽', function () {
            var insCobj = new eventEmitter( false );
            var refFunc1 = new Function;
            var refFunc2 = new Function;
            insCobj.on( 'testOn', refFunc1 );
            rtnAns = insCobj.on( 'testOn', refFunc2 );
            assert.deepEqual( insCobj.listeners( 'testOn' ), [ refFunc2, refFunc1 ], '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );
    } );

    describe( '#removeListener 移除監聽', function () {
        it( '移除監聽事件', function () {
            var refFuncList = Array.prototype.slice.call( defaultListener, 0 );
            refFuncList.splice( 1, 1 );
            rtnAns = insCobj.removeListener( 'test', defaultListener[ 1 ] );
            assert.deepEqual( insCobj.listeners( 'test' ), refFuncList, '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '監聽移除事件', function () {
            var target = 0;
            var rmFunc = function () { target++; };
            insCobj.on( 'removeListener', rmFunc );
            insCobj.on( 'removeListener', function () { target++; } );
            insCobj.removeListener( 'test', defaultListener[ 0 ] );
            insCobj.removeListener( 'test', defaultListener[ 1 ] );
            insCobj.removeListener( 'removeListener', rmFunc );
            rtnAns = insCobj.removeListener( 'test', defaultListener[ 2 ] );
            assert.strictEqual( target, 6, '不符合預期的執行結果。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '錯誤測試： 監聽函式為 Function 類型', function () {
            log.catchErr(
                function () {
                    insCobj.removeListener( 'testRemoveListener', [] );
                },
                TypeError, 21, '_restrictedType',
                '不符合預期的錯誤。'
            );
        } );
    } );

    describe( '#removeAllListeners 移除全部監聽', function () {
        it( '移除一項的監聽事件', function () {
            insCobj.on( 'testRemoveAllListeners', function () {} );
            rtnAns = insCobj.removeAllListeners( 'test' );
            assert.deepEqual( insCobj.eventNames(), [ 'testRemoveAllListeners' ], '不符合預期。');
            assert.deepEqual( insCobj.eventCount(), 1, '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );

        it( '移除全部監聽事件', function () {
            insCobj.on( 'testRemoveAllListeners', function () {} );
            rtnAns = insCobj.removeAllListeners();
            assert.deepEqual( insCobj.eventNames(), [], '不符合預期。');
            assert.deepEqual( insCobj.eventCount(), 0, '不符合預期。');
            assert.strictEqual( rtnAns, insCobj, '不符合預期的回傳值。');
        } );
    } );
} );

