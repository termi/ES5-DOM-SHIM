
# ES5 and DOM4 shim for all browsers with IE6 and IE7 support
based on:

- https://github.com/kriskowal/es5-shim
- https://github.com/paulmillr/es6-shim
- https://github.com/Raynos/DOM-shim

__Status__: Beta   
[__Demo__](http://h123.ru/ES5-DOM-SHIM/simple/index.html) Try it in IE7 (or in IE6 ¬_¬)! And take a look at the source

## Goal

 - Normalizing the JS and DOM across all browsers
 - Less code (eg less closures, reusable functions) & file size
 - IE6+ support
 - Include all we need from ES5, ES6 and DOM shim in one file
 - some extra stuff (if you don't need it, use `a.noextras.js` instead of `a.js`)

## Caution !!!

 - This lib is not about performance in IE < 9
 - That's all cautions
 
## Install `(Note: if you don't need EXSTRAs use a.noexstras.js instead of a.js)`
 - For modern browsers:
  - Add main script in `head` section
  
            <script src="a.js"></script>
			
 - For IE8 support:
			
  1. First[!] add `a.ie8.js` in `head` section
  
            <!--[if lt IE 9]>
			<script src="a.ie8.js"></script>
			<![endif]-->
			
  2. Add `a.js` in `head` section
  
            <script src="a.js"></script>

 - For IE6 and IE7 support:			
  1. Add `a.ie8.js` and `a.ielt8.js`, `a.js` in `head` section
  
            <!--[if lt IE 9]>
			<script src="a.ie8.js"></script>
			<![endif]-->
			<!--[if lt IE 8]>
			<script src="a.ielt8.js"></script>
			<![endif]-->
			<script src="a.js"></script>
			
  2. Put `a.ielt8.htc` and `a.ie6.ielt8.htc` to the root of your site
 
## EXSTRAs
1. Exporting "browser" object to global
2. Exporting Utils.Dom.DOMStringCollection to global
3. Array.prototype.unique
4. Element.prototype.insertAfter
5. global.SendRequest -> ajax
6. global.forEach(<Object | Array>, iterator, context). if `iterator` return __false__ forEach stop working
7. global.randomString
8. $A(iterable, start, end, forse) - alias for Array.from with Array|Object|String|number support eg: $A({a:1, b:2}) == [1,2]
9. $K(iterable, forse) - alias for Object.keys with Arguments|Array|Object|String|number support eg: $A({a:1, b:2}) == ['a','b']
10. bubbleEventListener TODO:: describe in eng. If you known russian you can read JSDoc
11. $ alias for document.getElementById
12. $$ alias for document.querySelectorAll (with ">[any selector]" support)
13. $$0 -> $$[0]
14. Fix console from https://github.com/theshock/console-cap/blob/master/console.js
 
## Same-domain limitation

IE requires that the .htc behavior file must be in the same domain as the HTML page which uses it. If you try to load the behavior from a different domain, you will get an "Access Denied" error.
Note that the domain must be exactly the same; that means that http://www.foo.com is a different domain than http://foo.com.
http://css3pie.com/documentation/known-issues/#x-domain

### Solve Same-domain limitation
Russian instruction in extra/SameDomainLimitation.SOLVE_RUS.odt

### Temporary testing
http://jsperf.com/es5-dom-shim-test

## Known issues:
0. Lack of test cases
1. Same-domain limitation (can be solve only on server)
2. Incompatibility with http://code.google.com/p/ie7-js/ [working on it]

## TODO
0. Tests
2. element.dataset (http://code.eligrey.com/html5/dataset/latest/html5-dataset.js)
4. http://dvcs.w3.org/hg/url/raw-file/tip/Overview.html (https://gist.github.com/1384398 & https://gist.github.com/1235332)
5. insertAdjacentText and insertAdjacentElement

## License

    MIT
	