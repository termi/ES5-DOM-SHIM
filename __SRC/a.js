// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name default.js
// @check_types
// ==/ClosureCompiler==
/**
 * module
 * @version 3.2
 *  changeLog: 3.2   [24.11.2011 18:00] push it to github 
			   3.1.7 [23.11.2011 01:20] + Продолжаю переносить из github.com/Raynos/DOM-shim со своими изменениями: compareDocumentPosition (своя), getElementsByClassName, importNode (исправил), new Event(...) (исправил), new CustomEvent(...) (исправил)
			   --deleted--
 * TODO:: end comments
 *        delete 'deprecated', Site obj and Log obj, and isNumber
 *        querySelector and querySelectorAll for DocumentFragment
 *        dateTime prop for IE < 8
 *        export isHTMLElement ?
 */


/** @define {boolean} */
var IS_DEBUG = false;
/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

var /** @const */funcType = "function";
var /** @const @deprecated */undefType = "undefined";

"use strict";

;(
/** Переопределяем глобальную переменную для модулей
 * @type {Window}
 * @const */
function(global) {

//Создадим алиасы глобальных переменных global и document для уменьшения размера кода
// При этом не стоит забывать, что на некоторых JS-движках (особенно V8) такой код:
// d.<prop> весто document.<prop> будет выполнятся на ~10% медленнее
// пруф: http://habrahabr.ru/blogs/javascript/100828/#comment_3186840
var /** @const @deprecated */w = global;
var /** @const @deprecated */d = document;

/*  ======================================================================================  */
/*  ==================================  Function prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * From prototypejs (prototypejs.org)
 * Wraps the function in another, locking its execution scope to an object specified by thisObj.
 * @param {Object} object
 * @param {...} var_args
 * @return {Function}
 * @version 2
 */
if(!Function.prototype.bind)Function.prototype.bind = function(object, var_args) {
	var __method = this, args = Array.prototype.slice.call(arguments, 1);
	return function() {
		return __method.apply(object, args.concat(Array.prototype.slice.call(arguments, 0)));
	}
}
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Function prototype  ==================================  */
/*  =======================================================================================  */

var _hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty);


//d.head = d["head"];//Для Closure Compiller'а



// --------------- ================ Browser detection ================ ---------------
//Определение браузера.
//Код: https://gist.github.com/989440
//Разъяснение: http://habrahabr.ru/blogs/javascript/115841/
//TODO:: Всесторонне протестировать
/*var browser = (function () {
    var w = this.Worker,
        l = w && (w.prototype + "").length;

    return {
        mozilla: l == 36, // is Firefox?
        opera: l == 33, // is Opera?
        safari: l == 24, // is Safari?
        chrome: l == 15, // is Chrome?
        msie: !w       // is IE?
    }
})()
*/

//Определение браузера и поддерживаемых возможностей
//Если что-то еще понадобится, можно посмотреть тут https://github.com/mrdoob/system.js
/** @type {Object}
 * @const */
var browser = global["browser"] = {
/** @type {string}
 * @const */
	agent : navigator.userAgent.toLowerCase()
};

//Тут не хватает chrome
//TODO:: Chrome определяется как Safari
/** @type {Array}
 * @const */
browser.names = browser.agent.match(/(mozilla|compatible|webkit|safari|opera|msie|iphone|ipod|ipad)/gi);
/** @type {number} */
var len = browser.names.length;
while(len-- > 0)browser[browser.names[len]] = true;
//Alians'es
/** @type {boolean}
 * @const */
browser.mozilla = browser["mozilla"];
/** @type {boolean}
 * @const */
browser.webkit = browser["webkit"];
/** @type {boolean}
 * @const */
browser.safari = browser["safari"];
/** @type {boolean}
 * @const */
browser.opera = browser["opera"];
/** @type {boolean}
 * @const */
browser.msie = browser["msie"];
/** @type {boolean}
 * @const */
browser.iphone = browser["iphone"];
/** @type {boolean}
 * @const */
browser.ipod = browser["ipod"];
/** @type {boolean}
 * @const */
browser.ipad = browser["ipad"];

/** @deprecated Теперь версию IE записываю непосредственно в browser.msie */
browser.msieV = void 0;

if(browser["compatible"] || browser.webkit) {
	browser.mozilla = false;
	delete browser["mozilla"];
}
else if(browser.opera) {
	browser.msie = false;
	delete browser["msie"];
}
if(browser.msie)for(var i = 6 ; i < 11 ; i++)//IE from 6 to 10
	if(new RegExp('msie ' + i).test(browser.agent)) {
		browser.msie = i;
		
		browser.msieV = browser.msie;//Оставляю пока для совместимости
		
		break;
	}
browser["msie"] = browser.msie;
//Определяем поддерживаемые браузером технолигии
/** @type {Node}
 * @const */
browser.testElement = document.createElement('div');
/** @type {boolean}
 * @const */
browser.isPlaceholder = typeof document.createElement("INPUT").placeholder != "undefined";
/** @type {string}
 * @const */
browser["cssPrefix"] = 
	browser.mozilla ? "Moz" :
	browser.webkit || browser.safari ? "Webkit" ://and iPad, iPhone, iPod
	browser.opera ? "O" :
	browser.msie ? "ms" : 
	"";
	

if(!document.readyState)browser.noDocumentReadyState = true;
if(browser.noDocumentReadyState)document.readyState = "uninitialized";
//Emulating HEAD for ie < 9
document.head || (document.head = document.getElementsByTagName('head')[0]);


/**
 * @param {string} link Path to the script
 * @param {Function=} callback Optional callback executed onload
 * TODO:: Заменить на https://github.com/CapMousse/include.js ???
 *		  или заменить на функцию js из http://headjs.com/ ???
 * 		  или на CommonJS like аналог https://github.com/jiem/my-common [предпочтительнее, только нужно переписать некоторые тупые моменты]
 *		  или на http://requirejs.org/ ??? Бля ну и выбор !!!
 */
function addScript(link, callback){
	var newScript = document.createElement('script');
	newScript.src = link;
	newScript.onload = function() {
		!!callback && callback();
	};
	(document.body || document.head || document).appendChild(newScript);
}


/*if(browser.msie && browser.msie < 8)
	document.write("<script src='a.ielt8.js'></script>");*/

function _recursivelyWalk(nodes, cb) {
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        var ret = cb(node);
        if (ret) {
            return ret;
        }
        if (node.childNodes && node.childNodes.length > 0) {
            var ret = _recursivelyWalk(node.childNodes, cb);
            if (ret) {
                return ret;
            }
        }
    }
};

/*  =======================================================================================  */
/*  =================================  Utils.Dom  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(!global["Utils"])global["Utils"] = {};
if(!global["Utils"]["Dom"])global["Utils"]["Dom"] = {};

/**
 * Utils.Dom.DOMException
 * DOMException like error
 * @constructor
 * @param {string} errStr Error string code
 */
var DOMException_ = global["Utils"]["Dom"]["DOMException"] = function(errStr) {
	this.code = this[errStr];
	this.message = errStr +': DOM Exception ' + this.code;
}
var p = DOMException_.prototype = new Error;
p.INDEX_SIZE_ERR = 1;
p.DOMSTRING_SIZE_ERR = 2; // historical
p.HIERARCHY_REQUEST_ERR = 3;
p.WRONG_DOCUMENT_ERR = 4;
p.INVALID_CHARACTER_ERR = 5;
p.NO_DATA_ALLOWED_ERR = 6; // historical
p.NO_MODIFICATION_ALLOWED_ERR = 7;
p.NOT_FOUND_ERR = 8;
p.NOT_SUPPORTED_ERR = 9;
p.INUSE_ATTRIBUTE_ERR = 10; // historical
p.INVALID_STATE_ERR = 11;
p.SYNTAX_ERR = 12;
p.INVALID_MODIFICATION_ERR = 13;
p.NAMESPACE_ERR = 14;
p.INVALID_ACCESS_ERR = 15;
p.VALIDATION_ERR = 16; // historical
p.TYPE_MISMATCH_ERR = 17;

/**
 * Utils.Dom.DOMStringCollection
 * DOMSettableTokenList like object
 * @param {string} string initial string
 * @param {Function} onchange callback for onchange event
 */
var DOMStringCollection = global["Utils"]["Dom"]["DOMStringCollection"] = function(string, onchange) {
	/**
	 * Event fired when any change apply to the object
	 */
	this._onchange = onchange;
	this.length = 0;
	this._container = [];
	this.value = "";
		
	this.update(string);
}

var methods = {
	checkToken: function(token) {
		if(token === "")throw new DOMException_("SYNTAX_ERR");
		if((token + "").indexOf(" ") > -1)throw new DOMException_("INVALID_CHARACTER_ERR");
	},
	add: function(token) {
		this.checkToken(token);
		
		var thisObj = this, v = thisObj.value;

		if(thisObj._container.indexOf(token) !== -1)return;
		
		thisObj.value += ((v && !(new RegExp("\\s+$", "g")).test(v) ? " " : "") + token);

		this._container.push(token)
		this[(this.length = this._container.length) - 1] = token;
				
		if(thisObj._onchange)thisObj._onchange.call(thisObj);
	},
	remove: function(token) {
		this.checkToken(token);

		var i, thisObj = this;
		while((i = thisObj._container.indexOf(token)) !== -1) {
			delete thisObj._container[i];//[BUG*fix]prevente strange bug in FireFox 8 then after thisObj._splice(i, 1) this.length == 0 but this[0] return value O_0//DOTO:: проверить
			thisObj._container.splice(i, 1);
		}
		for(var i = 0, l = thisObj._container.length ; i < l ; ++i) {
			thisObj[i] = thisObj._container[i];
		}
		for( ; i < thisObj.length ; ++i) {
			delete thisObj[i];
		}
		this.length = this._container.length;
		
		thisObj.value = thisObj.value.replace(new RegExp("((?: +)?" + token + "(?: +)?)", "g"), function(find, p1, offset, string) {
			return offset && find.length + offset < string.length ? " " : "";
		})
		if(thisObj._onchange)thisObj._onchange.call(thisObj)
	},
	contains: function(token) {
		this.checkToken(token);

		return this._container.indexOf(token) != -1;
	},
	item: function(index) {
		return this[index] || null;
	},
	toggle: function(token) {
		this.checkToken(token);

		var result = this._container.indexOf(token) == -1;
		this[result ? 'add' : 'remove'](token);
		
		return result;
	},
	update: function(string) {
		string = string || "";//default value
	
		var isChange = !!this.length;
		
		if(isChange) {
			for(var i = 0 ; i < this.length ; ++i)
				delete thisObj[i];
			this.length = 0;
			this._container = [];
			thisObj.value = "";
		}

		if(string && (string = string.trim()))
			string.split((new RegExp("\\s+", "g"))).forEach(this.add.bind(this));
		
		if(isChange && this._onchange)this._onchange.call(this)

		return this;
	}
}
for(var key in methods)DOMStringCollection.prototype[key] = methods[key];
//[ie8 BUG]Метод toString не показывается в цикле for
DOMStringCollection.prototype.toString=function(){return this.value||""}



/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Utils.Dom  ==================================  */
/*  =======================================================================================  */

// --------------- ================ es5 shim ================ ---------------
// Source https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js

/*  =======================================================================================  */
/*  =================================  Object prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*
TODO:
1. jsdoc
2. Проверить, а нету ли такогоже бага, как у Object.keys описанном тут https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Object/keys и не нежно ли как в текущей версии Object.keys сделать проверку на hasDontEnumBug?
*/
if(!Object.getOwnPropertyNames)Object.getOwnPropertyNames = function(obj) {
 	var ret = [], p;
	for(p in obj)ret.push(p);
	return ret;
}

