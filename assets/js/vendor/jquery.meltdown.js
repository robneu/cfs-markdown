/**
* Detect Element Resize Plugin for jQuery
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

(function ( $ ) {
	var attachEvent = document.attachEvent,
		stylesCreated = false;

	var jQuery_resize = $.fn.resize;

	$.fn.resize = function(callback) {
		return this.each(function() {
			if(this == window)
				jQuery_resize.call(jQuery(this), callback);
			else
				addResizeListener(this, callback);
		});
	};

	$.fn.removeResize = function(callback) {
		return this.each(function() {
			removeResizeListener(this, callback);
		});
	};

	if (!attachEvent) {
		var requestFrame = (function(){
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
								function(fn){ return window.setTimeout(fn, 20); };
			return function(fn){ return raf(fn); };
		})();

		var cancelFrame = (function(){
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
								   window.clearTimeout;
		  return function(id){ return cancel(id); };
		})();

		function resetTriggers(element){
			var triggers = element.__resizeTriggers__,
				expand = triggers.firstElementChild,
				contract = triggers.lastElementChild,
				expandChild = expand.firstElementChild;
			contract.scrollLeft = contract.scrollWidth;
			contract.scrollTop = contract.scrollHeight;
			expandChild.style.width = expand.offsetWidth + 1 + 'px';
			expandChild.style.height = expand.offsetHeight + 1 + 'px';
			expand.scrollLeft = expand.scrollWidth;
			expand.scrollTop = expand.scrollHeight;
		}

		function checkTriggers(element){
			return element.offsetWidth != element.__resizeLast__.width ||
						 element.offsetHeight != element.__resizeLast__.height;
		}

		function scrollListener(e){
			var element = this;
			resetTriggers(this);
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
			this.__resizeRAF__ = requestFrame(function(){
				if (checkTriggers(element)) {
					element.__resizeLast__.width = element.offsetWidth;
					element.__resizeLast__.height = element.offsetHeight;
					element.__resizeListeners__.forEach(function(fn){
						fn.call(element, e);
					});
				}
			});
		}

		/* Detect CSS Animations support to detect element display/re-attach */
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			animationstartevent = 'animationstart',
			domPrefixes = 'Webkit Moz O ms'.split(' '),
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
			pfx  = '';
		{
			var elm = document.createElement('fakeelement');
			if( elm.style.animationName !== undefined ) { animation = true; }

			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						pfx = domPrefixes[ i ];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animationstartevent = startEvents[ i ];
						animation = true;
						break;
					}
				}
			}
		}

		var animationName = 'resizeanim';
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}

	function createStyles() {
		if (!stylesCreated) {
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
			var css = (animationKeyframes ? animationKeyframes : '') +
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');

			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
			stylesCreated = true;
		}
	}

	window.addResizeListener = function(element, fn){
		if (attachEvent) element.attachEvent('onresize', fn);
		else {
			if (!element.__resizeTriggers__) {
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																						'<div class="contract-trigger"></div>';
				element.appendChild(element.__resizeTriggers__);
				resetTriggers(element);
				element.addEventListener('scroll', scrollListener, true);

				/* Listen for a css animation to detect element display/re-attach */
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
					if(e.animationName == animationName)
						resetTriggers(element);
				});
			}
			element.__resizeListeners__.push(fn);
		}
	};

	window.removeResizeListener = function(element, fn){
		if (attachEvent) element.detachEvent('onresize', fn);
		else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
					element.removeEventListener('scroll', scrollListener);
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
			}
		}
	};
}( jQuery ));

/*!
 * Copyright (c) 2006 js-markdown-extra developers
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. The name of the author may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var MARKDOWN_VERSION = "1.0.1o";
var MARKDOWNEXTRA_VERSION = "1.2.5";

// Global default settings:

/** Change to ">" for HTML output */
var MARKDOWN_EMPTY_ELEMENT_SUFFIX = " />";

/** Define the width of a tab for code blocks. */
var MARKDOWN_TAB_WIDTH = 4;

/** Optional title attribute for footnote links and backlinks. */
var MARKDOWN_FN_LINK_TITLE     = "";
var MARKDOWN_FN_BACKLINK_TITLE = "";

/** Optional class attribute for footnote links and backlinks. */
var MARKDOWN_FN_LINK_CLASS     = "";
var MARKDOWN_FN_BACKLINK_CLASS = "";

/** Change to false to remove Markdown from posts and/or comments. */
var MARKDOWN_WP_POSTS    = true;
var MARKDOWN_WP_COMMENTS = true;

/** Standard Function Interface */
MARKDOWN_PARSER_CLASS = 'MarkdownExtra_Parser';

/**
 * Converts Markdown formatted text to HTML.
 * @param text Markdown text
 * @return HTML
 */
function Markdown(text) {
    //Initialize the parser and return the result of its transform method.
    var parser;
    if('undefined' == typeof arguments.callee.parser) {
        parser = eval("new " + MARKDOWN_PARSER_CLASS + "()");
        parser.init();
        arguments.callee.parser = parser;
    }
    else {
        parser = arguments.callee.parser;
    }
    // Transform text using parser.
    return parser.transform(text);
}

/**
 * Constructor function. Initialize appropriate member variables.
 */
function Markdown_Parser() {

    this.nested_brackets_depth = 6;
    this.nested_url_parenthesis_depth = 4;
    this.escape_chars = "\\\\`*_{}[]()>#+-.!";

    // Document transformations
    this.document_gamut = [
        // Strip link definitions, store in hashes.
        ['stripLinkDefinitions', 20],
        ['runBasicBlockGamut',   30]
    ];

    // These are all the transformations that form block-level
    /// tags like paragraphs, headers, and list items.
    this.block_gamut = [
        ['doHeaders',         10],
        ['doHorizontalRules', 20],
        ['doLists',           40],
        ['doCodeBlocks',      50],
        ['doBlockQuotes',     60]
    ];

    // These are all the transformations that occur *within* block-level
    // tags like paragraphs, headers, and list items.
    this.span_gamut = [
        // Process character escapes, code spans, and inline HTML
        // in one shot.
        ['parseSpan',          -30],
        // Process anchor and image tags. Images must come first,
        // because ![foo][f] looks like an anchor.
        ['doImages',            10],
        ['doAnchors',           20],
        // Make links out of things like `<http://example.com/>`
        // Must come after doAnchors, because you can use < and >
        // delimiters in inline links like [this](<url>).
        ['doAutoLinks',         30],
        ['encodeAmpsAndAngles', 40],
        ['doItalicsAndBold',    50],
        ['doHardBreaks',        60]
    ];

    this.em_relist = [
        ['' , '(?:(^|[^\\*])(\\*)(?=[^\\*])|(^|[^_])(_)(?=[^_]))(?=\\S|$)(?![\\.,:;]\\s)'],
        ['*', '((?:\\S|^)[^\\*])(\\*)(?!\\*)'],
        ['_', '((?:\\S|^)[^_])(_)(?!_)']
    ];
    this.strong_relist = [
        ['' , '(?:(^|[^\\*])(\\*\\*)(?=[^\\*])|(^|[^_])(__)(?=[^_]))(?=\\S|$)(?![\\.,:;]\\s)'],
        ['**', '((?:\\S|^)[^\\*])(\\*\\*)(?!\\*)'],
        ['__', '((?:\\S|^)[^_])(__)(?!_)']
    ];
    this.em_strong_relist = [
        ['' , '(?:(^|[^\\*])(\\*\\*\\*)(?=[^\\*])|(^|[^_])(___)(?=[^_]))(?=\\S|$)(?![\\.,:;]\\s)'],
        ['***', '((?:\\S|^)[^\\*])(\\*\\*\\*)(?!\\*)'],
        ['___', '((?:\\S|^)[^_])(___)(?!_)']
    ];
}

Markdown_Parser.prototype.init = function() {
    // this._initDetab(); // NOTE: JavaScript string length is already based on Unicode
    this.prepareItalicsAndBold();

    // Regex to match balanced [brackets].
    // Needed to insert a maximum bracked depth while converting to PHP.
    // NOTE: JavaScript doesn't have so faster option for RegExp
    //this.nested_brackets_re = new RegExp(
    //    str_repeat('(?>[^\\[\\]]+|\\[', this.nested_brackets_depth) +
    //    str_repeat('\\])*', this.nested_brackets_depth)
    //);
    // NOTE: JavaScript doesn't have so faster option for RegExp
    //this.nested_url_parenthesis_re = new RegExp(
    //    str_repeat('(?>[^()\\s]+|\\(', this.nested_url_parenthesis_depth) +
    //    str_repeat('(?>\\)))*', this.nested_url_parenthesis_depth)
    //);

    this.nested_brackets_re = '(?:\\[[^\\]]*\]|[^\\[\\]]*)';
    this.nested_url_parenthesis_re = '(?:\\([^\\)\\s]*\\)|[^\\(\\)]*)';

    // Table of hash values for escaped characters:
    var tmp = [];
    for(var i = 0; i < this.escape_chars.length; i++) {
        tmp.push(this._php_preg_quote(this.escape_chars.charAt(i)));
    }
    this.escape_chars_re = '[' + tmp.join('') + ']';

    // Change to ">" for HTML output.
    this.empty_element_suffix = MARKDOWN_EMPTY_ELEMENT_SUFFIX;
    this.tab_width = MARKDOWN_TAB_WIDTH;

    // Change to `true` to disallow markup or entities.
    this.no_markup = false;
    this.no_entities = false;

    // Predefined urls and titles for reference links and images.
    this.predef_urls = {};
    this.predef_titles = {};

    // Sort document, block, and span gamut in ascendent priority order.
    function cmp_gamut(a, b) {
        a = a[1]; b = b[1];
        return a > b ? 1 : a < b ? -1 : 0;
    }
    this.document_gamut.sort(cmp_gamut);
    this.block_gamut.sort(cmp_gamut);
    this.span_gamut.sort(cmp_gamut);

    // Internal hashes used during transformation.
    this.urls = {};
    this.titles = {};
    this.html_hashes = {};

    // Status flag to avoid invalid nesting.
    this.in_anchor = false;
};

/**
 * [porting note]
 * JavaScript's RegExp doesn't have escape code \A and \Z.
 * So multiline pattern can't match start/end of text. Instead
 * wrap whole of text with STX(02) and ETX(03).
 */
Markdown_Parser.prototype.__wrapSTXETX__ = function(text) {
    if(text.charAt(0) != '\x02') { text = '\x02' + text; }
    if(text.charAt(text.length - 1) != '\x03') { text = text + '\x03'; }
    return text;
};

/**
 * [porting note]
 * Strip STX(02) and ETX(03).
 */
Markdown_Parser.prototype.__unwrapSTXETX__ = function(text) {
    if(text.charAt(0) == '\x02') { text = text.substr(1); }
    if(text.charAt(text.length - 1) == '\x03') { text = text.substr(0, text.length - 1); }
    return text;
};

/**
 *
 */
Markdown_Parser.prototype._php_preg_quote = function(text) {
  if(!arguments.callee.sRE) {
    arguments.callee.sRE = /(\/|\.|\*|\+|\?|\||\(|\)|\[|\]|\{|\}\\)/g;
  }
  return text.replace(arguments.callee.sRE, '\\$1');
};

Markdown_Parser.prototype._php_str_repeat = function(str, n) {
    var tmp = str;
    for(var i = 1; i < n; i++) {
        tmp += str;
    }
    return tmp;
};

Markdown_Parser.prototype._php_trim = function(target, charlist) {
    var chars = charlist || " \t\n\r";
    return target.replace(
        new RegExp("^[" + chars + "]*|[" + chars + "]*$", "g"), ""
    );
};

Markdown_Parser.prototype._php_rtrim = function(target, charlist) {
    var chars = charlist || " \t\n\r";
    return target.replace(
        new RegExp( "[" + chars + "]*$", "g" ), ""
    );
};

Markdown_Parser.prototype._php_htmlspecialchars_ENT_NOQUOTES = function(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};


/**
 * Called before the transformation process starts to setup parser
 * states.
 */
Markdown_Parser.prototype.setup = function() {
    // Clear global hashes.
    this.urls = this.predef_urls;
    this.titles = this.predef_titles;
    this.html_hashes = {};

    this.in_anchor = false;
};

/**
 * Called after the transformation process to clear any variable
 * which may be taking up memory unnecessarly.
 */
Markdown_Parser.prototype.teardown = function() {
    this.urls = {};
    this.titles = {};
    this.html_hashes = {};
};

/**
 * Main function. Performs some preprocessing on the input text
 * and pass it through the document gamut.
 */
Markdown_Parser.prototype.transform = function(text) {
    this.setup();

    // Remove UTF-8 BOM and marker character in input, if present.
    text = text.replace(/^\xEF\xBB\xBF|\x1A/, "");

    // Standardize line endings:
    //   DOS to Unix and Mac to Unix
    text = text.replace(/\r\n?/g, "\n", text);

    // Make sure $text ends with a couple of newlines:
    text += "\n\n";

    // Convert all tabs to spaces.
    text = this.detab(text);

    // Turn block-level HTML blocks into hash entries
    text = this.hashHTMLBlocks(text);

    // Strip any lines consisting only of spaces and tabs.
    // This makes subsequent regexen easier to write, because we can
    // match consecutive blank lines with /\n+/ instead of something
    // contorted like /[ ]*\n+/ .
    text = text.replace(/^[ ]+$/m, "");

    // Run document gamut methods.
    for(var i = 0; i < this.document_gamut.length; i++) {
        var method = this[this.document_gamut[i][0]];
        if(method) {
            text = method.call(this, text);
        }
        else {
            console.log(this.document_gamut[i][0] + ' not implemented');
        }
    }

    this.teardown();

    return text + "\n";
};

Markdown_Parser.prototype.hashHTMLBlocks = function(text) {
    if(this.no_markup) { return text; }

    var less_than_tab = this.tab_width - 1;

    // Hashify HTML blocks:
    // We only want to do this for block-level HTML tags, such as headers,
    // lists, and tables. That's because we still want to wrap <p>s around
    // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
    // phrase emphasis, and spans. The list of tags we're looking for is
    // hard-coded:
    //
    // *  List "a" is made of tags which can be both inline or block-level.
    //    These will be treated block-level when the start tag is alone on
    //    its line, otherwise they're not matched here and will be taken as
    //    inline later.
    // *  List "b" is made of tags which are always block-level;

    var block_tags_a_re = 'ins|del';
    var block_tags_b_re = 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|address|' +
                          'script|noscript|form|fieldset|iframe|math';

    // Regular expression for the content of a block tag.
    var nested_tags_level = 4;
    var attr =
        '(?:'                + // optional tag attributes
            '\\s'            + // starts with whitespace
            '(?:'            +
                '[^>"/]+'    + // text outside quotes
            '|'              +
                '/+(?!>)'    + // slash not followed by ">"
            '|'              +
                '"[^"]*"'    + // text inside double quotes (tolerate ">")
            '|'              +
                '\'[^\']*\'' + // text inside single quotes (tolerate ">")
            ')*'             +
        ')?';
    var content =
        this._php_str_repeat(
            '(?:'                  +
                '[^<]+'            + // content without tag
            '|'                    +
                '<\\2'             + // nested opening tag
                attr               + // attributes
                '(?:'              +
                    '/>'           +
                '|'                +
                    '>',
            nested_tags_level
        )                          + // end of opening tag
        '.*?'                      + // last level nested tag content
        this._php_str_repeat(
                   '</\\2\\s*>'    + // closing nested tag
                ')'                +
                '|'                +
                    '<(?!/\\2\\s*>)' + // other tags with a different name
            ')*',
            nested_tags_level
        );

    var content2 = content.replace('\\2', '\\3');

    // First, look for nested blocks, e.g.:
    //   <div>
    //     <div>
    //       tags for inner block must be indented.
    //     </div>
    //   </div>
    //
    // The outermost tags must start at the left margin for this to match, and
    // the inner nested divs must be indented.
    // We need to do this before the next, more liberal match, because the next
    // match will start at the first `<div>` and stop at the first `</div>`.
    var all = new RegExp('(?:' +
        '(?:'                  +
            '(?:\\n\\n)'       + // Starting after a blank line
            '|'                + // or
            '(?:\\x02)\\n?'    + // the beginning of the doc
        ')'                    +
        '('                    + // save in $1

        // Match from `\n<tag>` to `</tag>\n`, handling nested tags
        // in between.
            '[ ]{0,' + less_than_tab + '}' +
            '<(' + block_tags_b_re + ')'   + // start tag = $2
            attr + '>'                     + // attributes followed by > and \n
            content                        + // content, support nesting
            '</\\2>'                       + // the matching end tag
            '[ ]*'                         + // trailing spaces/tabs
            '(?=\\n+|\\n*\\x03)'           + // followed by a newline or end of document

        '|' + // Special version for tags of group a.

            '[ ]{0,' + less_than_tab + '}' +
            '<(' + block_tags_a_re + ')'   + // start tag = $3
            attr + '>[ ]*\\n'              + // attributes followed by >
            content2                       + // content, support nesting
            '</\\3>'                       + // the matching end tag
            '[ ]*'                         + // trailing spaces/tabs
            '(?=\\n+|\\n*\\x03)'           + // followed by a newline or end of document

        '|' + // Special case just for <hr />. It was easier to make a special
              // case than to make the other regex more complicated.

            '[ ]{0,' + less_than_tab + '}' +
            '<(hr)'                        +  // start tag = $2
            attr                           + // attributes
            '/?>'                          + // the matching end tag
            '[ ]*'                         +
            '(?=\\n{2,}|\\n*\\x03)'        + // followed by a blank line or end of document

        '|' + // Special case for standalone HTML comments:

            '[ ]{0,' + less_than_tab + '}' +
            '(?:'                          + //'(?s:' +
                '<!--.*?-->'               +
            ')'                            +
            '[ ]*'                         +
            '(?=\\n{2,}|\\n*\\x03)'        + // followed by a blank line or end of document

        '|' + // PHP and ASP-style processor instructions (<? and <%)

            '[ ]{0,' + less_than_tab + '}' +
            '(?:'                          + //'(?s:' +
                '<([?%])'                  + // $2
                '.*?'                      +
                '\\2>'                     +
            ')'                            +
            '[ ]*'                         +
            '(?=\\n{2,}|\\n*\\x03)'        + // followed by a blank line or end of document

        ')' +
    ')', 'mig');
    // FIXME: JS doesnt have enough escape sequence \A nor \Z.

    var self = this;
    text = this.__wrapSTXETX__(text);
    text = text.replace(all, function(match, text) {
        //console.log(match);
        var key  = self.hashBlock(text);
        return "\n\n" + key + "\n\n";
    });
    text = this.__unwrapSTXETX__(text);
    return text;
};

