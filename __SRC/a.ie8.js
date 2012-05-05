// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name a.ie8.js
// @check_types
// ==/ClosureCompiler==
/**
 * ES5 and DOM shim for IE < 8
 * @version 4
 */
 
//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = false;
//GCC DEFINES END


;(function(global) {


/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

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
  , _append = function(obj, extension) {
		for(var key in extension)
			if(_hasOwnProperty(extension, key) && !_hasOwnProperty(obj, key))
				obj[key] = extension[key];
		
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
   boolean_tmp = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
   
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
		if (limit === undefined || +limit < 0) {
			limit = Infinity;
		} else {
			limit = ~~(+limit);
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

	// записать нажатую кнопку мыши в which для IE. 1 == левая; 2 == средняя; 3 == правая
	event.which || event.button && (event.which = event.button & 1 ? 1 : event.button & 2 ? 3 : event.button & 4 ? 2 : 0);

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
function commonHandle(event) {
	if(fixEvent === void 0) {//фильтруем редко возникающую ошибку, когда событие отрабатывает после unload'а страницы. 
		return;
	}

	var thisObj = this,
		_ = thisObj["_"],
		errors = [],//Инициализуется массив errors для исключений
		errorsMessages = [];
	
	if(!_ || !_[_event_eventsUUID])return;
	
	// получить объект события и проверить, подготавливали мы его для IE или нет
	event || (event = window.event);
	if(!event["__isFixed"])event = fixEvent.call(thisObj, event);

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
		/** @type {number} 
		_event_phase = useCapture ? 1 : 3;*/
		
	if(!_)_ = thisObj["_"] = {};
	//_ = _[_event_phase] || (_[_event_phase] = {});
	
	if(_type === "DOMContentLoaded") {//IE
		if (document.readyState == 'complete')return;

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
		if(e["number"] === -2147024809) {//"Недопустимый аргумент."
			if(DEBUG)_event._custom_event_ = true;//FOR DEBUG
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
function_tmp = _Element_prototype[string_tmp] || function(clas) {
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
};
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

supportsUnknownElements = (function (a) {
	a.innerHTML = '<x-x></x-x>';

	return a.childNodes.length === 1;
})(_testElement);
	
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




})(window);