/**
 * ES5 15.2.3.14
 * http://es5.github.com/#x15.2.3.14
 * https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Object/keys
 * Returns an array of all own enumerable properties found upon a given object, in the same order as that provided by a for-in loop (the difference being that a for-in loop enumerates properties in the prototype chain as well).
 *
 * Implementation from http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
 * 
 * @param obj The object whose enumerable own properties are to be returned.
 */
Object.keys = Object.keys || (function () {
    var DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable(DontEnums[0]),
        DontEnumsLength = DontEnums.length;
 
    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");
 
        var result = [];
        for (var name in o) {
            if(_hasOwnProperty(o, name))
                result.push(name);
        }
 
        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (_hasOwnProperty(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }
 
        return result;
    };
})();



/**
 * @param {Object} object
 * @return {Object} the same object
// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
 */
if(!Object.seal)Object.seal = function(object) {
	// this is misleading and breaks feature-detection, but
	// allows "securable" code to "gracefully" degrade to working
	// but insecure code.
	return object;
};

/**
 * @param {Object} object
 * @return {Object} the same object
// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
 */
if(!Object.freeze)Object.freeze = function(object) {
	// this is misleading and breaks feature-detection, but
	// allows "securable" code to "gracefully" degrade to working
	// but insecure code.
	return object;
};

/**
 * @param {Object} object
 * @return {Object}
// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
// https://github.com/kriskowal/es5-shim/issues#issue/2
// http://ejohn.org/blog/objectgetprototypeof/
// recommended by fschaefer on github
 */
if(!Object.getPrototypeOf)Object.getPrototypeOf = function getPrototypeOf(object) {
	return object.__proto__ || (
		object.constructor ?
		object.constructor.prototype :
		Object.prototype
	);
};

/*
 * A generic way to define a getter/setter for
 * objects in both the legacy Mozilla way and the new ECMA standard way,
 * which should work in I.E. with DOM Elements, but not js objects.
 *
 * more info on javascript getters and setters:
 * John Resig: http://bit.ly/resig-js-gs-2007
 * Robert Nyman: http://bit.ly/nyman-js-gs-2009
 *
 * @author somethingkindawierd@gmail.com (Jon Beebe)
 * @link http://somethingkindawierd.com/blog/web-development/10/2010/javascript-getters-and-setters/
 * @param {!Object} obj 
 * @param {!string} label The property name to get/set.
 * @param {Function=} getter The get function.
 * @param {Function=} setter The set function.
 *//*
Object["addProperty"] = function(obj, label, getter, setter) {
	if(Object.defineProperty)
		Object.defineProperty(
			obj,
			label, {
				get: getter,
				set: setter
			}
		);
	else if(obj.__defineGetter__) {
		if(getter) {
			obj.__defineGetter__(label, getter);
		}
		if(setter) {
			obj.__defineSetter__(label, setter);
		}
	}
	else {
		//IE < 8
		throw new DOMException_("SYNTAX_ERR");
	}
};*/

/*
 * A generic way to define a group of getters/setters for objects
 *
 * @author somethingkindawierd@gmail.com (Jon Beebe)
 * @link http://somethingkindawierd.com/blog/web-development/10/2010/javascript-getters-and-setters/
 * @param {!Object} obj 
 * @param {!Object} p Set of properties and their getter/setter methods.
 */
/*Object["addProperties"] = function(obj, p) {
  for (var label in p) {
    if (p.hasOwnProperty(label)) {
      Object["addProperty"](obj, label, p[label].get, p[label].set);
    }
  }

};*/
/**
 * https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Object/create
 * JavaScript 1.8.5
 * ES5 15.2.3.5
 * http://es5.github.com/#x15.2.3.5
 * Creates a new object with the specified prototype object and properties.
 * @param {Object} prototype The object which should be the prototype of the newly-created object.
 * @param {Object=} properties If specified and not undefined, an object whose enumerable own properties (that is, those properties defined upon itself and not enumerable properties along its prototype chain) specify property descriptors to be added to the newly-created object, with the corresponding property names.
 * @return {!Object}
 */
