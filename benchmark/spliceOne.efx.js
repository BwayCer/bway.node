'use strict';

var Benchmark = require( 'benchmark' );
var suite_spliceOne = new Benchmark.Suite;

Benchmark.prototype.setup = function() {
    function spliceOne1( arrList, numIndex ) {
        if ( numIndex === -1 ) return null;

        var len = arrList.length - 1;
        var anyAns = arrList[ numIndex ];

        while ( numIndex < len ) arrList[ numIndex ] = arrList[ ++numIndex ];
        arrList.pop();

        return anyAns;
    }

    function spliceOne2( arrList, numIndex ) {
        if ( numIndex === -1 ) return null;

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
};

suite_spliceOne
    .add( '由 Array#splice 執行', function () {
        [ 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9 ].splice( 3, 1 );
    } )
    .add( '由 spliceOne1 執行', function () {
        spliceOne1( [ 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9 ], 3 );
    } )
    .add( '由 spliceOne2 執行', function () {
        spliceOne2( [ 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9 ], 3 );
    } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '調用最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;

