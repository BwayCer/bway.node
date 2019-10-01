var fs = require( 'fs' );

var rr = fs.createReadStream( process.argv[ 2 ] );

var size = 0;
var isReadable = false;
var isEnd = false;

rr.read__ = rr.read;
rr.read = function ( n ) {
    console.trace( this._readableState.length,n );
    return this.read__( n );
};

function coundReadDataLimit( limitSize ) {
    var len;
    var loopTimes = 0;
    var data = rr.read( limitSize );

    if ( data == null ) console.log( '-- coundReadData -- data: null' );
    else {
        len = data.length;
        size += len;
        console.log( '-- coundReadData -- data: ' + len );
    }
}

function coundReadData() {
    var len;
    var loopTimes = 0;
    var chunk = rr.read();
    var data = chunk ? Buffer.alloc( 0 ) : null;
    // rr.unshift(data);

    while ( chunk != null ) {
        loopTimes++;
        data = Buffer.concat( [ data, chunk ] );
        chunk = rr.read();
    }

    if ( data == null ) console.log( '-- coundReadData -- loopTimes: 1 ; data: null' );
    else {
        len = data.length;
        size += len;
        console.log( '-- coundReadData -- loopTimes: ' + loopTimes, '; data: ' + len );
    }
}

rr.on( 'readable', function () {
    console.log( '-- readable --' );
    isReadable = true;
} );

rr.on( 'error', function ( err ) {
    throw err;
} );

rr.on( 'end', function ( err ) {
    console.log( 'end: ' + size );
    isEnd = true;
} );

void function overOpen( numTimes ) {
    if ( numTimes === 4 ) rr.pause();
    if ( numTimes === 6 ) console.log( 'resume', rr.resume() );
    // if ( ( numTimes & 1 ) === 0 && rr.isPaused() ) rr.resume();
    // else if ( !rr.isPaused() ) rr.pause();
    console.log();
    console.log( '-- overOpen --', rr.isPaused(), isReadable, !isEnd );
    console.log( rr._readableState.buffer );
    // if ( isReadable && !isEnd ) coundReadData();
    if ( !rr.isPaused() && isReadable && !isEnd ) coundReadDataLimit( 512 );
    // if ( isReadable && !isEnd && numTimes === 4 ) coundReadData();
    setTimeout( overOpen, 3000, ++numTimes );
}( 0 );