if(!Object.create)Object.create = function create(prototype, properties) {
	var object;
	if (prototype === null) {
		object = { "__proto__": null };
	} else {
		if (typeof prototype != "object")
			throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
		
		var /** @constructor */Type = function () {};
		Type.prototype = prototype;
		object = new Type();
		// IE has no built-in implementation of `Object.getPrototypeOf`
		// neither `__proto__`, but this manually setting `__proto__` will
		// guarantee that `Object.getPrototypeOf` will work as expected with
		// objects created using `Object.create`
		object.__proto__ = prototype;
	}
	if(properties)
		Object.defineProperties(object, properties);
	return object;
};
/* Prev::
if(!Object.create)Object.create = function(proto, propertiesObject_not_supported) {
	if(arguments.length > 1)throw new Error('Object.create implementation only accepts the first parameter.');
	function F(){}
	F.prototype = proto;
	return new F();
};
*/

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters not supported";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);

        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if(descriptor["value"] !== void 0) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(_hasOwnProperty(descriptor, "writable") ? descriptor.writable : true) ||
                !(_hasOwnProperty(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(_hasOwnProperty(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (object.__defineGetter__ && 
				(object.__lookupGetter__(property) || object.__lookupGetter__(property))) {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor["value"];
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor["value"];
            }
        } else {
            if (!object.__defineGetter__) {
                if(descriptor["ielt8"]) {
					object["get" + property] = descriptor["get"];
					object["set" + property] = descriptor["set"];
				}
				else throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
			}
			else {	
				// If we got that far then getters and setters can be defined !!
				if(descriptor["get"] !== void 0)
					object.__defineGetter__(property, descriptor["get"]);
				if(descriptor["set"] !== void 0)
					object.__defineSetter__(property, descriptor["set"]);
			}
        }

        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if(_hasOwnProperty(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Object prototype  ==================================  */
/*  =======================================================================================  */

/*  ======================================================================================  */
/*  ==================================  Array.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
 * 
 * Apply a function against an accumulator and each value of the array (from left-to-right) as to reduce it to a single value.
 * @param {Function} accumulator Function to execute on each value in the array, taking four arguments: 
 *	previousValue The value previously returned in the last invocation of the callback, or initialValue, if supplied. (See below.)
 *	currentValue The current element being processed in the array.
 *	index The index of the current element being processed in the array.
 *	array The array reduce was called upon.
 * @param {*} initialValue Object to use as the first argument to the first call of the callback.
 */
if(!Array.prototype.reduce)Array.prototype.reduce = function(accumulator, initialValue) {
	if(typeof accumulator !== funcType) // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
		throw new TypeError("First argument is not callable");
	  
	var l = this.length, i = 0;
	
	if((l === 0 || l === null) && (arguments.length <= 1))// == on purpose to test 0 and false.
		throw new TypeError("Array length is 0 and no second argument");
	  
	initialValue || (initialValue = (i++, this[0]));
	
	for( ; i < l ; ++i) {
	  if(i in this)
	    initialValue = accumulator.call(undefined, initialValue, this[i], i, this);
	}

	return initialValue;
};

/*
TODO:: jsdoc
https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight
Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
reduceRight executes the callback function once for each element present in the array, excluding holes in the array, receiving four arguments: the initial value (or value from the previous callback call), the value of the current element, the current index, and the array over which iteration is occurring.

The call to the reduceRight callback would look something like this:
array.reduceRight(function(previousValue, currentValue, index, array) {
    // ...
});

The first time the function is called, the previousValue and currentValue can be one of two values. If an initialValue was provided in the call to reduceRight, then previousValue will be equal to initialValue and currentValue will be equal to the last value in the array. If no initialValue was provided, then previousValue will be equal to the last value in the array and currentValue will be equal to the second-to-last value.

Parameters
callback
Function to execute on each value in the array.
initialValue
Object to use as the first argument to the first call of the callback.
*/
if(!Array.prototype.reduceRight)Array.prototype.reduceRight = function(accumulator, initialValue)  {
	if(typeof accumulator !== funcType) // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
		throw new TypeError("First argument is not callable");
	  
    var l = this.length >>> 0, k = l - 1;
	
	if((l === 0 || l === null) && (arguments.length <= 1))// no value to return if no initial value, empty array
		throw new TypeError("Array length is 0 and no second argument");
	
	if(!initialValue)do {
		if(k in this) {
			initialValue = this[k--];
			break;
		}

		// if array contains no values, no initial value to return
		if (--k < 0)
		throw new TypeError();
	}
	while(true);

	for( ; k >= 0 ; --k)if(k in this)
		initialValue = accumulator.call(undefined, initialValue, this[k], k, t);

    return initialValue;
};



/*
From https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Array/filter
*/
if(!Array.prototype.filter)Array.prototype.filter = function(fun, thisp) {  
	var len = this.length >>> 0;
	if (typeof fun != funcType)throw new TypeError();  

	var res = [];
	for (var i = 0; i < len; i++)
		if (i in this) {  
			var val = this[i];// in case fun mutates this  
			if(fun.call(thisp, val, i, this))res.push(val);
		}

	return res;
}

//----- Добавляем в массив функциональность выполнения функции для всех элементов массива
/*[*]*/
//Убрал: 1.прерывание выполнения если iterator.call возв. false, т.к. это не соотв. стандартному поведению
//		 2.return this, т.к. это не соотв. стандартному поведению
if(!Array.prototype.forEach)Array.prototype.forEach = function(iterator, context) {
	for(var i in this)if(this.hasOwnProperty(i))iterator.call(context, this[i], parseInt(i, 10), this);
	//Варианты:
	//	var v, i = -1;while(v = this[++i])iterator.call(context, v, i, this);
	// не подходит, т.к. не обрабатывают массив типа t = []; t[0]="0"; t[2]="2"; <- т.к. элемента
	//  с индексом 1 нету, на индексе 0 первый алгоритм остановится, а второй обработает t[1]
	//	for(var i = 0, l = this.length ; i < l; i++)iterator.call(context, this[i], i, this);
	// не подходит, т.к. будет вызван для undefine элементов, в этом случае t = []; t[0]="0"; t[2]="2"; <- элемента 1 == undefine
}

if(!Array.prototype.indexOf)Array.prototype.indexOf = function(obj, n) {
	for(var i = n || 0, l = this.length ; i < l ; i++)
		if(this[i] === obj)return i;
	return -1;
}
if(!Array.prototype.lastIndexOf)Array.prototype.lastIndexOf = function(obj, i) {
	return this.slice(0).reverse().indexOf(obj, i)
}

/**
 * Проверяет, чтобы каждый элемент массива соответствовал некоторому критерию [JavaScript 1.6]
 * @this {Object}
 * @param {Function} callback критерий соответствия. По-умочанию - что элемент существует
 * @param {Object=} opt_thisobj Контент в рамках которого мы будем вызывать функцию
 * @return {boolean}
 */
if(!Array.prototype.every)Array.prototype.every = function(callback, opt_thisobj, _isAll) {
	if(_isAll === void 0)_isAll = true;//Default value = true
	var result = _isAll;
	this.forEach(function(value, index) {
		if(result == _isAll)result = !!callback.call(opt_thisobj, value, index, this);
	});
	return result;
}

/**
 * Проверяет, чтобы хотябы один элемент массива соответствовал некоторому критерию [JavaScript 1.6]
 * @this {Object}
 * @param {Function} callback критерий соответствия. По-умочанию - что элемент существует
 * @param {Object=} opt_thisobj Контент в рамках которого мы будем вызывать функцию
 * @return {boolean}
 */
if(!Array.prototype.some)Array.prototype.some = function(callback, opt_thisobj) {
	return Array.prototype.every(callback, opt_thisobj, false);
}

/**
 * 
 * EN: Creates a new array with the results of calling a provided function on every element in this array.
 * Production steps of ECMA-262, Edition 5, 15.4.4.19  
 * Reference: http://es5.github.com/#x15.4.4.19
 * @param {Function} callback Function that produces an element of the new Array from an element of the current one.
 * @param {Object?} thisArg Object to use as this when executing callback.
 * @return {Array}
 */
if (!Array.prototype.map)Array.prototype.map = function(callback, thisArg) {
    var T, Result, k;

    if(this == null)throw new TypeError(" this is null or not defined");  

	var O = Object(this),// 1. Let O be the result of calling ToObject passing the |this| value as the argument.  
		len = O.length >>> 0;// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".  
							 // 3. Let len be ToUint32(lenValue).  

	// 4. If IsCallable(callback) is false, throw a TypeError exception.  
	// See: http://es5.github.com/#x9.11  
	if ({}.toString.call(callback) != "[object Function]")
		throw new TypeError(callback + " is not a function"); 

	if(thisArg)T = thisArg;// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.  

	// 6. Let Result be a new array created as if by the expression new Array(len) where Array is  
	// the standard built-in constructor with that name and len is the value of len.  
	Result = new Array(len);  

	k = 0;// 7. Let k be 0  

	while(k < len) {// 8. Repeat, while k < len
		var kValue, mappedValue;  

		// a. Let Pk be ToString(k).  
		//   This is implicit for LHS operands of the in operator  
		// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.  
		//   This step can be combined with c  
		// c. If kPresent is true, then  
		if (k in O) { 
			kValue = O[ k ];// i. Let kValue be the result of calling the Get internal method of O with argument Pk.    

			// ii. Let mappedValue be the result of calling the Call internal method of callback  
			// with T as the this value and argument list containing kValue, k, and O.  
			mappedValue = callback.call(T, kValue, k, O);  

			// iii. Call the DefineOwnProperty internal method of Result with arguments  
			// Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},  
			// and false.  

			// In browsers that support Object.defineProperty, use the following:  
			// Object.defineProperty(Result, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });  

			// For best browser support, use the following:  
			Result[k] = mappedValue;  
		}
		// d. Increase k by 1.  
		k++;  
	}  

	return Result;// 9. return Result
};

/**
 * Проверка, является ли объект массивом
 * EN: Is a given value an array?
 * Delegates to ECMA5's native Array.isArray
 * @param {*} Проверяемый объект 
 * @return {boolean}
 */
Array.isArray = Array['isArray'] || function(obj) {
	return !!(obj && obj.concat && obj.unshift && !obj.callee);
};

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Array.prototype  ==================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  String.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(browser.msie && browser.msie < 9) {
//[BUGFIX] IE < 9 substr() with negative value not working in IE
	String.prototype._itlt9_substr_ = String.prototype.substr;
	String.prototype.substr = function(start, length) {
		return this._itlt9_substr_(start < 0 ? (start = this.length + start, start) < 0 ? 0 : start : start, length);
	}
}

/**
 * Removes whitespace from both ends of the string.
 * The trim method returns the string stripped of whitespace from both ends. trim does not affect the value of the string itself.
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
 */
if(!String.prototype.trim)String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, '');
	
	//Prev version::
	//var	str = this.replace(/^\s\s*/, ''),
	//	ws = /\s/,
	//	i = str.length;
	//while(ws.test(str.charAt(--i))){};
	//return str.slice(0, i + 1);
}

// TODO::
//  1. Maybe https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/TrimRight ?
//  2. Maybe https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/TrimLeft ?

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  String.prototype  ==================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  Document  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Document  ==================================  */
/*  ======================================================================================  */


/*  ======================================================================================  */
/*  ================================  Element.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  Some of from https://github.com/Raynos/DOM-shim/  */

// IE < 8 support in a.ielt8.js and a.ielt8.htc
var elementProto = global["HTMLElement"] && global["HTMLElement"].prototype || 
				   /*ie8*/global["Element"] && global["Element"].prototype || 
				   /*ielt8*/(global["_ielt8_Element_proto"] = {});

//Add JS 1.8 Element property classList				   
if(!("classList" in browser.testElement)) {
	Object.defineProperty(elementProto, "classList", {"get" : function() {
		var thisObj = this,
			cont = (browser.msie && browser.msie < 8 && (
				thisObj._ || (thisObj._ = {}))//Положим _cachedClassList в контейнер "_" для IE < 8
			) || thisObj,
			_cachedClassList = "__ccl_00lh__";
		
		if(!cont[_cachedClassList])cont[_cachedClassList] = new global["Utils"]["Dom"]["DOMStringCollection"](thisObj.getAttribute("class"), function() {
			thisObj.setAttribute("class", this.value);//this instanceof Utils.Dom.DOMStringCollection
			if(thisObj.className != this.value)thisObj.className = this.value;
		})
		
		return cont[_cachedClassList];
	}, "ielt8" : true});
}


// Traversal for IE < 9 and other
if(typeof browser.testElement.childElementCount != 'undefined')Object.defineProperties(elementProto, {
	"firstElementChild" : {
		"get" : function() {
		    var node = this;
		    // для старых браузеров
		    // находим первый дочерний узел
		    node = node.firstChild;
		    // ищем в цикле следующий узел,
		    // пока не встретим элемент с nodeType == 1
		    while(node && node.nodeType != 1) node = node.nextSibling;
		    // возвращаем результат
		    return node;
		}, "ielt8" : true
	},
	"lastElementChild" : {
		"get" : function() {
		    var node = this;
		    node = node.lastChild;
		    while(node && node.nodeType != 1) node = node.previousSibling;
		    return node;
		}, "ielt8" : true
	},
	"nextElementSibling" : {
		"get" : function() {
		    var node = this;
		    while(node = node.nextSibling) if(node.nodeType == 1) break;
		    return node;
		}, "ielt8" : true
	},
	"previousElementSibling" : {
		"get" : function() {
		    var node = this;
		    while(node = node.previousSibling) if(node.nodeType == 1) break;
    		return node;
		}, "ielt8" : true
	},
	"childElementCount" : {
		"get" : function() {
    		if(this.children)return this.children.length;
			
			// Firefox before version 3.5
			var child = container.firstChild,
				childCount = 0;
				
			while(child) {
				if(child.nodeType == 1)childCount++;
				child = child.nextSibling;
			}
			
			return childCount;
			
		}, "ielt8" : true
	}
}
)

if(!("getElementsByClassName" in browser.testElement))elementProto["getElementsByClassName"] = function(clas) {
	var ar = [];
	
	clas && _recursivelyWalk(this.childNodes, function (el, index) {
		if (el.nodeType == 1 && el.classList.contains(clas)) {
			ar.push(el);
		}
	});
	
	return ar;
};

if(!("insertAfter" in browser.testElement)) {
	/**
	 * NON STANDART METHOD
	 * Вставляет DOM-элемент вслед за определённым DOM-элементом
	 * @this {Node} Куда вставляем
	 * @param {Node} elementToInsert Что вставляем
	 * @param {Node} afterElement После чего вставляем
	 * @return {Node} Переданый elementToInsert
	 */
	elementProto["insertAfter"] = function(elementToInsert, afterElement) {
		//function(F,B){D=this;if(D._insertAfter){D._insertAfter(F,B)}else{(D.lastChild==B)?D.appendChild(F):D.insertBefore(F,B.nextSibling)}}
		return this.insertBefore(elementToInsert, afterElement.nextSibling);
	};
};

var _compareDocumentPosition_ = 'compareDocumentPosition';
if(!(_compareDocumentPosition_ in document)) {
	var nodeProto = (global["Node"] && global["Node"].prototype || /*ielt8*/elementProto),
		__name;
	document[_compareDocumentPosition_] = nodeProto[_compareDocumentPosition_] = function(b) {
		var a = this;
		
		//compareDocumentPosition from http://ejohn.org/blog/comparing-document-position/
		return a.contains ?
				(a != b && a.contains(b) && 16) +
				(a != b && b.contains(a) && 8) +
				(a.sourceIndex >= 0 && b.sourceIndex >= 0 ?
					(a.sourceIndex < b.sourceIndex && 4) +
					(a.sourceIndex > b.sourceIndex && 2) :
				1) +
			0 : 0;
	};
	__name = 'DOCUMENT_POSITION_DISCONNECTED';
	document[__name] = nodeProto[__name] = 0x01;
	__name = 'DOCUMENT_POSITION_PRECEDING';
	document[__name] = nodeProto[__name] = 0x02;
	__name = 'DOCUMENT_POSITION_FOLLOWING';
	document[__name] = nodeProto[__name] = 0x04;
	__name = 'DOCUMENT_POSITION_CONTAINS';
	document[__name] = nodeProto[__name] = 0x08;
	__name = 'DOCUMENT_POSITION_CONTAINED_BY';
	document[__name] = nodeProto[__name] = 0x10;
};

// Emuleted HTMLTimeElement
if(!(global["HTMLTimeElement"] && global["HTMLTimeElement"].prototype) && (!browser.msie || browser.msie > 7))
Object.defineProperty((global["HTMLUnknownElement"] || global["HTMLElement"]).prototype, "dateTime", {
	"get" : function() {
		var thisObj = this,
			elTag = thisObj.tagName;
		
		return thisObj.tagName.toUpperCase() == "TIME" ? (thisObj.getAttribute("datetime") || "") : void 0;
	},
	"set" : function(val) {
		var thisObj = this,
			elTag = thisObj.tagName;
		
		if(thisObj.tagName.toUpperCase() == "TIME") {
			thisObj.setAttribute("datetime", val);
			return val;
		}
		
		return null;
	}
});

// IE9 thinks the argument is not optional
// FF thinks the argument is not optional
// Opera agress that its not optional
;(function () {
    var e = document.createElement("div");
    try {
        document.importNode(e);
    } catch (e) {
        if (e.number === -2147418113 ||//e.message === "Argument not optional" // IE выводит сообщения на локальном языке, поэтому это не сработает
            e.result === 2153185281 ||//e.message === "Not enough arguments" // FF
            e.code === 6//e.message === "WRONG_ARGUMENTS_ERR" // Opera
        ) {
            var importNode = document.importNode;
            document.importNode = function (node, bool) {
                if (bool === void 0) {
                    bool = true;
                }
                return importNode.call(this, node, bool);
            }
        }
    }
})();

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Element.prototype  ==================================  */
/*  ======================================================================================  */

/*  =======================================================================================  */
/*  ======================================  Classes  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

Object.append = function(object) {
	for(var i = 1; i < arguments.length; i++) {
		var extension = arguments[i];
		for(var key in extension)
			if(!extension.hasOwnProperty || extension.hasOwnProperty(key))object[key] = extension[key];
	}
	
	return object;
}

/**
 * @deprecated
 * Наследует класс Child от Parent - фактически, только добавляет prototype Parent в цепочку прототипов Child. Не выполняет инициализирующий код содержащийся в конструкторе Parent, поэтому в конструкторе Child нужно дополнительно вызвать Child.superclass.constructor.call(this, ...)
 * @param {Function} Child
 * @param {Function} Parent
 */
global["extend"] = function(Child, Parent) {
	(Child.prototype = Object.create(Child.superclass = Parent.prototype)).constructor = Child;
}

/**
 * Наследует класс Child от Parent - фактически, только добавляет prototype Parent в цепочку прототипов Child. Не выполняет инициализирующий код содержащийся в конструкторе Parent, поэтому в конструкторе Child нужно дополнительно вызвать Child.superclass.constructor.call(this, ...)
 * @param {Function} Child
 * @param {Function} Parent
 */
global["inherit"] = function(Child, Parent) {
	(Child.prototype = Object.create(Child.superclass = Parent.prototype)).constructor = Child;
}

/*
	Quick way to define prototypes; much less verbose than standard 
	foobar.prototype.someFunc = function() lists. See ApplicationCache
	defined below for example use.

	@param f Function object/constructor to add to.
	@param addMe Object literal that contains the properties/methods to
		add to f's prototype.
	TODO:: jsdoc's и описать
*/
global["append"] = function(f, addMe) {
	for (var i in addMe) {
		f.prototype[i] = addMe[i];
	}
}


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Classes  ======================================  */
/*  =======================================================================================  */


/*  =======================================================================================  */
/*  ======================================  Network  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*
 * Получение XHR
 * @return {XMLHttpRequest}
 
var getXmlHttp = XMLHttpRequest ? function(){ return new XMLHttpRequest() } : 
function() {
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = null;
    }
  }
  return xmlhttp;
}*/
if(!global.XMLHttpRequest)global.XMLHttpRequest = ActiveXObject.bind(global, "Microsoft.XMLHTTP");

/**
 * Функция посылки запроса к файлу на сервере
 * TODO:: Переделать на объект-замыкание AJAX и не использовать global для хранения флагов/настроек
 * @param {!string} path путь к файлу
 * @param {string} args аргументы вида a=1&b=2&c=3... или пустая строка ""
 * @param {function(XMLHttpRequest)=} onDone
 * @param {function(XMLHttpRequest)=} onError — функции-обработчик ответа от сервера, если в функцию передаётся null - значит она была прервана по timeout
 * @param {({post:boolean, temporary:boolean, timeOut:number, onProccess:Function}|
			   {post:boolean, temporary:boolean, timeOut:number}|
			   {post:boolean, temporary:boolean}|
			   {post:boolean}|
			   {temporary:boolean, post:boolean, onProccess:Function}|
			   {temporary:boolean, onProccess:Function}|
			   {temporary:boolean, timeOut:number}|
			   {temporary:boolean}|
			   {timeOut:number, temporary:boolean, post:boolean}|
			   {timeOut:number, onProccess:Function}|
			   {timeOut:number, post:boolean}|
			   {timeOut:number}|
			   {onProccess:Function, post:boolean, timeOut:number}|
			   {onProccess:Function, post:boolean}|
			   {onProccess:Function})=} options Дополнительные опции: post - любое true значение означает, что нужно применить POST метод; temporary - любое значение означает, что нужно создать новый XHR объект и удалить его после выполнения запроса; timeOut - время в мс, по истечении которого, выполнения запроса прирывается и вызывается функция onError; onProccess - функция вызываемая во время выполнения запроса
 * @version 2.3
 *  versionLog: 2.3 [23.06.2011 15:10] options.temporary включается, если глобальный XHR занят
 *				2.2 [22.06.2011 13:00] [bug*]Не задавался options по-умолчанию
 *				2.1 [25.05.2011 14:51] Внедрил getXmlHttp внутрь функции
 *				2   [23.05.2011 13:46] Рефакторинг кода: Убрал пораметры method, onProccess и temp в новый параметр options. 
Короткая версия:
function xhr(m,u,c,x) {
	with(new(global.XMLHttpRequest||ActiveXObject)("Microsoft.XMLHTTP"))
		onreadystatechange = function(x){
			readyState ^ 4 || c(x)
		},
		open(m, u),
		send(c)
}
  TODO:: Посмотреть реализацию тут http://code.google.com/p/microajax/
         и тут https://github.com/ded/Reqwest
 */
var SendRequest = global["SendRequest"] = function(path, args, onDone, onError, options) {
	options = options || {};//Default value
	
	//TODO:: Прерывать соединение по timeOut, и вызывать funcError и определённым кодом ошибки
	// Получаем объект XMLHTTPRequest
    if(!SendRequest.XHR || SendRequest.outOfDate){
    	SendRequest.XHR = null;//Удалим старый XHR//Avoid memory leak
		SendRequest.outOfDate = false;
		SendRequest.XHR = new global.XMLHttpRequest();
        global.working = false;
    }
    if(!SendRequest.XHRs)w.XHRs = [];
	//Каждые 5 минут поднимаем флаг, что XHR устарел
	setTimeout(function() {SendRequest.outOfDate = true}, 3e5);
	
	var method = options.post ? "POST" : "GET",
		//Создаём отдельный XHR в случае, если глобальный XHR занят или, если в опциях указан temporary
		temp = options.temporary || global.working;
	
	// Запрос
    if ((!global.working && SendRequest.XHR) || temp) {
    	var http1 = temp ? SendRequest.XHRs[SendRequest.guid] = new global.XMLHttpRequest() : SendRequest.XHR,
    		tmpXHRguid = temp ? SendRequest.guid++ : null;
    	
    	//Проверяем, если требуется сделать GET-запрос
		if(!options.post && args.length > 0)
			path += "?" + args;//добавляем закодированный текст в URL запроса

        //Инициализируем соединение
		http1.open(method, path, true);

        //прикрепляем к запросу функцию-обработчик событий
        http1.onreadystatechange = function() {// 4 - данные готовы для обработки
        	if (http1.readyState == 4) {
            	if(http1.status == 200) {// если статус 200 (ОК) - выдать ответ пользователю
            		if(onDone)onDone(http1);
            	}
            	else if(onError)onError(http1);
            	
                if(!temp)global.working = false;
                else delete SendRequest.XHRs[tmpXHRguid];//Удалим временный объект XHR
            }
            else{ // данные в процессе получения, можно повеселить пользователя сообщениями ЖДИТЕ ОТВЕТА
            	if(options.onProccess)options.onProccess();
            }
        }
        if(!temp)global.working = true;
        
        try {
			if (options.post) {//Если это POST-запрос
				//Устанавливаем заголовок
				http1.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
				//Посылаем запрос
				http1.send(args);
			}
			else {//Если это GET-запрос
				//Посылаем нуль-запрос
				http1.send(null);
			}
		}
		catch(e) {
		
		}
    }
	if(!SendRequest.XHR) {
		if(DEBUG)Log.err("Ошибка при создании XMLHTTP объекта!");
		return false;//alert('Ошибка при создании XMLHTTP объекта!')
	}
}
SendRequest.guid = 0;


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Network  ======================================  */
/*  =======================================================================================  */


/*  ======================================================================================  */
/*  ======================================  Events  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

;(function() {
//	TODO:: использовать наработки https://github.com/arexkun/Vine
//		   использовать наработки https://github.com/kbjr/Events.js
/*
dispatchEvent
This method allows the dispatch of events into the implementations event model. Events dispatched in this manner will have the same capturing and bubbling behavior as events dispatched directly by the implementation. The target of the event is the EventTarget on which dispatchEvent is called. 
Parameters 
evt of type Event
Specifies the event type, behavior, and contextual information to be used in processing the event.
Return Value 
boolean	
The return value of dispatchEvent indicates whether any of the listeners which handled the event called preventDefault. If preventDefault was called the value is false, else the value is true.

Exceptions 
EventException	
UNSPECIFIED_EVENT_TYPE_ERR: Raised if the Event's type was not specified by initializing the event before dispatchEvent was called. Specification of the Event's type as null or an empty string will also trigger this exception
*/

var preventDefault_ = function(){this.returnValue = false};
var stopPropagation_ = function(){this.cancelBubble = true};

var guid = 0,// текущий номер обработчика
	//Т.к. мы кладём всё в один контейнер "_", нужно убедится, что названия свойств не будут пересикаться с другими названиями из другой части библиотеки a.js (a.ielt8.htc и a.ie6.htc)
	handleUUID = "_h_9e2",// Некий уникальный идентификатор
	eventsUUID = "_e_8vj";// Некий уникальный идентификатор
	
function fixEvent(event){
	// один объект события может передаваться по цепочке разным обработчикам
	// при этом кроссбраузерная обработка будет вызвана только 1 раз
	// Снизу, в функции commonHandle,, мы должны проверять на !event.isFixed
	event.isFixed = true;// пометить событие как обработанное

	// добавить preventDefault/stopPropagation для IE
	event.preventDefault || (event.preventDefault = preventDefault_);
	event.stopPropagation || (event.stopPropagation = stopPropagation_);

	event.target || (event.target = event.srcElement || document);// добавить target для IE

	// добавить relatedTarget в IE, если это нужно
	if(event.relatedTarget === void 0 && event.fromElement)
		event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

	// вычислить pageX/pageY для IE
	if(event.pageX == null && event.clientX != null) {
		var html = document.documentElement, body = document.body;
		/*event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
		event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);*/
		//Новая вервия нуждающаяся в проверки
		event.pageX = event.clientX + (window.pageXOffset || html.scrollLeft || body.scrollLeft || 0) - (html.clientLeft || 0);
		event.pageY = event.clientY + (window.pageYOffset || html.scrollTop || body.scrollTop || 0) - (html.clientTop || 0);
	}

	// записать нажатую кнопку мыши в which для IE. 1 == левая; 2 == средняя; 3 == правая
	event.which || event.button && (event.which = event.button & 1 ? 1 : event.button & 2 ? 3 : event.button & 4 ? 2 : 0);
		
	// событие DOMAttrModified
	//  TODO:: недоделано
	// TODO:: Привести event во всех случаях (для всех браузеров) в одинаковый вид с newValue, prevValue, propName и т.д.
	if(!event.attrName && event.propertyName)event.attrName = event.propertyName.split('.')[0];//IE При изменении style.width в propertyName передаст именно style.width, а не style, как нам надо

	return event
}

// вспомогательный универсальный обработчик. Вызывается в контексте элемента всегда this = element
function commonHandle(event) {
	var thisObj = this,
		_ = thisObj._,
		errors = [],//Инициализуется массив errors для исключений
		errorsMessages = [];
	
	if(!_)return;
	
	var handlers = _[eventsUUID][event.type];
	
	if(!(event = event || window.event).isFixed)event = fixEvent(event);// получить объект события и проверить, подготавливали мы его для IE или нет

	for(var g in handlers)if(handlers.hasOwnProperty(g)) {
		var handler = handlers[g];
		
		try {
			//Передаём контекст и объект event, результат сохраним в event['result'] для передачи значения дальше по цепочке
			if((event['result'] = handler.call(this, event)) === false) {//Если вернели false - остановим обработку функций
				event.preventDefault()
				event.stopPropagation()
			}
		}
		catch(e) { 
			errors.push(e);//Все исключения - добавляем в массив, при этом не прерывая цепочку обработчиков.
			errorsMessages.push(e.message);
		}
		
		if(event.stopNow)break;//Мгновенная остановка обработки событий
	}
	
	if(errors.length == 1) {//Если была только одна ошибка - кидаем ее дальше
		throw errors[0]
	}
	else if(errors.length > 1) {//Иначе делаем общий объект Error со списком ошибок в свойстве errors и кидаем его
		var e = new Error("Multiple errors thrown : " + event.type + " : " + " : " + errorsMessages.join("|"));
		e.errors = errors;
		throw e;
	}  
}

if(!document.addEventListener)global.addEventListener = document.addEventListener = function(_type, _handler, useCapture) {
	if(typeof _handler != "function")return;
	
	if(_type == "DOMContentLoaded") {
		//IE
		document.write("<script id=\"__ie_onload\" defer=\"defer\" src=\"javascript:void(0)\"><\/script>");
		var a = document.getElementById("__ie_onload");
		a.onreadystatechange = function(e) {
			var n = this;
			if(n.readyState == "complete")commonHandle.call(this, {"type" : _type});
		}
	}
	/* TODO:: DOMAttrModified
	else if(_type == "DOMAttrModified") {
	
	}
	*/
	
	var thisObj = this,
		_ = thisObj._
	if(!_)_ = thisObj._ = {};
	
	// исправляем небольшой глюк IE с передачей объекта window
	if(thisObj.setInterval && (thisObj != global && !thisObj.frameElement))thisObj = global;
	
	//Назначить функции-обработчику уникальный номер. По нему обработчик можно будет легко найти в списке events[type].
	//Если мы передали в функцию свой guid - мы установили его выше.
	if(!_handler.guid)_handler.guid = ++guid;
	
	//Инициализовать служебную структуру events и обработчик _[handleUUID]. 
	//Обработчик _[handleUUID] фильтрует редко возникающую ошибку, когда событие отрабатывает после unload'а страницы. 
	//Основная же его задача - передать вызов универсальному обработчику commonHandle с правильным указанием текущего элемента this. 
	//Как и events, _[handleUUID] достаточно инициализовать один раз для любых событий.
	if(!_[eventsUUID]) {
		_[eventsUUID] = {};
		_[handleUUID] = function(event) {
			if(event !== void 0)
				return commonHandle.call(thisObj, event);
		}
	}
	
	//Если обработчиков такого типа событий не существует - инициализуем events[type] и вешаем
	// _[handleUUID] как обработчик на elem для запуска браузером по событию type.
	if(!_[eventsUUID][_type]) {
		_[eventsUUID][_type] = {};

		thisObj.attachEvent('on' + _type, _[handleUUID]);
	}
	
	//Добавляем пользовательский обработчик в список elem[eventsUUID][type] под заданным номером. 
	//Так как номер устанавливается один раз, и далее не меняется - это приводит к ряду интересных фич.
	// Например, запуск add с одинаковыми аргументами добавит событие только один раз.
	_[eventsUUID][_type][_handler.guid] = _handler;
	
	//return _handler.guid;
}

if(!document.removeEventListener)global.removeEventListener = document.removeEventListener = function(_type, _handler) {
	var thisObj = this,
		_ = thisObj._;		
	if(typeof _handler != "function" || !_handler.guid || !_)return;
	var handlers = _[eventsUUID] && _[eventsUUID][_type];//Получить список обработчиков
	
	delete handlers[_handler.guid];//Удалить обработчик по его номеру

	for(var any in handlers)if(handlers.hasOwnProperty(any))return;//TODO: проверить, что тут делается. Глупость какая-то.Проверить, не пуст ли список обработчиков
	//Если пуст, то удалить служебный обработчик и очистить служебную структуру events[type]
	thisObj.detachEvent("on" + _type, _[handleUUID]);

	delete _[eventsUUID][_type];

	//Если событий вообще не осталось - удалить events и _[handleUUID] за ненадобностью.
	for(var any in _[eventsUUID])if(_[eventsUUID].hasOwnProperty(any))return;
	
	delete _[handleUUID];
	delete _[eventsUUID];
}

if(!document.dispatchEvent)global.dispatchEvent = document.dispatchEvent = function(event) {
	try {
		this.fireEvent("on" + event.type, event);
	}
	catch(e) {
		//custome events
		if(e.number === -2147024809) {//"Недопустимый аргумент."
			event._custom_event_ = true;//FOR DEBUG
			commonHandle.call(this, event);
		}
		else throw e;
	}
}

if(!document.createEvent) {/*IE < 9 ONLY*/
	/**
	 * @param {string=} _type
	 * @param {boolean=} _bubbles
	 * @param {boolean=} _cancelable
	 */
	function _initEvent(_type, _bubbles, _cancelable) {
		if(_type == void 0 || _bubbles == void 0 || _cancelable == void 0) {
			//WRONG_ARGUMENTS_ERR
			throw new Error('WRONG_ARGUMENTS_ERR');
		}
	
		this.type = _type;
		this.cancelBubble = //TODO:: <-- testing
			!(this.bubbles = _bubbles);
		this.cancelable = _cancelable;//https://developer.mozilla.org/en/DOM/event.cancelable
		
		this.isTrusted = false;
		this.target = null;		
	}
	function _initCustomEvent(_type, _bubbles, _cancelable, _detail) {
		//https://developer.mozilla.org/en/DOM/CustomEvent
		_initEvent.call(this, _type, _bubbles, _cancelable);
		
		this.detail = _detail;
	}
	function _initUIEvent(_type, _bubbles, _cancelable, _view, _detail) {
		//https://developer.mozilla.org/en/DOM/event.initUIEvent
		_initCustomEvent.call(this, _type, _bubbles, _detail);
		
		this.view = _view;
	}
	function _initMouseEvent(_type, _bubbles, _cancelable, _view, 
                     _detail, _screenX, _screenY, _clientX, _clientY, 
                     _ctrlKey, _altKey, _shiftKey, _metaKey, 
                     _button, _relatedTarget) {
		//https://developer.mozilla.org/en/DOM/event.initMouseEvent
		_initUIEvent.call(this, _type, _bubbles, _view, _cancelable);
		
		this.screenX = _screenX;
		this.screenY = _screenY;
		this.clientX = _clientX;
		this.clientY = _clientY;
        this.ctrlKey = _ctrlKey;
		this.altKey = _altKey;
		this.shiftKey = _shiftKey;
		this.metaKey = _metaKey;
		this.button = _button;
		this.relatedTarget = _relatedTarget;
	}
	/*
	_type in [DOMAttrModified, DOMCharacterDataModified, DOMNodeInserted, DOMNodeInsertedIntoDocument, DOMNodeRemoved, DOMNodeRemovedFromDocument, DOMSubtreeModified]
	_attrChange in [MutationEvent.MODIFICATION, MutationEvent.ADDITION, MutationEvent.REMOVA]
	*/
	function _initMutationEvent(_type, _bubbles, _cancelable, _relatedNode, _prevValue, _newValue, _attrName, _attrChange) {
		//http://help.dottoro.com/ljifcdwx.php
		_initEvent.call(this, _type, _bubbles, _cancelable);
		
		this.relatedNode = _relatedNode;
		this.prevValue = _prevValue;
		this.newValue = _newValue;
		this.attrName = _attrName;
        this.attrChange = _attrChange;
	}
	//No "MutationNameEvent": eventObject.initMutationNameEvent and "TextEvent"/"TextEvents": eventObject.initTextEvent, "KeyboardEvent":eventObject.initKeyEvent implimentation because of lack major browsers support

	/**
	 * https://developer.mozilla.org/en/DOM/document.createEvent
	 * @param {string} eventType is a string that represents the type of event to be created. Possible event types include "UIEvents", "MouseEvents", "MutationEvents", and "HTMLEvents". See https://developer.mozilla.org/en/DOM/document.createEvent#Notes section for details.
	 */
	document.createEvent = function(eventType) {
		var eventObject;
		
		eventObject = document.createEventObject();
		
		eventObject.returnValue = true;//default value
		eventObject.initEvent = _initEvent;
		eventObject.initCustomEvent = _initCustomEvent;
		eventObject.initUIEvent = _initUIEvent;
		eventObject.initMouseEvent = _initMouseEvent;
		eventObject.initMutationEvent = _initMutationEvent;
		
		return eventObject;
	}
}

})();

/**
	@deprecate Оставлено только для совместимости
	@namespace Класс для работы с событиями
	22.11.11    ver.last Объект устарел. Сделал events-shim для IE < 9 вместо этого объекта
	02.08.11    ver.2.2.1 Добавил экспортируемые функции Events.addEventListener и Events.removeEventListener
	19.01.11	ver.2.2.0.1 (!)Исправил небольшой баг в Opera в fixEvent, связаный с вычислением event.relatedTarget
	15.11.10	ver.2.2.0::Важное: выключил возможность игнорировать событие по guid, т.к. неюзабельно
	30.09.10	ver.2.1.3
	Event -> Events
*/
var Events = global["Events"] = (function() {
	return {
		//Объект, в котором хранятся пары "название события"-"пользовательская функция добавления"
		//"пользовательская функция добавления" должна возвращать guid функции добавленной к событию
		userAdd : {},

		//Синонимы для типов событий. Используются для игнорирования виртуальных событий.
		//Заполняется вместе с userAdd
		typeSinonims : [],

		//добавить обработчик события.
		add: function(elem, type, handler) {
			elem.addEventListener(type, handler, false);
		},

		// удалить обработчик события
		remove: function(elem, type, handler) {
			elem.addEventListener(type, handler, false);
		}
	}
}())

// new Event(...) and new CustomEvent(...) from github.com/Raynos/DOM-shim/ with my fixing

// Chrome throws error if using Error
// IE9 says Event is an object and not a function -.- 
// IE8 doesn't like it and gives a different error messsage!
// Firefox also says no
// Safari says me too, me too!
// Opera throws a DOM exception instead ¬_¬
;(function () {
	// Event constructor
	var _Event = function (type, dict) {
		var e = document.createEvent("Events");
		
		dict = dict || {};
		dict.bubbles = dict.bubbles || false;
		dict.catchable = dict.catchable || false;
		e.initEvent(type, dict.bubbles, dict.catchable);
		
		return e;
	};
	
	var eventProto;
    try {
		eventProto = Event.prototype;
        new Event("click");
    } catch (e) {
        //Убрал проверку на текст ошибки, т.к., по моему, она лишняя. И, таки да, в IE на русской ОС эта проверка ошибочна :(
		/*if (e.type === "illegal_invocation" ||
            e.message === "Object doesn't support this action" ||
            e.message === "Object doesn't support property or method 'initEvent'" ||
            e.message === "CustomEvent is not a constructor" ||
            e.message === "Type error" ||
            e.message === "NOT_SUPPORTED_ERR"
        )*/
		global["Event"] = _Event
		
        if(eventProto)_Event.prototype = eventProto;//В IE < 8 не удастся получить Event.prototype
    }
})();

// Chrome calling .initEvent on a CustomEvent object is a no-no
// IE9 doesn't like it either
// IE8 says no in its own special way.
// Firefox agrees this cannot be done
// Safari says lul wut?
// Opera says have another DOM exception!
;(function () {
	// CustomEvent constructor
	var _CustomEvent = function (type, dict) {
		var e = document.createEvent("CustomEvent");
					
		dict = dict || {};
		dict.detail = dict.detail || null;
		dict.bubbles = dict.bubbles || false;
		dict.catchable = dict.catchable || false;
		if (e.initCustomEvent) {
			e.initCustomEvent(type, dict.bubbles, dict.catchable, dict.detail);
		} else {
			e.initEvent(type, dict.bubbles, dict.catchable);
			e.detail = dict.detail;
		}
		
		return e;
	};

	var customEventProto;
    try {
		customEventProto = (global["CustomEvent"] || Event).prototype;//global использую, чтобы ошибка раньше времени не возникла и был шанс получить Event.prototype
        var c = new CustomEvent("magic");
    } catch (e) {
        //Убрал проверку на текст ошибки, т.к., по моему, она лишняя. И, таки да, в IE на русской ОС эта проверка ошибочна :(
		/*if (e.type === "illegal_invocation" ||
            e.message === "Object doesn't support this action" ||
            e.message === "Object doesn't support property or method 'initEvent'" ||
            e.message === "CustomEvent is not a constructor" ||
            e.message === "Type error" ||
            e.message === "NOT_SUPPORTED_ERR"
        )*/
		global["CustomEvent"] = _CustomEvent
			
        if(customEventProto)_CustomEvent.prototype = customEventProto;//В IE < 8 не удастся получить CustomEvent.prototype
    }
})();



/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Events  ======================================  */
/*  ======================================================================================  */



/*  ======================================================================================  */
/*  =======================================  Utils  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/**
 * Проверяет на наличие CSS-класса value у элемента element
 * @deprecated
 * @version 2.2
 * @param {!HTMLElement|Node} element
 * @param {!string} value
 * @return {boolean}
 */
var isCssClass = "classList" in browser.testElement ? 
	function(element, value) {return element["classList"].contains(value);}//HTML5 & JavaScript 1.8	
	:
	function(element, value) {
		if(!element.className)return false;
		return !!~(" " + element.className + " ").indexOf(" " + value + " ");
	}
/**
 * Удаляет CSS-класс value из списка классов элемента element
 * @deprecated
 * @version 2.2
 * @param {!HTMLElement|Node} element
 * @param {!string} value
 * @return {HTMLElement|Node} обработаный элемент element
 */
var removeCssClass = "classList" in browser.testElement ? 
	function(element, value) {return element["classList"].remove(value), element;}//HTML5 & JavaScript 1.8	
	:
	function(element, value) {
		var re = new RegExp("(^|\\s)" + value + "(\\s|$)", "g");
		element.className = element.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		return element;
	}
/**
 * Добавляет к списку классов элемента element CSS-класс value
 * @deprecated
 * @version 2.2
 * @param {!HTMLElement|Node} element
 * @param {!string} value
 * @return {HTMLElement|Node} обработаный элемент element
 */
var addCssClass = "classList" in browser.testElement ? 
	function(element, value) {return element["classList"].add(value), element;}//HTML5 & JavaScript 1.8	
	:
	function(element, value) {
		var re = new RegExp("(^|\\s)" + value + "(\\s|$)", "g");
		if(re.test(element.className))return element;
		element.className = (element.className + " " + value).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
		return element;
	}
/**
 * Проверка, является ли объект числом
 * EN: Is a given value a number?
 * @param {!Object} obj
 * @return {boolean}
 */
function isNumber(obj) {
	//return (obj === +obj) || (toString.call(obj) === '[object Number]');
	return !isNaN(obj);
}

/**
 * Проверка, является ли объект объектом типа HTMLElement
 * @param {!Object} obj Проверяемый объект
 * @return {boolean}
 */
function isHTMLElement(obj) {
	try {
		if(obj instanceof Element)return true;
	}
	catch(e) {//IE doesn't give you access to the HTMLElement prototype
		try {
			if(obj.nodeType == 1)return true;
		}
		catch(b) {}
	}
	return false;
}

/**
 * Внешняя forEach для массивов и объектов
 * Не использует встроенный в Array метод forEach, для того, чтобы сделать прерывание по iterator.call() == false
 * Hint: Для Array вызывайте метод [].forEach()
 * @param {!Array|Object} obj Объект или массив, который будем перебирать
 * @param {!Function} iterator функция вызываемая для каждого найденного элемента
 * @param {Object=} context Контент в рамках которого мы будем вызывать функцию
 * @return {Array|Object} объект или массив obj
 */
global["forEach"] = function forEach(obj, iterator, context) {
	for(var key in obj)
		if(_hasOwnProperty(obj, key))if(iterator.call(context, obj[key], key, obj) === false)break;
    return obj;
}
/**
 * String repeat
 * @param {!string} str Исходная строка
 * @param {!number} count Кол-во повторений
 * @return {string} Результирующая строка
 */
var repeatString = global["repeatString"] = function(str, count) {
	return Array(++count).join(str);
	/*OLD:
	var / @type {string} /s = "";
	while(count-- > 0)s += str;
	return s;*/
}

/**
 * Random string
 * !!! ВНИМАНИЕ !!! Результирующая строка ~ в 5% случаев будет длинной length - 1
 * @param {!number} length Размер строки
 * @return {string}
 * TODO:: Поддержка length > 10. Сейчас получается хрень: randomString(14) == "l.5lqc17jlpzt(e+13)"
 */
var randomString = global["randomString"] = function(length) {
	/*Вместо вызова функции repeatString вставил тело этой функции - для улучшения производительности*/
    return (Math.round(Math.random() * parseInt(Array(++length).join("z"), 36))).toString(36);//36 - 0-9a-z
}
/* OLD::
function randomString(length) {
    //var cs = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    var cs = '0123456789abcdefghiklmnopqrstuvwxyz'.split('');
    
    var / @type {string} /str = '', 
    	/ @type {number} /csl = cs.length, 
    	/ @type {number} /i = -1,
    	/ @type {number} /l = length || Math.floor(Math.random() * csl);
    while (++i < l)str += cs[Math.floor(Math.random() * csl)];
    return str;
}
*/

/**
 * toArray function for Array-like collection, number and string
 * Преобразует 'Array-like коллекцию с числовыми ключами'/число/строку в массив.
 * Можно задать выборку через start и end. Трактовка start и end аналогичная функции Array::slice
 *  Если start отрицателен, то он будет трактоваться как arrayObj.length+start (т.е. start'ый элемент с конца массива). 
 *  Если end отрицателен, то он будет трактоваться как arrayObj.length+end (т.е. end'ый элемент с конца массива).
 *  Если второй параметр не указан, то экстракция продолжится до конца массива. Если end < start, то будет создан пустой массив.
 * @version 2.3.3
 *  changeLog: 2.3.3[13.11.2011] [bug fix]
			   2.3.2[15.09.2011] Добавил проверку на кол-во результирующих элементов в результате выполнения Array.prototype.slice
			   2.3.1[19.05.2011] В секцию if(type == "object") { for(i in iterable)... Добавил проверку на наличие hasOwnProperty, а то в IE, у некоторых объектов этой функции нету
 *			   2.3  [14.04.2011] Переписал логику start и end
 *			   2.2  [13.04.2011] +@param forse для typeof iterable == "object"
 *			   2.1  [11.04.2011] Сделал несколько исключений для IE < 9
 *			   2    [09.04.2011] Переписал логику работы. Теперь принимает больше типов данных
 *			   1    [--.--.2010] First version from prototypejs (prototypejs.org) with no iterable.toArray section
 * @param {Object|Array|number|string|NodeList} iterable Любой Array-like объект, любой объект, число или строка
 * @param {number=} start Индекс элемента в массиве, с которого будет начинаться новый массив.
 * @param {number=} end Индекс элемента в массиве, на котором новый массив завершится.
 * @param {boolean=} forse Для typeof iterable == "object" смотреть свойства в цепочки прототипов объекта
 * @return {Array}
 * @example $A(iterable) -> actualArray
 */
var $A = global["$A"] = function(iterable, start, end, forse) {
	if(!iterable || start + end === 0)return [];
	if(start == end == void 0 && Array.isArray(iterable))return iterable;
	start = start || 0;//Default value
	
	var type = typeof iterable, results, trySlice = true,
		//args потому, что IE не понимает, когда в функцию Array::slice передают undefined вместо start и/или end
		args = [start];
	if(end)args.push(end);
	
	if(type == "number")iterable += "";
	
	//IE не умеет выполнять Array.prototype.slice для "string" и "number"
	if(browser.msie < 9 && (type == "number" || type == "string"))trySlice = false;
	
	if(typeof iterable.length == "number") {
		
		var _length = iterable.length,
			_start = start < 0 && (start = (_length + start), start) < 0 ? 0 : start,
			_end = (end == null ? _length : end < 0 && (end = (_length + end), end) < 0 ? 0 : end);
		
		_length = _end - _start;
				
		if(trySlice) try {//Попробуем применить Array.prototype.slice на наш объект
 			results = Array.prototype.slice.apply(iterable, args);//An idea from https://github.com/Quby/Fn.js/blob/master/fn.js::_.toArray
			//Match result length of elements with initial length of elements
			if(results.length === _length)return results;//Проверка !!!
		}
		catch(e) {//IE throw error with iterable == "[object NodeList]"
			//не получилось! -> выполняем обычную переборку
		}
		
		results = [];
		for( ; _start < _end ; ++_start)results.push(
			iterable.charAt ? 
				iterable.charAt(_start) : //typeof iterable == "string"
				iterable[_start] //typeof iterable == "object" with 'length' prop
		);
		
		return results;
	}
	
	results = [];
	
	if(type == "object") {
		for(var i in iterable)if(forse || !iterable.hasOwnProperty || iterable.hasOwnProperty(i))results.push(iterable[i]);
		return !start && !end && results || results.slice.apply(results, args);
	}
	
	return results;	
}

/**
 * Object.keys-like function for Array-like collection, number and string
 * Достаёт ключи объекта/массива и возвращяет их в виде массива
 * @param {Object|Array|number|string} iterable
 * @param {boolean=} forse Для typeof iterable == "object" смотреть свойства в цепочки прототипов объекта
 * @version 2.5
 *  changeLog: 2.5[16.06.2011] [*bug]В IE. Не доставал ключи, если iterable это arguments
			   2.1[31.05.2011] Вернул параметр forse для type == "object"
			   2  [24.05.2011] Добавил обработку number и string. Добавил вызов Object.keys, который должен быть реализован. Убрал параметр forse, т.к. не соответствует сигнатуре Object.keys
 *			   1  [--.04.2011] Initial realese
 */
var $K = global["$K"] = function(iterable, forse) {
	var type = typeof iterable,
		length,
		results;
		
	if(type == "object") {
		if(browser.msie && iterable.length && !(iterable instanceof Array))iterable = $A(iterable);//Если Arguments
		if(forse) {
			results = [];
			for(var i in iterable)results.push(i);
			return results
		}
		return Object.keys(iterable);
	}
	
	if(type == "number" || type == "string")length = (iterable + "").length;
	else if(typeof iterable.length == "number")length = iterable.length;
	else throw new TypeError('$K:non-iterable');
	
	results = [];
	if(length != void 0)for(var i = 0 ; i < length ; ++i)results.push(i);
	return results;
}

/* Minimum JSON JavaScript implementation */
/* Реализуем минимальную функциональность JSON */
if(!global.JSON)global.JSON = {
	parse : function(text) {
		return text && !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
			eval('(' + text + ')') || null;
	}
}

/**
 * Создаёт универсальный обработчик для всех или нескольких вложенных элементов
 * В качестве обработчика можно передавать хеш-массив(Object) или функцию.
 *  Если обработчик-хеш-массив(Object), то вызывается функция по значению найденного атрибута.
 *  Первым параметром передаётся event
 *  Вторым параметром передаётся элемент, в котором был найден атрибут. 
 *  Третьим параметром передаётся найденное значение атрибута. В последующие параметры передаются
 *   другие найденные атрибуты, если attribute-массив.
 * 
 * @param {(string|Array.<string>)} attribute Название атрибута или свойства по которому будет определятся функция для вызова из namedFunctions. Или массив атрибутов, первый из которых - название функции для вызова, остальные будут получены и переданы в функцию в качестве параметров вызова
 * @param {!(Function|Object)} namedFunctions Функция или Именованный хеш-массив(Object) функций типа: {"a" : funcA, "b" : funcB}
 * @param {Object?} context Контекст в рамках которого будет вызыватся функция. По-умолчанию, тот элемент на который bubbleEventListener вешается в качестве обработчика
 * @param {number?} flags 0x1(allowMany) [Default:false]-Разрешить множественный вызов. Функция продолжит поиск обработчиков при нахождении первого, 0x2(allowPropname) [Default:false]-Разрешить поиск не только по аттрибутам, но и по свойствам
 * @return {function(Event)} Событие для кнопок. "Вешается" DOM-функцияей addEventLintener. Должно быть подготовлено к использованию в IE
 * TODO:: Сделать правильную обработку атрибута "class"
 */
global["bubbleEventListener"] = function bubbleEventListener(attribute, namedFunctions, context, flags) {
	if(DEBUG) {
		if(!namedFunctions || 
		   (typeof namedFunctions != "object" && typeof namedFunctions != funcType))	
				Log.err("bubbleEventListener::namedFunctions must be an Object or Function")
		else if(typeof namedFunctions == "object") {
			if(!$A(namedFunctions).length)Log.err("bubbleEventListener::no functions are sets")
			else {
				var s = true;
				$K(namedFunctions).forEach(function(key){
					if(typeof namedFunctions[key] != funcType)s = false;
				})
				if(!s)Log.err("bubbleEventListener::all values in namedFunctions MUST be a Functions")
			}
		}
		if(Array.isArray(attribute) && !attribute.length)Log.err("bubbleEventListener::в массиве attribute должен быть хотябы один элемент")
	}

	var _attr = (Array.isArray(attribute) ? attribute[0] : attribute);//TODO:: Выяснить зачем я делал это -> .toLowerCase(); С propName это не работает
		
		return function(event) {
			var elem = event.target || (event.target = event.srcElement),
				/** @type {HTMLElement} Элемент, на котором останавливаем поиски action'а */
				stopElement = this,//Контекст this у функции !!!ДОЛЖЕН!!! указываеть на элемент, на который эту функцию повесили в качестве обработчика
				/** @type {string} Значение атрибута - имя функции */
				elemAttrValue,
				/** @type {(Object|null)} */
				f,//Функция для вызова
				result;
			
			/*if(_attr == "class") {//Только для аттрибута "class" делаем исключение
				//TODO:: Сделать, чтобы имя функция вызывалась даже тогда, когда в аттребуте "class" больше одного класса
			}*/
			
			do {
				if((elemAttrValue = elem.getAttribute(_attr) || flags & 0x2 && elem[_attr]) == null)continue;
				/** @type {Array} */
				var params = [event, elem, elemAttrValue];//Параметры вызова функции для apply()
				
				if(Array.isArray(attribute) && attribute.length > 1)
					for(var i = 1, l = attribute.length ; i < l ; ++i)params.push(elem.getAttribute(attribute[i]));
				
				if(typeof namedFunctions == funcType)result = namedFunctions.apply(context || stopElement, params);
				else {
					f = namedFunctions[elemAttrValue];
					if(f)result = f.apply(context || stopElement, params);
					else if(DEBUG)Log.log("bubbleEventListener::нету функции с названием " + elemAttrValue);
				}
				
				if(!(flags & 0x1))break;
			} while(elem != stopElement && (elem = elem.parentNode));
			
			return result;
		}
}


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Utils  ======================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ========================================  DOM  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * document.getElementById alias
 * Получение элемента по ID и добавление в него объекта-контейнера '_'. '_' можно использовать для хранения переменных,
 *  связанных с данным элементом, чтобы не захламлять пространство имён объекта
 * @param {!string|HTMLElement} id
 * @return {HTMLElement} найденный элемент
 */
var $ = global["$"] = function(id) {
	if(typeof id == 'string')id = document.getElementById(id);
	
	//if(id && !id._)id._ = {};
	
	return id;
};

/**
 * Функция возвращяет массив элементов выбранных по CSS3-велектору. 
 * Также добавляет во все наёденные элементы объекты-контейнеры '_'. '_' можно использовать для хранения переменных,
 *  связанных с данным элементом, чтобы не захламлять пространство имён объекта
 * Множественные селекторы, разделённые знаком "," не поддерживаются (смотрите функцию $$)
 * Вызывается querySelector, если поддерживается браузером
 * Данная функция поддерживает отличный от стандартного синтаксис: 
 * - Поддерживаются первые символы в селекторе - ">", "+" или "~".
 *  --!!! Побочный эффект: Если в браузере есть querySelector, то для каждого элемента из массива roots будет
 *        добавлен аттрибут "id", если его нету.
 * TODO:: Поддержка нестандартных псевдо-классов:
 *  -":parent"
 *  -":text-only" Только если элемент не содержит вложеных элементов - только, если содержит текст или пустой
 *    http://alastairc.ac/2006/10/text-nodes-and-css/
 *  -"::textNode" for selecting text nodes (node.nodeType == 3)
 *
 * @param {!string} selector CSS3-селектор
 * @param {Document|HTMLElement|Node|Array.<HTMLElement>=} roots Список элементов в которых мы будем искать
 * @param {boolean=} isFirst ищем только первый
 * @return {Array.<HTMLElement>}
 * @version 2
 *  changeLog: 2     [24.11.2011 02:00] * Вынес querySelectorAll implementation в a.ielt8.js
 *             1.5.5 [24.11.2011 00:00] * $$(">*", document), $$("~*", document), $$("+*", document) теперь вернёт [] - пустой результат
										- нестандартные псевдо-классы ":parent" и ":text-only" больше не поддерживаются
 *			   1.5.4 [11.07.2011 13:58] [*Bug]Включил поддержку символа "-" в названиях класса и идентификатора
 *			   1.5.3 [25.05.2011 13:42] [*Bug]Исправил баг с CSS-аттрибут-селектором '&='
 *			   1.5.2 [11.05.2011 13:36] [*Bug]Исправил баг, когда пытался получить tagName у childNodes[n] у которого nodeType != 1
 *			   1.5.1 [06.05.2011 14:34] [*Bug]Поправил баг появляющийся в "strict mode", когда mod не был объявлен
 * 			   1.5   [05.05.2011 17:03] [*Bug]Свойство tagName сравнивалось с tag из селектора в неправильном регистре
 *			   1.4.1 [09.04.2011  1:00] Имплементация нестандартных псевдо-классов :parent и :text-only
 *			   1.4   [09.04.2011  0:40] [*Bug]Элемент по-умолчанию должен быть document(было document.body)
 *			   1.3.1 [22.03.2011 13.05] [*Bug]Исправил баг со свойством $$N.str_for_id (добавил букву "r" в начало)
 *             1.3   [21.03.2011 19.21] [*Bug]Исправил баг с селектором вида ",<selecrot>" при использовании querySelector
 *             1.2   [23.02.2011 20:50] Изменён алгоритм вызова querySelector если первый символ в selector = [>|+|~]
 *  TODO:: Изучить код https://github.com/ded/qwery - может быть будет что-нибуть полезное
 */
function $$N(selector, roots, isFirst) {
	//TODO:: Не засовывать в result те элементы, которые уже были туда засованы
	roots = !roots ? [d] : (Array.isArray(roots) ? roots : [roots]);
	
	var /** @type {Array.<HTMLElement>} */result = [],
		/** @type {Node|Window|HTMLElement} */rt,
		/** @type {HTMLElement} */child,
		/** @type {number} */ir = -1,
		/** @type {number} */kr;
	
	//TODO:: вернуть назад поддержку нестандартных псевдо-классов
	//if(document.querySelector && !$$N.nonStandartPseudoClasses.regExp.test(selector)) {
	if(document.querySelector) {
		var /** @type {boolean} */isSpecialMod,
			/** @type {boolean} */noway = false,
			/** @type {string} */specialSelector;
			
		/* replace not quoted args with quoted one -- Safari doesn't understand either */
        if(browser.safary)
			selector = selector.replace(/=([^\]]+)/, '="$1"');
		
		if(selector.charAt(0) == ",")selector = selector.substr(1);
		isSpecialMod = /[>\+\~]/.test(selector.charAt(0));
        //TODO:: Тут ошибка. Селекторы вида ">*" не работают
		
		while(rt = roots[++ir]) {
			if(isSpecialMod) {
				if(rt == document)noway = true;//Бесполезно вызывать селекторы с начальными >, + или ~ для document
				else {
					if(!rt.id)rt.id = $$N.str_for_id + $$N.uid_for_id++;
					specialSelector = "#" + rt.id + selector;
					rt = rt.parentNode;
				}
			}
			else specialSelector = selector;
			if(noway){}
			else if(isFirst)result.push(rt.querySelector(specialSelector));
			else result = result.concat($A(rt.querySelectorAll(specialSelector)));
		}
		
		return result;
	}
	
	throw new Error("querySelector not supported")
}
/** @type {string} создания уникального идентификатора (HTMLElement.id) */
$$N.str_for_id = "r" + randomString(6);
/** @type {number} Инкреминтируемое поле для создания уникального идентификатора. Используется вместе с $$N.str_for_id */
$$N.uid_for_id = 0;

