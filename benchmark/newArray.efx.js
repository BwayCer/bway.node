'use strict';

var Benchmark = require( 'benchmark' );
var suite_newArray = new Benchmark.Suite;
var suite_newArrayLength = new Benchmark.Suite;

suite_newArray
    .add( '由 [] 執行', function () { var ans = []; } )
    .add( '由 Array() 執行', function () { var ans = Array(); } )
    .add( '由 Array( 0 ) 執行', function () { var ans = Array( 0 ); } )
    .add( '由 new Array() 執行', function () { var ans = new Array(); } )
    .add( '由 new Array( 0 ) 執行', function () { var ans = new Array( 0 ); } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '調用最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;

suite_newArrayLength
    .add( '由 [] 執行', function () {
        var ans = [];
        ans.push( 1, 2, 3 );
    } )
    .add( '由 Array() 執行', function () {
        var ans = Array();
        ans.push( 1, 2, 3 );
    } )
    .add( '由 Array( len ) 執行', function () {
        var ans = Array( 3 );
        ans.push( 1, 2, 3 );
    } )
    .add( '由 new Array() 執行', function () {
        var ans = new Array();
        ans.push( 1, 2, 3 );
    } )
    .add( '由 new Array( len ) 執行', function () {
        var ans = new Array( 3 );
        ans.push( 1, 2, 3 );
    } )
    .on( 'cycle', function ( event ) {
          console.log( event.target.toString() );
    } )
    .on( 'complete', function () {
        console.log( '調用最快為： ' + this.filter('fastest').map('name') );
    } )
    .run()
;

