// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name a.ielt8.js
// @check_types
// ==/ClosureCompiler==
/**
 * ES5 and DOM shim for IE < 8
 * @version 4.2
 */
 
//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = false;
//GCC DEFINES END

;(function(global) {


/** @const @type {boolean} */
var DEBUG = IS_DEBUG;

/** Browser sniffing
 * @type {boolean} */
var _browser_msie;
_browser_msie = (_browser_msie = /msie (\d+)/i.exec(navigator.userAgent)) && +_browser_msie[1] || void 0;





if(!global["Element"])((global["Element"] =
//Reprisent ActiveXObject as Node, Element and HTMLElement so `<element> instanceof Node` is working (!!!But no in IE9 with in "compatible mode")
	ActiveXObject
).prototype)["ie"] = true;//fake prototype for IE < 8
if(!global["HTMLElement"])global["HTMLElement"] = global["Element"];//IE8
if(!global["Node"])global["Node"] = global["Element"];//IE8



var _temoObj;
//Not sure if it wrong. TODO:: tests for this
if(!global["DocumentFragment"]) {

	global["DocumentFragment"] = 
		global["Document"] || global["HTMLDocument"] ||//For IE8
		(_temoObj = {}, _temoObj.prototype = {}, _temoObj);//For IE < 8

}
if(!global["Document"])global["Document"] = global["DocumentFragment"];






//"_" - container for shims what should be use in a.js
var orig_ = global["_"],//Save original "_" - we will restore it in a.js
	_ = global["_"] = {
		"ielt9shims" : [],
		"orig_" : orig_
	}["ielt9shims"]
	
  , __temporary__DOMContentLoaded_container = {}

	/** @const */
  , document_createDocumentFragment = document.createDocumentFragment

	/** @const */
  , document_createElement = document.createElement

	/** @const */
  , document_createTextNode = document.createTextNode

	/** @const */
  , _document_documentElement = document.documentElement

	/** @const */
  , _throwDOMException = function(errStr) {
		var ex = Object.create(DOMException.prototype);
		ex.code = DOMException[errStr];
		ex.message = errStr +': DOM Exception ' + ex.code;
		throw ex;
	}

	/** @const */
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

	/** @const */
  , _append = function(obj, extention) {
		for(var key in extention)
			if(_hasOwnProperty(extention, key) && !_hasOwnProperty(obj, key))
				obj[key] = extention[key];
		
		return obj;
	}

	/** @const */
  , _safeExtend = function(obj, extention) {
		for(var key in extention)
			if(_hasOwnProperty(extention, key) && obj[key] !== extention[key])
				try {//prevent IE error "invalid argument."
					obj[key] = extention[key];
				}
				catch(e) { }
		
		return obj;
	}

  	/**
  	 *  @const
     * Use native and probably broken function or Quick, but non-full-standart
	 * For system use only
	 * More standart solution in a.js
	 */
  , _String_trim = String.prototype.trim || (String.prototype.trim = function () {//Cache origin trim function
		var	str = this.replace(RE__String_trim_spaces, ''),
			ws = RE_space,
			i = str.length;
		while (ws.test(str.charAt(--i))){};
		return str.slice(0, i + 1);
	})
	
	/** @const */
  , _String_split = String.prototype.split

	/** @const */
  , _String_substr = String.prototype.substr

	/** @const */
  , _Array_slice = Array.prototype.slice

	/** @const */
  , _Array_splice = Array.prototype.splice

	/** @const */
  , _Function_apply = Function.prototype.apply

	/** @const */
  , _Function_call = Function.prototype.call
	
	/** Use native "bind" or unsafe bind for service and performance needs
	 * @const
	 * @param {Function} __method
	 * @param {Object} object
	 * @param {...} var_args
	 * @return {Function} */
  , _unSafeBind = Function.prototype.bind || function(object, var_args) {
		var __method = this,
			args = _Array_slice.call(arguments, 1);
		return function () {
			return _Function_apply.call(__method, object, args.concat(_Array_slice.call(arguments)));
		}
	} 
	
	/** @const */
  , _hasOwnProperty = _unSafeBind.call(Function.prototype.call, Object.prototype.hasOwnProperty)
  
	/**
	 * @const
	 * Call _function
	 * @param {Function} _function function to call
	 * @param {*} context
	 * @param {...} var_args
	 * @return {*} mixed
	 * @version 2
	 */
  , _call = function(_function, context, var_args) {
		// If no callback function or if callback is not a callable function
		// it will throw TypeError
       return _Function_apply.call(_function, context, _Array_slice.call(arguments, 2))
	}

  	/** @type {Node} */
  , _testElement = document.createElement('p')

  , _txtTextElement
	
  , _Node_prototype = global["Node"].prototype
	
  , _Element_prototype = global["Element"].prototype

	/** @const */
  , _Node_contains = _Node_prototype.contains || _testElement.contains

	/** @const */
  , _Native_Date = Date

	/** @const @type {RegExp} */
  , RE_cloneElement_tagMatcher = /^\<([\w\:\-]*)[\>\ ]/i
	
	/** @const @type {RegExp} */
  , RE_space = /\s/
	
	/** @const @type {RegExp} */
  , RE__String_trim_spaces = /^\s\s*/
	
	/** @type {boolean} */
  , boolean_tmp

	/** @type {string} */
  , string_tmp

	/** @type {number} */
  , number_tmp

	/** @type {function} */
  , function_tmp

	/** @type {Object} */
  , object_tmp

  , nodeList_methods_fromArray = ["every", "filter", "forEach", "indexOf", "join", "lastIndexOf", "map", "reduce", "reduceRight", "reverse", "slice", "some", "toString"]

	// ------------------------------ ==================  Events  ================== ------------------------------
  , _event_eventHandlersContainer_by_sourceIndex = {}

  , _fake_Event_prototype = {
	  	/** @const @type {function} */
	  	"preventDefault" : function(){this.returnValue = false} ,
	  	/** @const @type {function} */
	  	"stopPropagation" : function(){this.cancelBubble = true} ,
	  	/** @const @type {function} */
	  	"stopImmediatePropagation" : function() {
			this["__stopNow"] = true;
			this.stopPropagation()
		}
	}

  , _Event_prototype

	/** @const @type {string} */
  , _event_UUID_prop_name = "uuid"

	/** @type {number} unique indentifier for event listener */
  , _event_UUID = 0

	/** @const @type {string} */
  , _event_handleUUID = "_h_9e2"

	/** @const @type {string} */
  , _event_eventsUUID = "_e_8vj"

	// ------------------------------ ==================  HTML5 shiv  ================== ------------------------------

  , html5_elements = 'abbr|article|aside|audio|canvas|command|datalist|details|figure|figcaption|footer|header|hgroup|keygen|mark|meter|nav|output|progress|section|source|summary|time|video'

  , html5_elements_array = html5_elements.split('|')
	
	/* Not all elements can be cloned in IE (this list can be shortend) **/
  , ielt9_elements = /^<|^(?:a|b|button|code|div|fieldset|form|map|h1|h2|h3|h4|h5|h6|i|object|iframe|img|input|label|li|link|ol|option|p|param|q|script|select|span|strong|style|table|tbody|td|textarea|tfoot|th|thead|tr|ul|optgroup)$/i

	// feature detection: whether the browser supports unknown elements
	/** @type {boolean}*/
  , supportsUnknownElements
	
  , safeFragment

	/** @type {Node} */
  , safeElement

  , _nativeCloneNode
;







//Emulating HEAD for ie < 9
document.head || (document.head = document.getElementsByTagName('head')[0]);

document.defaultView || (document.defaultView = global);

if(DEBUG) {
	//test DOMElement is an ActiveXObject
	if(!(_Function_call.call(document_createElement, document, "div") instanceof ActiveXObject))
		console.error("DOMElement is not an ActiveXObject. Probably you in IE > 8 'compatible mode'. <element> instanceof [Node|Element|HTMLElement] wouldn't work");
}


if(!global["Event"])global["Event"] = {};
_Event_prototype = global["Event"].prototype || (global["Event"].prototype = {});
_append(_Event_prototype, _fake_Event_prototype);

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Function.prototype  ==================================  */
/*  =======================================================================================  */


//Fix Function.prototype.apply to work with generic array-like object instead of an array
// test: (function(a,b){console.log(a,b)}).apply(null, {0:1,1:2,length:2})
boolean_tmp = false;
try {
	boolean_tmp = isNaN.apply(null, {})
}
catch(e) { }
if(!boolean_tmp) {
	Function.prototype.apply = function(contexts, args) {
		try {
			return args != void 0 ?
				_Function_apply.call(this, contexts, args) :
				_Function_apply.call(this, contexts);
		}
		catch (e) {
			if(e["number"] != -2146823260 ||//"Function.prototype.apply: Arguments list has wrong type"
				args.length === void 0 || //Not an iterable object
			   typeof args === "string"//Avoid using String
			  )
				throw e;

			return _Function_apply.call(this, contexts, Array["from"](args));
		}
	};
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Function.prototype  ==================================  */
/*  =======================================================================================  */


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  String.prototype  ==================================  */
/*  =======================================================================================  */

//[BUGFIX, IE lt 9] IE < 9 substr() with negative value not working in IE
if("ab".substr(-1) !== "b") {
	//String.prototype._itlt9_substr_ = String.prototype.substr;
	String.prototype.substr = function(start, length) {
		return _String_substr.call(this, start < 0 ? (start = this.length + start) < 0 ? 0 : start : start, length);
	}
}

/*
[BUGFIX, IE lt 9, old safari] http://blog.stevenlevithan.com/archives/cross-browser-split
More better solution:: http://xregexp.com/
*/
if('te'.split(/(s)*/)[1] != void 0 ||
   '1_1'.split(/(_)/).length != 3) {
   boolean_tmp = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group
   
	String.prototype.split = function (separator, limit) {
		var str = this;
		// if `separator` is not a regex, use the native `split`
		if(!(separator instanceof RegExp)) {//if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
			//http://es5.github.com/#x15.5.4.14
			//If separator is undefined, then the result array contains just one String, which is the this value (converted to a String). If limit is not undefined, then the output array is truncated so that it contains no more than limit elements.
			if(separator === void 0 && limit === 0)return [];
			
			return _String_split.call(str, separator, limit);
		}

		var output = [],
			lastLastIndex = 0,
			flags = (separator.ignoreCase ? "i" : "") +
					(separator.multiline  ? "m" : "") +
					(separator.sticky     ? "y" : ""),
			separator1 = new RegExp(separator.source, flags + "g"), // make `global` and avoid `lastIndex` issues by working with a copy
			separator2 = null, match, lastIndex, lastLength;

		str = str + ""; // type conversion
		if (!boolean_tmp) {
			separator2 = new RegExp("^" + separator1.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
		}

		/* behavior for `limit`: if it's...
		- `undefined`: no limit.
		- `NaN` or zero: return an empty array.
		- a positive number: use `Math.floor(limit)`.
		- a negative number: no limit.
		- other: type-convert, then use the above rules. */
		if (limit === void 0 || +limit < 0) {
			limit = Infinity;
		} else {
			limit = Math.floor(+limit);
			if (!limit) {
				return [];
			}
		}		
		
		while (match = separator1.exec(str)) {
			lastIndex = match.index + match[0].length; // `separator1.lastIndex` is not reliable cross-browser

			if (lastIndex > lastLastIndex) {
				output.push(str.slice(lastLastIndex, match.index));

				// fix browsers whose `exec` methods don't consistently return `undefined` for nonparticipating capturing groups
				// __ NOT WORKING __ !!!!
				if (!boolean_tmp && match.length > 1) {
					match[0].replace(separator2, function() {
						for (var i = 1, a = arguments, l = a.length - 2; i < l; i++) {//for (var i = 1; i < arguments.length - 2; i++) {
							if (a[i] === void 0) {
								match[i] = void 0;
							}
						}
					});
				}

				if (match.length > 1 && match.index < str.length) {
					output.push.apply(output, match.slice(1));//Array.prototype.push.apply(output, match.slice(1));
				}

				lastLength = match[0].length;
				lastLastIndex = lastIndex;

				if (output.length >= limit) {
					break;
				}
			}

			if (separator1.lastIndex === match.index) {
				separator1.lastIndex++; // avoid an infinite loop
			}
		}

		if (lastLastIndex === str.length) {
			if (lastLength || !separator1.test("")) {
				output.push("");
			}
		} else {
			output.push(str.slice(lastLastIndex));
		}

		return output.length > limit ? output.slice(0, limit) : output;
	}
}


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  String.prototype  ==================================  */
/*  =======================================================================================  */



/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Exception  ==================================  */
/*  =======================================================================================  */
if(!global["DOMException"]) {
	var p = (global["DOMException"] = function() { }).prototype = new Error;
	p.INDEX_SIZE_ERR = 1;
	//p.DOMSTRING_SIZE_ERR = 2; // historical
	p.HIERARCHY_REQUEST_ERR = 3;
	p.WRONG_DOCUMENT_ERR = 4;
	p.INVALID_CHARACTER_ERR = 5;
	//p.NO_DATA_ALLOWED_ERR = 6; // historical
	p.NO_MODIFICATION_ALLOWED_ERR = 7;
	p.NOT_FOUND_ERR = 8;
	p.NOT_SUPPORTED_ERR = 9;
	//p.INUSE_ATTRIBUTE_ERR = 10; // historical
	p.INVALID_STATE_ERR = 11;
	p.SYNTAX_ERR = 12;
	p.INVALID_MODIFICATION_ERR = 13;
	p.NAMESPACE_ERR = 14;
	p.INVALID_ACCESS_ERR = 15;
	//p.VALIDATION_ERR = 16; // historical
	p.TYPE_MISMATCH_ERR = 17;
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Exception  ==================================  */
/*  =======================================================================================  */

/*  ======================================================================================  */
/*  ======================================  Window  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

//http://javascript.gakaa.com/window-scrollx-2-0-scrolly.aspx
if(!("pageXOffset" in global)) {
	_.push(function() {
		var _getScrollX = document.compatMode === "CSS1Compat" ? function(){return document.body.parentNode.scrollLeft} : function(){return document.body.scrollLeft};
		var _getScrollY = document.compatMode === "CSS1Compat" ? function(){return document.body.parentNode.scrollTop} : function(){return document.body.scrollTop};

		Object.defineProperty(global, "pageXOffset", {"get" : _getScrollX});
		Object.defineProperty(global, "pageYOffset", {"get" : _getScrollY});
	});
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Window  ======================================  */
/*  ======================================================================================  */

/*  ======================================================================================  */
/*  ======================================  Events  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

//fix [add|remove]EventListener & dispatchEvent for IE < 9

// TODO: https://github.com/arexkun/Vine
//		 https://github.com/kbjr/Events.js


function fixEvent(event) {
	var thisObj = this;
	
	// один объект события может передаваться по цепочке разным обработчикам
	// при этом кроссбраузерная обработка будет вызвана только 1 раз
	// Снизу, в функции commonHandle,, мы должны проверять на !event["__isFixed"]
	event["__isFixed"] = true;// пометить событие как обработанное

	//http://javascript.gakaa.com/event-detail.aspx
	//http://www.w3.org/TR/2011/WD-DOM-Level-3-Events-20110531/#event-type-click
	//indicates the current click count; the attribute value must be 1 when the user begins this action and increments by 1 for each click.
	if(event.type === "click" && event.detail === void 0)event.detail = 1;
	else if(event.type === "dblclick" && event.detail === void 0)event.detail = 2;

	_append(event, _Event_prototype);

	event.target || (event.target = event.srcElement || document);// добавить target для IE

	// добавить relatedTarget в IE, если это нужно
	if(event.relatedTarget === void 0 && event.fromElement)
		event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement;

	// вычислить pageX/pageY для IE
	if(event.pageX == null && event.clientX != null) {
		var html = _document_documentElement, body = document.body;
		/*event.pageX = event.clientX + (html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0);
		event.pageY = event.clientY + (html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0);*/
		//Новая вервия нуждающаяся в проверки
		event.pageX = event.clientX + (window.pageXOffset || html.scrollLeft || body.scrollLeft || 0) - (html.clientLeft || 0);
		event.pageY = event.clientY + (window.pageYOffset || html.scrollTop || body.scrollTop || 0) - (html.clientTop || 0);
	}

	//Add 'which' for click: 1 == left; 2 == middle; 3 == right
	//Unfortunately the event.button property is not set for click events. It is however set for mouseup/down/move ... but not click | http://bugs.jquery.com/ticket/4164
	if(!event.which && "button" in event)event.which = event.button & 1 ? 1 : event.button & 2 ? 3 : event.button & 4 ? 2 : 0;

	if(!event.timeStamp)event.timeStamp = +new _Native_Date();
	
	if(!event.eventPhase)event.eventPhase = (event.target == thisObj) ? 2 : 3; // "AT_TARGET" = 2, "BUBBLING_PHASE" = 3
	
	if(!event.currentTarget)event.currentTarget = thisObj;
		
		
	// событие DOMAttrModified
	//  TODO:: недоделано
	// TODO:: Привести event во всех случаях (для всех браузеров) в одинаковый вид с newValue, prevValue, propName и т.д.
	if(!event.attrName && event.propertyName)event.attrName = _String_split.call(event.propertyName, '.')[0];//IE При изменении style.width в propertyName передаст именно style.width, а не style, как нам надо

	return event
}

// вспомогательный универсальный обработчик. Вызывается в контексте элемента всегда this = element
function commonHandle(nativeEvent) {
	if(fixEvent === void 0) {//фильтруем редко возникающую ошибку, когда событие отрабатывает после unload'а страницы. 
		return;
	}

	var thisObj = this,
		_ = thisObj["_"],
		errors = [],//Инициализуется массив errors для исключений
		errorsMessages = [],
		event;
	
	if(!_ || !_[_event_eventsUUID])return;
	
	// получить объект события и проверить, подготавливали мы его для IE или нет
	nativeEvent || (nativeEvent = window.nativeEvent);
	if(!nativeEvent["__isFixed"])nativeEvent = fixEvent.call(thisObj, nativeEvent);

	// save event properties in fake 'event' object to allow store 'event' and use it in future
	if(!nativeEvent["__custom_event"])(event = _safeExtend(new Event(nativeEvent.type), nativeEvent))["__custom_event"] = true;
	else event = nativeEvent;


	var handlers = _[_event_eventsUUID][event.type];

	if(!handlers)return;

	for(var g in handlers)if(_hasOwnProperty(handlers, g)) {
		var handler = handlers[g],
			context;

		if(typeof handler === "object") {
			context = handler;
			handler = handler.handleEvent;
		}

		try {
			//Передаём контекст и объект event, результат сохраним в event['result'] для передачи значения дальше по цепочке
			if(
				(
					event['result'] = _Function_call.call(handler, context || thisObj, event)
				)
				=== false
			  ) {//Если вернели false - остановим обработку функций
				event.preventDefault();
				event.stopPropagation();
			}
		}
		catch(e) {
			errors.push(e);//Все исключения - добавляем в массив, при этом не прерывая цепочку обработчиков.
			errorsMessages.push(e.message);
			if(console)console.error(e);
		}

		if(event["__stopNow"])break;//Мгновенная остановка обработки событий
	}

	//return changed properties in native 'event' object
	nativeEvent.returnValue = event.returnValue;
	nativeEvent.cancelBubble = event.cancelBubble;
	//TODO:: check out that properties need to be returned in native 'event' object or _extend(nativeEvent, event);
	
	if(errors.length == 1) {//Если была только одна ошибка - кидаем ее дальше
		throw errors[0]
	}
	else if(errors.length > 1) {//Иначе делаем общий объект Error со списком ошибок в свойстве errors и кидаем его
		var e = new Error("Multiple errors thrown : " + event.type + " : " + " : " + errorsMessages.join("|"));
		e.errors = errors;
		throw e;
	}
}



if(!document.addEventListener)_Node_prototype.addEventListener = global.addEventListener = document.addEventListener = function(_type, _handler, useCapture) {
	//TODO:: useCapture == true
	if(typeof _handler != "function" &&
	   !(typeof _handler === "object" && _handler.handleEvent)//Registering an EventListener with a function object that also has a handleEvent property -> Call EventListener as a function
	  ) {
		return;
	}
	
	var /** @type {Node} */
		thisObj = this,
		/** @type {Object} */
		_ = thisObj["_"],
		/** @type {Function} */
		_callback,
		/** @type {boolean} */
		_useInteractive = false;
		/* * @ type {number} 
		_event_phase = useCapture ? 1 : 3;*/
		
	if(!_)_ = thisObj["_"] = {};
	//_ = _[_event_phase] || (_[_event_phase] = {});
	
	if(_type === "DOMContentLoaded") {//IE
		if (document.readyState == 'complete')return;

		if(thisObj === global)thisObj = document;

		_useInteractive = true;
		
		if(!__temporary__DOMContentLoaded_container[_type]) {
			__temporary__DOMContentLoaded_container[_type] = true;
			var a = document.getElementById("__ie_onload");
			if(!a) {
				document.write("<script id=\"__ie_onload\" defer=\"defer\" src=\"javascript:void(0)\"><\/script>");
				a = document.getElementById("__ie_onload");
				a.onreadystatechange = function(e) {
					var n = this;
					if(n.readyState == "complete") {
						if(n.alreadyDone)return;
						n.alreadyDone = true;
						commonHandle.call(thisObj, {"type" : _type});
					}
				}
			}/*
			function poll() {
				try { document.documentElement.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
				commonHandle.call(thisObj, {"type" : _type});
			};

			var top;
			if (document.createEventObject && document.documentElement.doScroll) {
				try { top = !global.frameElement; } catch(e) { }
				if (top) poll();
			}*/
		}
	}
	/* TODO:: DOMAttrModified
	else if(_type == "DOMAttrModified") {
	
	}
	*/
	else if(_type === "load" && "tagName" in thisObj && thisObj.tagName.toUpperCase() === "SCRIPT") {//[script:onload]
		//FROM https://github.com/jrburke/requirejs/blob/master/require.js
		//Probably IE. IE (at least 6-8) do not fire
		//script onload right after executing the script, so
		//we cannot tie the anonymous define call to a name.
		//However, IE reports the script as being in "interactive"
		//readyState at the time of the define call.
		_useInteractive = true;
		
		//Need to use old school onreadystate here since
		//when the event fires and the node is not attached
		//to the DOM, the evt.srcElement is null, so use
		//a closure to remember the node.
		thisObj.onreadystatechange = function (evt) {
			evt = evt || window.event;
			//Script loaded but not executed.
			//Clear loaded handler, set the real one that
			//waits for script execution.
			if (thisObj.readyState === 'loaded') {
				thisObj.onreadystatechange = null;
				thisObj.attachEvent("onreadystatechange", _unSafeBind.call(commonHandle, thisObj, {"type" : _type}));
			}
		};
		_type = "readystatechange";
	}
	else if(_type === "DOMMouseScroll")_type = "mousewheel";//TODO:: Test it
	
	/*
	TODO::
	Reference: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
	If multiple identical EventListeners are registered on the same EventTarget with the same parameters the duplicate instances are discarded. They do not cause the EventListener to be called twice and since they are discarded they do not need to be removed with the removeEventListener method.
	*/
	
	
	// исправляем небольшой глюк IE с передачей объекта window
	if(thisObj.setInterval && (thisObj != global && !thisObj["frameElement"]))thisObj = global;
	
	//Назначить функции-обработчику уникальный номер. По нему обработчик можно будет легко найти в списке events[type].
	if(!_handler[_event_UUID_prop_name])_handler[_event_UUID_prop_name] = ++_event_UUID;
	
	//Инициализовать служебную структуру events и обработчик _[handleUUID]. 
	//Основная его задача - передать вызов универсальному обработчику commonHandle с правильным указанием текущего элемента this. 
	//Как и events, _[handleUUID] достаточно инициализовать один раз для любых событий.
	if(!(_callback = _[_event_handleUUID])) {
		_callback = _[_event_handleUUID] = _unSafeBind.call(commonHandle, thisObj);
	}

	//Если обработчиков такого типа событий не существует - инициализуем events[type] и вешаем
	// commonHandle как обработчик на elem для запуска браузером по событию type.
	if(!_[_event_eventsUUID])_[_event_eventsUUID] = {};
	if(!_[_event_eventsUUID][_type]) {
		_[_event_eventsUUID][_type] = {};
		
		if(!_useInteractive)//[script:onload]
			thisObj.attachEvent('on' + _type, _callback);
	}
	
	//Добавляем пользовательский обработчик в список elem[_event_eventsUUID][type] под заданным номером. 
	//Так как номер устанавливается один раз, и далее не меняется - это приводит к ряду интересных фич.
	// Например, запуск add с одинаковыми аргументами добавит событие только один раз.
	_[_event_eventsUUID][_type][_handler[_event_UUID_prop_name]] = _handler;
};

if(!document.removeEventListener)_Node_prototype.removeEventListener = global.removeEventListener = document.removeEventListener = function(_type, _handler, useCapture) {
	var /** @type {Node} */
		thisObj = this,
		/** @type {Object} */
		_ = thisObj["_"];
		/** @type {number} 
		_event_phase = useCapture ? 1 : 3;*/
	
	if(typeof _handler != "function" || !_handler.guid || !_)return;

	//_ = _[_event_phase] || (_[_event_phase] = {});
	//if(!_)return;

	var handlers = _[_event_eventsUUID] && _[_event_eventsUUID][_type];//Получить список обработчиков
	
	delete handlers[_handler.guid];//Удалить обработчик по его номеру

	for(var any in handlers)if(_hasOwnProperty(handlers, any))return;//TODO: проверить, что тут делается. Глупость какая-то.Проверить, не пуст ли список обработчиков
	//Если пуст, то удалить служебный обработчик и очистить служебную структуру events[type]
	thisObj.detachEvent("on" + _type, commonHandle);

	delete _[_event_eventsUUID][_type];

	//Если событий вообще не осталось - удалить events за ненадобностью.
	for(var any in _[_event_eventsUUID])if(_hasOwnProperty(_[_event_eventsUUID], any))return;
	
	delete _[_event_eventsUUID];
};

/**
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
 * @param {(Event|CustomEvent)} _event is an event object to be dispatched.
 * @this {Element} is the target of the event.
 * @return {boolean} The return value is false if at least one of the event handlers which handled this event called preventDefault. Otherwise it returns true.
 */
if(!document.dispatchEvent)_Node_prototype.dispatchEvent = global.dispatchEvent = document.dispatchEvent = function(_event) {
	if(!_event.type)return true;
	/**
	 * @type {Node}
	 */
	var thisObj = this;
	
	try {
		return thisObj.fireEvent("on" + _event.type, _event);
	}
	catch(e) {
		//Shim for Custome events in IE < 9
		if(e["number"] === -2147024809 ||//"invalid argument."
		   thisObj === global) {		 //window has not 'fireEvent' method
			_event["__custom_event"] = true;
			var node = _event.target = thisObj;
			//Всплываем событие
			while(!_event.cancelBubble && node) {//Если мы вызвали stopPropogation() - больше не всплываем событие
				if("_" in node && _event_eventsUUID in node["_"])//Признак того, что на элемент могли навесить событие
					commonHandle.call(node, _event);
				//Если у события отключено всплытие - не всплываем его
				node = _event.bubbles ? (node === document ? document.defaultView : node.parentNode) : null;
			}
			
			return !_event.cancelBubble;
		}
		else throw e;
	}
};

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
		var thisObj = this;
	
		thisObj.type = _type;
		//this.cancelBubble = //TODO:: <-- testing Глупость ???
		//	!(this.bubbles = _bubbles);
		thisObj.bubbles = _bubbles;
		thisObj.cancelable = _cancelable;//https://developer.mozilla.org/en/DOM/event.cancelable
		
		thisObj.isTrusted = false;
		thisObj.target = null;

		if(!thisObj.timeStamp)thisObj.timeStamp = +new _Native_Date();
	}
	function _initCustomEvent(_type, _bubbles, _cancelable, _detail) {
		//https://developer.mozilla.org/en/DOM/CustomEvent
		_initEvent.call(this, _type, _bubbles, _cancelable);
		
		this.detail = _detail;
	}
	function _initUIEvent(_type, _bubbles, _cancelable, _view, _detail) {
		//https://developer.mozilla.org/en/DOM/event.initUIEvent
		_initCustomEvent.call(this, _type, _bubbles, _cancelable, _detail);
		
		this.view = _view;
	}
	function _initMouseEvent(_type, _bubbles, _cancelable, _view, 
                     _detail, _screenX, _screenY, _clientX, _clientY, 
                     _ctrlKey, _altKey, _shiftKey, _metaKey, 
                     _button, _relatedTarget) {
		var thisObj = this;
		//https://developer.mozilla.org/en/DOM/event.initMouseEvent
		_initUIEvent.call(thisObj, _type, _bubbles, _cancelable, _view, _detail);
		
		thisObj.screenX = _screenX;
		thisObj.screenY = _screenY;
		thisObj.clientX = _clientX;
		thisObj.clientY = _clientY;
        thisObj.ctrlKey = _ctrlKey;
		thisObj.altKey = _altKey;
		thisObj.shiftKey = _shiftKey;
		thisObj.metaKey = _metaKey;
		thisObj.button = _button;
		thisObj.relatedTarget = _relatedTarget;
	}

	/**
	 * https://developer.mozilla.org/en/DOM/document.createEvent
	 * Not using. param {string} eventType is a string that represents the type of event to be created. Possible event types include "UIEvents", "MouseEvents", "MutationEvents", and "HTMLEvents". See https://developer.mozilla.org/en/DOM/document.createEvent#Notes section for details.
	 */
	document.createEvent = function() {
		var eventObject;
		
		eventObject = document.createEventObject();
		
		eventObject.returnValue = true;//default value
		eventObject.initEvent = _initEvent;
		eventObject.initCustomEvent = _initCustomEvent;
		eventObject.initUIEvent = _initUIEvent;
		eventObject.initMouseEvent = _initMouseEvent;
		
		return eventObject;
	}
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Events  ======================================  */
/*  ======================================================================================  */


/*  ======================================================================================  */
/*  ========================================  DOM  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/*  ================================ bug fixing  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */


// IE - contains fails if argument is textnode
_txtTextElement = _Function_call.call(document_createTextNode, document, "temp");
_testElement.appendChild(_txtTextElement);

try {
    _testElement.contains(_txtTextElement);
    boolean_tmp = false;
} catch (e) {
	boolean_tmp = true;
	_Node_prototype.contains = function contains(other) {
    	if(other.nodeType === 3) {
		    return _recursivelyWalk(this.childNodes, function (node) {
		         if (node === other) return true;
		    }) || false;
		}
		else return _Function_call.call(_Node_contains, this, other);
	};
}

// IE8 hurr durr doctype is null
if (document.doctype === null && _browser_msie > 7)//TODO:: this fix for IE < 8
	_.push(function() {
		var documentShim_doctype = document.childNodes[0];
		Object.defineProperty(documentShim_doctype, "nodeType", {
			get: function () { return 10 } 
		});
	    Object.defineProperty(document, "doctype", {configurable : true, enumerable : false, get : function () { return documentShim_doctype } });
	});

// IE8 hates you and your f*ing text nodes
// I mean text node and document fragment and document no inherit from node
// Extend Text.prototype and HTMLDocument.prototype with shims
// TODO:: Do something with IE < 8
if(!_Node_prototype.contains)_Node_prototype.contains = _Node_contains;
if (!_Function_call.call(document_createTextNode, document).contains){
	if(global["Text"] && global["Text"].prototype) {//IE8
	    _.push(_unSafeBind.call(_append, null, Text.prototype, _Node_prototype));
	}
	else {//IE < 8 TODO:: tests
		document.createTextNode = function(text) {
			text = _Function_call.call(document_createTextNode, this, text);
			text.contains = _Node_prototype.contains;
			return text;
		}
	}
}
if (!_Function_call.call(document_createDocumentFragment, document).contains && global["HTMLDocument"] && global["HTMLDocument"].prototype) {
    _.push(_unSafeBind.call(_append, null, global["HTMLDocument"].prototype, _Node_prototype));
}


//https://developer.mozilla.org/en/DOM/Element.children
//[IE lt 9] Fix "children" property in IE < 9
if(!("children" in _testElement) || _browser_msie < 9)_.push(function() {
	Object.defineProperty(_Element_prototype, "children", {"get" : function() {
		var arr = [],
			child = this.firstChild;

		while(child) {
			if(child.nodeType == 1)arr.push(child);
			child = child.nextSibling;
		}

		return arr;
	}});
})

//[IE lt 9] Fix "offsetLeft" and "offsetTop" properties in IE < 9
if(_browser_msie < 9)_.push(function() {
	/**
	 * @param {Node} elem
	 * @param {boolean=} X_else_Y
	 * @return {number}
	 */
	function unsafeGetOffsetRect(elem, X_else_Y) {
		var box = elem.getBoundingClientRect(),//It might be an error here
			body = document.body,
			docElem = _document_documentElement;
	 
	 	return X_else_Y ?
	 		Math.round(box.left + (window.pageXOffset || docElem.scrollLeft || body.scrollLeft) - (docElem.clientLeft || body.clientLeft || 0)) :
	 		Math.round(box.top + (window.pageYOffset || docElem.scrollTop || body.scrollTop) - (docElem.clientTop || body.clientTop || 0));
	}

	/**
	 * @param {Node} elem
	 * @param {boolean=} X_else_Y
	 * @return {number}
	 */
	function getOffsetSum(elem, X_else_Y) {
		var result = 0,
			prop = X_else_Y ? "offsetLeft" : "offsetTop";

		while(elem) {
			result = result + parseInt(elem[prop], 10);
			elem = elem.offsetParent;
		}
	 
		return result;
	}

	/**
	 * @param {Node} elem
	 * @param {boolean=} X_else_Y
	 * @return {number}
	 */
	function safeGetOffsetRect(elem, X_else_Y) {
		var result;
		try {
			result = unsafeGetOffsetRect(elem, X_else_Y);
		}
		catch(e) {
			result = getOffsetSum(elem, X_else_Y);
		}
		return result;
	}
	Object.defineProperties(_Element_prototype, {
		"offsetLeft" : {
			"get" : function() {
			    return safeGetOffsetRect(this, true);
			}
		},
		"offsetTop" : {
			"get" : function() {
			    return safeGetOffsetRect(this);
			}
		}
	});
})

//TODO::window.innerWidth & window.innerHeight http://www.javascripter.net/faq/browserw.htm
//TODO::https://developer.mozilla.org/en/DOM/window.outerHeight
	

//[IE lt 9, old browsers] Traversal for IE < 9 and other
if(_testElement.childElementCount == void 0)_.push(function() {
	Object.defineProperties(_Element_prototype, {
		"firstElementChild" : {//https://developer.mozilla.org/en/DOM/Element.firstElementChild
			"get" : function() {
			    var node = this;
			    node = node.firstChild;
			    while(node && node.nodeType != 1) node = node.nextSibling;
			    return node;
			}
		},
		"lastElementChild" : {//https://developer.mozilla.org/En/DOM/Element.lastElementChild
			"get" : function() {
			    var node = this;
			    node = node.lastChild;
			    while(node && node.nodeType != 1) node = node.previousSibling;
			    return node;
			}
		},
		"nextElementSibling" : {//https://developer.mozilla.org/En/DOM/Element.nextElementSibling
			"get" : function() {
			    var node = this;
			    while(node = node.nextSibling) if(node.nodeType == 1) break;
			    return node;
			}
		},
		"previousElementSibling" : {//https://developer.mozilla.org/En/DOM/Element.previousElementSibling
			"get" : function() {
			    var node = this;
			    while(node = node.previousSibling) if(node.nodeType == 1) break;
	    		return node;
			}
		}
	})
});

// IE8 can't write to ownerDocument
/*TODO:: is this realy need?
try {
    _testElement.ownerDocument = 42;
} catch (e) {
	_.push(function() {
	    var pd = Object.getOwnPropertyDescriptor(Element.prototype, "ownerDocument");
	    var ownerDocument = pd.get;
	    Object.defineProperty(Element.prototype, "ownerDocument", {
	        get: function () {
	            if (this._ownerDocument) {
	                return this._ownerDocument;
	            } else {
	                return ownerDocument.call(this);
	            }
	        },
	        set: function (v) {
	            this._ownerDocument = v;
	        },
	        configurable: true
	    });
	})
}*/


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  bug fixing  ==================================  */






/* is this stuff defined? */
if(!document.ELEMENT_NODE) {
	object_tmp = {
		ELEMENT_NODE : 1,
		//ATTRIBUTE_NODE : 2,// historical
		TEXT_NODE : 3,
		//CDATA_SECTION_NODE : 4,// historical
		//ENTITY_REFERENCE_NODE : 5,// historical
		//ENTITY_NODE : 6,// historical
		PROCESSING_INSTRUCTION_NODE : 7,
		COMMENT_NODE : 8,
		DOCUMENT_NODE : 9,
		DOCUMENT_TYPE_NODE : 10,
		DOCUMENT_FRAGMENT_NODE : 11
		//NOTATION_NODE : 12// historical
	};
	_append(document, object_tmp);
	_append(_Node_prototype, object_tmp);
	_append(global["Node"], object_tmp);
}
/*var __ielt8__element_init__ = _Node_prototype["__ielt8__element_init__"];
if(__ielt8__element_init__) {//__ielt8__element_init__ in a.ielt8.js
	__ielt8__element_init__["plugins"].push(function(el) {
		_append(el, object_tmp);
	})
}*/

//https://developer.mozilla.org/En/DOM/Node.textContent
if(DEBUG && !("textContent" in _testElement)) {
	if(!('innerText' in this) &&
	   (!('data' in this) || !this.appendData))
		throw Error("IE is too old");
}
if(!("textContent" in _testElement))
	_.push(function() {
		Object.defineProperty(_Node_prototype, "textContent", {
			"get" : function() {
				if('innerText' in this)return this.innerText;
				if('data' in this && this.appendData)return this.data;
			},
			"set" : function(val) {
				if('innerText' in this)this.innerText = val;
				else if('data' in this && this.replaceData)this.replaceData(0, this.length, val);
				
				return val;
			}
		});
	});


//https://developer.mozilla.org/en/Document_Object_Model_(DOM)/Node.isEqualNode
if(!("isEqualNode" in _testElement)) {
	document.isEqualNode = _document_documentElement.isEqualNode = _Node_prototype.isEqualNode = function(node) {
		var i, len;

	    if(node === null ||
	       node.nodeType !== this.nodeType)return false;

	    if (node.nodeType === 10/*Node.DOCUMENT_TYPE_NODE*/) {
	        if (this.name !== node.name ||
	            this.publicId !== node.publicId ||
	            this.systemId !== node.systemId 
	        )return false;
	    }

	    if (node.nodeType === 1/*Node.ELEMENT_NODE*/) {
	        if (this.namespaceURI != node.namespaceURI ||
	            this.prefix != node.prefix ||
	            this.localName != node.localName
	        ) {
	            return false;
	        }
	        for (i = 0, len = this.attributes.length; i < len; i++) {
	            var attr = this.attributes[length];
	            var nodeAttr = node.getAttributeNS(attr.namespaceURI, attr.localName);
	            if (nodeAttr === null || nodeAttr.value !== attr.value)
	                return false;
	        }
	    }

	    if (node.nodeType === 7/*Node.PROCESSING_INSTRUCTION_NODE*/) {
	        if (this.target !== node.target || this.data !== node.data)
	            return false;
	    }

	    if (node.nodeType === 3/*Node.TEXT_NODE*/ || node.nodeType === 8/*Node.COMMENT_NODE*/) {
	        if (this.data !== node.data)
	            return false;
	    }
	    if (node.childNodes.length !== this.childNodes.length)return false;

	    for (i = 0, len = node.childNodes.length; i < len; i++) {
	        var isEqual = node.childNodes[i].isEqualNode(this.childNodes[i]);
	        if (isEqual === false) {
	            return false;
	        }
	    }

	    return true;
	};
}
/*
http://www.alistapart.com/articles/crossbrowserscripting
*/
if(!document.importNode) {
	document.importNode = function(node, allChildren) {
		/* find the node type to import */
		switch (node.nodeType) {
			case 1://document.ELEMENT_NODE:
				var newNode = document.createElement(node.nodeName),//create a new element
					attrs = node.attributes,
					attr,
					_childNodes,
					i,
					il;
					
				/* does the node have any attributes to add? */
				if (attrs && attrs.length > 0)
					/* add all of the attributes */
					for (i = 0, il = attrs.length ; i < il ;) {
						attr = node.attributes[i++];
						newNode.setAttribute(attr.nodeName, node.getAttribute(attr.nodeName));
					}
				/* are we going after children too, and does the node have any? */
				if (allChildren && (_childNodes = node.childNodes) && _childNodes.length > 0)
					/* recursively get all of the child nodes */
					for (i = 0, il = _childNodes.length; i < il;)
						newNode.appendChild(document.importNode(_childNodes[i++], allChildren));
				return newNode;
			break;
			
			case 3://document.TEXT_NODE:
			case 4://document.CDATA_SECTION_NODE:
			case 8://document.COMMENT_NODE:
				return document.createTextNode(node.nodeValue);
			break;
		}
		_throwDOMException("NOT_SUPPORTED_ERR");
		return null;
	};
	document.importNode["shim"] = true;
}

//getElementsByClassName shim
string_tmp = "getElementsByClassName";
function_tmp = _Element_prototype[string_tmp] || 
	document.querySelectorAll ? //Here native querySelectorAll in IE8
		function(names) {
			if(!names || !(names = _String_trim.call(names)))return [];
			return (this.querySelectorAll || document.querySelectorAll).call(this, names.replace(/\s+(?=\S)|^/g, "."))
		}
		:
		function(klas) {
			klas = new RegExp(klas.replace(/\s*(\S+)\s*/g, '(?=(^|.*\\s)$1(\\s|$))'));

			var nodes = this.all,
				node,
				i = -1,
				result = [];

			while(node = nodes[++i]) {
				if(klas.test(node.className || '')) {
					result.push(node);
				}
			}
			
			return result;
		}
		/*function(clas) {
			var root = this,
				result = [],
				nodes,
				i = -1,
				node,
				elementClass,
				match,
				k;

			if(arguments.length) {
				clas = _String_split.call(_String_trim.call(clas + ""), " ");
				if(!clas[0])return result;

				nodes = root.getElementsByTagName('*');

				while (node = nodes[++i]) {
					match = node.className
						&& (k = -1)
						&& (elementClass = " " + node.className + " ");
					
					while(match && ++k < clas.length) {
						match = !!~(elementClass).indexOf(" " + clas[k] + " ");
					}

					if (match) {
						result.push(node);
					}
				}
			}
			else throw new Error('WRONG_ARGUMENTS_ERR');
			return result;	
		}*/;
if(!(string_tmp in _testElement))_Element_prototype[string_tmp] = function_tmp;
if(!document[string_tmp])_document_documentElement[string_tmp] = document[string_tmp] = function_tmp;


string_tmp = 'compareDocumentPosition';
if(!(string_tmp in document)) {
	var __name,
		__n1 = __name || 'DOCUMENT_POSITION_';//Use '__name || ' only for GCC not to inline __n1 param. In this case __name MUST be undefined
	_document_documentElement[string_tmp] = document[string_tmp] = _Node_prototype[string_tmp] = function(b) {
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
	__name = 'DISCONNECTED';
	_document_documentElement[__n1 + __name] = document[__n1 + __name] = _Node_prototype[__n1 + __name] = 0x01;
	__name = 'PRECEDING';
	_document_documentElement[__n1 + __name] = document[__n1 + __name] = _Node_prototype[__n1 + __name] = 0x02;
	__name = 'FOLLOWING';
	_document_documentElement[__n1 + __name] = document[__n1 + __name] = _Node_prototype[__n1 + __name] = 0x04;
	__name = 'CONTAINS';
	_document_documentElement[__n1 + __name] = document[__n1 + __name] = _Node_prototype[__n1 + __name] = 0x08;
	__name = 'CONTAINED_BY';
	_document_documentElement[__n1 + __name] = document[__n1 + __name] = _Node_prototype[__n1 + __name] = 0x10;
}

if(!global.getComputedStyle) {//IE < 9
/*
TODO::
var filter = elem.style['filter'];
    return filter ? (filter.indexOf('opacity=') >= 0 ?
      (parseFloat(filter.match(/opacity=([^)]*)/)[1] ) / 100) + '' : '1') : '';
*/
	/**
	 * @link https://developer.mozilla.org/en/DOM/window.getComputedStyle
	 * getCurrentStyle - функция возвращяет текущий стиль элемента
	 * @param {?Node} obj HTML-Элемент
	 * @param {?string} pseudoElt A string specifying the pseudo-element to match. Must be null (or not specified) for regular elements.
	 * @this {Window}
	 * @return {CSSStyleDeclaration} Стиль элемента
	 */
	global.getComputedStyle = function(obj, pseudoElt) {
		return obj.currentStyle;
	}
}


//Исправляем для IE<9 создание DocumentFragment, для того, чтобы функция работала с HTML5
if(_browser_msie < 9) {
	document.createDocumentFragment = function() {
		var df = 
				_Function_call.call(document_createDocumentFragment, this);
		
		if(global["DocumentFragment"] === global["Document"]) {
			//TODO:: if DocumentFragment is a fake DocumentFragment -> append each instance with Document methods
			_append(df, global["DocumentFragment"].prototype);//TODO: tests
		}
		
		return html5_document(df);
	};
}




/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  HTML5 shiv  ==================================  */
/*  =======================================================================================  */

supportsUnknownElements = (_testElement.innerHTML = '<x-x></x-x>'), _testElement.childNodes.length === 1;
	
html5_elements = "|" + html5_elements + "|";

function shivedCreateElement(nodeName) {
	var node = this["__orig__createElement__"](nodeName);

	if(ielt9_elements.test(nodeName))return node;

	if(!~html5_elements.indexOf("|" + nodeName + "|")) {
		html5_elements_array.push(nodeName);
		html5_elements += (nodeName + "|");
		(safeFragment["__orig__createElement__"] || safeFragment.createElement)(nodeName);
		//node.document.createElement(nodeName);
	}
	
	return safeFragment.appendChild(node);
}

/** Making a document HTML5 element safe
 * Функция "включает" в IE < 9 HTML5 элементы
 * @param {Document} doc
 */
function html5_document(doc) { // pass in a document as an argument
	// create an array of elements IE does not support
	var a = -1;

	if(doc.createElement) {
		while (++a < html5_elements_array.length) { // loop through array
			doc.createElement(html5_elements_array[a]); // pass html5 element into createElement method on document
		}
		
		if(doc.createElement !== shivedCreateElement) {
			doc["__orig__createElement__"] = doc.createElement;
			doc.createElement = shivedCreateElement;
		}
	}

	return doc; // return document, great for safeDocumentFragment = html5_document(document.createDocumentFragment());
} // critique: array could exist outside the function for improved performance?

safeFragment = html5_document(_Function_call.call(document_createDocumentFragment, document));

if(!supportsUnknownElements) {
	 html5_document(document);
}

//Test for broken 'cloneNode'
if(_Function_call.call(document_createElement, document, "x-x").cloneNode().outerHTML.indexOf("<:x-x>") === 0) {
	safeElement = safeFragment.appendChild(safeFragment.createElement("div"));
	_nativeCloneNode = 
		_browser_msie === 8 ?
			_testElement["cloneNode"] :
			_browser_msie < 8 ?
				_Node_prototype["cloneNode"] : void 0;
	
	/**
	 * Issue: <HTML5_elements> become <:HTML5_elements> when element is cloneNode'd
	 * Solution: use an alternate cloneNode function, the default is broken and should not be used in IE anyway (for example: it should not clone events)
	 * В Internet Explorer'е функция <HTMLElement>.cloneNode "ломает" теги HTML5 при клонировании,
	 *  поэтому нужно использовать альтернативный способ клонирования
	 *
	 * Больше по теме: http://pastie.org/935834
	 *
	 * Альтернатива <Node>.cloneNode в IE < 9
	 * @param {boolean=} include_all [false] Клонировать ли все дочерние элементы? По-умолчанию, false
	 * @this {Node} element Элемент для клонирования
	 * @version 4
	 */
	_Node_prototype["cloneNode"] = function(include_all) {//Экспортируем cloneElement для совместимости и для вызова напрямую	
		var element = this,
			result,
			nodeBody;
		
		if(ielt9_elements.test(element.nodeName)) {//HTML4 element?
			result = _Function_call.call(element["__nativeCloneNode__"] || _nativeCloneNode, element, include_all);
		}
		else {//HTML5 element?
			safeElement.innerHTML = "";//Очистим от предыдущих элементов

			// set HTML5-safe element's innerHTML as input element's outerHTML
			if(include_all)nodeBody = element.outerHTML;
			else nodeBody = element.outerHTML.replace(element.innerHTML, "");
		
			safeElement.innerHTML = nodeBody.replace(/^\<\:/, "<").replace(/\<\/\:([\w\-]*\>)$/, "<$1");

			result = safeElement.firstChild; // return HTML5-safe element's first child, which is an outerHTML clone of the input element

			if(!result && !include_all) {//IE < 9 fail to create unknown tag
				//if(!result && include_all)->sinensy faild due can't write a solution
				nodeBody = nodeBody.match(RE_cloneElement_tagMatcher);
				if(nodeBody)nodeBody = nodeBody[1];
				if(nodeBody) {
					safeFragment.createElement(nodeBody);
					safeElement.innerHTML = nodeBody;
					result = safeElement.firstChild;
				}
			}
		}
			
		return safeFragment.appendChild(result);
	};

};


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  HTML5 shiv  ======================================  */
/*  ======================================================================================  */


/*  =======================================================================================  */
/*  ================================  NodeList.prototype  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

//Inherit NodeList from Array
function extendNodeListPrototype(nodeListProto) {
	if(nodeListProto && nodeListProto !== Array.prototype) {
		for(var key in nodeList_methods_fromArray)if(_hasOwnProperty(key, nodeList_methods_fromArray)) {
			if(!nodeListProto[key])nodeListProto[key] = function() {
				_Function_apply.call(Array.prototype[key], Array["from"](this), arguments);
			}
		}
	}
}
if(document.querySelectorAll)extendNodeListPrototype(document.querySelectorAll("#z").constructor.prototype);
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  NodeList.prototype  ==================================  */
/*  ======================================================================================  */


/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DOM  =======================================  */



_testElement = _txtTextElement = boolean_tmp = string_tmp = number_tmp = function_tmp = object_tmp = nodeList_methods_fromArray = supportsUnknownElements = void 0;





if(!_Node_prototype["ie"] && _browser_msie > 7)return;
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */

//                                         IE lt 8

/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */
/*  ======================================================================================  */







//CONFIG START
var /** @const*/
    __URL_TO_ELEMENT_BEHAVIOR__     = '/a.ielt8.htc'
	/** @const*/
  , __STYLE_ID                      = "ielt8_style_prev_for_behaviour"
	/** @const List of supporting tag names */
  , __SUPPORTED__TAG_NAMES__ = "*"

;
//CONFIG END

var /** @type {boolean} */
	noDocumentReadyState = !document.readyState

	/** @const */
  , ieltbehaviorRules = [__URL_TO_ELEMENT_BEHAVIOR__]
	
  , ielt9BehaviorRule = "{behavior:"

  , __ielt8__wontfix = []

  , prevCreateElement

  , origCloneNode

  , __ielt8_Node_behavior_apply

	/** @const */
  , _Element_getElementsByClassName = document.getElementsByClassName

	// ------------------------------ ==================  Window  ================== ------------------------------
  , _emulate_scrollX_scrollY
  
	/** @const */
  , originalScrollTo = global.scrollTo

	/** @const */
  , originalScrollBy = global.scrollBy

	// ------------------------------ ==================  querySelector  ================== ------------------------------
	/** @type {RegExp} @const */
  , RE__selector__easySelector1 = /^\s?[\w#\.][\w-]*$/
	/** @type {RegExp} @const */
  , RE__selector__easySelector2 = /^\s?(\.[\w-]*)+$/
	/** @type {RegExp} @const */
  , RE__queryManySelector__doubleSpaces = /\s*([,>+~\s])\s*/g//Note: Use with "$1"
	/** @type {RegExp} @const */
  , RE__querySelector__arrtSpaceSeparated_toSafe = /\~\=/g
	/** @type {RegExp} @const */
  , RE__querySelector__arrtSpaceSeparated_fromSafe = /\|\-\|\=/g
	/** @type {RegExp} @const */
  , RE__queryManySelector__selectorsMatcher = /(^[>+~\s]?|,|\>|\+|~| ).*?(?=[,>+~\s]|$)/g
	/** @type {RegExp} @const */
  , RE__querySelector__dottes = /\./g
	/** @type {RegExp} @const */
  , RE__queryOneSelector__spaces = /\s/g
	/** @type {RegExp} @const */
  , RE__queryOneSelector__attrMatcher = /^\[?(.*?)(?:([\*~&\^\$\|!]?=)(.*?))?\]?$/
	/** @type {RegExp} @const */
  , RE__queryOneSelector__selectorMatch = /^([,>+~\s])?(\w*)(?:|\*)\#?([\w\-]*)((?:\.?[\w\-])*)(\[.*?\])?\:?([\w\-\+\%\(\)]*)$/
	/** @type {RegExp} @const */
  , RE__queryOneSelector__pseudoMatcher = /^([^(]+)(?:\(([^)]+)\))?$//* regexpt from jass 0.3.9 (http://yass.webo.in/) rev. 371 line 166 from right */
	/** @type {RegExp} @const */
  , RE__queryOneSelector__pseudoNthChildPlus = /\((\dn)\+(\d)\)/
	/** @type {RegExp} @const */
  , RE__queryOneSelector__pseudoNthChildMatcher = /(?:([-]?\d*)n)?(?:(%|-)(\d*))?//* regexpt from jass 0.3.9 (http://yass.webo.in/) rev. 371 line 181 ( mod === 'nth-last-child' ?...) */

;


number_tmp = ieltbehaviorRules.length;
while(--number_tmp >= 0)
	ielt9BehaviorRule += (" url(\"" + ieltbehaviorRules[number_tmp] + "\")");
ielt9BehaviorRule += "}";

function createBehaviorStyle(styleId, tags, behaviorRule) {
	var style = document.getElementById(styleId),
		add = "";

	if(style){
		add = style.getAttribute("data-url") || "";
		style.id = "";
	}

	if(add) {
		behaviorRule.replace(" url(", " url(" + add + ") url(");
	}

	style = document_createElement("style");
	style.id = styleId;
	style.type = 'text/css';
	style.setAttribute("data-url", behaviorRule.replace("{behavior:", "").replace(")}", ")"));
	style.styleSheet.cssText = tags + behaviorRule;
	document.head.appendChild(style);
}

if(noDocumentReadyState)document.readyState = "uninitialized";


_Node_prototype["ielt8"] = true;

global["__ielt8__wontfix"] = __ielt8__wontfix;

/**
 * Функция возвращяет массив элементов выбранных по CSS3-селектору. 
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
 * Note: due using "sourceIndex" property, this function work proper only in IE < 9
 *
 * @param {!string} selector CSS3-селектор
 * @param {Node|Array.<Node>} roots элемент в котором мы будем искать
 * @param {Array.<HTMLElement>=} result Pre-results
 * @param {boolean=} onlyOne only one need
 * @return {Array.<HTMLElement>}
 * @version 3
 *  TODO:: Изучить код https://github.com/ded/qwery - может быть будет что-нибуть полезное
 */
function queryOneSelector(selector, roots, result, onlyOne) {
	//\.(.*?)(?=[:\[]|$) -> <.class1.class2>:focus or tag#id<.class1.class2>[attr*=value]
	if(!roots)roots = [document];
	else if(!Array.isArray(roots))roots = [roots];
	
	var /** @type {boolean} */isPreResult = !!result,
		/** @type {Array.<string>} */selectorArr = selector.match(RE__queryOneSelector__selectorMatch);

	if(selector === "," || !selectorArr)_throwDOMException("SYNTAX_ERR");


	result = result || [];

	var /** @type {Object} Cache object for nore unique id (sourceIndex) for non-dublication */resultKeys = {},
		/** @type {NodeList} */tempResult,
		/** @type {Node} */child,
		/** @type {Node} */root,

		/** @type {string} */combinator = selectorArr[1],
		/** @type {string} */tag = selectorArr[2].toUpperCase(),
		/** @type {string} */id = selectorArr[3],
		/** @type {(string|Array.<string>)} */classes = selectorArr[4],
		/** @type {boolean} */isClasses = !!classes,
		/** @type {(string|Array.<string>)} */css3Attr = selectorArr[5],//css3Attr Пример: [attr1*=value1][attr2*=value2]
		/** @type {Array.<string>} */css3Attr_add,//css3Attr Пример: [attr*=value]->["attr*=value", "attr", "*=", "value"]
		/** @type {string} */_curClass,
		/** @type {number} */kr = -1,

		/** @type {(string|Array.<string>)} */css3Pseudo = selectorArr[6],//css3Pseudo Пример: :nls-child(2n-0)
		/** @type {(Array.<Array>)} */css3Pseudo_add,//Pseudo-classes

		/** @type {(Array.<number>)} */ind,
		/** @type {number} */a,
		/** @type {string} */b,
		/** @type {number} */c,
		/** @type {Node} */brother,

		/** @type {number} */i = -1,
		/** @type {boolean} */match,

		/** @type {string} */nodeAttrCurrent_value,
		/** @type {string} */nodeAttrExpected_value;
	
	if(isClasses)classes = classes.replace(RE__querySelector__dottes, " ");
	
	if(css3Pseudo === ":root")isPreResult = true, result = [~roots.indexOf(document) ? _document_documentElement : null];//TODO:: tests

	if(!isPreResult) {// ! matchesSelector
		
		switch(combinator) {
			default://combinator == ' ' || combinator == ','
				while(root = roots[++i]) {
					if(id) {
						child = root.getElementById ? root.getElementById(id) : document.getElementById(id);
						if(!tag || child.tagName.toUpperCase() === tag)result.push(child);
					}
					else {
						/*if(combinator === " ") {
							a = root.compareDocumentPosition
						}*/

						if(isClasses) {
							tempResult = _Element_getElementsByClassName.call(root, classes);
						}
						else {
							tempResult = (!tag && root.all) ? root.all : root.getElementsByTagName(tag || "*");
						}
						kr = -1;
						while(child = tempResult[++kr]) if(!(child.sourceIndex in resultKeys)) {
							resultKeys[child.sourceIndex] = true;
							result.push(child);
						}
					}
				}
				if(id) {
					id = "";
				}
				else {
					if(isClasses)isClasses = false;
					else if(tag)tag = "";
				}
			break;
			case '+':
				while(root = roots[++i]) {
					while((child = root.nextSibling) && child.nodeType != 1){}
					match = child && (!tag || child.tagName.toUpperCase() === tag) &&
						(!(child.sourceIndex in resultKeys));
						
					if(match && isClasses) {
						kr = -1;
						_curClass = ' ' + child.className + ' ';
						while(classes[++kr] && match)
							match = !!~_curClass.indexOf(classes[kr]);
					}
					if(match) {
						result.push(child);

						resultKeys[child.sourceIndex] = true;
					}
				}
				isClasses = false;
				tag = "";
			break;
			case '~'://W3C: "an F element preceded by an E element"
				while(root = roots[++i]) {
					while (child = child.nextSibling) {
						match = child.nodeType == 1 && (!tag || child.tagName.toUpperCase() === tag) &&
							(!(child.sourceIndex in resultKeys));
							
						if(match && isClasses) {
							kr = -1;
							_curClass = ' ' + child.className + ' ';
							while(classes[++kr] && match)
								match = !!~_curClass.indexOf(classes[kr]);
						}
						if(match) {
							result.push(child);

							resultKeys[child.sourceIndex] = true;
						}
					}
				}
				isClasses = false;
				tag = "";
			break;
			case '>'://W3C: "an F element preceded by an E element"
				while(root = roots[++i]) {
					a = -1;
					while(child = root.childNodes[++a]) {
						match = child.nodeType == 1 && (!tag || child.tagName.toUpperCase() === tag) &&
							(!(child.sourceIndex in resultKeys));
							
						if(match && isClasses) {
							kr = -1;
							_curClass = ' ' + child.className + ' ';
							while(classes[++kr] && match)
								match = !!~_curClass.indexOf(classes[kr]);
						}
						if(match) {
							result.push(child);

							resultKeys[child.sourceIndex] = true;
						}
					}
				}
				isClasses = false;
				tag = "";
			break;
		}
		
		
		combinator = "";
	}

	if(result.length && (tag || isClasses || css3Attr || css3Pseudo || id || combinator)) {
		i = -1;
		if(isClasses)classes = _String_split.call(classes.slice(1), RE__querySelector__dottes);

		while(child = result[++i]) {
			match = !(id && child.id != id);
			c = child.tagName.toUpperCase();
			
			if(match && isClasses) {
				kr = -1;
				_curClass = ' ' + child.className + ' ';
				while(classes[++kr] && match)
					match = !!~_curClass.indexOf(classes[kr]);
			}
			if(match && tag) {
				match = c === tag;
			}
			if(match && css3Attr) {
				kr = -1;
				
				if(typeof css3Attr == 'string') {//Check, if we not analys css3Attr yet
					css3Attr = _String_split.call(css3Attr, "][");
					while(css3Attr_add = css3Attr[++kr]) {
						css3Attr_add = css3Attr[kr] = css3Attr_add.replace(RE__querySelector__arrtSpaceSeparated_fromSafe, "~=").match(RE__queryOneSelector__attrMatcher);
						
						b = css3Attr_add[1];
						if((a = b.charAt(0)) === "\'" || a === "\""  && b.substr(-1) === a) {//Note: original IE substr not allowed negative value as first param
							b = css3Attr_add[1] = _String_substr.call(b, 1, b.length - 2);
						}
						if("all" in document) {//IE
							if(b == "class")css3Attr_add[1] = "className";
							else if(b == "for")css3Attr_add[1] = "htmlFor";
						}
						b = css3Attr_add[3];
						if(b && ((a = b.charAt(0)) === "\'" || a === "\""  && b.substr(-1) === a)) {
							b = css3Attr_add[3] = _String_substr.call(b, 1, b.length - 2);
						}
					}
					kr = -1;
				}

				while(match && (css3Attr_add = css3Attr[++kr])) {
				
					nodeAttrCurrent_value = child.getAttribute(css3Attr_add[1]);
					if(c/*child.tagName*/ === "A" && css3Attr_add[1] === "href") {
						nodeAttrCurrent_value = nodeAttrCurrent_value.replace(location.protocol + "//" + location.host + location.pathname, "");
					}
					nodeAttrExpected_value = css3Attr_add[3];
					
					// TODO: Проверить, что все опреации ^=, !=, *= и т.д. работают или ввести nodeAttrCurrent_value = child.getattribute(); if(nodeAttrCurrent_value)nodeAttrCurrent_value = nodeAttrCurrent_value + ''
					/* from yass 0.3.9 http://yass.webo.in/
					   and edited by me :) */
					/* function calls for CSS2/3 attributes selectors */
					switch(css3Attr_add[2]) {
					/* W3C "an E element with a "nodeAttrCurrent_value" attribute" */
						default://css3Attr[2] == ''
							match = !!nodeAttrCurrent_value || nodeAttrCurrent_value === "";
						break;
					/*
					W3C "an E element whose "nodeAttrCurrent_value" attribute nodeAttrExpected_value is
					exactly equal to "nodeAttrExpected_value"
					*/
						case '=':
							match = nodeAttrCurrent_value && nodeAttrCurrent_value === nodeAttrExpected_value;
						break;
					/*
					from w3.prg "an E element whose "nodeAttrCurrent_value" attribute nodeAttrExpected_value is
					a list of space-separated nodeAttrExpected_value's, one of which is exactly
					equal to "nodeAttrExpected_value"
					*/
						case '&=':
							match = nodeAttrCurrent_value && (new RegExp('(^| +)' + nodeAttrExpected_value + '($| +)').test(nodeAttrCurrent_value));
						break;
					/*
					from w3.prg "an E element whose "nodeAttrCurrent_value" attribute nodeAttrExpected_value
					begins exactly with the string "nodeAttrExpected_value"
					*/
						case '^=':
							match = nodeAttrCurrent_value && !nodeAttrCurrent_value.indexOf(nodeAttrExpected_value);
						break;
					/*
					W3C "an E element whose "nodeAttrCurrent_value" attribute nodeAttrExpected_value
					ends exactly with the string "nodeAttrExpected_value"
					*/
						case '$=':
							match = (nodeAttrCurrent_value && nodeAttrCurrent_value.indexOf(nodeAttrExpected_value) == nodeAttrCurrent_value.length - nodeAttrExpected_value.length);
						break;
					/*
					W3C "an E element whose "nodeAttrCurrent_value" attribute nodeAttrExpected_value
					contains the substring "nodeAttrExpected_value"
					*/
						case '*=':
							match = (nodeAttrCurrent_value && ~nodeAttrCurrent_value.indexOf(nodeAttrExpected_value));
						break;
					/*
					W3C "an E element whose "nodeAttrCurrent_value" attribute has
					a hyphen-separated list of nodeAttrExpected_value's beginning (from the
					left) with "nodeAttrExpected_value"
					*/
						case '|=':
							match = (nodeAttrCurrent_value && (nodeAttrCurrent_value === nodeAttrExpected_value || !!nodeAttrCurrent_value.indexOf(nodeAttrExpected_value + '-')));
						break;
					/* nodeAttrCurrent_value doesn't contain given nodeAttrExpected_value */
						case '!=':
							match = (!nodeAttrCurrent_value || !(new RegExp('(^| +)' + nodeAttrExpected_value + '($| +)').test(nodeAttrCurrent_value)));
						break;

						case '~=':
							match = nodeAttrCurrent_value && !!~(" " + nodeAttrCurrent_value.replace(RE__queryOneSelector__spaces, " ") + " ").indexOf(" " + nodeAttrExpected_value + " ");
						break;
					}
				}
			}
			if(match && css3Pseudo) {
				//In this block we lose "child" value
				if(typeof css3Pseudo == 'string') {
					css3Pseudo = css3Pseudo.match(RE__queryOneSelector__pseudoMatcher);
					//TODO:: Не работает nth-child и nth-last-child - путаница с nodeIndex
					if(css3Pseudo[2]) {
						if(!/\D/.test(css3Pseudo[2]))css3Pseudo_add = [null, 0, '%', css3Pseudo[2]];
						else if(css3Pseudo[2] === 'even')css3Pseudo_add = [null, 2];
						else if(css3Pseudo[2] === 'odd')css3Pseudo_add = [null, 2, '%', 1];
						else css3Pseudo_add = css3Pseudo[2].replace(RE__queryOneSelector__pseudoNthChildPlus, "\($1%$2\)").match(RE__queryOneSelector__pseudoNthChildMatcher);
					}
				}
				//TODO:: Не работает nth-child и nth-last-child - путаница с nodeIndex
				/* from yass 0.3.9 http://yass.webo.in/ */
				/*
				function calls for CSS2/3 modificatos. Specification taken from
				http://www.w3.org/TR/2005/WD-css3-selectors-20051215/
				on success return negative result.
				*/
				switch(css3Pseudo[1]) {
				/* W3C: "an E element, first rs of its parent" */
					case 'first-child':
				/* implementation was taken from jQuery.1.2.6, line 1394 */
						match = child.parentNode.getElementsByTagName('*')[0] == child;
					break;
				/* W3C: "an E element, last rs of its parent" */
					case 'last-child'://In this block we lose "rs" value
				/* loop in lastrss while nodeType isn't element */
						while ((child = child.nextSibling) && child.nodeType != 1) {}
				/* Check for node's existence */
						match = !child;
					break;
				/* W3C: "an E element, root of the document" */
					case 'root':
						match = c/*child.tagName*/ == "HTML";
					break;
				/* W3C: "an E element, the n-th child of its parent" */
					case 'nth-child':
						ind = css3Pseudo_add;
						c = child["nodeIndex"] || 0;
						a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0;
						b = ind[1];
				/* check if we have already looked into siblings, using exando - very bad */
						if (c) {
							match = !b ? !(c + a) : !((c + a) % b);
						}
						else {
							match = false;
				/* in the other case just reverse logic for n and loop siblings */
							brother = child.parentNode.firstChild;
				/* looping in child to find if nth expression is correct */
							do {
				/* nodeIndex expando used from Peppy / Sizzle/ jQuery */
								if (brother.nodeType == 1 && (brother["nodeIndex"] = ++c) && child === brother && (!b ? !(c + a) : !((c + a) % b))) {
									match = true;
								}
							} while (!match && (brother = brother.nextSibling));
						}
					break;
				/*
				W3C: "an E element, the n-th rs of its parent,
				counting from the last one"
				*/
					case 'nth-last-child':
				/* almost the same as the previous one */
						ind = css3Pseudo_add;
						c = child["nodeIndexLast"] || 0;
						a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0;
						b = ind[1];
						if (c) {
							match = !b ? !(c + a) : !((c + a) % b);
						}
						else {
							match = false;
							brother = child.parentNode.lastChild;
							do {
								if (brother.nodeType == 1 && (brother["nodeIndexLast"] = ++c) && child === brother && (!b ? !(c + a) : !((c + a) % b))) {
									match = true;
								}
							} while (!match && (brother = brother.previousSibling));
						}
					break;
					
					//TODO:: Проверить на производительность универсальную версию и заменить ею, если производительность не сильно падает
					/*case 'nth-child':
					case 'nth-last-child':
						//In this moment "match" MUST be true
						var isLast = css3Pseudo[1] != 'nth-child',
							ind = css3Pseudo[2],
							i = isLast ? child.nodeIndexLast : child.nodeIndex || 0,
							a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0,
							b = ind[1];
						if (i) {//check if we have already looked into siblings, using exando - very bad
							match = !( (i + a) % b);
						}
						else {//in the other case just reverse logic for n and loop siblings
							var brother = isLast ? child.parentNode.lastChild : child.parentNode.firstChild;
							i++;
							do {//looping in rs to find if nth expression is correct
								//nodeIndex expando used from Peppy / Sizzle/ jQuery
								if (brother.nodeType == 1 &&
									isLast ? (brother.nodeIndexLast = i++) : (brother.nodeIndex = ++i) &&
									child === brother && ((i + a) % b)) {
									match = false;
								}
							} while (match && brother = isLast ? brother.previousSibling : brother.nextSibling);
						}
					breal;*/
					
				/*
				Rrom w3.org: "an E element that has no rsren (including text nodes)".
				Thx to John, from Sizzle, 2008-12-05, line 416
				*/
					case 'empty':
						match = !child.firstChild;
					break;
				/* W3C: "an E element, only child of its parent" */
					case 'only-child':
						match = child.parentNode.getElementsByTagName('*').length == 1;
					break;
				/*
				W3C: "a user interface element E which is checked
				(for instance a radio-button or checkbox)"
				*/
					case 'checked':
						match = !!child.checked;
					break;
				/*
				W3C: "an element of type E in language "fr"
				(the document language specifies how language is determined)"
				*/
					case 'lang':
						match = (child.lang == css3Pseudo_add || _document_documentElement.lang == css3Pseudo_add);
					break;
				/* thx to John, from Sizzle, 2008-12-05, line 398 */
					case 'enabled':
						match = !child.disabled && child.type !== 'hidden';
					break;
				/* thx to John, from Sizzle, 2008-12-05, line 401 */
					case 'disabled':
						match = !!child.disabled;
					break;
				/* thx to John, from Sizzle, 2008-12-05, line 407 */
					case 'selected':
				/*
				Accessing this property makes selected-by-default
				options in Safari work properly.
				*/
						//TODO: Проверить новый алгоритм
						//Старый: child.parentNode.selectedIndex;//NOTE:: Add this string manual to compile by Closure Compiler script/Добавить это строчку в откомпилированый скрипт
						//        match = !!child.selected;
						match = child.parentNode.selectedIndex && !!child.selected;//Тут уже Closure Compiler не удаляет нужный вызов
				    break;
					/*TODO::
					default:
						//Non-standart pseudo-classes
						var f = $$N.nonStandartPseudoClasses[css3Pseudo[1]];
						if(f)match = f(child);*/
				}
				
			}
		
			if(!match)_Array_splice.call(result, i--, 1);
			else if(onlyOne) {
				result = null;
				return [child];
			}
		}
	}
	
	return result;
};



/**
 * Получение эллементов по классам и тэгам
 * HINT: Пользоватся такой функцией можно только после загрузки страницы (addLoadEvent)
 * @param {!string} selector Строка с CSS3-селектором
 * @param {boolean=} onlyOne only one need
 * @this {Document|HTMLElement|Node} root элемент в котором мы будем искать
 * @return {Array.<HTMLElement>} Список найденных элементов
 * @version 4.0
 */
var queryManySelector = function queryManySelector(selector, onlyOne) {
	//var rules = selector.replace(/ *([,>+~. ]) */g, "$1").match(/[^,]\w*/g),

	var root = this,
		rt;

	selector = _String_trim.call(selector.replace(RE__queryManySelector__doubleSpaces, "$1"));

	if(RE__selector__easySelector1.test(selector) || RE__selector__easySelector2.test(selector)) {//quick result
		switch (selector.charAt(0)) {
			case '#':
				selector = selector.slice(1);
				rt = root.getElementById ? root.getElementById(selector) : document.getElementById(selector);
				//workaround with IE bug about returning element by name not by ID.
				//Solution completely changed, thx to deerua.
				//Get all matching elements with this id
				if (rt && _browser_msie < 9 && rt.id !== selector) {
					rt = root.ownerDocument.all[selector];
				}
				return rt && [rt] || [];
			break;
			case '.':
				return _Element_getElementsByClassName.call(root, selector.slice(1).replace(RE__querySelector__dottes, " "));
			break;
			default:
				return Array["from"](root.getElementsByTagName(selector));
		}
	}

	var result = [],
		rules = (selector + ",")
			.replace(RE__querySelector__arrtSpaceSeparated_toSafe, "|-|")
			.match(RE__queryManySelector__selectorsMatcher),
		rule,
		i = -1,
		j,
		selElements = [root],
		hightRoot = root,
		k,
		resultKeys,
		tmp,
		tmp2,
		nextRule,
		lastRule,
		firstRule = true;
			
	while((rule = rules[++i])) {
		if(lastRule) {
			lastRule = false;
			continue;
		}

		nextRule = rules[i + 1];
		lastRule = !nextRule || nextRule.charAt(0) === ',';

		
		if(!(root = selElements) || selElements.length === 0) {//No result in previous rule -> Nothing to do
			selElements = null;
		}
		else if(RE__selector__easySelector1.test(rule) || RE__selector__easySelector2.test(rule)) {//quick result
			k = -1;
			selElements = [];
			rule = _String_trim.call(rule);
			while(rt = root[++k]) {
				switch (rule.charAt(0)) {//combinator's
					case '#':
						rule = rule.slice(1);
						tmp = rt.getElementById ? rt.getElementById(rule) : document.getElementById(rule);
						//workaround with IE bug about returning element by name not by ID.
						//Solution completely changed, thx to deerua.
						//Get all matching elements with this id
						if (tmp && _browser_msie < 9 && tmp.id !== rule) {
							tmp = tmp.ownerDocument.all[rule];
						}
						selElements.push(tmp);
					break;
					case '.':
						tmp = _Element_getElementsByClassName.call(rt, rule.slice(1).replace(RE__querySelector__dottes, " "));
						j = -1;
						while(tmp2 = tmp[++j])selElements.push(tmp2);
					break;
					default:
						tmp = rt.getElementsByTagName(rule);
						j = -1;
						while(tmp2 = tmp[++j])selElements.push(tmp2);
				}
			}
		}
		else if(firstRule && rule === ":root") {
			selElements = [_document_documentElement];
		}
		else {//CSS3 selector
			selElements = queryOneSelector(rule, root, null, onlyOne && lastRule);
		}


		//If last rule in this selector
		if(firstRule = lastRule) {
			if(selElements) {//Save result
			
				if(onlyOne && selElements.length)return selElements;

				if(nextRule && nextRule.length > 1)resultKeys = {};

				k = -1;
				while(rt = selElements[++k]) {
					if(resultKeys) {
						if(!(rt.sourceIndex in resultKeys)) {
							resultKeys[rt.sourceIndex] = true;
							result.push(rt);
						}
					}
					else result.push(rt);
				}
			}


			root = hightRoot;
		}
		
	}
	
	return result;
};


/**
 * @param {!string} selector
 * @this {Document|HTMLElement|Node}
 * @return {HTMLElement|Node}
 */
function queryOneManySelector(selector) {
	return queryManySelector.call(this, selector, true)[0] || null;
}

/**
 * @param {!string} selector
 * @this {HTMLElement}
 * @return {boolean}
 */
function _matchesSelector(selector) {
	if(!selector)return false;
	if(selector === "*")return true;
	if(this === _document_documentElement && selector === ":root")return true;
	if(this === document.body && selector === "body")return true;

	selector = _String_trim.call(selector.replace(RE__queryManySelector__doubleSpaces, "$1"));

	var thisObj = this,
		isSimpleSelector = RE__selector__easySelector1.test(selector) || RE__selector__easySelector2.test(selector),
		isEasySelector = !isSimpleSelector && !/([,>+~\s])/.test(selector),
		tmp,
		match = false,
		i,
		str;

	if(isSimpleSelector) {
		selector = _String_trim.call(selector);

		switch (selector.charAt(0)) {
			case '#':
				return thisObj.id === selector.slice(1);
			break;
			case '.':
				match = true;
				i = -1;
				tmp = _String_split.call(selector.slice(1), ".");
				str = " " + thisObj.className + " ";
				while(tmp[++i] && match) {
					match = !!~str.indexOf(" " + tmp[i] + " ");
				}
				return match;
			break;
			default:
				return thisObj.tagName && thisObj.tagName.toUpperCase() === selector.toUpperCase();
			break;
		}
	}
	else if(isEasySelector) {
		tmp = queryOneSelector(selector, null, [thisObj]);
		
		return tmp[0] === thisObj;
	}
	else {
		tmp = queryManySelector.call(thisObj.ownerDocument, selector);

		for ( i in tmp ) if(_hasOwnProperty(tmp, i)) {
	        match = tmp[i] === thisObj;
	        if(match)return true;
	    }
	    return false;
	}
}


if(!document.querySelectorAll)document.querySelectorAll = queryManySelector;
if(!document.querySelector)document.querySelector = queryOneManySelector;
if(!_document_documentElement.matchesSelector)_document_documentElement.matchesSelector = _matchesSelector;

if(!_Node_prototype.hasAttribute)_Node_prototype.hasAttribute = function(name) {
	return this.getAttribute(name) !== null;
};

var _returnFirstParam = function(a) {
	return function() {
		return a
	}
};
_Node_prototype.g1 = _returnFirstParam(1);
_Node_prototype.g2 = _returnFirstParam(2);
_Node_prototype.g3 = _returnFirstParam(3);
_Node_prototype.g4 = _returnFirstParam(4);
//_Node_prototype.g5 = _returnFirstParam(5);// historical
//_Node_prototype.g6 = _returnFirstParam(6);// historical
_Node_prototype.g7 = _returnFirstParam(7);
_Node_prototype.g8 = _returnFirstParam(8);
_Node_prototype.g9 = _returnFirstParam(9);
_Node_prototype.g10 = _returnFirstParam(10);
_Node_prototype.g11 = _returnFirstParam(11);
//_Node_prototype.g12 = _returnFirstParam(12);// historical
_Node_prototype.g16 = _returnFirstParam(16);

_Node_prototype["__ielt8__element_init__"] = function __ielt8__element_init__() {
	var thisObj = this;
	if(thisObj["element"])thisObj = thisObj["element"];//¬_¬ only if the save `this` to local variable
	
	if(!thisObj["after"])thisObj["after"] = _Element_prototype["after"];
	if(!thisObj["before"])thisObj["before"] = _Element_prototype["before"];
	if(!thisObj["append"])thisObj["append"] = _Element_prototype["append"];
	if(!thisObj["prepend"])thisObj["prepend"] = _Element_prototype["prepend"];
	if(!thisObj["replace"])thisObj["replace"] = _Element_prototype["replace"];
	if(!thisObj["remove"])thisObj["remove"] = _Element_prototype["remove"];

	if(!thisObj.isEqualNode)thisObj.isEqualNode = _Node_prototype.isEqualNode;
	if(!thisObj.compareDocumentPosition)thisObj.compareDocumentPosition = _Node_prototype.compareDocumentPosition;
	if(!thisObj.getElementsByClassName)thisObj.getElementsByClassName = _Element_prototype.getElementsByClassName;
	/*@requared: window.addEventListener, window.removeEventListener, window.dispatchEvent */
	if(!thisObj.addEventListener)thisObj.addEventListener = window.addEventListener;
	if(!thisObj.removeEventListener)thisObj.removeEventListener = window.removeEventListener;
	if(!thisObj.dispatchEvent)thisObj.dispatchEvent = window.dispatchEvent;


	if(!thisObj.querySelectorAll)thisObj.querySelectorAll = queryManySelector;
	if(!thisObj.querySelector)thisObj.querySelector = queryOneManySelector;
	if(!thisObj.matchesSelector)thisObj.matchesSelector = _matchesSelector;
	
	if(!thisObj.hasAttribute)thisObj.hasAttribute = _Element_prototype.hasAttribute;

	//Unsafe (with "OBJECT" tag, for example) set's
	try {
		if(thisObj.cloneNode !== _Node_prototype.cloneNode) {
			thisObj["__nativeCloneNode__"] = thisObj.cloneNode;
			thisObj.cloneNode = _Node_prototype.cloneNode;
		}
		if(_Node_prototype.contains)thisObj.contains = _Node_prototype.contains;
	}
	catch(e) {
		//console.error(e.message)
	}
	if(thisObj.cloneNode !== _Node_prototype.cloneNode)__ielt8__wontfix.push(thisObj);
}
//__ielt8__element_init__["plugins"] = [];



__ielt8_Node_behavior_apply = _Node_prototype["__ielt8_Node_behavior_apply"] = function (el) {
	number_tmp = ieltbehaviorRules.length;

	while(--number_tmp >= 0)
		el.addBehavior(ieltbehaviorRules[number_tmp]);
}

//If we already oweride cloneNode -> safe it
origCloneNode = _Node_prototype["cloneNode"];
_Node_prototype["cloneNode"] = function(deep) {
	var el = _Function_call.call(origCloneNode || this["__nativeCloneNode__"], this, deep);
	
	__ielt8_Node_behavior_apply(el);
	
	return el;
}

/*  ======================================================================================  */
/*  ================================  Document  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

prevCreateElement = document.createElement;
document.createElement = function(tagName) {

	var el = _Function_call.call(prevCreateElement, document, tagName);
	
	number_tmp = ieltbehaviorRules.length;
	while(--number_tmp >= 0)
		el.addBehavior(ieltbehaviorRules[number_tmp]);
	
	return el;
};


/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Document  ==================================  */
/*  ======================================================================================  */

/*  =======================================================================================  */
/*  ======================================  Network  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

if(!global.XMLHttpRequest)global.XMLHttpRequest = function() {
	//TODO:: full XMLHttpRequest shim
	return ActiveXObject("Microsoft.XMLHTTP");
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Network  ======================================  */
/*  =======================================================================================  */


/*  ======================================================================================  */
/*  ======================================  Window  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */


if(!("pageXOffset" in global) && global.attachEvent) {
	global.pageXOffset = global.pageYOffset = 0;
	_emulate_scrollX_scrollY = document.compatMode === "CSS1Compat" ?
			function() { global.scrollX = global.pageXOffset = document.body.parentNode.scrollLeft; global.scrollY = global.pageYOffset = document.body.parentNode.scrollTop }
			:
			function() { global.scrollX = global.pageXOffset = document.body.scrollLeft; global.scrollY = global.pageYOffset = document.body.scrollTop };

	global.attachEvent("onscroll", _emulate_scrollX_scrollY);
	
	global.scroll = global.scrollTo = function(x, y) {
		originalScrollTo(x, y);
		_emulate_scrollX_scrollY();
	}
	global.scrollBy = function(x, y) {
		originalScrollBy(x, y);
		_emulate_scrollX_scrollY();
	}
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Window  ======================================  */
/*  ======================================================================================  */




function _DOMContentLoaded() {
	document.removeEventListener('DOMContentLoaded', _DOMContentLoaded, false);

	if(noDocumentReadyState)document.readyState = "interactive";
	
	if(_emulate_scrollX_scrollY)_emulate_scrollX_scrollY();

	if("classList" in document.body.firstChild) {
		//TODO:: no htc available do for(var node in document.all) __ielt8__element_init__(node)
	}
}
function _onload() {
	global.detachEvent('onload', _onload);

	if(noDocumentReadyState)document.readyState = "complete";

	if(_emulate_scrollX_scrollY)_emulate_scrollX_scrollY();
}

document.addEventListener('DOMContentLoaded', _DOMContentLoaded, false);//Emulated method
global.attachEvent('onload', _onload);//Native method





createBehaviorStyle(__STYLE_ID, __SUPPORTED__TAG_NAMES__, ielt9BehaviorRule);


noDocumentReadyState = ielt9BehaviorRule = number_tmp = void 0;


})(window);