/**
 * Called whenever a tag must be hashed when a function insert an atomic
 * element in the text stream. Passing $text to through this function gives
 * a unique text-token which will be reverted back when calling unhash.
 *
 * The boundary argument specify what character should be used to surround
 * the token. By convension, "B" is used for block elements that needs not
 * to be wrapped into paragraph tags at the end, ":" is used for elements
 * that are word separators and "X" is used in the general case.
 */
Markdown_Parser.prototype.hashPart = function(text, boundary) {
    if('undefined' === typeof boundary) {
        boundary = 'X';
    }
    // Swap back any tag hash found in text so we do not have to `unhash`
    // multiple times at the end.
    text = this.unhash(text);

    // Then hash the block.
    if('undefined' === typeof arguments.callee.i) {
        arguments.callee.i = 0;
    }
    var key = boundary + "\x1A" + (++arguments.callee.i) + boundary;
    this.html_hashes[key] = text;
    return key; // String that will replace the tag.
};

/**
 * Shortcut function for hashPart with block-level boundaries.
 */
Markdown_Parser.prototype.hashBlock = function(text) {
    return this.hashPart(text, 'B');
};

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 */
Markdown_Parser.prototype.stripLinkDefinitions = function(text) {
    var less_than_tab = this.tab_width - 1;
    var self = this;
    // Link defs are in the form: ^[id]: url "optional title"
    text = this.__wrapSTXETX__(text);
    text = text.replace(new RegExp(
        '^[ ]{0,' + less_than_tab + '}\\[(.+)\\][ ]?:' + // id = $1
            '[ ]*'        +
                '\\n?'    + // maybe *one* newline
                '[ ]*'    +
            '(?:'         +
                '<(.+?)>' + // url = $2
            '|'           +
                '(\\S+?)' + // url = $3
            ')'           +
            '[ ]*'        +
            '\\n?'        + // maybe one newline
            '[ ]*'        +
            '(?:'         +
                //'(?=\\s)' + // lookbehind for whitespace
                '["\\(]'  +
                '(.*?)'   + // title = $4
                '["\\)]'  +
                '[ ]*'    +
            ')?'          + // title is optional
            '(?:\\n+|\\n*(?=\\x03))',
        'mg'), function(match, id, url2, url3, title) {
            //console.log(match);
            var link_id = id.toLowerCase();
            var url = url2 ? url2 : url3;
            self.urls[link_id] = url;
            self.titles[link_id] = title;
            return ''; // String that will replace the block
        }
    );
    text = this.__unwrapSTXETX__(text);
    return text;
};

/**
 * Run block gamut tranformations.
 */
Markdown_Parser.prototype.runBlockGamut = function(text) {
    // We need to escape raw HTML in Markdown source before doing anything
    // else. This need to be done for each block, and not only at the
    // begining in the Markdown function since hashed blocks can be part of
    // list items and could have been indented. Indented blocks would have
    // been seen as a code block in a previous pass of hashHTMLBlocks.
    text = this.hashHTMLBlocks(text);
    return this.runBasicBlockGamut(text);
};

/**
 * Run block gamut tranformations, without hashing HTML blocks. This is
 * useful when HTML blocks are known to be already hashed, like in the first
 * whole-document pass.
 */
Markdown_Parser.prototype.runBasicBlockGamut = function(text) {
    for(var i = 0; i < this.block_gamut.length; i++) {
        var method = this[this.block_gamut[i][0]];
        if(method) {
            text = method.call(this, text);
        }
        else {
            console.log(this.block_gamut[i][0] + ' not implemented');
        }
    }
    // Finally form paragraph and restore hashed blocks.
    text = this.formParagraphs(text);
    return text;
};

/**
 * Do Horizontal Rules:
 */
Markdown_Parser.prototype.doHorizontalRules = function(text) {
    var self = this;
    return text.replace(new RegExp(
        '^[ ]{0,3}'    + // Leading space
        '([-\\*_])'    + // $1: First marker
        '(?:'          + // Repeated marker group
            '[ ]{0,2}' + // Zero, one, or two spaces.
            '\\1'      + // Marker character
        '){2,}'        + // Group repeated at least twice
        '[ ]*'         + //Tailing spaces
        '$'            , // End of line.
    'mg'), function(match) {
        //console.log(match);
        return "\n" + self.hashBlock("<hr" + self.empty_element_suffix) + "\n";
    });
};

/**
 * Run span gamut tranformations.
 */
Markdown_Parser.prototype.runSpanGamut = function(text) {
    for(var i = 0; i < this.span_gamut.length; i++) {
        var method = this[this.span_gamut[i][0]];
        if(method) {
            text = method.call(this, text);
        }
        else {
            console.log(this.span_gamut[i][0] + ' not implemented');
        }
    }
    return text;
};

/**
 * Do hard breaks:
 */
Markdown_Parser.prototype.doHardBreaks = function(text) {
    var self = this;
    return text.replace(/ {2,}\n/mg, function(match) {
        //console.log(match);
        return self.hashPart("<br" + self.empty_element_suffix + "\n");
    });
};


/**
 * Turn Markdown link shortcuts into XHTML <a> tags.
 */
Markdown_Parser.prototype.doAnchors = function(text) {
    if (this.in_anchor) return text;
    this.in_anchor = true;

    var self = this;

    var _doAnchors_reference_callback = function(match, whole_match, link_text, link_id) {
        //console.log(match);
        if(typeof(link_id) !== 'string' || link_id === '') {
            // for shortcut links like [this][] or [this].
            link_id = link_text;
        }

        // lower-case and turn embedded newlines into spaces
        link_id = link_id.toLowerCase();
        link_id = link_id.replace(/[ ]?\n/, ' ');

        var result;
        if ('undefined' !== typeof self.urls[link_id]) {
            var url = self.urls[link_id];
            url = self.encodeAttribute(url);

            result = "<a href=\"" + url + "\"";
            if ('undefined' !== typeof self.titles[link_id]) {
                var title = self.titles[link_id];
                title = self.encodeAttribute(title);
                result +=  " title=\"" + title + "\"";
            }

            link_text = self.runSpanGamut(link_text);
            result += ">" + link_text + "</a>";
            result = self.hashPart(result);
        }
        else {
            result = whole_match;
        }
        return result;
    };

    //
    // First, handle reference-style links: [link text] [id]
    //
	// [porting note] the cheatText and conditional
	// are simply checks that look and see whether the regex will
	// be able to find a match. If we don't do this here we can get caught in
	// a situation where backtracking grows exponentially.
	// This helps us keep the same regex as the upstream PHP impl, but still be safe/fast
    var cheatText = text.replace(/[^\[^\]^\n^\s]/gm, '');
    if ((cheatText.indexOf("[][]") !== -1) || (cheatText.indexOf("[] []") !== -1) || (cheatText.indexOf("[]\n[]") !== -1)) {
		text = text.replace(new RegExp(
		    '('               + // wrap whole match in $1
		      '\\['           +
		        '(' + this.nested_brackets_re + ')' +  // link text = $2
		      '\\]'           +

		      '[ ]?'          + // one optional space
		      '(?:\\n[ ]*)?'  + // one optional newline followed by spaces

		      '\\['           +
		        '(.*?)'       + // id = $3
		      '\\]'           +
		    ')',
		    'mg'
		), _doAnchors_reference_callback);
	}

    //
    // Next, inline-style links: [link text](url "optional title")
    //
	// [porting note] the cheatText and conditional
	// are simply checks that look and see whether the regex will
	// be able to find a match. If we don't do this here we can get caught in
	// a situation where backtracking grows exponentially.
	// This helps us keep the same regex as the upstream PHP impl, but still be safe/fast
    cheatText = text.replace(/[^\(^\)^\[^\]^\s]/gm, '').replace(/\(.*?\)/,'()');
	if ((cheatText.indexOf("]()") !== -1) || (cheatText.indexOf("](\"\")") !== -1)) {
		text = text.replace(new RegExp(
		    '('               + // wrap whole match in $1
		      '\\['           +
		        '(' + this.nested_brackets_re + ')' + // link text = $2
		      '\\]'           +
		      '\\('           + // literal paren
		        '[ \\n]*'     +
		        '(?:'         +
		            '<(.+?)>' + // href = $3
		        '|'           +
		            '(' + this.nested_url_parenthesis_re + ')' + // href = $4
		        ')'           +
		        '[ \\n]*'     +
		        '('           + // $5
		          '([\'"])'   + // quote char = $6
		          '(.*?)'     + // Title = $7
		          '\\6'       + // matching quote
		          '[ \\n]*'   + // ignore any spaces/tabs between closing quote and )
		        ')?'          + // title is optional
		      '\\)'           +
		    ')',
		    'mg'
		), function(match, whole_match, link_text, url3, url4, x0, x1, title) {
		    //console.log(match);
		    link_text = self.runSpanGamut(link_text);
		    var url = url3 ? url3 : url4;

		    url = self.encodeAttribute(url);

		    var result = "<a href=\"" + url + "\"";
		    if ('undefined' !== typeof title && title !== '') {
		        title = self.encodeAttribute(title);
		        result +=  " title=\"" + title + "\"";
		    }

		    link_text = self.runSpanGamut(link_text);
		    result += ">" + link_text + "</a>";

		    return self.hashPart(result);
		});
	}


    //
    // Last, handle reference-style shortcuts: [link text]
    // These must come last in case you've also got [link text][1]
    // or [link text](/foo)
    //
    text = text.replace(new RegExp(
        '('                  + // wrap whole match in $1
          '\\['              +
              '([^\\[\\]]+)' + // link text = $2; can\'t contain [ or ]
          '\\]'              +
        ')',
        'mg'
    ), _doAnchors_reference_callback);

    this.in_anchor = false;
    return text;
};

/**
 * Turn Markdown image shortcuts into <img> tags.
 */
Markdown_Parser.prototype.doImages = function(text) {
    var self = this;

    //
    // First, handle reference-style labeled images: ![alt text][id]
    //
	cheatText = text.replace(/[^!^\[^\]^\n^\s]/gm, '').replace(/\[\s*\]/g, '[]');
	if ((cheatText.indexOf('![][]') !== -1) || (cheatText.indexOf('![] []') !== -1) || (cheatText.indexOf('![]\n[]') !== -1)) {
		text = text.replace(new RegExp(
		    '('              + // wrap whole match in $1
		      '!\\['         +
		        '(' + this.nested_brackets_re + ')' + // alt text = $2
		      '\\]'          +

		      '[ ]?'         + // one optional space
		      '(?:\\n[ ]*)?' + // one optional newline followed by spaces

		      '\\['          +
		        '(.*?)'      + // id = $3
		      '\\]'          +

		    ')',
		    'mg'
		), function(match, whole_match, alt_text, link_id) {
		    //console.log(match);
		    link_id = link_id.toLowerCase();

		    if (typeof(link_id) !== 'string' || link_id === '') {
		        link_id = alt_text.toLowerCase(); // for shortcut links like ![this][].
		    }

		    alt_text = self.encodeAttribute(alt_text);
		    var result;
		    if ('undefined' !== typeof self.urls[link_id]) {
		        var url = self.encodeAttribute(self.urls[link_id]);
		        result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";
		        if ('undefined' !== typeof self.titles[link_id]) {
		            var title = self.titles[link_id];
		            title = self.encodeAttribute(title);
		            result +=  " title=\"" + title + "\"";
		        }
		        result += self.empty_element_suffix;
		        result = self.hashPart(result);
		    }
		    else {
		        // If there's no such link ID, leave intact:
		        result = whole_match;
		    }

		    return result;
		});
	}

    //
    // Next, handle inline images:  ![alt text](url "optional title")
    // Don't forget: encode * and _
    //
	cheatText = text.replace(/[^!^\(^\)^\[^\]^\n^\s]/gm, '').replace(/\[\s*\]/g, '[]');
	if ((cheatText.indexOf(']()') !== -1) || (cheatText.indexOf('] ()') !== -1) || (cheatText.indexOf(']\n()') !== -1)) {
		text = text.replace(new RegExp(
		    '('                + // wrap whole match in $1
		      '!\\['           +
		        '(' + this.nested_brackets_re + ')' +		// alt text = $2
		      '\\]'            +
		      '\\s?'           + // One optional whitespace character
		      '\\('            + // literal paren
		        '[ \\n]*'      +
		        '(?:'          +
		            '<(\\S*)>' + // src url = $3
		        '|'            +
		            '(' + this.nested_url_parenthesis_re + ')' +	// src url = $4
		        ')'            +
		        '[ \\n]*'      +
		        '('            + // $5
		          '([\'"])'    + // quote char = $6
		          '(.*?)'      + // title = $7
		          '\\6'        + // matching quote
		          '[ \\n]*'    +
		        ')?'           + // title is optional
		      '\\)'            +
		    ')',
		    'mg'
		), function(match, whole_match, alt_text, url3, url4, x5, x6, title) {
		    //console.log(match);
		    var url = url3 ? url3 : url4;

		    alt_text = self.encodeAttribute(alt_text);
		    url = self.encodeAttribute(url);
		    var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";
		    if ('undefined' !== typeof title && title !== '') {
		        title = self.encodeAttribute(title);
		        result +=  " title=\"" + title + "\""; // $title already quoted
		    }
		    result += self.empty_element_suffix;

		    return self.hashPart(result);
		});
	}

    return text;
};

Markdown_Parser.prototype.doHeaders = function(text) {
    var self = this;
    // Setext-style headers:
    //    Header 1
    //    ========
    //
    //    Header 2
    //    --------
    //
    text = text.replace(/^(.+?)[ ]*\n(=+|-+)[ ]*\n+/mg, function(match, span, line) {
       //console.log(match);
       // Terrible hack to check we haven't found an empty list item.
        if(line == '-' && span.match(/^-(?: |$)/)) {
            return match;
        }
        var level = line.charAt(0) == '=' ? 1 : 2;
        var block = "<h" + level + ">" + self.runSpanGamut(span) + "</h" + level + ">";
        return "\n" + self.hashBlock(block)  + "\n\n";
    });

    // atx-style headers:
    //  # Header 1
    //  ## Header 2
    //  ## Header 2 with closing hashes ##
    //  ...
    //  ###### Header 6
    //
    text = text.replace(new RegExp(
        '^(\\#{1,6})' + // $1 = string of #\'s
        '[ ]*'        +
        '(.+?)'       + // $2 = Header text
        '[ ]*'        +
        '\\#*'        + // optional closing #\'s (not counted)
        '\\n+',
        'mg'
    ), function(match, hashes, span) {
        //console.log(match);
        var level = hashes.length;
        var block = "<h" + level + ">" + self.runSpanGamut(span) + "</h" + level + ">";
        return "\n" + self.hashBlock(block) + "\n\n";
    });

    return text;
};

/**
 * Form HTML ordered (numbered) and unordered (bulleted) lists.
 */
Markdown_Parser.prototype.doLists = function(text) {
    var less_than_tab = this.tab_width - 1;

    // Re-usable patterns to match list item bullets and number markers:
    var marker_ul_re  = '[\\*\\+-]';
    var marker_ol_re  = '\\d+[\\.]';
    var marker_any_re = "(?:" + marker_ul_re + "|" + marker_ol_re + ")";

    var self = this;
    var _doLists_callback = function(match, list, x2, x3, type) {
        //console.log(match);
        // Re-usable patterns to match list item bullets and number markers:
        var list_type = type.match(marker_ul_re) ? "ul" : "ol";

        var marker_any_re = list_type == "ul" ? marker_ul_re : marker_ol_re;

        list += "\n";
        var result = self.processListItems(list, marker_any_re);

        result = self.hashBlock("<" + list_type + ">\n" + result + "</" + list_type + ">");
        return "\n" + result + "\n\n";
    };

    var markers_relist = [
        [marker_ul_re, marker_ol_re],
        [marker_ol_re, marker_ul_re]
    ];

    for (var i = 0; i < markers_relist.length; i++) {
        var marker_re = markers_relist[i][0];
        var other_marker_re = markers_relist[i][1];
        // Re-usable pattern to match any entirel ul or ol list:
        var whole_list_re =
            '('               + // $1 = whole list
              '('             + // $2
                '([ ]{0,' + less_than_tab + '})' + // $3 = number of spaces
                '(' + marker_re + ')'            + // $4 = first list item marker
                '[ ]+'        +
              ')'             +
              '[\\s\\S]+?'    +
              '('             + // $5
                  '(?=\\x03)' +  // \z
                '|'           +
                  '\\n{2,}'   +
                  '(?=\\S)'   +
                  '(?!'       + // Negative lookahead for another list item marker
                    '[ ]*'    +
                    marker_re + '[ ]+' +
                  ')'         +
                '|'           +
                  '(?='       + // Lookahead for another kind of list
                    '\\n'     +
                    '\\3'     + // Must have the same indentation
                    other_marker_re + '[ ]+' +
                  ')'         +
              ')'             +
            ')'; // mx

        // We use a different prefix before nested lists than top-level lists.
        // See extended comment in _ProcessListItems().

        text = this.__wrapSTXETX__(text);
        if (this.list_level) {
            text = text.replace(new RegExp('^' + whole_list_re, "mg"), _doLists_callback);
        }
        else {
            text = text.replace(new RegExp(
                '(?:(?=\\n)\\n|\\x02\\n?)' + // Must eat the newline
                whole_list_re, "mg"
            ), _doLists_callback);
        }
        text = this.__unwrapSTXETX__(text);
    }

    return text;
};

