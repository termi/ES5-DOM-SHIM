// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name a.js
// @check_types
// ==/ClosureCompiler==
/**
 * module
 * @version 6
 * TODO:: eng comments
 *        dateTime prop for IE < 8
 */

//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = false;
/** @define {boolean} */
var INCLUDE_EXTRAS = true;
/** @define {boolean} */
var INCLUDE_EXTEND_POLYFILLS = false;
//GCC DEFINES END

/*
IF INCLUDE_EXTRAS == false ->
 broken Object.defineProperty will be deleted

INCLUDE_EXTRAS:
Exporting these objects to global (window)
 1. browser
 2. Utils.Dom.DOMStringCollection
 3. XHR from https://github.com/Raynos/xhr with customisations
 4. $A(iterable, start, end, forse) - alias for Array.from with Array|Object|String|number support eg: $A({a:1, b:2}) == [1,2]
 5. $K(iterable, forse) - alias for Object.keys with Arguments|Array|Object|String|number support eg: $A({a:1, b:2}) == ['a','b']
 6. $(selector, root) alias for root.querySelector(selector) (with ">[any selector]" support)
 7. $$(selector, root) alias for root.querySelectorAll(selector) (with ">[any selector]" support)
 8. $$0 alias for $
Extending objects
 1. Object.append(object, donor, [donor2, ...])
 2. Object.extend(object, donor, [donor2, ...]) (Object.append with overwrite exists properties)
 3. Object.inherit(Child, Parent)
 4. Array.prototype.unique()
 5. String.random(length)
Fix console From https://github.com/theshock/console-cap/blob/master/console.js
*/

/*
INCLUDE_EXTEND_POLYFILLS:
 1. 'reversed' for <ol> with DOM API
*/

