'use strict';

//>> 預設模組 jzDefaultModules ------


global.orig = {
    path: require('path'),
    fs: require('fs'),
    vm: require('vm'),
};

global.my = {};

module.exports = global.jz = {};

//>> 異步模組定義實作 -----

// 創建模組
let jzModule = new resolveAMD(
    this,
    false,
    function loadNewFilePath( filePath ){
        return require( filePath );
    }
);

let jzModule = new resolveAMD(
    this,
    setTimeout,
    function loadNewFilePath( filePath, callback ){
        xhr.get( filePath ).suc(function( txt ){
            callback(function(){
                let helScript = document.createElement('script');
                helScript.appendChild( document.createTextNode( txt ) );
                let helTagPoint = document.scripts[0];
                helTagPoint.parentNode.insertBefore( helScript, helTagPoint.nextSibling );
            });
        });
    },
    function cacheModule(){
    }
);

// 以書單請求來源
jzModule.catalog([ 'Module_A', 'Module_B' ]);

// Module_A.js
    // 枚舉設定清單
    define([ 'jzTree', 'v0.2.0', 'BwayCer' ]);

// Module_B.js
    // 依賴 Module_C 模組
    define( [ 'Module_C' ], function( Module_C, require, module, exports ){
    } );

// Module_C.js
    define(function( require, module, exports ){
    });


    resolveAMD.prototype.catalog = function( filePathList ) {

    //>> 解析異步模組的定義 -----

    resolveAMD(
        this,
        true,
        function require( filePath ){},
        function findDependencie(){}
    );

let resolveAMD = initAMD( window );

function initAMD( objGlobal, fnDefaultAsync ){
    let logMsgTable = initAMD.logMsgTable;

    initAMD.logMsgTable.setMsg({
        // 'resolveAMD.createDefine_beCalledOnlyOneTimes': 'The define function is called only one times.',
    });

    if( !objGlobal ){
        throw Error( logMsgTable.getMsg( '_typeIsNotAllowed', 'arguments' ) );
    }

    /**
     *
     * @param {String} [filePath] - 模組識別碼。
     * @param {Array} [dependencies] - 依賴模組。
     * @param {*} factory - 模組物件。
     * 若 ` dependencies ` 有參考的依賴模組，則 ` factory ` 為 ` Function ` 型別；
     * 反之則任意型別。
     *
     * @example
     * // 函式
     * define(function(){
     *    return yourModule;
     * });
     *
     * // 函式（兼容 CommonJS）
     * define(function( require, exports, module ){
     *    module.exports = yourModule;
     * });
     */
    function _definePutInOther(){
        let isNotAllowed = true;
        let filePath = null;
        let dependencies = null;
        let factory;
        switch( arguments.length ){
            case 1:
                isNotAllowed = false;
                factory = arguments[0];
                break;
            case 2:
                let typeofArgu0 = resolveAMD._whatType( arguments[0] );
                if( typeofArgu0 ){
                    factory = arguments[1];
                    if( typeofArgu0 === String ){
                        isNotAllowed = false;
                        filePath = arguments[0];
                    }else if( typeofArgu0 === Array && typeof factory === 'functon' ){
                        isNotAllowed = false;
                        dependencies = arguments[0];
                    }
                }
                break;
            case 3:
                let Argu0IsString = typeof arguments[0] === 'string';
                let Argu1IsArray = resolveAMD._whatType( arguments[1] ) === Array;
                if( Argu0IsString && Argu1IsArray ){
                    isNotAllowed = false;
                    filePath = arguments[0];
                    dependencies = arguments[1];
                    factory = arguments[2];
                }
                break;
        }

        if( isNotAllowed ) throw TypeError('The arguments type of define function is not allowed.');

        return [ filePath, dependencies, factory ];
    }

    function _cacheModule(){
        /**
         * 貯存區： 存放已知模組的物件陣列。
         *
         * @var {object} _cache
         *
         * @example
         * { filePath: ModuleObject, ... }
         */
        this._cache = {};

        this.evtlistener = {};
    };

    /**
     * 設定： 設定貯存區物件。
     *
     * @param {String} filePath
     * @param {*} moduleObject - 若值為 ` undefined ` 會強制轉為 ` null `。
     * @return {*} - 返回設定於貯存區的物件。
     */
    _cacheModule.prototype.set = function( filePath, moduleObject ){
        this._cache[ filePath ] = moduleObject || null;
        return this._cache[ filePath ];
    };

    /**
     * 取得： 取得貯存區物件。
     * @return {*} - 若為 ` undefined ` 則表示找不著此模組物件。
     */
    _cacheModule.prototype.get = function( filePath ){
        let cache = this._cache;
        let ishasProp = cache.hasOwnProperty( filePath );
        return ishasProp ? cache[ filePath ] : undefined;
    };

    _cacheModule.prototype.del = function( filePath ){
    };

    _cacheModule.prototype.emit = function( filePath ){
    };

    function resolveAMD( mulAsync, fnLoadNewFilePath, fnCacheModule ){
        if( ( mulAsync !== false || typeof mulAsync !== 'function' )
            || typeof fnLoadNewFilePath !== 'function' ){
            throw Error( logMsgTable.getMsg( '_typeIsNotAllowed', 'arguments' ) );
        }

        this._isAsync = !!mulAsync;
        this._asyncQueue = mulAsync || null;

        this._loadNewFilePath = fnLoadNewFilePath;

        this._cacheModule = fnCacheModule ? new fnCacheModule : new resolveAMD.cacheModule;

        this.createDefine = function( filePath ){
            return Function(
                'filePath', 'deps', 'factory',
                'if( this._exeTimes++ === 0 ) '
                + 'this.instAMD._amdRequire( this._filePath, filePath, deps, factory );'
            ).bind({
                // 執行次數： 限執行一次。
                _exeTimes: 0,
                _filePath: filePath,
                instAMD: this,
            });
        };

        this.catalog = function( filePathList ){
            this._amdRequire( null, filePathList );
        };

        /**
         * @param {?String} defaultPath - 預設路徑。
         * @param {*} anyChoA - 依狀況而有所不同：
         * <br>
         * 若 ` defaultPath ` 為 ` null ` 則為 ` String or String[] `，表示請求目錄列表。
         * <br>
         * 反之則參閱 {@link initAMD~_definePutInOther}。
         */
        this._amdRequire = function( defaultPath ){
            let argus = initAMD.transArgus.call( [], arguments );
            definePath = argus.shift();

            let catalog = false;
            if( !definePath ){
                switch( resolveAMD._whatType( arguments[1] ) ){
                    case String: catalog = [ arguments[1] ]; break;
                    case Array: catalog = arguments[1]; break;
                    default: throw TypeError( logMsgTable.getMsg( '_typeIsNotAllowed', 'arguments' ) );
                }
            }else if( typeof definePath === 'string' ){
                throw TypeError( logMsgTable.getMsg( '_typeIsNotAllowed', 'arguments' ) );
            j

            let emitArgus = [ null, null, null ];

            if( !!catalog ){
                emitArgus[1] = catalog;
            }else{
                let emitArgus = this._definePutInOther.apply( null, argus );
                emitArgus[0] = emitArgus[0] || defaultPath;
            }

            let dependencies = emitArgus[1];
            for(let p = 0, len = dependencies.length; p < len ; p++){
                let depPath = dependencies[ p ];
                if( typeof depPath === 'string' )
                    throw TypeError( logMsgTable.getMsg( '_typeIsNotAllowed', 'filePath' ) );
            }

            let propName = '_amdRequire_' + ( this._isAsync ? 'async' : 'sync' );
            return this.[ propName ].apply( this, emitArgus );
        };

        /**
         * @param {?String} strFilePath - 若為 ` null ` 表示不貯存物件。
         * @param {?Array} arrDependencies
         * @param {?Array} fnFactory
         */
        this._amdRequire_sync = function( strFilePath, arrDependencies, fnFactory ){
            let emitArgus = [];
            if( arrDependencies ){
                for(let p = 0, len = arrDependencies.length; p < len ; p++){
                    let depPath = arrDependencies[ p ];
                    emitArgus.push( this._loadNewFilePath( depPath ) );
                }
            }

            let self = this;
            let commonJSRequire = Function(
                'filePath',
                'return this.instAMD._amdRequire( null, filePath );'
            ).bind({ instAMD: this });

            let commonJSModule = { exports: {} };

            emitArgus.push( commonJSRequire, commonJSModule, commonJSModule.exports );
            let moduleObject = fnFactory.apply( objGlobal, argus );
            if( commonJSModule.exports.length > 0 ) moduleObject = commonJSModule.exports;

            if( !!strFilePath ) this._cacheModule.set( strFilePath, moduleObject );
            return moduleObject;
        };

        resolveAMD.prototype.requiring = [];

        resolveAMD.prototype._waitRespondList = [];

        resolveAMD.prototype._requireQueue = {};

        resolveAMD.prototype._amdRequest = function( strFilePath, arrDependencies, fnFactory ){
        };
        /**
         * 創建異步環境。
         */
        this._createAsyncEnv = function( strFilePath, arrDependencies, fnFactory ){
            strFilePath = ;
            arrDependencies = ;
            fnFactory = ;
        };



        this._amdRequire_async = function( strFilePath, arrDependencies, fnFactory ){
            let emitArgus = [];
            if( arrDependencies ){
                for(let p = 0, len = arrDependencies.length; p < len ; p++){
                    let depPath = arrDependencies[ p ];
                    emitArgus.push( this._loadNewFilePath( depPath ) );
                }
            }

            if( dependencies ){
                    this._loadNewFilePath();
                    this._amdRequest( filePath);
                    this._asyncQueue(function(){
                    });
            }else{

            }
            this._waitRespondList.push( filePath );

            this._requireList.push( filePath );

            let isAsync = !!callback;
            let cacheModuleObject = this._cacheModule.get( filePath );

            if( cacheModuleObject !== undefined ){
                if( isAsync ) callback( cacheModuleObject );
                else return cacheModuleObject;
            }

            if( isAsync ){
                let objGlobal = this._global;
                let fnGlobalDefine = this._createDefine( filePath );
                let arrRequiring = this.requiring;
                let numIndexOfRequiring = arrRequiring.push( filePath );
                this.loadNewFilePath( filePath, function( fnInitModule ){
                    arrRequiring.splice( numIndexOfRequiring, 1 )
                    objGlobal.define = fnGlobalDefine;
                    fnInitModule();
                } );
            }else{
                return this._loadNewFilePath( filePath );
            }
        };
    }

    return resolveAMD;
}

initAMD.whatType = function( choA ){
    return !choA ? null : choA.constructor;
};

initAMD.transArgus = function( objArgus ){
    if( !!this && this.constructor === Array ) this.push.apply( this, objArgus );
    return this;
};

initAMD.logMsgTable = {
    /**
     * 訊息表。
     * 說明:
          key: 訊息代碼, val: 訊息內容
          關於 key 描述:
              預設值: "_"
              其他來源: "(來源)_(查找路徑)_(內容資訊)"
     */
    msgTable: {
        _undefined: 'The #[1] is unexpected Message',
        _typeIsNotAllowed: 'The #[1] type is not allowed.',
    },

    /**
     * 設定訊息表。
     * @param {Object} objMsgList - 訊息清單。
     * @param {...String} objMsgList.youSetMsgCode - 其訊息代碼皆為文字格式。
     * <br>
     * 範例： `'這名稱 #[1] 是個錯誤對象。'`
     */
    setMsg: function( objMsgList ){
        let msgTable = this.msgTable;
        for(let key in objMsgList ){
            let item = objMsgList[ key ];
            if( typeof item === 'string' ) msgTable[ key ] = item;
        }
    },

    /**
     * 取得訊息表內容。
     * @param {String} strMsgCode - 訊息代碼。
     * @param {...String} [insertArgu] - 被嵌入的資訊。
     * @return {String} : 其訊息代碼或 ` _undefined ` 代碼的內容。
     */
    getMsg: function( strMsgCode ){
        let msgTable = this.msgTable;
        let argu0IsStr = typeof strMsgCode === 'string';
        let isHasProp = argu0IsStr && msgTable.hasOwnProperty( strMsgCode );

        let strAns;
        let msgContent = isHasProp ? msgTable[ strMsgCode ] : null;
        if( !!msgContent ){
            let objArgus = initAMD.transArgus.call( [], arguments );
            let objArgusLen = objArgus.length;
            strAns = msgContent.replace( /#\[(\d+)\]/g, function( strCatch, numIndex ){
                numIndex = parseInt( numIndex );
                if( 0 < numIndex && numIndex < objArgusLen ) return objArgus[ numIndex ];
                else return '"undefined"'
            } );
        }else{
            strAns = msgTable['_undefined'].replace(
                '#[1]',
                ( argu0IsStr
                    ? '[String]:' + strMsgCode
                    : '[' + ( typeof strMsgCode ) + ']'
                )
            );
        }

        return strAns;
    },
};


    function resolveAMD( objGlobal, mulAsync, fnLoadNewFilePath, fnCacheModule ){
    }

    // 若 ` dependencies ` 有參考的依賴模組，則 ` factory ` 為 ` Function ` 型別。
    // 反之則任意型別，而當使用函式時兼容 ` CommonJS `。

    // loadNewPath
    // resolveDefine

    /**
     * 貯存區： 存放已知模組的物件陣列。
     *
     * @var {object} _cache
     *
     * @example
     * { filePath: ModuleObject, ... }
     */
    this._cache = {};

    /**
     * 擴展：
     *
     * @param {?Function} ctor - 建構式（constructor）。
     * @param {...Function} prop - 屬性（property）。
       resolveAMD.inherits = function( ctor ){
       };

       resolveAMD.extend = function( ctor ){
           if( typeof ctor == null ) ctor = new Function();
           else if( typeof ctor !== 'function' ) throw TypeError('The constructor is not allowed.');

           let props = this.orderConcat.apply( this, arguments );
           props.shift();

           let protoChain = {};
           for(let p = 0, len = props.length; p < len ; p++){
               protoChain
           }

           if (ctor === undefined || ctor === null)
               if (superCtor.prototype === undefined)
                  throw new TypeError('The super constructor to "inherits" must ' + 'have a prototype');
                  throw new TypeError('The constructor to "inherits" must not be ' + 'null or undefined');

                   Object.setPrototypeOf(.prototype, superCtor.prototype);
       };
     */

void function( self, jzAMD ){
    let jzModule = new jzAMD;
    this.define = jzModule.define;
}(
this,
jzAMD
);

//>> 載入模組 -----

void function(){
    function jzModule(){
        /* 運行
         * 見 jz.load, jz.load_fromNative
         */
        this.run = function( strFileName, strDirReferencePoint, bisNotVM ){
            if( bisNotVM ) return this.load_fromNative( strFileName, strDirReferencePoint );
            else return this.load( strFileName, strDirReferencePoint );
        };

        /* 原生載入
         * 見 jz.load
         * 與 jz.load 不同處唯有 exports 返回值皆為 require 運行的
         */
        this.load_fromNative = function( strFileName, strDirReferencePoint ){
            let objAns = this.searchPath( strFileName, strDirReferencePoint );
            objAns.exports = require( objAns.filename );
            return objAns;
        };

        /* 載入
         * @param {String} fileName : 程式檔路徑
         * @param {String} dirReferencePoint : 參考起始資料夾路徑
         * @return {Object} :
              @param {Boolean} isOrigClass : 是否為 orig 類型
              @param {String} filename : 程式檔完整路徑
              @param {any} exports : module.exports 的值
         */
        this.load = function( strFileName, strDirReferencePoint ){
            let objAns = this.searchPath( strFileName, strDirReferencePoint ),
                strFileExt = orig.path.extname( objAns.filename );

            objAns.exports = null;

            if( objAns.isOrigClass ){
                objAns.exports = require( objAns.filename );
            }else{
                switch( strFileExt ){
                    case '.js':
                        objAns.exports = this.vm_forJz(
                            objAns.filename,
                            orig.fs.readFileSync( objAns.filename, 'utf-8' )
                        );
                        break;
                    case '.json':
                        objAns.exports = this.readJSON( objAns.filename );
                        break;
                    case '.node':
                        break;
                }
            }

            return objAns;
        };

        /* 讀取 JSON
         * @param {String} fileName : 程式檔路徑
         * @return {JSON}
         */
        this.readJSON = function( strFileName ){
            return orig.fs.existsSync( strFileName ) ? JSON.parse( orig.fs.readFileSync( strFileName, 'utf8' ) ) : null;
        };

        /* 查找檔案完整路徑及判斷載入方法
         * @param {String} fileName : 程式檔路徑
         * @param {String} dirReferencePoint : 參考起始資料夾路徑
         * @return {Object} :
              @param {Boolean} isOrigClass : 是否為 orig 類型
              @param {String} filename : 程式檔完整路徑
         */
        this.searchPath = function( strFileName, strDirReferencePoint ){
            let funcGuessFileName = this.searchPath_guessFilePath.bind( this ),
                bisClassOfOrig = false,
                anyCompletePath;

            if( /^\.{0,2}\//.test( strFileName ) ){
                bisClassOfOrig = false;
                let fileNameTem = orig.path.isAbsolute( strFileName )? strFileName : orig.path.join( strDirReferencePoint, strFileName );
                anyCompletePath = funcGuessFileName( fileNameTem );

                if( !anyCompletePath ) jz.log.throwErr( 'jz_module_notFindModule', strFileName );
            }else{
                bisClassOfOrig = true;
                anyCompletePath = strFileName;
            }

            return {
                isOrigClass: bisClassOfOrig,
                filename: anyCompletePath,
            };
        };

        /* 猜測檔案路徑位置
         * @param {String} fileName : 程式檔路徑
         * @return {String|Boolean} :
              若此路徑存在為 String : 完整路徑
              否則為 null
         */
        this.searchPath_guessFilePath = function( strFileName ){
            let isExistsFile = orig.fs.existsSync( strFileName ),
                isDirectory = isExistsFile ? orig.fs.statSync( strFileName ).isDirectory() : null,
                funcGuessFileExt = this.searchPath_guessFileExt;

            if( isDirectory ){
                let packagePath = orig.path.join( strFileName, 'package.json' ),
                    bisHavePackageMain = false;

                if( orig.fs.existsSync( packagePath ) ){
                    let jsonPackage = this.readJSON( packagePath );
                    bisHavePackageMain = !!jsonPackage.main;
                }

                strFileName = orig.path.join( strFileName, bisHavePackageMain ? codePackage.main : 'index' );

                if( bisHavePackageMain ) return orig.fs.existsSync( strFileName ) ? strFileName : null;
            }

            return funcGuessFileExt( strFileName );
        };

        /* 猜測副檔名
         * @param {String} fileName : 程式檔路徑
         * @return {null|String} :
              若此路徑存在為 String : 完整路徑
              否則為 null
         */
        this.searchPath_guessFileExt = function( strFileName ){
            let guessFileName,
                possibleList = [ '', '.js', '.json', '.node' ];

            for(let p = 0, len = possibleList.length; p < len ; p++){
                guessFileName = strFileName + possibleList[ p ];
                if( orig.fs.existsSync( guessFileName ) ) return guessFileName;
            }

            return null;
        };

        /* 虛擬環境
         * @param {Object} info :
              @param {String} fileName : 程式檔路徑 或 可辨識檔案的字串
              @param {String} code : 程式碼
              @param {Object} sandbox : 沙盒環境變數
         * @return {any} : module.exports 的值
         */
        this.vm = function( objInfo ){
            if( !objInfo.code ) jz.log.throwErr('jz_vm_needCode');

            let fileName = objInfo.fileName;
            if( !fileName ){
                jz.log.err('jz_vm_needFileName');
                fileName = 'notFileName';
            }

            let objSandbox = this.vm_createSandbox( fileName, objInfo.sandbox );

            orig.vm.runInContext( objInfo.code, objSandbox, {
                filename: fileName,
                displayErrors: true,
                timeout: 1000,
            } );

            return objSandbox.module.exports;
        };

        /* 創建沙盒
         * @param {String} fileName : 程式檔路徑
         * @param {Object} seed : 創建沙盒的種子
              @param {any} 沙盒全域參數[ ...] : 參數物件
         * @return {Object} : orig.vm.createContext 沙盒化的 Object
         */
        this.vm_createSandbox = function( strFileName, objSeed ){
            let self = this,
                vmModule = { exports: {} },
                strDirname = orig.path.dirname( strFileName ),
                sandbox = Object.setPrototypeOf( {
                    module: vmModule,
                    exports: vmModule.exports,
                    require: function( strFilename ){
                        return self.run( strFilename, strDirname, true ).exports;
                    },
                    console: console,
                    __dirname: strDirname,
                    __filename: strFileName
                }, global );

            for(let key in objSeed ) sandbox[ key ] = objSeed[ key ];

            return orig.vm.createContext( sandbox );
        };

        /* jz 虛擬環境
         * @param {String} fileName : 程式檔路徑
         * @param {String} code : 程式碼
         * @return {any} : strCode 中 module.exports 的值
         */
        this.vm_forJz = function( strFileName, strCode ){
            let self = this,
                strDirName = orig.path.dirname( strFileName ),
                jzRequire = function( strFilename ){
                    return self.run( strFilename, strDirName );
                };

            return this.vm({
                fileName: strFileName,
                code: strCode,
                sandbox: {
                    jz: jz,
                    jzRequire: jzRequire,
                    orig: orig,
                    my: my,
                }
            });
        };
    }

    jz.module = new jzModule;
}();


//>> 初次種植 -----

void function(){
    jz.module.load( './rootearth/jzDefaultModules.js', __dirname );
    jz.log.setMsg( jz.module.load( './rootearth/jzLogMsg.json', __dirname ).exports );


    //>> 園丁 -----
    jz.module.run( './rootearth/jzGardener.js', __dirname );
    jz.gardener.plant( orig.path.join( __dirname, 'growingPoint.json' ) );
}();

let initAMD = function(){};

