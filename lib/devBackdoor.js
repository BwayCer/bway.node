/*! Developer Backdoor @license: CC-BY-4.0 - BwayCer (https://bwaycer.github.io/about/) */

/**
 * 開發者後門 Developer Backdoor
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */

"use strict";


module.exports = function ( log, jspi ) {
    log._devErrInfo = {};
    log._devErrRef = log.err;

    log.err = function ( numCode, strMsgCode ) {
        var errInfo = this._devErrInfo;
        errInfo.code = numCode;
        errInfo.msgCode = strMsgCode;
        return this._devErrRef.apply( this, arguments );
    };

    /***
     * 捕獲錯誤： 捕獲並驗證錯誤。
     *
     * @memberof module:devBackdoor~log.
     * @func catchErr
     * @param {Function} landmine - 會拋錯的地雷函式。
     * @param {Error} [classErr] - 錯誤類物件。
     * @param {Number} [code] - 訊息代碼。
     * @param {String} [msgCode] - 打印訊息的日誌代碼。
     * @param {String} [showMsg] - 顯示訊息。
     * @throws {Error} 沒有預期的意外 Missing expected exception。
     * @throws {Error} `fnLandmine` 或 "自行驗證" 拋出的錯誤。
     * @throws {Error} 顯示訊息的錯誤內容。
     */
    log.catchErr = function ( fnLandmine, classErr, numCode, strMsgCode, strShowMsg ) {
        var actual, errInfo, checkBySelf, rightType, rightCode, rightMsgCode;

        if ( typeof classErr !== 'function' ) {
            strShowMsg = strMsgCode;
            strMsgCode = numCode;
            numCode = classErr;
            classErr = null;
        } else if ( Error !== classErr && !Error.isPrototypeOf( classErr ) ) {
            checkBySelf = classErr;
            classErr = null;
        }

        try { fnLandmine() }
        catch ( err ) { actual = err; }

        if ( !actual ) throw Error( 'Missing expected exception. （' + strShowMsg + '）' );

        // 自行驗證
        if ( classErr( actual ) === true ) throw actual;

        errInfo = this._devErrInfo;
        rightType = classErr && actual.constructor === classErr;
        rightCode = numCode && numCode === errInfo.code;
        rightMsgCode = strMsgCode && strMsgCode === errInfo.msgCode;

        if ( rightType && rightCode && rightMsgCode ) return;
        throw Error( strShowMsg + '（' + actual.toString() + '）' );
    };


    jspi._devCreateRef = jspi.create;

    var devRegistry = {};

    void function ( registry, jspi ) {
        jspi.create = function ( strCobjName ) {
            var fnAns = this._devCreateRef.apply( this, arguments );

            fnAns._devClearRef = fnAns.clear;

            fnAns.clear = function ( anyProduct ) {
                var devCobj = registry[ strCobjName ] = this();
                devCobj.jspiProduct = anyProduct;
                this._devClearRef();
            };

            return fnAns;
        };
    }( devRegistry, jspi );


    return [ log, devRegistry ];
};

