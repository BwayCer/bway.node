

/**
 * @example
 * html( {} )
 *     .head
 *         .title()
 *         .meta( {} )
 *         .meta( {} )
 *     .body( {} )
 *         .noscript( '' )
 *         .comment( '' )
 *         .txt( '' )
 *         .singleTag( '[[uuu]]', {} )
 *         .tag( '', {}, '' )
 * ;
 *
 * txtHtml( title, txtHead, txtBody );
 *
 * html()
 *     .head
 *         .title()
 *         .meta( {} )
 *         .comment( '' )
 *         .txt( '' )
 *         .tag( '', {}, '' )
 *         .singleTag( '', {} )
 * .mth();
 */


// htmPureText

order( [
    '/pure/log',
    '/pure/htf'
], function ( log, htf ) {
    var _isFormat = false;

    // share
    var _share_increaseIndent = _isFormat
        ? function ( strSpace, strChild ) { return strChild.replace( /(.+)/gm, strSpace + '$1' ) + '\n'; }
        : function ( strSpace, strChild ) { return strChild; };

    // docClass
    var htf_tag, htf_tagStyle;

    void function () {
    }();


    // HTML Layout
    var htmLayout;

    void function () {
        var _increaseIndent = _share_increaseIndent;

        var _gapCharacter = _isFormat ? '\n' : '';
        var _gapPartA = _gapCharacter ? '    ' : '';
        var _gapPartB = _gapPartA + _gapPartA;

        var _wrapProcedure = 0;
        var _isHasTitle = false;
        var _isHasHeadChild = false;
        var _isHasBodyChild = false;
        var _txtHtml = '';

        htmLayout = function htmLayout( objAttr ) {
            _wrapProcedure = 1;
            _isHasTitle = false;
            _isHasHeadChild = false;
            _isHasBodyChild = false;

            _txtHtml = '<html' + _parseAttr( objAttr ) + '>';
            return htmLayout;
        };

        htmLayout.head = head;

        function mth() {
            if ( _wrapProcedure < 3 ) body();

            var fnAns = Function( 'param',
                'return `' + _txtHtml
                + _gapCharacter + _gapPartA + '</body>'
                + _gapCharacter + '</html>`;'
            );

            fnAns._isHasTitle = _isHasTitle;
            fnAns._isHasHeadChild = _isHasHeadChild;
            fnAns._isHasBodyChild = _isHasBodyChild;

            _wrapProcedure = 0;
            _isHasTitle = false;
            _isHasHeadChild = false;
            _isHasBodyChild = false;
            _txtHtml = '';

            return fnAns;
        }

        function head() {
            if ( _wrapProcedure > 1 ) throw Error( '重複調用頭元素標記。' );
            if ( _wrapProcedure < 1 ) htmLayout();

            _wrapProcedure = 2;
            _txtHtml += _gapCharacter + _gapPartB + '<head>';
            return head;
        }

        head.mth = mth;
        head.body = body;
        head.child = childHead;
        head.title = title;
        head.tag = tag;
        head.singleTag = singleTag;
        head.meta = meta;
        head.txt = txt;
        head.comment = comment;

        function body( objAttr ) {
            if ( _wrapProcedure > 2 ) throw Error( '重複調用身元素標記。' );
            if ( _wrapProcedure < 2 ) head();

            _wrapProcedure = 3;
            _txtHtml += _gapCharacter + _gapPartA + '</head>'
                + _gapCharacter + _gapPartA + '<body' + _parseAttr( objAttr ) + '>';

            return body;
        }

        body.mth = mth;
        body.child = childBody;
        body.tag = tag;
        body.singleTag = singleTag;
        body.txt = txt;
        body.comment = comment;

        function childHead() {
            if ( _isHasHeadChild ) throw Error( '重複調用子元素標記。' );

            _parseWrapProcedure( this );

            _isHasHeadChild = true;
            _txtHtml += _gapCharacter + '${ param.HTMLAYOUT_HeadChild || "" }';
            return this;
        }

        function childBody() {
            if ( _isHasBodyChild ) throw Error( '重複調用子元素標記。' );

            _parseWrapProcedure( this );

            _isHasBodyChild = true;
            _txtHtml += _gapCharacter + '${ param.HTMLAYOUT_BodyChild || "" }';
            return this;
        }

        function title() {
            if ( _isHasTitle ) throw Error( '重複調用標題元素標記。' );

            _parseWrapProcedure( this );

            _isHasTitle = true;
            _txtHtml += _gapCharacter + _gapPartB
                + '<title>${ param.HTMLAYOUT_Title || "" }</title>';

            return head;
        }

        function tag( strTagName, objAttr, strChild ) {
            _parseWrapProcedure( this );

            var txt = _gapCharacter;

            txt += _gapPartB + '<' + strTagName + _parseAttr( objAttr ) + '>';

            if ( strChild ) {
                strChild = _matchKeyWord( _increaseIndent( '            ', strChild ) );
                txt += _gapCharacter + strChild;
            }

            txt += _gapPartB + '</' + strTagName + '>';
            _txtHtml += txt;

            return this;
        }

        function singleTag( strTagName, objAttr ) {
            _parseWrapProcedure( this );

            _txtHtml += _gapCharacter + _gapPartB
                + '<' + strTagName + _parseAttr( objAttr ) + ' />';

            return this;
        }

        function meta( objAttr ) {
            return this.singleTag( 'meta', objAttr );
        }

        function txt( strVal ) {
            _parseWrapProcedure( this );

            if ( !strVal ) return this;

            _txtHtml += _gapCharacter + _gapCharacter
                + _matchKeyWord( _increaseIndent( '        ', strVal ) );

            return this;
        }

        function comment( strVal ) {
            _parseWrapProcedure( this );

            if ( !strVal ) return this;

            _txtHtml += _gapCharacter + _gapPartB + '<!--';
                + _gapCharacter
                + _matchKeyWord( _increaseIndent( '            ', strVal ) )
                + _gapPartB + ' -->';

            return this;
        }

        function _parseWrapProcedure( fnSelf ) {
            switch ( fnSelf ) {
                case head:
                    if ( _wrapProcedure < 2 ) fnSelf();
                    break;
                case body:
                    if ( _wrapProcedure < 3 ) fnSelf();
                    break;
            }
        }

        function _parseAttr( objAttr ) {
            if ( !objAttr ) return '';

            var key;
            var txtAttr = '';

            for ( key in objAttr )
                txtAttr += ' ' + key + '="' + _matchKeyWord( objAttr[ key ] ) + '"';

            return txtAttr;
        }

        var _regexKeyWord = /\{\{([$_0-9A-Za-z]+)\}\}/g;

        function _matchKeyWord( strVal ) {
            return _regexKeyWord.test( strVal )
                ? strVal.replace( _regexKeyWord, '${ param.$1 || "" }' )
                : strVal;
        }
    }();

    // htmLayout.tag = htf.tag;
    // htmLayout.tagStyle = htf.tagStyle;

    // htmLayout.html = htf.tagStyle;
} );