/**
 * Получение эллементов по классам и тэгам
 * @param {!string} selector Строка с CSS3-селектором
 * @param {Document|HTMLElement|Node|Array.<HTMLElement>=} roots Список элементов в которых мы будем искать
 * @param {boolean=} isFirst ищем только первый
 * @return {Array.<HTMLElement>} Список найденных элементов
 * @version 2
 */
var $$ = global["$$"] = function(selector, roots/*, noCache*/, isFirst) {
	//$$N.test = $$N["test"];//$$N["test"] TODO:: добавить в $$N["test"] проверку на нестандартные селекторы
	//TODO:: вернуть назад поддержку нестандартных псевдо-классов
	//if(document.querySelector && !($$N.test && $$N.test.test(selector)) {
	roots = roots || document;
	
	if(document.querySelector) {
		if(!Array.isArray(roots))return $A(roots.querySelectorAll(selector));
		
		var result = [],
			root,
			i = -1;
					
		while(root = roots[++i] && (!isFirst || !result.length))
			result.concat($A(root.querySelectorAll(selector)));
		
		return result;
	}
	
	throw new Error("querySelector not supported")
}

/**
 * @param {!string} selector
 * @param {Document|HTMLElement|Node=} root
 * @return {HTMLElement|Node}
 */
var $$0 = global["$$0"] = function(selector, root) {	
	return $$(selector, root, true)[0];
}

