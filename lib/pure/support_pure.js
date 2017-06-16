/**
 * 爪哇腳本語言支援補充包 support_pure
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */


order( [ '/pure/support' ], function ( support ) {
    "use strict";

    /***
     * 空枚舉： 創建一個「乾淨」的空物件陣列。
     * <br>
     * 其運用實例實作比調用 `Object.create( null )` 更有效率。（翻譯自 node 注釋）
     *
     * @see [nodejs/node v7.x > events.js#L5 - GitHub]{@link https://github.com/nodejs/node/blob/v7.x/lib/events.js#L5}
     *
     * @func emptyEnum
     */
    support.emptyEnum = function emptyEnum() {};
    support.emptyEnum.prototype = Object.create( null );

    /***
     * 陣列的重新包裝。
     *
     * @func rewrapArr
     * @param {Array} target - 複製目標對象。
     * @return {Array}
     */
    support.rewrapArr = function rewrapArr( arrTarget ) {
        var len = arrTarget.length;
        var arrAns = new Array( len );

        while ( len-- ) arrAns[ len ] = arrTarget[ len ];
        return arrAns;
    };

    /***
     * 一單位接合。
     * 其效率比 `Array#splice` 使用兩個參數的狀況還快約 1.5 倍。（翻譯自 node 注釋）
     * <br>
     * 但測試結果，陣列項目需少於 16 樣時才有明顯效果。
     * 當陣列長度為 16 時，效率與 `Array#splice` 相比可達近一倍快，且項目愈少愈快。
     *
     * @see [nodejs/node v8.x > events.js#L492 - GitHub]{@link https://github.com/nodejs/node/blob/v8.x/lib/events.js#L492}
     *
     * @func spliceOne
     * @param {Array} list - 目標陣列。
     * @param {Number} index - 刪除項目的引索位置。
     * @return {?*} 移除的物件。
     */
    support.spliceOne = function spliceOne( arrList, numIndex ) {
        if ( numIndex === -1 ) return null;

        var len = arrList.length - 1;
        var anyAns = arrList[ numIndex ];

        while ( numIndex < len ) arrList[ numIndex ] = arrList[ ++numIndex ];
        arrList.pop();

        return anyAns;
    };
} );

