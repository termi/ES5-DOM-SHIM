// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name a.js
// @check_types
// ==/ClosureCompiler==
/**
 * module
 * @version 4
 * TODO:: eng comments
 *        dateTime prop for IE < 8
 */

//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = false;
/** @define {boolean} */
var INCLUDE_EXTRAS = true;
//GCC DEFINES END

;(
/**
 * @type {Window}
 * @const */
function(global) {

"use strict";

/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

var /** @const */funcType = "function";


/** @type {Object}
 * @const */
var browser = global["browser"] = {
/** @type {string}
 * @const */
	agent : navigator.userAgent.toLowerCase()
};

if(INCLUDE_EXTRAS) {

//Определение браузера и поддерживаемых возможностей
//Если что-то еще понадобится, можно посмотреть тут https://github.com/mrdoob/system.js

/** @type {Array}
 * @const */
browser.names = browser.agent.match(/(mozilla|compatible|chrome|webkit|safari|opera|msie|iphone|ipod|ipad)/gi);
/** @type {number} */
var len = browser.names.length;
while(len-- > 0)browser[browser.names[len]] = true;
//Alians'es
/** @type {boolean}
 * @const */
browser.webkit = browser["webkit"];
/** @type {boolean}
 * @const */
browser.mozilla = browser["mozilla"] = browser["mozilla"] && !browser["compatible"] && !browser.webkit;
/** @type {boolean}
 * @const */
browser.chrome = browser["chrome"];
/** @type {boolean}
 * @const */
browser.safari = browser["safari"] = browser["safari"] && !browser.chrome;
/* * @ type {boolean}
 * @ const */
//browser.opera = browser["opera"];//No need in this version of GCC
/** @type {boolean}
 * @const */
browser.msie = browser["msie"] = browser["msie"] && !browser.opera;
/** @type {boolean}
 * @const */
browser.iphone = browser["iphone"];
/** @type {boolean}
 * @const */
browser.ipod = browser["ipod"];
/** @type {boolean}
 * @const */
browser.ipad = browser["ipad"];

if(browser.msie)for(var i = 6 ; i < 11 ; i++)//IE from 6 to 10
	if(new RegExp('msie ' + i).test(browser.agent)) {
		browser.msie = browser["msie"] = i;
		
		break;
	}
browser["msie"] = browser.msie;

/** @type {string}
 * @const */
browser["cssPrefix"] = 
	browser.mozilla ? "Moz" :
	browser.webkit || browser.safari ? "Webkit" ://and iPad, iPhone, iPod
	browser.opera ? "O" :
	browser.msie ? "ms" : 
	"";
	
}//if(INCLUDE_EXTRAS)





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
	var __method = this, args = _arraySlice.call(arguments, 1);
	return function() {
		return __method.apply(object, args.concat(Array["from"](arguments)));
	}
}
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Function prototype  ==================================  */
/*  =======================================================================================  */

var 
    _arraySlice = Array.prototype.slice
  
  , _applyFunction = Function.prototype.apply
	
  , _hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty)
  
  , /**
	 * Call _function
	 * @param {Function} _function function to call
	 * @param {*} context
	 * @param {...} var_args
	 * @return {*} mixed
	 * @version 2
	 */
	_call = function(_function, context, var_args) {
		// If no callback function or if callback is not a callable function
		// it will throw TypeError
        return _applyFunction.call(_function, context, _arraySlice.call(arguments, 2))
	}
	
  , /** @type {Element}
	 * @const */
	_testElement = 
		document.createElement["orig"] ? 
			_call(document.createElement["orig"], document, 'div') : //[ielt8]
			document.createElement('div')
	
	//Fixed `toObject` to work for strings in IE8 and Rhino. Added test spec for `forEach`.
	//https://github.com/kriskowal/es5-shim/pull/94
  , need_prepareString = (function(strObj) {
		// Check failure of by-index access of string characters (IE < 9)
		// and failure of `0 in strObj` (Rhino)
		return strObj[0] != "a" || !(0 in strObj);
	})(Object("a"))
	
	/**
	 * @param {!Object} obj
	 * @param {boolean=} _allowNull
	 */
  , _toObject = function(obj, _allowNull) {
		if (obj == null && !_allowNull) // this matches both null and undefined
			throw new TypeError(); // TODO message
		
		// If the implementation doesn't support by-index access of
		// string characters (ex. IE < 9), split the string
		if (need_prepareString && typeof obj == "string" && obj)
			return obj.split("");
		
		return Object(obj);
	}
	
  , _throwDOMException = function(errStr) {
		var ex = Object.create(DOMException.prototype);
		ex.code = DOMException[errStr];
		ex.message = errStr +': DOM Exception ' + ex.code;
		throw ex;
	}
	//Take Node.prototype or silently take a fake object
	// IE < 8 support in a.ielt8.js and a.ielt8.htc
  , nodeProto = global["Node"] && global["Node"].prototype || {};
	
	
if(!global["HTMLDocument"])global["HTMLDocument"] = global["Document"];//For IE9
if(!global["Document"])global["Document"] = global["HTMLDocument"];//For IE8
//TODO:: for IE < 8 :: if(!global["Document"] && !global["HTMLDocument"])global["Document"] = global["HTMLDocument"] = ??;//for IE < 8


//Fix Function.prototype.apply to work with generic array-like object instead of an array
// test: (function(a,b){console.log(a,b)}).apply(null, {0:1,1:2,length:2})
var trueApply = false;
try {
	trueApply = isNaN.apply(null, {})
}
catch(e) { }
if(!trueApply) {
	Function.prototype.apply = function(contexts, args) {
		try {
			return args != undefined ?	
				_applyFunction.call(this, contexts, args) :
				_applyFunction.call(this, contexts);
		}
		catch (e) {
			if(e["number"] != -2146823260 ||//"Function.prototype.apply: Arguments list has wrong type"
				args.length === void 0 || //Not an iterable object
			   typeof args === "string") //Avoid using String
				throw e;
				
			args = Array["from"](args);
			
			return _applyFunction.call(this, contexts, args);
		}
	}
}


/*  =======================================================================================  */
/*  ======================================  Classes  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * @param {boolean=} overwrite 
 * @return {function(this:Object, Object, ...[*]): Object}
 */