/**
 * @link https://developer.mozilla.org/en/DOM/window.getComputedStyle
 * getCurrentStyle - функция возвращяет текущий стиль элемента
 * @param {?Element} obj HTML-Элемент
 * @param {?string} pseudoElt A string specifying the pseudo-element to match. Must be null (or not specified) for regular elements.
 * @this {Window}
 * @return {CSSStyleDeclaration} Стиль элемента
 */
if(!global.getComputedStyle)global.getComputedStyle = function(obj, pseudoElt) {
	return obj.currentStyle;
}

/** Example of making a document HTML5 element safe
 * Функция "включает" в IE < 9 HTML5 элементы
 * Используется, если никакая другая аналогичная функция не используется
 */
function html5_document(doc) { // pass in a document as an argument
	// create an array of elements IE does not support
	var html5_elements_array = 'abbr article aside audio canvas command datalist details figure figcaption footer header hgroup keygen mark meter nav output progress section source summary time video'.split(' '),
	a = -1;

	while (++a < html5_elements_array.length) { // loop through array
		if(doc.createElement)doc.createElement(html5_elements_array[a]); // pass html5 element into createElement method on document
	}

	return doc; // return document, great for safeDocumentFragment = html5_document(document.createDocumentFragment());
} // critique: array could exist outside the function for improved performance?