;(
/**
 * @type {Window}
 * @const */
function(global) {

"use strict";

/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

var _ = global["_"],
	orig_;
if(_ && _["ielt9shims"]) {
	orig_ = _["orig_"];
	_ = _["ielt9shims"];
}

var /** @const */funcType = "function";


/** @type {Object}
 * @const */
var browser = {
/** @type {string}
 * @const */
	agent : navigator.userAgent.toLowerCase()
};

if(INCLUDE_EXTRAS) {
	global["browser"] = browser;//Export
	
	//Browser sniffing :)
	/** @type {Array}
	 * @const */
	browser.names = browser.agent.match(/(mozilla|compatible|chrome|webkit|safari|opera|msie|iphone|ipod|ipad)/gi);
	/** @type {number} */
	var len = browser.names && browser.names.length || 0;
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

	/* @type {string}
	 * @const 
	browser["cssPrefix"] =
		browser.mozilla ? "Moz" :
		browser.webkit || browser.safari ? "Webkit" ://and iPad, iPhone, iPod
		browser.opera ? "O" :
		browser.msie ? "ms" :
		"";*/
}
else {
	browser.names = browser.agent.match(/(msie)/gi);
	if(browser.names && browser.names.length)browser[browser.names[0]] = true;

	browser.msie = browser["msie"];

}//if(INCLUDE_EXTRAS)

if(browser.msie)for(var i = 6 ; i < 11 ; i++)//IE from 6 to 10
	if(new RegExp('msie ' + i).test(browser.agent)) {
		browser.msie = browser["msie"] = i;

		break;
	}
browser["msie"] = browser.msie;







/*  ======================================================================================  */
/*  ==================================  Function prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * From prototypejs (prototypejs.org)
 * Wraps the function in another, locking its execution scope to an object specified by thisObj.
 * @param {Object} object
 * @param {...} var_args
 * @return {Function}
 * @version 3
 */
if(!Function.prototype.bind)Function.prototype.bind = function (object, var_args) {
	//If IsCallable(Target) is false, throw a TypeError exception.
	if (typeof this != "function") {
		throw new TypeError("Function.prototype.bind called on incompatible " + this);
	}
	var __method = this, args = _arraySlice.call(arguments, 1),
		_result = function () {
			return __method.apply(
				this instanceof _result ?
					this ://The `object` value is ignored if the bound function is constructed using the new operator.
					object,
				args.concat(_arraySlice.call(arguments)));
	};
	if(__method.prototype) {
		_result.prototype = Object.create(__method.prototype);
		//_result.constructor = __method;
	}
	return _result;
};
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Function prototype  ==================================  */
/*  =======================================================================================  */

var
    _arraySlice = Array.prototype.slice

  , _applyFunction = Function.prototype.apply
  
	/** Unsafe bind for service and performance needs
	 * @param {Function} __method
	 * @param {Object} object
	 * @param {...} var_args
	 * @return {Function} */
  , _unSafeBind = function(__method, object, var_args) {
		var args = _arraySlice.call(arguments, 2);
		return function () {
			return _applyFunction.call(__method, object, args.concat(_arraySlice.call(arguments)));
		}
	}

  , _hasOwnProperty = _unSafeBind(Function.prototype.call, Object.prototype.hasOwnProperty)

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

  , /** @type {Element|*}
	 * @const */
	_testElement =
		document.createElement["orig"] ?
			_call(document.createElement["orig"], document, '_') : //[ielt8]
			document.createElement('_')

	//Fixed `toObject` to work for strings in IE8 and Rhino. Added test spec for `forEach`.
	//https://github.com/kriskowal/es5-shim/pull/94
  , need_prepareString = (function(strObj) {
		// Check failure of by-index access of string characters (IE < 9)
		// and failure of `0 in strObj` (Rhino)
		return strObj[0] != "a" || !(0 in strObj);
	})(Object("a"))

	/**
	 * @param {Object} obj
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
  , _toString = Object.prototype.toString

  , _throwDOMException = function(errStr) {
		var ex = Object.create(DOMException.prototype);
		ex.code = DOMException[errStr];
		ex.message = errStr +': DOM Exception ' + ex.code;
		throw ex;
	}
	//Take Element.prototype or silently take a fake object
	// IE < 8 support in a.ielt8.js and a.ielt8.htc
  , elementProto = global["Element"] && global["Element"].prototype || {}

  , functionReturnFalse = function() { return false }
  , functionReturnFirstParam = function(param) { return param }
  , prototypeOfObject = Object.prototype
  , _recursivelyWalk = function (nodes, cb) {
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
	}
;


if(!global["HTMLDocument"])global["HTMLDocument"] = global["Document"];//For IE9
if(!global["Document"])global["Document"] = global["HTMLDocument"];//For IE8
//TODO:: for IE < 8 :: if(!global["Document"] && !global["HTMLDocument"])global["Document"] = global["HTMLDocument"] = ??;//for IE < 8

var createExtendFunction;
if(INCLUDE_EXTRAS) {
/*  =======================================================================================  */
/*  ======================================  Classes  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * @param {boolean=} overwrite
 * @return {function(this:Object, Object, ...[*]): Object}
 */
createExtendFunction = function(overwrite) {
	/**
	 * @param {Object} obj
	 * @param {...} ravArgs
	 */
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
};


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Classes  ======================================  */
/*  =======================================================================================  */
}//if(INCLUDE_EXTRAS)

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
 * @return {Array} object keys
 */
if(!Object.keys)Object.keys = (function() {
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

    return function (obj) {
        if (typeof obj != "object" && typeof obj != "function" || obj === null)
            throw new TypeError("Object.keys called on a non-object");

        var result = [];
        for (var name in obj) {
            if(_hasOwnProperty(obj, name))
                result.push(name);
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if(_hasOwnProperty(obj, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }

        return result;
    };
})();


/**
 * ES5 15.2.3.4
 * http://es5.github.com/#x15.2.3.4
 * Returns an array of all properties (enumerable or not) found upon a given object.
 * @param obj The object whose enumerable own properties are to be returned.
 * @return {Array} object keys
 */
if(!Object.getOwnPropertyNames)Object.getOwnPropertyNames = function(obj) {
	return Object.keys(obj);
}

/**
 * ES5 15.2.3.8
 * http://es5.github.com/#x15.2.3.8
 * this is misleading and breaks feature-detection, but
 * allows "securable" code to "gracefully" degrade to working
 * but insecure code.
 * @param {!Object} object
 * @return {Object} the same object
 */
if(!Object.seal)Object.seal = functionReturnFirstParam;

/**
 * ES5 15.2.3.9
 * http://es5.github.com/#x15.2.3.9
 * this is misleading and breaks feature-detection, but
 * allows "securable" code to "gracefully" degrade to working
 * but insecure code.
 * @param {!Object} object
 * @return {Object} the same object
 */
if(!Object.freeze)Object.freeze = functionReturnFirstParam;

/** ES5 15.2.3.10
 * http://es5.github.com/#x15.2.3.10
 * this is misleading and breaks feature-detection, but
 * allows "securable" code to "gracefully" degrade to working
 * but insecure code.
 * @param {!Object} object
 * @return {Object} the same object
 */
if (!Object.preventExtensions)Object.preventExtensions = functionReturnFirstParam;

/** ES5 15.2.3.11
 * http://es5.github.com/#x15.2.3.11
 * @param {!Object} object
 * @param {boolean} is sealed?
 */
if (!Object.isSealed)Object.isSealed = functionReturnFalse;

/** ES5 15.2.3.12
 * http://es5.github.com/#x15.2.3.12
 * @param {!Object} object
 * @param {boolean} is frozen?
 */
if (!Object.isFrozen)Object.isFrozen = functionReturnFalse;

/** ES5 15.2.3.13
 * http://es5.github.com/#x15.2.3.13
 * @param {!Object} object
 * @param {boolean} is extensible?
 */
if (!Object.isExtensible) {
    Object.isExtensible = function(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) !== object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (_hasOwnProperty(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = _hasOwnProperty(object, name);
        delete object[name];
        return returnValue;
    };
}

/**
 * ES5 15.2.3.2
 * http://es5.github.com/#x15.2.3.2
 * https://github.com/kriskowal/es5-shim/issues#issue/2
 * http://ejohn.org/blog/objectgetprototypeof/
 * recommended by fschaefer on github
 * @param {!Object} object
 * @return {Object} prototype of given object
 */
if(!Object.getPrototypeOf)Object.getPrototypeOf = function getPrototypeOf(object) {
	return object.__proto__ || (
		object.constructor ?
		object.constructor.prototype :
		prototypeOfObject
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
	var _object;
	if (prototype === null) {
		_object = { "__proto__": null };
	} else {
		if (typeof prototype != "object")
			throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");

		var /** @constructor */Type = function () {};
		Type.prototype = prototype;
		_object = new Type();
		// IE has no built-in implementation of `Object.getPrototypeOf`
		// neither `__proto__`, but this manually setting `__proto__` will
		// guarantee that `Object.getPrototypeOf` will work as expected with
		// objects created using `Object.create`
		_object.__proto__ = prototype;
	}
	if(properties)
		Object.defineProperties(_object, properties);
	return _object;
};

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
		return void 0;
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
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: ";
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters not supported";

	/**
	 * Defines a new property directly on an object, or modifies an existing property on an object, and returns the object.
	 * @param {Object} object The object on which to define the property.
	 * @param {string} property The name of the property to be defined or modified.
	 * @param {Object} descriptor The descriptor for the property being defined or modified.
	 */
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
				if (exception["number"] === -0x7FF5EC54) {//[ielt9 ie8] IE 8 doesn't support enumerable:true
					descriptor.enumerable = false;
					try {
						return definePropertyFallback.call(Object, object, property, descriptor);
					} catch (exception2) {

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
                if(Object.defineProperty["ielt8"]) {//[ielt9 ie8]
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

//[ielt8] Set `Object.defineProperty["ielt8"] = true` for IE < 8
if(elementProto["ie"] && browser.msie < 8)elementProto["ielt8"] = Object.defineProperty["ielt8"] = true;

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties || definePropertiesFallback) {
	/**
	 * Defines new or modifies existing properties directly on an object, returning the object.
	 * @param {Object} object The object on which to define or modify properties.
	 * @param {Object} properties An object whose own enumerable properties constitute descriptors for the properties to be defined or modified.
	 */
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
        return void 0;
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
	 * Returns a property descriptor for an own property (that is, one directly present on an object, not present by dint of being along an object's prototype chain) of a given object.
	 * @param {!Object} object The object in which to look for the property.
	 * @param {!string} property The name of the property whose description is to be retrieved
	 * @return {Object.<(ObjectPropertyDescriptor|null)>|undefined}
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
            return void 0;
        }

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        var descriptor =  { enumerable: true, configurable: true },
			getter,
			setter;

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

            getter = object.__lookupGetter__(property);
            setter = object.__lookupSetter__(property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = _prototype;
        }
		else if(Object.defineProperty["ielt8"]) {//[ielt9 ie8]
			getter = object["get" + property];
			setter = object["set" + property];
		}

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

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

//from https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js
if(!Object["is"])Object["is"] = function(x, y) {
  if (x === y) {
    // 0 === -0, but they are not identical
    if (x === 0) {
      return 1 / x === 1 / y;
    } else {
      return true;
    }
  }

  // NaN !== NaN, but they are identical.
  // NaNs are the only non-reflexive value, i.e., if x !== x,
  // then x is a NaN.
  // isNaN is broken: it converts its argument to number, so
  // isNaN("foo") => true
  return x !== x && y !== y;
}
if(!Object["isnt"])Object["isnt"] = function(x, y) {
  return !Object["is"](x, y);
}
//TODO::
// 1. getOwnPropertyDescriptors
// 2. getPropertyDescriptor
// 3. getPropertyNames

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Object prototype  ==================================  */
/*  =======================================================================================  */

/*  ======================================================================================  */
/*  ==================================  Array.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*  ================================ bug fixing  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers] 
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if([1,2].splice(0).length != 2) {
	var _origArraySplice = Array.prototype.splice;

	Array.prototype.splice = function(start, deleteCount) {
        if(start === void 0 && deleteCount === void 0)return [];

		return _origArraySplice.apply(this,	[
					start === void 0 ? 0 : start,
					deleteCount === void 0 ? (this.length - start) : deleteCount
				].concat(_arraySlice.call(arguments, 2))
			);
	};
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  bug fixing  ==================================  */

/*  ================================ ES6 ==================================  */
// Based on https://github.com/paulmillr/es6-shim/

var _arrayFrom =
/** toArray function
 * @param {Object|Array} iterable object
 * @return {Array}
 */
Array["from"] || (Array["from"] = function(iterable) {
	if(Array.isArray(iterable))return iterable;
	if(iterable.toArray)return iterable.toArray();

	var object = _toObject(iterable, true),
		result = [];

	for(var key = 0, length = object.length >>> 0; key < length; key++) {
		if(key in object)
			result[key] = object[key];
	}

	return result;
});

/** return array of arguments of this function
 * @param {...} args
 * @return {Array}
 */
Array["of"] = Array["of"] || function(args) {
	return _arraySlice.call(arguments);
};

if(INCLUDE_EXTRAS) {
	/**
	 * __Non-standart method__ [(!!!)]
	 * https://gist.github.com/1044540
	 * Create a new Array with the all unique items
	 * @return {Array}
	 */
	if(!Array.prototype["unique"])Array.prototype["unique"] = (function(a) {
	  return function() {     // with a function that
		return this.filter(a);// filters by the cached function
	  }
	})(
	  function(a,b,c) {       // which
		return c.indexOf(     // finds out whether the array contains
		  a,                  // the item
		  b + 1               // after the current index
		) <	0                 // and returns false if it does.
	  }
	);
}//if(INCLUDE_EXTRAS)

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
 * @param {*=} initialValue Object to use as the first argument to the first call of the callback.
 * @return {*} single value
 */
if(!Array.prototype.reduce)Array.prototype.reduce = function(accumulator, initialValue) {
	// ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception." in "_call" function

	var thisArray = _toObject(this),
		l = thisArray.length >>> 0,
		i = 0;

	if(l === 0 && arguments.length <= 1)// == on purpose to test 0 and false.// no value to return if no initial value, empty array
		throw new TypeError("Array length is 0 and no second argument");

	if(initialValue === void 0)initialValue = (++i, thisArray[0]);

	for( ; i < l ; ++i) {
	  if(i in thisArray)
	    initialValue = _call(accumulator, void 0, initialValue, thisArray[i], i, thisArray);
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
 * @param {*=} initialValue Object to use as the first argument to the first call of the callback.
 */
if(!Array.prototype.reduceRight)Array.prototype.reduceRight = function(accumulator, initialValue) {
	// ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception." in "_call" function

	var thisArray = _toObject(this),
		l = thisArray.length >>> 0;

	if(l === 0 && arguments.length <= 1)// == on purpose to test 0 and false.// no value to return if no initial value, empty array
		throw new TypeError("Array length is 0 and no second argument");

	--l;
	if(initialValue === void 0)initialValue = (--l, thisArray[l + 1]);

	for( ; l >= 0 ; --l) {
	  if(l in thisArray)
	    initialValue = _call(accumulator, void 0, initialValue, thisArray[l], l, thisArray);
	}

	return initialValue;
};


/** ES5 15.4.4.18
 * http://es5.github.com/#x15.4.4.18
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach
 * Executes a provided function once per array element.
 * @param {Function} iterator Function to execute for each element.
 * @param {Object} context Object to use as this when executing callback.
 */
Array.prototype.forEach || (Array.prototype.forEach = function(iterator, context) {
	var thisArray = _toObject(this),
		length = thisArray.length >>> 0,
		i = -1;
	
	while (++i < length) {
		if (i in thisArray) {
			_call(iterator, context, thisArray[i], i, thisArray);
		}
	}			
});
var _forEach = _unSafeBind(Function.prototype.call, Array.prototype.forEach);

/** ES5 15.4.4.14
 * http://es5.github.com/#x15.4.4.14
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
 * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
 * @param {*} searchElement Element to locate in the array.
 * @param {number} fromIndex The index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
 * @return {number}
 */
if(!Array.prototype.indexOf)Array.prototype.indexOf = function(searchElement, fromIndex) {
	var thisArray = _toObject(this),
		length = thisArray.length >>> 0,
		i = fromIndex || 0;
	
	if(!length)return -1;
	
	// handle negative indices
    i = i >= 0 ? i : Math.max(0, length + i);
	
	for( ; i < length ; i++)
		if(i in thisArray && thisArray[i] === searchElement)return i;
	
	return -1;
};
/** ES5 15.4.4.15
 * http://es5.github.com/#x15.4.4.15
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
 * Returns the last index at which a given element can be found in the array, or -1 if it is not present. The array is searched backwards, starting at fromIndex.
 * @param {*} searchElement Element to locate in the array.
 * @param {number} fromIndex The index at which to start searching backwards. Defaults to the array's length, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, the whole array will be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from back to front. If the calculated index is less than 0, -1 is returned, i.e. the array will not be searched.
 * @return {number}
 */
if(!Array.prototype.lastIndexOf)Array.prototype.lastIndexOf = function lastIndexOf(searchElement, fromIndex) {
	var thisArray = _toObject(this),
		length = thisArray.length >>> 0;

	if(!length)return -1;

	var i = length - 1;
	if(fromIndex !== void 0)i = Math.min(i, fromIndex);
	
	// handle negative indices
	i = i >= 0 ? i : length - Math.abs(i);
	
	for (; i >= 0; i--) {
		if (i in thisArray && searchElement === thisArray[i]) {
			return i;
		}
	}
	return -1;
};

/**
 * ES5 15.4.4.16
 * http://es5.github.com/#x15.4.4.16
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
 * Tests whether all elements in the array pass the test implemented by the provided function.
 * @param {Function} callback Function to test for each element.
 * @param {Object=} thisObject Object to use as this when executing callback.
 * @param {boolean=} _option_isAll [DO NOT USE IT] system param
 * @return {boolean}
 */
if(!Array.prototype.every)Array.prototype.every = function(callback, thisObject, _option_isAll) {
	if(_option_isAll === void 0)_option_isAll = true;//Default value = true
	var result = _option_isAll;
	_forEach(this, function(value, index) {
		if(result == _option_isAll)result = !!_call(callback, thisObject, value, index, this);
	}, this);
	return result;
};

/**
 * ES5 15.4.4.17
 * http://es5.github.com/#x15.4.4.17
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
 * Tests whether some element in the array passes the test implemented by the provided function.
 * @param {Function} callback Function to test for each element.
 * @param {Object=} thisObject Object to use as this when executing callback.
 * @return {boolean}
 */
if(!Array.prototype.some)Array.prototype.some = function(callback, thisObject) {
	return Array.prototype.every.call(this, callback, thisObject, false);
};

/**
 * http://es5.github.com/#x15.4.4.17
 * https://developer.mozilla.org/en/JavaScript/Reference/global_Objects/Array/filter
 * Creates a new array with all elements that pass the test implemented by the provided function.
 * @param {Function} callback Function to test each element of the array.
 * @param {Object=} thisObject Object to use as this when executing callback.
 * @return {boolean}
 */
if(!Array.prototype.filter)Array.prototype.filter = function(callback, thisObject) {
	// ES5 : "If IsCallable(callback) is false, throw a TypeError exception." in "_call" function

	var thisArray = _toObject(this),
		len = this.length >>> 0,
		result = [];

	for (var i = 0; i < len; i++)
		if (i in thisArray) {
			var val = thisArray[i];// in case callback mutates this
			if(_call(callback, thisObject, val, i, thisArray))result.push(val);
		}

	return result;
};

/**
 * http://es5.github.com/#x15.4.4.19
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
 * Creates a new array with the results of calling a provided function on every element in this array.
 * @param {Function} callback Function that produces an element of the new Array from an element of the current one.
 * @param {Object?} thisArg Object to use as this when executing callback.
 * @return {Array}
 */
if (!Array.prototype.map)Array.prototype.map = function(callback, thisArg) {
	var thisArray = _toObject(this),
		result = [],
		mappedValue;

	_forEach(this, function(v, k, obj) {
		mappedValue = _call(callback, thisArg, v, k, obj);
		result[k] = mappedValue;
	}, this);

    return result;
};

/**
 * http://es5.github.com/#x15.4.3.2
 * https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
 * https://gist.github.com/1034882
 * Returns true if an object is an array, false if it is not.
 * @param {*} obj The object to be checked
 * @return {boolean}
 */
if(!Array.isArray)Array.isArray = function(obj) {
	return '' + obj !== obj &&// is not the string '[object Array]' and
           _toString.call(obj) == '[object Array]'// test with Object.prototype.toString
};


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Array.prototype  ==================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ================================  String.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*  ================================  bug fixing  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
/*
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

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14
// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String, which is the this value (converted to a String). If limit is not undefined, then the output array is truncated so that it contains no more than limit elements.
// "0".split(undefined, 0) -> []
if("0".split(void 0, 0).length) {
	var oldSplit = String.prototype.split;
	String.prototype.split = function(separator, limit) {
		if(separator === void 0 && limit === 0)return [];
		return oldSplit.apply(this, arguments);
	}
}
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  bug fixing  ==================================  */

//from https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js
/**
 * String repeat
 * @param {!number} count repeat times
 * @return {string} result
 */
if(!String.prototype.repeat)String.prototype.repeat = function(count) {
	return new Array(++count).join(this + "");
};

/**
 * Check if given string locate in the begining of current string
 * @param {string} substring substring to locate in the current string.
 * @return {boolean}
 */
if(!String.prototype["startsWith"])String.prototype["startsWith"] = function(substring) {
	return this.indexOf(substring) === 0;
};

/**
 * Check if given string locate at the end of current string
 * @param {string} substring substring to locate in the current string.
 * @return {boolean}
 */
if(!String.prototype["endsWith"])String.prototype["endsWith"] = function(substring) {
	var substr = String(substring),
		index = this.lastIndexOf(substr);
	return index >= 0 && index === this.length - substr.length;
};

/**
 * Check if given string locate in current string
 * @param {string} substring substring to locate in the current string.
 * @return {boolean}
 */
if(!String.prototype["contains"])String.prototype["contains"] = function(s) {
	return !!~this.indexOf(s);
};

/**
 * String to Array
 * @return {Array}
 */
if(!String.prototype["toArray"])String.prototype["toArray"] = function() {
	return this.split('');
};


// TODO::
//  1. Maybe https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/TrimRight ?
//  2. Maybe https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/String/TrimLeft ?
//  https://gist.github.com/1036520



/*  ======================================================================================  */
/*  ================================  Number  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
//from https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js

if(!Number["isFinite"])Number["isFinite"] = function(value) {
	return typeof value === 'number' && global.isFinite(value);	
};

if(!Number["isInteger"])Number["isInteger"] = function(value) {
	return Number["isFinite"](value) &&
		value >= -9007199254740992 && value <= 9007199254740992 &&
		Math.floor(value) === value;
};

if(!Number["isNaN"])Number["isNaN"] = function(value) {
	return Object["is"](value, NaN);
};
if(!Number["toInteger"])Number["toInteger"] = function(value) {
	var number = +value;
	if (Number["isNaN"](number)) return +0;
	if (number === 0 || !Number["isFinite"](number)) return number;
	return Math.sign(number) * Math.floor(Math.abs(number));
}
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Number  ==================================  */
/*  ======================================================================================  */


/*  ======================================================================================  */
/*  ======================================  Events  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

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
	if(!("isTrusted" in e))e.isTrusted = false;

	return e;
};

var eventProto;
try {
	eventProto = Event.prototype;
	new Event("click");
} catch (e) {
	global["Event"] = _Event;

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
	if(!("isTrusted" in e))e.isTrusted = false;

	return e;
};

var customEventProto;
try {
	customEventProto = (global["CustomEvent"] || Event).prototype;//use global to prevent Exception if the is not CustomEvent || CustomEvent.prototype
	var c = new CustomEvent("magic");
} catch (e) {
	global["CustomEvent"] = _CustomEvent;

	if(customEventProto)_CustomEvent.prototype = customEventProto;//The is no CustomEvent.prototype in IE < 8
}


//fix [add|remove]EventListener for all browsers that support it
if(document.addEventListener &&
	_testElement.addEventListener//[ielt9] IE < 9 has no `addEventListener` in _testElement
  ) {
	// FF fails when you "forgot" the optional parameter for addEventListener and removeEventListener
	// Agr!!! FF 3.6 Unable to override addEventListener https://bugzilla.mozilla.org/show_bug.cgi?id=428229
	// Opera didn't do anything without optional parameter
	var _rightBehavior = false,
		dummy = function () {
			_rightBehavior = true
		};

	try {
		_testElement.addEventListener("click", dummy);
		if(_testElement.click)// NO: Opera 10.10
			_testElement.click();//testing
		else
			_testElement.dispatchEvent(new _Event("click"));
	} catch (e) {

	} finally {
		if(!_rightBehavior) {//fixEventListenerAll
			_forEach(
				[global["HTMLDocument"] && global["HTMLDocument"].prototype || global["document"],
				 global["Window"] && global["Window"].prototype || global,
				 elementProto],
				function (elementToFix) {
					if(elementToFix) {
						var old_addEventListener = elementToFix.addEventListener,
							old_removeEventListener = elementToFix.removeEventListener;

						if(old_addEventListener)elementToFix.addEventListener = function (type, listener, optional) {
							optional = optional || false;
							return old_addEventListener.call(this, type, listener, optional);
						};
						//elementToFix.addEventListener.shim = true;
						if(old_removeEventListener)elementToFix.removeEventListener = function (type, listener, optional) {
							optional = optional || false;
							return old_removeEventListener.call(this, type, listener, optional);
						};
						//elementToFix.removeEventListener.shim = true;
					}
				}
			);
		}
	}
}
else if(DEBUG && !document.addEventListener) {
	console.error("[add|remove]EventListener not supported")
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Events  ======================================  */
/*  ======================================================================================  */



/*  =======================================================================================  */
/*  =================================  Utils.Dom  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/**
 * __Non-standart__
 * Utils.Dom.DOMStringCollection
 * DOMSettableTokenList like object
 * http://www.w3.org/TR/html5/common-dom-interfaces.html#domsettabletokenlist-0
 * @param {string} string initial string
 * @param {Function} onchange callback for onchange event
 * @constructor
 */
var DOMStringCollection = function(string, onchange) {
	/**
	 * Event fired when any change apply to the object
	 */
	this._onchange = onchange;
	this.length = 0;
	this._container = [];
	this.value = "";

	this.update(string);
};

var methods = {
	checkToken: function(token) {
		if(token === "")_throwDOMException("SYNTAX_ERR");
		if((token + "").indexOf(" ") > -1)_throwDOMException("INVALID_CHARACTER_ERR");
	},
	add: function(token, initialisation) {
		this.checkToken(token);

		var thisObj = this, v = thisObj.value;

		if(!initialisation && thisObj._container.indexOf(token) !== -1)return;

		thisObj.value += ((v && !(new RegExp("\\s+$", "g")).test(v) ? " " : "") + token);

		this._container.push(token);
		this[(this.length = this._container.length) - 1] = token;

		if(!initialisation && thisObj._onchange)thisObj._onchange.call(thisObj);
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
		});
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
	update: function(_string) {
		var string = _string || "";//default value

		var isChange = !!this.length;

		if(isChange) {
			for(var i = 0 ; i < this.length ; ++i)
				delete this[i];
			this.length = 0;
			this._container = [];
			this.value = "";
		}

		if(string) {
			if(string = string.trim()) {
				string.split((new RegExp("\\s+", "g"))).forEach(function(token){
					this.add(token, true);
				}, this);
			}
			else this.value = _string;//empty value should stringify to contain the attribute's whitespace
		}			

		if(isChange && this._onchange)this._onchange.call(this);

		return this;
	}
};
for(var key in methods)DOMStringCollection.prototype[key] = methods[key];
//[ie8 BUG]toString not in result of `for`
DOMStringCollection.prototype.toString = function(){return this.value||""};

if(INCLUDE_EXTRAS) {//Export DOMStringCollection
	if(!global["Utils"])global["Utils"] = {};
	if(!global["Utils"]["Dom"])global["Utils"]["Dom"] = {};
	global["Utils"]["Dom"]["DOMStringCollection"] = DOMStringCollection;
}


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Utils.Dom  ==================================  */
/*  =======================================================================================  */



/*  ======================================================================================  */
/*  ================================  Element.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */


/*  Some of from https://github.com/Raynos/DOM-shim/  */

//https://developer.mozilla.org/en/DOM/Element.classList
//Add JS 1.8 Element property classList	   
// IE < 8 support in a.ielt8.js and a.ielt8.htc
if(!("classList" in _testElement)) {
	Object.defineProperty(elementProto, "classList", {
		"get" : function() {
			var thisObj = this,
				cont = thisObj["_"] || (thisObj["_"] = {}),//Положим _cachedClassList в контейнер "_"
				_cachedClassList = "_ccl_";

			if(!cont[_cachedClassList])cont[_cachedClassList] = new DOMStringCollection(thisObj.className, function() {
				thisObj.setAttribute("class", this.value);//this instanceof DOMStringCollection
				if(thisObj.className != this.value)thisObj.className = this.value;
			});

			return cont[_cachedClassList];
		}
	});
}

//https://developer.mozilla.org/en/DOM/Node.parentElement
//[FF lt 9]
if(!("parentElement" in _testElement))
	Object.defineProperty(elementProto, "parentElement", {"get" : function() {
		var parent = this.parentNode;

	    if(parent && parent.nodeType === 1)return parent;

	    return null;
	}});

//https://developer.mozilla.org/En/DOM/Node.contains
//[FF lt 9]
if(!("contains" in _testElement))
	global["Node"].prototype.contains = function (arg) {
		return !!(this.compareDocumentPosition(arg) & 16)
	};


//https://developer.mozilla.org/En/DOM/Element.insertAdjacentHTML
/*https://gist.github.com/1276030 by https://gist.github.com/eligrey*/
if(!("insertAdjacentHTML" in _testElement)) {
/**
 * insertAdjacentHTML() parses the specified text as HTML or XML and inserts the resulting nodes into the DOM tree at a specified position. It does not reparse the element it is being used on and thus it does not corrupt the existing elements inside the element. This, and avoiding the extra step of serialization make it much faster than direct innerHTML manipulation.
 * @param {string} position is the position relative to the element, and must be one of the following strings:
 *  'beforebegin' - Before the element itself.
 *  'afterbegin' - Just inside the element, before its first child.
 *  'beforeend' - Just inside the element, after its last child.
 *  'afterend' - After the element itself.
 *  Note: The beforebegin and afterend positions work only if the node is in a tree and has an element parent.
 * @param {string} html is the string to be parsed as HTML or XML and inserted into the tree.
 */
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


// Emuleted HTMLTimeElement
// TODO:: need more work
/*
if(!(global["HTMLTimeElement"] && global["HTMLTimeElement"].prototype))
Object.defineProperty((global["HTMLUnknownElement"] && global["HTMLUnknownElement"].prototype) || elementProto,
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
// IE < 9 has javascript implimentation marked as `shim`
// FROM https://github.com/Raynos/DOM-shim/blob/master/src/all/bugs.js
if(document.importNode && !document.importNode["shim"])
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

// Firefox fails on .cloneNode thinking argument is not optional
// Opera agress that its not optional.
// FROM https://github.com/Raynos/DOM-shim/blob/master/src/all/bugs.js
try {
	_testElement.cloneNode();
} catch (e) {
	[
		Node.prototype,
		//Comment.prototype,
		Element.prototype,
		//ProcessingInstruction.prototype,
		Document.prototype,
		//DocumentType.prototype,
		DocumentFragment.prototype
	].forEach(fixNodeOnProto);
}
function fixNodeOnProto(proto) {
	var cloneNode = proto.cloneNode;
	delete proto.cloneNode;
	proto.cloneNode = function _cloneNode(bool) {
		if (bool === void 0) {
			bool = true;
		}
		return cloneNode.call(this, bool);
	};
}

function mutationMacro(nodes) {
    var node = null
    nodes = [].map.call(nodes, function (node) {
        if (typeof node === "string") {
            return document.createTextNode(node)
        }
        return node
    })
    if (nodes.length === 1) {
        node = nodes[0]
    } else {
        node = document.createDocumentFragment()
        nodes.forEach(function (item) {
            node.appendChild(item)
        })
    }
    return node
}

//New DOM4 API
if(!_testElement["after"]) {
	elementProto["after"] = function () {
		if (this.parentNode === null)return;

		var node = mutationMacro(arguments);
		this.parentNode.insertBefore(node, this.nextSibling);
	};

	elementProto["before"] = function () {
		if (this.parentNode === null)return;

		var node = mutationMacro(arguments);
		this.parentNode.insertBefore(node, this);
	};

	elementProto["append"] = function () {
		var node = mutationMacro(arguments)
		this.appendChild(node)
	};
	
	elementProto["prepend"] = function () {
		var node = mutationMacro(arguments)
		this.insertBefore(node, this.firstChild)
	};

	elementProto["replace"] = function () {
		if (this.parentNode === null)return;

		var node = mutationMacro(arguments)
		this.parentNode.replaceChild(node, this)
	};

	elementProto["remove"] = function () {
		if (this.parentNode === null)return;
		this.parentNode.removeChild(this)
	};
}

if(!elementProto.matchesSelector) {
	elementProto.matchesSelector =
		elementProto["webkitMatchesSelector"] ||
		elementProto["mozMatchesSelector"] ||
		elementProto["msMatchesSelector"] ||
		elementProto["oMatchesSelector"] || function(selector) {
			var isSimpleSelector = /^[\w#.]\w*$/.test(selector);
			if(isSimpleSelector) {
				switch (selector.charAt(0)) {
					case '#':
						return thisObj.id === selector.slice(1);
					break;
					case '.':
						return !!~(" " + thisObj.className + " ").indexOf(" " + selector.slice(1) + " ");
					break;
					default:
						return thisObj.tagName === selector;
				}
			}
			var thisObj = this,
				parent = thisObj.parentNode,
				tmp,
				match = false;
			
			if(parent) {
				match = parent.querySelector(selector) === thisObj;
			}

			if(!match && (parent = thisObj.ownerDocument)) {
				tmp = parent.querySelectorAll(selector);
			    for ( e in tmp ) if(_hasOwnProperty(tmp, e)) {
			        match = tmp[e] === thisObj;
			        if(match)return true;
			    }
			}
		    return match;
		}
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

var labelableElements = "INPUT0BUTTON0KEYGEN0METER0OUTPUT0PROGRESS0TEXTAREA0SELECT".split("0");
/*
Implement HTML*Element.labels
https://developer.mozilla.org/en/DOM/HTMLInputElement
http://www.w3.org/TR/html5/forms.html#dom-lfe-labels
*/
if(!("labels" in document.createElement("input")))
	Object.defineProperty(elementProto, "labels", {
		enumerable: true,
		"get" : function() {
			if(!~labelableElements.indexOf(this.nodeName.toUpperCase()))
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
	Object.defineProperty(global["HTMLLabelElement"] && global["HTMLLabelElement"].prototype || elementProto, "control", {
		enumerable: true,
		"get" : function() {
			if(this.nodeName.toUpperCase() !== "LABEL")
				return void 0;

			if(this.hasAttribute("for"))
				return document.getElementById(this.htmlFor);

			return _recursivelyWalk(this.childNodes,
					function(el) {
						if(~labelableElements.indexOf(el.nodeName.toUpperCase()))
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
 * Based on https://gist.github.com/1671548
 *
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/grouping-content.html#the-ol-element
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/grouping-content.html#dom-li-value
 * http://www.impressivewebs.com/reverse-ordered-lists-html5/
 * http://html5doctor.com/ol-element-attributes/
 * TODO::
 *  1. Equivalent list-style-type:
		type="1"	decimal (default style)
		type="a"	lower-alpha
		type="A"	upper-alpha
		type="i"	lower-roman
		type="I"	upper-roman
 */
//In strict mode code, functions can only be declared at top level or immediately within another function
var removeAttributeChildValue,
	reversedShim;
if(INCLUDE_EXTEND_POLYFILLS && !('reversed' in document.createElement("ol"))) {
	removeAttributeChildValue = function(child) {
		child.removeAttribute("value");
	};
	reversedShim = function(list) {
		var reversed = list.getAttribute('reversed'),
			_ = list["_"];
		if(reversed !== null && !(_ || _["reversed"]))return;

		if(!_)_ = list["_"] = {"reversed" : true};//Values container

		var children = list.children,
			count = list.getAttribute('start');

		//check to see if a start attribute is provided
		if(count !== null) {
			count = Number(count);

			if(isNaN(count))count = null;
		}

		if(reversed) {
			//no, this isn't duplication - start will be set to null
			// in the previous if statement if an invalid start attribute
			// is provided
			if(count === null)
				count = children.length;

			_forEach(children, function(child) {
				child["value"] = count--;
			});
		}
		else {
			_["reversed"] = false;
			if(children[0])children[0]["value"] = count || 0;
			_forEach(children, removeAttributeChildValue);
		}
	};

	Object.defineProperty(global["HTMLOListElement"] && global["HTMLOListElement"].prototype || elementProto, "reversed", {
		get : function () {
			var thisObj = this;

			if(thisObj.tagName.toUpperCase() !== "OL")return void 0;

			return thisObj.getAttribute('reversed') !== null;
		},
		/** @param {boolean} value */
		set : function (value) {
			var thisObj = this;

			if(thisObj.tagName.toUpperCase() !== "OL")return void 0;

			thisObj[(
				value ? "remove" :
				reversedShim(thisObj), //Run shim
					"set"
					) + "Attribute"]('reversed', "");

			return value;
		}
	});

	//Auto init
	global.addEventListener('DOMContentLoaded', function() {
		_forEach(document.getElementsByTagName("ol"), reversedShim);
	}, false);
}
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  HTMLLabelElement.prototype  ==================================  */
/*  ======================================================================================  */

/*  =======================================================================================  */
/*  ======================================  Network  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(INCLUDE_EXTRAS) {

//https://github.com/Raynos/xhr/blob/master/index.js
//Thx Raynos !!!
var XHR = global["XHR"] = function(options, callback) {
	options = Object.extend({}, XHR.defaults, options);

    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {

        	if(xhr.status !== 200 && options["error"]) {
        		options["error"].call(this, this.response || 
                	this.responseText || this.responseXML)
        	}
        	else {
        		callback.call(this, null, this.response || 
                	this.responseText || this.responseXML)	
        	}
            
        }
        else if(options["proccess"])
        	options["proccess"].call(this)
    }

    if(!options["error"])xhr.onerror = function (evt) {
        callback.call(this, evt)
    }

    try {
	    xhr.open(options["method"], options["uri"]);
	    if (options["headers"]) {
	        Object.keys(options["headers"]).forEach(function (key) {
	            xhr.setRequestHeader(key, options["headers"][key])
	        })
	    }

	    xhr.send(options["data"]);
	}
	catch (e) {
		(options["error"] || callback).call(this, e);
	}

    return xhr;
}
XHR.defaults = {
	"X-Requested-With" : "HTTPRequest",
	"Content-Type" : "application/x-www-form-urlencoded; charset=utf-8"
};

}//if(INCLUDE_EXTRAS)

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Network  ======================================  */
/*  =======================================================================================  */

/*  ======================================================================================  */
/*  =======================================  Utils  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(INCLUDE_EXTRAS) {
/**
 * Random string
 * !!! ВНИМАНИЕ !!! Результирующая строка ~ в 5% случаев будет длинной length - 1
 * @param {!number} length Размер строки
 * @return {string}
 * TODO:: Поддержка length > 10. Сейчас получается хрень: String.random(14) == "l.5lqc17jlpzt(e+13)"
 */
if(!String.random)String.random = function(length) {
    return (Math.round(Math.random() * parseInt("z".repeat(++length), 36))).toString(36);//36 - 0-9a-z
};

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
};

/**
 * Object.keys-like function for Array-like collection, number and string
 * @param {Object|Array|number|string} iterable
 * @param {boolean=} forse Для typeof iterable == "object" смотреть свойства в цепочки прототипов объекта
 */
var $K = global["$K"] = function(iterable, forse) {
	var type = typeof iterable,
		length,
		results,
		i;

	if(type == "object") {
		if(browser.msie && iterable.length && !(iterable instanceof Array))iterable = _arrayFrom(iterable);//Если Arguments
		if(forse) {
			results = [];
			for(i in iterable)results.push(i);
			return results
		}
		return Object.keys(iterable);
	}

	if(type == "number" || type == "string")length = (iterable + "").length;
	else if(typeof iterable.length == "number")length = iterable.length;
	else throw new TypeError('$K:non-iterable');

	results = [];
	if(length != void 0)for(i = 0 ; i < length ; ++i)results.push(i);
	return results;
};

}//if(INCLUDE_EXTRAS)


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Utils  ======================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ========================================  DOM  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

var Event_prototype = Event.prototype;

//[Opera lt 12]
if(!Event_prototype["AT_TARGET"]) {
	Event_prototype["AT_TARGET"] = 2;
	Event_prototype["BUBBLING_PHASE"] = 3;
	Event_prototype["CAPTURING_PHASE"] = 1;/*,
		"BLUR": 8192,
		"CHANGE": 32768,
		"CLICK": 64,
		"DBLCLICK": 128,
		"DRAGDROP": 2048,
		"FOCUS": 4096,
		"KEYDOWN": 256,
		"KEYPRESS": 1024,
		"KEYUP": 512,
		"MOUSEDOWN": 1,
		"MOUSEDRAG": 32,
		"MOUSEMOVE": 16,
		"MOUSEOUT": 8,
		"MOUSEOVER": 4,
		"MOUSEUP": 2,
		"SELECT": 16384*/
}

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
	elementProto.addEventListener = global.addEventListener;
	elementProto.removeEventListener = global.removeEventListener;
	elementProto.dispatchEvent = global.dispatchEvent;
}


if(INCLUDE_EXTRAS) {
/**
 * querySelector alias
 * @param {!string|Node} selector or element
 * @param {Node|Array.<Node>} roots or element
 * @return {Node} founded element
 */
var $ = function(selector, roots) {
	if(typeof selector == 'string' || typeof selector == 'number')return $$(selector, roots, true);
	return selector;
};
if(!global["$"])global["$"] = $;//Do not rewrite jQuery
global["$$0"] = $;

/**
 * document.querySelector with `roots` as Array and special selector (">*", "~*", "+*") support
 * @param {!string} selector CSS3-selector
 * @param {Document|HTMLElement|Node|Array.<HTMLElement>=} roots Array of root element
 * @param {boolean=} isFirst return only first element (ie <root>.querySelector)
 * @return {Array.<HTMLElement>} result
 * @version 2
 */
var $$ = global["$$"] = function(selector, roots, isFirst) {
	//$$N.test = $$N["test"];//$$N["test"] TODO:: добавить в $$N["test"] проверку на нестандартные селекторы
	//TODO:: вернуть назад поддержку нестандартных псевдо-классов
	//if(document.querySelector && !($$N.test && $$N.test.test(selector)) {
	roots = roots || [document];
	if(!Array.isArray(roots))roots = [roots];

	/* replace not quoted args with quoted one -- Safari doesn't understand either */
	//if(browser.safary)//[termi 30.01.12]commented it due not actual for now
	//	selector = selector.replace(/=([^\]]+)/, '="$1"');

	selector = (selector || "").trim();
	if(!selector)return [];

	var isSpecialMod = /[>\+\~]/.test(selector.charAt(0)) || /(\,>)|(\,\+)|(\,\~)/.test(selector),
		i = -1,
		root,
		result = [],
		tmp;

	while(root = roots[++i]) {
		if(document.querySelector) {
			if(isSpecialMod) {//spetial selectors like ">*", "~div", "+a"
				if("id" in root) {
					//Мы надеемся :(, что в селекторе не будет [attrName=","]
					//TODO:: переделать сплитер, чтобы он правильно работал даже для [attrName=","]
					selector = selector.split(",")["unique"]();

					if(!root.id)root.id = $$.str_for_id + $$.uid_for_id++;

					tmp = "#" + root.id;

					result.concat(_arrayFrom(roots.querySelectorAll(tmp + selector.join("," + tmp))));
				}
			}
			else {
				result.concat(_arrayFrom(roots.querySelectorAll(selector)));
			}
			
			if(isFirst && result.length)return result[0];
		}
		else throw new Error("querySelector not supported");
	}

	return result;
};
/** @type {string} unique prefix (HTMLElement.id) */
$$.str_for_id = "r" + String.random(6);
/** @type {number} unique identificator с $$N.str_for_id */
$$.uid_for_id = 0;

}//if(INCLUDE_EXTRAS)

/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DOM  =======================================  */

/*  =======================================================================================  */
/*  ========================================  Date  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */
//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
if(!Date.prototype.toISOString || (new Date(-62198755200000).toISOString().indexOf('-000001') === -1))
    Date.prototype.toISOString = function() {
        var result, length, value, year;
        if (!isFinite(this)) {
            throw new RangeError("Date.prototype.toISOString called on non-finite value.");
        }

        // the date time string format is specified in 15.9.1.15.
        result = [this.getUTCMonth() + 1, this.getUTCDate(),
            this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
        year = this.getUTCFullYear();
        year = (year < 0 ? '-' : (year > 9999 ? '+' : '')) + ('00000' + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6);

        length = result.length;
        while (length--) {
            value = result[length];
            // pad months, days, hours, minutes, and seconds to have two digits.
            if (value < 10) {
                result[length] = "0" + value;
            }
        }
        // pad milliseconds to have three digits.
        return year + "-" + result.slice(0, 2).join("-") + "T" + result.slice(2).join(":") + "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
    }

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if(!Date.now)Date.now = function() {
	return new Date().getTime();
};

// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
if(!Date.prototype.toJSON || !~((new Date(-62198755200000)).toJSON().indexOf('-000001')) ||
    ~(function() {
        // is Date.prototype.toJSON non-generic?
        try {
            return Date.prototype.toJSON.call({toISOString:function(){return -1;}});
        } catch (err) {}
    }())) {
Date.prototype.toJSON = function(key) {
	// When the toJSON method is called with argument key, the following
	// steps are taken:

	// 1.  Let O be the result of calling ToObject, giving it the this
	// value as its argument.
	// 2. Let tv be ToPrimitive(O, hint Number).
	// 3. If tv is a Number and is not finite, return null.
	// XXX
	// 4. Let toISO be the result of calling the [[Get]] internal method of
	// O with argument "toISOString".
	// 5. If IsCallable(toISO) is false, throw a TypeError exception.
	// In "_call"
	// 6. Return the result of calling the [[Call]] internal method of
	//  toISO with O as the this value and an empty argument list.
	return _call(this.toISOString, this);

	// NOTE 1 The argument is ignored.

	// NOTE 2 The toJSON function is intentionally generic; it does not
	// require that its this value be a Date object. Therefore, it can be
	// transferred to other kinds of objects for use as a method. However,
	// it does require that any such object have a toISOString method. An
	// object is free to use the argument key to filter its
	// stringification.
};
}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
if (!Date.parse || "Date.parse is buggy") {
    // XXX global assignment won't work in embeddings that use
    // an alternate object for the context.
    Date = (function(NativeDate) {

        // Date.length === 7
        var Date = function Date(Y, M, D, h, m, s, ms) {
            var length = arguments.length;
            if (this instanceof NativeDate) {
                var date = length == 1 && String(Y) === Y ? // isString(Y)
                    // We explicitly pass it through parse:
                    new NativeDate(Date.parse(Y)) :
                    // We have to manually make calls depending on argument
                    // length here
                    length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
                    length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
                    length >= 5 ? new NativeDate(Y, M, D, h, m) :
                    length >= 4 ? new NativeDate(Y, M, D, h) :
                    length >= 3 ? new NativeDate(Y, M, D) :
                    length >= 2 ? new NativeDate(Y, M) :
                    length >= 1 ? new NativeDate(Y) :
                                  new NativeDate();
                // Prevent mixups with unfixed Date object
                date.constructor = Date;
                return date;
            }
            return NativeDate.apply(this, arguments);
        };

        // 15.9.1.15 Date Time String Format.
        var isoDateExpression = new RegExp("^" +
            "(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign + 6-digit extended year
            "(?:-(\\d{2})" + // optional month capture
            "(?:-(\\d{2})" + // optional day capture
            "(?:" + // capture hours:minutes:seconds.milliseconds
                "T(\\d{2})" + // hours capture
                ":(\\d{2})" + // minutes capture
                "(?:" + // optional :seconds.milliseconds
                    ":(\\d{2})" + // seconds capture
                    "(?:\\.(\\d{3}))?" + // milliseconds capture
                ")?" +
            "(" + // capture UTC offset component
                "Z|" + // UTC capture
                "(?:" + // offset specifier +/-hours:minutes
                    "([-+])" + // sign capture
                    "(\\d{2})" + // hours offset capture
                    ":(\\d{2})" + // minutes offset capture
                ")" +
            ")?)?)?)?" +
        "$");

        var monthes = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

        // Returns count of leap years before "year" since 0 CE
        function leapYears(year) {
            return Math.ceil(year / 4) - Math.ceil(year / 100) + Math.ceil(year / 400);
        }

        // Copy any custom methods a 3rd party library may have added
        for (var key in NativeDate) {
            Date[key] = NativeDate[key];
        }

        // Copy "native" methods explicitly; they may be non-enumerable
        Date.now = NativeDate.now;
        Date.UTC = NativeDate.UTC;
        Date.prototype = NativeDate.prototype;
        Date.prototype.constructor = Date;

        // Upgrade Date.parse to handle simplified ISO 8601 strings
        Date.parse = function parse(string) {
            var match = isoDateExpression.exec(string);
            if (match) {
                // parse months, days, hours, minutes, seconds, and milliseconds
                // provide default values if necessary
                // parse the UTC offset component
                var year = Number(match[1]),
                    month = Number(match[2] || 1),
                    day = Number(match[3] || 1),
                    hour = Number(match[4] || 0),
                    minute = Number(match[5] || 0),
                    second = Number(match[6] || 0),
                    millisecond = Number(match[7] || 0),
                    // When time zone is missed, local offset should be used (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    offset = match[8] ? 0 : Number(new Date(1970, 0)),
                    signOffset = match[9] === "-" ? 1 : -1,
                    hourOffset = Number(match[10] || 0),
                    minuteOffset = Number(match[11] || 0),    
                    leapYears0 = leapYears(year),
                    leapYears1 = leapYears(year + 1),
                    result;
                if (hour < (minute > 0 || second > 0 || millisecond > 0 ? 24 : 25) &&
                    minute < 60 &&
                    second < 60 &&
                    millisecond < 1000 &&
                    hourOffset < 24 && // detect invalid offsets
                    minuteOffset < 60 &&
                    month > 0 &&
                    month < 13 &&
                    day > 0 &&
                    day < (1 + monthes[month] - monthes[month - 1] + (month === 2 ? leapYears1 - leapYears0 : 0))) {
                    result = 365 * (year - 1970) + (month > 2 ? leapYears1 : leapYears0) - leapYears(1970) + monthes[month - 1] + day - 1;
                    result = (((result * 24 + hour + hourOffset * signOffset) * 60 + minute + minuteOffset * signOffset) * 60 + second) * 1000 + millisecond + offset;
                    if (-8.64e15 <= result && result <= 8.64e15) {
                        return result;
                    }
                }
                return NaN;
            }
            return NativeDate.parse.apply(this, arguments);
        };

        return Date;
    })(Date);
}
/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Date  =====================================  */



if(!INCLUDE_EXTRAS) {
	if(!definePropertyWorksOnObject) {
		Object.defineProperty = null;
		delete Object.defineProperty;
	}
}




/*  =======================================================================================  */
/*  ========================================  DEBUG  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(INCLUDE_EXTRAS) {
// friendly console
// http://habrahabr.ru/blogs/javascript/116852/
// https://github.com/theshock/console-cap/blob/master/console.js
// 21.02.2012 Update with CHANGES!!!
(function (console) {

var i,
	methods = ['assert','count','debug','dir','dirxml','error','group','groupCollapsed','groupEnd','info','log','markTimeline','profile','profileEnd','table','time','timeEnd','trace','warn'],
	empty   = {},
	fnApply = Function.prototype.apply,
	_bind    = function (context, fn) {
		return function () {
				return fnApply.call( fn, context, arguments );
			};
	},
	timeCounters;

for (i = methods.length; i--;) empty[methods[i]] = functionReturnFirstParam;

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
			_bind(console, console[methods[i]]) : functionReturnFirstParam;
	}
	console.disable = function () { global.console = empty;   };
	  empty.enable  = function () { global.console = console; };

	empty.disable = console.enable = functionReturnFirstParam;

} else {
	console = global.console = empty;
	console.disable = console.enable = functionReturnFirstParam;
}

})( typeof console === 'undefined' ? null : console );

}//if(INCLUDE_EXTRAS)

/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DEBUG  =====================================  */

//apply IE lt 9 shims
if(_) {
	_.forEach(_call);
	//Restore original "_" or set "_" to undefined
	global["_"] = orig_;
}

})(window);