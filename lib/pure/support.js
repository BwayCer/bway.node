/**
 * 爪哇腳本語言支援補充 Support
 *
 * @file
 * @author 張本微
 * @license CC-BY-4.0
 * @see [個人網站]{@link https://bwaycer.github.io/about/}
 */


order( null, function () {
    "use strict";

    /**
     * 爪哇腳本語言支援補充。
     *
     * @class support
     */
    function support() {}

    /**
     * 檢查屬性。
     *
     * @memberof support#
     * @func checkProp
     * @param {...Array} checkInfo - 檢查之資訊。
     * @param {*} checkInfo.0 - 檢查之物件。
     * @param {...String} checkInfo.order - 檢查的屬性名。
     * @param {(String|Function)} noPropOpt - 無屬性時操作。
     * 見 {@link support~_check} 。
     * @return {support}
     *
     * @example
     * support
     *     .checkProp(
     *         [ Object, 'defineProperty' ],
     *         'JS Run Platform Not Support. ( %main.%method )'
     *     )
     *     .checkProp(
     *         [ String.prototype, 'replace' ],
     *         [ Array, 'transClone' ],
     *         [ Array.prototype, 'map', 'qSplice' ],
     *         [ Object, 'extend' ],
     *         [ Function.prototype, 'extend' ],
     *         '基礎應用不支持。'
     *     )
     * ;
     */
    support.prototype.checkProp = function checkProp() {
        var anyMain, arrCheckInfo;
        var p = 0;
        var lenOfArgs = arguments.length;
        var anyNoPropCho = arguments[ --lenOfArgs ];

        while ( p < lenOfArgs ) {
            arrCheckInfo = arguments[ p++ ];
            anyMain = arrCheckInfo.shift();
            this.sequenceActCheck( anyMain, arrCheckInfo, anyNoPropCho );
        }

        return this;
    };

    /**
     * 增加屬性： 直接將屬性讓渡給指定物件。
     *
     * @memberof support#
     * @func addProp
     * @param {*} main - 檢查之物件。
     * @param {Object} propList - 補充的屬性清單
     * @return {support}
     */
    support.prototype.addProp = function addProp( anyMain, objPropList ) {
        _check(
            this.isExistProp, this.catchErr,
            anyMain, Object.keys( objPropList ),
            function ( anyMain, strPropName ) {
                anyMain[ strPropName ] = objPropList[ strPropName ];
            }
        );
        return this;
    };

    /**
     * 客製化屬性： 以函式回傳值為屬性渡給指定物件。
     *
     * @memberof support#
     * @func customProp
     * @param {*} main - 檢查之物件。
     * @param {Object} propList - 補充的屬性清單
     * @return {support}
     */
    support.prototype.customProp = function customProp( anyMain, objPropList ) {
        _check(
            this.isExistProp, this.catchErr,
            anyMain, Object.keys( objPropList ),
            function ( anyMain, strPropName ) {
                objPropList[ strPropName ]( anyMain, strPropName );
            }
        );
        return this;
    };

    /**
     * 屬性是否存在。
     * <br>
     * <br>
     * 錯誤範例：
     * <br>
     * * 若以 `Element.prototype.parentNode` 會觸發執行而拋出 `Illegal invocation` 的錯誤。
     * <br>
     * * 若以 `Element.prototype.hasOwnProperty('parentNode')` 則因只查找其擁有之成員而回傳 `false` 的判斷。
     *
     * @abstract
     * @memberof support#
     * @func isExistProp
     * @param {*} main - 檢查之物件。
     * @param {String} propName - 檢查的屬性名。
     * @return {Boolean}
     */
    support.prototype.isExistProp = function isExistProp( objMain, strPropName ) {
        return strPropName in objMain;
    };

    /**
     * 捕獲錯誤。
     *
     * @abstract
     * @memberof support#
     * @func catchErr
     * @param {Error} err - 錯誤。 見 {@link support~_supportErr} 。
     * @param {*} err.object - 檢查之物件。
     * @param {String} err.propName - 檢查的屬性名。
     */
    support.prototype.catchErr = function catchErr( err ) { throw err; };

    /**
     * 檢查： 檢查屬性存在與否。
     *
     * @memberof support~
     * @func _check
     * @param {support#isExistProp} isExistProp。
     * @param {support#catchErr} catchErr。
     * @param {*} main - 檢查之物件。
     * @param {Array} propertyList - 檢查的屬性名清單。
     * @param {(String|Function)} noPropOpt - 無屬性時操作。
     * 若為 `String` 見 {@link support~_supportErr} ；
     * 若為 `Function` 則會執行 `noPropOpt( main, propName )` 。
     * @throws {Error} 見 {@link support#catchErr} 。
     */
    function _check( fnIsExistProp, fnCatchErr, anyMain, arrPropList, anyNoPropOpt ) {
        anyNoPropOpt = anyNoPropOpt || 'JS Not Support. (%object).(%propname)';

        var p = 0;
        var len = arrPropList.length;
        while ( p < len ) {
            if( fnIsExistProp( anyMain, strPropName ) ) continue;

            if ( typeof anyNoPropOpt === 'function' ) anyNoPropOpt( objMain, strPropName );
            else fnCatchErr( _supportErr( anyNoPropOpt, objMain, strPropName ) );
        }
        this.actOnNoProp( anyNoPropCho, anyMain, strPropName );
        this.check( objMain, arrPropertyList[ p++ ], anyNoPropCho );
    }

    /**
     * 支持的錯誤： 創建支持模組專用的錯誤。
     *
     * @memberof support~
     * @func _supportErr
     * @param {String} errMsg - 錯誤訊息。
     * @param {*} main - 檢查之物件。
     * @param {String} propName - 檢查的屬性名。
     * @return {Error} `errMsg` 或是 'JS Not Support. (%object).(%propname)'。
     *
     * @example
     * // 錯誤訊息提供 `%object`、`%propname` 兩個特殊關鍵字可做使用。
     * // 錯誤物件中也帶有 `err.object`、`err.propname` 兩個原始物件。
     * _supportErr( 'JS Not Support. (%object).(%propname)', Function, 'lazy' );
     * // err = Error( 'JS Not Support. (object Function).(lazy)' )
     * // err.object = Function
     * // err.propname = 'lazy'
     */
    function _supportErr( strErrMsg, objMain, strPropName ) {
        var objectInfo = Object.prototype.toString.call( objMain ).replace( /\[(.+)\]/, '$1' );
        var err = Error( strErrMsg )
            .replace( /%object/g, objectInfo )
            .replace( /%propname/g, strPropName )
        ;
        err.object = objMain;
        err.propname = strPropName;
        return err;
    }

    return new support;
} );

