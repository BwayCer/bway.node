var http = require('http');
var fs = require( 'fs' );
var limitStream = require( './limitStream' );

var linkTimes = 1;

var server = http.createServer( function ( req, res ) {
    var userId = linkTimes++;

    console.log( 'In: ' + userId );

    fs.createReadStream( process.argv[ 2 ] )
        .on( 'open', function () {
            console.log('***open***')
            res.writeHead( 200, { 'Content-Type': 'video/mpeg4' } );
        } )
        .pipe( new limitStream( 102400 ) )
        .pipe( res )
        .on( 'finish', function ( err ) {
            console.log( 'Out: ' + userId );
        } )
        .on( 'error', function ( err ) {
            console.log( 'err: ' + userId, err );
            res.writeHead( 500 );
            res.end( err.message );
        } )
    ;
} );

var orgin = require( 'os' ).networkInterfaces().ens33[ 0 ].address;
var port = 3001;

server.listen( port, function () {
    console.log( 'Secret server is up' );
    console.log( '伺服器開啟於 http://' + orgin + ':' + port + '/' + process.argv[ 2 ] );
} );