// var $list_level = 0;

/**
 * Process the contents of a single ordered or unordered list, splitting it
 * into individual list items.
 */
Markdown_Parser.prototype.processListItems = function(list_str, marker_any_re) {
    // The $this->list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //    I recommend upgrading to version
    //    8. Oops, now this line is treated
    //    as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".

    if('undefined' === typeof this.list_level) {
        this.list_level = 0;
    }
    this.list_level++;

    // trim trailing blank lines:
    list_str = this.__wrapSTXETX__(list_str);
    list_str = list_str.replace(/\n{2,}(?=\x03)/m, "\n");
    list_str = this.__unwrapSTXETX__(list_str);

    var self = this;
    list_str = this.__wrapSTXETX__(list_str);
    list_str = list_str.replace(new RegExp(
        '(\\n)?'                + // leading line = $1
        '([ ]*)'                + // leading whitespace = $2
        '(' + marker_any_re     + // list marker and space = $3
            '(?:[ ]+|(?=\\n))'  + // space only required if item is not empty
        ')'                     +
        '([\\s\\S]*?)'          + // list item text   = $4
        '(?:(\\n+(?=\\n))|\\n)' + // tailing blank line = $5
        '(?=\\n*(\\x03|\\2(' + marker_any_re + ')(?:[ ]+|(?=\\n))))',
        "gm"
    ), function(match, leading_line, leading_space, marker_space, item, tailing_blank_line) {
        //console.log(match);
        //console.log(item, [leading_line ? leading_line.length : 0, tailing_blank_line ? tailing_blank_line.length : 0]);
        if (leading_line || tailing_blank_line || item.match(/\n{2,}/)) {
            // Replace marker with the appropriate whitespace indentation
            item = leading_space + self._php_str_repeat(' ', marker_space.length) + item;
            item = self.runBlockGamut(self.outdent(item) + "\n");
        }
        else {
            // Recursion for sub-lists:
            item = self.doLists(self.outdent(item));
            item = item.replace(/\n+$/m, '');
            item = self.runSpanGamut(item);
        }

        return "<li>" + item + "</li>\n";
    });
    list_str = this.__unwrapSTXETX__(list_str);

    this.list_level--;
    return list_str;
};

/**
 *   Process Markdown `<pre><code>` blocks.
 */
Markdown_Parser.prototype.doCodeBlocks = function(text) {
    var self = this;
    text = this.__wrapSTXETX__(text);
    text = text.replace(new RegExp(
        '(?:^|\\n\\n|(?=\\x02)\\n)?' +
        '('                          + // $1 = the code block -- one or more lines, starting with a space/tab
		  '(?:'                      +
          '(?=('                     +
            '[ ]{' + this.tab_width + ',}' +  // Lines must start with a tab or a tab-width of spaces
            '.*\\n+'                 +
          '))\\2'                    +
		  ')+'                       +
        ')'                          +
        '((?=^[ ]{0,' + this.tab_width + '}\\S)|(?:\\n*(?=\\x03)))',  // Lookahead for non-space at line-start, or end of doc
        'mg'
    ), function(match, codeblock) {
        //console.log(match);
        codeblock = self.outdent(codeblock);
        codeblock = self._php_htmlspecialchars_ENT_NOQUOTES(codeblock);

        // trim leading newlines and trailing newlines
        codeblock = self.__wrapSTXETX__(codeblock);
        codeblock = codeblock.replace(/(?=\x02)\n+|\n+(?=\x03)/g, '');
        codeblock = self.__unwrapSTXETX__(codeblock);

        codeblock = "<pre><code>" + codeblock + "\n</code></pre>";
        return "\n\n" + self.hashBlock(codeblock) + "\n\n";
    });
    text = this.__unwrapSTXETX__(text);
    return text;
};

/**
 * Create a code span markup for $code. Called from handleSpanToken.
 */
Markdown_Parser.prototype.makeCodeSpan = function(code) {
    code = this._php_htmlspecialchars_ENT_NOQUOTES(this._php_trim(code));
    return this.hashPart("<code>" + code + "</code>");
};

/**
 * Prepare regular expressions for searching emphasis tokens in any
 * context.
 */
Markdown_Parser.prototype.prepareItalicsAndBold = function() {
    this.em_strong_prepared_relist = {};
    for(var i = 0; i < this.em_relist.length; i++) {
        var em = this.em_relist[i][0];
        var em_re = this.em_relist[i][1];
        for(var j = 0; j < this.strong_relist.length; j++) {
            var strong = this.strong_relist[j][0];
            var strong_re = this.strong_relist[j][1];
            // Construct list of allowed token expressions.
            var token_relist = [];
            for(var k = 0; k < this.em_strong_relist.length; k++) {
                var em_strong = this.em_strong_relist[k][0];
                var em_strong_re = this.em_strong_relist[k][1];
                if(em + strong == em_strong) {
                    token_relist.push(em_strong_re);
                }
            }
            token_relist.push(em_re);
            token_relist.push(strong_re);

            // Construct master expression from list.
            var token_re = new RegExp('(' + token_relist.join('|')  + ')');
            this.em_strong_prepared_relist['rx_' + em + strong] = token_re;
        }
    }
};

Markdown_Parser.prototype.doItalicsAndBold = function(text) {
    var em = '';
    var strong = '';
    var tree_char_em = false;
    var text_stack = [''];
    var token_stack = [];
    var token = '';

    while (1) {
        //
        // Get prepared regular expression for seraching emphasis tokens
        // in current context.
        //
        var token_re = this.em_strong_prepared_relist['rx_' + em + strong];

        //
        // Each loop iteration search for the next emphasis token.
        // Each token is then passed to handleSpanToken.
        //
        var parts = text.match(token_re); //PREG_SPLIT_DELIM_CAPTURE
        if(parts) {
            var left = RegExp.leftContext;
            var right = RegExp.rightContext;
            var pre = "";
            var marker = parts[1];
            for(var mg = 2; mg < parts.length; mg += 2) {
                if('undefined' !== typeof parts[mg] && parts[mg] != '') {
                    pre = parts[mg];
                    marker = parts[mg + 1];
                    break;
                }
            }
            //console.log([left + pre, marker]);
            text_stack[0] += (left + pre);
            token = marker;
            text = right;
        }
        else {
            text_stack[0] += text;
            token = '';
            text = '';
        }
        if(token == '') {
            // Reached end of text span: empty stack without emitting.
            // any more emphasis.
            while (token_stack.length > 0 && token_stack[0].length > 0) {
                text_stack[1] += token_stack.shift();
                var text_stack_prev0 = text_stack.shift(); // $text_stack[0] .= array_shift($text_stack);
                text_stack[0] += text_stack_prev0;
            }
            break;
        }

        var tag, span;

        var token_len = token.length;
        if (tree_char_em) {
            // Reached closing marker while inside a three-char emphasis.
            if (token_len == 3) {
                // Three-char closing marker, close em and strong.
                token_stack.shift();
                span = text_stack.shift();
                span = this.runSpanGamut(span);
                span = "<strong><em>" + span + "</em></strong>";
                text_stack[0] += this.hashPart(span);
                em = '';
                strong = '';
            } else {
                // Other closing marker: close one em or strong and
                // change current token state to match the other
                token_stack[0] = this._php_str_repeat(token.charAt(0), 3 - token_len);
                tag = token_len == 2 ? "strong" : "em";
                span = text_stack[0];
                span = this.runSpanGamut(span);
                span = "<" + tag + ">" + span + "</" + tag + ">";
                text_stack[0] = this.hashPart(span);
                if(tag == 'strong') { strong = ''; } else { em = ''; }
            }
            tree_char_em = false;
        } else if (token_len == 3) {
            if (em != '') {
                // Reached closing marker for both em and strong.
                // Closing strong marker:
                for (var i = 0; i < 2; ++i) {
                    var shifted_token = token_stack.shift();
                    tag = shifted_token.length == 2 ? "strong" : "em";
                    span = text_stack.shift();
                    span = this.runSpanGamut(span);
                    span = "<" + tag + ">" + span + "</" + tag + ">";
                    text_stack[0] = this.hashPart(span);
                    if(tag == 'strong') { strong = ''; } else { em = ''; }
                }
            } else {
                // Reached opening three-char emphasis marker. Push on token
                // stack; will be handled by the special condition above.
                em = token.charAt(0);
                strong = em + em;
                token_stack.unshift(token);
                text_stack.unshift('');
                tree_char_em = true;
            }
        } else if (token_len == 2) {
            if (strong != '') {
                // Unwind any dangling emphasis marker:
                if (token_stack[0].length == 1) {
                    text_stack[1] += token_stack.shift();
                    var text_stack_prev0 = text_stack.shift(); // $text_stack[0] .= array_shift($text_stack);
                    text_stack[0] += text_stack_prev0;
                }
                // Closing strong marker:
                token_stack.shift();
                span = text_stack.shift();
                span = this.runSpanGamut(span);
                span = "<strong>" + span + "</strong>";
                text_stack[0] += this.hashPart(span);
                strong = '';
            } else {
                token_stack.unshift(token);
                text_stack.unshift('');
                strong = token;
            }
        } else {
            // Here $token_len == 1
            if (em != '') {
                if (token_stack[0].length == 1) {
                    // Closing emphasis marker:
                    token_stack.shift();
                    span = text_stack.shift();
                    span = this.runSpanGamut(span);
                    span = "<em>" + span + "</em>";
                    text_stack[0] += this.hashPart(span);
                    em = '';
                } else {
                    text_stack[0] += token;
                }
            } else {
                token_stack.unshift(token);
                text_stack.unshift('');
                em = token;
            }
        }
    }
    return text_stack[0];
};


Markdown_Parser.prototype.doBlockQuotes = function(text) {
    var self = this;
    text = text.replace(new RegExp(
        '('              + // Wrap whole match in $1
          '(?:'          +
            '^[ ]*>[ ]?' + // ">" at the start of a line
              '.+\\n'    + // rest of the first line
            '(.+\\n)*'   + // subsequent consecutive lines
            '\\n*'       + // blanks
          ')+'           +
        ')',
        'mg'
    ), function(match, bq) {
        //console.log(match);
        // trim one level of quoting - trim whitespace-only lines
        bq = bq.replace(/^[ ]*>[ ]?|^[ ]+$/mg, '');
        bq = self.runBlockGamut(bq);		// recurse

        bq = bq.replace(/^/mg, "  ");
        // These leading spaces cause problem with <pre> content,
        // so we need to fix that:
        bq = bq.replace(/(\\s*<pre>[\\s\\S]+?<\/pre>)/mg, function(match, pre) {
            //console.log(match);
            pre = pre.replace(/^  /m, '');
            return pre;
        });

        return "\n" + self.hashBlock("<blockquote>\n" + bq + "\n</blockquote>") + "\n\n";
    });
    return text;
};

/**
 * Params:
 * $text - string to process with html <p> tags
 */
Markdown_Parser.prototype.formParagraphs = function(text) {

    // Strip leading and trailing lines:
    text = this.__wrapSTXETX__(text);
    text = text.replace(/(?:\x02)\n+|\n+(?:\x03)/g, "");
    text = this.__unwrapSTXETX__(text);
    // [porting note]
    // below may be faster than js regexp.
    //for(var s = 0; s < text.length && text.charAt(s) == "\n"; s++) { }
    //text = text.substr(s);
    //for(var e = text.length; e > 0 && text.charAt(e - 1) == "\n"; e--) { }
    //text = text.substr(0, e);

    var grafs = text.split(/\n{2,}/m);
    //preg_split('/\n{2,}/', $text, -1, PREG_SPLIT_NO_EMPTY);

    //
    // Wrap <p> tags and unhashify HTML blocks
    //
    for(var i = 0; i < grafs.length; i++) {
        var value = grafs[i];
        if(value == "") {
            // [porting note]
            // This case is replacement for PREG_SPLIT_NO_EMPTY.
        }
        else if (!value.match(/^B\x1A[0-9]+B$/)) {
            // Is a paragraph.
            value = this.runSpanGamut(value);
            value = value.replace(/^([ ]*)/, "<p>");
            value += "</p>";
            grafs[i] = this.unhash(value);
        }
        else {
            // Is a block.
            // Modify elements of @grafs in-place...
            var graf = value;
            var block = this.html_hashes[graf];
            graf = block;
            //if (preg_match('{
            //	\A
            //	(							# $1 = <div> tag
            //	  <div  \s+
            //	  [^>]*
            //	  \b
            //	  markdown\s*=\s*  ([\'"])	#	$2 = attr quote char
            //	  1
            //	  \2
            //	  [^>]*
            //	  >
            //	)
            //	(							# $3 = contents
            //	.*
            //	)
            //	(</div>)					# $4 = closing tag
            //	\z
            //	}xs', $block, $matches))
            //{
            //	list(, $div_open, , $div_content, $div_close) = $matches;
            //
            //	# We can't call Markdown(), because that resets the hash;
            //	# that initialization code should be pulled into its own sub, though.
            //	$div_content = $this->hashHTMLBlocks($div_content);
            //
            //	# Run document gamut methods on the content.
            //	foreach ($this->document_gamut as $method => $priority) {
            //		$div_content = $this->$method($div_content);
            //	}
            //
            //	$div_open = preg_replace(
            //		'{\smarkdown\s*=\s*([\'"]).+?\1}', '', $div_open);
            //
            //	$graf = $div_open . "\n" . $div_content . "\n" . $div_close;
            //}
            grafs[i] = graf;
        }
    }

    return grafs.join("\n\n");
};

/**
 * Encode text for a double-quoted HTML attribute. This function
 * is *not* suitable for attributes enclosed in single quotes.
 */
Markdown_Parser.prototype.encodeAttribute = function(text) {
    text = this.encodeAmpsAndAngles(text);
    text = text.replace(/"/g, '&quot;');
    return text;
};

/**
 * Smart processing for ampersands and angle brackets that need to
 * be encoded. Valid character entities are left alone unless the
 * no-entities mode is set.
 */
Markdown_Parser.prototype.encodeAmpsAndAngles = function(text) {
    if (this.no_entities) {
        text = text.replace(/&/g, '&amp;');
    } else {
        // Ampersand-encoding based entirely on Nat Irons's Amputator
        // MT plugin: <http://bumppo.net/projects/amputator/>
        text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/, '&amp;');
    }
    // Encode remaining <'s
    text = text.replace(/</g, '&lt;');

    return text;
};

