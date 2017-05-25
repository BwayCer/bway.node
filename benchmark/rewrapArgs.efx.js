'use strict';

var Benchmark = require( 'benchmark' );
var suite_rewrapArgs = new Benchmark.Suite;

var arraySlice = Array.prototype.slice;
var arraySplice = Array.prototype.splice;

/**
 * 陣列的重新包裝。
 *
 * @func rewrapArr
 * @param {Array} target - 複製目標對象。
 * @return {Array}
 */
var rewrapArr1 = function rewrapArr( arrTarget ) {
    var len = arrTarget.length;
    var arrAns = [];

    while ( len-- ) arrAns[ len ] = arrTarget[ len ];
    return arrAns;
};

var rewrapArr2 = function rewrapArr( arrTarget ) {
    var len = arrTarget.length;
    var arrAns = Array();

    while ( len-- ) arrAns[ len ] = arrTarget[ len ];
    return arrAns;
};

var rewrapArr3 = function rewrapArr( arrTarget ) {
    var len = arrTarget.length;
    var arrAns = Array( len );

    while ( len-- ) arrAns[ len ] = arrTarget[ len ];
    return arrAns;
};

var rewrapArr4 = function rewrapArr( arrTarget ) {
    var len = arrTarget.length;
    var arrAns = new Array();

    while ( len-- ) arrAns[ len ] = arrTarget[ len ];
    return arrAns;
};

var rewrapArr5 = function rewrapArr( arrTarget ) {
    var len = arrTarget.length;
    var arrAns = new Array( len );

    while ( len-- ) arrAns[ len ] = arrTarget[ len ];
    return arrAns;
};

var argsTarget = getArgs( null, 1, [ 2, 3, 4 ], 'copy', { u: 520 } );
function getArgs() { return arguments; }

suite_rewrapArgs
    .add( '由 Array#slice 執行', function () { var ans = arraySlice.call( argsTarget ); } )
    .add( '由 Array#splice 執行', function () { var ans = arraySlice.call( argsTarget, 0 ); } )
    .add( '由 rewrapArr [] 執行', function () { var ans = rewrapArr1( argsTarget ); } )
    .add( '由 rewrapArr Array() 執行', function () { var ans = rewrapArr2( argsTarget ); } )
    .add( '由 rewrapArr Array( len ) 執行', function () { var ans = rewrapArr3( argsTarget ); } )
    .add( '由 rewrapArr new Array() 執行', function () { var ans = rewrapArr4( argsTarget ); } )
    .add( '由 rewrapArr new Array( len ) 執行', function () { var ans = rewrapArr5( argsTarget ); } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '調用最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;

