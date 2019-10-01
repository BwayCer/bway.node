var asize = 0;
var stream = require('stream');
var streamDuplex = stream.Duplex;
var util = require('util');


function limitStream( numByte, numPreMs, options ) {
    if ( !( numByte > 0 && numPreMs > 0 ) ) throw Error( '錯誤參數值。' );

    if ( !( this instanceof limitStream ) ) return new limitStream( numByte, numPreMs, options );

    streamDuplex.call( this, options );

    this._end = false;
    this._closeDrain = false;
    this._writeDone = null;
    this._readableSize = numByte;
    this._buffer = null;
    this._limitByte = numByte;
    this._preMs = numPreMs;

}

util.inherits( limitStream, streamDuplex );

limitStream.prototype._read = function ( numSize ) {
    console.trace( '_read: ', numSize );
};

limitStream.prototype._write = function _write( chunk, encoding, callback ) {
    console.trace( '_write: ', this.writable, chunk );
    this._writeDone = callback;
};



var duplex = new limitStream( 512000, 1000 );

var _read = duplex.read;
duplex.read = function () {
    console.trace( 'read: ', arguments );
    return _read.apply( duplex, arguments );
};

duplex
    .on( 'drain', function () {
        console.log('---drain---')
    } )
    .on( 'finish', function ( err ) {
        console.log('---finish---')
    } )
    .on( 'readable', function () {
        console.log('---readable---')
    } )
    .on( 'end', function () {
        console.log('---end---')
        console.log( 'Out: ' + userId, asize );
    } )
    .on( 'error', function ( err ) {
        console.log( 'err: ', err );
    } )
;

module.exports = duplex;

