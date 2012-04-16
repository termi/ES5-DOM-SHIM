// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name a.ielt8.js
// ==/ClosureCompiler==

// This file MUST be in <head> section of document

// TODO:: see http://pkario.blogspot.com/2010/09/javascript-event-handling-all-browsers.html
// required: 
//	a.ie8.js [window.browser.msie, window.Node, ...]
 
/** @version 3 */

//GCC DEFINES START
/** @define {boolean} */
var IS_DEBUG = false;
//GCC DEFINES END

;(function(global) {

/** @const @type {boolean} */
var DEBUG = IS_DEBUG && !!(window && window.console);

//CONFIG START
var /** @const*/
	__URL_TO_ELEMENT_BEHAVIOR__     = '/a.ielt8.htc',
	/** @const*/
	__STYLE_ID                      = "ielt8_style_prev_for_behaviour",
	/** @const List of supporting tag names */
	__SUPPORTED__TAG_NAMES__ = "*";
//CONFIG END

var nodeProto = global.Node.prototype,//Note: for IE < 8 `Node` and `Node.prototype` is just an JS objects created in a.ie8.js
	elementProto = global.Element.prototype,
	browser = global["browser"] || {},
	noDocumentReadyState,
	notSupportedTagNames = [
		"script", "style",
		"object",//IE < 8 BUG?
		"_"//use it for feature detecting
	],
	ieltbehaviorRules = [__URL_TO_ELEMENT_BEHAVIOR__],
	ielt9BehaviorRule = "{behavior:",
	_call = Date.call,
	__ielt8__wontfix = [];
	
var jj = ieltbehaviorRules.length;
while(--jj >= 0)
	ielt9BehaviorRule += (" url(\"" + ieltbehaviorRules[jj] + "\")");
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

	style = _call.call(originCreateElement, document, "style");
	style.id = styleId;
	style.type = 'text/css';
	style.setAttribute("data-url", behaviorRule.replace("{behavior:", "").replace(")}", ")"));
	style.styleSheet.cssText = tags + behaviorRule;
	document.head.appendChild(style);
}

if(!document.readyState) {
	noDocumentReadyState = true;
	document.readyState = "uninitialized";
}
	
if(nodeProto["ie"] && browser.msie < 8) {//IE < 8 polifill

nodeProto["ielt8"] = true;

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
 *
 * @param {!string} selector CSS3-селектор
 * @param {Node|Array.<Node>} roots элемент в котором мы будем искать
 * @param {Array.<HTMLElement> = } result Pre-results
 * @return {Array.<HTMLElement>}
 * @version 3
 *  TODO:: Изучить код https://github.com/ded/qwery - может быть будет что-нибуть полезное
 */
function queryOneSelector(selector, roots, result) {
	//\.(.*?)(?=[:\[]|$) -> <.class1.class2>:focus or tag#id<.class1.class2>[attr*=value]
	//TODO:: Реализовать концепцию isFirst ниже
	if(!roots)roots = [document];
	else if(!Array.isArray(roots))roots = [roots];
	
	var isPreResult = !!result;
	result = result || [];
	
	//TODO:: Не засовывать в result те элементы, которые уже были туда засованы
	var /** @type {Object} */resultKeys = {},
		/** @type {NodeList} */tempResult,
		/** @type {HTMLElement} */child,
		/** @type {Node} */root,

		/** @type {Array.<string>} */selectorArr = selector.match(/^([,>+~ ])?(\w*)(?:|\*)\#?([\w-]*)((?:\.?[\w-])*)(\[.*?\])?\:?([\w\-\+\%\(\)]*)$/),
		/** @type {string} */mod = selectorArr[1],
		/** @type {string} */tag = selectorArr[2].toUpperCase(),
		/** @type {string} */id = selectorArr[3],
		/** @type {(string|Array.<string>)} */classes = selectorArr[4],
		/** @type {boolean} */isClasses = !!classes,
		/** @type {(string|Array.<string>)} */css3Attr = selectorArr[5],//css3Attr Пример: [attr*=value]
		/** @type {string} */_curClass,
		/** @type {number} */kr = -1,

		/** @type {(string|Array.<string>)} */css3Mod = selectorArr[6],//css3Mod Пример: :nls-child(2n-0)
		/** @type {(Array.<Array>)} */css3Mod_add,//Pseudo-classes

		/** @type {(Array.<number>)} */ind,
		/** @type {number} */a,
		/** @type {string} */b,
		/** @type {number} */c,
		/** @type {Node} */brother,

		/** @type {number} */i = -1,
		/** @type {Node} */rs,
		/** @type {boolean} */match;
	
	if(isClasses)classes = classes.replace(/\./g, " ");
		
	if(!isPreResult) {// ! matchesSelector
		
			switch(mod) {
				default://mod == ' ' || mod == ','
					while(root = roots[++i]) {
						if(id) {
							child = document.getElementById(id);
							if(!tag || child.tagName.toUpperCase() == tag)result.push(child);
						}
						else {
							/*if(mod === " ") {
								a = root.compareDocumentPosition
							}*/

							if(isClasses) {
								kr = -1;
								tempResult = root.getElementsByClassName(classes);
								while(rs = tempResult[++kr])result.push(rs);
							}
							else if(tag) {
								kr = -1;
								tempResult = (!tag && root.all) ? root.all : root.getElementsByTagName(tag || "*");
								while(rs = tempResult[++kr])result.push(rs);
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
						while((root = root.nextSibling) && root.nodeType != 1){}
						match = root && (!tag || root.tagName.toUpperCase() == tag) &&
							!(root.sourceIndex in resultKeys);
						if(match && isClasses) {
							kr = -1;
							_curClass = ' ' + root.className + ' ';
							while(classes[++kr] && match)
								match = !!~_curClass.indexOf(classes[kr]);
						}
						if(match) {
							result.push(root);
							if(!root.sourceIndex)root.sourceIndex = UUID++;
							resultKeys[root.sourceIndex] = true;
						}
					}
					isClasses = false;
					tag = "";
				break;
				case '~'://W3C: "an F element preceded by an E element"
					while(root = roots[++i]) {
						while (root = root.nextSibling) {//TODO:: Не засовывать в result те элементы, которые уже были туда засованы
							match = root.nodeType == 1 && (!tag || root.tagName.toUpperCase() == tag) &&
								!(root.sourceIndex in resultKeys);
							if(match && isClasses) {
								kr = -1;
								_curClass = ' ' + root.className + ' ';
								while(classes[++kr] && match)
									match = !!~_curClass.indexOf(classes[kr]);
							}
							if(match) {
								result.push(root);
								if(!root.sourceIndex)root.sourceIndex = UUID++;
								resultKeys[root.sourceIndex] = true;
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
							match = child.nodeType == 1 && (!tag || child.tagName.toUpperCase() == tag) &&
								!(root.sourceIndex in resultKeys);
							if(match && isClasses) {
								kr = -1;
								_curClass = ' ' + root.className + ' ';
								while(classes[++kr] && match)
									match = !!~_curClass.indexOf(classes[kr]);
							}
							if(match) {
								result.push(root);
								if(!root.sourceIndex)root.sourceIndex = UUID++;
								resultKeys[root.sourceIndex] = true;
							}
						}
					}
					isClasses = false;
					tag = "";
				break;
			}
		
		
		mod = "";
	}
	
	

	if(result.length && (tag || isClasses || css3Attr || css3Mod || id || mod)) {
		i = 0;
		if(isClasses)classes = (" " + classes.slice(1).replace(/\./g, " | ") + " ").split("|");

		while(rs = result[i++]) {
			match = !(id && rs.id != id);
			
			if(match && isClasses) {
				kr = -1;
				_curClass = ' ' + rs.className + ' ';
				while(classes[++kr] && match)
					match = !!~_curClass.indexOf(classes[kr]);
			}
			if(match && tag) {
				match = rs.tagName.toUpperCase() == tag;
			}
			if(match && css3Attr) {
				//TODO:: [attrName1][attrName2]
				if(typeof css3Attr == 'string') {//Check, if we not analys css3Attr yet
					css3Attr = css3Attr.match(/^\[(.*?)(?:([\*~&\^\$\|!]?=)(.*?))?\]$/);
					if(css3Attr[1] == "class" && document.all)css3Attr[1] = "className";//IE
				}
				
				var value1 = rs.getAttribute(css3Attr[1]), 
					value2 = css3Attr[3];
				
				// TODO: Проверить, что все опреации ^=, !=, *= и т.д. работают или ввести value1 = rs.getattribute(); if(value1)value1 = value1 + ''
				/* from yass 0.3.9 http://yass.webo.in/
				   and edited by me :) */
				/* function calls for CSS2/3 attributes selectors */
				switch(css3Attr[2]) {
				/* W3C "an E element with a "value1" attribute" */
					default://css3Attr[2] == ''
						match = !!value1 || value1 === "";
					break;
				/*
				W3C "an E element whose "value1" attribute value2 is
				exactly equal to "value2"
				*/
					case '=':
						match = value1 && value1 === value2;
					break;
				/*
				from w3.prg "an E element whose "value1" attribute value2 is
				a list of space-separated value2s, one of which is exactly
				equal to "value2"
				*/
					case '&=':
						match = value1 && (new RegExp('(^| +)' + value2 + '($| +)').test(value1));
					break;
				/*
				from w3.prg "an E element whose "value1" attribute value2
				begins exactly with the string "value2"
				*/
					case '^=':
						match = value1 && !value1.indexOf(value2);
					break;
				/*
				W3C "an E element whose "value1" attribute value2
				ends exactly with the string "value2"
				*/
					case '$=':
						match = (value1 && value1.indexOf(value2) == value1.length - value2.length);
					break;
				/*
				W3C "an E element whose "value1" attribute value2
				contains the substring "value2"
				*/
					case '*=':
						match = (value1 && ~value1.indexOf(value2));
					break;
				/*
				W3C "an E element whose "value1" attribute has
				a hyphen-separated list of value2s beginning (from the
				left) with "value2"
				*/
					case '|=':
						match = (value1 && (value1 === value2 || !!value1.indexOf(value2 + '-')));
					break;
				/* value1 doesn't contain given value2 */
					case '!=':
						match = (!value1 || !(new RegExp('(^| +)' + value2 + '($| +)').test(value1)));
					break;

					case '~='://TODO::

					break;
				}
			}
			if(match && css3Mod) {
				//In this block we lose "rs" value
				if(typeof css3Mod == 'string') {
					css3Mod = css3Mod.match(/^([^(]+)(?:\(([^)]+)\))?$/);/* regexpt from jass 0.3.9 (http://yass.webo.in/) rev. 371 line 166 from right */
					//TODO:: Не работает nth-child и nth-last-child - путаница с nodeIndex
					if(css3Mod[2]) {
						if(!/\D/.test(css3Mod[2]))css3Mod_add = [null, 0, '%', css3Mod[2]];
						else if(css3Mod[2] === 'even')css3Mod_add = [null, 2];
						else if(css3Mod[2] === 'odd')css3Mod_add = [null, 2, '%', 1];
						else css3Mod_add = /(?:(-?\d*)n)?(?:(%|-)(\d*))?/.exec(css3Mod[2]);/* regexpt from jass 0.3.9 (http://yass.webo.in/) rev. 371 line 181 ( mod === 'nth-last-child' ?...) */
					}
				}
				//TODO:: Не работает nth-child и nth-last-child - путаница с nodeIndex
				/* from yass 0.3.9 http://yass.webo.in/ */
				/*
				function calls for CSS2/3 modificatos. Specification taken from
				http://www.w3.org/TR/2005/WD-css3-selectors-20051215/
				on success return negative result.
				*/
				switch(css3Mod[1]) {
				/* W3C: "an E element, first rs of its parent" */
					case 'first-child':
				/* implementation was taken from jQuery.1.2.6, line 1394 */
						match = rs.parentNode.getElementsByTagName('*')[0] == rs;
					break;
				/* W3C: "an E element, last rs of its parent" */
					case 'last-child'://In this block we lose "rs" value
				/* loop in lastrss while nodeType isn't element */
						while ((rs = rs.nextSibling) && rs.nodeType != 1) {}
				/* Check for node's existence */
						match = !rs;
					break;
				/* W3C: "an E element, root of the document" */
					case 'root':
						match = rs.nodeName.toLowerCase() == 'html';
					break;
				/* W3C: "an E element, the n-th rs of its parent" */
					case 'nth-child':
						ind = css3Mod_add;
						c = rs.nodeIndex || 0;
						a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0;
						b = ind[1];
				/* check if we have already looked into siblings, using exando - very bad */
						if (c) {
							match = !b ? !(c + a) : !((c + a) % b);
						}
						else {
							match = false;
				/* in the other case just reverse logic for n and loop siblings */
							brother = rs.parentNode.firstChild;
				/* looping in child to find if nth expression is correct */
							do {
				/* nodeIndex expando used from Peppy / Sizzle/ jQuery */
								if (brother.nodeType == 1 && (brother.nodeIndex = ++c) && rs === brother && (!b ? !(c + a) : !((c + a) % b))) {
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
						ind = css3Mod_add;
						c = rs.nodeIndexLast || 0;
						a = ind[3] ? (ind[2] === '%' ? -1 : 1) * ind[3] : 0;
						b = ind[1];
						if (c) {
							match = !b ? !(c + a) : !((c + a) % b);
						}
						else {
							match = false;
							brother = rs.parentNode.lastChild;
							do {
								if (brother.nodeType == 1 && (brother.nodeLastIndex = ++c) && rs === brother && (!b ? !(c + a) : !((c + a) % b))) {
									match = true;
								}
							} while (!match && (brother = brother.previousSibling));
						}
					break;
					
					//TODO:: Проверить на производительность универсальную версию и заменить ею, если производительность не сильно падает
					/*case 'nth-child':
					case 'nth-last-child':
						//In this moment "match" MUST be true
						var isLast = css3Mod[1] != 'nth-child',
							ind = css3Mod[2],
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
									isLast ? (brother.nodeLastIndex = i++) : (brother.nodeIndex = ++i) &&
									rs === brother && ((i + a) % b)) {
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
						match = !rs.firstChild;
					break;
				/* W3C: "an E element, only rs of its parent" */
					case 'only-child':
						match = rs.parentNode.getElementsByTagName('*').length == 1;
					break;
				/*
				W3C: "a user interface element E which is checked
				(for instance a radio-button or checkbox)"
				*/
					case 'checked':
						match = !!rs.checked;
					break;
				/*
				W3C: "an element of type E in language "fr"
				(the document language specifies how language is determined)"
				*/
					case 'lang':
						match = (rs.lang == css3Mod_add || document.documentElement.lang == css3Mod_add);
					break;
				/* thx to John, from Sizzle, 2008-12-05, line 398 */
					case 'enabled':
						match = !rs.disabled && rs.type !== 'hidden';
					break;
				/* thx to John, from Sizzle, 2008-12-05, line 401 */
					case 'disabled':
						match = !!rs.disabled;
					break;
				/* thx to John, from Sizzle, 2008-12-05, line 407 */
					case 'selected':
				/*
				Accessing this property makes selected-by-default
				options in Safari work properly.
				*/
						//TODO: Проверить новый алгоритм
						//Старый: rs.parentNode.selectedIndex;//NOTE:: Add this string manual to compile by Closure Compiler script/Добавить это строчку в откомпилированый скрипт
						//        match = !!rs.selected;
						match = rs.parentNode.selectedIndex && !!rs.selected;//Тут уже Closure Compiler не удаляет нужный вызов
				    break;
					/*TODO::
					default:
						//Non-standart pseudo-classes
						var f = $$N.nonStandartPseudoClasses[css3Mod[1]];
						if(f)match = f(rs);*/
				}
				
			}
		
			if(!match)result.splice(--i, 1);
		}
	}
	
	return result;
};

/**
 * Получение эллементов по классам и тэгам
 * HINT: Пользоватся такой функцией можно только после загрузки страницы (addLoadEvent)
 * @param {!string} selector Строка с CSS3-селектором
 * @this {Document|HTMLElement|Node} root элемент в котором мы будем искать
 * @return {Array.<HTMLElement>} Список найденных элементов
 * @version 4.0
 */
var queryManySelector = function queryManySelector(selector) {
	//var rules = selector.replace(/ *([,>+~. ]) */g, "$1").match(/[^,]\w*/g),
	var root = this,
		result = [],
		rule,
		rules,
		i = 0,
		selElements,
		hightRoot = root,
		rt,
		k,
		isSimpleSelector = /^[\w#.]\w*$/.test(selector);//quick return or generic call, missed ~ in attributes selector;

	if(isSimpleSelector) {
		switch (selector.charAt(0)) {
			case '#':
				rule = selector.slice(1);
				selElements = root.getElementById(rule);
				//workaround with IE bug about returning element by name not by ID.
				//Solution completely changed, thx to deerua.
				//Get all matching elements with this id
				if (browser.msie < 9 && selElements.id !== rule) {
					selElements = selElements.ownerDocument.all[rule];
				}
				result.push(selElements);
			break;
			case '.':
				selElements = root.getElementsByClassName(selector.slice(1));
				while(rt = selElements[i++])result.push(rt);
			break;
			default:
				selElements = root.getElementsByTagName(selector);
				while(rt = selElements[i++])result.push(rt);
			break;
		}
		return result;
	}
	
	rules = (selector + ",").replace(/ *([,>+~ ]) */g, "$1").replace(/\((\dn)\+(\d)\)/, "\($1%$2\)").match(/(^[+> ~]?|,|\>|\+|~| ).*?(?=[,>+~ ]|$)/g);
	selElements = [];
		
	while((rule = rules[i++])) {
		if(rule.charAt(0) == ',') {//Если первая буква серектора - запятая
			if(selElements && selElements.length > 0)result = result.concat(selElements);
			selElements = [];
			root = hightRoot;
			if(rule.length == 1)continue;//Если правило - это только запятая
		}
		else if(selElements && selElements.length > 0)	{
			root = selElements;
		}
		if(selElements) {
			selElements = queryOneSelector(rule, root);
		}
		if(selElements && !selElements.length)selElements = null;
		//Если selElements == null и не равно "," - значит мы ничего не нашли на пред. шаге
	}
	
	return result;
};


/**
 * @param {!string} selector
 * @this {Document|HTMLElement|Node}
 * @return {HTMLElement|Node}
 */
function queryOneManySelector(selector) {
	var thisObj = this,
		isSimpleSelector = /^[\w#.]\w*$/.test(selector),//quick return or generic call, missed ~ in attributes selector;
		tmp,
		node;

	if(isSimpleSelector) {
		switch (selector.charAt(0)) {
			case '#':
				tmp = selector.slice(1);
				node = thisObj.getElementById(tmp);
				//workaround with IE bug about returning element by name not by ID.
				//Solution completely changed, thx to deerua.
				//Get all matching elements with this id
				if (browser.msie < 9 && node.id !== tmp) {
					node = node.ownerDocument.all[tmp];
				}
				return node;
			break;
			case '.':
				return thisObj.getElementsByClassName(selector.slice(1))[0];
			break;
			default:
				return thisObj.getElementsByTagName(selector)[0];
			break;
		}
	}

	return thisObj.querySelectorAll(selector)[0] || null;
}

/**
 * @param {!string} selector
 * @this {HTMLElement}
 * @return {boolean}
 */
function _matchesSelector(selector) {
	if(!selector)return false;
	if(selector === "*")return true;

	var thisObj = this,
		isSimpleSelector = /^[\w#.]\w*$/.test(selector),
		isEasySelector = !isSimpleSelector && !/([,>+~ ])/.test(selector),
		tmp,
		match,
		e;

	if(isSimpleSelector) {
		switch (selector.charAt(0)) {
			case '#':
				return thisObj.id === selector.slice(1);
			break;
			case '.':
				return !!~(" " + thisObj.className + " ").indexOf(" " + selector.slice(1) + " ");
			break;
			default:
				return thisObj.tagName && thisObj.tagName.toUpperCase() === selector.toUpperCase();
			break;
		}
	}
	else if(isEasySelector) {
		tmp = queryOneSelector(selector, null, [thisObj]);
		if(DEBUG) {
			if(tmp.length !== 1)console.error("matchesSelector error 1");
			if(tmp[0] !== thisObj)console.error("matchesSelector error 2");
		}
		return tmp[0] === thisObj;
	}
	else {
		tmp = thisObj.ownerDocument;
		tmp = tmp.querySelectorAll(selector);
		for ( e in tmp ) if(Object.prototype.hasOwnProperty.call(tmp, e)) {
	        match = tmp[e] === thisObj;
	        if(match)return true;
	    }
	    return false;
	}
}


if(!document.querySelectorAll)document.querySelectorAll = queryManySelector;
if(!document.querySelector)document.querySelector = queryOneManySelector;

if(!nodeProto.hasAttribute)nodeProto.hasAttribute = function(name) {
	return this.getAttribute(name) !== null;
};

var _returnFirstParam = function(a) {
	return function() {
		return a
	}
};
nodeProto.g1 = _returnFirstParam(1);
nodeProto.g2 = _returnFirstParam(2);
nodeProto.g3 = _returnFirstParam(3);
nodeProto.g4 = _returnFirstParam(4);
//nodeProto.g5 = _returnFirstParam(5);// historical
//nodeProto.g6 = _returnFirstParam(6);// historical
nodeProto.g7 = _returnFirstParam(7);
nodeProto.g8 = _returnFirstParam(8);
nodeProto.g9 = _returnFirstParam(9);
nodeProto.g10 = _returnFirstParam(10);
nodeProto.g11 = _returnFirstParam(11);
//nodeProto.g12 = _returnFirstParam(12);// historical
nodeProto.g16 = _returnFirstParam(16);

nodeProto["__ielt8__element_init__"] = function __ielt8__element_init__(thisObj) {
	if(thisObj.element)thisObj = thisObj.element;//¬_¬ only if the save `this` to local variable
	
	/*__ielt8__element_init__["plugins"].forEach(function(plugin) {
		plugin(thisObj)
	})*/
	
	if(!thisObj.after)thisObj.after = elementProto.after;
	if(!thisObj.before)thisObj.before = elementProto.before;
	if(!thisObj.append)thisObj.append = elementProto.append;
	if(!thisObj.prepend)thisObj.prepend = elementProto.prepend;
	if(!thisObj.replace)thisObj.replace = elementProto.replace;
	if(!thisObj.remove)thisObj.remove = elementProto.remove;

	if(!thisObj.isEqualNode)thisObj.isEqualNode = nodeProto.isEqualNode;
	if(!thisObj.compareDocumentPosition)thisObj.compareDocumentPosition = nodeProto.compareDocumentPosition;
	if(!thisObj.getElementsByClassName)thisObj.getElementsByClassName = elementProto.getElementsByClassName;
	/*@requared: window.addEventListener, window.removeEventListener, window.dispatchEvent */
	if(!thisObj.addEventListener)thisObj.addEventListener = window.addEventListener;
	if(!thisObj.removeEventListener)thisObj.removeEventListener = window.removeEventListener;
	if(!thisObj.dispatchEvent)thisObj.dispatchEvent = window.dispatchEvent;


	if(!thisObj.querySelectorAll)thisObj.querySelectorAll = queryManySelector;
	if(!thisObj.querySelector)thisObj.querySelector = queryOneManySelector;
	if(!thisObj.matchesSelector)thisObj.matchesSelector = _matchesSelector;
	
	if(!thisObj.hasAttribute)thisObj.hasAttribute = elementProto.hasAttribute;

	//Unsafe (with "OBJECT" tag, for example) set's
	try {
		
		if(!thisObj["_"])thisObj["_"] = {};
		if(thisObj.cloneNode !== elementProto.cloneNode) {
			thisObj["_"]["nativeCloneNode"] = thisObj.cloneNode;
			thisObj.cloneNode = elementProto.cloneNode;
		}
		if(nodeProto.contains)thisObj.contains = nodeProto.contains;
	}
	catch(e) {
		//console.error(e.message)
	}
	if(!thisObj["_"])__ielt8__wontfix.push(thisObj);
}
//__ielt8__element_init__["plugins"] = [];

var origCloneNode = nodeProto["cloneNode"];
nodeProto["cloneNode"] = function(deep) {
	var el = _call.call(origCloneNode, this, deep);
	
	var jj = ieltbehaviorRules.length;
	while(--jj >= 0)
		el.addBehavior(ieltbehaviorRules[jj]);
	
	
	return el;
}


/*  ======================================================================================  */
/*  ================================  Document  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  */

var originCreateElement = document.createElement;
document.createElement = function(tagName) {
	var el = _call.call(originCreateElement, document, tagName);
	
	if(tagName !== "_") {
		var jj = ieltbehaviorRules.length;
		while(--jj >= 0)
			el.addBehavior(ieltbehaviorRules[jj]);
	}
	
	return el;
};
document.createElement.orig = originCreateElement;


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


var _emulate_scrollX_scrollY,
	originalScrollTo = global.scrollTo;
if(!("pageXOffset" in global) && global.attachEvent) {
	global.pageXOffset = global.pageYOffset = 0;
	_emulate_scrollX_scrollY = document.compatMode === "CSS1Compat" ?
			function() { global.pageXOffset = document.body.parentNode.scrollLeft; global.pageYOffset = document.body.parentNode.scrollTop }
			:
			function() { global.pageXOffset = document.body.scrollLeft; global.pageYOffset = document.body.scrollTop };

	global.attachEvent("onscroll", _emulate_scrollX_scrollY);

	global.scrollTo = function(x, y) {
		originalScrollTo(x, y);
		global.pageXOffset = x;
		global.pageYOffset = y;
	}
}

/*  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Window  ======================================  */
/*  ======================================================================================  */





 
document.addEventListener('DOMContentLoaded', function _DOMContentLoaded() {//Emulated method
	document.removeEventListener('DOMContentLoaded', _DOMContentLoaded, false);

	if(noDocumentReadyState)document.readyState = "interactive";

	//createBehaviorStyle("__HEAD_BEH_RULES", "head *",  ielt9BehaviorRule);
	
	if(_emulate_scrollX_scrollY)_emulate_scrollX_scrollY();
}, false);
 
global.attachEvent('onload', function _onload() {//Native method
	global.detachEvent('onload', _onload);

	if(noDocumentReadyState)document.readyState = "complete";

	if(_emulate_scrollX_scrollY)_emulate_scrollX_scrollY();
});






createBehaviorStyle(__STYLE_ID, __SUPPORTED__TAG_NAMES__, ielt9BehaviorRule);

}
})(window);