var http = require('http');
var fs = require('fs');

var linkTimes = 1;
var server = http.createServer( function ( req, res ) {
    console.log( linkTimes++ );
    fs.createReadStream( 'xxx.avi' )
        .pipe( res )
        .on( 'finish', function () {
            console.log('Sending done.');
        } );
} );

var orgin = require( 'os' ).networkInterfaces().ens33[ 0 ].address;
var port = 3001;

server.listen( port, function () {
    console.log( 'Secret server is up' );
    console.log( '伺服器開啟於 http://' + orgin + ':' + port + '/');
} );