Markdown_Parser.prototype.doAutoLinks = function(text) {
    var self = this;
    text = text.replace(/<((https?|ftp|dict):[^'">\s]+)>/i, function(match, address) {
        //console.log(match);
        var url = self.encodeAttribute(address);
        var link = "<a href=\"" + url + "\">" + url + "</a>";
        return self.hashPart(link);
    });

    // Email addresses: <address@domain.foo>
    text = text.replace(new RegExp(
        '<'                            +
        '(?:mailto:)?'                 +
        '('                            +
            '(?:'                      +
                '[-!#$%&\'*+/=?^_`.{|}~\\w\\x80-\\xFF]+' +
            '|'                        +
                '".*?"'                +
            ')'                        +
            '\\@'                      +
            '(?:'                      +
                '[-a-z0-9\\x80-\\xFF]+(\\.[-a-z0-9\\x80-\\xFF]+)*\\.[a-z]+' +
            '|'                        +
                '\\[[\\d.a-fA-F:]+\\]' +  // IPv4 & IPv6
            ')'                        +
        ')'                            +
        '>',
        'i'
    ), function(match, address) {
        //console.log(match);
        var link = self.encodeEmailAddress(address);
        return self.hashPart(link);
    });

    return text;
};

/**
 *  Input: an email address, e.g. "foo@example.com"
 *
 *  Output: the email address as a mailto link, with each character
 *      of the address encoded as either a decimal or hex entity, in
 *      the hopes of foiling most address harvesting spam bots. E.g.:
 *
 *    <p><a href="&#109;&#x61;&#105;&#x6c;&#116;&#x6f;&#58;&#x66;o&#111;
 *        &#x40;&#101;&#x78;&#97;&#x6d;&#112;&#x6c;&#101;&#46;&#x63;&#111;
 *        &#x6d;">&#x66;o&#111;&#x40;&#101;&#x78;&#97;&#x6d;&#112;&#x6c;
 *        &#101;&#46;&#x63;&#111;&#x6d;</a></p>
 *
 *   Based by a filter by Matthew Wickline, posted to BBEdit-Talk.
 *   With some optimizations by Milian Wolff.
 */
Markdown_Parser.prototype.encodeEmailAddress = function(addr) {
    if('undefined' === typeof arguments.callee.crctable) {
        arguments.callee.crctable =
            "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 " +
            "0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 " +
            "1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 " +
            "136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 " +
            "3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B " +
            "35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 " +
            "26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F " +
            "2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D " +
            "76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 " +
            "7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 " +
            "6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 " +
            "65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 " +
            "4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB " +
            "4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 " +
            "5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F " +
            "5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD " +
            "EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 " +
            "E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 " +
            "F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 " +
            "FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 " +
            "D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B " +
            "D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 " +
            "CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F " +
            "C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D " +
            "9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 " +
            "95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 " +
            "86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 " +
            "88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 " +
            "A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB " +
            "AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 " +
            "BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF " +
            "B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D".split(' ');
    }
    var crctable = arguments.callee.crctable;
    function _crc32(str) {
        var crc = 0;
        crc = crc ^ (-1);
        for (var i = 0; i < str.length; ++i) {
            var y = (crc ^ str.charCodeAt(i)) & 0xff;
            var x = "0x" + crctable[y];
            crc = (crc >>> 8) ^ x;
        }
        return (crc ^ (-1)) >>> 0;
    }

    addr = "mailto:" + addr;
    var chars = [];
    var i;
    for(i = 0; i < addr.length; i++) {
        chars.push(addr.charAt(i));
    }
    var seed = Math.floor(Math.abs(_crc32(addr) / addr.length)); // # Deterministic seed.

    for(i = 0; i < chars.length; i++) {
        var c = chars[i];
        var ord = c.charCodeAt(0);
        // Ignore non-ascii chars.
        if(ord < 128) {
            var r = (seed * (1 + i)) % 100; // Pseudo-random function.
            // roughly 10% raw, 45% hex, 45% dec
            // '@' *must* be encoded. I insist.
            if(r > 90 && c != '@') { /* do nothing */ }
            else if(r < 45) { chars[i] = '&#x' + ord.toString(16) + ';'; }
            else            { chars[i] = '&#' + ord.toString(10) + ';'; }
        }
    }

    addr = chars.join('');
    var text = chars.splice(7, chars.length - 1).join(''); // text without `mailto:`
    addr = "<a href=\"" + addr + "\">" + text + "</a>";

    return addr;
};

/**
 * Take the string $str and parse it into tokens, hashing embeded HTML,
 * escaped characters and handling code spans.
*/
Markdown_Parser.prototype.parseSpan = function(str) {
    var output = '';

    var span_re = new RegExp(
            '('                          +
                '\\\\' + this.escape_chars_re +
            '|'                          +
                // This expression is too difficult for JS: '(?<![`\\\\])'
                // Resoled by hand coded process.
                '`+'                     + // code span marker
        (this.no_markup ? '' : (
            '|'                          +
                '<!--.*?-->'             + // comment
            '|'                          +
                '<\\?.*?\\?>|<%.*?%>'    + // processing instruction
            '|'                          +
                '<[/!$]?[-a-zA-Z0-9:_]+' + // regular tags
                '(?='                    +
                    '\\s'                +
                    '(?=[^"\'>]+|"[^"]*"|\'[^\']*\')*' +
                ')?'                     +
                '>'
        )) +
            ')'
    );

    while(1) {
        //
        // Each loop iteration seach for either the next tag, the next
        // openning code span marker, or the next escaped character.
        // Each token is then passed to handleSpanToken.
        //
        var parts = str.match(span_re); //PREG_SPLIT_DELIM_CAPTURE
        if(parts) {
            if(RegExp.leftContext) {
                output += RegExp.leftContext;
            }
            // Back quote but after backslash is to be ignored.
            if(RegExp.lastMatch.charAt(0) == "`" &&
               RegExp.leftContext.charAt(RegExp.leftContext.length - 1) == "\\"
            ) {
                output += RegExp.lastMatch;
                str = RegExp.rightContext;
                continue;
            }
            var r = this.handleSpanToken(RegExp.lastMatch, RegExp.rightContext);
            output += r[0];
            str = r[1];
        }
        else {
            output += str;
            break;
        }
    }
    return output;
};


/**
 * Handle $token provided by parseSpan by determining its nature and
 * returning the corresponding value that should replace it.
*/
Markdown_Parser.prototype.handleSpanToken = function(token, str) {
    //console.log([token, str]);
    switch (token.charAt(0)) {
        case "\\":
            return [this.hashPart("&#" + token.charCodeAt(1) + ";"), str];
        case "`":
            // Search for end marker in remaining text.
            if (str.match(new RegExp('^([\\s\\S]*?[^`])' + this._php_preg_quote(token) + '(?!`)([\\s\\S]*)$', 'm'))) {
                var code = RegExp.$1;
                str = RegExp.$2;
                var codespan = this.makeCodeSpan(code);
                return [this.hashPart(codespan), str];
            }
            return [token, str]; // return as text since no ending marker found.
        default:
            return [this.hashPart(token), str];
    }
};

/**
 * Remove one level of line-leading tabs or spaces
 */
Markdown_Parser.prototype.outdent = function(text) {
    return text.replace(new RegExp('^(\\t|[ ]{1,' + this.tab_width + '})', 'mg'), '');
};


//# String length function for detab. `_initDetab` will create a function to
//# hanlde UTF-8 if the default function does not exist.
//var $utf8_strlen = 'mb_strlen';

/**
 * Replace tabs with the appropriate amount of space.
 */
Markdown_Parser.prototype.detab = function(text) {
    // For each line we separate the line in blocks delemited by
    // tab characters. Then we reconstruct every line by adding the
    // appropriate number of space between each blocks.
    var self = this;
    return text.replace(/^.*\t.*$/mg, function(line) {
        //$strlen = $this->utf8_strlen; # strlen function for UTF-8.
        // Split in blocks.
        var blocks = line.split("\t");
        // Add each blocks to the line.
        line = blocks.shift(); // Do not add first block twice.
        for(var i = 0; i < blocks.length; i++) {
            var block = blocks[i];
            // Calculate amount of space, insert spaces, insert block.
            var amount = self.tab_width - line.length % self.tab_width;
            line += self._php_str_repeat(" ", amount) + block;
        }
        return line;
    });
};

/**
 * Swap back in all the tags hashed by _HashHTMLBlocks.
 */
Markdown_Parser.prototype.unhash = function(text) {
    var self = this;
    return text.replace(/(.)\x1A[0-9]+\1/g, function(match) {
        return self.html_hashes[match];
    });
};
/*-------------------------------------------------------------------------*/

/**
 * Constructor function. Initialize the parser object.
 */
function MarkdownExtra_Parser() {

    // Prefix for footnote ids.
    this.fn_id_prefix = "";

    // Optional title attribute for footnote links and backlinks.
    this.fn_link_title = MARKDOWN_FN_LINK_TITLE;
    this.fn_backlink_title = MARKDOWN_FN_BACKLINK_TITLE;

    // Optional class attribute for footnote links and backlinks.
    this.fn_link_class = MARKDOWN_FN_LINK_CLASS;
    this.fn_backlink_class = MARKDOWN_FN_BACKLINK_CLASS;

    // Predefined abbreviations.
    this.predef_abbr = {};

    // Extra variables used during extra transformations.
    this.footnotes = {};
    this.footnotes_ordered = [];
    this.abbr_desciptions = {};
    this.abbr_word_re = '';

    // Give the current footnote number.
    this.footnote_counter = 1;

    // ### HTML Block Parser ###

    // Tags that are always treated as block tags:
    this.block_tags_re = 'p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|address|form|fieldset|iframe|hr|legend';

    // Tags treated as block tags only if the opening tag is alone on it's line:
    this.context_block_tags_re = 'script|noscript|math|ins|del';

    // Tags where markdown="1" default to span mode:
    this.contain_span_tags_re = 'p|h[1-6]|li|dd|dt|td|th|legend|address';

    // Tags which must not have their contents modified, no matter where
    // they appear:
    this.clean_tags_re = 'script|math';

    // Tags that do not need to be closed.
    this.auto_close_tags_re = 'hr|img';

    // Redefining emphasis markers so that emphasis by underscore does not
    // work in the middle of a word.
    this.em_relist = [
        ['' , '(?:(^|[^\\*])(\\*)(?=[^\\*])|(^|[^a-zA-Z0-9_])(_)(?=[^_]))(?=\\S|$)(?![\\.,:;]\\s)'],
        ['*', '((?:\\S|^)[^\\*])(\\*)(?!\\*)'],
        ['_', '((?:\\S|^)[^_])(_)(?![a-zA-Z0-9_])']
    ];
    this.strong_relist = [
        ['' , '(?:(^|[^\\*])(\\*\\*)(?=[^\\*])|(^|[^a-zA-Z0-9_])(__)(?=[^_]))(?=\\S|$)(?![\\.,:;]\\s)'],
        ['**', '((?:\\S|^)[^\\*])(\\*\\*)(?!\\*)'],
        ['__', '((?:\\S|^)[^_])(__)(?![a-zA-Z0-9_])']
    ];
    this.em_strong_relist = [
        ['' , '(?:(^|[^\\*])(\\*\\*\\*)(?=[^\\*])|(^|[^a-zA-Z0-9_])(___)(?=[^_]))(?=\\S|$)(?![\\.,:;]\\s)'],
        ['***', '((?:\\S|^)[^\\*])(\\*\\*\\*)(?!\\*)'],
        ['___', '((?:\\S|^)[^_])(___)(?![a-zA-Z0-9_])']
    ];

    // Add extra escapable characters before parent constructor
    // initialize the table.
    this.escape_chars += ':|';

    // Insert extra document, block, and span transformations.
    // Parent constructor will do the sorting.
    this.document_gamut.push(['doFencedCodeBlocks',  5]);
    this.document_gamut.push(['stripFootnotes',     15]);
    this.document_gamut.push(['stripAbbreviations', 25]);
    this.document_gamut.push(['appendFootnotes',    50]);

    this.block_gamut.push(['doFencedCodeBlocks',  5]);
    this.block_gamut.push(['doTables',           15]);
    this.block_gamut.push(['doDefLists',         45]);

    this.span_gamut.push(['doFootnotes',      5]);
    this.span_gamut.push(['doAbbreviations', 70]);
}
MarkdownExtra_Parser.prototype = new Markdown_Parser();

/**
 * Setting up Extra-specific variables.
 */
MarkdownExtra_Parser.prototype.setup = function() {
    this.constructor.prototype.setup.call(this);

    this.footnotes = {};
    this.footnotes_ordered = [];
    this.abbr_desciptions = {};
    this.abbr_word_re = '';
    this.footnote_counter = 1;

    for(var abbr_word in this.predef_abbr) {
        var abbr_desc = this.predef_abbr[abbr_word];
        if(this.abbr_word_re != '') {
            this.abbr_word_re += '|';
        }
        this.abbr_word_re += this._php_preg_quote(abbr_word); // ?? str -> re?
        this.abbr_desciptions[abbr_word] = this._php_trim(abbr_desc);
    }
};

/**
 * Clearing Extra-specific variables.
 */
MarkdownExtra_Parser.prototype.teardown = function() {
    this.footnotes = {};
    this.footnotes_ordered = [];
    this.abbr_desciptions = {};
    this.abbr_word_re = '';

    this.constructor.prototype.teardown.call(this);
};


/**
 * Hashify HTML Blocks and "clean tags".
 *
 * We only want to do this for block-level HTML tags, such as headers,
 * lists, and tables. That's because we still want to wrap <p>s around
 * "paragraphs" that are wrapped in non-block-level tags, such as anchors,
 * phrase emphasis, and spans. The list of tags we're looking for is
 * hard-coded.
 *
 * This works by calling _HashHTMLBlocks_InMarkdown, which then calls
 * _HashHTMLBlocks_InHTML when it encounter block tags. When the markdown="1"
 * attribute is found whitin a tag, _HashHTMLBlocks_InHTML calls back
 *  _HashHTMLBlocks_InMarkdown to handle the Markdown syntax within the tag.
 * These two functions are calling each other. It's recursive!
 */
MarkdownExtra_Parser.prototype.hashHTMLBlocks = function(text) {
    //
    // Call the HTML-in-Markdown hasher.
    //
    var r = this._hashHTMLBlocks_inMarkdown(text);
    text = r[0];

    return text;
};

/**
 * Parse markdown text, calling _HashHTMLBlocks_InHTML for block tags.
 *
 * *   $indent is the number of space to be ignored when checking for code
 *     blocks. This is important because if we don't take the indent into
 *     account, something like this (which looks right) won't work as expected:
 *
 *     <div>
 *         <div markdown="1">
 *         Hello World.  <-- Is this a Markdown code block or text?
 *         </div>  <-- Is this a Markdown code block or a real tag?
 *     <div>
 *
 *     If you don't like this, just don't indent the tag on which
 *     you apply the markdown="1" attribute.
 *
 * *   If $enclosing_tag_re is not empty, stops at the first unmatched closing
 *     tag with that name. Nested tags supported.
 *
 * *   If $span is true, text inside must treated as span. So any double
 *     newline will be replaced by a single newline so that it does not create
 *     paragraphs.
 *
 * Returns an array of that form: ( processed text , remaining text )
 */
MarkdownExtra_Parser.prototype._hashHTMLBlocks_inMarkdown = function(text, indent, enclosing_tag_re, span) {
    if('undefined' === typeof indent) { indent = 0; }
    if('undefined' === typeof enclosing_tag_re) { enclosing_tag_re = ''; }
    if('undefined' === typeof span) { span = false; }

    if(text === '') { return ['', '']; }

    var matches;

    // Regex to check for the presense of newlines around a block tag.
    var newline_before_re = /(?:^\n?|\n\n)*$/;
    var newline_after_re = new RegExp(
        '^'                 + // Start of text following the tag.
        '([ ]*<!--.*?-->)?' + // Optional comment.
        '[ ]*\\n'           , // Must be followed by newline.
        'm'
    );

    // Regex to match any tag.
    var block_tag_re = new RegExp(
        '('                        + // $2: Capture hole tag.
            '</?'                  + // Any opening or closing tag.
                '('                + // Tag name.
                    this.block_tags_re         + '|' +
                    this.context_block_tags_re + '|' +
                    this.clean_tags_re         + '|' +
                    '(?!\\s)' + enclosing_tag_re +
                ')'                +
                '(?:'              +
                    '(?=[\\s"\'/a-zA-Z0-9])' + // Allowed characters after tag name.
                    '(?=('            +
                        '".*?"|'   + // Double quotes (can contain `>`)
                        '\'.*?\'|' + // Single quotes (can contain `>`)
                        '.+?'      + // Anything but quotes and `>`.
                    '))\\3*?'          +
                ')?'               +
            '>'                    + // End of tag.
        '|'                        +
            '<!--.*?-->'           + // HTML Comment
        '|'                        +
            '<\\?.*?\\?>|<%.*?%>'  + // Processing instruction
        '|'                        +
            '<!\\[CDATA\\[.*?\\]\\]>' + // CData Block
        '|'                        +
            // Code span marker
            '`+'                   +
        ( !span ? // If not in span.
        '|'                        +
            // Indented code block
            '(?:^[ ]*\\n|^|\\n[ ]*\\n)' +
            '[ ]{' + (indent + 4) + '}[^\\n]*\\n' +
            '(?='                  +
                '(?:[ ]{' + (indent + 4) + '}[^\\n]*|[ ]*)\\n' +
            ')*'                   +
        '|'                        +
            // Fenced code block marker
            '(?:^|\\n)'            +
            '[ ]{0,' + indent + '}~~~+[ ]*\\n'
        : '' ) + // # End (if not is span).
        ')',
        'm'
    );

    var depth = 0;		// Current depth inside the tag tree.
    var parsed = "";	// Parsed text that will be returned.

    //
    // Loop through every tag until we find the closing tag of the parent
    // or loop until reaching the end of text if no parent tag specified.
    //
    do {
        //
        // Split the text using the first $tag_match pattern found.
        // Text before  pattern will be first in the array, text after
        // pattern will be at the end, and between will be any catches made
        // by the pattern.
        //
        var parts_available = text.match(block_tag_re); //PREG_SPLIT_DELIM_CAPTURE
        var parts;
        if(!parts_available) {
            parts = [text];
        }
        else {
            parts = [RegExp.leftContext, RegExp.lastMatch, RegExp.rightContext];
        }

        // If in Markdown span mode, add a empty-string span-level hash
        // after each newline to prevent triggering any block element.
        if(span) {
            var _void = this.hashPart("", ':');
            var newline = _void + "\n";
            parts[0] = _void + parts[0].replace(/\n/g, newline) + _void;
        }

        parsed += parts[0]; // Text before current tag.

        // If end of $text has been reached. Stop loop.
        if(!parts_available) {
            text = "";
            break;
        }

        var tag  = parts[1]; // Tag to handle.
        text = parts[2]; // Remaining text after current tag.
        var tag_re = this._php_preg_quote(tag); // For use in a regular expression.

        var t;
        var block_text;
        //
        // Check for: Code span marker
        //

		if (tag.charAt(0) == "`") {
            // Find corresponding end marker.
            tag_re = this._php_preg_quote(tag);
			if (matches = text.match(new RegExp('^((?=(.+?|\\n[^\\n])))/1*?[^`]' + tag_re + '[^`]'))) {
                // End marker found: pass text unchanged until marker.
                parsed += tag + matches[0];
                text = text.substr(matches[0].length);
            }
            else {
                // Unmatched marker: just skip it.
                parsed += tag;
            }
        }
        //
        // Check for: Fenced code block marker.
        //
        else if(tag.match(new RegExp('^\\n?[ ]{0,' + (indent + 3) + '}~'))) {
            // Fenced code block marker: find matching end marker.
            tag_re = this._php_preg_quote(this._php_trim(tag));
            if(matches = text.match(new RegExp('^(?:.*\\n)+?[ ]{0,' + indent + '}' + tag_re + '[ ]*\\n'))) {
                // End marker found: pass text unchanged until marker.
                parsed += tag + matches[0];
                text = text.substr(matches[0].length);
            }
            else {
                // No end marker: just skip it.
                parsed += tag;
            }
        }
        //
        // Check for: Indented code block.
        //
        else if(tag.charAt(0) == "\n" || tag.charAt(0) == " ") {
            // Indented code block: pass it unchanged, will be handled
            // later.
            parsed += tag;
        }
        //
        // Check for: Opening Block level tag or
        //            Opening Context Block tag (like ins and del)
        //               used as a block tag (tag is alone on it's line).
        //
        else if (tag.match(new RegExp('^<(?:' + this.block_tags_re + ')\\b')) ||
            (
                tag.match(new RegExp('^<(?:' + this.context_block_tags_re + ')\\b')) &&
                parsed.match(newline_before_re) &&
                text.match(newline_after_re)
            )
        ) {
            // Need to parse tag and following text using the HTML parser.
            t = this._hashHTMLBlocks_inHTML(tag + text, this.hashBlock, true);
            block_text = t[0];
            text = t[1];

            // Make sure it stays outside of any paragraph by adding newlines.
            parsed += "\n\n" + block_text + "\n\n";
        }
        //
        // Check for: Clean tag (like script, math)
        //            HTML Comments, processing instructions.
        //
        else if(
            tag.match(new RegExp('^<(?:' + this.clean_tags_re + ')\\b')) ||
            tag.charAt(1) == '!' || tag.charAt(1) == '?'
        ) {
            // Need to parse tag and following text using the HTML parser.
            // (don't check for markdown attribute)
            t = this._hashHTMLBlocks_inHTML(tag + text, this.hashClean, false);
            block_text = t[0];
            text = t[1];

            parsed += block_text;
        }
        //
        // Check for: Tag with same name as enclosing tag.
        //
        else if (enclosing_tag_re !== '' &&
            // Same name as enclosing tag.
            tag.match(new RegExp('^</?(?:' + enclosing_tag_re + ')\\b'))
        ) {
            //
            // Increase/decrease nested tag count.
            //
            if (tag.charAt(1) == '/') depth--;
            else if (tag.charAt(tag.length - 2) != '/') depth++;

            if(depth < 0) {
                //
                // Going out of parent element. Clean up and break so we
                // return to the calling function.
                //
                text = tag + text;
                break;
            }

            parsed += tag;
        }
        else {
            parsed += tag;
        }
    } while(depth >= 0);

    return [parsed, text];
};

/**
 * Parse HTML, calling _HashHTMLBlocks_InMarkdown for block tags.
 *
 * *   Calls $hash_method to convert any blocks.
 * *   Stops when the first opening tag closes.
 * *   $md_attr indicate if the use of the `markdown="1"` attribute is allowed.
 *     (it is not inside clean tags)
 *
 * Returns an array of that form: ( processed text , remaining text )
 */
MarkdownExtra_Parser.prototype._hashHTMLBlocks_inHTML = function(text, hash_method, md_attr) {
    if(text === '') return ['', ''];

    var matches;

    // Regex to match `markdown` attribute inside of a tag.
    var markdown_attr_re = new RegExp(
        '\\s*'           + // Eat whitespace before the `markdown` attribute
        'markdown'       +
        '\\s*=\\s*'      +
        '(?:'            +
            '(["\'])'    + // $1: quote delimiter
            '(.*?)'      + // $2: attribute value
            '\\1'        + // matching delimiter
        '|'              +
            '([^\\s>]*)' + // $3: unquoted attribute value
        ')'              +
        '()'               // $4: make $3 always defined (avoid warnings)
    );

    // Regex to match any tag.
    var tag_re = new RegExp(
        '('                           + // $2: Capture hole tag.
            '</?'                     + // Any opening or closing tag.
                '[\\w:$]+'            + // Tag name.
                '(?:'                 +
                    '(?=[\\s"\'/a-zA-Z0-9])' + // Allowed characters after tag name.
                    '(?:'             +
                    '(?=('            +
                        '".*?"|'      + // Double quotes (can contain `>`)
                        '\'.*?\'|'    + // Single quotes (can contain `>`)
                        '.+?'         + // Anything but quotes and `>`.
                    '))\\4'           +
                    ')*?'             +
                ')?'                  +
            '>'                       + // End of tag.
        '|'                           +
            '<!--.*?-->'              + // HTML Comment
        '|'                           +
            '<\\?.*?\\?>|<%.*?%>'     + // Processing instruction
        '|'                           +
            '<!\\[CDATA\\[.*?\\]\\]>' + // CData Block
        ')'
    );

    var original_text = text; // Save original text in case of faliure.

    var depth      = 0;  // Current depth inside the tag tree.
    var block_text = ""; // Temporary text holder for current text.
    var parsed     = ""; // Parsed text that will be returned.

    //
    // Get the name of the starting tag.
    // (This pattern makes $base_tag_name_re safe without quoting.)
    //
    var base_tag_name_re = "";
    if(matches = text.match(/^<([\w:$]*)\b/)) {
        base_tag_name_re = matches[1];
    }

    //
    // Loop through every tag until we find the corresponding closing tag.
    //
    do {
        //
        // Split the text using the first $tag_match pattern found.
        // Text before  pattern will be first in the array, text after
        // pattern will be at the end, and between will be any catches made
        // by the pattern.
        //
        var parts_available = text.match(tag_re); //PREG_SPLIT_DELIM_CAPTURE);
        // If end of $text has been reached. Stop loop.
        if(!parts_available) {
            //
            // End of $text reached with unbalenced tag(s).
            // In that case, we return original text unchanged and pass the
            // first character as filtered to prevent an infinite loop in the
            // parent function.
            //
            return [original_text.charAt(0), original_text.substr(1)];
        }
        var parts = [RegExp.leftContext, RegExp.lastMatch, RegExp.rightContext];

        block_text += parts[0]; // Text before current tag.
        var tag     = parts[1]; // Tag to handle.
        text        = parts[2]; // Remaining text after current tag.

        //
        // Check for: Auto-close tag (like <hr/>)
        //			 Comments and Processing Instructions.
        //
        if(tag.match(new RegExp('^</?(?:' + this.auto_close_tags_re + ')\\b')) ||
            tag.charAt(1) == '!' || tag.charAt(1) == '?')
        {
            // Just add the tag to the block as if it was text.
            block_text += tag;
        }
        else {
            //
            // Increase/decrease nested tag count. Only do so if
            // the tag's name match base tag's.
            //
            if (tag.match(new RegExp('^</?' + base_tag_name_re + '\\b'))) {
                if(tag.charAt(1) == '/') { depth--; }
                else if(tag.charAt(tag.length - 2) != '/') { depth++; }
            }

            //
            // Check for `markdown="1"` attribute and handle it.
            //
            var attr_m;
            if(md_attr &&
                (attr_m = tag.match(markdown_attr_re)) &&
                (attr_m[2] + attr_m[3]).match(/^1|block|span$/))
            {
                // Remove `markdown` attribute from opening tag.
                tag = tag.replace(markdown_attr_re, '');

                // Check if text inside this tag must be parsed in span mode.
                this.mode = attr_m[2] + attr_m[3];
                var span_mode = this.mode == 'span' || this.mode != 'block' &&
                    tag.match(new RegExp('^<(?:' + this.contain_span_tags_re + ')\\b'));

                // Calculate indent before tag.
                var indent;
                if (matches = block_text.match(/(?:^|\n)( *?)(?! ).*?$/)) {
                    //var strlen = this.utf8_strlen;
                    indent = matches[1].length; //strlen(matches[1], 'UTF-8');
                } else {
                    indent = 0;
                }

                // End preceding block with this tag.
                block_text += tag;
                parsed += hash_method.call(this, block_text);

                // Get enclosing tag name for the ParseMarkdown function.
                // (This pattern makes $tag_name_re safe without quoting.)
                matches = tag.match(/^<([\w:$]*)\b/);
                var tag_name_re = matches[1];

                // Parse the content using the HTML-in-Markdown parser.
                var t = this._hashHTMLBlocks_inMarkdown(text, indent, tag_name_re, span_mode);
                block_text = t[0];
                text = t[1];

                // Outdent markdown text.
                if(indent > 0) {
                    block_text = block_text.replace(new RegExp('/^[ ]{1,' + indent + '}', 'm'), "");
                }

                // Append tag content to parsed text.
                if (!span_mode) { parsed += "\n\n" + block_text + "\n\n"; }
                else { parsed += block_text; }

                // Start over a new block.
                block_text = "";
            }
            else {
                block_text += tag;
            }
        }

    } while(depth > 0);

    //
    // Hash last block text that wasn't processed inside the loop.
    //
    parsed += hash_method.call(this, block_text);

    return [parsed, text];
};


/**
 * Called whenever a tag must be hashed when a function insert a "clean" tag
 * in $text, it pass through this function and is automaticaly escaped,
 * blocking invalid nested overlap.
 */
MarkdownExtra_Parser.prototype.hashClean = function(text) {
    return this.hashPart(text, 'C');
};


/**
 * Redefined to add id attribute support.
 */
MarkdownExtra_Parser.prototype.doHeaders = function(text) {
    var self = this;

    function _doHeaders_attr(attr) {
        if('undefined' === typeof attr || attr == "") {  return ""; }
        return " id=\"" + attr + "\"";
    }

    // Setext-style headers:
    //    Header 1  {#header1}
    //    ========
    //
    //    Header 2  {#header2}
    //    --------

    text = text.replace(new RegExp(
        '(^.+?)'                              + // $1: Header text
        '(?:[ ]+\\{\\#([-_:a-zA-Z0-9]+)\\})?' + // $2: Id attribute
        '[ ]*\\n(=+|-+)[ ]*\\n+',               // $3: Header footer
         'mg'
    ), function(match, span, id, line) {
       //console.log(match);
        if(line == '-' && span.match(/^- /)) {
            return match;
        }
        var level = line.charAt(0) == '=' ? 1 : 2;
        var attr = _doHeaders_attr(id);
        var block = "<h" + level + attr + ">" + self.runSpanGamut(span) + "</h" + level + ">";
        return "\n" + self.hashBlock(block)  + "\n\n";
    });

    // atx-style headers:
    //    # Header 1        {#header1}
    //    ## Header 2       {#header2}
    //    ## Header 2 with closing hashes ##  {#header3}
    //    ...
    //    ###### Header 6   {#header2}

    text = text.replace(new RegExp(
        '^(\\#{1,6})' + // $1 = string of #\'s
        '[ ]*'        +
        '(.+?)'       + // $2 = Header text
        '[ ]*'        +
        '\\#*'        + // optional closing #\'s (not counted)
        '(?:[ ]+\\{\\#([-_:a-zA-Z0-9]+)\\})?' + // id attribute
        '\\n+',
        'mg'
    ), function(match, hashes, span, id) {
        //console.log(match);
        var level = hashes.length;
        var attr = _doHeaders_attr(id);
        var block = "<h" + level + attr + ">" + self.runSpanGamut(span) + "</h" + level + ">";
        return "\n" + self.hashBlock(block) + "\n\n";
    });

    return text;
};

/**
 * Form HTML tables.
 */
MarkdownExtra_Parser.prototype.doTables = function(text) {
    var self = this;

    var less_than_tab = this.tab_width - 1;

    var _doTable_callback = function(match, head, underline, content) {
        //console.log(match);
        // Remove any tailing pipes for each line.
        head = head.replace(/[|] *$/m, '');
        underline = underline.replace(/[|] *$/m, '');
        content = content.replace(/[|] *$/m, '');

        var attr = [];

        // Reading alignement from header underline.
        var separators = underline.split(/[ ]*[|][ ]*/);
        var n;
        for(n = 0; n < separators.length; n++) {
            var s = separators[n];
            if (s.match(/^ *-+: *$/))       { attr[n] = ' align="right"'; }
            else if (s.match(/^ *:-+: *$/)) { attr[n] = ' align="center"'; }
            else if (s.match(/^ *:-+ *$/))  { attr[n] = ' align="left"'; }
            else                            { attr[n] = ''; }
        }

        // Parsing span elements, including code spans, character escapes,
        // and inline HTML tags, so that pipes inside those gets ignored.
        head = self.parseSpan(head);
        var headers = head.split(/ *[|] */);
        var col_count = headers.length;

        // Write column headers.
        var text = "<table>\n";
        text += "<thead>\n";
        text += "<tr>\n";
        for(n = 0; n < headers.length; n++) {
            var header = headers[n];
            text += "  <th" + attr[n] + ">" + self.runSpanGamut(self._php_trim(header)) + "</th>\n";
        }
        text += "</tr>\n";
        text += "</thead>\n";

        // Split content by row.
        var rows = self._php_trim(content, "\n").split("\n");

        text += "<tbody>\n";
        for(var i = 0; i < rows.length; i++) {
            var row = rows[i];
            // Parsing span elements, including code spans, character escapes,
            // and inline HTML tags, so that pipes inside those gets ignored.
            row = self.parseSpan(row);

            // Split row by cell.
            var row_cells = row.split(/ *[|] */, col_count);
            while(row_cells.length < col_count) { row_cells.push(''); }

            text += "<tr>\n";
            for(n = 0; n < row_cells.length; n++) {
                var cell = row_cells[n];
                text += "  <td" + attr[n] + ">" + self.runSpanGamut(self._php_trim(cell)) + "</td>\n";
            }
            text += "</tr>\n";
        }
        text += "</tbody>\n";
        text += "</table>";

        return self.hashBlock(text) + "\n";
    };

    text = this.__wrapSTXETX__(text);

    //
    // Find tables with leading pipe.
    //
    //	| Header 1 | Header 2
    //	| -------- | --------
    //	| Cell 1   | Cell 2
    //	| Cell 3   | Cell 4
    //
    text = text.replace(new RegExp(
        '^'                            + // Start of a line
        '[ ]{0,' + less_than_tab + '}' + // Allowed whitespace.
        '[|]'                          + // Optional leading pipe (present)
        '(.+)\\n'                      + // $1: Header row (at least one pipe)

        '[ ]{0,' + less_than_tab + '}' + // Allowed whitespace.
        '[|]([ ]*[-:]+[-| :]*)\\n'     + // $2: Header underline

        '('                            + // $3: Cells
            '(?:'                      +
                '[ ]*'                 + // Allowed whitespace.
                '[|].*\\n'             + // Row content.
            ')*'                       +
        ')'                            +
        '(?=\\n|\\x03)'                , // Stop at final double newline.
        'mg'
    ), function(match, head, underline, content) {
        // Remove leading pipe for each row.
        content = content.replace(/^ *[|]/m, '');

        return _doTable_callback.call(this, match, head, underline, content);
    });

    //
    // Find tables without leading pipe.
    //
    //	Header 1 | Header 2
    //	-------- | --------
    //	Cell 1   | Cell 2
    //	Cell 3   | Cell 4
    //
    text = text.replace(new RegExp(
        '^'                             + // Start of a line
        '[ ]{0,' + less_than_tab + '}'  + // Allowed whitespace.
        '(\\S.*[|].*)\\n'               + // $1: Header row (at least one pipe)

        '[ ]{0,' + less_than_tab + '}'  + // Allowed whitespace.
        '([-:]+[ ]*[|][-| :]*)\\n'      + // $2: Header underline

        '('                             + // $3: Cells
            '(?:'                       +
                '.*[|].*\\n'            + // Row content
            ')*'                        +
        ')'                             +
        '(?=\\n|\\x03)'                 , // Stop at final double newline.
        'mg'
    ), _doTable_callback);

    text = this.__unwrapSTXETX__(text);

    return text;
};

/**
 * Form HTML definition lists.
 */
MarkdownExtra_Parser.prototype.doDefLists = function(text) {
    var self = this;

    var less_than_tab = this.tab_width - 1;

    // Re-usable pattern to match any entire dl list:
    var whole_list_re = '(?:'     +
        '('                       + // $1 = whole list
          '('                     + // $2
            '[ ]{0,' + less_than_tab + '}' +
            '((?:[ \\t]*\\S.*\\n)+)' + // $3 = defined term
                                       // [porting note] Original regex from PHP is
                                       // (?>.*\S.*\n), which matches a line with at
                                       // least one non-space character. Change the
                                       // first .* to [ \t]* stops unneccessary
                                       // backtracking hence improves performance
            '\\n?'                +
            '[ ]{0,' + less_than_tab + '}:[ ]+' + // colon starting definition
          ')'                     +
          '([\\s\\S]+?)'          +
          '('                     + // $4
              '(?=\\0x03)'        + // \z
            '|'                   +
              '(?='               + // [porting note] Our regex will consume leading
                                    // newline characters so we will leave the newlines
                                    // here for the next definition
                '\\n{2,}'         +
                '(?=\\S)'         +
                '(?!'             + // Negative lookahead for another term
                  '[ ]{0,' + less_than_tab + '}' +
                  '(?:\\S.*\\n)+?' + // defined term
                  '\\n?'          +
                  '[ ]{0,' + less_than_tab + '}:[ ]+' + // colon starting definition
                ')'               +
                '(?!'             + // Negative lookahead for another definition
                  '[ ]{0,' + less_than_tab + '}:[ ]+' + // colon starting definition
                ')'               +
              ')'                 +
          ')'                     +
        ')'                       +
    ')'; // mx

    text = this.__wrapSTXETX__(text);
    text = text.replace(new RegExp(
        '(\\x02\\n?|\\n\\n)' +
        whole_list_re, 'mg'
    ), function(match, pre, list) {
        //console.log(match);
        // Re-usable patterns to match list item bullets and number markers:
        // [portiong note] changed to list = $2 in order to reserve previously \n\n.

        // Turn double returns into triple returns, so that we can make a
        // paragraph for the last item in a list, if necessary:
        var result = self._php_trim(self.processDefListItems(list));
        result = "<dl>\n" + result + "\n</dl>";
        return pre + self.hashBlock(result) + "\n\n";
    });
    text = this.__unwrapSTXETX__(text);

    return text;
};

/**
 * Process the contents of a single definition list, splitting it
 * into individual term and definition list items.
 */
MarkdownExtra_Parser.prototype.processDefListItems = function(list_str) {
    var self = this;

    var less_than_tab = this.tab_width - 1;

    list_str = this.__wrapSTXETX__(list_str);

    // trim trailing blank lines:
    list_str = list_str.replace(/\n{2,}(?=\\x03)/, "\n");

    // Process definition terms.
    list_str = list_str.replace(new RegExp(
        '(\\x02\\n?|\\n\\n+)'              + // leading line
        '('                                + // definition terms = $1
            '[ ]{0,' + less_than_tab + '}' + // leading whitespace
            '(?![:][ ]|[ ])'               + // negative lookahead for a definition
                                             //   mark (colon) or more whitespace.
            '(?:\\S.*\\n)+?'               + // actual term (not whitespace).
        ')'                                +
        '(?=\\n?[ ]{0,3}:[ ])'             , // lookahead for following line feed
                                             //   with a definition mark.
        'mg'
    ), function(match, pre, terms_str) {
        // [portiong note] changed to list = $2 in order to reserve previously \n\n.
        var terms = self._php_trim(terms_str).split("\n");
        var text = '';
        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            term = self.runSpanGamut(self._php_trim(term));
            text += "\n<dt>" + term + "</dt>";
        }
        return text + "\n";
    });

    // Process actual definitions.
    list_str = list_str.replace(new RegExp(
        '\\n(\\n+)?'                       + // leading line = $1
        '('                                + // marker space = $2
            '[ ]{0,' + less_than_tab + '}' + // whitespace before colon
            '[:][ ]+'                      + // definition mark (colon)
        ')'                                +
        '([\\s\\S]+?)'                     + // definition text = $3
                                             // [porting note] Maybe no trailing
                                             // newlines in our version, changed the
                                             // following line from \n+ to \n*.
        '(?=\\n*'                          + // stop at next definition mark,
            '(?:'                          + // next term or end of text
                '\\n[ ]{0,' + less_than_tab + '}[:][ ]|' + // [porting note] do not match
                                                           // colon in the middle of a line
                '<dt>|\\x03'               + // \z
            ')'                            +
        ')',
        'mg'
    ), function(match, leading_line, marker_space, def) {
        if (leading_line || def.match(/\n{2,}/)) {
            // Replace marker with the appropriate whitespace indentation
            def = self._php_str_repeat(' ', marker_space.length) + def;
            def = self.runBlockGamut(self.outdent(def + "\n\n"));
            def = "\n" + def + "\n";
        }
        else {
            def = self._php_rtrim(def);
            def = self.runSpanGamut(self.outdent(def));
        }

        return "\n<dd>"  + def + "</dd>\n";
    });

    list_str = this.__unwrapSTXETX__(list_str);

    return list_str;
};

