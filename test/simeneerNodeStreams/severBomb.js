var http = require('http');
var fs = require('fs');

var linkTimes = 1;
var server = http.createServer( function ( req, res ) {
    fs.readFile( 'xxx.avi', function ( err, data ) {
        if ( err ) {
            console.log( err );
            res.writeHead( 500 );
            res.end( err.message );
        } else {
            res.writeHead( 200, { 'Content-Type': 'video/avi' } );
            console.log( linkTimes++, data.length );
            res.end( data );
        }
    } );
} );

var orgin = require( 'os' ).networkInterfaces().ens33[ 0 ].address;
var port = 3001;

server.listen( port, function () {
    console.log( 'Secret server is up' );
    console.log( '伺服器開啟於 http://' + orgin + ':' + port + '/');
} );

