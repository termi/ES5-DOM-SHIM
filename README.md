
# ES5 and DOM4 shim for all browsers with IE6 and IE7 support
based on:

- https://github.com/kriskowal/es5-shim
- https://github.com/paulmillr/es6-shim
- https://github.com/Raynos/DOM-shim

__Status__: Stable Beta

* [__Simple Demo__](http://h123.ru/-/examples/ES6-DOM4-SHIM/simple/) Try it in IE7 (or in IE6 ¬_¬)! And take a look at the source
* [__Complex Demo__](http://h123.ru/-/examples/ES6-DOM4-SHIM/parallax/) Not working in IE6 due lack of CSS

## Goal

 - Normalizing the JS and DOM across all browsers
 - Less code (eg less closures, reusable functions) & file size
 - IE6+ support
 - Include all we need from ES5, ES6 and DOM shim in one file
 - Powerful customisation

## Brief

 - Add methods such [add/remove]EventListener, querySelector[All], setSelectionRange, etc in IE6+
 - Add Element/Node properties such classList, children, [first/last]ElementChild, reversed, control, labels, etc in IE6+
 - Add methods such insertAdjacentHTML (old FF), stopImmediatePropagation  (Opera < 12) and properties reversed, control, labels, etc in W3C browsers
 - Add ES5/6 methods in all browsers
 - Add DOM4 methods append, prepend, after, before, replace, remove, match in all browsers
 - Provide bugs fixing for DOM and ES in IE, Opera, Chrome, FF
 - and more

## Cost
 - For W3C browsers: ~8KiB gziped
 - For IE8: ~16KiB gziped
 - For IE6/7: ~18KiB gziped

## Caution !!!

 - This lib is not about performance in IE < 9
 - The a.ielt8.htc requests should respond with the mime type "text/x-component"
 - That's all cautions
 
## Installation
 - For modern browsers:
  Add main script in `head` section
  
            <script src="a.js"></script>
			
 - For IE8 support:
			
  1. First[!] add `a.ie8.js` in `head` section
  
            <!--[if IE 8]>
			<script src="a.ie8.js"></script>
			<![endif]-->
			
  2. Add `a.js` in `head` section
  
            <script src="a.js"></script>

 - For IE6 and IE7, and IE8 support:			
  1. Add `a.ie8.js` and `a.ielt8.js`, `a.js` in `head` section
  
			<!--[if lt IE 8]>
			<script src="a.ielt8.js"></script>
			<![endif]-->
            <!--[if IE 8]>
			<script src="a.ie8.js"></script>
			<![endif]-->
			<script src="a.js"></script>
			
  2. Put `a.ielt8.htc` to the root of your site

## EXSTRAS

(pseudocode)

IF \_\_GCC\_\_INCLUDE\_EXTRAS\_\_ == false -> Broken Object.defineProperty and Object.defineProperties will be deleted

IF \_\_GCC\_\_INCLUDE\_EXTRAS\_\_ == true ->

 - Exporting these objects to global (window)
	1. browser
	2. DOMStringCollection
	3. XHR from https://github.com/Raynos/xhr with customisations
 - Extending objects
	1. Object.append(object, donor, [donor2, ...])
	2. Object.extend(object, donor, [donor2, ...]) (Object.append with overwrite exists properties)
	3. Object.inherits(Child, Parent)
	4. Array.prototype.unique()
	5. String.random(length)

Note: if you don't need Extras set [GCC](https://developers.google.com/closure/compiler/) flag **\_\_GCC\_\_INCLUDE\_EXTRAS\_\_** to **false** in a.js and recompile a.js using [Google Closure Compiler](closure-compiler.appspot.com/home) \([GCC online](closure-compiler.appspot.com/home)\)

## Customisation
In addition to **\_\_GCC\_\_INCLUDE\_EXTRAS\_\_** [GCC](https://developers.google.com/closure/compiler/) flag there are a bunch of over flags to enable/disable ES5/6 and DOM3/4 shims in a.js file. After set flags you need to recompile a.js using [Google Closure Compiler](closure-compiler.appspot.com/home) \([GCC online](closure-compiler.appspot.com/home)\)

## DEBUG

If [GCC](https://developers.google.com/closure/compiler/) flag **\_\_GCC\_\_IS\_DEBUG\_\_** == **true** -> Console fix from https://github.com/theshock/console-cap/blob/master/console.js
 
## IE < 8 Same-domain limitation

IE requires that the .htc behavior file must be in the same domain as the HTML page which uses it. If you try to load the behavior from a different domain, you will get an "Access Denied" error.
Note that the domain must be exactly the same; that means that http://www.foo.com is a different domain than http://foo.com.
http://css3pie.com/documentation/known-issues/#x-domain

### IE < 8 Solve Same-domain limitation
Russian instruction in extra/SameDomainLimitation.SOLVE_RUS.odt

## Temporary testing
http://jsperf.com/es5-dom-shim-test

## Known issues:
0. Lack of test cases
1. Same-domain limitation (can be solve only on server) for IE < 8
2. Incompatibility with http://code.google.com/p/ie7-js/ [working on it]

## TODO
1. Tests
2. http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html (https://gist.github.com/1384398 & https://gist.github.com/1235332)

## License

    MIT