/**
 * Adding the fenced code block syntax to regular Markdown:
 *
 * ~~~
 * Code block
 * ~~~
 */
MarkdownExtra_Parser.prototype.doFencedCodeBlocks = function(text) {
    var self = this;

    var less_than_tab = this.tab_width;

    text = this.__wrapSTXETX__(text);
    text = text.replace(new RegExp(
		'(?:\\n|\\x02)'          +
        // 1: Opening marker
		'('                      +
            '~{3,}'              + // Marker: three tilde or more.
        ')'                      +
        '[ ]*\\n'                + // Whitespace and newline following marker.

        // 2: Content
		'('                      +
			'(?:'                +
			'(?=('               +
                '(?!\\1[ ]*\\n)' + // Not a closing marker.
                '.*\\n+'         +
            '))\\3'              +
            ')+'                 +
		')'                      +

        // Closing marker.
        '\\1[ ]*\\n',
        "mg"
    ), function(match, m1, codeblock) {
        codeblock = self._php_htmlspecialchars_ENT_NOQUOTES(codeblock);
        codeblock = codeblock.replace(/^\n+/, function(match) {
            return self._php_str_repeat("<br" + self.empty_element_suffix, match.length);
        });
        codeblock = "<pre><code>" + codeblock + "</code></pre>";
        return "\n\n" + self.hashBlock(codeblock) + "\n\n";
    });
    text = this.__unwrapSTXETX__(text);

    return text;
};

