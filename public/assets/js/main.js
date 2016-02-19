(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _resizeFooter = require('../modules/core/resize-footer');

var _resizeFooter2 = _interopRequireDefault(_resizeFooter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"../modules/core/resize-footer":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _selectors = require('selectors');

var _selectors2 = _interopRequireDefault(_selectors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resizeFooter = function resizeFooter() {

	var footerHeight = _selectors2.default.footerWrapper.outerHeight(true);

	_selectors2.default.wrapper.css({ paddingBottom: footerHeight });
}; // Set the height of the footer

resizeFooter();

_selectors2.default.window.on('resize', resizeFooter);

exports.default = resizeFooter;

},{"selectors":3}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var $$ = {

	window: $(window),

	document: $(document),

	page: $('html,body'),

	html: $('html'),

	body: $('body'),

	wrapper: $('#wrapper'),

	header: $('#header'),

	nav: $('#nav'),

	subNav: $('#sub-nav'),

	hero: $('#hero'),

	main: $('#main'),

	containerCentre: $('#container-centre'),

	containerRight: $('#container-right'),

	containerLeft: $('#container-left'),

	footerWrapper: $('#footer-wrapper'),

	preFooter: $('#pre-footer'),

	footer: $('#footerContainer'),

	cookies: $('#cookies'),

	overlay: $('#overlay')

};

exports.default = $$;

},{}]},{},[1]);
