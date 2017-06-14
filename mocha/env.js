global.assert = require( 'assert' );
global.order = require( '../lib/initJS' );

var [ log, devRegistry ]
    = require( '../lib/devBackdoor' )( {
        log: order.cache[ '/pure/log' ],
        /* jspi */
    } );

global.log = log;
global.devRegistry = devRegistry;

