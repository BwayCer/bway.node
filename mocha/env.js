global.assert = require( 'assert' );
global.order = require( '../lib/initJS' );

require( '../lib/pure/jspi' );

var [ log, devRegistry ]
    = require( '../lib/devBackdoor' )( {
        log: order.cache[ '/pure/log' ],
        jspi: order.cache[ '/pure/jspi' ]
    } );

global.log = log;
global.devRegistry = devRegistry;

