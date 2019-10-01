var fs = require( 'fs' );

var rr = fs.createReadStream( 'xx1.avi' );

var len;
var size = 0;

rr.on( 'data', function ( chunk ) {
    var data = chunk;

    if ( data == null ) console.log( 'readable: null' );
    else {
        len = data.length;
        size += len;
        console.log( 'readable:', data == null ? null : len );
    }
} );

rr.on( 'end', () => {
    console.log( 'end: ' + size );
} );