/**
 * Params:
 * $text - string to process with html <p> tags
 */
MarkdownExtra_Parser.prototype.formParagraphs = function(text) {

    // Strip leading and trailing lines:
    text = this.__wrapSTXETX__(text);
    text = text.replace(/(?:\x02)\n+|\n+(?:\x03)/g, "");
    text = this.__unwrapSTXETX__(text);

    var grafs = text.split(/\n{2,}/m);
    //preg_split('/\n{2,}/', $text, -1, PREG_SPLIT_NO_EMPTY);

    //
    // Wrap <p> tags and unhashify HTML blocks
    //
    for(var i = 0; i < grafs.length; i++) {
        var value = grafs[i];
        if(value == "") {
            // [porting note]
            // This case is replacement for PREG_SPLIT_NO_EMPTY.
            continue;
        }
        value = this._php_trim(this.runSpanGamut(value));

        // Check if this should be enclosed in a paragraph.
        // Clean tag hashes & block tag hashes are left alone.
        var is_p = !value.match(/^B\x1A[0-9]+B|^C\x1A[0-9]+C$/);

        if (is_p) {
            value = "<p>" + value + "</p>";
        }
        grafs[i] = value;
    }

    // Join grafs in one text, then unhash HTML tags.
    text = grafs.join("\n\n");

    // Finish by removing any tag hashes still present in $text.
    text = this.unhash(text);

    return text;
};

// ### Footnotes

/**
 * Strips link definitions from text, stores the URLs and titles in
 * hash references.
 */
MarkdownExtra_Parser.prototype.stripFootnotes = function(text) {
    var self = this;

    var less_than_tab = this.tab_width - 1;

    // Link defs are in the form: [^id]: url "optional title"
    text = text.replace(new RegExp(
        '^[ ]{0,' + less_than_tab + '}\\[\\^(.+?)\\][ ]?:' + // note_id = $1
          '[ ]*'                       +
          '\\n?'                       + // maybe *one* newline
        '('                            + // text = $2 (no blank lines allowed)
            '(?:'                      +
                '.+'                   + // actual text
            '|'                        +
                '\\n'                  + // newlines but
                '(?!\\[\\^.+?\\]:\\s)' + // negative lookahead for footnote marker.
                '(?!\\n+[ ]{0,3}\\S)'  + // ensure line is not blank and followed
                                         // by non-indented content
            ')*'                       +
        ')',
        "mg"
    ), function(match, m1, m2) {
        var note_id = self.fn_id_prefix + m1;
        self.footnotes[note_id] = self.outdent(m2);
        return ''; //# String that will replace the block
    });
    return text;
};

/**
 * Replace footnote references in $text [^id] with a special text-token
 * which will be replaced by the actual footnote marker in appendFootnotes.
 */
MarkdownExtra_Parser.prototype.doFootnotes = function(text) {
    if (!this.in_anchor) {
        text = text.replace(/\[\^(.+?)\]/g, "F\x1Afn:$1\x1A:");
    }
    return text;
};

/**
 * Append footnote list to text.
 */
MarkdownExtra_Parser.prototype.appendFootnotes = function(text) {
    var self = this;

    var _appendFootnotes_callback = function(match, m1) {
        var node_id = self.fn_id_prefix + m1;

        // Create footnote marker only if it has a corresponding footnote *and*
        // the footnote hasn't been used by another marker.
        if (node_id in self.footnotes) {
            // Transfert footnote content to the ordered list.
            self.footnotes_ordered.push([node_id, self.footnotes[node_id]]);
            delete self.footnotes[node_id];

            var num = self.footnote_counter++;
            var attr = " rel=\"footnote\"";
            if (self.fn_link_class != "") {
                var classname = self.fn_link_class;
                classname = self.encodeAttribute(classname);
                attr += " class=\"" + classname + "\"";
            }
            if (self.fn_link_title != "") {
                var title = self.fn_link_title;
                title = self.encodeAttribute(title);
                attr += " title=\"" + title +"\"";
            }

            attr = attr.replace(/%%/g, num);
            node_id = self.encodeAttribute(node_id);

            return "<sup id=\"fnref:" + node_id + "\">" +
                "<a href=\"#fn:" + node_id + "\"" + attr + ">" + num + "</a>" +
                "</sup>";
        }

        return "[^" + m1 + "]";
    };

    text = text.replace(/F\x1Afn:(.*?)\x1A:/g, _appendFootnotes_callback);

    if (this.footnotes_ordered.length > 0) {
        text += "\n\n";
        text += "<div class=\"footnotes\">\n";
        text += "<hr" + this.empty_element_suffix  + "\n";
        text += "<ol>\n\n";

        var attr = " rev=\"footnote\"";
        if (this.fn_backlink_class != "") {
            var classname = this.fn_backlink_class;
            classname = this.encodeAttribute(classname);
            attr += " class=\"" + classname + "\"";
        }
        if (this.fn_backlink_title != "") {
            var title = this.fn_backlink_title;
            title = this.encodeAttribute(title);
            attr += " title=\"" + title + "\"";
        }
        var num = 0;

        while (this.footnotes_ordered.length > 0) {
            var head = this.footnotes_ordered.shift();
            var note_id = head[0];
            var footnote = head[1];

            footnote += "\n"; // Need to append newline before parsing.
            footnote = this.runBlockGamut(footnote + "\n");
            footnote = footnote.replace(/F\x1Afn:(.*?)\x1A:/g, _appendFootnotes_callback);

            attr = attr.replace(/%%/g, ++num);
            note_id = this.encodeAttribute(note_id);

            // Add backlink to last paragraph; create new paragraph if needed.
            var backlink = "<a href=\"#fnref:" + note_id + "\"" + attr + ">&#8617;</a>";
            if (footnote.match(/<\/p>$/)) {
                footnote = footnote.substr(0, footnote.length - 4) + "&#160;" + backlink + "</p>";
            } else {
                footnote += "\n\n<p>" + backlink + "</p>";
            }

            text += "<li id=\"fn:" + note_id + "\">\n";
            text += footnote + "\n";
            text += "</li>\n\n";
        }

        text += "</ol>\n";
        text += "</div>";
    }
    return text;
};

//### Abbreviations ###

/**
 * Strips abbreviations from text, stores titles in hash references.
 */
MarkdownExtra_Parser.prototype.stripAbbreviations = function(text) {
    var self = this;

    var less_than_tab = this.tab_width - 1;

    // Link defs are in the form: [id]*: url "optional title"
    text = text.replace(new RegExp(
        '^[ ]{0,' + less_than_tab + '}\\*\\[(.+?)\\][ ]?:' + // abbr_id = $1
        '(.*)',   // text = $2 (no blank lines allowed)
        "m"
    ), function(match, abbr_word, abbr_desc) {
        if (self.abbr_word_re != '') {
            self.abbr_word_re += '|';
        }
        self.abbr_word_re += self._php_preg_quote(abbr_word);
        self.abbr_desciptions[abbr_word] = self._php_trim(abbr_desc);
        return ''; // String that will replace the block
    });
    return text;
};

/**
 * Find defined abbreviations in text and wrap them in <abbr> elements.
 */
MarkdownExtra_Parser.prototype.doAbbreviations = function(text) {
    var self = this;

    if (this.abbr_word_re) {
        // cannot use the /x modifier because abbr_word_re may
        // contain significant spaces:
        text = text.replace(new RegExp(
            '(^|[^\\w\\x1A])'             +
            '(' + this.abbr_word_re + ')' +
            '(?![\\w\\x1A])'
        ), function(match, prev, abbr) {
            if (abbr in self.abbr_desciptions) {
                var desc = self.abbr_desciptions[abbr];
                if (!desc || desc == "") {
                    return self.hashPart("<abbr>" + abbr + "</abbr>");
                } else {
                    desc = self.encodeAttribute(desc);
                    return self.hashPart("<abbr title=\"" + desc + "\">" + abbr + "</abbr>");
                }
            } else {
                return match;
            }
        });
    }
    return text;
};


/**
 * Export to Node.js
 */
this.Markdown = Markdown;
this.Markdown_Parser = Markdown_Parser;
this.MarkdownExtra_Parser = MarkdownExtra_Parser;

/**
 * @license Rangy Inputs, a jQuery plug-in for selection and caret manipulation within textareas and text inputs.
 *
 * https://github.com/timdown/rangyinputs
 *
 * For range and selection features for contenteditable, see Rangy.

 * http://code.google.com/p/rangy/
 *
 * Depends on jQuery 1.0 or later.
 *
 * Copyright 2014, Tim Down
 * Licensed under the MIT license.
 * Version: 1.2.0
 * Build date: 30 November 2014
 */
(function($) {
    var UNDEF = "undefined";
    var getSelection, setSelection, deleteSelectedText, deleteText, insertText;
    var replaceSelectedText, surroundSelectedText, extractSelectedText, collapseSelection;

    // Trio of isHost* functions taken from Peter Michaux's article:
    // http://peter.michaux.ca/articles/feature-detection-state-of-the-art-browser-scripting
    function isHostMethod(object, property) {
        var t = typeof object[property];
        return t === "function" || (!!(t == "object" && object[property])) || t == "unknown";
    }

    function isHostProperty(object, property) {
        return typeof(object[property]) != UNDEF;
    }

    function isHostObject(object, property) {
        return !!(typeof(object[property]) == "object" && object[property]);
    }

    function fail(reason) {
        if (window.console && window.console.log) {
            window.console.log("RangyInputs not supported in your browser. Reason: " + reason);
        }
    }

    function adjustOffsets(el, start, end) {
        if (start < 0) {
            start += el.value.length;
        }
        if (typeof end == UNDEF) {
            end = start;
        }
        if (end < 0) {
            end += el.value.length;
        }
        return { start: start, end: end };
    }

    function makeSelection(el, start, end) {
        return {
            start: start,
            end: end,
            length: end - start,
            text: el.value.slice(start, end)
        };
    }

    function getBody() {
        return isHostObject(document, "body") ? document.body : document.getElementsByTagName("body")[0];
    }

    $(document).ready(function() {
        var testTextArea = document.createElement("textarea");

        getBody().appendChild(testTextArea);

        if (isHostProperty(testTextArea, "selectionStart") && isHostProperty(testTextArea, "selectionEnd")) {
            getSelection = function(el) {
                var start = el.selectionStart, end = el.selectionEnd;
                return makeSelection(el, start, end);
            };

            setSelection = function(el, startOffset, endOffset) {
                var offsets = adjustOffsets(el, startOffset, endOffset);
                el.selectionStart = offsets.start;
                el.selectionEnd = offsets.end;
            };

            collapseSelection = function(el, toStart) {
                if (toStart) {
                    el.selectionEnd = el.selectionStart;
                } else {
                    el.selectionStart = el.selectionEnd;
                }
            };
        } else if (isHostMethod(testTextArea, "createTextRange") && isHostObject(document, "selection") &&
                   isHostMethod(document.selection, "createRange")) {

            getSelection = function(el) {
                var start = 0, end = 0, normalizedValue, textInputRange, len, endRange;
                var range = document.selection.createRange();

                if (range && range.parentElement() == el) {
                    len = el.value.length;

                    normalizedValue = el.value.replace(/\r\n/g, "\n");
                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());
                    endRange = el.createTextRange();
                    endRange.collapse(false);
                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;
                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }

                return makeSelection(el, start, end);
            };

            // Moving across a line break only counts as moving one character in a TextRange, whereas a line break in
            // the textarea value is two characters. This function corrects for that by converting a text offset into a
            // range character offset by subtracting one character for every line break in the textarea prior to the
            // offset
            var offsetToRangeCharacterMove = function(el, offset) {
                return offset - (el.value.slice(0, offset).split("\r\n").length - 1);
            };

            setSelection = function(el, startOffset, endOffset) {
                var offsets = adjustOffsets(el, startOffset, endOffset);
                var range = el.createTextRange();
                var startCharMove = offsetToRangeCharacterMove(el, offsets.start);
                range.collapse(true);
                if (offsets.start == offsets.end) {
                    range.move("character", startCharMove);
                } else {
                    range.moveEnd("character", offsetToRangeCharacterMove(el, offsets.end));
                    range.moveStart("character", startCharMove);
                }
                range.select();
            };

            collapseSelection = function(el, toStart) {
                var range = document.selection.createRange();
                range.collapse(toStart);
                range.select();
            };
        } else {
            getBody().removeChild(testTextArea);
            fail("No means of finding text input caret position");
            return;
        }

        // Clean up
        getBody().removeChild(testTextArea);

        function getValueAfterPaste(el, text) {
            var val = el.value, sel = getSelection(el), selStart = sel.start;
            return {
                value: val.slice(0, selStart) + text + val.slice(sel.end),
                index: selStart,
                replaced: sel.text
            };
        }

        function pasteTextWithCommand(el, text) {
            el.focus();
            var sel = getSelection(el);

            // Hack to work around incorrect delete command when deleting the last word on a line
            setSelection(el, sel.start, sel.end);
            if (text == "") {
                document.execCommand("delete", false, null);
            } else {
                document.execCommand("insertText", false, text);
            }

            return {
                replaced: sel.text,
                index: sel.start
            };
        }

        function pasteTextWithValueChange(el, text) {
            el.focus();
            var valueAfterPaste = getValueAfterPaste(el, text);
            el.value = valueAfterPaste.value;
            return valueAfterPaste;
        }

        var pasteText = function(el, text) {
            var valueAfterPaste = getValueAfterPaste(el, text);
            try {
                var pasteInfo = pasteTextWithCommand(el, text);
                if (el.value == valueAfterPaste.value) {
                    pasteText = pasteTextWithCommand;
                    return pasteInfo;
                }
            } catch (ex) {
                // Do nothing and fall back to changing the value manually
            }
            pasteText = pasteTextWithValueChange;
            el.value = valueAfterPaste.value;
            return valueAfterPaste;
        };

        deleteText = function(el, start, end, moveSelection) {
            if (start != end) {
                setSelection(el, start, end);
                pasteText(el, "");
            }
            if (moveSelection) {
                setSelection(el, start);
            }
        };

        deleteSelectedText = function(el) {
            setSelection(el, pasteText(el, "").index);
        };

        extractSelectedText = function(el) {
            var pasteInfo = pasteText(el, "");
            setSelection(el, pasteInfo.index);
            return pasteInfo.replaced;
        };

        var updateSelectionAfterInsert = function(el, startIndex, text, selectionBehaviour) {
            var endIndex = startIndex + text.length;

            selectionBehaviour = (typeof selectionBehaviour == "string") ?
                selectionBehaviour.toLowerCase() : "";

            if ((selectionBehaviour == "collapsetoend" || selectionBehaviour == "select") && /[\r\n]/.test(text)) {
                // Find the length of the actual text inserted, which could vary
                // depending on how the browser deals with line breaks
                var normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
                endIndex = startIndex + normalizedText.length;
                var firstLineBreakIndex = startIndex + normalizedText.indexOf("\n");

                if (el.value.slice(firstLineBreakIndex, firstLineBreakIndex + 2) == "\r\n") {
                    // Browser uses \r\n, so we need to account for extra \r characters
                    endIndex += normalizedText.match(/\n/g).length;
                }
            }

            switch (selectionBehaviour) {
                case "collapsetostart":
                    setSelection(el, startIndex, startIndex);
                    break;
                case "collapsetoend":
                    setSelection(el, endIndex, endIndex);
                    break;
                case "select":
                    setSelection(el, startIndex, endIndex);
                    break;
            }
        };

        insertText = function(el, text, index, selectionBehaviour) {
            setSelection(el, index);
            pasteText(el, text);
            if (typeof selectionBehaviour == "boolean") {
                selectionBehaviour = selectionBehaviour ? "collapseToEnd" : "";
            }
            updateSelectionAfterInsert(el, index, text, selectionBehaviour);
        };

        replaceSelectedText = function(el, text, selectionBehaviour) {
            var pasteInfo = pasteText(el, text);
            updateSelectionAfterInsert(el, pasteInfo.index, text, selectionBehaviour || "collapseToEnd");
        };

        surroundSelectedText = function(el, before, after, selectionBehaviour) {
            if (typeof after == UNDEF) {
                after = before;
            }
            var sel = getSelection(el);
            var pasteInfo = pasteText(el, before + sel.text + after);
            updateSelectionAfterInsert(el, pasteInfo.index + before.length, sel.text, selectionBehaviour || "select");
        };

        function jQuerify(func, returnThis) {
            return function() {
                var el = this.jquery ? this[0] : this;
                var nodeName = el.nodeName.toLowerCase();

                if (el.nodeType == 1 && (nodeName == "textarea" ||
                        (nodeName == "input" && /^(?:text|email|number|search|tel|url|password)$/i.test(el.type)))) {
                    var args = [el].concat(Array.prototype.slice.call(arguments));
                    var result = func.apply(this, args);
                    if (!returnThis) {
                        return result;
                    }
                }
                if (returnThis) {
                    return this;
                }
            };
        }

        $.fn.extend({
            getSelection: jQuerify(getSelection, false),
            setSelection: jQuerify(setSelection, true),
            collapseSelection: jQuerify(collapseSelection, true),
            deleteSelectedText: jQuerify(deleteSelectedText, true),
            deleteText: jQuerify(deleteText, true),
            extractSelectedText: jQuerify(extractSelectedText, false),
            insertText: jQuerify(insertText, true),
            replaceSelectedText: jQuerify(replaceSelectedText, true),
            surroundSelectedText: jQuerify(surroundSelectedText, true)
        });
    });
})(jQuery);