function createExtendFunction(overwrite) {
	return function(obj, ravArgs) {
		for(var i = 1; i < arguments.length; i++) {
			var extension = arguments[i];
			for(var key in extension)
				if(_hasOwnProperty(extension, key) &&
				   (overwrite || !_hasOwnProperty(obj, key))
				  )obj[key] = extension[key];
		}
		
		return obj;
	}
}

/**
 * Merge the contents of two or more objects together into the first object.
 * This function does not overwrite existing properties
 * @param {Object} obj Object to extend
 * @param {...} ravArgs extentions
 * @return {Object} the same object as `obj`
 */
Object["append"] = createExtendFunction();

/**
 * Merge the contents of two or more objects together into the first object.
 * This function overwrite existing properties
 * @param {Object} obj Object to extend
 * @param {...} ravArgs extentions
 * @return {Object} the same object as `obj`
 */
Object["extend"] = createExtendFunction(true);


/**
 * Наследует класс Child от Parent - фактически, только добавляет prototype Parent в цепочку прототипов Child. Не выполняет инициализирующий код содержащийся в конструкторе Parent, поэтому в конструкторе Child нужно дополнительно вызвать Child.superclass.constructor.call(this, ...)
 * @param {Function} Child
 * @param {Function} Parent
 */
Object["inherit"] = function(Child, Parent) {
	(Child.prototype = Object.create(Child["superclass"] = Parent.prototype)).constructor = Child;
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
/*global["append"] = function(f, addMe) {
	for (var i in addMe) {
		f.prototype[i] = addMe[i];
	}
}*/


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Classes  ======================================  */
/*  =======================================================================================  */



/*  =======================================================================================  */
/*  =================================  Utils.Dom  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(!global["Utils"])global["Utils"] = {};
if(!global["Utils"]["Dom"])global["Utils"]["Dom"] = {};

/**
 * Utils.Dom.DOMStringCollection
 * DOMSettableTokenList like object
 * http://www.w3.org/TR/html5/common-dom-interfaces.html#domsettabletokenlist-0
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
		if(token === "")_throwDOMException("SYNTAX_ERR");
		if((token + "").indexOf(" ") > -1)_throwDOMException("INVALID_CHARACTER_ERR");
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

		var i, l, thisObj = this;
		while((i = thisObj._container.indexOf(token)) !== -1) {
			delete thisObj._container[i];//[BUG*fix]prevente strange bug in FireFox 8 then after thisObj._splice(i, 1) this.length == 0 but this[0] return value O_0//DOTO:: проверить
			thisObj._container.splice(i, 1);
		}
		for(i = 0, l = thisObj._container.length ; i < l ; ++i) {
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
				delete this[i];
			this.length = 0;
			this._container = [];
			this.value = "";
		}

		if(string && (string = string.trim()))
			string.split((new RegExp("\\s+", "g"))).forEach(this.add.bind(this));
		
		if(isChange && this._onchange)this._onchange.call(this)

		return this;
	}
}
for(var key in methods)DOMStringCollection.prototype[key] = methods[key];
//[ie8 BUG]Метод toString не показывается в цикле for
DOMStringCollection.prototype.toString = function(){return this.value||""}



/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Utils.Dom  ==================================  */
/*  =======================================================================================  */

// --------------- ================ es5 shim ================ ---------------
// Based on https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js

/*  =======================================================================================  */
/*  =================================  Object prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */


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
        hasDontEnumBug = !{"toString":null}.propertyIsEnumerable(DontEnums[0]),
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


/*
TODO:
1. jsdoc
*/
if(!Object.getOwnPropertyNames)Object.getOwnPropertyNames = Object.keys;

/**
 * @param {!Object} object
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
 * @param {!Object} object
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
 * @param {!Object} object
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
    var definePropertyWorksOnObject = doesDefinePropertyWork({}),
		definePropertyWorksOnDom = doesDefinePropertyWork(_testElement);
		
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty,
			definePropertiesFallback = Object.defineProperties;
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

		//[IE < 9]Save original attribute value using special `setAttribute` function
		if(object.setAttribute && object.setAttribute["ielt9"] && object.hasAttribute(property))
			object.setAttribute(property, object.getAttribute(property), true/*_forceSaveAttribute*/);
			
        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {				
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
				if (exception["number"] === -0x7FF5EC54) {// IE 8 doesn't support enumerable:true
					descriptor.enumerable = false;
					try {
						return definePropertyFallback.call(Object, object, property, descriptor);
					} catch (exception) {
					
					}
				}
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
				(object.__lookupGetter__(property) || object.__lookupSetter__(property))) {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = Object.prototype;
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
                if(Object.defineProperty["ielt8"]) {//Set `Object.defineProperty["ielt8"] = true` in a.ielt8.js
					if(descriptor["get"] !== void 0)
						object["get" + property] = descriptor["get"];
					if(descriptor["set"] !== void 0)
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

if(nodeProto["ie"] && browser.msie < 8)nodeProto["ielt8"] = Object.defineProperty["ielt8"] = true;

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
	Object.defineProperties = function defineProperties(object, properties) {
		// make a valiant attempt to use the real defineProperty
		// for I8's DOM elements.
		if (definePropertiesFallback) {
			try {
				return definePropertiesFallback.call(Object, object, properties);
			} catch (exception) {
				// try the shim if the real one doesn't work
			}
		}
        for (var property in properties) {
            if(_hasOwnProperty(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}


// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3

function doesGetOwnPropertyDescriptorWork(object) {
    try {
        object["sentinel2"] = 0;
        return Object.getOwnPropertyDescriptor(
            object,
            "sentinel2"
        ).value === 0;
    } catch (exception) {
        // returns falsy
    }
}

// check whether getOwnPropertyDescriptor works if it's given. Otherwise,
// shim partially.
if (Object.getOwnPropertyDescriptor) {
    var getOwnPropertyDescriptorWorksOnObject = 
        doesGetOwnPropertyDescriptorWork({});
    var getOwnPropertyDescriptorWorksOnDom =
        doesGetOwnPropertyDescriptorWork(_testElement);
    if (!getOwnPropertyDescriptorWorksOnDom || 
        !getOwnPropertyDescriptorWorksOnObject
    ) {
        var _getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
    }
}

if (!Object.getOwnPropertyDescriptor || _getOwnPropertyDescriptorFallback) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

	/**
	 * @param {Object} object The object in which to look for the property.
	 * @param {string} property The name of the property whose description is to be retrieved
	 * @this {Object}
	 * @return {Object|undefined}
	 */
    Object.getOwnPropertyDescriptor = function _getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null) {
            throw new TypeError(ERR_NON_OBJECT + object);
        }

        // make a valiant attempt to use the real _getOwnPropertyDescriptor
        // for I8's DOM elements.
        if (_getOwnPropertyDescriptorFallback) {
            try {
                return _getOwnPropertyDescriptorFallback.call(Object, object, property);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If object does not owns property return undefined immediately.
        if (!_hasOwnProperty(object, property)) {
            return;
        }

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        var descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (object.__defineGetter__) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var _prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = object.__lookupGetter__(property);
            var setter = object.__lookupGetter__(property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = _prototype;

            if (getter || setter) {
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Object prototype  ==================================  */
/*  =======================================================================================  */

/*  ======================================================================================  */
/*  ==================================  Array.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */


/*  ================================ ES6 ==================================  */
// Based on https://github.com/paulmillr/es6-shim/

var _arrayFrom = 
/**
 * toArray function
 * RUS: Преведение к массиву
 * 
 * @param {Object} iterable object
 * @return {Array}
 */
Array["from"] || (Array["from"] = function(iterable) {
	if(Array.isArray(iterable))return iterable;

	var object = _toObject(iterable, true),
		result = [];
		
	for(var key = 0, length = object.length >>> 0; key < length; key++) {
		if(key in object)
			result[key] = object[key];
	}

	return result;
})

/**
 * return array of arguments of this function
 * RUS: Преведение к массиву состоящему из аргументов функции
 * 
 * @param {...} args
 * @return {Array}
 */
Array["of"] = Array["of"] || function(args) {
	return _arraySlice.call(arguments);
}

/**
 * Non-standart method
 * https://gist.github.com/1044540
 * Create a new Array with the all unique items
 * @return {Array}
 */
if(!Array.prototype["unique"])Array.prototype["unique"] = (function(a) {
  return function() {     // with a function that
    return this.filter(a) // filters by the cached function
  }
})(
  function(a,b,c) {       // which
    return c.indexOf(     // finds out whether the array contains
      a,                  // the item
      b + 1               // after the current index
    ) < 0                 // and returns false if it does.
  }
);

/* [ielt9, bug] IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12" */
if([1,2].splice(0).length != 2) {
	var _origArraySplice = Array.prototype.splice;
	Array.prototype.splice = function(index, howMany, elementsToAdd) {
		return _origArraySplice.call(this, index, howMany === void 0 ? (this.length - index) : howMany, _arraySlice.call(arguments, 2))
	}
}
/*  ================================ ES5 ==================================  */
// Based on https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js


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
 * @return {*} single value
 */
if(!Array.prototype.reduce)Array.prototype.reduce = function(accumulator, initialValue) {
	// ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception." in "_call" function

	var thisArray = _toObject(this),
		l = thisArray.length, i = 0;
	
	if((l === 0 || l === null) && (arguments.length <= 1))// == on purpose to test 0 and false.// no value to return if no initial value, empty array
		throw new TypeError("Array length is 0 and no second argument");
	  
	initialValue || (initialValue = (i++, thisArray[0]));
	
	for( ; i < l ; ++i) {
	  if(i in thisArray)
	    initialValue = _call(accumulator, undefined, initialValue, thisArray[i], i, thisArray);
	}

	return initialValue;
};

/**
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight
 *
Apply a function simultaneously against two values of the array (from right-to-left) as to reduce it to a single value.
reduceRight executes the callback function once for each element present in the array, excluding holes in the array, receiving four arguments: the initial value (or value from the previous callback call), the value of the current element, the current index, and the array over which iteration is occurring.

The call to the reduceRight callback would look something like this:
array.reduceRight(function(previousValue, currentValue, index, array) {
    // ...
});

The first time the function is called, the previousValue and currentValue can be one of two values. If an initialValue was provided in the call to reduceRight, then previousValue will be equal to initialValue and currentValue will be equal to the last value in the array. If no initialValue was provided, then previousValue will be equal to the last value in the array and currentValue will be equal to the second-to-last value.

 * @param {Function} accumulator Function to execute on each value in the array.
 * @param {*} initialValue Object to use as the first argument to the first call of the callback.
 */
if(!Array.prototype.reduceRight)Array.prototype.reduceRight = function(accumulator, initialValue)  {
	return _arrayFrom(this).
				slice(0).//Create new Array
					reverse().reduce(accumulator, initialValue);
};


/* ES5 15.4.4.18
 * http://es5.github.com/#x15.4.4.18
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
 */
Array.prototype.forEach || (Array.prototype.forEach = function(iterator, context) {
	var thisArray = _toObject(this);
	for(var i in thisArray)
		if(_hasOwnProperty(thisArray, i))
			_call(iterator, context, thisArray[i], parseInt(i, 10), thisArray);
})
var _forEach = Function.prototype.call.bind(Array.prototype.forEach);

/* ES5 15.4.4.14
 * http://es5.github.com/#x15.4.4.14
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
 */
if(!Array.prototype.indexOf)Array.prototype.indexOf = function(obj, n) {
	var thisArray = _arrayFrom(this);
	for(var i = n || 0, l = thisArray.length ; i < l ; i++)
		if(thisArray[i] === obj)return i;
	return -1;
}
/* ES5 15.4.4.15
 * http://es5.github.com/#x15.4.4.15
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
 */
if(!Array.prototype.lastIndexOf)Array.prototype.lastIndexOf = function(obj, i) {
	return _arrayFrom(this).
				slice(0).//Create new Array
					reverse().indexOf(obj, i)
}

/**
 * RUS: Проверяет, чтобы каждый элемент массива соответствовал некоторому критерию [JavaScript 1.6]
 * ES5 15.4.4.16
 * http://es5.github.com/#x15.4.4.16
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
 * @param {Function} callback критерий соответствия.
 * @param {Object=} opt_thisobj Контент в рамках которого мы будем вызывать функцию
 * @this {Object}
 * @return {boolean}
 */
if(!Array.prototype.every)Array.prototype.every = function(callback, opt_thisobj, _option_isAll) {
	if(_option_isAll === void 0)_option_isAll = true;//Default value = true
	var result = _option_isAll;
	_forEach(this, function(value, index) {
		if(result == _option_isAll)result = !!_call(callback, opt_thisobj, value, index, this);
	});
	return result;
}

/**
 * RUS: Проверяет, чтобы хотябы один элемент массива соответствовал некоторому критерию [JavaScript 1.6]
 * ES5 15.4.4.17
 * http://es5.github.com/#x15.4.4.17
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
 * @param {Function} callback критерий соответствия.
 * @param {Object=} opt_thisobj Контент в рамках которого мы будем вызывать функцию
 * @this {Object}
 * @return {boolean}
 */
if(!Array.prototype.some)Array.prototype.some = function(callback, opt_thisobj) {
	return Array.prototype.every.call(this, callback, opt_thisobj, false);
}

/*
From https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Array/filter
*/
if(!Array.prototype.filter)Array.prototype.filter = function(callback, thisArg) {
	// ES5 : "If IsCallable(callback) is false, throw a TypeError exception." in "_call" function
	
	var thisArray = _toObject(this),
		len = this.length >>> 0,
		result = [];
		
	for (var i = 0; i < len; i++)
		if (i in thisArray) {  
			var val = thisArray[i];// in case callback mutates this  
			if(_call(callback, thisArg, val, i, thisArray))result.push(val);
		}

	return result;
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
	var thisArray = _toObject(this),
		result = [];
	
	_forEach(this, function(v, k, obj) {
		var mappedValue = _call(callback, thisArg, v, k, obj);
		result[k] = v;
	})
	
    return result;
};

/**
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
 * Проверка, является ли объект массивом
 * EN: Returns true if an object is an array, false if it is not.
 * @param {*} obj The object to be checked
 * @return {boolean}
 */
Array['isArray'] = Array['isArray'] || function(obj) {
	return !!(obj && obj.concat && obj.unshift && !obj.callee);
};


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Array.prototype  ==================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  String.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * String repeat
 * @param {!number} count Кол-во повторений
 * @return {string} Результирующая строка
 */
if(!String.prototype.repeat)String.prototype.repeat = function(count) {
	return Array(++count).join(this + "");
}

/**
 [bugfix]
 * ES5 15.5.4.20
 * http://es5.github.com/#x15.5.4.20
 * Removes whitespace from both ends of the string.
 * The trim method returns the string stripped of whitespace from both ends. trim does not affect the value of the string itself.
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/Trim
 */
var whitespace = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || whitespace.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    whitespace = "[" + whitespace + "]";
    var trimBeginRegexp = new RegExp("^" + whitespace + whitespace + "*"),
        trimEndRegexp = new RegExp(whitespace + whitespace + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//from https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js
if(!String.prototype["startsWith"])String.prototype["startsWith"] = function(substring) {
	return this.indexOf(substring) === 0;
}

if(!String.prototype["endsWith"])String.prototype["endsWith"] = function(substring) {
	var substr = String(substring),
		index = this.lastIndexOf(substr);
	return index >= 0 && index === this.length - substr.length;
}

if(!String.prototype["contains"])String.prototype["contains"] = function(s) {
	return !!~this.indexOf(s);
}

if(!String.prototype["toArray"])String.prototype["toArray"] = function() {
	return this.split('');
}


// TODO::
//  1. Maybe https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/TrimRight ?
//  2. Maybe https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/TrimLeft ?

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  String.prototype  ==================================  */
/*  ======================================================================================  */



/*  ======================================================================================  */
/*  ======================================  Events  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(document.addEventListener) {//fix [add|remove]EventListener for all browsers that support it
	// FF fails when you "forgot" the optional parameter for addEventListener and removeEventListener
	// Agr!!! FF 3.6 Unable to override addEventListener https://bugzilla.mozilla.org/show_bug.cgi?id=428229
	// Opera didn't do anything without optional parameter
	var _rightBehavior = false,
		dummy = function () {
			_rightBehavior = true
		};
	
	try {
		_testElement.addEventListener("click", dummy);
		if(_testElement.click)
			_testElement.click();//testing
		else //If !_testElement.click -> modern browsers
			_rightBehavior = true;
	} catch (e) {
	
	} finally {
		if(!_rightBehavior) {//fixEventListenerAll
			_forEach(
				[global["document"],
				 global["HTMLDocument"] && global["HTMLDocument"].prototype,
				 global["Window"] && global["Window"].prototype,
				 nodeProto], 
				function (elementToFix) {
					if(elementToFix) {
						var old_addEventListener = elementToFix.addEventListener,
							old_removeEventListener = elementToFix.removeEventListener;
							
						if(old_addEventListener)elementToFix.addEventListener = function (type, listener, optional) {
							optional = optional || false;
							return old_addEventListener.call(this, type, listener, optional);
						}
						//elementToFix.addEventListener.shim = true;
						if(old_removeEventListener)elementToFix.removeEventListener = function (type, listener, optional) {
							optional = optional || false;
							return old_removeEventListener.call(this, type, listener, optional);
						}
						//elementToFix.removeEventListener.shim = true;
					}
					elementToFix = null;
				}
			);
		}
	}
}
else {
	//[add|remove]EventListener not supported
}

// new Event(...) and new CustomEvent(...) from github.com/Raynos/DOM-shim/ with my fixing
// Chrome throws error if using Error
// IE9 says Event is an object and not a function -.- 
// IE8 doesn't like it and gives a different error messsage!
// Firefox also says no
// Safari says me too, me too!
// Opera throws a DOM exception instead ¬_¬
/**
 * @constructor
 * @param {string} type
 * @param {Object=} dict
 */
var _Event = function (type, dict) {// Event constructor
	var e = document.createEvent("Events");
	
	dict = dict || {};
	e.initEvent(type, dict.bubbles || false, dict.cancelable || false);
	
	return e;
};

var eventProto;
try {
	eventProto = Event.prototype;
	new Event("click");
} catch (e) {
	global["Event"] = _Event
	
	if(eventProto)_Event.prototype = eventProto;//В IE < 8 не удастся получить Event.prototype
}

// Chrome calling .initEvent on a CustomEvent object is a no-no
// IE9 doesn't like it either
// IE8 says no in its own special way.
// Firefox agrees this cannot be done
// Safari says lul wut?
// Opera says have another DOM exception!
/**
 * @constructor
 * @param {string} type
 * @param {Object=} dict
 */
var _CustomEvent = function (type, dict) {// CustomEvent constructor
	var e;
	try {
		e = document.createEvent("CustomEvent");
	}
	catch(err) {//FF 3.6 cant create "CustomEvent"
		e = document.createEvent("Event");
	}
				
	dict = dict || {};
	dict.detail = (dict.detail !== void 0) ? dict.detail : null;
	(e.initCustomEvent || (e.detail = dict.detail, e.initEvent)).call
		(e, type, dict.bubbles || false, dict.cancelable || false, dict.detail);
	
	return e;
};

var customEventProto;
try {
	customEventProto = (global["CustomEvent"] || Event).prototype;//global использую, чтобы ошибка раньше времени не возникла и был шанс получить Event.prototype
	var c = new CustomEvent("magic");
} catch (e) {
	global["CustomEvent"] = _CustomEvent
		
	if(customEventProto)_CustomEvent.prototype = customEventProto;//В IE < 8 не удастся получить CustomEvent.prototype
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Events  ======================================  */
/*  ======================================================================================  */


/*  ======================================================================================  */
/*  ================================  Element.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  Some of from https://github.com/Raynos/DOM-shim/  */

// IE < 8 support in a.ielt8.js and a.ielt8.htc
//Add JS 1.8 Element property classList				   
if(!("classList" in _testElement)) {
	Object.defineProperty(nodeProto, "classList", {
		"get" : function() {
			var thisObj = this,
				cont = thisObj._ || (thisObj._ = {}),//Положим _cachedClassList в контейнер "_"
				_cachedClassList = "__ccl_00lh__";
			
			if(!cont[_cachedClassList])cont[_cachedClassList] = new global["Utils"]["Dom"]["DOMStringCollection"](thisObj.getAttribute("class"), function() {
				thisObj.setAttribute("class", this.value);//this instanceof Utils.Dom.DOMStringCollection
				if(thisObj.className != this.value)thisObj.className = this.value;
			})
			
			return cont[_cachedClassList];
		}
	});
}

// Fix "children" property in IE < 9
// TODO: in `a.ie8.js` file
if(!("children" in _testElement) || browser.msie && browser.msie < 9)
	Object.defineProperty(nodeProto, "children", {"get" : function() {
		var arr = [],
			child = this.firstChild;

		while(child) {
			if(child.nodeType == 1)arr.push(child);
			child = child.nextSibling;
		}

		return arr;
	}});

// Traversal for IE < 9 and other
// TODO: in `a.ie8.js` file
if(_testElement.childElementCount == undefined)Object.defineProperties(nodeProto, {
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
		}
	},
	"lastElementChild" : {
		"get" : function() {
		    var node = this;
		    node = node.lastChild;
		    while(node && node.nodeType != 1) node = node.previousSibling;
		    return node;
		}
	},
	"nextElementSibling" : {
		"get" : function() {
		    var node = this;
		    while(node = node.nextSibling) if(node.nodeType == 1) break;
		    return node;
		}
	},
	"previousElementSibling" : {
		"get" : function() {
		    var node = this;
		    while(node = node.previousSibling) if(node.nodeType == 1) break;
    		return node;
		}
	},
	"childElementCount" : {
		"get" : function() {
    		if(this.children)return this.children.length;//requared this.children
		}
	}
}
)

function _recursivelyWalk(nodes, cb) {
    for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i],
			ret = cb(node);
        if (ret) {
            return ret;
        }
        if (node.childNodes && node.childNodes.length > 0) {
            ret = _recursivelyWalk(node.childNodes, cb);
            if (ret) {
                return ret;
            }
        }
    }
};

/*https://gist.github.com/1276030 by https://gist.github.com/eligrey*/
if(!("insertAdjacentHTML" in _testElement)) {
	HTMLElement.prototype.insertAdjacentHTML = function(position, html) {
		var	ref = this,
			container = ref.ownerDocument.createElement("_"),
			ref_parent = ref.parentNode,
			node,
			first_child,
			next_sibling;

		container.innerHTML = html;

		switch (position.toLowerCase()) {
			case "beforebegin":
				while ((node = container.firstChild)) {
					ref_parent.insertBefore(node, ref);
				}
				break;
			case "afterbegin":
				first_child = ref.firstChild;
				while ((node = container.lastChild)) {
					first_child = ref.insertBefore(node, first_child);
				}
				break;
			case "beforeend":
				while ((node = container.firstChild)) {
					ref.appendChild(node);
				}
				break;
			case "afterend":
				next_sibling = ref.nextSibling;
				while ((node = container.lastChild)) {
					next_sibling = ref_parent.insertBefore(node, next_sibling);
				}
				break;
		}
		
		container = null;
	};
}

if(INCLUDE_EXTRAS) {

if(!("insertAfter" in _testElement)) {
	/**
	 * NON STANDART METHOD
	 * Вставляет DOM-элемент вслед за определённым DOM-элементом
	 * @this {Node} Куда вставляем
	 * @param {Node} elementToInsert Что вставляем
	 * @param {Node} afterElement После чего вставляем
	 * @return {Node} Переданый elementToInsert
	 */
	nodeProto["insertAfter"] = function(elementToInsert, afterElement) {
		//function(F,B){D=this;if(D._insertAfter){D._insertAfter(F,B)}else{(D.lastChild==B)?D.appendChild(F):D.insertBefore(F,B.nextSibling)}}
		return this.insertBefore(elementToInsert, afterElement.nextSibling);
	};
};

} //if(INCLUDE_EXTRAS)

// Emuleted HTMLTimeElement
// TODO:: need more work
/*
if(!(global["HTMLTimeElement"] && global["HTMLTimeElement"].prototype))
Object.defineProperty((global["HTMLUnknownElement"] && global["HTMLUnknownElement"].prototype) || nodeProto, 
	"dateTime", {
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
*/
// IE9 thinks the argument is not optional
// FF thinks the argument is not optional
// Opera agress that its not optional
// IE < 9 has javascript implimentation
if(document.importNode["shim"])
try {
	document.importNode(_testElement);
} catch (e) {
	var importNode = document.importNode;
	delete document.importNode;
	document.importNode = function (node, bool) {
		if (bool === void 0) {
			bool = true;
		}
		return importNode.call(this, node, bool);
	}
}


// Fix Chrome problem with DOMAttrModified event | http://blog.silkapp.com/2009/10/mutation-events-what-happen/
function isDOMAttrModifiedSupported() {
	var flag = false; 
	
	function callback() {
		flag = true;
	}
	
	try {
		_testElement.addEventListener('DOMAttrModified', callback, false);
		_testElement.setAttribute('id', 'target');
	}
	catch(e) {
		
	}
	finally {
		if(_testElement.removeEventListener)
			_testElement.removeEventListener('DOMAttrModified', callback, false);
	}
	
	return flag;
}

if(!isDOMAttrModifiedSupported()
   && _testElement.dispatchEvent //[temporary]TODO:: remove this when "DOMAttrModified" event whould be imulated in IE < 9
   ) {
	/**
	 * @param {Function} oldHandle
	 * @param {number=} attrChange
	 */
	var new_set_remove_Attribute = function(oldHandle, attrChange) {
		return function(name, val) {
			/**
			 * @type {MutationEvent}
			 */
			var e = document.createEvent("MutationEvents"); 
			/**
			 * @type {String}
			 */
			var prev = this.getAttribute(name);
			oldHandle.apply(this, arguments);
			e.initMutationEvent("DOMAttrModified", true, true, null, prev, 
				((attrChange || val === null) ? "" : val),
				name,
				attrChange || ((prev == null) ? 
					2://e.ADDITION :
					1//e.MODIFICATION
							  )
			);
			this.dispatchEvent(e);
		}
	}

	nodeProto.setAttribute = new_set_remove_Attribute(nodeProto.setAttribute || _testElement.setAttribute/*IE < 8*/)
	nodeProto.removeAttribute = new_set_remove_Attribute(nodeProto.removeAttribute || _testElement.removeAttribute/*IE < 8*/, 3)//3 === REMOVAL
}



/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Element.prototype  ==================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  HTMLInputElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLButtonElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLKeygenElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLMeterElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLOutputElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLProgressElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLTextAreaElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*  ================================  HTMLSelectElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

var labelableElements = "INPUT BUTTON KEYGEN METER OUTPUT PROGRESS TEXTAREA SELECT";
/*
Implement HTML*Element.labels
https://developer.mozilla.org/en/DOM/HTMLInputElement
http://www.w3.org/TR/html5/forms.html#dom-lfe-labels
*/
if(!("labels" in document.createElement("input")))
	Object.defineProperty(nodeProto, "labels", {
		enumerable: true,
		"get" : function() {
			if(labelableElements["contains"](this.nodeName.toUpperCase()))
				return void 0;
			
			var node = this,
				/**
				 * represents the list of label elements, in [!]tree order[!]
				 * @type {Array}
				 */
				result = this.id ?
					_arrayFrom(document.querySelectorAll("label[for='" + this.id + "']")) :	
					[],
				_lastInTreeOrder_index = result.length - 1;

			while((node = node.parentNode) && (!node.control || node.control === this))
				if(node.nodeName.toUpperCase() === "LABEL") {
					
					while(result[_lastInTreeOrder_index] && 
						result[_lastInTreeOrder_index].compareDocumentPosition(node) & 2)//DOCUMENT_POSITION_PRECEDING
						_lastInTreeOrder_index--;
					result.splice(_lastInTreeOrder_index + 1, 0, node)
				}
				
			return result;
		}
	});

/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  HTMLLabelElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*
Implement HTMLLabelElement.control
https://developer.mozilla.org/en/DOM/HTMLLabelElement
http://www.w3.org/TR/html5/forms.html#dom-label-control
*/
if(!("control" in document.createElement("label")))
	Object.defineProperty(global["HTMLLabelElement"] && global["HTMLLabelElement"].prototype || nodeProto, "control", {
		enumerable: true,
		"get" : function() {
			if(this.nodeName.toUpperCase() !== "LABEL")
				return void 0;
			
			if(this.hasAttribute("for"))
				return document.getElementById(this.htmlFor);
			
			return _recursivelyWalk(this.childNodes,
					function(el) {
						if(labelableElements["contains"](el.nodeName.toUpperCase()))
							return el
					}
				) || null;
		}
	});

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  HTMLLabelElement.prototype  ==================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  HTMLSelectElement.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/* 
 * Reverse Ordered Lists in HTML5
 * a polyfill for the ordered-list reversed attribute
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/grouping-content.html#the-ol-element
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/grouping-content.html#dom-li-value
 * http://www.impressivewebs.com/reverse-ordered-lists-html5/
 * TODO:: shim api
 * Based on https://gist.github.com/1671548
 */
/*if(!('reversed' in document.createElement('ol')))
	global.addEventListener('DOMContentLoaded', function() {
		_forEach(document.getElementsByTagName('ol'), function(list) {
			if(!list.hasAttribute('reversed'))return;
			
			var children = list.children,
				count = list.getAttribute('start');

			//check to see if a start attribute is provided
			if(count !== null) {
				count = Number(count);

				if(isNaN(count))count = null;
			}

			//no, this isn't duplication - start will be set to null
			// in the previous if statement if an invalid start attribute
			// is provided
			if(count === null)
				count = children.length;

			_forEach(children, function(child) {
				child.value = count--;
			});
		});
	}, false); */

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  HTMLLabelElement.prototype  ==================================  */
/*  ======================================================================================  */

/*  =======================================================================================  */
/*  ======================================  Network  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(INCLUDE_EXTRAS) {
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
    if(!SendRequest.XHRs)SendRequest.XHRs = [];
	//Каждые 5 минут поднимаем флаг, что XHR устарел
	setTimeout(function() {SendRequest.outOfDate = true}, 3e5);
	
	var method = options["post"] ? "POST" : "GET",
		//Создаём отдельный XHR в случае, если глобальный XHR занят или, если в опциях указан temporary
		temp = options["temporary"] || global.working;
	
	// Запрос
    if ((!global.working && SendRequest.XHR) || temp) {
    	var http1 = temp ? SendRequest.XHRs[SendRequest.guid] = new global.XMLHttpRequest() : SendRequest.XHR,
    		tmpXHRguid = temp ? SendRequest.guid++ : null;
    	
    	//Проверяем, если требуется сделать GET-запрос
		if(!options["post"] && args.length > 0)
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
            	if(options["onProccess"])options["onProccess"]();
            }
        }
        if(!temp)global.working = true;
        
        try {
			if (options["post"]) {//Если это POST-запрос
				//Отсылаем специальный заголовок, чтобы сервер знал, что это AJAX
				http1.setRequestHeader("X-Requested-With", "HTTPRequest");
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
		if(DEBUG)console.error("Ошибка при создании XMLHTTP объекта!");
		return false;//alert('Ошибка при создании XMLHTTP объекта!')
	}
}
SendRequest.guid = 0;

}//if(INCLUDE_EXTRAS)

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Network  ======================================  */
/*  =======================================================================================  */

/*  ======================================================================================  */
/*  =======================================  Utils  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(INCLUDE_EXTRAS) {
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
 * Random string
 * !!! ВНИМАНИЕ !!! Результирующая строка ~ в 5% случаев будет длинной length - 1
 * @param {!number} length Размер строки
 * @return {string}
 * TODO:: Поддержка length > 10. Сейчас получается хрень: randomString(14) == "l.5lqc17jlpzt(e+13)"
 */
var randomString = global["randomString"] = function(length) {
    return (Math.round(Math.random() * parseInt("z".repeat(++length), 36))).toString(36);//36 - 0-9a-z
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
 * RUS: Преобразует 'Array-like коллекцию с числовыми ключами'/число/строку в массив.
 * Можно задать выборку через start и end. Трактовка start и end аналогичная функции Array::slice
 *  Если start отрицателен, то он будет трактоваться как arrayObj.length+start (т.е. start'ый элемент с конца массива). 
 *  Если end отрицателен, то он будет трактоваться как arrayObj.length+end (т.е. end'ый элемент с конца массива).
 *  Если второй параметр не указан, то экстракция продолжится до конца массива. Если end < start, то будет создан пустой массив.
 * @param {Object|Array|number|string|NodeList} iterable Любой Array-like объект, любой объект, число или строка
 * @param {number=} start Индекс элемента в массиве, с которого будет начинаться новый массив.
 * @param {number=} end Индекс элемента в массиве, на котором новый массив завершится.
 * @param {boolean=} forse Для typeof iterable == "object" смотреть свойства в цепочки прототипов объекта
 * @return {Array}
 * @example $A(iterable) -> actualArray
 */
var $A = global["$A"] = function(iterable, start, end, forse) {
	if(!iterable || start + end === 0)return [];
	if(start == end == void 0) {
		if(Array.isArray(iterable))return iterable;
		return _arrayFrom(iterable);
	}
	start = start || 0;//Default value
	
	var type = typeof iterable, results,
		//args потому, что IE не понимает, когда в функцию Array::slice передают undefined вместо start и/или end
		args = [start];
	if(end)args.push(end);
	
	if(type == "number") {
		iterable += "";
		type = "string";
	}
	
	iterable = _toObject(iterable);
	
	if(typeof iterable.length == "number") {
		
		var _length = iterable.length,
			_start = start < 0 && (start = (_length + start), start) < 0 ? 0 : start,
			_end = (end == null ? _length : end < 0 && (end = (_length + end), end) < 0 ? 0 : end);
		
		_length = _end - _start;
				
		try {//Попробуем применить Array.prototype.slice на наш объект
 			results = _arraySlice.apply(iterable, args);//An idea from https://github.com/Quby/Fn.js/blob/master/fn.js::_.toArray
			//Match result length of elements with initial length of elements
			if(results.length === _length)return results;//Проверка !!!
		}
		catch(e) {//IE throw error with iterable == "[object NodeList]"
			//не получилось! -> выполняем обычную переборку
		}
		
		results = [];
		for( ; _start < _end ; ++_start)results.push(iterable[_start]);
		
		return results;
	}
	
	results = [];
	
	if(type == "object") {
		for(var i in iterable)if(forse || _hasOwnProperty(iterable, i))results.push(iterable[i]);
		return !start && !end && results || results.slice.apply(results, args);
	}
	
	return results;	
}

/**
 * Object.keys-like function for Array-like collection, number and string
 * RUS: Достаёт ключи объекта/массива и возвращяет их в виде массива
 * @param {Object|Array|number|string} iterable
 * @param {boolean=} forse Для typeof iterable == "object" смотреть свойства в цепочки прототипов объекта
 */
var $K = global["$K"] = function(iterable, forse) {
	var type = typeof iterable,
		length,
		results;
		
	if(type == "object") {
		if(browser.msie && iterable.length && !(iterable instanceof Array))iterable = _arrayFrom(iterable);//Если Arguments
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
				console.error("bubbleEventListener::namedFunctions must be an Object or Function")
		else if(typeof namedFunctions == "object") {
			if(!_arrayFrom(namedFunctions).length)console.error("bubbleEventListener::no functions are sets")
			else {
				var s = true;
				$K(namedFunctions).forEach(function(key){
					if(typeof namedFunctions[key] != funcType)s = false;
				})
				if(!s)console.error("bubbleEventListener::all values in namedFunctions MUST be a Functions")
			}
		}
		if(Array.isArray(attribute) && !attribute.length)console.error("bubbleEventListener::в массиве attribute должен быть хотябы один элемент")
	}

	var _attr = (Array.isArray(attribute) ? attribute[0] : attribute);//TODO:: Выяснить зачем я делал это -> .toLowerCase(); С propName это не работает
		
		return function(event) {
			event = event || window.event;
			var elem = event.target || (event.target = event.srcElement),
				/** @type {HTMLElement} Элемент, на котором останавливаем поиски action'а */
				stopElement = this,//Контекст this у функции !!!ДОЛЖЕН!!! указываеть на элемент, на который эту функцию повесили в качестве обработчика
				/** @type {string} Значение атрибута - имя функции */
				elemAttrValue,
				/** @type {Object|null|Function} */
				f,//Функция для вызова
				result;
			
			/*if(_attr == "class") {//Только для аттрибута "class" делаем исключение
				//TODO:: Сделать, чтобы имя функция вызывалась даже тогда, когда в аттребуте "class" больше одного класса
			}*/
			
			do {
				elemAttrValue = elem.getAttribute(_attr) || (flags & 0x2 ? elem[_attr] : null);
				if(elemAttrValue == null)continue;
				/** @type {Array} */
				var params = [event, elem, elemAttrValue];//Параметры вызова функции для apply()
				
				if(Array.isArray(attribute) && attribute.length > 1)
					for(var i = 1, l = attribute.length ; i < l ; ++i)params.push(elem.getAttribute(attribute[i]));
				
				if(typeof namedFunctions == funcType)result = namedFunctions.apply(context || stopElement, params);
				else {
					f = namedFunctions[elemAttrValue];
					if(f)result = f.apply(context || stopElement, params);
					else if(DEBUG)console.log("bubbleEventListener::нету функции с названием " + elemAttrValue);
				}
				
				if(!(flags & 0x1))break;
			} while(elem != stopElement && (elem = elem.parentNode));
			
			return result;
		}
}

}//if(INCLUDE_EXTRAS)

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Utils  ======================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ========================================  DOM  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

// window.getComputedStyle fix
//FF say that pseudoElt param is required
try {
	global.getComputedStyle(_testElement)
}
catch(e) {
	var old = global.getComputedStyle;
	global.getComputedStyle = function(obj, pseudoElt) {
		return old.call(global, obj, pseudoElt || null)
	}
}

//Events
// TODO:: in `a.ie8.js` file
if(!_testElement.addEventListener) {
	nodeProto.addEventListener = global.addEventListener;
	nodeProto.removeEventListener = global.removeEventListener;
	nodeProto.createEvent = global.createEvent;
	nodeProto.dispatchEvent = global.dispatchEvent;
}


if(INCLUDE_EXTRAS) {
/**
 * document.getElementById alias
 * <del>Получение элемента по ID и добавление в него объекта-контейнера '_'. '_' можно использовать для хранения переменных,
 *  связанных с данным элементом, чтобы не захламлять пространство имён объекта</del>
 * @param {!string|HTMLElement} id
 * @return {HTMLElement} найденный элемент
 */
var $ = function(id) {
	if(typeof id == 'string' || typeof id == 'number')id = document.getElementById(id);
	
	//if(id && !id._)id._ = {};
	
	return id;
};
if(!global["$"])global["$"] = $;//Do not rewrite jQuery

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
	/* replace not quoted args with quoted one -- Safari doesn't understand either */
	//if(browser.safary)//[termi 30.01.12]commented it due not actual for now
	//	selector = selector.replace(/=([^\]]+)/, '="$1"');
	
	var isSpecialMod = /[>\+\~]/.test(selector.charAt(0)) || 
					/(\,>)|(\,\+)|(\,\~)/.test(selector),
		i = -1,
		root;
	
	if(document.querySelector) {
		var result = [];
		
		if(selector) {
			if(isSpecialMod) {//spetial selectors like ">*", "~div", "+a"
				//Мы надеемся :(, что в селекторе не бедет [attrName=","]
				//TODO:: переделать сплитер, чтобы он правильно работал даже для [attrName=","]
				selector = selector.split(",")["unique"]();
				
				while(root = selector[++i])
					result = $$.N(root, roots, result);
					
				return result;
			}
			
			if(!Array.isArray(roots))return _arrayFrom(roots.querySelectorAll(selector));
						
			while(root = roots[++i] && (!isFirst || !result.length))
				result.concat(_arrayFrom(root.querySelectorAll(selector)))
			
		}
		
		return result;
	}
	
	throw new Error("querySelector not supported")
}
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
 * @param {Array=} prefetchResult ссылка на массив уже сформированных результатов, к которым будет добавлен текущий результат
 * @param {boolean=} isFirst ищем только первый
 * @return {Array.<HTMLElement>}
 * @version 2
 */
$$.N = function(selector, roots, prefetchResult, isFirst) {
	//TODO:: Не засовывать в result те элементы, которые уже были туда засованы
	roots = !roots ? [d] : (Array.isArray(roots) ? roots : [roots]);
	
	var /** @type {Array.<HTMLElement>} */result = prefetchResult || [],
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
		
		if(selector.charAt(0) == ",")selector = selector.substr(1);
		isSpecialMod = /[>\+\~]/.test(selector.charAt(0));
        //TODO:: Тут ошибка. Селекторы вида ">*" не работают
		
		while(rt = roots[++ir]) {
			if(isSpecialMod) {
				if(rt == document)noway = true;//Бесполезно вызывать селекторы с начальными >, + или ~ для document
				else {
					if(!rt.id)rt.id = $$.N.str_for_id + $$.N.uid_for_id++;
					specialSelector = "#" + rt.id + selector;
					rt = rt.parentNode;
				}
			}
			else specialSelector = selector;
			if(noway){}
			else if(isFirst)result.push(rt.querySelector(specialSelector));
			else result = result.concat(_arrayFrom(rt.querySelectorAll(specialSelector)));
		}
		
		return result;
	}
	
	throw new Error("querySelector not supported")
}
/** @type {string} создания уникального идентификатора (HTMLElement.id) */
$$.N.str_for_id = "r" + randomString(6);
/** @type {number} Инкреминтируемое поле для создания уникального идентификатора. Используется вместе с $$N.str_for_id */
$$.N.uid_for_id = 0;

/**
 * @param {!string} selector
 * @param {Document|HTMLElement|Node=} root
 * @return {HTMLElement|Node}
 */
var $$0 = global["$$0"] = function(selector, root) {	
	return $$(selector, root, true)[0];
}
}//if(INCLUDE_EXTRAS)

/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DOM  =======================================  */

/*  =======================================================================================  */
/*  ========================================  DEBUG  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(INCLUDE_EXTRAS) {
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

if (console && !DEBUG) {

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

}//if(INCLUDE_EXTRAS)

/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DEBUG  =====================================  */


	
})(window);