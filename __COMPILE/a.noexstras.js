(function(i){
"use strict";var l=void 0,m=!0,o=null,p=!1;
function H(a,b){var c;try{c=document.createEvent("CustomEvent")}catch(e){c=document.createEvent("Event")}b=b||{};b.detail=b.detail!==l?b.detail:o;(c.initCustomEvent||(c.detail=b.detail,c.initEvent)).call(c,a,b.bubbles||p,b.cancelable||p,b.detail);return c}function y(a,b){var c=document.createEvent("Events"),b=b||{};c.initEvent(a,b.bubbles||p,b.cancelable||p);return c}function z(a,b){this.c=b;this.length=0;this.a=[];this.value="";this.update(a)}function A(a){return a}function I(){return p}
function J(a){var b=Object.create(DOMException.prototype);b.code=DOMException[a];b.message=a+": DOM Exception "+b.code;throw b;}function t(a,b){if(a==o&&!b)throw new TypeError;return Q&&"string"==typeof a&&a?a.split(""):Object(a)}function s(a,b,c){return v.call(a,b,u.call(arguments,2))}function K(a){return function(b,c){for(var e=1;e<arguments.length;e++){var g=arguments[e],f;for(f in g)if(q(g,f)&&(a||!q(b,f)))b[f]=g[f]}return b}}function L(a){try{return Object.defineProperty(a,"sentinel",{}),"sentinel"in
a}catch(b){}}function M(a){try{return a.sentinel2=0,0===Object.getOwnPropertyDescriptor(a,"sentinel2").value}catch(b){}}function N(a,b){for(var c=0,e=a.length;c<e;c++){var g=a[c],f=b(g);if(f||g.childNodes&&0<g.childNodes.length&&(f=N(g.childNodes,b)))return f}}var h={e:navigator.userAgent.toLowerCase()};h.f=h.e.match(/(msie)/gi);h.f.length&&(h[h.f[0]]=m);h.b=h.msie;if(h.b)for(var j=6;11>j;j++)if(RegExp("msie "+j).test(h.e)){h.b=h.msie=j;break}h.msie=h.b;h.cssPrefix=h.i?"Moz":h.k||h.j?"Webkit":h.opera?
"O":h.b?"ms":"";Function.prototype.bind||(Function.prototype.bind=function(a,b){var c=this,e=u.call(arguments,1);return function(){return c.apply(a,e.concat(u.call(arguments)))}});var u=Array.prototype.slice,v=Function.prototype.apply,q=Function.prototype.call.bind(Object.prototype.hasOwnProperty),k=document.createElement.orig?s(document.createElement.orig,document,"_"):document.createElement("_"),Q="a"!=Object("a")[0]||!(0 in Object("a")),j=i.Node&&i.Node.prototype||{},B=Object.prototype;i.HTMLDocument||
(i.HTMLDocument=i.Document);i.Document||(i.Document=i.HTMLDocument);var r=p;try{r=isNaN.apply(o,{})}catch(W){}r||(Function.prototype.apply=function(a,b){try{return b!=l?v.call(this,a,b):v.call(this,a)}catch(c){if(c.number!=-2146823260||b.length===l||typeof b==="string")throw c;return v.call(this,a,Array.from(b))}});Object.append=K();Object.extend=K(m);Object.inherit=function(a,b){(a.prototype=Object.create(a.superclass=b.prototype)).constructor=a};var r={d:function(a){a===""&&J("SYNTAX_ERR");(a+"").indexOf(" ")>
-1&&J("INVALID_CHARACTER_ERR")},add:function(a){this.d(a);var b=this.value;if(this.a.indexOf(a)===-1){this.value=this.value+((b&&!RegExp("\\s+$","g").test(b)?" ":"")+a);this.a.push(a);this[(this.length=this.a.length)-1]=a;this.c&&this.c.call(this)}},remove:function(a){this.d(a);for(var b,c;(b=this.a.indexOf(a))!==-1;){delete this.a[b];this.a.splice(b,1)}b=0;for(c=this.a.length;b<c;++b)this[b]=this.a[b];for(;b<this.length;++b)delete this[b];this.length=this.a.length;this.value=this.value.replace(RegExp("((?: +)?"+
a+"(?: +)?)","g"),function(a,b,c,h){return c&&a.length+c<h.length?" ":""});this.c&&this.c.call(this)},contains:function(a){this.d(a);return this.a.indexOf(a)!=-1},item:function(a){return this[a]||o},toggle:function(a){this.d(a);var b=this.a.indexOf(a)==-1;this[b?"add":"remove"](a);return b},update:function(a){var a=a||"",b=!!this.length;if(b){for(var c=0;c<this.length;++c)delete this[c];this.length=0;this.a=[];this.value=""}a&&(a=a.trim())&&a.split(RegExp("\\s+","g")).forEach(this.add.bind(this));
b&&this.c&&this.c.call(this);return this}},n;for(n in r)z.prototype[n]=r[n];z.prototype.toString=function(){return this.value||""};Object.keys=Object.keys||function(){var a=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],b=!{toString:o}.propertyIsEnumerable(a[0]),c=a.length;return function(e){if(typeof e!="object"&&typeof e!="function"||e===o)throw new TypeError("Object.keys called on a non-object");var g=[],f;for(f in e)q(e,f)&&g.push(f);
if(b)for(f=0;f<c;f++)q(e,a[f])&&g.push(a[f]);return g}}();Object.getOwnPropertyNames||(Object.getOwnPropertyNames=Object.keys);Object.seal||(Object.seal=A);Object.freeze||(Object.freeze=A);Object.preventExtensions||(Object.preventExtensions=A);Object.isSealed||(Object.isSealed=I);Object.isFrozen||(Object.isFrozen=I);Object.isExtensible||(Object.isExtensible=function(a){if(Object(a)===a)throw new TypeError;for(var b="";q(a,b);)b=b+"?";a[b]=m;var c=q(a,b);delete a[b];return c});Object.getPrototypeOf||
(Object.getPrototypeOf=function(a){return a.__proto__||(a.constructor?a.constructor.prototype:B)});Object.create||(Object.create=function(a,b){var c;if(a===o)c={__proto__:o};else{if(typeof a!="object")throw new TypeError("typeof prototype["+typeof a+"] != 'object'");c=function(){};c.prototype=a;c=new c;c.__proto__=a}b&&Object.defineProperties(c,b);return c});if(Object.defineProperty&&(n=L({}),r=L(k),!n||!r))var w=Object.defineProperty,C=Object.defineProperties;if(!Object.defineProperty||w)Object.defineProperty=
function(a,b,c){if(typeof a!="object"&&typeof a!="function"||a===o)throw new TypeError("Object.defineProperty called on non-object: "+a);if(typeof c!="object"&&typeof c!="function"||c===o)throw new TypeError("Property description must be an object: "+c);a.setAttribute&&a.setAttribute.ielt9&&a.hasAttribute(b)&&a.setAttribute(b,a.getAttribute(b),m);if(w)try{return w.call(Object,a,b,c)}catch(e){if(e.number===-2146823252){c.enumerable=p;try{return w.call(Object,a,b,c)}catch(g){}}}if(c.value!==l)if(a.__defineGetter__&&
(a.__lookupGetter__(b)||a.__lookupSetter__(b))){var f=a.__proto__;a.__proto__=B;delete a[b];a[b]=c.value;a.__proto__=f}else a[b]=c.value;else if(a.__defineGetter__){c.get!==l&&a.__defineGetter__(b,c.get);c.set!==l&&a.__defineSetter__(b,c.set)}else if(Object.defineProperty.ielt8){c.get!==l&&(a["get"+b]=c.get);c.set!==l&&(a["set"+b]=c.set)}else throw new TypeError("getters & setters not supported");return a};j.ie&&8>h.b&&(j.ielt8=Object.defineProperty.ielt8=m);if(!Object.defineProperties||C)Object.defineProperties=
function(a,b){if(C)try{return C.call(Object,a,b)}catch(c){}for(var e in b)q(b,e)&&Object.defineProperty(a,e,b[e]);return a};if(Object.getOwnPropertyDescriptor&&(n=M({}),!M(k)||!n))var D=Object.getOwnPropertyDescriptor;if(!Object.getOwnPropertyDescriptor||D)Object.getOwnPropertyDescriptor=function(a,b){if(typeof a!="object"&&typeof a!="function"||a===o)throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object: "+a);if(D)try{return D.call(Object,a,b)}catch(c){}if(q(a,b)){var e={enumerable:m,
configurable:m},g,f;if(a.__defineGetter__){var h=a.__proto__;a.__proto__=B;g=a.__lookupGetter__(b);f=a.__lookupSetter__(b);a.__proto__=h}else if(Object.defineProperty.ielt8){g=a["get"+b];f=a["set"+b]}if(g||f){if(g)e.get=g;if(f)e.set=f;return e}e.value=a[b];return e}};var x=Array.from||(Array.from=function(a){if(Array.isArray(a))return a;for(var a=t(a,m),b=[],c=0,e=a.length>>>0;c<e;c++)c in a&&(b[c]=a[c]);return b});Array.of=Array.of||function(a){return u.call(arguments)};if(2!=[1,2].splice(0).length){var R=
Array.prototype.splice;Array.prototype.splice=function(a,b,c){return R.call(this,a,b===l?this.length-a:b,u.call(arguments,2))}}Array.prototype.reduce||(Array.prototype.reduce=function(a,b){var c=t(this),e=c.length,g=0;if((e===0||e===o)&&arguments.length<=1)throw new TypeError("Array length is 0 and no second argument");for(b||(b=(g++,c[0]));g<e;++g)g in c&&(b=s(a,l,b,c[g],g,c));return b});Array.prototype.reduceRight||(Array.prototype.reduceRight=function(a,b){return x(this).slice(0).reverse().reduce(a,
b)});Array.prototype.forEach||(Array.prototype.forEach=function(a,b){var c=t(this),e;for(e in c)q(c,e)&&s(a,b,c[e],parseInt(e,10),c)});var E=Function.prototype.call.bind(Array.prototype.forEach);Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){for(var c=x(this),e=b||0,g=c.length;e<g;e++)if(c[e]===a)return e;return-1});Array.prototype.lastIndexOf||(Array.prototype.lastIndexOf=function(a,b){return x(this).slice(0).reverse().indexOf(a,b)});Array.prototype.every||(Array.prototype.every=
function(a,b,c){c===l&&(c=m);var e=c;E(this,function(g,f){e==c&&(e=!!s(a,b,g,f,this))});return e});Array.prototype.some||(Array.prototype.some=function(a,b){return Array.prototype.every.call(this,a,b,p)});Array.prototype.filter||(Array.prototype.filter=function(a,b){for(var c=t(this),e=this.length>>>0,g=[],f=0;f<e;f++)if(f in c){var h=c[f];s(a,b,h,f,c)&&g.push(h)}return g});Array.prototype.map||(Array.prototype.map=function(a,b){t(this);var c=[];E(this,function(e,g,f){s(a,b,e,g,f);c[g]=e});return c});
Array.isArray=Array.isArray||function(a){return!(!a||!a.concat||!a.unshift||a.callee)};String.prototype.repeat||(String.prototype.repeat=function(a){return Array(++a).join(this+"")});n="\t\n\x0B\u000c\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff";if(!String.prototype.trim||n.trim()){n="["+n+"]";var S=RegExp("^"+n+n+"*"),T=RegExp(n+n+"*$");String.prototype.trim=function(){return(""+this).replace(S,"").replace(T,"")}}String.prototype.startsWith||
(String.prototype.startsWith=function(a){return this.indexOf(a)===0});String.prototype.endsWith||(String.prototype.endsWith=function(a){var a=""+a,b=this.lastIndexOf(a);return b>=0&&b===this.length-a.length});String.prototype.contains||(String.prototype.contains=function(a){return!!~this.indexOf(a)});String.prototype.toArray||(String.prototype.toArray=function(){return this.split("")});var F;try{F=Event.prototype,new Event("click")}catch(X){i.Event=y,F&&(y.prototype=F)}var G;try{G=(i.CustomEvent||
Event).prototype,new CustomEvent("magic")}catch(Y){i.CustomEvent=H,G&&(H.prototype=G)}if(document.addEventListener&&k.addEventListener){var O=p;try{k.addEventListener("click",function(){O=m}),k.click?k.click():k.dispatchEvent(new y("click"))}catch(Z){}finally{O||E([i.HTMLDocument&&i.HTMLDocument.prototype||i.document,i.Window&&i.Window.prototype||i,j],function(a){if(a){var b=a.addEventListener,c=a.removeEventListener;if(b)a.addEventListener=function(a,c,f){return b.call(this,a,c,f||p)};if(c)a.removeEventListener=
function(a,b,f){return c.call(this,a,b,f||p)}}})}}"classList"in k||Object.defineProperty(j,"classList",{get:function(){var a=this,b=a.g||(a.g={});b._ccl_||(b._ccl_=new z(a.getAttribute("class"),function(){a.setAttribute("class",this.value);if(a.className!=this.value)a.className=this.value}));return b._ccl_}});(!("children"in k)||h.b&&9>h.b)&&Object.defineProperty(j,"children",{get:function(){for(var a=[],b=this.firstChild;b;){b.nodeType==1&&a.push(b);b=b.nextSibling}return a}});k.childElementCount==
l&&Object.defineProperties(j,{firstElementChild:{get:function(){var a;for(a=this.firstChild;a&&a.nodeType!=1;)a=a.nextSibling;return a}},lastElementChild:{get:function(){var a;for(a=this.lastChild;a&&a.nodeType!=1;)a=a.previousSibling;return a}},nextElementSibling:{get:function(){for(var a=this;a=a.nextSibling;)if(a.nodeType==1)break;return a}},previousElementSibling:{get:function(){for(var a=this;a=a.previousSibling;)if(a.nodeType==1)break;return a}},childElementCount:{get:function(){if(this.children)return this.children.length}}});
if(!document.importNode.shim)try{document.importNode(k)}catch($){var U=document.importNode;delete document.importNode;document.importNode=function(a,b){b===l&&(b=m);return U.call(this,a,b)}}!function(){function a(){b=m}var b=p;try{k.addEventListener("DOMAttrModified",a,p);k.setAttribute("id","target")}catch(c){}finally{k.removeEventListener&&k.removeEventListener("DOMAttrModified",a,p)}return b}()&&k.dispatchEvent&&(h=function(a,b){return function(c,e){var g=document.createEvent("MutationEvents"),
f=this.getAttribute(c);a.apply(this,arguments);g.initMutationEvent("DOMAttrModified",m,m,o,f,b||e===o?"":e,c,b||(f==o?2:1));this.dispatchEvent(g)}},j.setAttribute=h(j.setAttribute||k.setAttribute),j.removeAttribute=h(j.removeAttribute||k.removeAttribute,3));var P="INPUT,BUTTON,KEYGEN,METER,OUTPUT,PROGRESS,TEXTAREA,SELECT".split(",");"labels"in document.createElement("input")||Object.defineProperty(j,"labels",{enumerable:m,get:function(){if(~P.indexOf(this.nodeName.toUpperCase())){for(var a=this,b=
this.id?x(document.querySelectorAll("label[for='"+this.id+"']")):[],c=b.length-1;(a=a.parentNode)&&(!a.h||a.h===this);)if(a.nodeName.toUpperCase()==="LABEL"){for(;b[c]&&b[c].compareDocumentPosition(a)&2;)c--;b.splice(c+1,0,a)}return b}}});"control"in document.createElement("label")||Object.defineProperty(i.HTMLLabelElement&&i.HTMLLabelElement.prototype||j,"control",{enumerable:m,get:function(){return this.nodeName.toUpperCase()!=="LABEL"?l:this.hasAttribute("for")?document.getElementById(this.htmlFor):
N(this.childNodes,function(a){if(~P.indexOf(a.nodeName.toUpperCase()))return a})||o}});h=Event.prototype;h.AT_TARGET||(h.AT_TARGET=2,h.BUBBLING_PHASE=3,h.CAPTURING_PHASE=1);try{i.getComputedStyle(k)}catch(aa){var V=i.getComputedStyle;i.getComputedStyle=function(a,b){return V.call(i,a,b||o)}}k.addEventListener||(j.addEventListener=i.addEventListener,j.removeEventListener=i.removeEventListener,j.createEvent=i.createEvent,j.dispatchEvent=i.dispatchEvent)})(window);