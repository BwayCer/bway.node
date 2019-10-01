"use strict";

var streamDuplex = require('stream').Duplex;
var util = require('util');


module.exports = limitStream;


function limitStream( numByte, options ) {
    if ( !( numByte > 0 ) ) throw Error( '錯誤參數值。' );

    if ( !( this instanceof limitStream ) ) return new limitStream( numByte, options );

    numByte *= 10;
    options = options || {};
    if ( 'highWaterMark' in options ) options.highWaterMark = numByte;

    streamDuplex.call( this, options );

    this._canWrite = true;
    this._canRead = true;
    this._buffer = null;
    this._writeDone = null;
    this._limitReadableSize = numByte;
    this._limitByte = numByte;

    _bindSelf( this );
    _pollingNotify( this );
}

util.inherits( limitStream, streamDuplex );

function _bindSelf( self ) {
    self.on( 'finish', function () {
        // 此時的 `this.writable` 仍為 `true`
        self._ending( true );
    } );

    self.on( 'error', function ( err ) {
        throw err;
    } );
}

function _pollingNotify( self ) {
    self._addPolling( function pollingNotify() {
        var buffer = self._buffer;

        if ( self._ending() ) {
            self._rmPolling( pollingNotify );
            return;
        }

        var limitReadableSize;
        var writeDone = self._writeDone;
        var limitByte = self._limitByte;

        self._limitReadableSize = self._limitByte;

        if ( writeDone ) {
            process.nextTick( writeDone );
            self._writeDone = null;
        }

        limitReadableSize = self._limitReadableSize;
        if ( limitReadableSize ) self._read( limitReadableSize );
    } );
}

limitStream.prototype._pollingList = [ /* 0: setTimeoutId */ null ];

limitStream.prototype._polling = function _polling( list ) {
    var p = 1;
    var len = list.length;
    while ( p < len ) list[ p++ ]();
    list[ 0 ] = setTimeout( _polling, 10000, list );
};

limitStream.prototype._addPolling = function ( fnNotify ) {
    var list = this._pollingList;
    list.push( fnNotify );
    if ( !list[ 0 ] ) list[ 0 ] = setTimeout( this._polling, 10000, list );
};

limitStream.prototype._rmPolling = function _polling( fnNotify ) {
    var list = this._pollingList;
    var idx = list.indexOf( fnNotify );
    if ( ~idx ) list.splice( idx, 1 );
    if ( list.length === 1 ) {
        clearTimeout( list[ 0 ] );
        list[ 0 ] = null;
    }
};

limitStream.prototype._ending = function ( bisWrite ) {
    if ( bisWrite === true ) this._canWrite = false;

    if ( this._canWrite || this._buffer ) return false;
    if ( !this._canRead ) return true;

    this._canRead = false;
    this.push( null );

    return true;
};

function _tickEmitNotify( self, strEvtName ) {
    self.emit( strEvtName );
}

limitStream.prototype._read = function ( numSize ) {
    var limitReadableSize = this._limitReadableSize;
    var readableState = this._readableState;
    var highWaterMark = readableState.highWaterMark;
    var lenReadedBuffer = readableState.length;

    if ( !this._canRead || limitReadableSize <= 0 ) return;

    if ( lenReadedBuffer > highWaterMark ) {
        process.nextTick( _tickEmitNotify, this, 'readable' );
        return;
    }

    // 不可能吧！
    if ( numSize <= 0 ) return null;
    else numSize = ( numSize && numSize < limitReadableSize ) ? numSize : limitReadableSize;

    var writeDone;
    var buffer = this._buffer;

    if ( !buffer ) {
        writeDone = this._writeDone;
        if ( writeDone ) {
            process.nextTick( this._writeDone );
            this._writeDone = null;
        } else if ( !this._canWrite ) {
            this._ending()
        }

        return;
    }

    var lenBuf = buffer.length;

    if ( numSize > lenBuf ) {
        this._limitReadableSize -= lenBuf;
        this._buffer = null;
    } else {
        this._limitReadableSize -= numSize;
        this._buffer = buffer.slice( numSize );
        buffer = buffer.slice( 0, numSize );
    }

    // 所有的推送接會被緩存
    // 回傳值只是警告 this._readableState.length > this._readableState.highWaterMark
    this.push( buffer );
};

limitStream.prototype._write = function _write( chunk, encoding, callback ) {
    var buffer = this._buffer;
    var limitByte = this._limitByte;

    this._buffer = buffer = buffer ? Buffer.concat( [ buffer, chunk ] ) : chunk;

    if ( buffer.length < limitByte ) {
        callback();
    } else {
        this._writeDone = callback;
        this._read( limitByte );
    }
};