//Исправляем для IE<9 создание DocumentFragment, для того, чтобы функция работала с HTML5
if(browser.msie && browser.msie < 9) {
	var msie_CreateDocumentFragment = function() {
		var df = 
			msie_CreateDocumentFragment.orig.call ? //В IE6 у функции createDocumentFragment нету call
			msie_CreateDocumentFragment.orig.call(this) :
			(this["__fake__cdf"] = msie_CreateDocumentFragment.orig)();
		
		if(!df.querySelector)df.querySelector = document.querySelector;
		if(!df.querySelectorAll)df.querySelectorAll = document.querySelectorAll;
		
		return html5_document(df);
	}
	msie_CreateDocumentFragment.orig = document.createDocumentFragment;
	
	document.createDocumentFragment = msie_CreateDocumentFragment;
}


/**
 * Issue: <HTML5_elements> become <:HTML5_elements> when element is cloneNode'd
 * Solution: use an alternate cloneNode function, the default is broken and should not be used in IE anyway (for example: it should not clone events)
 * В Internet Explorer'е функция <HTMLElement>.cloneNode "ломает" теги HTML5 при клонировании,
 *  поэтому нужно использовать альтернативный способ клонирования
 *
 * Больше по теме: http://pastie.org/935834
 *
 * Функция клонирует DOM-элемент
 * Альтернатива <Node>.cloneNode в IE < 9. В остальных браузерах просто вызывается <Node>.cloneNode
 * Дополнительно, функция удаляет id у вновь склонированного элемента, если delete_id != false
 * @param {Node|Element} element Элемент для клонирования
 * @param {boolean=} include_all [false] Клонировать ли все дочерние элементы? По-умолчанию, false
 * @param {boolean=} delete_id [false] Удалить аттрибут id из нового элемента? По-умолчанию, false
 * @version 3
 *  chacgeLog: 3 [23.11.2011 19:00] Переделал. include_all and delete_id default now false. Передаю в elementProto в качестве cloneNode для IE < 9
 *			   2 [06.07.2011 20:00] Добавил поддержку клонирования td и tr для IE < 9
 *			   1 [--.--.2011 --:--] Initial release
 */