/*global jQuery, addResizeListener*/

/*
 * Meltdown (Markup Extra Live Toolbox)
 * Version: 0.2 (??-APR-2014)
 * Requires: jQuery v1.7.2 or later (1.9.1 recommended)
 */
(function ($, window, document, undefined) {
	'use strict';

	var ver = '0.2',
		plgName = 'meltdown',
		dbg = true,
		isIE8 = document.all && !document.addEventListener,  // From: http://tanalin.com/en/articles/ie-version-js/
		jqueryRequired = [1, 8, 0],
		jqueryCurrent  = $.fn.jquery.split(' ')[0].split('.'), // first split to get rid of any amd related extras
		isOldjQuery = false,
		doc = $(document),
		body = $("body");

	for (var i = 0; i < jqueryRequired.length; i++) {
		var required = jqueryRequired[i],
				current = parseInt(jqueryCurrent[i], 10);
		if (required > current) {
			isOldQuery = true;
			break;
		} else if (current > required) {
			break;
		}
	}

	function debug(msg) {
		if (window.console && dbg) {
			window.console.log(msg);
		}
	}

	// Used to test the bottom offset of elements:
	var bottomPositionTest = $('<div style="bottom: 0;" />');

	// Helper for users that want to change the controls (For usage, see: $.meltdown.defaults.controls below)
	var controlsGroup = function(name, label, controls) {
		controls.name = name;
		controls.label = label;
		return controls;
	};

	$.meltdown = {
		version: ver,

		// Expose publicly:
		controlsGroup: controlsGroup,

		// Default meltdown options:
		defaults: {
			// Use $.meltdown.controlsGroup() to make groups and subgroups of controls.
			// The available control names come from the keys of $.meltdown.controlDefs (see below)
			controls: controlsGroup("", "", [
				"preview",
				"bold",
				"italics",
				"ul",
				"ol",
				"|",
				"table",
				controlsGroup("h", "Headers", ["h1", "h2", "h3", "h4", "h5", "h6"]),
				"|",
				controlsGroup("kitchenSink", "Kitchen Sink", [
					"link",
					"img",
					"blockquote",
					"codeblock",
					"code",
					"footnote",
					"hr"
				]),
				"fullscreen",
				"sidebyside"
			]),

			// If true, goes directly in fullscreen mode:
			fullscreen: false,

			// Should the preview be visible by default ?
			openPreview: false,

			// A CSS height or "editorHeight" or "auto" (to let the height adjust to the content).
			previewHeight: "editorHeight",

			// If true, when the preview is toggled it will (un)collapse resulting in the total height of the wrap to change.
			// Set this to false if you want the editor to expand/shrinkin the opposite way of the preview.
			// Setting this to false can be useful if you want to restrict or lock the total height.
			previewCollapses: true,

			// If true, editor and preview will be displayed side by side instead of one on the other.
			sidebyside: false,

			// If true, when the preview is fully scrolled it will stay scrolled while typing.
			// Very convenient when typing/adding text at the end of the editor.
			autoScrollPreview: true,

			// Duration of the preview toggle animation:
			previewDuration: 400,

			// The parser. The function takes a string and returns an html formatted string.
			// Set this to false to use an _identity_ function (for a direct HTML "parser").
			parser: window.Markdown
		},

		// Definitions for the toolbar controls:
		controlDefs: {
			bold: {
				label: "B",
				altText: "Bold",
				before: "**",
				after: "**"
			},
			italics: {
				label: "I",
				altText: "Italics",
				before: "*",
				after: "*"
			},
			ul: {
				label: "UL",
				altText: "Unordered List",
				preselectLine: true,
				before: "* ",
				placeholder: "Item\n* Item",
				isBlock: true
			},
			ol: {
				label: "OL",
				altText: "Ordered List",
				preselectLine: true,
				before: "1. ",
				placeholder: "Item 1\n2. Item 2\n3. Item 3",
				isBlock: true
			},
			table: {
				label: "Table",
				altText: "Table",
				before: "First Header  | Second Header\n------------- | -------------\nContent Cell  | Content Cell\nContent Cell  | Content Cell\n",
				isBlock: true
			},
			link: {
				label: "Link",
				altText: "Link",
				before: "[",
				placeholder: "Example link",
				after: "](http:// \"Link title\")"
			},
			img: {
				label: "Image",
				altText: "Image",
				before: "![Alt text](",
				placeholder: "http://",
				after: ")"
			},
			blockquote: {
				label: "Blockquote",
				altText: "Blockquote",
				preselectLine: true,
				before: "> ",
				placeholder: "Quoted text",
				isBlock: true
			},
			codeblock: {
				label: "Code Block",
				altText: "Code Block",
				preselectLine: true,
				before: "~~~\n",
				placeholder: "Code",
				after: "\n~~~",
				isBlock: true
			},
			code: {
				label: "Code",
				altText: "Inline Code",
				before: "`",
				placeholder: "code",
				after: "`"
			},
			footnote: {
				label: "Footnote",
				altText: "Footnote",
				before: "[^1]\n\n[^1]:",
				placeholder: "Example footnote",
				isBlock: true
			},
			hr: {
				label: "HR",
				altText: "Horizontal Rule",
				before: "----------",
				placeholder: "",
				isBlock: true
			},
			fullscreen: {
				label: "Fullscreen",
				altText: "Toggle fullscreen",
				click: function(meltdown /*, def, control, execAction */) {
					meltdown.toggleFullscreen();
				}
			},
			sidebyside: {
				label: "Sidebyside",
				altText: "Toggle sidebyside",
				click: function(meltdown /*, def, control, execAction */) {
					meltdown.toggleSidebyside();
				}
			},
			preview: {
				label: "Preview",
				altText: "Toggle preview",
				click: function(meltdown /*, def, control, execAction */) {
					meltdown.togglePreview();
				}
			}
		}
	};

	// Add h1...h6 control definitions to $.meltdown.controlDefs:
	(function(controlDefs) {
		for (var pounds = "", i = 1; i <= 6; i++) {
			pounds += "#";
			controlDefs['h' + i] = {
				label: "H" + i,
				altText: "Header " + i,
				preselectLine: true,
				before: pounds + " "
			};
		}
	})($.meltdown.controlDefs);


	function addControlEventHandler(meltdown, def, control) {
		var editor = meltdown.editor,
			execAction = function () {
				var text = editor.val(),
					selection = editor.getSelection(),
					before = def.before || "",
					placeholder =  def.placeholder || "",
					after = def.after || "";

				// Extend selection if needed:
				if (def.preselectLine) {
					var lineStart = text.lastIndexOf('\n', selection.start) + 1,
						lineEnd = text.indexOf('\n', selection.end);

					if (lineEnd === -1) {
						lineEnd = text.length;
					}
					editor.setSelection(lineStart, lineEnd);
					selection = editor.getSelection();
				}

				// placeholder is only used if there is no selected text:
				if (selection.length > 0) {
					placeholder = selection.text;
				}

				// isBlock means that there should be empty line before and after the selection:
				if (def.isBlock) {
					for (var i = 0; i < 2; i++) {
						var charBefore = text.charAt(selection.start - 1 - i),
							charAfter = text.charAt(selection.end + i);

						if (charBefore !== "\n" && charBefore !== "") {
							before = "\n" + before;
						}
						if (charAfter !== "\n" && charAfter !== "") {
							after = after + "\n";
						}
					}
				}

				// Insert placeholder:
				if (selection.text !== placeholder) {
					editor.replaceSelectedText(placeholder, "select");
				}
				// Insert before and after selection:
				editor.surroundSelectedText(before, after, "select");
			};

		control.click(function (e) {
			if (!control.hasClass('disabled')) {
				if (def.click) {
					def.click(meltdown, def, control, execAction);
				} else {
					execAction();
				}
				meltdown.update();
			}
			editor.focus();
			e.preventDefault();
		});
	}

	function addGroupClickHandler(control) {
		control.on('click', function () {
			control.siblings('li').removeClass(plgName + '_controlgroup-open').children('ul').hide();
			control.toggleClass(plgName + '_controlgroup-open').children('ul').toggle();
		});
	}

	function buildControls(meltdown, controlsGroup, subGroup) {
		var controlList = $('<ul />');
		if (subGroup) {
			controlList.css("display", "none");
			controlList.addClass(plgName + "_controlgroup-" + controlsGroup.name + " " + plgName + '_controlgroup-dropdown');
		} else {
			controlList.addClass("meltdown_controls");
		}

		for (var i = 0; i < controlsGroup.length; i++) {
			var controlName = controlsGroup[i],
				control = $('<li />'),
				span = $('<span />').appendTo(control);
			if ($.type(controlName) === "string") {
				if (controlName === "|") {	// Separator
					controlList.append(control.addClass(plgName + '_controlsep ' + plgName + '_controlbutton'));
					continue;
				}
				var def = $.meltdown.controlDefs[controlName];
				if (def === undefined) {
					debug("Control not found: " + controlName);
					continue;
				}
				control.addClass(plgName + "_control-" + controlName + " " + plgName + '_control ' + plgName + '_controlbutton ' + (def.styleClass || ""));
				span.text(def.label).attr("title", def.altText);
				addControlEventHandler(meltdown, def, control);

			} else if ($.isArray(controlName)) {
				control.addClass(plgName + "_controlgroup-" + controlName.name + " " + plgName + '_controlgroup ' + plgName + '_controlbutton');
				span.text(controlName.label).append('<i class="meltdown-icon-caret-down" />');
				addGroupClickHandler(control);
				control.append(buildControls(meltdown, controlName, true));
			}
			controlList.append(control);
		}

		return controlList;
	}

	function addWarning(meltdown, element) {
		element.click(function(e) {
			var warning = $('<div class"' + plgName + '_warning"/>').html('<center><b>The preview area is a tech preview feature</b></center><br/>'
				 + 'Live previews <b>can</b> cause the browser tab to stop responding.<br/><br/>'
				 + 'There is a <a target="_blank" href="https://github.com/iphands/Meltdown/issues/1">known issue</a> with <a target="_blank" href="https://github.com/tanakahisateru/js-markdown-extra#notice">one of the libraries</a> used to generate the live preview.<br/><br/>'
				 + 'This warning will be removed when the issue is resolved.<br/><br/>'
				 + '<center><i>Click to continue.</i></center>').css({background: "#fdd", cursor: "pointer"});
			warning.on("click", function(e) {
				if (!$(e.target).is("a, a *")) {	// Ignore clicks on links
					meltdown.update(true);
				}
			});
			meltdown.preview.empty().append(warning);
			e.preventDefault();
		});
	}

	// Setup event handlers for the resize handle:
	function setupResizeHandle(resizeHandle, firstElem, lastElem, vertical, meltdown) {
		resizeHandle.addClass("meltdown_resizehandle-" + (vertical ? "vert" : "horiz"));
		var propName = vertical ? "height" : "width",
			pageName = vertical ? "pageY" : "pageX",
			lastEditorPercentName = vertical ? "lastEditorPercentHeight" : "lastEditorPercentWidth",
			minSize = vertical ? 15 : 60;

		var startPos, minPos, maxPos, originalFirstElemSize, originalLastElemSize,
			moveEventHandler = function(e) {
				var delta = Math.min(Math.max(e[pageName] , minPos), maxPos) - startPos,
					firstElemSize = originalFirstElemSize + delta,
					lastElemSize = originalLastElemSize - delta;
				firstElem[propName](firstElemSize);
				lastElem[propName](lastElemSize);
				if (!vertical) {
					firstElem[0].style.maxWidth = firstElemSize + "px";
					lastElem[0].style.maxWidth = lastElemSize + "px";
				}

				var editorElem = vertical ? meltdown.editor[0] : meltdown.editorWrap[0],
					editorSize = firstElem[0] === editorElem ? firstElemSize : lastElemSize;
				meltdown[lastEditorPercentName] = editorSize / (firstElemSize + lastElemSize);
			};

		// Init dragging handlers only on mousedown:
		resizeHandle.on("mousedown", function(e) {
			if (meltdown.isSidebyside() === vertical) {
				return;
			}
			// Sort elems in document order:
			var elems = firstElem.add(lastElem);
			// The first elem is assumed to be before resizeHandle, and the last is after:
			firstElem = elems.first();
			lastElem = elems.last();

			// Init dragging properties:
			startPos = e[pageName];
			originalFirstElemSize = firstElem[propName]();
			originalLastElemSize = lastElem[propName]();
			minPos = startPos - originalFirstElemSize + minSize;
			maxPos = startPos + originalLastElemSize - minSize;

			// Setup event handlers:
			doc.on("mousemove", moveEventHandler).one("mouseup", function() {
				doc.off("mousemove", moveEventHandler);
				body.removeClass("unselectable");
				meltdown.editor.focus();
			});
			// Prevent text selection while dragging:
			body.addClass("unselectable");
		});
	}

	function debounce(func, wait, returnValue) {
		var context, args, timeout,
			exec = function() {
				func.apply(context, args);
			};
		return function() {
			context = this;
			args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(exec, wait);
			return returnValue;
		};
	}

	// Return true, false or undefined.
	// If newState is undefined or not a boolean, return !state (this is the toggle action)
	// If newState === state, return newState or if force, return undefined (to tell that no state change is required)
	function checkToggleState(newState, state, force) {
		if (newState !== true && newState !== false) {
			return !state;
		}
		if (newState === state) {
			return force ? newState : undefined;
		}
		return newState;
	}

	function splitSize(availableSize, firstPercentSize, minSize) {
		var firstSize = Math.round(firstPercentSize * availableSize),
			lastSize = availableSize - firstSize;
		if (firstSize < minSize) {
			lastSize -= minSize - firstSize;
			firstSize = minSize;
		} else if (lastSize < minSize) {
			firstSize -= minSize - lastSize;
			lastSize = minSize;
		}
		return {firstSize: firstSize, lastSize: lastSize};
	}


	// Meltdown base class:
	var Meltdown = $.meltdown.Meltdown = function(elem) {
			this.element = $(elem);
		};

	// The Meltdown methods.
	// Methods are publicly available: elem.meltdown("methodName", args...)
	$.meltdown.methods = $.extend(Meltdown.prototype, {
		_init: function(userOptions) {
			var self = this,
				_options = this._options = $.extend({}, $.meltdown.defaults, userOptions);

			this._lastUpdateText = "";

			// If parser is false, use a HTML parser (ie. directly use the text as the HTML source)
			this.parser = _options.parser || function(text) {
				return text;
			};

			this.editorPreInitOuterWidth = this.element.outerWidth();

			// Setup everything detached from the document:
			this.wrap = $('<div class="' + plgName + '_wrap previewopen" />');
			this.topmargin = $('<div class="' + plgName + '_topmargin"/>').appendTo(this.wrap);
			this.bar =  $('<div class="meltdown_bar"></div>').appendTo(this.wrap);
			this.editorWrap =  $('<div class="' + plgName + '_editor-wrap" />').appendTo(this.wrap);
			this.editorDeco =  $('<div class="' + plgName + '_editor-deco" />').appendTo(this.editorWrap);
			this.editor = this.element.addClass("meltdown_editor");
			this.previewWrap =  $('<div class="' + plgName + '_preview-wrap" />').appendTo(this.wrap);
			this.resizeHandle = $('<div class="' + plgName + '_resizehandle"><span></span></div>').appendTo(this.previewWrap);
			this.previewHeader =  $('<span class="' + plgName + '_preview-header">Preview Area (<a class="meltdown_techpreview" href="https://github.com/iphands/Meltdown/issues/1">Tech Preview</a>)</span>').appendTo(this.previewWrap);
			this.preview =  $('<div class="' + plgName + '_preview" />').appendTo(this.previewWrap);
			this.bottommargin = $('<div class="' + plgName + '_bottommargin"/>').appendTo(this.wrap);

			// Setup meltdown sizes:
			this.wrap.outerWidth(this.editorPreInitOuterWidth);	// jQuery 1.8+ (undocumented: http://bugs.jquery.com/ticket/10877)
			if (isOldjQuery) this.wrap.width(this.editorPreInitOuterWidth);	// Good enough.
			var previewHeight = _options.previewHeight;
			if (previewHeight === "editorHeight") {
				previewHeight = this.editor.height();
			}
			this.preview.height(previewHeight);

			// Build toolbar:
			this.controls = buildControls(this, _options.controls).appendTo(this.bar);
			addWarning(this, this.previewHeader.find(".meltdown_techpreview"));

			// editorDeco's CSS need a bit of help:
			this.editor.focus(function() {
				self.editorDeco.addClass("focus");
			}).blur(function() {
				self.editorDeco.removeClass("focus");
			});

			// Need to put a div in the wrap to allow absolute positioning for child elements.
			// Bug in FF < 31: https://bugzilla.mozilla.org/show_bug.cgi?id=63895
			this.previewWrap2 = $('<div class="' + plgName + '_preview-wrap2"></div>').appendTo(this.previewWrap);
			this.previewWrap2.append(this.resizeHandle, this.previewHeader, this.preview);
			setupResizeHandle(this.resizeHandle, this.editor, this.preview, true, this);
			setupResizeHandle(this.resizeHandle, this.editorWrap, this.previewWrap, false, this);

			// Setup update:
			this.debouncedUpdate = debounce(this.update, 350, this);
			this.editor.on('keyup', $.proxy(this.debouncedUpdate, this));

			// Store datas needed by fullscreen mode:
			this.fullscreenData = {};

			// Insert meltdown in the document:
			this.editor.after(this.wrap).appendTo(this.editorDeco);
			this._checkToolbarOverflowedControls();

			// Setup display state (preview open and _heightsManaged):
			this._previewCollapses = _options.previewCollapses;
			this.togglePreview(true, 0, true, !_options.openPreview);	// Do not update the preview if !_options.openPreview
			if (!this.isPreviewCollapses() && _options.previewHeight === "auto") {
				this.preview.height("+=0");	// If !_previewCollapses, we cannot have a dynamic height.
			}
			this._checkHeightsManaged("", undefined, true);	// Set CSS height of wrap.

			// Define the wrap min height from the editor and the preview min heights:
			var wrapHeight = this.wrap.height(),
				minWrapHeights = parseFloat(this.editor.css("minHeight")) + parseFloat(this.preview.css("minHeight")),
				editorHeight = this.editor.height();
			previewHeight = this.preview.height();
			this.wrap.css("minHeight", wrapHeight - editorHeight - previewHeight + minWrapHeights);

			// Setup editor and preview resizing when wrap is resized:
			this.lastWrapWidth = this.wrap.width();
			this.lastWrapHeight = wrapHeight;
			this.lastEditorPercentWidth = 0.5;
			this.lastEditorPercentHeight = editorHeight / (editorHeight + previewHeight);
			addResizeListener(this.wrap[0], $.proxy(this._wrapResizeListener, this));

			// Now that all measures were made, we can close the preview if needed:
			if (!_options.openPreview) {
				this.togglePreview(false, 0);
			}
			// And set the sidebyside and fullscreen modes:
			this.toggleSidebyside(_options.sidebyside, true);
			if (_options.fullscreen) {
				this.toggleFullscreen(_options.fullscreen);
			}

			return this;	// Chaining
		},
		options: function(name, value) {
			if (arguments.length === 1) {
				return this._options[name];
			} else if (arguments.length > 1) {
				this._options[name] = value;
				return this;	// Chaining
			}
		},
		update: function(force) {
			return this.updateWith(this.editor.val(), force);
		},
		updateWith: function(text, force) {
			if (force === true || (this.isPreviewOpen() && text !== this._lastUpdateText)) {
				// If the preview is scrolled to the bottom, keept it scrolled after update:
				var previewNode = this.preview[0],
					scrolledToBottom = previewNode.scrollHeight - previewNode.scrollTop === previewNode.clientHeight;
				this.preview.html(this.parser(text));
				if (scrolledToBottom) {
					previewNode.scrollTop = previewNode.scrollHeight;
				}
				this._lastUpdateText = text;
			}
			return this;	// Chaining
		},
		isPreviewOpen: function() {
			return this.wrap.hasClass("previewopen");
		},
		togglePreview: function(open, duration, force, noUpdate) {
			open = checkToggleState(open, this.isPreviewOpen(), force);
			if (open === undefined) {
				return this;	// Chaining
			}
			if (duration === undefined) {
				duration = this._options.previewDuration;
			}

			// Function to resize the editor when the preview is resized:
			var self = this,
				editorHeight = this.editor.height(),
				previewWrapHeightStart = open ? 0 : this.previewWrap.outerHeight(),
				availableHeight = editorHeight + previewWrapHeightStart,
				progress = this._isHeightsManaged() ? function(/* animation, progress */) {
					self.editor.height(availableHeight - self.previewWrap.outerHeight());
				} : $.noop,
				editorWrapWidth = this.editorWrap.width(),
				previewWrapWidth = open ? 0 : this.previewWrap.width(),
				sidebysideStep = function (now /*, fx */) {
					self.previewWrap[0].style.maxWidth = now + "px";
					var newEditorWrapWidth = editorWrapWidth + (previewWrapWidth - now);
					self.editorWrap.width(newEditorWrapWidth);
					self.editorWrap[0].style.maxWidth = newEditorWrapWidth + "px";
				},
				unsetPreviewWrapDisplay = function() {
					self.previewWrap.css("display", "");
				};

			if (open) {
				this.wrap.addClass("previewopen");
				if (!noUpdate) {
					this.update();
				}
				if (this.isSidebyside()) {
					this.previewWrap.stop().animate({
						width: "show"
					}, {
						duration: duration,
						step: sidebysideStep,
						start: function(fx) {	// jQuery 1.8+
							var sizes = splitSize(self.wrap.width(), self.lastEditorPercentWidth, 60);
							fx.tweens[0].end = sizes.lastSize;
							unsetPreviewWrapDisplay();	// Why jQuery sets this to "block" ?
						},
						complete: unsetPreviewWrapDisplay	// Why jQuery sets this to "block" ?
					});
				} else {
					var previewWrapHeightUsed = this.previewWrap.outerHeight();
					// Check that preview is not too big:
					if (this._heightsManaged && previewWrapHeightUsed > editorHeight - 15) {
						this.preview.height("-=" + (previewWrapHeightUsed - (editorHeight - 15)));
					}
					if (!isOldjQuery) {
						this.previewWrap.stop().slideDown({
							duration: duration,
							progress: progress,	// jQuery 1.8+
							start: unsetPreviewWrapDisplay,	// Why jQuery sets this to "block" ?	// jQuery 1.8+
							complete: unsetPreviewWrapDisplay	// Why jQuery sets this to "block" ?
						});
					} else {
						if (this._heightsManaged) {
							this.editor.height("-=" + previewWrapHeightUsed);
						}
						this.previewWrap.stop().show();
						unsetPreviewWrapDisplay();	// Why jQuery sets this to "block" ?
					}
				}
			} else {
				if (this.isSidebyside()) {
					this.previewWrap.stop().animate({
						width: "hide"
					}, {
						duration: duration,
						step: sidebysideStep,
						complete: function() {
							self.previewWrap.css("max-width", "");
						}
					});
				} else {
					if (!isOldjQuery && this.previewWrap.is(":visible") && duration > 0) {	// slideUp() doesn't work on hidden elements.
						this.previewWrap.stop().slideUp({
							duration: duration,
							progress: progress	// jQuery 1.8+
						});
					} else {
						this.previewWrap.stop().hide();
						if (this._heightsManaged) {
							this.editor.height(availableHeight);
						}
					}
				}
				this.wrap.removeClass("previewopen");
			}

			return this;	// Chaining
		},
		isFullscreen: function() {
			return this.wrap.hasClass('fullscreen');
		},
		toggleFullscreen: function(full) {
			full = checkToggleState(full, this.isFullscreen());
			if (full === undefined) {
				return this;	// Chaining
			}

			var data = this.fullscreenData;
			if (full) {
				data.originalWrapHeight = this.wrap.height();
				data.availableHeight = this.editor.height() + this.preview.height();
				// Keep height in case it is "auto" or "" or whatever:
				data.originalWrapStyleHeight = this.wrap[0].style.height;
				this._checkHeightsManaged("fullscreen", true);

				this.wrap.addClass('fullscreen');
				var self = this;
				doc.on("keypress." + plgName + ".fullscreenEscKey", function(e) {
					if (e.keyCode === 27) {	// Esc key
						self.toggleFullscreen(false);
					}
				});
			} else {
				doc.off("keypress." + plgName + ".fullscreenEscKey");
				this.wrap.removeClass('fullscreen');

				if (this._isHeightsManaged()) {
					this._adjustHeights(data.originalWrapHeight);
					this.lastWrapHeight = data.originalWrapHeight;
				} else {
					var sizes = splitSize(data.availableHeight, this.lastEditorPercentHeight, 15);
					this.editor.height(sizes.firstSize);
					this.preview.height(sizes.lastSize);
				}
				this._checkHeightsManaged("fullscreen", false);
				this.wrap[0].style.height = data.originalWrapStyleHeight;
			}
			this._wrapResizeListener();

			return this;	// Chaining
		},
		isSidebyside: function() {
			return this.wrap.hasClass('sidebyside');
		},
		toggleSidebyside: function(sidebyside, force) {
			sidebyside = checkToggleState(sidebyside, this.isSidebyside(), force);
			if (sidebyside === undefined) {
				return this;	// Chaining
			}

			var isPreviewOpen = this.isPreviewOpen(),
				originalBottommarginTop = this.bottommargin.offset().top;
			if (sidebyside) {
				this.wrap.addClass("sidebyside");
				this._adjustWidths(this.wrap.width());
				if (!isPreviewOpen) {
					this.togglePreview(true, 0, false, true);
				}
				var editorBottom = bottomPositionTest.appendTo(this.editorWrap).offset().top,
					previewBottom = bottomPositionTest.appendTo(this.previewWrap).offset().top;
				bottomPositionTest.detach();
				if (!isPreviewOpen) {
					this.togglePreview(false, 0, false, true);
				}
				var diffHeights = editorBottom - previewBottom;
				this.preview.height("+=" + diffHeights);

				var deltaWrapHeight = originalBottommarginTop - this.bottommargin.offset().top;
				this.editor.height("+=" + deltaWrapHeight);
				this.preview.height("+=" + deltaWrapHeight);
				this._checkHeightsManaged("sidebyside", true);
			} else {
				if (!isPreviewOpen) {
					this.togglePreview(true, 0, false, true);
				}
				var originalWrapHeight = this.wrap.height();
				this.editorWrap.css("width", "");
				this._checkHeightsManaged("sidebyside", false);
				this.editorWrap.css({width: "", maxWidth: ""});
				this.previewWrap.css({width: "", maxWidth: ""});
				this.wrap.removeClass("sidebyside");

				var deltaBottommarginTop = this.bottommargin.offset().top - originalBottommarginTop;
				this.lastWrapHeight = originalWrapHeight + deltaBottommarginTop;
				this._adjustHeights(originalWrapHeight);
				this.lastWrapHeight = originalWrapHeight;
				if (!isPreviewOpen) {
					this.togglePreview(false, 0, false, true);
				}
			}

			return this;	// Chaining
		},
		isPreviewCollapses: function() {
			return this._previewCollapses;
		},
		togglePreviewCollapses: function(previewCollapses, force) {
			previewCollapses = checkToggleState(previewCollapses, this._previewCollapses, force);
			if (previewCollapses === undefined) {
				return this;	// Chaining
			}

			this._previewCollapses = previewCollapses;
			this._checkHeightsManaged();

			return this;	// Chaining
		},
		_isHeightsManaged: function() {
			return this._heightsManaged;
		},
		_toggleHeightsManaged: function(manage, force) {
			manage = checkToggleState(manage, this._heightsManaged, force);
			if (manage === undefined) {
				return this;	// Chaining
			}

			if (manage) {
				this.wrap.height("+=0").addClass("heightsManaged");
			} else {
				this.wrap.height("auto").removeClass("heightsManaged");
			}
			this._heightsManaged = manage;

			return this;	// Chaining
		},
		_checkHeightsManaged: function(change, value, force) {
			var previewCollapses = change === "previewCollapses" ? value : this._previewCollapses,
				fullscreen = change === "fullscreen" ? value : this.isFullscreen(),
				sidebyside = change === "sidebyside" ? value : this.isSidebyside(),
				manage = !previewCollapses || fullscreen || sidebyside;
			if (force || manage !== this._heightsManaged) {
				this._toggleHeightsManaged(manage, force);
			}
		},
		_wrapResizeListener: function() {
			var newWidth = this.wrap.width(),
				newHeight = this.wrap.height();
			if (newWidth !== this.lastWrapWidth) {
				this._checkToolbarOverflowedControls();
				this._adjustWidths(newWidth);
				this.lastWrapWidth = newWidth;
			}
			if (newHeight !== this.lastWrapHeight) {
				if (this._heightsManaged) {
					this._adjustHeights(newHeight);
				} else {
					var editorHeight = this.editor.height();
					this.lastEditorPercentHeight = editorHeight / (editorHeight + this.preview.height());
				}
				this.lastWrapHeight = newHeight;
			}
		},
		// When the wrap height changes, this will resize the editor and the preview,
		// keeping the height ratio between them.
		_adjustHeights: function(wrapHeight) {
			// To avoid document reflow, we only set the values at the end.
			var sizes;
			if (this.isSidebyside()) {
				var deltaHeight = wrapHeight - this.lastWrapHeight;
				sizes = {
					firstSize: this.editor.height() + deltaHeight,
					lastSize: this.preview.height() + deltaHeight
				};
			} else {
				var isPreviewOpen = this.isPreviewOpen(),
					editorHeight = this.editor.height(),
					previewHeight = isPreviewOpen ? this.preview.height() : 0,
					availableHeight = editorHeight + previewHeight + (wrapHeight - this.lastWrapHeight);
				sizes = splitSize(availableHeight, this.lastEditorPercentHeight, 15);
				if (!isPreviewOpen) {
					// Keep the previewHeight for when the preview will slide down again.
					// But allow editorHeight to take the whole available height:
					sizes.firstSize = editorHeight + (wrapHeight - this.lastWrapHeight);
				}
			}
			this.editor.height(sizes.firstSize);
			this.preview.height(sizes.lastSize);

			return this;	// Chaining
		},
		_adjustWidths: function(wrapWidth) {
			if (this.isSidebyside()) {
				var sizes = splitSize(wrapWidth, this.lastEditorPercentWidth, 60);
				if (!this.isPreviewOpen()) {
					sizes.firstSize += sizes.lastSize;
				}
				this.editorWrap.width(sizes.firstSize);
				this.previewWrap.width(sizes.lastSize);
				this.editorWrap[0].style.maxWidth = sizes.firstSize + "px";
				this.previewWrap[0].style.maxWidth = sizes.lastSize + "px";
			}

			return this;	// Chaining
		},
		// Call this to manage controls that are overflowing the toolbar
		// when its width changes:
		_checkToolbarOverflowedControls: function() {
			var controls = this.controls.children(),
				control = $(controls[0]),
				defaultTop = control.position().top,
				foundOverflowed = false;

			// First we look for overflowed controls:
			for (var i = controls.length - 1; i > 1; i--) {
				control = $(controls[i]);
				if (control.hasClass("overflowedControl")) {
					continue;
				}
				else if (control.position().top <= defaultTop) {
					break;
				}
				control.addClass("overflowedControl");
				foundOverflowed = true;
			}

			// If no new overflowed control was found,
			// then look for controls that are no more overflowed:
			if (!foundOverflowed) {
				for (; i < controls.length; i++) {
					control = $(controls[i]);
					if (!$(controls[i]).hasClass("overflowedControl")) {
						continue;
					}
					// Test if it would overflow:
					control.removeClass("overflowedControl");
					if (control.position().top > defaultTop) {
						control.addClass("overflowedControl");
						break;
					}
				}
			}

			return this;	// Chaining
		}
	});

	// THE $(...).meltdown() function:
	// Inspired by: http://api.jqueryui.com/jQuery.widget/
	$.fn.meltdown = function (arg) {
		// Get method name and method arguments:
		var methodName = $.type(arg) === "string" ? arg : "_init",
			args = Array.prototype.slice.call(arguments, methodName === "_init" ? 0 : 1);

		// Dispatch method call:
		for (var elem, meltdown, returnValue, i = 0; i < this.length; i++) {
			elem = this[i];
			// Get the Meltdown object or create it:
			meltdown = $.data(elem, "Meltdown");
			if (methodName === "_init") {
				if (meltdown) continue;	// Don't re-create it.
				meltdown = new Meltdown(elem);
				$.data(elem, "Meltdown", meltdown);
			}
			// Call the method:
			returnValue = meltdown[methodName].apply(meltdown, args);
			// If the method is a getter, return the value
			// (See: http://bililite.com/blog/2009/04/23/improving-jquery-ui-widget-getterssetters/)
			if (returnValue !== meltdown) {
				return returnValue;
			}
		}

		return this;	// Chaining
	};


	if (isIE8||true) {
		// Fixing the textarea deselection on click:
		// (http://stackoverflow.com/questions/3558939/javascript-get-selected-text-from-textarea-in-ie8)
		var oldBuildControls = buildControls;
		buildControls = function() {
			var ret = oldBuildControls.apply(this, arguments);
			ret.find("span").attr("unselectable", "on");
			return ret;
		};
	}

	if (isOldjQuery) {
		$.meltdown.controlDefs.sidebyside.styleClass = "disabled";
		$.meltdown.controlDefs.sidebyside.altText = "Disabled: requires jQuery 1.8+";
		Meltdown.prototype.toggleSidebyside = function() {
			debug("Requires jQuery 1.8+");
			return this;
		};
	}

}(jQuery, window, document));
