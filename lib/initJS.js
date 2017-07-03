/*! Initialize JavaScript @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 初始化爪哇腳本 Initialize JavaScript
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */

"use strict";


/**
 * 初始化爪哇腳本
 *
 * @module initJS
 */

void function () {
    var idx = 0;
    var args = arguments;
    var defaultMsgTable, logMsgTable, _supportJS;
    var logNeedle, log, internWaiter;

    defaultMsgTable = args[ idx++ ];
    logMsgTable     = args[ idx++ ];
    logNeedle       = args[ idx++ ]( defaultMsgTable );
    log             = new logNeedle( true, logMsgTable );
    _supportJS      = args[ idx++ ]();
    internWaiter    = args[ idx++ ]( log, _supportJS );

    args[ idx++ ]( log, internWaiter, logNeedle );
}(
// defaultMsgTable
{
    _undefined: 'Unexpected log message.',
    _illegalInvocation: 'Illegal invocation.',
    _typeError: 'a value is not of the expected type.',
    _restrictedType: '"%s" argument must be a `%s` type.',
},
// logMsgTable
{
    internWaiter_notAllowedOrderArgs: 'The arguments of "order" function is not allowed type.',
    internWaiter_notAllowedId: 'The "id" is a `String` type that is not empty.',
    internWaiter_notConformUrlRule: 'The "id" not meeting URL rules expectations.',
    internWaiter_foundSameDep: 'The "deps" is found Same source. (%s)',
    internWaiter_errKillProcess: 'Kill process.%s',
    internWaiter_errRequestLoopHell: 'Request loop hell. (%s)',
    internWaiter_errRequestTimeout: 'Request timeout. (%sms)',
},
// logNeedle
function ( defaultMsgTable ) {
    /**
     * 日誌類物件
     *
     * @memberof module:initJS.
     * @class logNeedle
     * @param {?Boolean} print - 是否打印（皆允許拋錯）。
     * @param {?Object} preMsgTable - 預設訊息表。
     * 其訊息表的原型鏈會指向 {@link module:initJS.logNeedle#defaultMsgTable}。
     */
    function logNeedle( bisPrint, objPreMsgTable ) {
        this._isPrint = ( typeof bisPrint === 'boolean' ) ? bisPrint : true;
        this.msgTable = objPreMsgTable
            ? Object.setPrototypeOf( objPreMsgTable, this.defaultMsgTable )
            : Object.create( this.defaultMsgTable );
    }

    /**
     * 接收器： 用戶可以此獲取日誌並打印於其他地放。
     *
     * @abstract
     * @memberof module:initJS.logNeedle#
     * @func receiver
     * @param {String} origName - 執行來源。 其值有 `tell`、`warn`、`err`。
     * @param {Number} code - 訊息代碼。 其中 `2x` 開頭表示本物件。
     * @param {String} msg - 訊息。
     */
    logNeedle.prototype.receiver = null;

    /**
     * 預設訊息表。
     * <br>
     * 關於訊息表的名稱建議以 `(...(來源)_)(內容資訊)` 的方式命名，預設值加以 `_` 為前綴。
     *
     * @memberof module:initJS.logNeedle#
     * @var {Object} defaultMsgTable
     */
    logNeedle.prototype.defaultMsgTable = Object.setPrototypeOf( defaultMsgTable, null );

    var _arraySlice = Array.prototype.slice;

    var _regexSpecifySymbol = /%(.)/g;

    /**
     * 文字插入。
     *
     * @memberof module:initJS.logNeedle~
     * @func _strins
     * @param {String} msg - 訊息。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {String}
     */
    function _strins( strTxt ) {
        if ( !_regexSpecifySymbol.test( strTxt ) ) return strTxt;

        var idx = 1;
        var args = arguments;

        return strTxt.replace( _regexSpecifySymbol, function () {
            switch ( arguments[ 1 ] ) {
                case '%': return '%';
                case 's': return args[ idx++ ];
                default: return 'undefined';
            }
        } );
    }

    /**
     * 口述。
     *
     * @memberof module:initJS.logNeedle#
     * @func tell
     * @param {Number} code - 訊息代碼。
     * @param {String} msg - 打印訊息。
     * @param {...String} [replaceMsg] - 替代訊息。
     */
    logNeedle.prototype.tell = function ( numCode, strMsg ) {
        var txt;
        var bisSendMsg = typeof this.receiver === 'function';

        if ( typeof strMsg !== 'string' ) txt = this.msgTable._undefined;
        else if ( arguments.length === 2 ) txt = _strins.call( null, strMsg );
        else txt = _strins.apply( null, _arraySlice.call( arguments, 1 ) );

        if ( bisSendMsg ) this.receiver( 'tell', numCode, 'log_tell', txt );
        if ( this._isPrint ) console.log( txt );
    };

    /**
     * 解析警告訊息。
     *
     * @memberof module:initJS.logNeedle~
     * @func _parseWarnTxt
     * @param {Number} code - 訊息代碼。
     * @param {String} msgCode - 打印訊息的日誌代碼。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {String}
     */
    function _parseWarnTxt( numCode, strMsgCode ) {
        var msgTable = this.msgTable;

        if ( typeof strMsgCode !== 'string' ) return msgTable._undefined;

        var args;
        var msg = msgTable[ strMsgCode ];
        var strAns;

        if ( !msg ) return msgTable._undefined;

        if ( arguments.length === 2 ) strAns = _strins.call( null, msg );
        else {
            args = _arraySlice.call( arguments, 1 );
            args[ 0 ] = msg;
            strAns = _strins.apply( null, args );
        }

        return strAns;
    }

    /**
     * 警告。
     *
     * @memberof module:initJS.logNeedle#
     * @func warn
     * @param {Number} code - 訊息代碼。
     * @param {String} msgCode - 打印訊息的日誌代碼。
     * @param {...String} [replaceMsg] - 替代訊息。
     */
    logNeedle.prototype.warn = function ( numCode, strMsgCode ) {
        var txt = _parseWarnTxt.apply( this, arguments );
        var bisSendMsg = typeof this.receiver === 'function';

        if ( bisSendMsg ) this.receiver( 'warn', numCode, strMsgCode, txt );
        if ( this._isPrint ) console.error( txt );
    };

    /**
     * 錯誤。
     *
     * @memberof module:initJS.logNeedle#
     * @func err
     * @param {Number} code - 訊息代碼。
     * @param {String} msgCode - 打印訊息的日誌代碼。
     * @param {...String} [replaceMsg] - 替代訊息。
     * @return {String} 錯誤訊息。
     */
    logNeedle.prototype.err = function ( numCode, strMsgCode ) {
        var txt = _parseWarnTxt.apply( this, arguments );
        var bisSendMsg = typeof this.receiver === 'function';

        if ( bisSendMsg ) this.receiver( 'err', numCode, strMsgCode, txt );
        return txt;
    };

    /**
     * 設定訊息表。
     *
     * @memberof module:initJS.logNeedle#
     * @func setMsg
     * @param {(String|Object)} msgOption - 訊息選項，可為名稱或清單。
     * @param {String} msg - 訊息內容。
     * @throws {TypeError} (21, _typeError)
     */
    logNeedle.prototype.setMsg = function ( anyMsgOption, strMsg ) {
        var typeOfMsgOption = anyMsgOption ? anyMsgOption.constructor : null;
        var bisMsgStrType = typeof strMsg === 'string';

        if ( !( typeOfMsgOption === Object || ( typeOfMsgOption === String && bisMsgStrType ) ) )
            throw TypeError( this.err( 21, '_typeError' ) );

        var key;
        var msgTable = this.msgTable;

        switch ( typeOfMsgOption ) {
            case String:
                msgTable[ anyMsgOption ] = strMsg;
                break;
            case Object:
                for( key in anyMsgOption ) msgTable[ key ] = anyMsgOption[ key ];
                break;
        }
    };

    /**
     * 取得訊息表內容。
     *
     * @memberof module:initJS.logNeedle#
     * @func getMsg
     * @param {String} msgCode - 訊息代碼的日誌代碼。
     * @return {String} 其訊息代碼或 `_undefined` 代碼的內容。
     */
    logNeedle.prototype.getMsg = function ( strMsgCode ) {
        var msgTable = this.msgTable;
        return msgTable[ strMsgCode ] || msgTable._undefined;
    };

    return logNeedle;
},
// _supportJS
function () {
    /***
     * 空枚舉： 創建一個「乾淨」的空物件陣列。
     */
    function emptyEnum() {}
    emptyEnum.prototype = Object.create( null );

    /***
     * 陣列的重新包裝。
     */
    function rewrapArr( arrTarget ) {
        var len = arrTarget.length;
        var arrAns = new Array( len );

        while ( len-- ) arrAns[ len ] = arrTarget[ len ];
        return arrAns;
    }

    /***
     * 一單位接合。
     */
    function spliceOne( arrList, numIndex ) {
        if ( numIndex === -1 ) return null;

        var len = arrList.length - 1;
        var anyAns = arrList[ numIndex ];

        while ( numIndex < len ) arrList[ numIndex ] = arrList[ ++numIndex ];
        arrList.pop();

        return anyAns;
    }

    return {
        emptyEnum: emptyEnum,
        rewrapArr: rewrapArr,
        spliceOne: spliceOne,
    };
},
// internWaiter
function ( log, _supportJS ) {
    var _emptyEnum = _supportJS.emptyEnum;
    var _rewrapArr = _supportJS.rewrapArr;
    var _spliceOne = _supportJS.spliceOne;

    /**
     * 實習服務生 internWaiter
     * <br><br>
     * 參考 [異步模組定義]{@link https://github.com/amdjs/amdjs-api/wiki/AMD-(中文版)}
     * 的概念實現的等待器（無遵守其規範）。
     * 相信此概念的等待器對異步的爪哇腳本是非常合適的，實習服務生類物件給開發者自訂
     * 「請求」、「讀取」和「完成」
     * 的處理方式，並期待你有創意的運用發想。
     * <br>
     * <br>
     * 名詞用語：
     * <br>
     * 1. 訂單（普通）： 訂單依附在文件上，此時的訂單即使不用識別碼也能被辨別。
     * <br>
     * 2. 手動訂單： 使用不屬該文件的識別碼來主動產生訂單。
     * <br>
     * 3. 批貨文件： 使用手動訂單的方式，在單一文件中產生多組訂單。
     * 對於判別是否為批貨文件的方式可由 `fileInfo.reply` 來「推測」。
     * <br>
     * 4. 快取（狹義）： 貯存訂單產生的物件。
     * <br>
     * 5. 等待快取： 貯存請求中或接收中的訂單。
     * <br>
     * <br>
     * 注意事項：
     * （見 {@link module:initJS.internWaiter#run|internWaiter#run} 寫法）
     * <br>
     * 1. 若已建立的物件和手動訂單重疊，以手動訂單更新物件。
     * <br>
     * 2. 若請求中的訂單和手動訂單重疊，以手動訂單為主物件。
     * <br>
     * 3. 若接收中的訂單和手動定單重疊，以正在接收的為主物件。
     * <br>
     * <br>
     * 關於如何用點購器下訂單請見
     * {@link module:initJS.internWaiter~_getChannel._parseOrderArgs|internWaiter~_getChannel._parseOrderArgs}
     * 。
     * <br>
     * <br>
     * 識別碼的網址陷阱：
     * 見 {@link module:initJS.internWaiter~_infoForm#_parseUrlRelative|_infoForm#_parseUrlRelative} 。
     *
     * @memberof module:initJS.
     * @param {Object} preStore - 預設佇存物。
     * @class internWaiter
     */
    function internWaiter( objPreSource ) {
        this._cache = new _emptyEnum();
        this._waiting = new _emptyEnum();
        this._waitingCount = 0;

        if ( objPreSource ) internWaiter.assign( this._cache, objPreSource );

        this._blockParseId = false;
        this.order = _getChannel( this );

        this._timerId = null;
        this._maxTimeout = 9999;
    }

    /**
     * 讓渡。
     *
     * @memberof module:initJS.internWaiter.
     * @func assign
     * @param {Object} target - 目標物件。
     * @param {Object} source - 來源物件。
     * @return {Object} 回傳第一項參數。
     */
    internWaiter.assign = function ( objTarget, objSource ) {
        var key;
        for ( key in objSource ) objTarget[ key ] = objSource[ key ];
        return objTarget;
    };

    /**
     * 設定請求超時時間。
     *
     * @memberof module:initJS.internWaiter#
     * @func setMaxTimeout
     * @param {Number} positive - 正整數。 最大超時時間，單位毫秒。
     */
    internWaiter.prototype.setMaxTimeout = function ( numPositive ) {
        if ( typeof numPositive !== 'number' || numPositive < 0 ) return;
        this._maxTimeout = numPositive;
    };

    /**
     * 訂單： 點購器。 由
     * {@link module:initJS.internWaiter~_getChannel|internWaiter~_getChannel}
     * 建立，使用方式見
     * {@link module:initJS.internWaiter~_getChannel._parseOrderArgs|internWaiter~_getChannel._parseOrderArgs}
     * 。
     *
     * @memberof module:initJS.internWaiter#
     * @func order
     */

    /**
     * 取得通路： 回傳一個用於 {@link module:initJS.internWaiter#order|internWaiter#order}
     * 的函式並綁定 `this`，讓其功能獨立使用。
     *
     * @memberof module:initJS.internWaiter~
     * @func _getChannel
     * @param {module:initJS.internWaiter} self
     * @return {Function}
     */
    function _getChannel( insSelf ) {
        var fnOrder = _getChannel.toBind( insSelf );

        fnOrder.pack = _getChannel.pack;
        fnOrder._parseOrderArgs = _getChannel._parseOrderArgs;
        fnOrder.receiveSwitch = false;
        fnOrder.fileInfo = { id: null, txt: null, reply: null, receive: [] };
        fnOrder.reset = _getChannel.reset;

        return fnOrder;
    }

    /**
     * 綁定： 以 `Function` 創建單純的範圍鏈，並綁定 `this` 讓其功能可分離使用。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _getChannel.toBind
     * @func _getChannel.toBind
     * @param {module:initJS.internWaiter} self
     * @return {Function}
     */
    _getChannel.toBind = Function( 'self',
        'return function order( strId, anyDeps, anyFactory ) {'
        +   'if ( strId === "//INSWAITER.PASS/" )'
        +     'return self.runPass( strId, anyDeps, anyFactory );'
        +   'var lenArgs = arguments.length;'
        +   'var args = order._parseOrderArgs( lenArgs, strId, anyDeps, anyFactory );'
        +   'var fileInfo = order.fileInfo;'
        +   'if ( order.receiveSwitch ) fileInfo.receive.push( args );'
        +   'else return self.run( args[ 0 ], args[ 1 ], args[ 2 ], fileInfo );'
        + '};'
    );

    /**
     * 打包： 專用通道的請求發送。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _getChannel.pack
     * @func _getChannel.pack
     * @param {Array} deps - 依賴包。
     * @param {Function} [factory] - 完成通知。
     */
    _getChannel.pack = function ( arrDeps, fnFactory ) {
        if ( arrDeps.constructor !== Array ) return;
        this( '//INSWAITER.PASS/', arrDeps, fnFactory );
    };

    /**
     * 解析訂單參數。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _getChannel._parseOrderArgs
     * @func _getChannel._parseOrderArgs
     * @param {Number} lenOrderArgs - 訂單函式所接受到的參數長度。
     * @param {String} [id] - 識別碼。
     * @param {?Array} [dependencies] - 依賴包。
     * @param {?*} factory - 工廠。
     * @throws {TypeError} (21, internWaiter_notAllowedOrderArgs)
     * @return {Array} [ id, dependencies, factory ]
     *
     * @example
     * // [ null, null, anyChoA ]
     * _parseOrderArgs( 1, anyChoA );
     *
     * // [ strChoA, null, anyChoB ]
     * _parseOrderArgs( 2, strChoA, anyChoB );
     *
     * // [ null, arrChoA, anyChoB ]
     * _parseOrderArgs( 2, arrChoA, anyChoB );
     *
     * // [ null, 'indep', fnChoB ]
     * _parseOrderArgs( 2, null, fnChoB );
     *
     * // [ strChoA, arrChoB, fnChoC ]
     * _parseOrderArgs( 3, strChoA, arrChoB, fnChoC );
     *
     * // [ strChoA, 'indep', fnChoC ]
     * _parseOrderArgs( 3, strChoA, null, fnChoC );
     */
    _getChannel._parseOrderArgs = function _parseOrderArgs( lenOrderArgs ) {
        var bisChoA, bisChoC, anyDepType;
        var _parseDependency = _parseOrderArgs._parseDependency;
        var bisNotAllowed = true;
        var id = null;
        var dependencies = null;
        var factory;

        switch ( lenOrderArgs ) {
            case 1:
                bisNotAllowed = false;
                factory = arguments[ 1 ];
                break;
            case 2:
                factory = arguments[ 2 ];
                if ( typeof arguments[ 1 ] === 'string' ) {
                    bisNotAllowed = false;
                    id = arguments[ 1 ];
                } else {
                    anyDepType = _parseDependency( 2, arguments[ 1 ] );
                    if ( anyDepType !== false && typeof factory === 'function' ) {
                        bisNotAllowed = false;
                        dependencies = anyDepType;
                    }
                }
                break;
            case 3:
                bisChoA = typeof arguments[ 1 ] === 'string';
                bisChoC = typeof arguments[ 3 ] === 'function';
                anyDepType = _parseDependency( 3, arguments[ 2 ] );
                if ( bisChoA && bisChoC && anyDepType !== false ) {
                    bisNotAllowed = false;
                    id = arguments[ 1 ];
                    dependencies = anyDepType;
                    factory = arguments[ 3 ];
                }
                break;
        }

        if ( bisNotAllowed ) throw TypeError( log.err( 21, 'internWaiter_notAllowedOrderArgs' ) );

        return [ id, dependencies, factory ];
    };

    _getChannel._parseOrderArgs._parseDependency = function ( lenArgs, anyDeps ) {
        var anyAns = false;

        if ( lenArgs < 2 || 3 < lenArgs ) return false;

        if ( anyDeps == null ) return 'indep';

        if ( anyDeps.constructor === Array ) {
            if ( anyDeps.length === 0 ) anyAns = 'indep';
            else anyAns = anyDeps;
        }

        return anyAns;
    };

    /**
     * 重置： 重置請求的文件資訊。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _getChannel.reset
     * @func _getChannel.reset
     * @param {String} id - 文件識別碼。 當訂單識別碼未設定時，以文件識別碼為依據。
     * @param {String} txtfile - 文件全文。
     * @param {module:initJS.internWaiter~_infoForm} reply - 通知對象。
     */
    _getChannel.reset = function ( strId, txtFile, insReply ) {
        var fileInfo = this.fileInfo;

        fileInfo.id = strId || null;
        fileInfo.txt = txtFile || null;
        fileInfo.reply = insReply || null;
        fileInfo.receive.length = 0;
    };

    /**
     * 運行： {@link module:initJS.internWaiter#order|`internWaiter#order`}
     * 的處理入口，每個訂單必將經過這裡。
     * <br>
     * 有 {@link module:initJS.internWaiter#order|internWaiter#order}
     * 、 {@link module:initJS.internWaiter~_infoForm#_handleMixdeOrder|_infoForm#_handleMixdeOrder}
     * 、 {@link module:initJS.internWaiter~_infoForm#_requestDone|_infoForm#_requestDone}
     * 三處會調用本函式。
     *
     * @memberof module:initJS.internWaiter#
     * @func run
     * @param {?String} id - 識別碼。
     * @param {?(String|Array)} dependencies - 依賴。
     * @param {?*} factory - 工廠。 物件或組裝物件。
     * @param {Object} fileInfo - 文件資訊。
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm.parseId|_infoForm.parseId}
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_handleDeps|_infoForm#_handleDeps}
     */
    internWaiter.prototype.run = function ( strId, anyDeps, anyFactory, objFileInfo ) {
        var insInfoForm;
        var idInfo = _infoForm.parseId( this, strId || objFileInfo.id );
        var id = idInfo[ 0 ];
        var _cache = this._cache;
        var _waiting = this._waiting;
        var bisWaiting = id in _waiting;

        if ( bisWaiting ) insInfoForm = _waiting[ id ];
        else  {
            // 以手動訂單更新物件
            if ( id in _cache ) delete _cache[ id ];

            insInfoForm = new _infoForm( this, idInfo, objFileInfo );
        }

        // 若 insInfoForm.stage === 'request'
        // 原始訂單或手動訂單皆可寫入其物件
        // 反之
        // 以正在接收的為主物件
        insInfoForm.orderReady( anyDeps, anyFactory, objFileInfo );

        if ( !bisWaiting && insInfoForm.remainder ) {
            this._waitingCount++;
            _waiting[ id ] = insInfoForm;
            _updateTimer( this );
        }
    };

    /**
     * 專用通道通行。
     *
     * @memberof module:initJS.internWaiter#
     * @func runPass
     * @param {String} id - 識別碼。 固定為 `//INSWAITER.PASS/` 字串。
     * @param {Array} deps - 依賴包。
     * @param {Function} [factory] - 完成通知。
     */
    internWaiter.prototype.runPass = function ( strId, anyDeps, fnFactory ) {
        fnFactory = typeof fnFactory === 'function' ? fnFactory : null;

        var insInfoForm;
        var _cache = this._cache;
        var _waiting = this._waiting;
        var bisWaiting = strId in _waiting;

        if ( bisWaiting ) insInfoForm = _waiting[ strId ];
        else insInfoForm = new _infoFormForPass( this, strId, fnFactory );

        insInfoForm.pass( anyDeps );

        if ( !bisWaiting && insInfoForm.remainder ) {
            this._waitingCount++;
            _waiting[ strId ] = insInfoForm;
            _updateTimer( this );
        }
    };

    /**
     * 更新計時器。
     *
     * @memberof module:initJS.internWaiter~
     * @func _updateTimer
     * @param {module:initJS.internWaiter} self
     */
    function _updateTimer( insSelf ) {
        var timerId = insSelf._timerId;

        if ( timerId ) clearTimeout( timerId );
        insSelf._timerId = setTimeout( _updateTimer._timerFunc, insSelf._maxTimeout, insSelf );
    }

    /**
     * 計時器共用函式。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _updateTimer._timerFunc
     * @func _updateTimer._timerFunc
     * @param {module:initJS.internWaiter} self
     * @throws {Error} 請求超時。 (21, internWaiter_errRequestTimeout)
     */
    _updateTimer._timerFunc = function ( insSelf ) {
        insSelf._timerId = null;
        if ( !insSelf._waitingCount ) return;
        _stopProcess( insSelf, 'internWaiter_errRequestTimeout' );
        throw Error( log.err( 21, 'internWaiter_errRequestTimeout', insSelf._maxTimeout ) );
    };

    /**
     * 資料表： 管控等待快取裡所有請求中或接收中的資料。
     *
     * @memberof module:initJS.internWaiter~
     * @class _infoForm
     * @param {module:initJS.internWaiter} self
     * @param {Array} idInfo - 識別碼資訊。
     * @param {Object} fileInfo - 文件資訊。
     */
    function _infoForm( insSelf, arrIdInfo, objFileInfo ) {
        this.self = insSelf;
        this.stage = 'request'; // request > receive > create
        this.timestamp = +new Date();

        this.idInfo = arrIdInfo;
        this.id = arrIdInfo[ 0 ];

        this.replyList = objFileInfo.reply ? [ objFileInfo.reply ] : [];
        this.requestObject = null;
    }

    /**
     * 訂單已準備： 請求已回覆，訂單將轉為接收狀態。
     * <br>
     * 只有 {@link module:initJS.internWaiter#run|internWaiter#run} 會調用本函式。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func orderReady
     * @param {?(String|Array)} deps - 依賴。
     * @param {?*} factory - 工廠。
     * @param {Object} fileInfo - 文件資訊。
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_handleDeps|_infoForm#_handleDeps}
     */
    _infoForm.prototype.orderReady = function ( anyDeps, anyFactory, objFileInfo ) {
        if ( this.stage !== 'request' ) return;

        this.stage = 'receive';
        this.fileTxt = objFileInfo.txt || null;
        this.factory = anyFactory;
        this.remainder = 0;

        var p, len;
        var insSelf = this.self;
        // depInfo: "needRequest", "manualOrder", "created", insInfoForm
        var depInfo  = this.depInfo = new _emptyEnum();
        var depStore = this.depStore = new _emptyEnum();

        this._handleMixdeOrder( objFileInfo.receive, insSelf, depInfo );

        if ( anyDeps == null || anyDeps === 'indep' ) {
            this.depPkg = this.deps = anyDeps;
        } else if ( !anyDeps.length ) {
            this.depPkg = this.deps = 'indep';
        } else {
            this.depPkg = _rewrapArr( anyDeps );
            this._handleDeps( anyDeps, insSelf, depInfo, depStore );
        }

        this.notify();
    };

    /**
     * 處理摻雜的訂單。
     * <br>
     * 若 `fileInfo` 裡的接收物件有值，則其應為
     * {@link module:initJS.internWaiter~_infoForm#_parseReceiveInfo|_infoForm#_parseReceiveInfo}
     * 處理過的物件。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _handleMixdeOrder
     * @param {?Array} receive - `fileInfo` 裡的接收物件。
     * @param {module:initJS.internWaiter} self
     * @param {Object} depInfo - 依賴資訊。
     */
    _infoForm.prototype._handleMixdeOrder = function ( arrReceive, insSelf, objDepInfo ) {
        if ( !arrReceive || !arrReceive.length ) return;

        this.remainder++; // 避免提交表單

        var p, len, val, depId;
        var mixedFileInfo = { reply: this };

        for ( p = 0, len = arrReceive.length; p < len ; p++ ) {
            val = arrReceive[ p ];
            depId = val[ 0 ];

            this.remainder++;
            objDepInfo[ depId ] = 'manualOrder';
            insSelf.run( depId, val[ 1 ], val[ 2 ], mixedFileInfo );
        }

        this.remainder--;
    };

    /**
     * 處理依賴： 解析依賴並發送請求。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _handleDeps
     * @param {Array} deps - 依賴。
     * @param {module:initJS.internWaiter} self
     * @param {Object} depInfo - 依賴資訊。
     * @param {Object} depStore - 依賴物件貯存。
     * @throws {Error} 請求迴圈。 (21, internWaiter_errRequestLoopHell)
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_parseDepId|_infoForm#_parseDepId}
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_checkSameDep|_infoForm#_checkSameDep}
     */
    _infoForm.prototype._handleDeps = function ( arrDeps, insSelf, objDepInfo, objDepStore ) {
        var p, len;
        var depId, depIdInfo, insDepInfoForm, newFileInfo;
        var _cache = insSelf._cache;
        var _waiting = insSelf._waiting;
        var deps = this.deps = [];
        var relationChain = this._getRelationChain();
        var arrNeedRequest = [];

        for ( p = 0, len = arrDeps.length; p < len ; p++ ) {
            depIdInfo = this._parseDepId( arrDeps[ p ] );
            depId = depIdInfo[ 0 ];
            deps.push( depId );

            if ( ~relationChain.indexOf( depId ) )
                throw Error( this.catchErr( 'internWaiter_errRequestLoopHell', this.id ) );

            if ( depId in _cache ) {
                objDepInfo[ depId ] = 'created';
                objDepStore[ depId ] = _cache[ depId ];
            } else if ( depId in _waiting ) {
                this.remainder++;
                insDepInfoForm = objDepInfo[ depId ] = _waiting[ depId ];
                insDepInfoForm.replyList.push( this );
            } else {
                this.remainder++;
                objDepInfo[ depId ] = 'needRequest';
                arrNeedRequest.push( depIdInfo );
            }
        }

        this._checkSameDep( deps );

        if ( arrNeedRequest.length ) {
            newFileInfo = { reply: this };
            p = 0;
            len = arrNeedRequest.length;
            while ( p < len ) this._requestDep( arrNeedRequest[ p++ ],  newFileInfo );
        }
    };

    /**
     * 取得關係鏈： 回傳一個對本物件存在依賴的關係鏈陣列。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _getRelationChain
     * @param {Array} [ans] - 收集關係鏈陣列。
     * @return {Array}
     */
    _infoForm.prototype._getRelationChain = function _getRelationChain( arrAns ) {
        var id = this.id;

        if ( arrAns ) arrAns.push( id );
        else arrAns = [ id ];

        var replyList = this.replyList;
        var len = replyList.length;

        if ( len ) while ( len-- ) replyList[ len ]._getRelationChain( arrAns );

        return arrAns;
    };

    /**
     * 檢查是否有無謂的相同依賴。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _checkSameDep
     * @param {Array} deps - 依賴。
     * @throws {Error} 依賴包重複請求相同來源。 (21, internWaiter_foundSameDep)
     */
    _infoForm.prototype._checkSameDep = function ( arrDeps ) {
        var len = arrDeps.length;
        while ( len-- )
            if ( arrDeps.indexOf( arrDeps[ len ] ) !== len )
                throw Error( this.catchErr( 'internWaiter_foundSameDep', this.id ) );
    };

    /**
     * 請求依賴。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _requestDep
     * @param {Object} depIdInfo - 依賴識別碼資訊。
     * @param {Object} newFileInfo - 替代的文件資訊。
     * @return {module:initJS.internWaiter~_infoForm}
     */
    _infoForm.prototype._requestDep = function ( arrDepIdInfo, objNewFileInfo ) {
        var insSelf = this.self;
        var depId = arrDepIdInfo[ 0 ];
        var queryString = arrDepIdInfo[ 3 ];
        var insDepInfoForm;

        insDepInfoForm
            = this.depInfo[ depId ]
            = new _infoForm( insSelf, arrDepIdInfo, objNewFileInfo );

        insSelf._waitingCount++;
        insSelf._waiting[ depId ] = insDepInfoForm;

        insDepInfoForm.requestObject = insSelf.request(
            queryString,
            depId,
            function done( err, txt ) {
                insDepInfoForm._requestDone( err, txt, depId, queryString );
            }
        );

        return insDepInfoForm;
    };

    /**
     * 請求完成： 處理請求的回調。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _requestDone
     * @param {(String|Error)} err - 日誌代碼或錯誤實例。
     * {@link module:initJS.internWaiter#request|internWaiter#request} 的回調物件。
     * @param {*} txt - {@link module:initJS.internWaiter#request|internWaiter#request} 的回調物件。
     * @param {String} depId - 依賴識別碼。
     * @param {Object} queryString - 識別值參數。
     */
    _infoForm.prototype._requestDone = function ( err, txt, strDepId, objQueryString ) {
        if ( this.stage !== 'request' ) return;
        if ( err ) throw Error( this.catchErr( err ) );

        var mainOrder;
        var insSelf = this.self;
        var order = insSelf.order;
        var fileInfo = order.fileInfo;
        var newFileInfo = { txt: txt, receive: [] };

        order.reset();
        order.receiveSwitch = true;
        insSelf.readEval( objQueryString, order, txt );
        mainOrder = this._parseReceiveInfo( strDepId, fileInfo.receive, newFileInfo.receive );
        order.receiveSwitch = false;
        order.reset();

        if ( mainOrder ) insSelf.run( strDepId, mainOrder[ 1 ], mainOrder[ 2 ], newFileInfo );
        else insSelf.run( strDepId, null, null, newFileInfo );
    };

    /**
     * 解析接收資訊： 解析
     * {@link module:initJS.internWaiter#readEval|internWaiter#readEval}
     * 所接收的資訊，分辨普通訂單和手動訂單。
     * <br>
     * 若收到有重複的訂單時，依
     * {@link module:initJS.internWaiter|internWaiter}：
     * 「若接收中的訂單和手動定單重疊，以正在接收的為主物件。」
     * 的邏輯以先接收的訂單為主。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _parseReceiveInfo
     * @param {String} depId - 依賴識別碼。
     * @param {Array} receive - `order.fileInfo` 裡的接收物件。
     * @param {Array} newReceive - 替代的接收物件。
     * @return {Array} 普通（主要）訂單。
     */
    _infoForm.prototype._parseReceiveInfo = function ( strDepId, arrReceive, arrNewReceive ) {
        var p, len, val;
        var mixedOrderIds = [];
        var mainOrder = null;

        // 可能出現多個 同值 或 空值
        for ( p = 0, len = arrReceive.length; p < len ; p++ ) {
            val = arrReceive[ p ];

            switch ( val[ 0 ] ) {
                case null:
                    if ( !mainOrder ) mainOrder = val;
                    break;
                case strDepId:
                    if ( !mainOrder ) mainOrder = val;
                    break;
                default:
                    if ( !~mixedOrderIds.indexOf( val[ 0 ] ) ) {
                        mixedOrderIds.push( val[ 0 ] );
                        arrNewReceive.push( val );
                    }
            }
        }

        return mainOrder;
    };

    /**
     * 通知： 通知本訂單的請求已建立。
     * <br>
     * 有 {@link module:initJS.internWaiter~_infoForm#orderReady|_infoForm#orderReady}
     * 、 {@link module:initJS.internWaiter~_infoForm#_submit|_infoForm#_submit}
     * 兩處會調用本函式。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func notify
     * @param {String} id - 識別碼。
     * @param {?*} module - 建立之物件。
     */
    _infoForm.prototype.notify = function ( strId, anyModule ) {
        if ( this.stage !== 'receive' ) return;

        var depInfo = this.depInfo;

        if ( strId && depInfo[ strId ] !== 'created' ) {
            depInfo[ strId ] = 'created';
            this.depStore[ strId ] = anyModule;
            this.remainder--;
        }

        if ( this.remainder === 0 ) this._submit();
    };

    /**
     * 提交： 當沒有依賴或所有依賴皆完成建立時會被調用以建立本訂單物件。
     * 當本訂單物件建立時會觸發
     * {@link module:initJS.internWaiter#finish|internWaiter#finish}
     * ，並向依賴本訂單的等待訂單發送通知。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _submit
     */
    _infoForm.prototype._submit = function () {
        this.stage = 'create';

        var p, len;
        var module;
        var insSelf = this.self;
        var _waiting = insSelf._waiting;
        var id = this.id;
        var factory = this.factory;
        var replyList = this.replyList;

        switch ( this.deps ) {
            case null:
                module = factory;
                break;
            case 'indep':
                module = factory();
                break;
            default:
                module = factory.apply( null, this._getPushArgs() );
        }

        insSelf._cache[ id ] = module;
        if ( id in _waiting ) {
            delete _waiting[ id ];
            if ( !--insSelf._waitingCount ) clearTimeout( insSelf._timerId );
        }
        insSelf.finish( id, module, this.fileTxt, this.dep, this.depPkg, factory );

        if ( replyList ) {
            for ( p = 0, len = replyList.length; p < len ; p++ ) {
                replyList[ p ].notify( id, module );
            }
        }
    };

    /**
     * 取得函數參數： 提取所需依賴，以陣列型態回傳。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _getPushArgs
     * @return {Array}
     */
    _infoForm.prototype._getPushArgs = function () {
        var orderArgs = this.deps;
        var depStore = this.depStore;
        var len = orderArgs.length;
        var arrAns = new Array( len );

        while ( len-- ) arrAns[ len ] = depStore[ orderArgs[ len ] ];

        return arrAns;
    };

    /**
     * 捕獲錯誤： 集中處理錯誤事件。 會調用
     * {@link module:initJS.internWaiter~_stopProcess|internWaiter~_stopProcess}
     * 終止請求程序。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func catchErr
     * @param {(String|Error)} err - 日誌代碼或錯誤實例。
     * @throws {Error} 請求所捕獲的錯誤。
     * @return {String} `log.err()` 的回傳值。
     */
    _infoForm.prototype.catchErr = function ( anyErr ) {
        var args;
        var insSelf = this.self;
        var bisInsOfError = anyErr instanceof Error;

        _stopProcess( insSelf, bisInsOfError ? anyErr.message : anyErr );

        if ( bisInsOfError ) throw anyErr;

        args = _rewrapArr( arguments );
        args.unshift( 21 );
        if ( typeof args[ 1 ] !== 'string' ) args[ 1 ] = '';

        return log.err.apply( log, args );
    };

    /**
     * 解析識別碼（{@link module:initJS.internWaiter#run|internWaiter#run} 專用）。
     * <br>
     * 綁定 `new {@link module:initJS.internWaiter~_infoForm|_infoForm}( null, [ 'specialInternWaiter#run' ], {} );`
     * 的專用解析識別碼函式。
     *
     * @memberof module:initJS.internWaiter~_infoForm.
     * @func parseId
     * @param {module:initJS.internWaiter} self
     * @param {String} id - 識別碼。
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_parseId|_infoForm#_parseId}
     * @return {Array} [ id, origin, dirname, null ]
     */
    _infoForm.parseId = function ( insSelf, strId ) {
        this.self = insSelf;
        return this._parseId( strId );
    }.bind( new _infoForm( null, [ 'specialInternWaiter#run' ], {} ) );

    /**
     * 解析識別碼。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _parseId
     * @param {String} id - 識別碼。
     * @throws {Error} 識別碼為非空值的字串。 (21, internWaiter_notAllowedId)
     * @throws {Error} 識別碼不符合網址期待。
     * [_infoForm#_regexUrlAbsolute]{@link module:initJS.internWaiter~_infoForm#_regexUrlAbsolute}
     * 檢查無法通過。 (21, internWaiter_notConformUrlRule)
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_parseUrlRelative|_infoForm#_parseUrlRelative}
     * @return {Array} [ id, origin, dirname, null ]
     */
    _infoForm.prototype._parseId = function ( strId ) {
        if ( !strId || typeof strId !== 'string' )
            throw Error( this.catchErr( 'internWaiter_notAllowedId' ) );

        if( !~strId.indexOf( '/' ) || this.self._blockParseId ) return [ strId ];

        var matchUrlAbsolute = strId.match( this._regexUrlAbsolute );

        if ( !matchUrlAbsolute ) throw Error( this.catchErr( 'internWaiter_notConformUrlRule' ) );

        var idInfo = this._parseUrlRelative( null, matchUrlAbsolute[ 1 ], strId );
        idInfo.push( null );

        return idInfo;
    };

    /**
     * 解析依賴識別碼。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _parseDepId
     * @param {String} depId - 依賴識別碼。
     * @throws {Error} 識別碼為非空值的字串。 (21, internWaiter_notAllowedId)
     * @throws {Error} 識別碼不符合網址期待。
     * {@link module:initJS.internWaiter~_infoForm#_regexDepIdFomat|_infoForm#_regexDepIdFomat}
     * 檢查無法通過。 (21, internWaiter_notConformUrlRule)
     * @throws {Error} 見 {@link module:initJS.internWaiter~_infoForm#_parseUrlRelative|_infoForm#_parseUrlRelative}
     * @return {Array} [ id, origin, dirname, queryString ]
     */
    _infoForm.prototype._parseDepId = function ( strDepId ) {
        if ( !strDepId || typeof strDepId !== 'string' )
            throw Error( this.catchErr( 'internWaiter_notAllowedId' ) );

        if( !~strDepId.indexOf( '/' ) || this.self._blockParseId ) return [ strDepId ];

        var matchDepIdFomat = strDepId.match( this._regexDepIdFomat );

        if ( !matchDepIdFomat ) throw Error( this.catchErr( 'internWaiter_notConformUrlRule' ) );

        var idInfo = this._parseUrlRelative(
            this.idInfo,
            matchDepIdFomat[ 3 ],
            matchDepIdFomat[ 2 ]
        );
        var strQs = matchDepIdFomat[ 1 ];
        var queryString = {};

        if ( strQs )
            strQs.replace( this._regexQueryString, function () {
                queryString[ arguments[ 1 ] ] = arguments[ 2 ];
            } );

        idInfo.push( queryString );

        return idInfo;
    };

    /**
     * 解析網址相對關係： 協助
     * {@link module:initJS.internWaiter~_infoForm#_parseId|_infoForm#_parseId} 、
     * {@link module:initJS.internWaiter~_infoForm#_parseDepId|_infoForm#_parseDepId}
     * 取得大部分的識別碼資訊。
     * <br>
     * <br>
     * 注意，可能有網址陷阱！
     * <br>
     * 1.
     * <br>
     * 網址 `/ABC` 可通過解析；
     * 但若網址 `http://ABC` 則不給過，必須為 `http://ABC/` 才可以。
     * <br>
     * 試想 `/` 網址可是為 `http://example.com/` 的最後一撇斜線呢！
     * <br>
     * 2.
     * <br>
     * 若網址為 `/ABC/EFG` ，則相對路徑 `../Hi` 為 `/Hi`；
     * <br>
     * 若網址為 `/ABC/EFG/` ，則相對路徑 `../Hi` 為 `/ABC/Hi` 。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @func _parseUrlRelative
     * @param {Array} idInfo - 識別碼資訊。
     * @param {String} prefix - 前綴符。 用已得知的資訊減少正規的判別網址相對絕對路徑關係。
     * @param {String} path - 待解析路徑。
     * @throws {Error} 識別碼不符合網址期待。
     * `http://`,`//` 絕對路徑類的網址不符合預期，
     * {@link module:initJS.internWaiter~_infoForm#_regexUrlOrigin|_infoForm#_regexUrlOrigin}
     * 檢查無法通過。 (21, internWaiter_notConformUrlRule)
     * @throws {Error} 識別碼不符合網址期待。
     * `../` 已超出網域範圍。 (21, internWaiter_notConformUrlRule)
     * @return {Array} [ id, origin, dirname ]
     */
    _infoForm.prototype._parseUrlRelative = function ( arrIdInfo, strPrefix, strPath ) {
        var p, len, val, idxLast;
        var id, matchOrigin, basePath, path;
        var origin = '';
        var filename = '';
        var dirname = [];

        if ( strPrefix === './' || strPrefix === '../' ) {
            origin = arrIdInfo[ 1 ] || '';
            basePath = arrIdInfo[ 2 ] || [];
            path = strPath;
        } else if ( strPrefix === '/' ) {
            origin = '';
            basePath = [];
            path = strPath;
        } else {
            matchOrigin = strPath.match( this._regexUrlOrigin );
            if ( !matchOrigin ) throw Error( this.catchErr( 'internWaiter_notConformUrlRule' ) );
            origin = matchOrigin[ 1 ] || '';
            basePath = [];
            path = '/' + ( matchOrigin[ 2 ] || '' );
        }

        if ( path[ path.length - 1 ] === '/' ) path += '.';
        path = basePath.concat( path.split( '/' ) );
        len = path.length;
        idxLast = len - 1;
        for ( p = 0; p < len ; p++ ) {
            val = path[ p ];
            switch ( val ) {
                case '': break;
                case '.': break;
                case '..':
                    if ( !dirname.length )
                        throw Error( this.catchErr( 'internWaiter_notConformUrlRule' ) );
                    dirname.pop();
                    break;
                default:
                    if ( p < idxLast ) dirname.push( val );
                    else filename = val;
            }
        }

        id = origin + '/' + ( dirname.length ? dirname.join( '/' ) + '/' : '' ) + filename;
        return [ id, origin, dirname ];
    };

    var urlComplete = 'https?:\\/\\/|ftps?:\\/\\/|\\/\\/';
    var urlAbsolutePath = urlComplete + '|\\/';
    var urlRelativePath = '\\.\\/|\\.\\.\\/';
    var urlAvailable = urlAbsolutePath + '|' + urlRelativePath;
    var allowString = '[$_0-9A-Za-z]+';
    var urlQueryStringOne = allowString + '=' + allowString;
    var urlQueryString = '(?:' + urlQueryStringOne + '&)*' + urlQueryStringOne + ':';

    /**
     * 絕對路徑網址的正規表示式：
     * `/^(https?:\/\/|ftps?:\/\/|\/\/|\/)/` 。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @var {RegExp} _regexUrlAbsolute
     */
    _infoForm.prototype._regexUrlAbsolute  = RegExp( '^(' + urlAbsolutePath + ')' );

    /**
     * 網址起始的正規表示式： `/^(?:((?:https?:\/\/|ftps?:\/\/|\/\/)[^/]+)/)(.+)?/` 。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @var {RegExp} _regexUrlOrigin
     */
    _infoForm.prototype._regexUrlOrigin    = RegExp( '^(?:((?:' + urlComplete + ')[^/]+)/)(.+)?' );

    /**
     * 依賴識別碼格式的正規表示式：
     * `/^((?:[$_0-9A-Za-z]+=[$_0-9A-Za-z]+&)*[$_0-9A-Za-z]+=[$_0-9A-Za-z]+:)?((https?:\/\/|ftps?:\/\/|\/\/|\/|\.\/|\.\.\/).*)/`
     * 。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @var {RegExp} _regexDepIdFomat
     */
    _infoForm.prototype._regexDepIdFomat   = RegExp( '^(' + urlQueryString + ')?((' + urlAvailable + ').*)' );

    /**
     * 識別值參數的正規表示式：
     * `/([$_0-9A-Za-z]+)=([$_0-9A-Za-z]+)/g` 。
     *
     * @memberof module:initJS.internWaiter~_infoForm#
     * @var {RegExp} _regexQueryString
     */
    _infoForm.prototype._regexQueryString  = RegExp( '(' + allowString + ')=(' + allowString + ')', 'g' );

    /**
     * 專用通道資料表。
     *
     * @memberof module:initJS.internWaiter~
     * @class _infoFormForPass
     * @param {module:initJS.internWaiter} self
     * @param {String} id - 識別碼。 固定為 `//INSWAITER.PASS/` 字串。
     * @param {Function} [factory] - 完成通知。
     */
    function _infoFormForPass( insSelf, strId, anyFactory ) {
        this.self = insSelf;
        this.stage = 'receive';
        this.timestamp = +new Date();

        this.idInfo = [ strId ];
        this.id = strId;

        this.replyList = [];
        this.requestObject = null;

        this.fileTxt = null;
        this.factory = anyFactory;
        this.remainder = 0;

        this.deps = [];
        this.depInfo = new _emptyEnum();
        // var depStore = this.depStore = new _emptyEnum();
        // this.depPkg = _rewrapArr( anyDeps );
    }

    Object.setPrototypeOf( _infoFormForPass.prototype, _infoForm.prototype );

    /**
     * 通過： 請求處理。
     *
     * @memberof module:initJS.internWaiter~_infoFormForPass#
     * @func pass
     * @param {Array} deps - 依賴。
     */
    _infoFormForPass.prototype.pass = function ( arrDeps ) {
        var p, len;
        var id, idInfo;
        var insSelf = this.self;
        var _cache = insSelf._cache;
        var _waiting = insSelf._waiting;
        var deps = this.deps;
        var newFileInfo = { reply: this };

        this.remainder++;

        for ( p = 0, len = arrDeps.length; p < len ; p++ ) {
            idInfo = this._parseId( arrDeps[ p ] );
            id = idInfo[ 0 ];

            if ( id in _cache || id in _waiting ) continue;
            if ( ~deps.indexOf( id ) ) continue;

            this.remainder++;
            deps.push( id );
            idInfo[ 3 ] = {};
            this._requestDep( idInfo,  newFileInfo );
        }

        this.remainder--;
        this.notify();
    };

    /**
     * 通知。
     *
     * @memberof module:initJS.internWaiter~_infoFormForPass#
     * @func notify
     * @param {String} id - 識別碼。
     */
    _infoFormForPass.prototype.notify = function ( strId ) {
        if ( this.stage !== 'receive' ) return;

        var id, insSelf, _waiting, factory;
        var deps = this.deps;
        var idx = strId ? deps.indexOf( strId ) : -1;

        if ( ~idx ) {
            _spliceOne( deps, idx );
            delete this.depInfo[ strId ];
            this.remainder--;
        }

        if ( this.remainder === 0 ) {
            insSelf = this.self;
            _waiting = insSelf._waiting;
            id = this.id;
            factory = this.factory;

            this.stage = 'create';

            if ( id in _waiting ) {
                delete _waiting[ id ];
                if ( !--insSelf._waitingCount ) clearTimeout( insSelf._timerId );
            }

            if ( factory ) factory();
        }
    };

    /**
     * 終止程序： 停止等待快取中的所有物件，並發出帶文字圖表的警告做簡略說明 (20, internWaiter_errKillProcess)。
     *
     * @memberof module:initJS.internWaiter~
     * @func _stopProcess
     * @param {module:initJS.internWaiter} self
     * @param {String} msgCode - 調用此次終止程序的錯誤日誌代碼。
     */
    function _stopProcess( insSelf, strMsgCode ) {
        var _waiting = insSelf._waiting;

        if ( !insSelf._waitingCount ) return;

        var key, insInfoForm;
        var waitingInfo = [];

        for ( key in _waiting ) {
            insInfoForm = _waiting[ key ];

            if ( insInfoForm.stage === 'request' ) {
                insSelf.abort( insInfoForm.requestObject );
            } else {
                waitingInfo.push( [ key, _stopProcess._detail( insInfoForm.depInfo ) ] );
            }

            insSelf._waitingCount--;
            delete _waiting[ key ];
        }

        if ( waitingInfo.length ) {
            log.warn(
                20, 'internWaiter_errKillProcess',
                ' (' + strMsgCode + ')' + _stopProcess._relationChart( waitingInfo )
            );
        }
    }

    /**
     * 細節： 整理顯示訊息並提供
     * {@link module:initJS.internWaiter~_stopProcess._relationChart|internWaiter~_stopProcess._relationChart}
     * 更容易處理的格式。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _stopProcess._detail
     * @func _stopProcess._detail
     * @param {Object} depInfo - 依賴資訊。 提供該訂單所有需求的依賴資訊。
     * 其成員值有： `created`（已建立） 、 `manualOrder`（手動訂單） 、 `needRequest`（待請求） 、
     * {@link module:initJS.internWaiter~_infoForm|`_infoForm`}（請求中、接收中） 。
     * @return {Array}
     */
    _stopProcess._detail = function ( objDepInfo ) {
        var key, item;
        var arrAns = [];

        for ( key in objDepInfo ) {
            item = objDepInfo[ key ];

            switch ( item ) {
                case 'created': break;
                case 'manualOrder':
                    arrAns.push( [ key + ' (manualOrder)', null ] );
                    break;
                case 'needRequest':
                    arrAns.push( [ key + ' (needRequest)', null ] );
                    break;
                default:
                    arrAns.push( [
                        key + ' (' + item.stage + ') (qs: ' + JSON.stringify( item.idInfo[ 3 ] ) + ')',
                        null
                    ] );
            }
        }

        return arrAns;
    };

    /**
     * 關係圖表。
     *
     * @memberof! module:initJS.internWaiter~
     * @alias _stopProcess._relationChart
     * @func _stopProcess._relationChart
     * @param {Array} table - 表單。
     * @param {String} prefix - 圖表用前綴符。
     * @return {String}
     */
    _stopProcess._relationChart = function _relationChart( arrTable, strPrefix ) {
        strPrefix = strPrefix || '';

        var p, len, idxLast, val, endLine;
        var strAns = '';

        len = arrTable.length;
        idxLast = len - 1;
        for ( p = 0; p < len ; p++ ) {
            val = arrTable[ p ];
            endLine = val[ 1 ] ? '─┬ ' : '── ' ;

            if ( p < idxLast ) {
                strAns += '\n ' + strPrefix + '├' + endLine + val[ 0 ];
                if ( val[ 1 ] ) strAns += _relationChart( val[ 1 ], '│ ' );
            } else {
                strAns += '\n ' + strPrefix + '└' + endLine + val[ 0 ];
                if ( val[ 1 ] ) strAns += _relationChart( val[ 1 ], '  ' );
            }
        }

        return strAns;
    };

    /**
     * 請求。
     *
     * @abstract
     * @memberof module:initJS.internWaiter#
     * @func request
     * @param {Object} queryString - 識別值參數。
     * @param {String} depId - 依賴識別值。
     * @param {Function} done - 回調函式。
     * @return {*} 給予事後可取消請求的識別物件。
     */
    internWaiter.prototype.request = function ( objQueryString, strDepId, fnDone ) {};

    /**
     * 取消請求。
     *
     * @abstract
     * @memberof module:initJS.internWaiter#
     * @func abort
     * @param {*} requestObject - {@link module:initJS.internWaiter#request|internWaiter#request} 的回傳值。
     */
    internWaiter.prototype.abort = function ( anyRequestObject ) {};

    /**
     * 讀取： 把請求回呼的值轉化為爪哇腳本可用，並以
     * {@link module:initJS.internWaiter#order|internWaiter#order} 對其執行。
     *
     * @abstract
     * @memberof module:initJS.internWaiter#
     * @func readEval
     * @param {Object} queryString - 識別值參數。
     * @param {module:initJS.internWaiter#order} order
     * @param {*} txt - {@link module:initJS.internWaiter#request|internWaiter#request} 的回調物件。
     */
    internWaiter.prototype.readEval = function ( objQueryString, fnOrder, txt ) {};

    /**
     * 完成： 此時的訂單已結案，所建立的物件也可在快取中查找。
     *
     * @abstract
     * @memberof module:initJS.internWaiter#
     * @func finish
     * @param {String} depId - 依賴識別值。
     * @param {?*} module - 建立之物件。
     * @param {*} txt - {@link module:initJS.internWaiter#request|internWaiter#request} 的回調物件。
     * @param {?(String|Array)} deps - 依賴。 其值有： `null` 、 `indep` 和已解析過依賴識別碼。
     * @param {?(String|Array)} depPkg - 依賴包。 其值有： `null` 、 `indep` 和原始依賴識別碼。
     * @param {?*} factory - 工廠。
     */
    internWaiter.prototype.finish = function ( strDepId, anyModule, txt, anyDeps, anyDepPkg, anyFactory ) {};

    return internWaiter;
},
function yeseed( log, internWaiter, logNeedle ) {
    var insWaiter = new internWaiter();
    var order = insWaiter.order;

    order.cache = insWaiter._cache;
    order( '/pure/logNeedle', logNeedle );
    order( '/pure/log', log );
    order( '/pure/internWaiter', internWaiter );

    if ( typeof initJS === 'function' ) initJS( order );
    else if ( typeof module === "object" ) module.exports = order;
    else if ( typeof window === "object" ) window.order = order;
}
);