var _cloneElement = global["cloneElement"] = function(element, include_all, delete_id) {//Экспортируем cloneNode для совместимости и для вызова напрямую	
	// Обновляем функции _cloneElement
	if(document.createDocumentFragment !== _cloneElement.oldCreateDocumentFragment && _cloneElement.safeElement != false)
		_cloneElement.safeElement = 
			(!!browser.msie && browser.msie < 9) ? (_cloneElement.oldCreateDocumentFragment = document.createDocumentFragment)().appendChild(document.createElement("div"))
			:
			false;
	
	include_all === void 0 ? include_all = false : 0;
	delete_id === void 0 ? delete_id = false : 0;
	
	var result;
	
	//Следующий вариант не работает с HTML5
	//if(_cloneElement.safeDocumentFragment) {
		//result = _cloneElement.safeDocumentFragment.appendChild(document.createElement("div"));//Создаём новый элемент
		
	if(_cloneElement.safeElement) {//Мы присваеваем _cloneElement.safeDocumentFragment только если браузер - IE < 9
		_cloneElement.safeElement.innerHTML = "";//Очистим от предыдущих элементов
		
		if(include_all && /td|tr/gi.test(element.tagName)) {//Только для элементов td и tr
			//Хак для IE < 9, для нормального копирования ячеек таблицы
			if(element.tagName.toUpperCase() == "TR") {
				_cloneElement.safeElement.innerHTML = "<table><tbody>" + element.outerHTML + "</tbody></table>";
				result = _cloneElement.safeElement.firstChild.firstChild.firstChild;
			}
			else if(element.tagName.toUpperCase() == "TD") {
				_cloneElement.safeElement.innerHTML = "<table><tbody><tr>" + element.outerHTML + "</tr></tbody></table>";
				result = _cloneElement.safeElement.firstChild.firstChild.firstChild.firstChild;
			}
		}		
		else {
			if(include_all)_cloneElement.safeElement.innerHTML = element.outerHTML; // set HTML5-safe element's innerHTML as input element's outerHTML
			else _cloneElement.safeElement.innerHTML = element.outerHTML.replace(element.innerHTML, "");
		
			result = _cloneElement.safeElement.firstChild; // return HTML5-safe element's first child, which is an outerHTML clone of the input element
		}
	}
	else result = element.cloneNode(include_all);
	
	if(delete_id && result.id)result.id = "";
	
	return result;
}

