// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name a.ie8.js
// @check_types
// ==/ClosureCompiler==
/**
 * ES5 and DOM shim for IE < 9
 * @version 1.3
 * required:
 *  - Object.append
 */
 
//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = false;
//GCC DEFINES END

;(function(global) {

/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

var /** @const */funcType = "function";

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




/** @type {Object}
 * @const */
var browser = global["browser"] = {
/** @type {string}
 * @const */
	agent : navigator.userAgent.toLowerCase()
};
browser.names = browser.agent.match(/(msie)/gi);
if(browser.names.length)browser[browser.names[0]] = true;
/** @type {boolean}
 * @const */
browser.msie = browser["msie"];
if(browser.msie)for(var i = 6 ; i < 11 ; i++)//IE from 6 to 10
	if(new RegExp('msie ' + i).test(browser.agent)) {
		browser.msie = browser["msie"] = i;
		
		break;
	}
	
var _throwDOMException = function(errStr) {
		var ex = Object.create(DOMException.prototype);
		ex.code = DOMException[errStr];
		ex.message = errStr +': DOM Exception ' + ex.code;
		throw ex;
	},
	_recursivelyWalk = function (nodes, cb) {
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
	

//Emulating HEAD for ie < 9
document.head || (document.head = document.getElementsByTagName('head')[0]);

if(DEBUG) {
	//test DOMElement is an ActiveXObject
	if(!(document.createElement("div") instanceof ActiveXObject))
		console.error("DOMElement is not an ActiveXObject. Probably you in IE > 8 'compatible mode'. <element> instanceof [Node|Element|HTMLElement] wouldn't work");
}

if(!global["Element"])((global["Element"] =
//Reprisent ActiveXObject as Node, Element and HTMLElement so `<element> instanceof Node` is working (!!!But no in IE9 with in "compatible mode")
	ActiveXObject
).prototype)["ie"] = true;//fake prototype for IE < 8
if(!global["HTMLElement"])global["HTMLElement"] = global["Element"];//IE8
if(!global["Node"])global["Node"] = global["Element"];//IE8

var _temoObj;
//Not sure if it wrong. TODO:: tests for this
if(!global["DocumentFragment"])global["DocumentFragment"] = 
	global["Document"] || global["HTMLDocument"] ||//For IE8
	(_temoObj = {}, _temoObj.prototype = {}, _temoObj);



var _arraySlice = Array.prototype.slice,
	
	_hasOwnProperty = Function.prototype.call.bind(Object.prototype.hasOwnProperty),
	/**
	 * Call _function
	 * @param {Function} _function function to call
	 * @param {...} var_args
	 * @return {*} mixed
	 * @version 2
	 */
  
    _applyFunction = Function.prototype.apply,
  
	_call = function(_function, context, var_args) {
		// If no callback function or if callback is not a callable function
		// it will throw TypeError
       return _applyFunction.call(_function, context, _arraySlice.call(arguments, 2))
	},
	/** @type {Node}
	 * @const */
	_testElement = document.createElement('div'),
	nodeProto = global["Node"].prototype;



//[BUGFIX, ielt9] IE < 9 substr() with negative value not working in IE
if("ab".substr(-1) !== "b") {
	String.prototype._itlt9_substr_ = String.prototype.substr;
	String.prototype.substr = function(start, length) {
		return this._itlt9_substr_(start < 0 ? (start = this.length + start, start) < 0 ? 0 : start : start, length);
	}
}

var _origStringSplit,
	_compliantExecNpcg;
/*
[BUGFIX, ielt9, safari] http://blog.stevenlevithan.com/archives/cross-browser-split
More better solution:: http://xregexp.com/
*/
if('te'.split(/(s)*/)[1] != void 0 ||
   '1_1'.split(/(_)/).length != 3) {
   _compliantExecNpcg = /()??/.exec("")[1] === undefined; // NPCG: nonparticipating capturing group
   _origStringSplit = String.prototype.split;
   
	String.prototype.split = function (separator, limit) {
		var str = this;
		// if `separator` is not a regex, use the native `split`
		if(!(separator instanceof RegExp)) {//if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
			//http://es5.github.com/#x15.5.4.14
			//If separator is undefined, then the result array contains just one String, which is the this value (converted to a String). If limit is not undefined, then the output array is truncated so that it contains no more than limit elements.
			if(separator === void 0 && limit === 0)return [];
			
			return _origStringSplit.call(str, separator, limit);
		}

		var output = [],
			lastLastIndex = 0,
			flags = (separator.ignoreCase ? "i" : "") +
					(separator.multiline  ? "m" : "") +
					(separator.sticky     ? "y" : ""),
			separator1 = RegExp(separator.source, flags + "g"), // make `global` and avoid `lastIndex` issues by working with a copy
			separator2 = null, match, lastIndex, lastLength;

		str = str + ""; // type conversion
		if (!_compliantExecNpcg) {
			separator2 = RegExp("^" + separator1.source + "$(?!\\s)", flags); // doesn't need /g or /y, but they don't hurt
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
				if (!_compliantExecNpcg && match.length > 1) {
					match[0].replace(separator2, function() {
						for (var i = 1, a = arguments, l = a.length - 2; i < l; i++) {//for (var i = 1; i < arguments.length - 2; i++) {
							if (a[i] === undefined) {
								match[i] = undefined;
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




/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Exception  ==================================  */
/*  =======================================================================================  */
var _DOMException = global["DOMException"];
if(!_DOMException) {
	/**
	 * DOMException
	 * @constructor
	 * @param {string} errStr Error string code
	 */
	_DOMException = global["DOMException"] = function() { };
	var p = _DOMException.prototype = new Error;
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
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Exception  ==================================  */
/*  =======================================================================================  */


/*  ======================================================================================  */
/*  ======================================  Events  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

//fix [add|remove]EventListener & dispatchEvent for IE < 9

// TODO:: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventListener
// TODO:: http://www.w3.org/TR/DOM-Level-3-Events/#events-EventException
/*
var ObjectHandler = {
  handleEvent: function handleEvent(e) {
    var
      events = this.events,
      type = e.type
    ;
    if (events.hasOwnProperty(type)) {
      events[type].call(this, e);
    }
  },
  // it could be called removeEvent too, as you wish
  remitEvent: function cancelEvent(e) {
    e.currentTarget.removeEventListener(
      e.type, this, e.eventPhase === e.CAPTURING_PHASE
    );
  }
};
*/
//	использовать наработки https://github.com/arexkun/Vine
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
	//ielt9CallbakcUUID = "_prl224";// Некий уникальный идентификатор
	
function fixEvent(event) {
	var thisObj = this;
	
	// один объект события может передаваться по цепочке разным обработчикам
	// при этом кроссбраузерная обработка будет вызвана только 1 раз
	// Снизу, в функции commonHandle,, мы должны проверять на !event["__isFixed"]
	event["__isFixed"] = true;// пометить событие как обработанное

	//http://javascript.gakaa.com/event-detail.aspx
	//http://www.w3.org/TR/2011/WD-DOM-Level-3-Events-20110531/#event-type-click
	//indicates the current click count; the attribute value must be 1 when the user begins this action and increments by 1 for each click.
	if(event.type === "click" && event.detail === undefined)event.detail = 1;
	else if(event.type === "dblclick" && event.detail === undefined)event.detail = 2;
	
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
		
	if(!event.timeStamp)event.timeStamp = +new Date()
	
	if(!event.eventPhase)event.eventPhase = (event.target == thisObj) ? 2 : 3; // "AT_TARGET" = 2, "BUBBLING_PHASE" = 3
	
	if(!event.currentTarget)event.currentTarget = thisObj;
		
		
	// событие DOMAttrModified
	//  TODO:: недоделано
	// TODO:: Привести event во всех случаях (для всех браузеров) в одинаковый вид с newValue, prevValue, propName и т.д.
	if(!event.attrName && event.propertyName)event.attrName = event.propertyName.split('.')[0];//IE При изменении style.width в propertyName передаст именно style.width, а не style, как нам надо

	return event
}

// вспомогательный универсальный обработчик. Вызывается в контексте элемента всегда this = element
function commonHandle(event) {
	var thisObj = this,
		_ = thisObj["_"],
		errors = [],//Инициализуется массив errors для исключений
		errorsMessages = [];
	
	if(!_ || !_[eventsUUID])return;
	
	var handlers = _[eventsUUID][event.type];
	// получить объект события и проверить, подготавливали мы его для IE или нет
	if(!(event = event || window.event)["__isFixed"])event = fixEvent.call(thisObj, event);

	for(var g in handlers)if(_hasOwnProperty(handlers, g)) {
		var handler = handlers[g];
		
		try {
			//Передаём контекст и объект event, результат сохраним в event['result'] для передачи значения дальше по цепочке
			if(
				(
					event['result'] = (
						(typeof _handler != "function") && handler.handleEvent) ? 
							handler.handleEvent(event) : //Registering an EventListener with a function object that also has a handleEvent property -> Call EventListener as a function
							_call(handler, this, event)
				)
				=== false
			  ) {//Если вернели false - остановим обработку функций
				event.preventDefault()
				event.stopPropagation()
			}
		}
		catch(e) { 
			errors.push(e);//Все исключения - добавляем в массив, при этом не прерывая цепочку обработчиков.
			errorsMessages.push(e.message);
			if(console)console.error(e);
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
	//TODO:: useCapture == true
	if(typeof _handler != "function" && !(typeof _handler == "object" && _handler.handleEvent))return;
	
	var /** @type {Node} */
		thisObj = this,
		/** @type {Object} */
		_ = thisObj["_"],
		/** @type {Function} */
		_callback,
		/** @type {boolean} */
		_useInteractive = false;
		
	if(!_)_ = thisObj["_"] = {};
	
	if(_type === "DOMContentLoaded") {//IE
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
		}
	}
	/* TODO:: DOMAttrModified
	else if(_type == "DOMAttrModified") {
	
	}
	*/
	else if(_type === "load" && thisObj.tagName.toUpperCase() === "SCRIPT") {//[script:onload]
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
				thisObj.attachEvent("onreadystatechange", _callback);
			}
		};
		_type = "readystatechange";
	}
	
	/*
	TODO::
	Reference: http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
	If multiple identical EventListeners are registered on the same EventTarget with the same parameters the duplicate instances are discarded. They do not cause the EventListener to be called twice and since they are discarded they do not need to be removed with the removeEventListener method.
	*/
	
	
	// исправляем небольшой глюк IE с передачей объекта window
	if(thisObj.setInterval && (thisObj != global && !thisObj.frameElement))thisObj = global;
	
	//Назначить функции-обработчику уникальный номер. По нему обработчик можно будет легко найти в списке events[type].
	if(!_handler.guid)_handler.guid = ++guid;
	
	//Инициализовать служебную структуру events и обработчик _[handleUUID]. 
	//Обработчик _[handleUUID] фильтрует редко возникающую ошибку, когда событие отрабатывает после unload'а страницы. 
	//Основная же его задача - передать вызов универсальному обработчику commonHandle с правильным указанием текущего элемента this. 
	//Как и events, _[handleUUID] достаточно инициализовать один раз для любых событий.
	if(!(_callback = _[eventsUUID])) {
		_[eventsUUID] = {};
		_callback = _[handleUUID] = function(event) {
			if(event !== void 0)
				return commonHandle.call(thisObj, event);
		}
	}
	
	//Если обработчиков такого типа событий не существует - инициализуем events[type] и вешаем
	// _[handleUUID] как обработчик на elem для запуска браузером по событию type.
	if(!_[eventsUUID][_type]) {
		_[eventsUUID][_type] = {};
		
		if(!_useInteractive)//[script:onload]
			thisObj.attachEvent('on' + _type, _callback);
	}
	
	//Добавляем пользовательский обработчик в список elem[eventsUUID][type] под заданным номером. 
	//Так как номер устанавливается один раз, и далее не меняется - это приводит к ряду интересных фич.
	// Например, запуск add с одинаковыми аргументами добавит событие только один раз.
	_[eventsUUID][_type][_handler.guid] = _handler;
}

if(!document.removeEventListener)global.removeEventListener = document.removeEventListener = function(_type, _handler) {
	var thisObj = this,
		_ = thisObj["_"];		
	if(typeof _handler != "function" || !_handler.guid || !_)return;
	var handlers = _[eventsUUID] && _[eventsUUID][_type];//Получить список обработчиков
	
	delete handlers[_handler.guid];//Удалить обработчик по его номеру

	for(var any in handlers)if(_hasOwnProperty(handlers, any))return;//TODO: проверить, что тут делается. Глупость какая-то.Проверить, не пуст ли список обработчиков
	//Если пуст, то удалить служебный обработчик и очистить служебную структуру events[type]
	thisObj.detachEvent("on" + _type, _[handleUUID]);

	delete _[eventsUUID][_type];

	//Если событий вообще не осталось - удалить events и _[handleUUID] за ненадобностью.
	for(var any in _[eventsUUID])if(_hasOwnProperty(_[eventsUUID], any))return;
	
	delete _[handleUUID];
	delete _[eventsUUID];
}

/**
 * @param {string} event is an event object to be dispatched.
 * @this {Element} is the target of the event.
 * @return {boolean} The return value is false if at least one of the event handlers which handled this event called preventDefault. Otherwise it returns true.
 */
if(!document.dispatchEvent)global.dispatchEvent = document.dispatchEvent = function(event) {
	
	/**
	 * @type {Node}
	 */
	var thisObj = this;
	
	try {
		return thisObj.fireEvent("on" + event.type, event);
	}
	catch(e) {
		//Shim for Custome events in IE < 9
		if(e["number"] === -2147024809) {//"Недопустимый аргумент."
			if(DEBUG)event._custom_event_ = true;//FOR DEBUG
			var node = event.target = thisObj;
			//Всплываем событие
			while(!event.cancelBubble && node) {//Если мы вызвали stopPropogation() - больше не всплываем событие
				if("_" in node)//Признак того, что на элемент могли навесить событие
					commonHandle.call(node, event);
				//Если у события отключено всплытие - не всплываем его
				node = event.bubbles ? (node === document ? window : node.parentNode) : null;
			}
			
			return !event.cancelBubble;
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
		var thisObj = this;
	
		thisObj.type = _type;
		//this.cancelBubble = //TODO:: <-- testing Глупость ???
		//	!(this.bubbles = _bubbles);
		thisObj.bubbles = _bubbles;
		thisObj.cancelable = _cancelable;//https://developer.mozilla.org/en/DOM/event.cancelable
		
		thisObj.isTrusted = false;
		thisObj.target = null;		
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
	/*
	_type in [DOMAttrModified, DOMCharacterDataModified, DOMNodeInserted, DOMNodeInsertedIntoDocument, DOMNodeRemoved, DOMNodeRemovedFromDocument, DOMSubtreeModified]
	_attrChange in [MutationEvent.MODIFICATION, MutationEvent.ADDITION, MutationEvent.REMOVA]
	*/
	function _initMutationEvent(_type, _bubbles, _cancelable, _relatedNode, _prevValue, _newValue, _attrName, _attrChange) {
		var thisObj = this;
		//http://help.dottoro.com/ljifcdwx.php
		_initEvent.call(thisObj, _type, _bubbles, _cancelable);
		
		thisObj.relatedNode = _relatedNode;
		thisObj.prevValue = _prevValue;
		thisObj.newValue = _newValue;
		thisObj.attrName = _attrName;
        thisObj.attrChange = _attrChange;
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
if(global.Event && global.Event.prototype) {
	Event.prototype.stopPropagation = stopPropagation_;
    Event.prototype.preventDefault = preventDefault_;
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Events  ======================================  */
/*  ======================================================================================  */


/*  ======================================================================================  */
/*  ========================================  DOM  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

/* is this stuff defined? */
if(!document.ELEMENT_NODE) {
	document.ELEMENT_NODE = 1;
	document.ATTRIBUTE_NODE = 2;
	document.TEXT_NODE = 3;
	document.CDATA_SECTION_NODE = 4;
	document.ENTITY_REFERENCE_NODE = 5;
	document.ENTITY_NODE = 6;
	document.PROCESSING_INSTRUCTION_NODE = 7;
	document.COMMENT_NODE = 8;
	document.DOCUMENT_NODE = 9;
	document.DOCUMENT_TYPE_NODE = 10;
	document.DOCUMENT_FRAGMENT_NODE = 11;
	document.NOTATION_NODE = 12;
}

//https://developer.mozilla.org/En/DOM/Node.textContent
if(DEBUG && !("textContent" in _testElement)) {
	if(!('innerText' in this) &&
	   (!('data' in this) || !this.appendData))
		throw Error("IE is too old");
}
if(!("textContent" in _testElement)) {
	Object.defineProperty(nodeProto, "textContent", {
		"get" : function() {
			if('innerText' in this)return this.innerText;
			if('data' in this && this.appendData)return this.data;
		},
		"set" : function(val) {
			if('innerText' in this)this.innerText = val;
			else if('data' in this && this.replaceData)this.replaceData(0, this.length, value);
			
			return val;
		}
	});
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
					_childNodes;
					
				/* does the node have any attributes to add? */
				if (attrs && attrs.length > 0)
					/* add all of the attributes */
					for (var i = 0, il = attrs.length ; i < il ;) {
						attr = node.attributes[i++];
						newNode.setAttribute(attr.nodeName, node.getAttribute(attr.nodeName));
					}
				/* are we going after children too, and does the node have any? */
				if (allChildren && (_childNodes = node.childNodes) && _childNodes.length > 0)
					/* recursively get all of the child nodes */
					for (var i = 0, il = _childNodes.length; i < il;)
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
	}
	document.importNode["shim"] = true;
}

function isCssClass(element, classes) {
	if(!element.className || !classes.length || classes.length === 1 && !classes[0])return false;
	var elementClass = " " + element.className + " ",
		match = true,
		k = -1;
	while(match && ++k < classes.length) {
		match = !!~(elementClass).indexOf(" " + classes[k] + " ");
	};
	return match;
}

var attr = "getElementsByClassName";
if(!(attr in _testElement))document[attr] = nodeProto[attr] = function(clas) {
	var ar = [];
	if(arguments.length) {
		clas = (clas + "").trim().split(" ");
		
		clas.length && _recursivelyWalk(this.childNodes, function (el, index) {
			if(el.nodeType == 1 && isCssClass(el, clas)) {
				ar.push(el);
			}
		});
	}
	else throw new Error('WRONG_ARGUMENTS_ERR');
	return ar;
};


var _compareDocumentPosition_ = 'compareDocumentPosition';
if(!(_compareDocumentPosition_ in document)) {
	var __name,
		__n1 = __name || 'DOCUMENT_POSITION_';//Use '__name || ' only for GCC not to inline __n1 param. In this case __name MUST be undefined
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
	__name = 'DISCONNECTED';
	document[__n1 + __name] = nodeProto[__n1 + __name] = 0x01;
	__name = 'PRECEDING';
	document[__n1 + __name] = nodeProto[__n1 + __name] = 0x02;
	__name = 'FOLLOWING';
	document[__n1 + __name] = nodeProto[__n1 + __name] = 0x04;
	__name = 'CONTAINS';
	document[__n1 + __name] = nodeProto[__n1 + __name] = 0x08;
	__name = 'CONTAINED_BY';
	document[__n1 + __name] = nodeProto[__n1 + __name] = 0x10;
};

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

/* getAttribute, setAttribute, hasAttribute fix fix in IE*/
var randomValue = _testElement["sentinel"] = Math.round(Math.random() * 1e9);
if(_testElement.getAttribute("sentinel") == randomValue + "" || nodeProto["ielt8"]) {
	var //_ielt9_getAttribute = _testElement.getAttribute,
		//_ielt9_hasAttribute = _testElement.hasAttribute,//No need
		_ielt9_setAttribute = _testElement.setAttribute,
		_ielt9_removeAttribute = _testElement.removeAttribute;
	
	nodeProto.getAttribute = function(name) {
		var thisObj = this,
			result,
			_ = thisObj["_"];
		
		result = (result = thisObj.attributes && thisObj.attributes[name]) && result.value;
		
		if(result == null && _ && _["shimed_attributes"])
			result = _["shimed_attributes"][name];
		
		return result == null ? null : result;
	}
	
	nodeProto.setAttribute = function(name, value, _forceSaveAttribute) {
		//TODO:: if(value == void 0)throw  WRONG_ARGUMENTS_ERR 
		
		var thisObj = this,
			needTriggered = !(name in thisObj.attributes) && name in thisObj || _forceSaveAttribute;
		
		if(needTriggered) {//Property defined as Object.definedProperty
			var _ = thisObj["_"] || (thisObj["_"] = {});
			
			(_["shimed_attributes"] || (_["shimed_attributes"] = {}))
				[name] = value + "";
		}
		else {
			return _ielt9_setAttribute.call(thisObj, name, value)
		}
		
		//if(needTriggered)thisObj[name] = thisObj[name];//Error:Недостаточно места в стеке
		
		return value;
	}
	nodeProto.setAttribute["ielt9"] = true;
	
	nodeProto.removeAttribute = function(name) {
		var thisObj = this,
			inAttributes = name in thisObj.attributes,
			result = false;
		
		if(!inAttributes && name in thisObj) {//Property defined as Object.definedProperty
			var _ = thisObj["_"];
			
			if(_ && _["shimed_attributes"]) {
				result = !!_["shimed_attributes"][name];
				delete _["shimed_attributes"][name];
			}
		}
		else {
			result = _ielt9_removeAttribute.call(thisObj, name, value) || result
		}
		
		return result
	}

	nodeProto.hasAttribute = function(name) {
		return this.getAttribute(name) !== null;
	}
}


var html5_elements = 'abbr article aside audio canvas command datalist details figure figcaption footer header hgroup keygen mark meter nav output progress section source summary time video',
	html5_elements_array = html5_elements.split(' ');

/** Example of making a document HTML5 element safe
 * Функция "включает" в IE < 9 HTML5 элементы
 * Используется, если никакая другая аналогичная функция не используется
 */
function html5_document(doc) { // pass in a document as an argument
	// create an array of elements IE does not support
	var a = -1;

	while (++a < html5_elements_array.length) { // loop through array
		if(doc.createElement)doc.createElement(html5_elements_array[a]); // pass html5 element into createElement method on document
	}

	return doc; // return document, great for safeDocumentFragment = html5_document(document.createDocumentFragment());
} // critique: array could exist outside the function for improved performance?


//Исправляем для IE<9 создание DocumentFragment, для того, чтобы функция работала с HTML5
if(browser.msie && browser.msie < 9) {
	var msie_CreateDocumentFragment = function() {
		var df = 
				msie_CreateDocumentFragment.orig();
		
		if(global["DocumentFragment"] === global["Document"]) {
			//if DocumentFragment is a fake DocumentFragment -> append each instance with Document methods
			Object["append"](df, global["DocumentFragment"].prototype);//TODO: tests
		}
		
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
 *  chacgeLog: 3 [23.11.2011 19:00] Переделал. include_all and delete_id default now false. Передаю в nodeProto в качестве cloneNode для IE < 9
 *			   2 [06.07.2011 20:00] Добавил поддержку клонирования td и tr для IE < 9
 *			   1 [--.--.2011 --:--] Initial release
 */
var _cloneElement = global["cloneElement"] = function(element, include_all, delete_id) {//Экспортируем cloneElement для совместимости и для вызова напрямую	
	// Обновляем функцию _cloneElement
	if(document.createDocumentFragment !== _cloneElement.oldCreateDocumentFragment && _cloneElement.safeElement != false)
		_cloneElement.safeElement = 
			(!!browser.msie && browser.msie < 9)
			?
			(_cloneElement.oldCreateDocumentFragment = document.createDocumentFragment).call(document).appendChild(document.createElement("div"))
			:
			false;
	
	var result;
	
	//Следующий вариант не работает с HTML5
	//if(_cloneElement.safeDocumentFragment) {
		//result = _cloneElement.safeDocumentFragment.appendChild(document.createElement("div"));//Создаём новый элемент
		
	if(_cloneElement.safeElement &&//IE < 9?
	   ~(" " + html5_elements + " ").indexOf(" " + element.tagName + " ")//HTML5 element?
	   ) {//Мы присваеваем _cloneElement.safeDocumentFragment только если браузер - IE < 9
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
			
			//FIX IE lt 8 Element.prototype
			//if(nodeProto["ielt8"])Object["append"](el, nodeProto);
		}
	}
	else result = _cloneElement.nativeCloneNode.call(element, include_all);
	
	if(delete_id && result.id)result.id = "";
	
	return result;
}
_cloneElement.nativeCloneNode = nodeProto["cloneNode"] || document.documentElement.cloneNode

if(browser.msie && browser.msie < 9) {
	//nodeProto["_cloneNode_"] = _testElement.cloneNode;//Original function
	nodeProto["cloneNode"] = function(deep){return _cloneElement(this, deep)};
}


/*  ======================================================================================  */
/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  DOM  =======================================  */





})(window);