if(browser.msie && browser.msie < 9) {
	//elementProto["_cloneNode_"] = browser.testElement.cloneNode;//Original function
	elementProto["cloneNode"] = function(deep){return _cloneElement(this, deep)};
}

//Events
if(!browser.testElement.addEventListener && (!browser.msie || browser.msie > 7)) {
	elementProto.addEventListener = global.addEventListener;
	elementProto.removeEventListener = global.removeEventListener;
	elementProto.createEvent = global.createEvent;
	elementProto.dispatchEvent = global.dispatchEvent;
}


/*function getChildCount(container) {
	if('childElementCount' in container)return container.childElementCount;
	
	if(container.children)return container.children.length;
	
	// Firefox before version 3.5
	var child = container.firstChild,
		childCount = 0;
		
	while(child) {
		if(child.nodeType == 1)childCount++;
		child = child.nextSibling;
	}
	
	return childCount;
}*/
/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DOM  =======================================  */

/*  =======================================================================================  */
/*  ========================================  DEBUG  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

// Делаем консоль более "дружелюбной" 
// http://habrahabr.ru/blogs/javascript/116852/
// https://github.com/theshock/console-cap/blob/master/console.js
// 22.11.2011 Обновил до актуальной версии на github, но с ИЗМЕНЕНИЯМИ !!!!
(function (console) {

var i,
	fnProto = Function.prototype,
	fnApply = fnProto.apply,
	bind    = function (context, fn) {
		return function () {
				return fnApply.call( fn, context, arguments );
			};
	},
	methods = ['assert','count','debug','dir','dirxml','error','group','groupCollapsed','groupEnd','info','log','markTimeline','profile','profileEnd','table','time','timeEnd','trace','warn'],
	emptyFn = function(){},
	empty   = {},
	timeCounters;

for (i = methods.length; i--;) empty[methods[i]] = emptyFn;

if (console) {

	if (!console.time) {
		console.timeCounters = timeCounters = {};

		console.time = function(name, reset){
			if (name) {
				var time = +new Date, key = "KEY" + name.toString();
				if (reset || !timeCounters[key]) timeCounters[key] = time;
			}
		};

		console.timeEnd = function(name){
			var diff,
				time = +new Date,
				key = "KEY" + name.toString(),
				timeCounter = timeCounters[key];

			if (timeCounter) {
				diff  = time - timeCounter;
				console.info( name + ": " + diff + "ms" );
				delete timeCounters[key];
			}
			return diff;
		};
	}

	for (i = methods.length; i--;) {
		console[methods[i]] = methods[i] in console ?
			bind(console, console[methods[i]]) : emptyFn;
	}
	console.disable = function () { global.console = empty;   };
	  empty.enable  = function () { global.console = console; };

	empty.disable = console.enable = emptyFn;

} else {
	console = global.console = empty;
	console.disable = console.enable = emptyFn;
}

})( typeof console === 'undefined' ? null : console );

/**
 * @namespace Логирование
 */
var Log = global["Log"] = DEBUG ? (function() {
/* PRIVATE */
	var thisObj = {},
		_c = console,
		_countContainer = {},
		_groups = [];

/* PUBLICK */
	thisObj.start = function() {
		var name = arguments[0] || randomString(6);
		_c.time(name);
		thisObj.group(name + " START ");
		_groups.push(name);
		thisObj.log.apply(thisObj, $A(arguments, 1));
	}
	thisObj.end = function() {
		thisObj.log.apply(thisObj, $A(arguments));
		var name = _groups.pop();
		_c.timeEnd(name);
		thisObj.log(name + " END " + repeatString("-", _groups.length + 1));
		thisObj.groupEnd();
	}
	thisObj.log = function(var_args) {
		_c.log.apply(_c, arguments);
	}
	thisObj.logsFirst = function(count, uniqueName) {
		if(_countContainer[uniqueName] === void 0)_countContainer[uniqueName] = count;
		else _countContainer[uniqueName]--;
		if(_countContainer[uniqueName])thisObj.log.apply(thisObj, $A(arguments, 2));
	}
	thisObj.err = function() {
		_c.error.apply(_c, arguments);
	}
	thisObj.errsFirst = function(count, uniqueName) {
		if(!_countContainer[uniqueName])_countContainer[uniqueName] = count;
		else _countContainer[uniqueName]--;
		if(_countContainer[uniqueName])thisObj.err.apply(thisObj, $A(arguments, 2));
	}
	
	thisObj.group = _c.group ? _c.group.bind(_c) : thisObj.log;//For IE
	thisObj.groupEnd = _c.groupEnd ? _c.groupEnd.bind(_c) : function(){};//For IE
	
	thisObj.assert = _c.assert ? _c.assert.bind(_c) : function(expression, falseMessage) {
		var isTrue;
		if(typeof expression == "function")isTrue = expression();
		else isTrue = !!expression;
		
		if(!isTrue)thisObj.error(falseMessage);
	}
   	
	/**
	 * @param {HTMLElement|Node} el
	 * @param {boolean=} addParentName Добавлять родительское имя?
	 */
	thisObj.name = function(el, addParentName) {
		return  el ? ((addParentName && el.parentNode && (thisObj.name(el.parentNode) + "->") || "") + 
			el.tagName + (el.id ? "#" + el.id : "") + (el.className ? "." + el.className.replace(/ /g, ".") : ""))
				  : "";
	}
	
	thisObj.dump = function(obje, obj_name, prefix, postfix/*, maxLvl*/) {
		if(prefix === void 0)prefix = "";
		if(postfix === void 0)postfix = "";
		
		//if(maxLvl > 9)maxLvl = 9;
		
		var result = (obj_name || "") + ":";
		var hop = Object.prototype.hasOwnProperty;
	
		for(var i in obje) if(hop.call(obj, i)) {
			/*if(typeof obje[i] == "object" && maxLvl)result += prefix + dump(obje[i], i, prefix, postfix, --maxLvl) + postfix
			else */result += prefix + i + "=" + obje[i] + postfix;
		}
		return result;
	} 
	
	return thisObj;
})() : null;

/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DEBUG  =====================================  */

/* end ФУНКЦИИ ДЛЯ РАБОТЫ */

/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ===================================  Функции сайта  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ======================================================================================  */

/**
 * @namespace объект со специфическими свойствами магазина
 */
var Site = global["Site"] = {
	/*Export begin*/
	/* Константы */
	/** Исходный заголовок страницы
	 * @const 
	 * @type {string} */
	"title" : document.title,
	/** @const 
	 * @type {string} */
	"path" : location.protocol + "//" + location.host + location.pathname,
	/* Переменные */

	"inits" : [],
	"afterLoads" : [],
	/*Export end*/
	
	/* Функции */
	afterPageLoad : function() {
		if(browser.noDocumentReadyState)document.readyState = "complete";
		
		for(var i in Site["afterLoads"])if(Site["afterLoads"].hasOwnProperty(i) && typeof (i = Site["afterLoads"][i]) == "function")i();		
	},
	
	/**
	 * Инициализация сайта
	 */
	init : function() {
		if(browser.noDocumentReadyState)document.readyState = "interactive";
		
		//Добавим к тегу <HTML> класс с названием браузера/движка
		document.documentElement.className += (" " + browser.names.join(" "));
		
		for(var i in Site["inits"])if(Site["inits"].hasOwnProperty(i) && typeof (i = Site["inits"][i]) == "function")i();
	}
}

/***----------------- СТАРТ ------------------***/

Events.add(global, 'DOMContentLoaded', Site.init);
Events.add(global, 'load', Site.afterPageLoad);

})(window);