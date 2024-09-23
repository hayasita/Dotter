/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@popperjs/core/lib/createPopper.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/createPopper.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   popperGenerator: () => (/* binding */ popperGenerator)
/* harmony export */ });
/* harmony import */ var _dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dom-utils/getCompositeRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dom-utils/listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/orderModifiers.js */ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/debounce.js */ "./node_modules/@popperjs/core/lib/utils/debounce.js");
/* harmony import */ var _utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/mergeByName.js */ "./node_modules/@popperjs/core/lib/utils/mergeByName.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");









var DEFAULT_OPTIONS = {
  placement: 'bottom',
  modifiers: [],
  strategy: 'absolute'
};

function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return !args.some(function (element) {
    return !(element && typeof element.getBoundingClientRect === 'function');
  });
}

function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }

  var _generatorOptions = generatorOptions,
      _generatorOptions$def = _generatorOptions.defaultModifiers,
      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
      _generatorOptions$def2 = _generatorOptions.defaultOptions,
      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper(reference, popper, options) {
    if (options === void 0) {
      options = defaultOptions;
    }

    var state = {
      placement: 'bottom',
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference,
        popper: popper
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state,
      setOptions: function setOptions(setOptionsAction) {
        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options);
        state.scrollParents = {
          reference: (0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(reference) ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference) : reference.contextElement ? (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(reference.contextElement) : [],
          popper: (0,_dom_utils_listScrollParents_js__WEBPACK_IMPORTED_MODULE_1__["default"])(popper)
        }; // Orders the modifiers based on their dependencies and `phase`
        // properties

        var orderedModifiers = (0,_utils_orderModifiers_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_utils_mergeByName_js__WEBPACK_IMPORTED_MODULE_3__["default"])([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

        state.orderedModifiers = orderedModifiers.filter(function (m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }

        var _state$elements = state.elements,
            reference = _state$elements.reference,
            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
        // anymore

        if (!areValidElements(reference, popper)) {
          return;
        } // Store the reference and popper rects to be read by modifiers


        state.rects = {
          reference: (0,_dom_utils_getCompositeRect_js__WEBPACK_IMPORTED_MODULE_4__["default"])(reference, (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(popper), state.options.strategy === 'fixed'),
          popper: (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(popper)
        }; // Modifiers have the ability to reset the current update cycle. The
        // most common use case for this is the `flip` modifier changing the
        // placement, which then needs to re-run all the modifiers, because the
        // logic was previously ran for the previous placement and is therefore
        // stale/incorrect

        state.reset = false;
        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
        // is filled with the initial data specified by the modifier. This means
        // it doesn't persist and is fresh on each update.
        // To ensure persistent data, use `${name}#persistent`

        state.orderedModifiers.forEach(function (modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });

        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }

          var _state$orderedModifie = state.orderedModifiers[index],
              fn = _state$orderedModifie.fn,
              _state$orderedModifie2 = _state$orderedModifie.options,
              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
              name = _state$orderedModifie.name;

          if (typeof fn === 'function') {
            state = fn({
              state: state,
              options: _options,
              name: name,
              instance: instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: (0,_utils_debounce_js__WEBPACK_IMPORTED_MODULE_7__["default"])(function () {
        return new Promise(function (resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };

    if (!areValidElements(reference, popper)) {
      return instance;
    }

    instance.setOptions(options).then(function (state) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state);
      }
    }); // Modifiers have the ability to execute arbitrary code before the first
    // update cycle runs. They will be executed in the same order as the update
    // cycle. This is useful when a modifier adds some persistent data that
    // other modifiers need to use, but the modifier is run after the dependent
    // one.

    function runModifierEffects() {
      state.orderedModifiers.forEach(function (_ref) {
        var name = _ref.name,
            _ref$options = _ref.options,
            options = _ref$options === void 0 ? {} : _ref$options,
            effect = _ref.effect;

        if (typeof effect === 'function') {
          var cleanupFn = effect({
            state: state,
            name: name,
            instance: instance,
            options: options
          });

          var noopFn = function noopFn() {};

          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }

    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function (fn) {
        return fn();
      });
      effectCleanupFns = [];
    }

    return instance;
  };
}
var createPopper = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/contains.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/contains.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ contains)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

  if (parent.contains(child)) {
    return true;
  } // then fallback to custom implementation with Shadow DOM support
  else if (rootNode && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(rootNode)) {
      var next = child;

      do {
        if (next && parent.isSameNode(next)) {
          return true;
        } // $FlowFixMe[prop-missing]: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    } // Give up, the result is false


  return false;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBoundingClientRect)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }

  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }

  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;

  if (includeScale && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    scaleX = element.offsetWidth > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_1__.round)(clientRect.height) / element.offsetHeight || 1 : 1;
  }

  var _ref = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) : window,
      visualViewport = _ref.visualViewport;

  var addVisualOffsets = !(0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_3__["default"])() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getClippingRect)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getViewportRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js");
/* harmony import */ var _getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getDocumentRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js");
/* harmony import */ var _listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./listScrollParents.js */ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js");
/* harmony import */ var _getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _contains_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");















function getInnerBoundingClientRect(element, strategy) {
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element, false, strategy === 'fixed');
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}

function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === _enums_js__WEBPACK_IMPORTED_MODULE_1__.viewport ? (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getViewportRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element, strategy)) : (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : (0,_utils_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_2__["default"])((0,_getDocumentRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(element)));
} // A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`


function getClippingParents(element) {
  var clippingParents = (0,_listScrollParents_js__WEBPACK_IMPORTED_MODULE_7__["default"])((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_8__["default"])(element));
  var canEscapeClipping = ['absolute', 'fixed'].indexOf((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_9__["default"])(element).position) >= 0;
  var clipperElement = canEscapeClipping && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isHTMLElement)(element) ? (0,_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_10__["default"])(element) : element;

  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clipperElement)) {
    return [];
  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


  return clippingParents.filter(function (clippingParent) {
    return (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(clippingParent) && (0,_contains_js__WEBPACK_IMPORTED_MODULE_11__["default"])(clippingParent, clipperElement) && (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_12__["default"])(clippingParent) !== 'body';
  });
} // Gets the maximum area that the element is visible in due to any number of
// clipping parents


function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents[0];
  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.top, accRect.top);
    accRect.right = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.right, accRect.right);
    accRect.bottom = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.min)(rect.bottom, accRect.bottom);
    accRect.left = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_13__.max)(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getCompositeRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./getNodeScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");









function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.width) / element.offsetWidth || 1;
  var scaleY = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
} // Returns the composite rect of an element relative to its offsetParent.
// Composite means it takes into account transforms as well as layout.


function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }

  var isOffsetParentAnElement = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent);
  var offsetParentIsScaled = (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent) && isElementScaled(offsetParent);
  var documentElement = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(offsetParent);
  var rect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };

  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
    (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_5__["default"])(documentElement)) {
      scroll = (0,_getNodeScroll_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent);
    }

    if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(offsetParent)) {
      offsets = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_7__["default"])(documentElement);
    }
  }

  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getComputedStyle)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getComputedStyle(element) {
  return (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element).getComputedStyle(element);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentElement)
/* harmony export */ });
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

function getDocumentElement(element) {
  // $FlowFixMe[incompatible-return]: assume body is always available
  return (((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isElement)(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
  element.document) || window.document).documentElement;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getDocumentRect)
/* harmony export */ });
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");




 // Gets the entire size of the scrollable document area, even extending outside
// of the `<html>` and `<body>` rect bounds if horizontally scrollable

function getDocumentRect(element) {
  var _element$ownerDocumen;

  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var winScroll = (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);
  var y = -winScroll.scrollTop;

  if ((0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_4__["default"])(body || html).direction === 'rtl') {
    x += (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_2__.max)(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return {
    width: width,
    height: height,
    x: x,
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getHTMLElementScroll)
/* harmony export */ });
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getLayoutRect)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
 // Returns the layout rect of an element relative to its offsetParent. Layout
// means it doesn't take into account transforms.

function getLayoutRect(element) {
  var clientRect = (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element); // Use the clientRect sizes if it's not been transformed.
  // Fixes https://github.com/popperjs/popper-core/issues/1223

  var width = element.offsetWidth;
  var height = element.offsetHeight;

  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }

  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }

  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width: width,
    height: height
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeName)
/* harmony export */ });
function getNodeName(element) {
  return element ? (element.nodeName || '').toLowerCase() : null;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getNodeScroll)
/* harmony export */ });
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getHTMLElementScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js");




function getNodeScroll(node) {
  if (node === (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node) || !(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node)) {
    return (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node);
  } else {
    return (0,_getHTMLElementScroll_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node);
  }
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOffsetParent)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _isTableElement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./isTableElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");








function getTrueOffsetParent(element) {
  if (!(0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || // https://github.com/popperjs/popper-core/issues/837
  (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element).position === 'fixed') {
    return null;
  }

  return element.offsetParent;
} // `.offsetParent` reports `null` for fixed elements, while absolute elements
// return the containing block


function getContainingBlock(element) {
  var isFirefox = /firefox/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());
  var isIE = /Trident/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_2__["default"])());

  if (isIE && (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element)) {
    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
    var elementCss = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);

    if (elementCss.position === 'fixed') {
      return null;
    }
  }

  var currentNode = (0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element);

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isShadowRoot)(currentNode)) {
    currentNode = currentNode.host;
  }

  while ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(currentNode) && ['html', 'body'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(currentNode)) < 0) {
    var css = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(currentNode); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }

  return null;
} // Gets the closest ancestor positioned element. Handles some edge cases,
// such as table ancestors and cross browser bugs.


function getOffsetParent(element) {
  var window = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_5__["default"])(element);
  var offsetParent = getTrueOffsetParent(element);

  while (offsetParent && (0,_isTableElement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(offsetParent) && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static') {
    offsetParent = getTrueOffsetParent(offsetParent);
  }

  if (offsetParent && ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'html' || (0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_4__["default"])(offsetParent) === 'body' && (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_1__["default"])(offsetParent).position === 'static')) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getParentNode)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");



function getParentNode(element) {
  if ((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element) === 'html') {
    return element;
  }

  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || ( // DOM Element detected
    (0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isShadowRoot)(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element) // fallback

  );
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getScrollParent)
/* harmony export */ });
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _instanceOf_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");




function getScrollParent(node) {
  if (['html', 'body', '#document'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node)) >= 0) {
    // $FlowFixMe[incompatible-return]: assume body is always available
    return node.ownerDocument.body;
  }

  if ((0,_instanceOf_js__WEBPACK_IMPORTED_MODULE_1__.isHTMLElement)(node) && (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(node)) {
    return node;
  }

  return getScrollParent((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(node));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getViewportRect)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getWindowScrollBarX.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js");
/* harmony import */ var _isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isLayoutViewport.js */ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js");




function getViewportRect(element, strategy) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var html = (0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = (0,_isLayoutViewport_js__WEBPACK_IMPORTED_MODULE_2__["default"])();

    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width: width,
    height: height,
    x: x + (0,_getWindowScrollBarX_js__WEBPACK_IMPORTED_MODULE_3__["default"])(element),
    y: y
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js":
/*!****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindow.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindow)
/* harmony export */ });
function getWindow(node) {
  if (node == null) {
    return window;
  }

  if (node.toString() !== '[object Window]') {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScroll)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");

function getWindowScroll(node) {
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft: scrollLeft,
    scrollTop: scrollTop
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getWindowScrollBarX)
/* harmony export */ });
/* harmony import */ var _getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getWindowScroll.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js");



function getWindowScrollBarX(element) {
  // If <html> has a CSS width greater than the viewport, then this will be
  // incorrect for RTL.
  // Popper 1 is broken in this case and never had a bug report so let's assume
  // it's not an issue. I don't think anyone ever specifies width on <html>
  // anyway.
  // Browsers where the left scrollbar doesn't cause an issue report `0` for
  // this (e.g. Edge 2019, IE11, Safari)
  return (0,_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_0__["default"])((0,_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)).left + (0,_getWindowScroll_js__WEBPACK_IMPORTED_MODULE_2__["default"])(element).scrollLeft;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElement: () => (/* binding */ isElement),
/* harmony export */   isHTMLElement: () => (/* binding */ isHTMLElement),
/* harmony export */   isShadowRoot: () => (/* binding */ isShadowRoot)
/* harmony export */ });
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");


function isElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}

function isHTMLElement(node) {
  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}

function isShadowRoot(node) {
  // IE 11 has no ShadowRoot
  if (typeof ShadowRoot === 'undefined') {
    return false;
  }

  var OwnElement = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isLayoutViewport)
/* harmony export */ });
/* harmony import */ var _utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/userAgent.js */ "./node_modules/@popperjs/core/lib/utils/userAgent.js");

function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test((0,_utils_userAgent_js__WEBPACK_IMPORTED_MODULE_0__["default"])());
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isScrollParent)
/* harmony export */ });
/* harmony import */ var _getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");

function isScrollParent(element) {
  // Firefox wants us to check `-x` and `-y` variations as well
  var _getComputedStyle = (0,_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element),
      overflow = _getComputedStyle.overflow,
      overflowX = _getComputedStyle.overflowX,
      overflowY = _getComputedStyle.overflowY;

  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/isTableElement.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isTableElement)
/* harmony export */ });
/* harmony import */ var _getNodeName_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");

function isTableElement(element) {
  return ['table', 'td', 'th'].indexOf((0,_getNodeName_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element)) >= 0;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js":
/*!************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ listScrollParents)
/* harmony export */ });
/* harmony import */ var _getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js");
/* harmony import */ var _getParentNode_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getParentNode.js */ "./node_modules/@popperjs/core/lib/dom-utils/getParentNode.js");
/* harmony import */ var _getWindow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./isScrollParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js");




/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/

function listScrollParents(element, list) {
  var _element$ownerDocumen;

  if (list === void 0) {
    list = [];
  }

  var scrollParent = (0,_getScrollParent_js__WEBPACK_IMPORTED_MODULE_0__["default"])(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = (0,_getWindow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], (0,_isScrollParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
  updatedList.concat(listScrollParents((0,_getParentNode_js__WEBPACK_IMPORTED_MODULE_3__["default"])(target)));
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/enums.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/enums.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* binding */ afterMain),
/* harmony export */   afterRead: () => (/* binding */ afterRead),
/* harmony export */   afterWrite: () => (/* binding */ afterWrite),
/* harmony export */   auto: () => (/* binding */ auto),
/* harmony export */   basePlacements: () => (/* binding */ basePlacements),
/* harmony export */   beforeMain: () => (/* binding */ beforeMain),
/* harmony export */   beforeRead: () => (/* binding */ beforeRead),
/* harmony export */   beforeWrite: () => (/* binding */ beforeWrite),
/* harmony export */   bottom: () => (/* binding */ bottom),
/* harmony export */   clippingParents: () => (/* binding */ clippingParents),
/* harmony export */   end: () => (/* binding */ end),
/* harmony export */   left: () => (/* binding */ left),
/* harmony export */   main: () => (/* binding */ main),
/* harmony export */   modifierPhases: () => (/* binding */ modifierPhases),
/* harmony export */   placements: () => (/* binding */ placements),
/* harmony export */   popper: () => (/* binding */ popper),
/* harmony export */   read: () => (/* binding */ read),
/* harmony export */   reference: () => (/* binding */ reference),
/* harmony export */   right: () => (/* binding */ right),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   top: () => (/* binding */ top),
/* harmony export */   variationPlacements: () => (/* binding */ variationPlacements),
/* harmony export */   viewport: () => (/* binding */ viewport),
/* harmony export */   write: () => (/* binding */ write)
/* harmony export */ });
var top = 'top';
var bottom = 'bottom';
var right = 'right';
var left = 'left';
var auto = 'auto';
var basePlacements = [top, bottom, right, left];
var start = 'start';
var end = 'end';
var clippingParents = 'clippingParents';
var viewport = 'viewport';
var popper = 'popper';
var reference = 'reference';
var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []); // modifiers that need to read the DOM

var beforeRead = 'beforeRead';
var read = 'read';
var afterRead = 'afterRead'; // pure-logic modifiers

var beforeMain = 'beforeMain';
var main = 'main';
var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

var beforeWrite = 'beforeWrite';
var write = 'write';
var afterWrite = 'afterWrite';
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   afterMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterMain),
/* harmony export */   afterRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterRead),
/* harmony export */   afterWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.afterWrite),
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.arrow),
/* harmony export */   auto: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.auto),
/* harmony export */   basePlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements),
/* harmony export */   beforeMain: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeMain),
/* harmony export */   beforeRead: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeRead),
/* harmony export */   beforeWrite: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.beforeWrite),
/* harmony export */   bottom: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom),
/* harmony export */   clippingParents: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.computeStyles),
/* harmony export */   createPopper: () => (/* reexport safe */ _popper_js__WEBPACK_IMPORTED_MODULE_4__.createPopper),
/* harmony export */   createPopperBase: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__.createPopper),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   end: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.end),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.hide),
/* harmony export */   left: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.left),
/* harmony export */   main: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.main),
/* harmony export */   modifierPhases: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.offset),
/* harmony export */   placements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements),
/* harmony export */   popper: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_2__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__.preventOverflow),
/* harmony export */   read: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.read),
/* harmony export */   reference: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference),
/* harmony export */   right: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.right),
/* harmony export */   start: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.start),
/* harmony export */   top: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.top),
/* harmony export */   variationPlacements: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements),
/* harmony export */   viewport: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport),
/* harmony export */   write: () => (/* reexport safe */ _enums_js__WEBPACK_IMPORTED_MODULE_0__.write)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _popper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./popper.js */ "./node_modules/@popperjs/core/lib/popper.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/applyStyles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dom-utils/getNodeName.js */ "./node_modules/@popperjs/core/lib/dom-utils/getNodeName.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");

 // This modifier takes the styles prepared by the `computeStyles` modifier
// and applies them to the HTMLElements such as popper and arrow

function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function (name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name]; // arrow is optional + virtual elements

    if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
      return;
    } // Flow doesn't support to extend this property, but it's the most
    // effective way to apply styles to an HTMLElement
    // $FlowFixMe[cannot-write]


    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function (name) {
      var value = attributes[name];

      if (value === false) {
        element.removeAttribute(name);
      } else {
        element.setAttribute(name, value === true ? '' : value);
      }
    });
  });
}

function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: '0',
      top: '0',
      margin: '0'
    },
    arrow: {
      position: 'absolute'
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;

  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }

  return function () {
    Object.keys(state.elements).forEach(function (name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

      var style = styleProperties.reduce(function (style, property) {
        style[property] = '';
        return style;
      }, {}); // arrow is optional + virtual elements

      if (!(0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_0__.isHTMLElement)(element) || !(0,_dom_utils_getNodeName_js__WEBPACK_IMPORTED_MODULE_1__["default"])(element)) {
        return;
      }

      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function (attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'applyStyles',
  enabled: true,
  phase: 'write',
  fn: applyStyles,
  effect: effect,
  requires: ['computeStyles']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/arrow.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/arrow.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../dom-utils/contains.js */ "./node_modules/@popperjs/core/lib/dom-utils/contains.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");








 // eslint-disable-next-line import/no-unused-modules

var toPaddingObject = function toPaddingObject(padding, state) {
  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return (0,_utils_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof padding !== 'number' ? padding : (0,_utils_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_1__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_2__.basePlacements));
};

function arrow(_ref) {
  var _state$modifiersData$;

  var state = _ref.state,
      name = _ref.name,
      options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets = state.modifiersData.popperOffsets;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(state.placement);
  var axis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(basePlacement);
  var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_2__.left, _enums_js__WEBPACK_IMPORTED_MODULE_2__.right].indexOf(basePlacement) >= 0;
  var len = isVertical ? 'height' : 'width';

  if (!arrowElement || !popperOffsets) {
    return;
  }

  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_5__["default"])(arrowElement);
  var minProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.top : _enums_js__WEBPACK_IMPORTED_MODULE_2__.left;
  var maxProp = axis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_2__.right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
  var arrowOffsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement);
  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
  // outside of the popper bounds

  var min = paddingObject[minProp];
  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_7__.within)(min, center, max); // Prevents breaking syntax highlighting...

  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
}

function effect(_ref2) {
  var state = _ref2.state,
      options = _ref2.options;
  var _options$element = options.element,
      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

  if (arrowElement == null) {
    return;
  } // CSS selector


  if (typeof arrowElement === 'string') {
    arrowElement = state.elements.popper.querySelector(arrowElement);

    if (!arrowElement) {
      return;
    }
  }

  if (!(0,_dom_utils_contains_js__WEBPACK_IMPORTED_MODULE_8__["default"])(state.elements.popper, arrowElement)) {
    return;
  }

  state.elements.arrow = arrowElement;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'arrow',
  enabled: true,
  phase: 'main',
  fn: arrow,
  effect: effect,
  requires: ['popperOffsets'],
  requiresIfExists: ['preventOverflow']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/computeStyles.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   mapToStyles: () => (/* binding */ mapToStyles)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getComputedStyle.js */ "./node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");







 // eslint-disable-next-line import/no-unused-modules

var unsetSides = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto'
}; // Round the offsets to the nearest suitable subpixel based on the DPR.
// Zooming can change the DPR, but it seems to report a value that will
// cleanly divide the values into the appropriate subpixels.

function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x,
      y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(x * dpr) / dpr || 0,
    y: (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_0__.round)(y * dpr) / dpr || 0
  };
}

function mapToStyles(_ref2) {
  var _Object$assign2;

  var popper = _ref2.popper,
      popperRect = _ref2.popperRect,
      placement = _ref2.placement,
      variation = _ref2.variation,
      offsets = _ref2.offsets,
      position = _ref2.position,
      gpuAcceleration = _ref2.gpuAcceleration,
      adaptive = _ref2.adaptive,
      roundOffsets = _ref2.roundOffsets,
      isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x,
      x = _offsets$x === void 0 ? 0 : _offsets$x,
      _offsets$y = offsets.y,
      y = _offsets$y === void 0 ? 0 : _offsets$y;

  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
    x: x,
    y: y
  }) : {
    x: x,
    y: y
  };

  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty('x');
  var hasY = offsets.hasOwnProperty('y');
  var sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.left;
  var sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;
  var win = window;

  if (adaptive) {
    var offsetParent = (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_2__["default"])(popper);
    var heightProp = 'clientHeight';
    var widthProp = 'clientWidth';

    if (offsetParent === (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) {
      offsetParent = (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(popper);

      if ((0,_dom_utils_getComputedStyle_js__WEBPACK_IMPORTED_MODULE_5__["default"])(offsetParent).position !== 'static' && position === 'absolute') {
        heightProp = 'scrollHeight';
        widthProp = 'scrollWidth';
      }
    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


    offsetParent = offsetParent;

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.right) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideY = _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
      offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }

    if (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.left || (placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.top || placement === _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom) && variation === _enums_js__WEBPACK_IMPORTED_MODULE_1__.end) {
      sideX = _enums_js__WEBPACK_IMPORTED_MODULE_1__.right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
      offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }

  var commonStyles = Object.assign({
    position: position
  }, adaptive && unsetSides);

  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x,
    y: y
  }, (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_3__["default"])(popper)) : {
    x: x,
    y: y
  };

  x = _ref4.x;
  y = _ref4.y;

  if (gpuAcceleration) {
    var _Object$assign;

    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }

  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
}

function computeStyles(_ref5) {
  var state = _ref5.state,
      options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration,
      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
      _options$adaptive = options.adaptive,
      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
      _options$roundOffsets = options.roundOffsets,
      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.placement),
    variation: (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_7__["default"])(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration: gpuAcceleration,
    isFixed: state.options.strategy === 'fixed'
  };

  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive: adaptive,
      roundOffsets: roundOffsets
    })));
  }

  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: 'absolute',
      adaptive: false,
      roundOffsets: roundOffsets
    })));
  }

  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-placement': state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'computeStyles',
  enabled: true,
  phase: 'beforeWrite',
  fn: computeStyles,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/eventListeners.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dom-utils/getWindow.js */ "./node_modules/@popperjs/core/lib/dom-utils/getWindow.js");
 // eslint-disable-next-line import/no-unused-modules

var passive = {
  passive: true
};

function effect(_ref) {
  var state = _ref.state,
      instance = _ref.instance,
      options = _ref.options;
  var _options$scroll = options.scroll,
      scroll = _options$scroll === void 0 ? true : _options$scroll,
      _options$resize = options.resize,
      resize = _options$resize === void 0 ? true : _options$resize;
  var window = (0,_dom_utils_getWindow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

  if (scroll) {
    scrollParents.forEach(function (scrollParent) {
      scrollParent.addEventListener('scroll', instance.update, passive);
    });
  }

  if (resize) {
    window.addEventListener('resize', instance.update, passive);
  }

  return function () {
    if (scroll) {
      scrollParents.forEach(function (scrollParent) {
        scrollParent.removeEventListener('scroll', instance.update, passive);
      });
    }

    if (resize) {
      window.removeEventListener('resize', instance.update, passive);
    }
  };
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'eventListeners',
  enabled: true,
  phase: 'write',
  fn: function fn() {},
  effect: effect,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/flip.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/flip.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getOppositePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getOppositeVariationPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/computeAutoPlacement.js */ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");






 // eslint-disable-next-line import/no-unused-modules

function getExpandedFallbackPlacements(placement) {
  if ((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto) {
    return [];
  }

  var oppositePlacement = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(placement);
  return [(0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement), oppositePlacement, (0,_utils_getOppositeVariationPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(oppositePlacement)];
}

function flip(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;

  if (state.modifiersData[name]._skip) {
    return;
  }

  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
      specifiedFallbackPlacements = options.fallbackPlacements,
      padding = options.padding,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      _options$flipVariatio = options.flipVariations,
      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
      allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [(0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
    return acc.concat((0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.auto ? (0,_utils_computeAutoPlacement_js__WEBPACK_IMPORTED_MODULE_4__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding,
      flipVariations: flipVariations,
      allowedAutoPlacements: allowedAutoPlacements
    }) : placement);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements[0];

  for (var i = 0; i < placements.length; i++) {
    var placement = placements[i];

    var _basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);

    var isStartVariation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_5__["default"])(placement) === _enums_js__WEBPACK_IMPORTED_MODULE_1__.start;
    var isVertical = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.top, _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? 'width' : 'height';
    var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      altBoundary: altBoundary,
      padding: padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.right : _enums_js__WEBPACK_IMPORTED_MODULE_1__.left : isStartVariation ? _enums_js__WEBPACK_IMPORTED_MODULE_1__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_1__.top;

    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    }

    var altVariationSide = (0,_utils_getOppositePlacement_js__WEBPACK_IMPORTED_MODULE_2__["default"])(mainVariationSide);
    var checks = [];

    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }

    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }

    if (checks.every(function (check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }

    checksMap.set(placement, checks);
  }

  if (makeFallbackChecks) {
    // `2` may be desired in some cases – research later
    var numberOfChecks = flipVariations ? 3 : 1;

    var _loop = function _loop(_i) {
      var fittingPlacement = placements.find(function (placement) {
        var checks = checksMap.get(placement);

        if (checks) {
          return checks.slice(0, _i).every(function (check) {
            return check;
          });
        }
      });

      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };

    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);

      if (_ret === "break") break;
    }
  }

  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requiresIfExists: ['offset'],
  data: {
    _skip: false
  }
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/hide.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/hide.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");



function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }

  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}

function isAnySideFullyClipped(overflow) {
  return [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom, _enums_js__WEBPACK_IMPORTED_MODULE_0__.left].some(function (side) {
    return overflow[side] >= 0;
  });
}

function hide(_ref) {
  var state = _ref.state,
      name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    elementContext: 'reference'
  });
  var popperAltOverflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets: referenceClippingOffsets,
    popperEscapeOffsets: popperEscapeOffsets,
    isReferenceHidden: isReferenceHidden,
    hasPopperEscaped: hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    'data-popper-reference-hidden': isReferenceHidden,
    'data-popper-escaped': hasPopperEscaped
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'hide',
  enabled: true,
  phase: 'main',
  requiresIfExists: ['preventOverflow'],
  fn: hide
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/index.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   arrow: () => (/* reexport safe */ _arrow_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   computeStyles: () => (/* reexport safe */ _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   flip: () => (/* reexport safe */ _flip_js__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   hide: () => (/* reexport safe */ _hide_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   offset: () => (/* reexport safe */ _offset_js__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__["default"])
/* harmony export */ });
/* harmony import */ var _applyStyles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _arrow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _eventListeners_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _flip_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _hide_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _offset_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _popperOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _preventOverflow_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");










/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/offset.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/offset.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   distanceAndSkiddingToXY: () => (/* binding */ distanceAndSkiddingToXY)
/* harmony export */ });
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");

 // eslint-disable-next-line import/no-unused-modules

function distanceAndSkiddingToXY(placement, rects, offset) {
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement);
  var invertDistance = [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.top].indexOf(basePlacement) >= 0 ? -1 : 1;

  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
    placement: placement
  })) : offset,
      skidding = _ref[0],
      distance = _ref[1];

  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [_enums_js__WEBPACK_IMPORTED_MODULE_1__.left, _enums_js__WEBPACK_IMPORTED_MODULE_1__.right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}

function offset(_ref2) {
  var state = _ref2.state,
      options = _ref2.options,
      name = _ref2.name;
  var _options$offset = options.offset,
      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = _enums_js__WEBPACK_IMPORTED_MODULE_1__.placements.reduce(function (acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement],
      x = _data$state$placement.x,
      y = _data$state$placement.y;

  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'offset',
  enabled: true,
  phase: 'main',
  requires: ['popperOffsets'],
  fn: offset
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js":
/*!********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");


function popperOffsets(_ref) {
  var state = _ref.state,
      name = _ref.name;
  // Offsets are the actual position the popper needs to have to be
  // properly positioned near its reference element
  // This is the most basic placement, and will be adjusted by
  // the modifiers in the next step
  state.modifiersData[name] = (0,_utils_computeOffsets_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: 'absolute',
    placement: state.placement
  });
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'popperOffsets',
  enabled: true,
  phase: 'read',
  fn: popperOffsets,
  data: {}
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/getAltAxis.js */ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js");
/* harmony import */ var _utils_within_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/within.js */ "./node_modules/@popperjs/core/lib/utils/within.js");
/* harmony import */ var _dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getLayoutRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js");
/* harmony import */ var _dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../dom-utils/getOffsetParent.js */ "./node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js");
/* harmony import */ var _utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");
/* harmony import */ var _utils_math_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");












function preventOverflow(_ref) {
  var state = _ref.state,
      options = _ref.options,
      name = _ref.name;
  var _options$mainAxis = options.mainAxis,
      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
      _options$altAxis = options.altAxis,
      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
      boundary = options.boundary,
      rootBoundary = options.rootBoundary,
      altBoundary = options.altBoundary,
      padding = options.padding,
      _options$tether = options.tether,
      tether = _options$tether === void 0 ? true : _options$tether,
      _options$tetherOffset = options.tetherOffset,
      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = (0,_utils_detectOverflow_js__WEBPACK_IMPORTED_MODULE_0__["default"])(state, {
    boundary: boundary,
    rootBoundary: rootBoundary,
    padding: padding,
    altBoundary: altBoundary
  });
  var basePlacement = (0,_utils_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_1__["default"])(state.placement);
  var variation = (0,_utils_getVariation_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = (0,_utils_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement);
  var altAxis = (0,_utils_getAltAxis_js__WEBPACK_IMPORTED_MODULE_4__["default"])(mainAxis);
  var popperOffsets = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };

  if (!popperOffsets) {
    return;
  }

  if (checkMainAxis) {
    var _offsetModifierState$;

    var mainSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;
    var altSide = mainAxis === 'y' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;
    var len = mainAxis === 'y' ? 'height' : 'width';
    var offset = popperOffsets[mainAxis];
    var min = offset + overflow[mainSide];
    var max = offset - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === _enums_js__WEBPACK_IMPORTED_MODULE_5__.start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
    // outside the reference bounds

    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? (0,_dom_utils_getLayoutRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : (0,_utils_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_7__["default"])();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
    // to include its full size in the calculation. If the reference is small
    // and near the edge of a boundary, the popper can overflow even if the
    // reference is not overflowing as well (e.g. virtual elements with no
    // width or height)

    var arrowLen = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && (0,_dom_utils_getOffsetParent_js__WEBPACK_IMPORTED_MODULE_9__["default"])(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset + maxOffset - offsetModifierValue;
    var preventedOffset = (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.min)(min, tetherMin) : min, offset, tether ? (0,_utils_math_js__WEBPACK_IMPORTED_MODULE_10__.max)(max, tetherMax) : max);
    popperOffsets[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset;
  }

  if (checkAltAxis) {
    var _offsetModifierState$2;

    var _mainSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.top : _enums_js__WEBPACK_IMPORTED_MODULE_5__.left;

    var _altSide = mainAxis === 'x' ? _enums_js__WEBPACK_IMPORTED_MODULE_5__.bottom : _enums_js__WEBPACK_IMPORTED_MODULE_5__.right;

    var _offset = popperOffsets[altAxis];

    var _len = altAxis === 'y' ? 'height' : 'width';

    var _min = _offset + overflow[_mainSide];

    var _max = _offset - overflow[_altSide];

    var isOriginSide = [_enums_js__WEBPACK_IMPORTED_MODULE_5__.top, _enums_js__WEBPACK_IMPORTED_MODULE_5__.left].indexOf(basePlacement) !== -1;

    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

    var _preventedOffset = tether && isOriginSide ? (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.withinMaxClamp)(_tetherMin, _offset, _tetherMax) : (0,_utils_within_js__WEBPACK_IMPORTED_MODULE_8__.within)(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

    popperOffsets[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }

  state.modifiersData[name] = data;
} // eslint-disable-next-line import/no-unused-modules


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requiresIfExists: ['offset']
});

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper-lite.js":
/*!********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper-lite.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");





var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_4__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/popper.js":
/*!***************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/popper.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   applyStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.applyStyles),
/* harmony export */   arrow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.arrow),
/* harmony export */   computeStyles: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.computeStyles),
/* harmony export */   createPopper: () => (/* binding */ createPopper),
/* harmony export */   createPopperLite: () => (/* reexport safe */ _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__.createPopper),
/* harmony export */   defaultModifiers: () => (/* binding */ defaultModifiers),
/* harmony export */   detectOverflow: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   eventListeners: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.eventListeners),
/* harmony export */   flip: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.flip),
/* harmony export */   hide: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.hide),
/* harmony export */   offset: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.offset),
/* harmony export */   popperGenerator: () => (/* reexport safe */ _createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator),
/* harmony export */   popperOffsets: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.popperOffsets),
/* harmony export */   preventOverflow: () => (/* reexport safe */ _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__.preventOverflow)
/* harmony export */ });
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/createPopper.js");
/* harmony import */ var _createPopper_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./createPopper.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modifiers/eventListeners.js */ "./node_modules/@popperjs/core/lib/modifiers/eventListeners.js");
/* harmony import */ var _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modifiers/popperOffsets.js */ "./node_modules/@popperjs/core/lib/modifiers/popperOffsets.js");
/* harmony import */ var _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modifiers/computeStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/computeStyles.js");
/* harmony import */ var _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./modifiers/applyStyles.js */ "./node_modules/@popperjs/core/lib/modifiers/applyStyles.js");
/* harmony import */ var _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./modifiers/offset.js */ "./node_modules/@popperjs/core/lib/modifiers/offset.js");
/* harmony import */ var _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./modifiers/flip.js */ "./node_modules/@popperjs/core/lib/modifiers/flip.js");
/* harmony import */ var _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./modifiers/preventOverflow.js */ "./node_modules/@popperjs/core/lib/modifiers/preventOverflow.js");
/* harmony import */ var _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./modifiers/arrow.js */ "./node_modules/@popperjs/core/lib/modifiers/arrow.js");
/* harmony import */ var _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./modifiers/hide.js */ "./node_modules/@popperjs/core/lib/modifiers/hide.js");
/* harmony import */ var _popper_lite_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./popper-lite.js */ "./node_modules/@popperjs/core/lib/popper-lite.js");
/* harmony import */ var _modifiers_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./modifiers/index.js */ "./node_modules/@popperjs/core/lib/modifiers/index.js");










var defaultModifiers = [_modifiers_eventListeners_js__WEBPACK_IMPORTED_MODULE_0__["default"], _modifiers_popperOffsets_js__WEBPACK_IMPORTED_MODULE_1__["default"], _modifiers_computeStyles_js__WEBPACK_IMPORTED_MODULE_2__["default"], _modifiers_applyStyles_js__WEBPACK_IMPORTED_MODULE_3__["default"], _modifiers_offset_js__WEBPACK_IMPORTED_MODULE_4__["default"], _modifiers_flip_js__WEBPACK_IMPORTED_MODULE_5__["default"], _modifiers_preventOverflow_js__WEBPACK_IMPORTED_MODULE_6__["default"], _modifiers_arrow_js__WEBPACK_IMPORTED_MODULE_7__["default"], _modifiers_hide_js__WEBPACK_IMPORTED_MODULE_8__["default"]];
var createPopper = /*#__PURE__*/(0,_createPopper_js__WEBPACK_IMPORTED_MODULE_9__.popperGenerator)({
  defaultModifiers: defaultModifiers
}); // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules

 // eslint-disable-next-line import/no-unused-modules



/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeAutoPlacement)
/* harmony export */ });
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detectOverflow.js */ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js");
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");




function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      placement = _options.placement,
      boundary = _options.boundary,
      rootBoundary = _options.rootBoundary,
      padding = _options.padding,
      flipVariations = _options.flipVariations,
      _options$allowedAutoP = _options.allowedAutoPlacements,
      allowedAutoPlacements = _options$allowedAutoP === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.placements : _options$allowedAutoP;
  var variation = (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement);
  var placements = variation ? flipVariations ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements : _enums_js__WEBPACK_IMPORTED_MODULE_0__.variationPlacements.filter(function (placement) {
    return (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) === variation;
  }) : _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements;
  var allowedPlacements = placements.filter(function (placement) {
    return allowedAutoPlacements.indexOf(placement) >= 0;
  });

  if (allowedPlacements.length === 0) {
    allowedPlacements = placements;
  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


  var overflows = allowedPlacements.reduce(function (acc, placement) {
    acc[placement] = (0,_detectOverflow_js__WEBPACK_IMPORTED_MODULE_2__["default"])(state, {
      placement: placement,
      boundary: boundary,
      rootBoundary: rootBoundary,
      padding: padding
    })[(0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(placement)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function (a, b) {
    return overflows[a] - overflows[b];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/computeOffsets.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ computeOffsets)
/* harmony export */ });
/* harmony import */ var _getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getBasePlacement.js */ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js");
/* harmony import */ var _getVariation_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getVariation.js */ "./node_modules/@popperjs/core/lib/utils/getVariation.js");
/* harmony import */ var _getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getMainAxisFromPlacement.js */ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");




function computeOffsets(_ref) {
  var reference = _ref.reference,
      element = _ref.element,
      placement = _ref.placement;
  var basePlacement = placement ? (0,_getBasePlacement_js__WEBPACK_IMPORTED_MODULE_0__["default"])(placement) : null;
  var variation = placement ? (0,_getVariation_js__WEBPACK_IMPORTED_MODULE_1__["default"])(placement) : null;
  var commonX = reference.x + reference.width / 2 - element.width / 2;
  var commonY = reference.y + reference.height / 2 - element.height / 2;
  var offsets;

  switch (basePlacement) {
    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.top:
      offsets = {
        x: commonX,
        y: reference.y - element.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.bottom:
      offsets = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.right:
      offsets = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;

    case _enums_js__WEBPACK_IMPORTED_MODULE_2__.left:
      offsets = {
        x: reference.x - element.width,
        y: commonY
      };
      break;

    default:
      offsets = {
        x: reference.x,
        y: reference.y
      };
  }

  var mainAxis = basePlacement ? (0,_getMainAxisFromPlacement_js__WEBPACK_IMPORTED_MODULE_3__["default"])(basePlacement) : null;

  if (mainAxis != null) {
    var len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.start:
        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
        break;

      case _enums_js__WEBPACK_IMPORTED_MODULE_2__.end:
        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
        break;

      default:
    }
  }

  return offsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/debounce.js":
/*!***********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/debounce.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ debounce)
/* harmony export */ });
function debounce(fn) {
  var pending;
  return function () {
    if (!pending) {
      pending = new Promise(function (resolve) {
        Promise.resolve().then(function () {
          pending = undefined;
          resolve(fn());
        });
      });
    }

    return pending;
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/detectOverflow.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/detectOverflow.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ detectOverflow)
/* harmony export */ });
/* harmony import */ var _dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../dom-utils/getClippingRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js");
/* harmony import */ var _dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../dom-utils/getDocumentElement.js */ "./node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js");
/* harmony import */ var _dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../dom-utils/getBoundingClientRect.js */ "./node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js");
/* harmony import */ var _computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./computeOffsets.js */ "./node_modules/@popperjs/core/lib/utils/computeOffsets.js");
/* harmony import */ var _rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./rectToClientRect.js */ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js");
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
/* harmony import */ var _dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../dom-utils/instanceOf.js */ "./node_modules/@popperjs/core/lib/dom-utils/instanceOf.js");
/* harmony import */ var _mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mergePaddingObject.js */ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js");
/* harmony import */ var _expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expandToHashMap.js */ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js");








 // eslint-disable-next-line import/no-unused-modules

function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }

  var _options = options,
      _options$placement = _options.placement,
      placement = _options$placement === void 0 ? state.placement : _options$placement,
      _options$strategy = _options.strategy,
      strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
      _options$boundary = _options.boundary,
      boundary = _options$boundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.clippingParents : _options$boundary,
      _options$rootBoundary = _options.rootBoundary,
      rootBoundary = _options$rootBoundary === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.viewport : _options$rootBoundary,
      _options$elementConte = _options.elementContext,
      elementContext = _options$elementConte === void 0 ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper : _options$elementConte,
      _options$altBoundary = _options.altBoundary,
      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
      _options$padding = _options.padding,
      padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = (0,_mergePaddingObject_js__WEBPACK_IMPORTED_MODULE_1__["default"])(typeof padding !== 'number' ? padding : (0,_expandToHashMap_js__WEBPACK_IMPORTED_MODULE_2__["default"])(padding, _enums_js__WEBPACK_IMPORTED_MODULE_0__.basePlacements));
  var altContext = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? _enums_js__WEBPACK_IMPORTED_MODULE_0__.reference : _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = (0,_dom_utils_getClippingRect_js__WEBPACK_IMPORTED_MODULE_3__["default"])((0,_dom_utils_instanceOf_js__WEBPACK_IMPORTED_MODULE_4__.isElement)(element) ? element : element.contextElement || (0,_dom_utils_getDocumentElement_js__WEBPACK_IMPORTED_MODULE_5__["default"])(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = (0,_dom_utils_getBoundingClientRect_js__WEBPACK_IMPORTED_MODULE_6__["default"])(state.elements.reference);
  var popperOffsets = (0,_computeOffsets_js__WEBPACK_IMPORTED_MODULE_7__["default"])({
    reference: referenceClientRect,
    element: popperRect,
    strategy: 'absolute',
    placement: placement
  });
  var popperClientRect = (0,_rectToClientRect_js__WEBPACK_IMPORTED_MODULE_8__["default"])(Object.assign({}, popperRect, popperOffsets));
  var elementClientRect = elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
  // 0 or negative = within the clipping rect

  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

  if (elementContext === _enums_js__WEBPACK_IMPORTED_MODULE_0__.popper && offsetData) {
    var offset = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function (key) {
      var multiply = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.right, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [_enums_js__WEBPACK_IMPORTED_MODULE_0__.top, _enums_js__WEBPACK_IMPORTED_MODULE_0__.bottom].indexOf(key) >= 0 ? 'y' : 'x';
      overflowOffsets[key] += offset[axis] * multiply;
    });
  }

  return overflowOffsets;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/expandToHashMap.js":
/*!******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/expandToHashMap.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ expandToHashMap)
/* harmony export */ });
function expandToHashMap(value, keys) {
  return keys.reduce(function (hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getAltAxis.js":
/*!*************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getAltAxis.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getAltAxis)
/* harmony export */ });
function getAltAxis(axis) {
  return axis === 'x' ? 'y' : 'x';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getBasePlacement.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getBasePlacement.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getBasePlacement)
/* harmony export */ });

function getBasePlacement(placement) {
  return placement.split('-')[0];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getFreshSideObject)
/* harmony export */ });
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getMainAxisFromPlacement)
/* harmony export */ });
function getMainAxisFromPlacement(placement) {
  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositePlacement.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositePlacement)
/* harmony export */ });
var hash = {
  left: 'right',
  right: 'left',
  bottom: 'top',
  top: 'bottom'
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getOppositeVariationPlacement)
/* harmony export */ });
var hash = {
  start: 'end',
  end: 'start'
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function (matched) {
    return hash[matched];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/getVariation.js":
/*!***************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/getVariation.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getVariation)
/* harmony export */ });
function getVariation(placement) {
  return placement.split('-')[1];
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/math.js":
/*!*******************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/math.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   max: () => (/* binding */ max),
/* harmony export */   min: () => (/* binding */ min),
/* harmony export */   round: () => (/* binding */ round)
/* harmony export */ });
var max = Math.max;
var min = Math.min;
var round = Math.round;

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergeByName.js":
/*!**************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergeByName.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergeByName)
/* harmony export */ });
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function (merged, current) {
    var existing = merged[current.name];
    merged[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged;
  }, {}); // IE11 does not support Object.values

  return Object.keys(merged).map(function (key) {
    return merged[key];
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/mergePaddingObject.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ mergePaddingObject)
/* harmony export */ });
/* harmony import */ var _getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getFreshSideObject.js */ "./node_modules/@popperjs/core/lib/utils/getFreshSideObject.js");

function mergePaddingObject(paddingObject) {
  return Object.assign({}, (0,_getFreshSideObject_js__WEBPACK_IMPORTED_MODULE_0__["default"])(), paddingObject);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/orderModifiers.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/orderModifiers.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ orderModifiers)
/* harmony export */ });
/* harmony import */ var _enums_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../enums.js */ "./node_modules/@popperjs/core/lib/enums.js");
 // source: https://stackoverflow.com/questions/49875255

function order(modifiers) {
  var map = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function (modifier) {
    map.set(modifier.name, modifier);
  }); // On visiting object, check for its dependencies and visit them recursively

  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function (dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);

        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }

  modifiers.forEach(function (modifier) {
    if (!visited.has(modifier.name)) {
      // check for visited object
      sort(modifier);
    }
  });
  return result;
}

function orderModifiers(modifiers) {
  // order based on dependencies
  var orderedModifiers = order(modifiers); // order based on phase

  return _enums_js__WEBPACK_IMPORTED_MODULE_0__.modifierPhases.reduce(function (acc, phase) {
    return acc.concat(orderedModifiers.filter(function (modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/rectToClientRect.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/rectToClientRect.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ rectToClientRect)
/* harmony export */ });
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/userAgent.js":
/*!************************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/userAgent.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUAString)
/* harmony export */ });
function getUAString() {
  var uaData = navigator.userAgentData;

  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function (item) {
      return item.brand + "/" + item.version;
    }).join(' ');
  }

  return navigator.userAgent;
}

/***/ }),

/***/ "./node_modules/@popperjs/core/lib/utils/within.js":
/*!*********************************************************!*\
  !*** ./node_modules/@popperjs/core/lib/utils/within.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   within: () => (/* binding */ within),
/* harmony export */   withinMaxClamp: () => (/* binding */ withinMaxClamp)
/* harmony export */ });
/* harmony import */ var _math_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./math.js */ "./node_modules/@popperjs/core/lib/utils/math.js");

function within(min, value, max) {
  return (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.max)(min, (0,_math_js__WEBPACK_IMPORTED_MODULE_0__.min)(value, max));
}
function withinMaxClamp(min, value, max) {
  var v = within(min, value, max);
  return v > max ? max : v;
}

/***/ }),

/***/ "./node_modules/@riotjs/hot-reload/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@riotjs/hot-reload/index.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports, __webpack_require__(/*! riot */ "./node_modules/riot/riot.esm.js"), __webpack_require__(/*! bianco.query */ "./node_modules/bianco.query/index.next.js")) :
  0;
})(this, (function (exports, riot, $) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  const { cssManager } = riot.__;
  const { DOM_COMPONENT_INSTANCE_PROPERTY } = riot.__.globals;

  function reload(componentAPI) {
    const {name} = componentAPI;

    if (!name) {
      console.warn('Anonymous components can not be reloaded'); // eslint-disable-line
      return []
    }

    return $__default["default"](`${name}, [is=${name}]`).map(el => {
      const oldTag = el[DOM_COMPONENT_INSTANCE_PROPERTY];

      // early return in case there is no riot instance found
      if (!oldTag) return

      // remove the tag template from the DOM
      oldTag.unmount(true);
      // delete the old css from the css manager
      cssManager.remove(name);

      // create the new tag
      const newTag = riot.component(componentAPI)(el, oldTag.props);
      newTag.update(oldTag.state);

      return newTag
    })
  }

  exports["default"] = reload;
  exports.reload = reload;

  Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ }),

/***/ "./node_modules/@riotjs/observable/dist/observable.js":
/*!************************************************************!*\
  !*** ./node_modules/@riotjs/observable/dist/observable.js ***!
  \************************************************************/
/***/ ((module) => {

;(function(window, undefined) {const ALL_CALLBACKS = '*'
const define = Object.defineProperties
const entries = Object.entries

const on = (callbacks, el) => (event, fn) => {
  if (callbacks.has(event)) {
    callbacks.get(event).add(fn)
  } else {
    callbacks.set(event, new Set().add(fn))
  }

  return el
}

const deleteCallback = (callbacks, el, event,  fn) => {
  if (fn) {
    const fns = callbacks.get(event)

    if (fns) {
      fns.delete(fn)
      if (fns.size === 0) callbacks.delete(event)
    }
  } else callbacks.delete(event)
}

const off = (callbacks, el) => (event, fn) => {
  if (event === ALL_CALLBACKS && !fn) {
    callbacks.clear()
  } else {
    deleteCallback(callbacks, el, event, fn)
  }

  return el
}

const one = (callbacks, el) => (event, fn) => {
  function on(...args) {
    el.off(event, on)
    fn.apply(el, args)
  }
  return el.on(event, on)
}

const trigger = (callbacks, el) => (event, ...args) => {
  const fns = callbacks.get(event)

  if (fns) fns.forEach(fn => fn.apply(el, args))

  if (callbacks.get(ALL_CALLBACKS) && event !== ALL_CALLBACKS) {
    el.trigger(ALL_CALLBACKS, event, ...args)
  }

  return el
}

const observable = function(el) { // eslint-disable-line
  const callbacks = new Map()
  const methods = {on, off, one, trigger}

  el = el || {}

  define(el,
    entries(methods).reduce((acc, [key, method]) => {
      acc[key] = {
        value: method(callbacks, el),
        enumerable: false,
        writable: false,
        configurable: false
      }

      return acc
    }, {})
  )

  return el
}
  /* istanbul ignore next */
  // support CommonJS, AMD & browser
  if (true)
    module.exports = observable
  else {}

})(typeof window != 'undefined' ? window : undefined);

/***/ }),

/***/ "./src/view/app-main.riot":
/*!********************************!*\
  !*** ./src/view/app-main.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @riotjs/hot-reload */ "./node_modules/@riotjs/hot-reload/index.js");
/* harmony import */ var _riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var riot__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! riot */ "./node_modules/riot/riot.esm.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _navbar_riot__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navbar.riot */ "./src/view/navbar.riot");
/* harmony import */ var _dotmaker_riot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dotmaker.riot */ "./src/view/dotmaker.riot");
/* harmony import */ var _dashbord_riot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dashbord.riot */ "./src/view/dashbord.riot");
/* harmony import */ var _timeconf_riot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./timeconf.riot */ "./src/view/timeconf.riot");
/* harmony import */ var _dispconf_riot__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dispconf.riot */ "./src/view/dispconf.riot");
/* harmony import */ var _wificonf_riot__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./wificonf.riot */ "./src/view/wificonf.riot");
/* harmony import */ var _settings_riot__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./settings.riot */ "./src/view/settings.riot");
/* harmony import */ var _deviceconf_riot__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./deviceconf.riot */ "./src/view/deviceconf.riot");
/* harmony import */ var _my_tag_riot__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./my-tag.riot */ "./src/view/my-tag.riot");
/* harmony import */ var _footer_riot__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./footer.riot */ "./src/view/footer.riot");














/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: `appmain .container-fluid,[is="appmain"] .container-fluid{ width: 100%; } appmain .tab-pane,[is="appmain"] .tab-pane{ margin-top: 10px; }`,

  exports: {
    onBeforeMount(props, state){
      let vmUI = props.vmUI;
      let obs = props.obs;

      console.log("appmain.onBeforeMount")
      console.log(props)

      this.dashbord = "-Dashbord"
      this.setLanguage(0);
      this.language = "test"

      this.changeTab = (item,e) =>{
        console.log("changeTab:" + item);
        vmUI.submitChangeTab(item);
        obs.trigger('changeTab',item);
      }
//        this.setLanguage();
    },

    onMounted(props, state){
      let vmUI = props.vmUI;
      let dotMatrixUI = props.dotMatrixUI;
      let obs = props.obs;

      let _this = this
      console.log("onMounted")
      console.log(this)

      obs.on('changeLanguage',function(code){
        this.language = code;
        console.log("changeLanguage:"+code)
            
        //  _this.setLanguage(code);  // .bind(this)しない場合は_this でthisにアクセスする
                                        // ここのthisはイベント発生元のthis
        this.setLanguage(code);
        this.update();
      }.bind(this))

      ;(0,riot__WEBPACK_IMPORTED_MODULE_12__.component)(_navbar_riot__WEBPACK_IMPORTED_MODULE_2__["default"])(document.getElementById('navigation'), {vmUI,obs})
//        component(dotmaker)(document.getElementById('dotmaker'), {vmUI,obs})
      ;(0,riot__WEBPACK_IMPORTED_MODULE_12__.component)(_dotmaker_riot__WEBPACK_IMPORTED_MODULE_3__["default"])(document.getElementById('dotmaker'), {vmUI,dotMatrixUI,obs})
//        component(dashbord)(document.getElementById('dashbord'), {vmUI,obs})
//        component(timeconf)(document.getElementById('timeconf'), {vmUI,obs})
//        component(dispconf)(document.getElementById('dispconf'), {vmUI,obs})
      ;(0,riot__WEBPACK_IMPORTED_MODULE_12__.component)(_settings_riot__WEBPACK_IMPORTED_MODULE_8__["default"])(document.getElementById('settings'), {vmUI,dotMatrixUI,obs})
      ;(0,riot__WEBPACK_IMPORTED_MODULE_12__.component)(_deviceconf_riot__WEBPACK_IMPORTED_MODULE_9__["default"])(document.getElementById('deviceconf'), {vmUI,obs})
//        component(mytag)(document.getElementById('mytag'), {vmUI,obs})
      ;(0,riot__WEBPACK_IMPORTED_MODULE_12__.component)(_footer_riot__WEBPACK_IMPORTED_MODULE_11__["default"])(document.getElementById('Footer'), {vmUI,obs})

      // タブ切替処理
      document.addEventListener("DOMContentLoaded", function() {
        const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
        tabs.forEach(tab => {
          tab.addEventListener("click", function(event) {
            event.preventDefault();
            const target = document.querySelector(tab.getAttribute("data-bs-target"));
            if (!target.classList.contains("show")) {
              const activeTab = document.querySelector(".tab-pane.show.active");
              if (activeTab) {
                activeTab.classList.remove("show", "active");
                target.classList.add("show", "active");
              }
            }
          });
        });
      });

      vmUI.submitChangeTab("dashbord");
    },

    setLanguage(code){
      console.log("setLanguage")
      this.dashbordKey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('main.dashbord')
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<div id="navigation"></div><div><ul class="nav nav-tabs" id="myTabs" role="tablist"><li class="nav-item" role="presentation"><button class="nav-link" id="tab1-tab" data-bs-toggle="tab" data-bs-target="#tab1" type="button" role="tab" aria-controls="tab1" aria-selected="true">ドット絵作製</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="tab5-tab" data-bs-toggle="tab" data-bs-target="#tab5" type="button" role="tab" aria-controls="tab5" aria-selected="false">設定</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="tab6-tab" data-bs-toggle="tab" data-bs-target="#tab6" type="button" role="tab" aria-controls="tab6" aria-selected="false">DeviceConf</button></li></ul></div><div class="container-fluid py-1"><div class="tab-content mt-3" id="myTabContent"><div class="tab-pane fade show active" id="tab1" role="tabpanel" aria-labelledby="tab1-tab"><div id="dotmaker"></div></div><div class="tab-pane fade" id="tab5" role="tabpanel" aria-labelledby="tab5-tab"><div id="settings"></div></div><div class="tab-pane fade" id="tab6" role="tabpanel" aria-labelledby="tab6-tab"><div id="deviceconf"></div></div></div></div><div style="height: 60px;"></div><div id="Footer"></div>',
    []
  ),

  name: 'appmain'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/dashbord.riot":
/*!********************************!*\
  !*** ./src/view/dashbord.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_resize_observer_polyfill_dist_ResizeObserver_global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/resize-observer-polyfill/dist/ResizeObserver.global.js */ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.global.js");
/* harmony import */ var _node_modules_resize_observer_polyfill_dist_ResizeObserver_global_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_resize_observer_polyfill_dist_ResizeObserver_global_js__WEBPACK_IMPORTED_MODULE_0__);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state) {
    // 初期化
      let vmUI = props.vmUI;

      // -- センサー情報取得コールバック設定 --
      vmUI.setSensorDataCallback(this.getSensorData.bind(this));
      // -- DashBord EventLog 更新コールバック設定 --
      vmUI.updateDashBordEventLogCallback(this.setEventLog.bind(this));

      // -- ネットワーク情報取得 --
      this.stamodeSsid = vmUI.getNetworkSetting("stamodeSSID");
      this.stamodeIp = vmUI.getNetworkSetting("stamodeIP");
      this.apmodeSsid = vmUI.getNetworkSetting("atmodeSSID");
      this.apmodeIp = vmUI.getNetworkSetting("atmodeIP");

      // -- センサ表示フォーマットデータ取得 --
      this.sensorList = vmUI.getSensorFormat();
      //this.sensorList = vmUI.model.sensorList;  //setting.js出作成する。

    },

    onMounted(props, state){
      let vmUI = props.vmUI;

      console.log("-- logArea Init --");
      const logArea = document.getElementById("logAll");
      const logMessage = "ログメッセージ"; // ログに表示するメッセージ
      // ログ領域に新しいログメッセージを追加
      logArea.innerHTML += logMessage + "<br>";
      console.log(logArea.innerHTML);
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;

      this.graphData = {
//        labels: [1,2,3],  // X軸のデータ (時間)
        labels: [],  // X軸のデータ (時間)
        datasets: [{
              label: "Temp",
//              data: [1,2,3], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgba(254,97,132,0.8)",
              backgroundColor : "rgba(254,97,132,0.5)",
        },
        {
              label: "Humidity",
//              data: [4,5,6], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgba(0,0,254,0.8)",
              backgroundColor : "rgba(0,0,254,0.5)",
        }]
      };
      this.graphOptions = {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {beginAtZero:true}
          }]
        }
      };

      this.chart = new Chart(
        document.getElementById('sensorChart'),
        {
          type: 'line',
          data: this.graphData,
          options: this.graphOptions
        }
      );

      // DCDC Graph
      this.dcdcGraphData = {
//        labels: [1,2,3],  // X軸のデータ (時間)
        labels: [],  // X軸のデータ (時間)
        datasets: [{
              label: "DCDC Fdb",
//              data: [1,2,3], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgba(0, 128, 128)",     // ティール (Teal)
              backgroundColor : "rgb(0, 128, 128, 0.2)",
        },
        {
              label: "DCDC Trg",
//              data: [4,5,6], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgba(244, 164, 96)",    // サンド (Sand)
              backgroundColor : "rgb(244, 164, 96, 0.2)",
        },
        {
              label: "ilumi1",
//              data: [7,8,9], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgba(112, 128, 144)",   // スレートグレー (Slate Gray)
              backgroundColor : "rgb(112, 128, 144, 0.2)",
        },
        {
              label: "ilumi2",
//              data: [10,11,12], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgb(128, 128, 0)",           // オリーブ (Olive)
              backgroundColor : "rgba(128, 128, 0, 0.2)",
        },
        {
              label: "ilumi3",
//              data: [13,14,15], // Y軸のデータ(センシング結果)
              data: [], // Y軸のデータ(センシング結果)
              fill: false,
              borderColor : "rgb(128, 0, 0)",    // マルーン (Maroon)
              backgroundColor : "rgba(128, 0, 0, 0.2)",
/*        },
        {
          borderColor : "rgb(0, 255, 255)",    // アクア (Aqua)
          backgroundColor : "rgba(0, 255, 255, 0.2)",
        },
        {
          borderColor : "rgb(224, 176, 255)",    // モーブ (Mauve)
          backgroundColor : "rgba(224, 176, 255, 0.2)",
        },
        {
          borderColor : "rgb(255, 127, 80)",    // コーラル (Coral)
          backgroundColor : "rgba(255, 127, 80, 0.2)",
        },
        {
          borderColor : "rgb(50, 205, 50)",    // ライム (Lime)
          backgroundColor : "rgba(50, 205, 50, 0.2)",
        },
        {
          borderColor : "rgb(192, 192, 192)",    // シルバー (Silver)
          backgroundColor : "rgba(192, 192, 192, 0.2)",
*/
        }]
      };
      this.dcdcGraphOptions = {
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {beginAtZero:true}
          }]
        }
      };

      this.dcdcChart = new Chart(
        document.getElementById('dcdcChart'),
        {
          type: 'line',
          data: this.dcdcGraphData,
          options: this.dcdcGraphOptions
        }
      );

      // -- センサデータ --
      console.log("-- センサデータ --");

      for(let i=0; i<6; i++){
        document.getElementById(this.sensorList[i].data).innerHTML =  (i+2) * (10**this.sensorList[i].index);
      }
      
    },

    // WiFi EventLog 取得・表示
    setEventLog(logMessage){
      console.log("-- setEventLog");
      console.log(logMessage);
      const logArea = document.getElementById("logAll");
      // ログ領域にログメッセージを設定
      logArea.innerHTML = logMessage;
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;
    },

    getSensorData(sensorData){
//        console.log("-- dashbord.tag.getSensorData --");
//        console.log(sensorData);
      let chartdat = [];
        
      for(let i=0; i<this.sensorList.length ; i++){
        let data = sensorData.sensor[i].data * (10**this.sensorList[i].index);
        document.getElementById(this.sensorList[i].data).innerHTML =  data.toPrecision(this.sensorList[i].toPrecision);
        chartdat[i] = data.toPrecision(this.sensorList[i].toPrecision);
      }

      let Time = new Date().toLocaleTimeString();
      this.graphData.labels.push(Time);
      this.graphData.datasets[0].data.push(chartdat[0]);
      this.graphData.datasets[1].data.push(chartdat[1]);
      if(this.graphData.labels.length > 100){
        this.graphData.labels.shift();
        this.graphData.datasets[0].data.shift();
        this.graphData.datasets[1].data.shift();
      }
      this.chart.update();

      this.dcdcGraphData.labels.push(Time);
      this.dcdcGraphData.datasets[0].data.push(chartdat[4]);
      this.dcdcGraphData.datasets[1].data.push(chartdat[5]);
      this.dcdcGraphData.datasets[2].data.push(chartdat[3]);
      this.dcdcGraphData.datasets[3].data.push(chartdat[6]);
      this.dcdcGraphData.datasets[4].data.push(chartdat[7]);
      if(this.dcdcGraphData.labels.length > 100){
        this.dcdcGraphData.labels.shift();
        this.dcdcGraphData.datasets[0].data.shift();
        this.dcdcGraphData.datasets[1].data.shift();
        this.dcdcGraphData.datasets[2].data.shift();
        this.dcdcGraphData.datasets[3].data.shift();
        this.dcdcGraphData.datasets[4].data.shift();
      }
      this.dcdcChart.update();

    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>Dash Bord</h1><div class="card"><div class="card-header">\r\n\t\t\tGraph\r\n\t\t</div><div class="card-body"><h5 class="card-title">Chart</h5><p class="card-text"><div style="width: 100%;"><canvas id="sensorChart"></canvas></div><div style="width: 100%;"><canvas id="dcdcChart"></canvas></div></p></div></div><div class="row"><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\tネットワーク接続設定\r\n\t\t\t</div><div class="card-body"><h5 class="card-title">Current Settings</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><table class="table"><tr><td>STAモード SSID</td><td expr2="expr2"> </td></tr><tr><td>STAモード IP Adress</td><td expr3="expr3"> </td></tr><tr><td>APモード SSID</td><td expr4="expr4"> </td></tr><tr><td>APモード IP Adress</td><td expr5="expr5"> </td></tr></table></div></p></div></div></div><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\tWiFi Station 設定\r\n\t\t\t</div><div class="card-body"><h2 class="card-title">センサ情報</h2><div class="col-sm-9 offset-sm-1"><table class="table"><tr expr6="expr6"></tr></table></div></div></div></div><div class="col-md-12"><div class="card h-100"><div class="card-header">\r\n      Log message\r\n    </div><div class="card-body"><div id="logAll" style="overflow-y: scroll; height: 200px; border: 1px solid #ccc;padding: 10px;"></div></div></div></div><div class="col-md-12"><div class="card h-100"><div class="card-header"></div><div class="card-body"><h2 class="card-title">センサ情報</h2><div class="col-1"></div><div class="col-7"><div id="sensorDataTable"></div></div><div class="col-7"></div><a href="./setting.js">setting.js</a><br/><a href="./_setting.js">_setting.js</a><br/><a href="./setting.json">setting.json</a><br/></div></div></div></div>',
    [
      {
        redundantAttribute: 'expr2',
        selector: '[expr2]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.stamodeSsid
          }
        ]
      },
      {
        redundantAttribute: 'expr3',
        selector: '[expr3]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.stamodeIp
          }
        ]
      },
      {
        redundantAttribute: 'expr4',
        selector: '[expr4]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.apmodeSsid
          }
        ]
      },
      {
        redundantAttribute: 'expr5',
        selector: '[expr5]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.apmodeIp
          }
        ]
      },
      {
        type: bindingTypes.EACH,
        getKey: null,
        condition: null,

        template: template(
          '<td expr7="expr7"> </td><td expr8="expr8"></td>',
          [
            {
              redundantAttribute: 'expr7',
              selector: '[expr7]',

              expressions: [
                {
                  type: expressionTypes.TEXT,
                  childNodeIndex: 0,
                  evaluate: _scope => _scope.senser.name
                }
              ]
            },
            {
              redundantAttribute: 'expr8',
              selector: '[expr8]',

              expressions: [
                {
                  type: expressionTypes.ATTRIBUTE,
                  name: 'id',
                  evaluate: _scope => _scope.senser.data
                }
              ]
            }
          ]
        ),

        redundantAttribute: 'expr6',
        selector: '[expr6]',
        itemName: 'senser',
        indexName: null,
        evaluate: _scope => _scope.sensorList
      }
    ]
  ),

  name: 'dashbord'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/deviceconf.riot":
/*!**********************************!*\
  !*** ./src/view/deviceconf.riot ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state) {
      console.log("deviceconf.riot");
      // 初期化
      let vmUI = props.vmUI;

      this.setLanguage("en");


      this.systemConrtolePermissionCheck ="";   // システム設定操作許可トグルスイッチ初期値設定

      // システム設定操作許可トグルスイッチ操作
      this.systemConrtolePermissionToggle = (e) => {
        this.systemConrtolePermissionCheck = !this.systemConrtolePermissionCheck
        this.update()
      }


    },

    onMounted(props, state){
      let obs = props.obs;

      // IR Sensor ラジオボタン設定
      // irTextの個数ラジオボタンを作成する。
      const irHead = ["#","First","IR Data"];
      // inputの内容、IRDataを含んだオブジェクトに拡張する。起動時にデータを受け取る。
      // IRData,labelはwebsocketで送られてきたデータに更新する。
      let irDataObj = [
        {name:"Mode",label:"Test-1",IRData:"Data-1"},
        {name:"Set",label:"Test-2",IRData:"Data-2"},
        {name:"Clear",label:"Test-3",IRData:"Data-3"},
        {name:"Reset",label:"Test-4",IRData:"Data-4"}
      ];
      const irSet = document.getElementById("irSetRadioButton");
      const irTableMake = document.createElement("table");
      irTableMake.classname = "table";

      // table header 作成
      const irTableThead = document.createElement("thead");
      const TheadTr = document.createElement("tr");
      let num = irHead.length;
      for(let i=0;i<num;i++){
        const TheadTh = document.createElement("th");
        TheadTh.scope = "col";
        TheadTh.innerHTML = irHead[i];
        TheadTr.appendChild(TheadTh);
      }
      irTableThead.appendChild(TheadTr);
      irTableMake.appendChild(irTableThead);

      // Table本体作成
      const newtbody = document.createElement("tbody");
      num = irDataObj.length;
      for(let i=0;i<num;i++){
        const newTr = document.createElement("tr");
        const newTd1 = document.createElement("td");
        const newTd2 = document.createElement("td");
        const newTd3 = document.createElement("td");
        // ラジオボタン
        const newDiv = document.createElement("div");
        newDiv.className = "form-check";
        const newRadio = document.createElement("input");
        newRadio.className = "form-check-input";
        newRadio.type = "radio";
        newRadio.name = "irSetRadioDefault";
        newRadio.id = "irSetButton" + i;
        newRadio.value = "irSetButton" + i;

        //ラジオボタンラベル
        const newLabel = document.createElement("label");
        newLabel.innerHTML = irDataObj[i].name;
        newLabel.htmlFor = newRadio.id;

        newDiv.appendChild(newRadio);
        newDiv.appendChild(newLabel);
        newTd1.appendChild(newDiv);

        // input
        const newInput = document.createElement("input");
        newInput.type = "text";
        newInput.value = irDataObj[i].label;
        newTd2.appendChild(newInput);

        // 登録IRデータ表示
        const newIrData = document.createElement("label");
        newIrData.innerHTML = irDataObj[i].IRData;

        newTd3.appendChild(newIrData);

        // テーブルデータ構成
        newTr.appendChild(newTd1);
        newTr.appendChild(newTd2);
        newTr.appendChild(newTd3);
        newtbody.appendChild(newTr);

      }
      irTableMake.appendChild(newtbody);
      irSet.appendChild(irTableMake);

      // 言語切り替え
      obs.on('changeLanguage',function(code){
        this.language = code;
        console.log("deviceconf.riot:changeLanguage:"+code)
            
        //  _this.setLanguage(code);  // .bind(this)しない場合は_this でthisにアクセスする
                                        // ここのthisはイベント発生元のthis
        this.setLanguage(code);
        this.update();
      }.bind(this))
    	},

    // 言語設定
    setLanguage(code){
      console.log("setLanguage")
      this.tTimeconf_NtpUse_check = "操作許可";
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>デバイス設定</h1><div class="row"><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\tシステム設定\r\n\t\t</div><div class="card-body"><p class="card-text"><div class="col-sm-11 offset-sm-1"><div expr50="expr50" class="form-check form-switch"><input expr51="expr51" class="form-check-input" type="checkbox" type="checkbox"/> </div><div></div><table class="table"><tr><td class="itemname-width">WiFi切断</td><td><div><button expr52="expr52" class="btn btn-outline-primary btn-sm" value="Setting">Execute Action</button></div></td></tr><tr><td class="itemname-width">再起動</td><td><div><button expr53="expr53" class="btn btn-outline-primary btn-sm" value="Setting">Execute Action</button></div></td></tr><tr><td class="itemname-width">EEROM 初期化</td><td><div><button expr54="expr54" class="btn btn-outline-primary btn-sm" value="Setting">Execute Action</button></div></td></tr><tr><td class="itemname-width">内部情報初期化</td><td><div><button expr55="expr55" class="btn btn-outline-primary btn-sm" value="Setting">Execute Action</button></div></td></tr></table></div></p></div></div></div><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\tデバイス状態\r\n\t\t</div><div class="card-body"><h5 class="card-title">i2c接続デバイス</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><table class="table"><tr><td class="itemname-width">WiFi切断</td><td><div><button type="button" class="btn btn-primary btn-sm">Small button</button><input class="btn btn-primary btn-sm" type="reset" value="Reset"/><button expr56="expr56" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">再起動</td><td><div><button expr57="expr57" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">EEROM 初期化</td><td><div><button expr58="expr58" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">内部情報初期化</td><td><div><button expr59="expr59" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr></table></div></p><h5 class="card-title">DC-DCコンバータ</h5></div></div></div></div><div class="card"><div class="card-header">\r\n\t\t\tIR機能設定\r\n\t\t</div><div class="card-body"><h5 class="card-title">赤外線リモコン 使用</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div expr60="expr60" class="form-check form-switch"><input expr61="expr61" class="form-check-input" type="checkbox" type="checkbox"/> </div></div></p><h5 class="card-title">受信データ</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div id="logNtpSetting" style="overflow-y: scroll; height: 100px; border: 1px solid #ccc;padding: 10px;"></div></div></p><h5 class="card-title">機能設定</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><button expr62="expr62" type="submit" id="ssidSubmit" class="btn btn-outline-primary btn-sm" style="margin-top: 5px;"><span class="spinner-border spinner-border-sm visually-hidden" role="status" aria-hidden="true"></span>\r\n        Data Scan\r\n      </button><table class="table"><tr><td><div class="form-check"><input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/><label class="form-check-label" for="flexRadioDefault1">\r\n            表示切替\r\n          </label></div></td><td><div><button expr63="expr63" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">表示切替</td><td><div><button type="button" class="btn btn-primary btn-sm">Small button</button><input class="btn btn-primary btn-sm" type="reset" value="Reset"/><button expr64="expr64" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">再起動</td><td><div><button expr65="expr65" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">EEROM 初期化</td><td><div><button expr66="expr66" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr><tr><td class="itemname-width">内部情報初期化</td><td><div><button expr67="expr67" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></td></tr></table></div></p><p><div id="irSetRadioButton"></div></p></div></div>',
    [
      {
        redundantAttribute: 'expr50',
        selector: '[expr50]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tTimeconf_NtpUse_check
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr51',
        selector: '[expr51]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.systemConrtolePermissionCheck
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.systemConrtolePermissionToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr52',
        selector: '[expr52]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.logoff
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.systemConrtolePermissionCheck
          }
        ]
      },
      {
        redundantAttribute: 'expr53',
        selector: '[expr53]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.reboot
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.systemConrtolePermissionCheck
          }
        ]
      },
      {
        redundantAttribute: 'expr54',
        selector: '[expr54]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.systemConrtolePermissionCheck
          }
        ]
      },
      {
        redundantAttribute: 'expr55',
        selector: '[expr55]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.nvsClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.systemConrtolePermissionCheck
          }
        ]
      },
      {
        redundantAttribute: 'expr56',
        selector: '[expr56]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.ntpAutoUpdateSetting
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr57',
        selector: '[expr57]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr58',
        selector: '[expr58]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr59',
        selector: '[expr59]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr60',
        selector: '[expr60]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tTimeconf_NtpUse_check
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr61',
        selector: '[expr61]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.ntpUseToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr62',
        selector: '[expr62]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',

            evaluate: _scope => [
              _scope.wifiSetting,
              '"'
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr63',
        selector: '[expr63]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr64',
        selector: '[expr64]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.ntpAutoUpdateSetting
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr65',
        selector: '[expr65]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr66',
        selector: '[expr66]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr67',
        selector: '[expr67]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.eeromClear
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      }
    ]
  ),

  name: 'deviceconf'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/dispconf.riot":
/*!********************************!*\
  !*** ./src/view/dispconf.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _viewmodel_vmapp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../viewmodel/vmapp.js */ "./src/viewmodel/vmapp.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state) {
      let vmUI = props.vmUI;
      let obs = props.obs;
/*
      // 表示フォーマット初期値取得
      this.dispFormat = vmUI.getDisplaySetting("dispFormat");
      // 表示フォーマット設定処理
      this.dispFormatSet = (item,e) =>{
        this.buttonSet(item);
        obs.trigger('dispFormat',this.dispFormat);
        vmUI.submitDisplaySetting("dispFormat" ,this.dispFormat)
      }

      // 時刻表示12h/24h設定初期値取得
      if(vmUI.getDisplaySetting("formatHour") == 1){
        this.dispTimeFormatCheck = true;
      }
      else{
        this.dispTimeFormatCheck = false;
      }
      // --- TimeDisplay Format 設定処理 ---
      this.changeTimeDisplayFormat = (e) =>{
        let dat = document.getElementById("timeDisplayFormat").value;
        obs.trigger('timeDisplayFormat',dat);
        vmUI.submitDisplaySetting("timeDisplayFormat", dat,);  // 設定値送信
      }
      // --- DateDisplay Format 設定処理 ---
      this.changeDateDisplayFormat = (e) =>{
        let dat = document.getElementById("dateDisplayFormat").value;
        obs.trigger('dateDisplayFormat',dat);
        vmUI.submitDisplaySetting("dateDisplayFormat", dat);  // 設定値送信
      }
      // 時刻表示12/24hラジオボタン設定処理
      this.timeFormatradio = (item,e) =>{
        console.log("12/24時刻表示ラジオボタン設定")
        console.log(item);
        console.log(this.dispTimeFormatCheck);
        let dat;
        if(item == "dispTimeFormatRadio24"){
          dat = "1";
        }
        else if(item == "dispTimeFormatRadio12"){
          dat = "0";
        }
        console.log(dat);
        obs.trigger('formatHour',dat);
        vmUI.submitDisplaySetting("formatHour", dat,)
      }

      // 表示効果設定処理
      this.changeDisplayEffect = (e) =>{
        let dat = document.getElementById("displayEffect").value;
        vmUI.submitDisplaySetting("displayEffect", dat);  // 設定値送信
      }

      // クロスフェード時間初期値取得
      this.fadeTime = vmUI.getDisplaySetting("fadeTime");
      // クロスフェード時間数値設定処理
      this.setFadeTime = (item, e) =>{
        this.buttonSet(item);
        vmUI.submitDisplaySetting("fadeTime", this.fadeTime);
      }
*/
      // 表示輝度設定スライダー値設定初期値取得
      this.glowBright = vmUI.getDisplaySetting("glowInTheBright");
      this.glowDark = vmUI.getDisplaySetting("glowInTheDark");
      // 表示輝度設定スライダー値設定処理
      this.glowChange = (item,e) =>{   // このタイミングでeerom書き込み
        vmUI.setDisplaySetting(item, 1);
        vmUI.submitDisplaySetting(item, 1);
      }
/*
      // 各桁表示輝度初期値取得
      this.resetDispDigBtn(vmUI,"brDigtmp");
*/
      // 各桁輝度変更処理
/*        this.brdig = (item,e) =>{
        var obj = {
            brightDig9 : 9 , brightDig8 : 8 , brightDig7 : 7 , brightDig6 : 6 , brightDig5 : 5 ,
            brightDig4 : 4 , brightDig3 : 3 , brightDig2 : 2 , brightDig1 : 1
        };
        this.buttonSet(item);
        var result = document.getElementById(item);
        var datafieldName = result.getAttribute('data-field');
        var input = document.getElementById(datafieldName);
        var name = input.getAttribute('name');
        var currentVal = parseInt(this[name]);
//          console.log(name);
//          console.log(obj[name]);
        vmUI.dispBrDigSubmit(obj[name],currentVal);
      }
      // 各桁輝度設定処理
      this.writeBrSetting = (e) =>{
        console.log("writeBrSetting");
        vmUI.writeBrSetting();
      }
      // 各桁輝度設定リセット処理
      this.resetBrSetting = (e) => {
        console.log("resetBrSetting");
        this.resetDispDigBtn(vmUI,"brDig");
        this.update();
        this.resetBrButton();
        vmUI.resetBrSetting();
      }
*/
      console.log("dispConf");
    },

    onMounted(props, state){
//        console.log("== onMounted START ==")
      let vmUI = props.vmUI;
      let obs = props.obs;
      let _this = this

      // --- タブ切替時未確定ボタンリセット ---
      obs.on('changeTab',function(code){
       console.log("changeTab:"+code)
        //  _this.setLanguage(code);  // .bind(this)しない場合は_this でthisにアクセスする
                                        // ここのthisはイベント発生元のthis
        console.log("obs:resetBrSetting");
        this.resetDispDigBtn(vmUI,"brDig");
        this.update();
//          this.resetBrButton();
        vmUI.resetBrSetting();
      }.bind(this))
/*
      // --- ＋－ボタン表示初期化 ---
      this.resetDispFormatButton(); // 表示フォーマット設定ボタンリセット
      this.resetFadeTimeButton();   // クロスフェード時間設定ボタンリセット
//        this.resetBrButton();         // 輝度設定ボタンリセット

      // --- TimeDisplay Format 初期値取得・設定 ---
      document.getElementById("timeDisplayFormat").value = vmUI.getDisplaySetting("timeDisplayFormat");

      // --- DateDisplay Format 初期値取得・設定 ---
      document.getElementById("dateDisplayFormat").value = vmUI.getDisplaySetting("dateDisplayFormat");

      // --- 表示効果初期値取得・設定 ---
      document.getElementById("displayEffect").value = vmUI.getDisplaySetting("displayEffect");
*/
      // --- 表示輝度設定スライダー処理設定 ---
      var rangeValue = function (elem, target) {
        return function(evt){
          target.innerHTML = elem.value;  // 設定値表示
          console.log(target.id);
          console.log(elem.value);
          console.log(elem.id);
          vmUI.setDisplaySetting(elem.id, elem.value);      // 設定値記憶
          vmUI.submitDisplaySetting(elem.id, elem.value);   // 設定値送信
        }
      }
      // --- 表示輝度設定スライダーイベント設定 ---
      var sliderelem1 = document.getElementById('glowInTheBright');
      var slidertarget1 = document.getElementById('glowInTheBrightId');
      sliderelem1.addEventListener('input', rangeValue(sliderelem1, slidertarget1));
//        var sliderelem2 = document.getElementById('glowInTheDarktmp');
//        var slidertarget2 = document.getElementById('glowInTheDarkId');
//        sliderelem2.addEventListener('input', rangeValue(sliderelem2, slidertarget2));
      // --- 表示輝度設定スライダー設定値初期値表示 ---
      slidertarget1.innerHTML = vmUI.getDisplaySetting("glowInTheBright");    // 初期値設定
//        slidertarget2.innerHTML = vmUI.getDisplaySetting("glowInTheDarktmp");      // 初期値設定
      // ---  ---
//        console.log("== onMounted END ==")
    }
    /*
          // 各桁の個別輝度設定値取得
          resetDispDigBtn(vmUI,item){
            this.brightDig9 = vmUI.getDisplaySetting(item,9);
            this.brightDig8 = vmUI.getDisplaySetting(item,8);
            this.brightDig7 = vmUI.getDisplaySetting(item,7);
            this.brightDig6 = vmUI.getDisplaySetting(item,6);
            this.brightDig5 = vmUI.getDisplaySetting(item,5);
            this.brightDig4 = vmUI.getDisplaySetting(item,4);
            this.brightDig3 = vmUI.getDisplaySetting(item,3);
            this.brightDig2 = vmUI.getDisplaySetting(item,2);
            this.brightDig1 = vmUI.getDisplaySetting(item,1);
          },
          // ボタン設定処理
          buttonSet(item){
            console.log("-buttonSet-");
            console.log("item:"+item);

            var result = document.getElementById(item);
            var datafieldName = result.getAttribute('data-field');
            var type = result.getAttribute('data-type');

            console.log("result:"+result);
            console.log("datafieldName:"+datafieldName);
            console.log("type:"+type);

            var input = document.getElementById(datafieldName);
            var num = parseInt(input.value);
            var minVal = parseInt(input.getAttribute('min'));
            var maxVal = parseInt(input.getAttribute('max'));
            var name = input.getAttribute('name');
            
            console.log("input:"+input);
            console.log("num:"+num);
            console.log("minVal:"+minVal);
            console.log("maxVal:"+maxVal);
            console.log("name:"+name);
            console.log("this[name]:"+this[name]);

            var currentVal = parseInt(this[name]);
            console.log("currentVal:"+currentVal);
            if(!isNaN(currentVal)){
              if(type == "minus"){
                if(currentVal > minVal){
                  this[name] = currentVal - 1;
                }
                if(parseInt(this[name]) == minVal){
                  result.setAttribute("disabled", true);
                }
              }
              if(type == "plus"){
                if(currentVal < maxVal){
                  this[name] = currentVal + 1;
                }
                if(parseInt(this[name]) == maxVal){
                  result.setAttribute("disabled", true);
                }
              }
              if((this[name] < maxVal) && (this[name] > minVal)){
                var pear = result.getAttribute('pear-button');
                var tmp = document.getElementById(pear);
                tmp.removeAttribute("disabled");
              }
            }
            console.log(this.fadeTime);
            this.update();
          },
          // 表示フォーマット設定ボタンリセット
          resetDispFormatButton(){
            this.buttonDisReset('dispFormatMinus');
            this.buttonDisReset('fadeTimePlus');
          },
          // クロスフェード時間設定ボタンリセット
          resetFadeTimeButton(){
            this.buttonDisReset('fadeTimeMinus');
            this.buttonDisReset('dispFormatPlus');
          },
          // 各桁表示輝度設定ボタンリセット
          resetBrButton(){        
            const button = ['brDig1Minus','brDig1Plus','brDig2Minus','brDig2Plus',
            'brDig3Minus','brDig3Plus','brDig4Minus','brDig4Plus',
            'brDig5Minus','brDig5Plus','brDig6Minus','brDig6Plus',
            'brDig7Minus','brDig7Plus','brDig8Minus','brDig8Plus',
            'brDig9Minus','brDig9Plus'];

            for(const elem of button){
    //          console.log(elem);
              this.buttonDisReset(elem);
            }
          },
          // ボタン表示状態リセット
          buttonDisReset(item){   // ボタンの表示状態を値に合わせてリセットする。
    //        console.log("buttonDisReset:"+item);
            var result = document.getElementById(item);
            var datafieldName = result.getAttribute('data-field');
            var type = result.getAttribute('data-type');
            var input = document.getElementById(datafieldName);
            var name = input.getAttribute('name');
            var currentVal = parseInt(this[name]);
            var minVal = parseInt(input.getAttribute('min'));
            var maxVal = parseInt(input.getAttribute('max'));

            if(type == "minus"){
              if(currentVal == minVal){
                result.setAttribute("disabled", true);
              }
              else{
                result.removeAttribute("disabled");
              }
            }
            if(type == "plus"){
              if(currentVal == maxVal){
                result.setAttribute("disabled", true);
              }
              else{
                result.removeAttribute("disabled");
              }
            }

          },
    */
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>表示設定</h1><div class="card"><div class="card-header">\r\n\t\t\tLED表示設定\r\n\t\t</div><div class="card-body"><h5 class="card-title">Display Brightness</h5><p class="card-text"><div class="col-sm-11 offset-sm-1">\r\n        Bright : <span id="glowInTheBrightId">5</span><input expr24="expr24" type="range" class="form-range" id="glowInTheBright" min="1" max="15" step="1"/></div></p></div></div>',
    [
      {
        redundantAttribute: 'expr24',
        selector: '[expr24]',

        expressions: [
          {
            type: expressionTypes.VALUE,
            evaluate: _scope => _scope.glowBright
          },
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.glowChange.bind(_scope,"glowInTheBrightSet")
          }
        ]
      }
    ]
  ),

  name: 'dispconf'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/dotmaker.riot":
/*!********************************!*\
  !*** ./src/view/dotmaker.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: `dotmaker table,[is="dotmaker"] table{ width: 390px; border-collapse: collapse; } dotmaker td,[is="dotmaker"] td,dotmaker th,[is="dotmaker"] th{ border: 1px solid black; padding: 1px; } dotmaker .dot,[is="dotmaker"] .dot{ width: 20px; height: 20px; margin: 1px; padding: 0px; border: 1px solid #000; display: inline-block; background-color:#000; line-height: 0px; vertical-align: top; } dotmaker .miniImageContainer,[is="dotmaker"] .miniImageContainer{ display: flex; align-items: center; margin-bottom: 10px; } dotmaker .miniImage,[is="dotmaker"] .miniImage{ margin-right: 10px; border: 1px solid #000; } dotmaker .select,[is="dotmaker"] .select{ border-radius: 8px; height: 38px; width: 80px; padding: 6px 12px; position: relative; top: 3px; */ }`,

  exports: {
    onBeforeMount(props, state) {
      console.log("-- dotmaker.riot onBeforeMount --");

    },

    onMounted(props, state){
      let vmUI = props.vmUI;
      let dotMatrixUI = props.dotMatrixUI;
      this.vmDotMatorix = dotMatrixUI;
      this.model = vmUI.model;

      console.log("-- dotmaker.riot onMounted --");

      this.rows = this.vmDotMatorix.rows;
      this.cols = this.vmDotMatorix.cols;
      this.dotcolor = this.vmDotMatorix.dotcolor;
      this.bgcolor = this.vmDotMatorix.bgcolor;

      // ドットマトリクス編集領域作成
      this.createDotMatrix(dotMatrixUI.colorMatrix);
      currentImageDisplay.textContent = `現在の画像: New Data`;
      startButton.disabled = true;    // テスト再生ボタン不活性
      submitButton.disabled = true;   // 転送ボタン不活性

      this.imageCounter = 0;
      this.animationInterval = null;
      const switchTimeInput = document.getElementById('switchTimeInput');
      const miniImageSelector = document.getElementById('miniImageSelector');
      switchTimeInput.value = 0.5
      this.updateMiniImagesIndexes = this.updateMiniImagesIndexes.bind(this);
      this.updateMiniImageSelector = this.updateMiniImageSelector.bind(this);

      // addButtonが追加か編集かを選択する。true:編集 false:追加
      this.addButtonEditMode = 'false';

      this.bindEvents();
      this.updateMiniImageSelector();

      dotMatrixUI.setDotcolor("rgb(255, 0, 0)");
      vmUI.model.matrixDataIni();

      // ドットマトリクスデータ番号 select初期値設定
      var selectElement = document.getElementById('matrixDataNumber');
      selectElement.value = '01'; // 01を選択肢の初期値に設定

    },

    bindEvents() {
      document.getElementById('addButton').addEventListener('click', () => this.addMiniImage());
      document.getElementById('clearButton').addEventListener('click', () => this.clearMatrix());
      document.getElementById('startButton').addEventListener('click', () => this.animationTest());
      document.getElementById('submitButton').addEventListener('click', () => this.animationDataSubmit());
      // 他のイベントバインディングもここに追加...
    },

    /**
     * ドットマトリクス編集領域作成
     */
    createDotMatrix(colorMatrix){
      this.containerId = 'dotMatrix';
      this.container = document.getElementById(this.containerId);
      this.container.innerHTML = ''; // コンテナをクリア
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const dotElement = document.createElement('div');
          dotElement.className = 'dot';
          dotElement.style.backgroundColor = colorMatrix[row][col] // 色情報を配列から取得して適用
          dotElement.addEventListener('click', () => this.toggleDot(row, col, dotElement));
          this.container.appendChild(dotElement);
        }
        this.container.appendChild(document.createElement('br'));
      }
    },

    // ドットの色を切り替えるロジックを更新
    toggleDot(row, col, dotElement) {
      let newColor = this.vmDotMatorix.toggleDot(row, col);
      dotElement.style.backgroundColor = newColor;    // 色を切り替え
    },

    // 編集領域の表示とデータを初期化する
    clearMatrix() {
      console.log("clearMatrix");
      this.vmDotMatorix.clearMatrix();      // ドットマトリクス編集領域情報クリア
      Array.from(document.getElementsByClassName('dot')).forEach(dot => {
        dot.style.backgroundColor = this.bgcolor;
      });
    },

    /**
     * miniImage作成
     * @returns 作成したminiImage
     */
    createMiniImageCanvas() {
      const miniImageCanvas = document.createElement('canvas');
      miniImageCanvas.className = 'miniImage';
      miniImageCanvas.width = 128;
      miniImageCanvas.height = 64;
      const ctx = miniImageCanvas.getContext('2d');
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 16; col++) {
          const color = this.vmDotMatorix.colorMatrix[row][col]
          ctx.fillStyle = color;
          ctx.fillRect(col * 8, row * 8, 8, 8);
        }
      }
      return miniImageCanvas;
    },

    /**
     * miniImage画像をクリックしたときのイベントリスナを設定する。
     * @param {canvas}        miniImage画像
     * @param {miniImageDiv}  miniImageContainer
     * @param {container}     miniImages
     */
    addClickEventToCanvas(canvas,miniImageDiv,container) {
      const self = this;  // `this` を `self` に保存
      canvas.addEventListener('click', function() {
        // Logic to handle canvas click
        const dataIndex = Array.from(container.children).indexOf(miniImageDiv);
        const miniImageSelector = document.getElementById('miniImageSelector');
        if(canvas.dataset.isRedBorder === 'false'){
          currentImageDisplay.textContent = `現在の画像: #${dataIndex + 1}`;
          console.log('選択された画像:',dataIndex);
          self.setDotMatrix(dataIndex);                       // 編集画面にデータ設定
          self.vmDotMatorix.setColorMatrix(dataIndex);        // ドットマトリクス編集領域情報に設定

          self.deleteMiniImagesBorder();                      // miniImageの全ての赤枠表示を削除する
          canvas.style.border = '3px solid red';     // クリックされたminiImageに赤枠を表示
          canvas.dataset.isRedBorder = 'true';

          addButton.innerText = "編集";
          self.addButtonEditMode = 'true';    // ボタン編集モード

          // 編集番号設定・選択した画像
//          miniImageSelector.value = 'image' + (dataIndex + 1);
           miniImageSelector.selectedIndex = dataIndex;
        }
        else{
          currentImageDisplay.textContent = `現在の画像: New Data`;
          canvas.style.border = '';                  // miniImageの赤枠表示を削除する
          canvas.dataset.isRedBorder = 'false';

          addButton.innerText = "追加";
          self.addButtonEditMode = 'false';   // ボタン追加モード

          // 編集番号設定・最後の画像
          miniImageSelector.value = 'image' + ((container.children).length);
        }

      });
    },

    /**
     * miniImage画像 削除ボタン追加
     */
    createDeleteButton(canvas,miniImageDiv,miniImagesContainer) {
      const self = this;  // `this` を `self` に保存
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = '削除';
      deleteButton.classList.add('btn', 'btn-danger', 'delete-button');
      deleteButton.addEventListener('click', function() {

          // この画像のインデックスを取得し、コンソールに表示
        const index = Array.from(miniImagesContainer.children).indexOf(miniImageDiv);
        console.log('削除する画像の位置: ', index);
        self.vmDotMatorix.deleteMiniImageData(index);   // データから削除

        const miniImages = document.getElementsByClassName('miniImage');
        if(miniImages[index].style.border != ''){
          canvas.dataset.isRedBorder = 'false';
          addButton.innerText = "追加";
          self.addButtonEditMode = 'false';   // ボタン追加モード
        }

        // 画像をDOMから削除
        miniImagesContainer.removeChild(miniImageDiv);
        self.imageCounter--;
        self.updateMiniImagesIndexes();
        self.updateMiniImageSelector();
      });
      return deleteButton;
    },

    addMiniImage() {
      const dotData = document.getElementsByClassName('dot');
      const miniImagesContainer = document.getElementById('miniImages');

      let selectedIndex = miniImageSelector.selectedIndex;
      if (selectedIndex < 0) {
        selectedIndex = 0;
      }
      console.log("selectedIndex")
      console.log(selectedIndex)
      const self = this;  // `this` を `self` に保存

//      const miniImageIndex = selectedIndex - 1;
      const miniImageIndex = selectedIndex;
      const miniImageContainer = document.querySelectorAll('.miniImageContainer')[miniImageIndex];
      console.log(miniImageContainer)

      const miniImageDiv = document.createElement('div');
      miniImageDiv.className = 'miniImageContainer';

      const indexSpan = document.createElement('span');
      this.imageCounter++;
      indexSpan.textContent = `#${this.imageCounter}`;
      miniImageDiv.appendChild(indexSpan);

      const miniImageCanvas = this.createMiniImageCanvas();      // miniImage作成

      // クリックで赤枠追加・削除
      miniImageCanvas.dataset.isRedBorder = 'false';          // 赤枠表示情報を格納するカスタムデータ追加
      this.addClickEventToCanvas(miniImageCanvas,miniImageDiv,miniImagesContainer);

      miniImageDiv.appendChild(miniImageCanvas);              // miniImage追加処理

      // 削除ボタン追加
      const deleteButton = this.createDeleteButton(miniImageCanvas,miniImageDiv,miniImagesContainer);
      miniImageDiv.appendChild(deleteButton);

      // アニメーションデータ追加
      this.vmDotMatorix.addMiniImageData(selectedIndex);

      if(miniImagesContainer.childElementCount === 0){
        miniImagesContainer.appendChild(miniImageDiv);  // データを要素に追加する
      }
      else{
        miniImagesContainer.insertBefore(miniImageDiv, miniImageContainer.nextSibling);
      }

      this.updateMiniImagesIndexes();
      this.updateMiniImageSelector();

      if(this.addButtonEditMode === 'true'){
        console.log("編集処理")
        this.vmDotMatorix.deleteMiniImageData(selectedIndex);           // データから削除
        this.removeElementAtIndex(miniImagesContainer,selectedIndex);   // DOMから削除
        this.imageCounter--;
        this.updateMiniImagesIndexes();
        this.updateMiniImageSelector();

        addButton.innerText = "追加";                   // ボタンキャンプション設定
        self.addButtonEditMode = 'false';               // ボタン追加モード
        miniImageCanvas.dataset.isRedBorder = 'false';  // 画像選択なし
      }
      else{
        console.log("追加処理")
        // ドロップダウンメニュー編集番号++
        let nextIndex = miniImageSelector.selectedIndex + 1;
        if (nextIndex < miniImageSelector.options.length) {
          miniImageSelector.selectedIndex = nextIndex;
        }
      }

    },

    // 子要素の削除
    removeElementAtIndex(container, index) {
      // 子要素のリストを取得
      const children = container.children;

      // 指定されたインデックスが範囲内か確認
      if (index >= 0 && index < children.length) {
        // 子要素を削除
        container.removeChild(children[index]);
      } else {
        console.log('指定されたインデックスは範囲外です。');
      }
    },

    // miniImageの全ての赤枠表示を削除する
    deleteMiniImagesBorder(){
      // miniImageの全ての赤枠表示を削除する
      const miniImages = document.getElementsByClassName('miniImage');
      for(let i=0; i<miniImages.length; i++){
        miniImages[i].style.border = '';  // 赤枠を非表示
        miniImages[i].dataset.isRedBorder = 'false';
      }
    },

    updateMiniImagesIndexes() {
      console.log("updateMiniImagesIndexes");
      const miniImageContainers = document.getElementsByClassName('miniImageContainer');
      for (let i = 0; i < miniImageContainers.length; i++) {
        miniImageContainers[i].querySelector('span').textContent = `#${i + 1}`;
      }
      console.log(miniImageContainers.length);

      let mode;
      if(miniImageContainers.length > 0){
        mode = false;
      }
      else{
        mode = true;
      }
      startButton.disabled = mode;
      submitButton.disabled = mode;
    },

    updateMiniImageSelector() {
      console.log("updateMiniImageSelector")
      const miniImageSelector = document.getElementById('miniImageSelector');
      
      // 現在選択されている値を取得
      const selectedValue = miniImageSelector.value;
      let valueExists = false; // 選択された値が新しいオプションリストに存在するかどうかのフラグ
      let collentImageNum = miniImageSelector.selectedIndex + 1;  // Current Image番号作成

      // 既存のオプションを削除
      Array.from(miniImageSelector.querySelectorAll('option[value^="image"]'))
          .forEach(option => option.parentNode.removeChild(option));

      const miniImageContainers = document.getElementsByClassName('miniImageContainer');

      // 新しいオプションを追加
      for (let i = 0; i < miniImageContainers.length; i++) {
        const option = document.createElement('option');
        option.value = `image${i + 1}`;
        option.textContent = `#${i + 1}`;

        // もし現在選択されている値が新しいオプションリストに存在する場合
        if (selectedValue === option.value) {
          option.selected = true;
          valueExists = true;
        }
        
        miniImageSelector.appendChild(option);
      }

      const miniImages = document.getElementsByClassName('miniImage');
      // 選択された値が新しいリストに存在しない場合、最後を選択
      if (!valueExists) {
        miniImageSelector.selectedIndex = miniImageContainers.length-1;
        console.log("最後を選択",miniImageContainers.length,miniImages.length);
//        collentImageNum = miniImageContainers.length-1;   // Current Image番号作成
      }
//      currentImageDisplay.textContent = `Current Image: #${collentImageNum + 1}`;   // Current Image番号更新
      if(this.addButtonEditMode == 'false'){
        // 画像追加モード)
        currentImageDisplay.textContent = `現在の画像: New Data`;   // Current Image番号更新
      }
      else{
        // 画像編集モード
        const miniImages = document.getElementsByClassName('miniImage');
        for(let i=0; i<miniImages.length; i++){
          if(miniImages[i].style.border != ''){
//            console.log("選択中:",i);
            currentImageDisplay.textContent = `現在の画像: #${i + 1}`;   // Current Image番号更新
            miniImageSelector.selectedIndex = i;

          }
        }
      }

    },

    /**
     * ブラウザ上でアニメーションを再生する。再生中は停止ボタン以外の操作ボタンは非活性とする。
     */
    animationTest() {
      console.log("animationTest");

      const miniImagesContainer = document.getElementById('miniImages');
      const deleteButtons = Array.from(miniImagesContainer.getElementsByClassName('delete-button'));
      const datLen = this.vmDotMatorix.animationData.length;

      if (!this.animationInterval) {
        const switchTime = switchTimeInput.value * 1000;  // 表示切替時間設定
        let currentIndex = 0;

        this.animationInterval = setInterval(() => {
          const dataIndex = currentIndex % datLen;
          this.setDotMatrix(dataIndex)                  // 編集画面設定
          this.stopIndex = dataIndex;
          currentImageDisplay.textContent = `現在の画像: #${dataIndex + 1}`;
          currentIndex++;
        }, switchTime);

        this.toggleButtonState(true, deleteButtons);    // ボタン操作不許可
        startButton.innerText = "停止";
      } else {
        clearInterval(this.animationInterval);          // アニメーション停止
        this.animationInterval = null;                  // アニメーション停止(この行必要)

        this.vmDotMatorix.setColorMatrix(this.stopIndex)
        this.toggleButtonState(false, deleteButtons);   // ボタン操作許可
        startButton.innerText = "テスト再生";
      }
    },

    // 編集画面にアニメーション情報の一枚を設定
    setDotMatrix(dataIndex) {
      const dots = Array.from(document.getElementsByClassName('dot'));
      const dotData = this.vmDotMatorix.animationData[dataIndex];
      dots.forEach((dot, i) => {
        dot.style.backgroundColor = dotData[i];
      });
    },

    toggleButtonState(mode, deleteButtons) {
      miniImageSelector.disabled = mode;
      addButton.disabled = mode;
      clearButton.disabled = mode;
      submitButton.disabled = mode;
      deleteButtons.forEach(button => button.disabled = mode);  // 削除ボタンの活性・非活性設定
    },

    parseTextToObject(text) {
      return JSON.parse(text);
    },

    /**
     * アニメーションデータ送信
     */
    animationDataSubmit(){
      console.log("animationDataSubmit");
//      console.log("-- this.vmDotMatorix.animationData");
//      console.log(this.vmDotMatorix.submitData);
      // select要素を取得
      const selectElement = document.getElementById('matrixDataNumber');
  
      // 選択されている値を取得
      const selectedValue = selectElement.value;
      const filename = "data" + selectedValue + ".json"
      console.log(filename);

      let dataToSend = {
        "type" : "rgbData",
        "maxRow" : 8,
        "maxCol" : 16,
        "filename" : filename,
        "time" : switchTimeInput.value * 1000,    // msec単位に変換
//        "dataArray" : this.vmDotMatorix.submitData
      };
//      let dataArray = {
//        "dataArray" : this.vmDotMatorix.submitData
//      }
      console.log(dataToSend)
      console.log("---")
      console.log(JSON.stringify(dataToSend))

      console.log("dataArray size:");
//      console.log(this.vmDotMatorix.submitData.length);
//      console.log(this.vmDotMatorix.submitData[0]);
      this.model.websocketSend(JSON.stringify(dataToSend));     // データ送信

//      this.model.websocketSend(JSON.stringify(dataArray));      // データ送信
      for(let i=0; i<this.vmDotMatorix.submitData.length; i++){
        let sendDat = [];
        sendDat.push(this.vmDotMatorix.submitData[i]);
//        this.submitData.splice(index + 1, 0, mxColorDat);            // 転送用情報に追加する
        console.log(sendDat);
        let dataArray = {
          "dataArray" : sendDat
        }
        this.model.websocketSend(JSON.stringify(dataArray));      // データ送信
      }


      this.model.websocketSend("{\"command\":\"datasave\"}");   // データ送信
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>ドット絵作製</h1><div class="card"><div class="card-header">\r\n\t\t\tドット絵エディタ\r\n\t\t</div><div class="card-body"><p>ドットをクリックしてON/OFFを切り替えてください</p><div id="currentImageDisplay"></div><div><table><tr><th style="text-align: center;"><div id="dotMatrix"></div></th></tr></table></div><div><div><select class="select" id="miniImageSelector"></select><button id="addButton" type="button" class="btn btn-primary">追加</button><button id="clearButton" type="button" class="btn btn-danger">消去</button><button id="startButton" type="button" class="btn btn-primary">テスト再生</button><input type="number" class="select" id="switchTimeInput" placeholder="Switch Time (0-5 seconds, in 0.5 increments)" step="0.5" min="0" max="5"/> 秒/枚\r\n        </div><div>\r\n          ドットマトリクスデータ番号\r\n          <select class="select" id="matrixDataNumber"><option value="01">1</option><option value="02">2</option><option value="03">3</option></select><button id="submitButton" type="button" class="btn btn-success">転送</button></div></div><hr/><div id="miniImages"></div></div></div>',
    []
  ),

  name: 'dotmaker'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/footer.riot":
/*!******************************!*\
  !*** ./src/view/footer.riot ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,
  exports: null,

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<div><div class="container text-center"><p class="text-muted">©︎2024 JunkYard</p></div></div>',
    [
      {
        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'class',
            evaluate: _scope => 'footer'
          }
        ]
      }
    ]
  ),

  name: 'footer'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/my-tag.riot":
/*!******************************!*\
  !*** ./src/view/my-tag.riot ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");


// ボタンテーブルから参照される関数
function brdig(item){
    console.log("brdig:");
    console.log(item);
    var obj = {
        brightDig9 : 9 , brightDig8 : 8 , brightDig7 : 7 , brightDig6 : 6 , brightDig5 : 5 ,
        brightDig4 : 4 , brightDig3 : 3 , brightDig2 : 2 , brightDig1 : 1
    };
    this.buttonSet(item);
    var result = document.getElementById(item);
    var datafieldName = result.getAttribute('data-field');
    var input = document.getElementById(datafieldName);
    var name = input.getAttribute('name');
    var currentVal = parseInt(this[name]);
//        console.log(name);
//        console.log(obj[name]);
    this.UI.dispBrDigSubmit(obj[name],currentVal);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    state: {
      message: 'hello there',
      message2: 'hello there2'
    },

    state2: {
      message: 'hello there'
    },

    onBeforeMount(props, state) {
      // コンポーネントのマウント前
      let vmUI = props.vmUI;
//        this.state3 = props.vmUI.getTitle();
//        i18next.changeLanguage('ja');
      this.state3 = i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t('key2')

      console.log('testtest')
      console.log(this.state3)

    // ----
    // ドロップダウンメニューをeachを使ったループで作成する。
      this.tzlist = ['1','2','3','4'];
    // ----
    },

    // ----
    onMounted(props, state){
      let vmUI = props.vmUI;
      
      // ----
      // javascriptのloopで3x3のボタンパネルを作成
      const div1 = document.getElementById("div1");
      for(let i=0; i<3; i++){
        const newDiv = document.createElement("div");
        for(let j=0; j<3; j++){
          const newBtn = document.createElement("button");
          newBtn.innerHTML = i * 3 + j + 1;
          newBtn.onclick = () => {
            console.log(`ボタン${newBtn.innerHTML}が押されました！`);
          }
          newDiv.appendChild(newBtn);
        }
        div1.appendChild(newDiv);
      }
      // ----

      // ----
      // javascriptのloopでボタンテーブルを作成
      console.log("==== ボタン自動生成 ====");
      const brDigSet = document.getElementById("brDigSetting");

      const frag = document.createDocumentFragment();

      const newTable = document.createElement("table");
      newTable.id = 'table'

      const newTr = document.createElement("tr");
      const newTh1 = document.createElement("th");
      newTh1.class = 'itemname-width';
      newTh1.innerHTML = "Display digit"
      newTr.appendChild(newTh1);
      const newTh2 = document.createElement("th");
      newTh2.innerHTML = "Brightness setting"
      newTr.appendChild(newTh2);
      newTable.appendChild(newTr);

      for(let i=0; i<5; i++){
        var btnum = i + 1;
        const newTr = document.createElement("tr");
        const newTdTitle = document.createElement("td");
        newTdTitle.innerHTML = `Dig.${btnum}`;
        newTr.appendChild(newTdTitle);

        const newTd = document.createElement("td");
        const newDiv = document.createElement("div");
        newDiv.class = 'input-group';

        const newBtn = document.createElement("button");
        newBtn.type = 'button';
        newBtn.class = 'btn btn-primary btn-dispconf-number';
        newBtn.id = `brDig${btnum}Minus`;
        newBtn.dataType = `minus`;                  // data-typeをdataTypeに変更。-は演算子として扱われるため。回避策要調査？
        newBtn.dataField = `brDig${btnum}Unit`;     // data-field
        newBtn.pearButton = `brDig${btnum}Plus`;    // pear-button
        newBtn.onclick = () => {
          brdig(`${newBtn.id}`);
          console.log(`ボタン${newBtn.innerHTML}が押されました！`);
        }
        newBtn.innerHTML = "-";
        console.log(newBtn);
//          newDiv.innerHTML = "test";
//          const text = document.createTextNode("test")

        newDiv.appendChild(newBtn);
        newTd.appendChild(newDiv);
        newTr.appendChild(newTd);
        frag.appendChild(newTr);
      }
      newTable.appendChild(frag);
      brDigSet.appendChild(newTable);
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1 expr43="expr43"> </h1><h1 expr44="expr44"> </h1><h1 expr45="expr45"> </h1><div class="form-group"><label for="select1">Select:</label><select id="select1" class="form-control"><option expr46="expr46"></option></select></div><hr/><div id="div1"></div><hr/><table class="table"><tr><th class="itemname-width">Display digit</th><th>Brightness setting</th></tr><tr><td>Dig.9</td><td><div class="input-group"><button expr47="expr47" type="button" class="btn btn-primary btn-dispconf-number" id="brDig9Minus" data-type="minus" data-field="brDig9Unit" pear-button="brDig9Plus">-</button><input expr48="expr48" type="number" class="form-control input-sm no-spin" name="brightDig9" id="brDig9Unit" min="1" max="15" placeholder="1-15"/><button expr49="expr49" type="button" class="btn btn-primary btn-dispconf-number" id="brDig9Plus" data-type="plus" data-field="brDig9Unit" pear-button="brDig9Minus">+</button></div></td></tr></table><div id="brDigSetting"></div><p><button type="button" class="btn btn-primary">Primary</button><button type="button" class="btn btn-secondary">Secondary</button><button type="button" class="btn btn-success">Success</button><button type="button" class="btn btn-danger">Danger</button><button type="button" class="btn btn-warning">Warning</button><button type="button" class="btn btn-info">Info</button></p><div class="accordion" id="accordionExample"><div class="accordion-item"><h2 class="accordion-header" id="headingOne"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">\r\n        Accordion Item #1\r\n      </button></h2><div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample"><div class="accordion-body"><strong>This is the first item\'s accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It\'s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.\r\n      </div></div></div><div class="accordion-item"><h2 class="accordion-header" id="headingTwo"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">\r\n        Accordion Item #2\r\n      </button></h2><div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample"><div class="accordion-body"><strong>This is the second item\'s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It\'s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.\r\n      </div></div></div><div class="accordion-item"><h2 class="accordion-header" id="headingThree"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">\r\n        Accordion Item #3\r\n      </button></h2><div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample"><div class="accordion-body"><strong>This is the third item\'s accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It\'s also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.\r\n      </div></div></div><p><a class="btn btn-primary" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">\r\n      Link with href\r\n    </a><button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">\r\n      Button with data-bs-target\r\n    </button></p><div class="collapse" id="collapseExample"><div class="card card-body">\r\n      Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.\r\n    </div></div></div>',
    [
      {
        redundantAttribute: 'expr43',
        selector: '[expr43]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.state.message
          }
        ]
      },
      {
        redundantAttribute: 'expr44',
        selector: '[expr44]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.state.message2
          }
        ]
      },
      {
        redundantAttribute: 'expr45',
        selector: '[expr45]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.state3
          }
        ]
      },
      {
        type: bindingTypes.EACH,
        getKey: null,
        condition: null,

        template: template(
          ' ',
          [
            {
              expressions: [
                {
                  type: expressionTypes.TEXT,
                  childNodeIndex: 0,
                  evaluate: _scope => _scope.tz
                }
              ]
            }
          ]
        ),

        redundantAttribute: 'expr46',
        selector: '[expr46]',
        itemName: 'tz',
        indexName: null,
        evaluate: _scope => _scope.tzlist
      },
      {
        redundantAttribute: 'expr47',
        selector: '[expr47]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => () => _scope.brdig("brDig9Minus")
          }
        ]
      },
      {
        redundantAttribute: 'expr48',
        selector: '[expr48]',

        expressions: [
          {
            type: expressionTypes.VALUE,
            evaluate: _scope => _scope.brightDig9
          }
        ]
      },
      {
        redundantAttribute: 'expr49',
        selector: '[expr49]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => () => _scope.brdig("brDig9Plus")
          }
        ]
      }
    ]
  ),

  name: 'mytag'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/navbar.riot":
/*!******************************!*\
  !*** ./src/view/navbar.riot ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state){
      console.log("== Nav ==")
      var vmUI = props.vmUI;
      let obs = props.obs;
      this.title = "どったー Webインターフェース"


    },

    onMounted(props, state){
      let vmUI = props.vmUI;
      let obs = props.obs;
      let _this = this


    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<nav class="navbar navbar-expand-lg bg-body-tertiary"><div class="container-fluid"><a expr0="expr0" class="navbar-brand" href="#"> </a><div><span expr1="expr1" class="navbar-text"> </span></div><button type="button" class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="ナビゲーションの切替"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" id="navbarNav"><ul class="navbar-nav"></ul></div></div></nav>',
    [
      {
        redundantAttribute: 'expr0',
        selector: '[expr0]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.title
          }
        ]
      },
      {
        redundantAttribute: 'expr1',
        selector: '[expr1]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.timeDisplay
          }
        ]
      }
    ]
  ),

  name: 'navigation'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/settings.riot":
/*!********************************!*\
  !*** ./src/view/settings.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
//    import {vfdControllerUI} from '../viewmodel/vmapp.js'


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state) {
      console.log("-- wificonf.riot --")
      let vmUI = props.vmUI;
      let dotMatrixUI = props.dotMatrixUI;
      let obs = props.obs;

      this.setLanguage("en");
//        this.scanningNow = false;
//        this.scanningConp = false;

      // WiFi Connect button EnableToggleSW 初期化
      this.wifiConectCheck = false;
      this.tWifiConectCheck = "接続ボタンが無効になっています。";
      
      // WiFi Station 接続情報更新 コールバック設定
      vmUI.updateStaConnStsCallback(this.updateStaConnSts.bind(this));
      // WiFi Station List 取得コールバック設定 --
      vmUI.setWiFiStationListCallback(this.getWifiStationList.bind(this));
      // WiFi EventLog 更新コールバック設定
      vmUI.updateEventLogCallback(this.setEventLog.bind(this));
      // WiFi STA接続更新完了コールバック設定
      vmUI.clearStaReConnectionCallback(this.clearStaConnectionSpinner.bind(this));

      // STA自動接続　チェックボックス初期値設定
              if(vmUI.getNetworkSetting("staAutoConnect") == 1){
                  this.staStartupConnectCheck ="checked";
        this.tstaStartupConnectCheck = "自動接続有効";
              }
              else{
                  this.staStartupConnectCheck ="";
        this.tstaStartupConnectCheck = "自動接続無効";
              }
      // STA自動接続有効・無効処理
      this.wifiStaAutoUseToggle = (e) => {
        this.staStartupConnectCheck = !this.staStartupConnectCheck;
        if(this.staStartupConnectCheck){
          this.tstaStartupConnectCheck = "自動接続有効";
          vmUI.submitDisplaySetting("staStartupConnect", 1);
        }
        else{
          this.tstaStartupConnectCheck = "自動接続無効";
          vmUI.submitDisplaySetting("staStartupConnect", 0);
        }
        obs.trigger('wifiStaAutoConnect',this.staStartupConnectCheck); //イベント送信
        this.update();
      }

      // WiFi Connect button EnableToggleSW
      this.wifiConectToggle = (e) => {
        this.wifiConectCheck = !this.wifiConectCheck;
        if(this.wifiConectCheck){
          this.tWifiConectCheck = "接続ボタンが有効です。";
        }
        else{
          this.tWifiConectCheck = "接続ボタンが無効になっています。";
        }
        console.log(this.wifiConectCheck);
        this.update();
      }
      /*
        WiFiアクセスポイントのリストを取得する
      */
      this.getWifiStaList = (e) => {
        console.log("getWifiStaList");
        // ボタン内スピナー表示
        var Button = document.getElementById('getWiFiListButton');
        var spinner = Button.querySelector('.spinner-border');
        Button.classList.add('disabled'); // ボタンを無効化する（オプション）
        spinner.classList.remove('visually-hidden'); // スピナーを表示する

//          this.scanningNow = true;
//          this.scanningConp = false;
        this.update();

        vmUI.getWifiStaList()
      }
      /*
        WiFi SSIDとパスワードを設定する
      */
      this.wifiSetting = (e) => {
        console.log("wifiSetting");
        // ボタン内スピナー表示
        var Button = document.getElementById('ssidSubmit');
        var spinner = Button.querySelector('.spinner-border');
        Button.classList.add('disabled'); // ボタンを無効化する（オプション）
        spinner.classList.remove('visually-hidden'); // スピナーを表示する

        let element = document.getElementById('WiFiStationList');
//          console.log(element);
//          console.log(element.length);
        console.log(element.value);
        let elementpass = document.getElementById('inputSSIDPassword');
        console.log(elementpass.value);
        // SSID,Password送信処理
        if(element.length != 0){
          vmUI.postSsidSetting(element.value,elementpass.value);
        }
        // ボタン内スピナー削除
        // todo.以下の処理は非同期で再接続時に行うべき
        setTimeout(function() {
//            spinner.classList.add('visually-hidden');
//            Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
        }, 2000); // 非同期処理の例として2秒の遅延を追加
      }
      /*
        WiFiSSIDドロップダウンリスト操作
      */
      this.changeWiFiStationList = (e) =>{
        console.log("-- changeWiFiStationList")
        this.setSsidPasswordAreaEnable();   // SSID Password入力エリア許可設定
        this.setSsidSubmitEnable();         // SSID,Password設定ボタン有効・無効設定　STA接続なしの場合、ドロップダウンリストの選択で有効・無効設定する。
        this.update();
      }

      // 自動接続間隔設定
      this.updateAutoConnectInterval = (e) =>{
        const value = e.target.value;
        this.autoConnectInterval = parseInt(value, 10);
        vmUI.submitDisplaySetting("staReConnectInterval", this.autoConnectInterval);
      }

      // LED表示設定
      // 表示輝度設定スライダー値設定初期値取得
      this.glowBright = vmUI.getDisplaySetting("glowInTheBright");
      this.glowDark = vmUI.getDisplaySetting("glowInTheDark");
      // 表示輝度設定スライダー値設定処理
      this.glowChange = (item,e) =>{   // このタイミングでeerom書き込み
        vmUI.setDisplaySetting(item, 1);
        vmUI.submitDisplaySetting(item, 1);
      }

      // LED 表示方向設定
      this.rotatePositionCheck = (vmUI.getDisplaySetting("rotatePosition") == 1);
      this.tRotatePosition = this.rotatePositionCheck ? "正方向" : "逆方向";
      console.log("vmUI.getDisplaySetting(rotatePosition)");
      console.log(vmUI.getDisplaySetting("rotatePosition"));

      // LED 表示方向設定処理
      this.rotatePositionToggle = (e) => {
        this.rotatePositionCheck = !this.rotatePositionCheck;
        if(this.rotatePositionCheck){
          this.tRotatePosition = "正方向";
          vmUI.submitDisplaySetting("rotatePosition", 1);
        }
        else{
          this.tRotatePosition = "逆方向";
          vmUI.submitDisplaySetting("rotatePosition", 0)
        }
        this.update();
      }

      // データファイル設定表示
      this.sampleFileOnCheck = (vmUI.getDisplaySetting("showSampleData") == 1);
      this.tSampleFileOn = this.sampleFileOnCheck ? "サンプルファイル有効" : "サンプルファイル無効";
      console.log("vmUI.getDisplaySetting(showSampleData)");
      console.log(vmUI.getDisplaySetting("showSampleData"));

      // データファイル設定
      this.sampleFileOnToggle = (e) => {
        this.sampleFileOnCheck = !this.sampleFileOnCheck;
        if(this.sampleFileOnCheck){
          this.tSampleFileOn = "サンプルファイル有効";
          vmUI.submitDisplaySetting("showSampleData", 1);
        }
        else{
          this.tSampleFileOn = "サンプルファイル無効";
          vmUI.submitDisplaySetting("showSampleData", 0)
        }
        this.update();
      }

    },

    onMounted(props, state){
      let vmUI = props.vmUI;
      let dotMatrixUI = props.dotMatrixUI;
      let obs = props.obs;
      this.model = vmUI.model;
      const self = this;  // `this` を `self` に保存

      console.log("-- logArea Init --");
      const logArea = document.getElementById("logWiFi");
      const logMessage = "ログメッセージ"; // ログに表示するメッセージ
      // ログ領域に新しいログメッセージを追加
      logArea.innerHTML += logMessage + "<br>";
      console.log(logArea.innerHTML);
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;

      console.log("-- LED Setting menu make");
      // --- 表示輝度設定スライダー処理設定 ---
      var rangeValue = function (elem, target) {
        return function(evt){
          target.innerHTML = elem.value;  // 設定値表示
          console.log(target.id);
          console.log(elem.value);
          console.log(elem.id);
          vmUI.setDisplaySetting(elem.id, elem.value);      // 設定値記憶
          vmUI.submitDisplaySetting(elem.id, elem.value);   // 設定値送信
        }
      }
      // --- 表示輝度設定スライダーイベント設定 ---
      var sliderelem1 = document.getElementById('glowInTheBright');
      var slidertarget1 = document.getElementById('glowInTheBrightId');
      sliderelem1.addEventListener('input', rangeValue(sliderelem1, slidertarget1));
      // --- 表示輝度設定スライダー設定値初期値表示 ---
      slidertarget1.innerHTML = vmUI.getDisplaySetting("glowInTheBright");    // 初期値設定

      console.log("-- DotEditor Coloe set menu make");
      this.dotColor = vmUI.getDisplaySetting("dotColor");     // 初期値設定
      this.selectDotColor(this.dotColor);                     // ラジオボタン設定
      dotMatrixUI.setDotcolor(dotMatrixUI.convertCodeToString(this.dotColor));  // 色設定

      // ラジオボタンの要素をすべて選択
      const radios = document.querySelectorAll('input[type="radio"][name="color"]');
      // 各ラジオボタンに対してイベントリスナーを設定
      radios.forEach(radio => {
        radio.addEventListener('change', function() {
          if (this.checked) {
            console.log("Selected Color:", this.value)
            var color = dotMatrixUI.convertCodeToString(parseInt(this.value, 10));
            dotMatrixUI.setDotcolor(color);
            self.dotColorSubmit(color,dotMatrixUI);
          }
        });
      });

      console.log("-- WiFiStationList menu make");
      this.getStaSsid(vmUI);              //  WiFiネットワーク情報設定（SSID,IPアドレス,設定ボタン）
      this.wiFiStationList = [{ID: "0", TITLE: "this.stationListTopKey"}];
      this.makeWiFiListElement();     // WiFiStation選択ドロップダウンリストの要素作成
      this.setSsidPasswordAreaEnable();   // SSID Password入力エリア許可設定
      this.setSsidSubmitEnable();         // SSID,Password設定ボタン有効・無効設定　STA有無で有効・無効設定する。
      
      // 起動時自動接続設定
      this.staStartupConnectCheck = (vmUI.getNetworkSetting("staStartupConnect") == 1);

      // 自動接続間隔設定
      this.autoConnectInterval = vmUI.getNetworkSetting("staReConnectInterval");
      document.getElementById('autoConnectInterval').value = this.autoConnectInterval;

      this.update();

      // 言語切り替え
      obs.on('changeLanguage',function(code){
        this.language = code;
        console.log("wifiConf.changeLanguage:"+code)
        //  _this.setLanguage(code);  // .bind(this)しない場合は_this でthisにアクセスする
                                        // ここのthisはイベント発生元のthis
        this.setLanguage(code);
        this.update();
        this.makeWiFiListElement();     // WiFiStation選択ドロップダウンリストの要素作成
      }.bind(this))

    },

    // ドット色設定送信
    dotColorSubmit(color,dotMatrixUI){
      console.log("dotColorSubmit");

      // 色の文字列からRGB値を抽出する
      let rgbArray = color.match(/\d+/g);
      console.log(rgbArray);
      let colorCode = 0;
      if(rgbArray[0] != 0){colorCode += 1}
      if(rgbArray[1] != 0){colorCode += 2}
      if(rgbArray[2] != 0){colorCode += 4}

      let dataArray = {
        "dotColor" : colorCode
      };
      console.log(JSON.stringify(dataArray));
      this.model.websocketSend(JSON.stringify(dataArray));      // データ送信
    },

    // ドット色設定値設定
    selectDotColor(dotColor) {
      var radioId = "";
      switch(dotColor) {
        case 1:
          radioId = "redRadio";
          break;
        case 2:
          radioId = "greenRadio";
          break;
        case 3:
          radioId = "yellowRadio";
          break;
        case 4:
          radioId = "blueRadio";
          break;
        default:
          console.log("Invalid color code");
          return; // 無効なdotColorの場合は何もしない
      }

      // 対応するラジオボタンを選択状態にする
      if (radioId) {
        document.getElementById(radioId).checked = true;
      }
    },

    // WiFiネットワーク情報設定（SSID,IPアドレス,設定ボタン）
    getStaSsid(vmUI){
      this.stamodeSsid = vmUI.getNetworkSetting("stamodeSSID");
      this.stamodeIp = vmUI.getNetworkSetting("stamodeIP");
      this.apmodeSsid = vmUI.getNetworkSetting("atmodeSSID");
      this.apmodeIp = vmUI.getNetworkSetting("atmodeIP");
    },

    // WiFi Station 接続情報更新
    updateStaConnSts(objData){
      this.stamodeSsid = objData.staSsid;     // SSID設定
      this.stamodeIp = objData.staIpadr;      // IP Adress設定
//        this.stamodeStatus = objData.staStatus  // Status設定
      this.setSsidSubmitEnable();             // SSID,Password設定ボタン有効・無効設定
      this.update();
    },

    makeWiFiListElement(){
      this.setWiFiStationList("WiFiStationList",this.wiFiStationList);
    },

    getWifiStationList(stationList){
      console.log("== getWifiStationList ==");
      this.jsonWifiListObj = stationList;
      console.log(this.jsonWifiListObj);
      console.log(this.jsonWifiListObj.stationList);
      console.log(this.jsonWifiListObj[0]);
      this.jsonWifiListObj.push({ID: "0", TITLE: "this.stationListTopKey"})
      console.log(this.jsonWifiListObj);

      this.setWiFiStationList("WiFiStationList",this.jsonWifiListObj);
      // WiFiStation選択ドロップダウンリストの要素作成
      this.setSsidPasswordAreaEnable();   // SSID Password入力エリア許可設定
//        this.scanningNow = false;
//        this.scanningConp = true;
      // ボタン内スピナー削除
      var Button = document.getElementById('getWiFiListButton');
      var spinner = Button.querySelector('.spinner-border');
      spinner.classList.add('visually-hidden'); // スピナーを非表示にする
      Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
      
      this.update();

    },

    setWiFiStationList(id, datalist){
//        console.log("-^- setWiFiStationList");
      console.log(datalist);
      console.log(datalist.length);
      var select = document.getElementById(id);
      while (select.firstChild) { // 子ノードoptionを全て削除
        select.removeChild(select.firstChild);
      }
      for(let i=0; i<datalist.length; i++){
        var option = document.createElement("option");
        if(i == (datalist.length - 1)){
          option.text = eval("{"+datalist[i].TITLE+"}");
        }
        else{
          option.text = datalist[i].TITLE;
        }
        console.log(datalist[i])
        console.log(option.text)
        option.value = datalist[i].ID;
        select.appendChild(option);
      }
      this.setSsidSubmitEnable();     // SSID,Password設定ボタン有効・無効設定　ドロップダウンリスト設定で選択変更されるので、有効・無効設定する。
      this.update();
    },

    // SSID Password入力エリア許可設定
    setSsidPasswordAreaEnable(){
//        console.log("-~- setSsidPasswordAreaEnable");
      let element = document.getElementById('WiFiStationList');
      console.log(element.value);
      if(element.value == "0"){         // ドロップダウンリストのID=0が選択されている
        this.wifiSsidPassDisable = true;
        console.log("true");
      }
      else{
        this.wifiSsidPassDisable = false;
        console.log("false");
      }
    },

    // SSID,Password設定ボタン有効・無効設定
    // SSID無し（APモード接続のみ）で、WiFiStation設定消去選択時には、設定ボタン無効とする。
    setSsidSubmitEnable(){
      const ssidStr = this.stamodeSsid;
      let element = document.getElementById('WiFiStationList');
      if(((element.value == "0") && (ssidStr.length == 0)) || (!this.wifiConectChec)){
        document.getElementById("ssidSubmit").disabled = true;
      }
      else{
        document.getElementById("ssidSubmit").disabled = false;
      }
    },

    //STA Connection Button spinner clear
    clearStaConnectionSpinner(){
      // ボタン内スピナー削除
      var Button = document.getElementById('ssidSubmit');
      var spinner = Button.querySelector('.spinner-border');
      spinner.classList.add('visually-hidden');
      Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
      this.update();
    },

    // WiFi EventLog 取得・表示
    setEventLog(logMessage){
      console.log("-- setEventLog");
      console.log(logMessage);
      const logArea = document.getElementById("logWiFi");
      // ログ領域にログメッセージを設定
      logArea.innerHTML = logMessage;
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;
    },

    // 言語設定
    setLanguage(code){
      console.log("setLanguage")
      this.stationListTopKey = i18next__WEBPACK_IMPORTED_MODULE_0__["default"].t('wifiConf.stationListTopKey');
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>設定</h1><div class="card"><div class="card-header">\r\n    LED表示設定\r\n  </div><div class="card-body"><h5 class="card-title">LED 表示輝度</h5><p class="card-text"><div class="col-sm-11 offset-sm-1">\r\n        Bright : <span id="glowInTheBrightId">5</span><input expr25="expr25" type="range" class="form-range" id="glowInTheBright" min="1" max="15" step="1"/></div></p><h5 class="card-title">LED 表示方向</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div expr26="expr26" class="form-check form-switch"><input expr27="expr27" class="form-check-input" type="checkbox" type="checkbox"/> </div></div></p></div></div><div class="card"><div class="card-header">\r\n    ドット絵エディタ 設定\r\n  </div><div class="card-body"><h5 class="card-title">色設定</h5><div class="card-text"><div class="col-sm-11 offset-sm-1"><div class="form-check form-check-inline"><input class="form-check-input" type="radio" id="redRadio" name="color" value="1"/><label class="form-check-label" for="redRadio">Red</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" id="blueRadio" name="color" value="4"/><label class="form-check-label" for="blueRadio">Blue</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" id="greenRadio" name="color" value="2"/><label class="form-check-label" for="greenRadio">Green</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" id="yellowRadio" name="color" value="3"/><label class="form-check-label" for="yellowRadio">Yellow</label></div></div></div></div></div><div class="card"><div class="card-header">\r\n    データファイル設定\r\n  </div><div class="card-body"><h5 class="card-title">サンプルファイル有効</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div expr28="expr28" class="form-check form-switch"><input expr29="expr29" class="form-check-input" type="checkbox" type="checkbox"/> </div></div></p></div></div><div class="row"><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\tネットワーク接続設定\r\n\t\t\t</div><div class="card-body"><h5 class="card-title">Current Settings</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><table class="table"><tr><td>STAモード SSID</td><td expr30="expr30"> </td></tr><tr><td>STAモード IP Adress</td><td expr31="expr31"> </td></tr><tr><td>APモード SSID</td><td expr32="expr32"> </td></tr><tr><td>APモード IP Adress</td><td expr33="expr33"> </td></tr></table></div></p><h5 class="card-title">ネットワーク時刻同期</h5><p class="card-text"><div expr34="expr34" class="col-sm-11 offset-sm-1 form-check form-switch form-label"><input expr35="expr35" class="form-check-input" type="checkbox" type="checkbox"/> </div><div class="col-sm-11 offset-sm-1"><label for="autoConnectInterval" class="form-label">自動接続間隔 (時間)</label><select expr36="expr36" class="form-select form-select-sm" id="autoConnectInterval"><option value="0">No Reconnect</option><option value="1">1</option><option value="2">2</option><option value="4">4</option><option value="8">8</option><option value="12">12</option><option value="24">24</option></select></div></p></div></div></div><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\tWiFi Station 設定\r\n\t\t\t</div><div class="card-body"><h5 class="card-title">WiFi Station Setting</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><table class="table"><tr><td class="itemname-width"><div class="col-sm-4">\r\n                WiFi SSID 検索\r\n                </div><div class="col-sm-8" offset-sm-1><button expr37="expr37" type="submit" id="getWiFiListButton" class="btn btn-outline-primary btn-sm" style="margin-top: 5px;"><span class="spinner-border spinner-border-sm visually-hidden" role="status" aria-hidden="true"></span>\r\n                  Scan SSID\r\n                  </button></div></td></tr><tr><td class="itemname-width"><label for="selectSSID" class="form-label">SSID 選択</label><select expr38="expr38" class="form-select form-select-sm" aria-label="WiFiStationList" name="WiFiStationList" id="WiFiStationList"></select><label for="inputSSIDPassword" class="form-label">Password</label><input expr39="expr39" type="password" class="form-control" id="inputSSIDPassword"/><div expr40="expr40" class="form-check form-switch"><input expr41="expr41" class="form-check-input" type="checkbox"/> </div><button expr42="expr42" type="submit" id="ssidSubmit" class="btn btn-outline-primary btn-sm" style="margin-top: 5px;"><span class="spinner-border spinner-border-sm visually-hidden" role="status" aria-hidden="true"></span>\r\n                  Connection\r\n                </button></td></tr></table></div></p></div></div></div><div class="col-md-12"><div class="card h-100"><div class="card-header">\r\n      WiFi Log message\r\n    </div><div class="card-body"><div id="logWiFi" style="overflow-y: scroll; height: 200px; border: 1px solid #ccc;padding: 10px;"></div></div></div></div></div>',
    [
      {
        redundantAttribute: 'expr25',
        selector: '[expr25]',

        expressions: [
          {
            type: expressionTypes.VALUE,
            evaluate: _scope => _scope.glowBright
          },
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.glowChange.bind(_scope,"glowInTheBrightSet")
          }
        ]
      },
      {
        redundantAttribute: 'expr26',
        selector: '[expr26]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tRotatePosition
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr27',
        selector: '[expr27]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.rotatePositionCheck
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.rotatePositionToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr28',
        selector: '[expr28]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tSampleFileOn
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr29',
        selector: '[expr29]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.sampleFileOnCheck
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.sampleFileOnToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr30',
        selector: '[expr30]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.stamodeSsid
          }
        ]
      },
      {
        redundantAttribute: 'expr31',
        selector: '[expr31]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.stamodeIp
          }
        ]
      },
      {
        redundantAttribute: 'expr32',
        selector: '[expr32]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.apmodeSsid
          }
        ]
      },
      {
        redundantAttribute: 'expr33',
        selector: '[expr33]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.apmodeIp
          }
        ]
      },
      {
        redundantAttribute: 'expr34',
        selector: '[expr34]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tstaStartupConnectCheck
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr35',
        selector: '[expr35]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.staStartupConnectCheck
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.wifiStaAutoUseToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr36',
        selector: '[expr36]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.updateAutoConnectInterval
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.staStartupConnectCheck
          }
        ]
      },
      {
        redundantAttribute: 'expr37',
        selector: '[expr37]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.getWifiStaList
          }
        ]
      },
      {
        redundantAttribute: 'expr38',
        selector: '[expr38]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.changeWiFiStationList
          }
        ]
      },
      {
        redundantAttribute: 'expr39',
        selector: '[expr39]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.wifiSsidPassDisable
          }
        ]
      },
      {
        redundantAttribute: 'expr40',
        selector: '[expr40]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tWifiConectCheck
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr41',
        selector: '[expr41]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.wifiConectToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr42',
        selector: '[expr42]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.wifiSetting
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.wifiConectCheck
          }
        ]
      }
    ]
  ),

  name: 'setting'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/timeconf.riot":
/*!********************************!*\
  !*** ./src/view/timeconf.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _viewmodel_vmapp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../viewmodel/vmapp.js */ "./src/viewmodel/vmapp.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state) {
      console.log("timeconf.riot");
      // 初期化
      let vmUI = props.vmUI;

      this.setLanguage("en");

      this.timeZone = vmUI.model.timezone.timezoneList;
      this.timeZoneArea = vmUI.model.timezoneArea.timezoneAreaList;

      console.log(vmUI.model.timezone.timezoneList);
      console.log(this.timeZone);
      console.log(vmUI.model.timezoneArea);
      console.log(this.timeZoneArea);

              // Callback設定
//        vmUI.setNtpLastUpdateTImeCallback(this.getNtpLastUpdateTIme.bind(this));		// 不要？
      vmUI.updateSntpEventLogCallback(this.setEventLog.bind(this));
              // SNTP 手動更新完了コールバック設定
              vmUI.clearSntpSpinnerCallback(this.clearSntpSpinner.bind(this));
      // NTP使用可否設定
              if(vmUI.getClockSetting("ntpSet") == 1){
                      this.Timeconf_NtpUse_check ="checked";
              }
              else{
                  this.Timeconf_NtpUse_check ="";
              }

      this.tRTCSetNTP = this.setRtcSetNtpTxt(this.Timeconf_NtpUse_check);
              this.setNtpUseTxt(this.Timeconf_NtpUse_check);

      // TimeZone設定
      console.log("TimeZone:");
      this.timeZoneVal = vmUI.getClockSetting("timeZone");
      this.tzId = vmUI.getClockSetting("timeZoneId");
      this.tzAreaId = vmUI.getClockSetting("timeZoneAreaId");
      console.log(this.timeZoneVal);
      console.log(this.tzId);
      console.log(this.tzAreaId);
/*
        // UTC差分時間設定
        this.ntpDiffHourVal = vmUI.getClockSetting("diffUtcHour");
        this.ntpDiffMinVal = vmUI.getClockSetting("diffUtcMin");
*/
      // NTP自動接続時刻設定
      console.log("NTP auto-update time")

              //ToDo SNTP auto update timeコメント表示初期化
              var code = vmUI.getNetworkSetting("staAutoConnect");
              this.makeSntpAutoUpdateComment(code);

//        this.ntpUpHourVal = vmUI.getClockSetting("autoUpdateHour");
//        this.ntpUpMinVal = vmUI.getClockSetting("autoUpdateMin");

              this.ntpUpTimeVal = ('0' + (vmUI.getClockSetting("autoUpdateHour"))).slice(-2) + ":" + ('0' + (vmUI.getClockSetting("autoUpdateMin"))).slice(-2) ;
              
//          console.log(vmUI.getClockSetting("autoUpdateHour"))
//          console.log(vmUI.getClockSetting("autoUpdateMin"))

/*
      // 前回自動接続時刻情報
      this.lastUpdateTime = vmUI.getLastUpdateTime();
      // 前回自動接続リトライ回数
      this.lastUpdateRetry = vmUI.getClockSetting("lastUpdateRetry");		// 不要？
*/
      // NTP使用設定トグルスイッチ
      this.ntpUseToggle = (e) => {
        console.log("toggle click!");
        console.log(this.Timeconf_NtpUse_check);

        this.Timeconf_NtpUse_check = !this.Timeconf_NtpUse_check
        this.tRTCSetNTP = this.setRtcSetNtpTxt(this.Timeconf_NtpUse_check);
              this.setNtpUseTxt(this.Timeconf_NtpUse_check);

        vmUI.timeConfNtpUsesubmit(this.Timeconf_NtpUse_check);
        this.update()
      }
      // TimeZone設定
      this.changeTimeZoneData = (e) =>{
        console.log("TimeZone設定");
        let dat = document.getElementById("timeZoneData").value;
        if(dat != 0){
          vmUI.submitDisplaySetting("timeZoneAreaId", this.tzAreaId,);									// タイムゾーンの地域設定値送信

                      let tzID = dat;
                      this.tzId = this.tzList.findIndex((tzList) => tzList.ID == tzID);							// タイムゾーンの都市名のインデックスを求める
                      vmUI.submitDisplaySetting("timeZoneId", this.tzId);														// タイムゾーンの都市名設定値送信

                      let tzTz = this.tzList[this.tzId].TZ;
                      let tzIndex = this.tzGmtList.findIndex((tzGmtList) => tzGmtList.TZ == tzTz);	// タイムゾーンのインデックスを求める
          vmUI.submitDisplaySetting("timeZone", tzIndex);																// タイムゾーン設定値送信
        }
      }
      // TimeZoneArea設定
      // 設定値の送信はTimeZoneIdと同時に行うので、ここでは送信しない。
      this.changeTimeZoneAreaData = (e) => {
        let dat = document.getElementById("timeZoneDataArea").value;
        this.tzAreaId = dat;

        console.log("-- changeTimeZoneAreaData --")
        console.log(dat)
        console.log(this.timeZoneArea[dat].AREA);
        // エリア別タイムゾーンリスト作成
        this.makeTimeZoneList(dat);
        // タイムゾーンドロップダウンリスト作成
        this.setTimezoneList("timeZoneData",this.tzList,1);
      }

/*
        this.ntpdiffSubmit = (e) => {
          console.log("ntpdiffSubmit!");
          e.preventDefault()
          const ntpDiffHour = this.$('[name=ntpDiffHour]').value
          const ntpDiffMin = this.$('[name=ntpDiffMin]').value
          console.log({ ntpDiffHour, ntpDiffMin })
          vmUI.ntpdiffSubmit(ntpDiffHour,ntpDiffMin)
        }
*/
        this.ntpAutoUpdateSubmit = (e) => {
          console.log("ntpAutoUpdateSubmit!");
          e.preventDefault()
    //      const ntpAutoUpdateHour = this.$('[name=ntpUpHour]').value
    //      const ntpAutoUpdateMin = this.$('[name=ntpUpMin]').value
    //    console.log(ntpAutoUpdateHour)
    //    console.log(ntpAutoUpdateMin)
    //      vmUI.ntpAutoUpdateSubmit(ntpAutoUpdateHour,ntpAutoUpdateMin)
    //    console.log({ ntpAutoUpdateHour, ntpAutoUpdateMin })
          //			let ntpUpTimeAry = this.ntpUpTimeVal.split(':');
                      let ntpUpTimeAry = this.$('[name=ntpUpTime').value.split(':');
                      console.log(ntpUpTimeAry);
          vmUI.ntpAutoUpdateSubmit(ntpUpTimeAry[0],ntpUpTimeAry[1])
        }

        /*
          NTPに接続して時刻を取得する
        */
        this.ntpConnect = (e) => {
          console.log("ntpConnect")
	          // ボタン内スピナー表示
          var Button = document.getElementById('ntpConnectButton');
    	      var spinner = Button.querySelector('.spinner-border');
          Button.classList.add('disabled'); // ボタンを無効化する（オプション）
        	  spinner.classList.remove('visually-hidden'); // スピナーを表示する
                      this.update();

          vmUI.ntpConnect()
        }
        /*
          RTC設定値にブラウザ時間を設定する
        */
        this.setTime = (e) => {
          console.log("timeSet()")
          let date = new Date();
/*
          this.$('[name=rtcYearVal]').value = date.getFullYear()
          this.$('[name=rtcMonVal]').value = date.getMonth() + 1
          this.$('[name=rtcDayVal]').value = date.getDate()
          this.$('[name=rtcHourVal]').value = date.getHours()
          this.$('[name=rtcMinVal]').value = date.getMinutes()
          this.$('[name=rtcSecVal]').value = date.getSeconds()
*/
                      this.$('[name=rtcDateVal').value = String(date.getFullYear()) + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + String(date.getDate()) ;
                      let timeTmp;
                      timeTmp = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2) ;
                      console.log(timeTmp);
                      this.$('[name=rtcTimeVal').value = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2) ;
          this.update()
        }
        /*
          RTC設定値を送信する
        */
        this.rtcSubmit = (e) => {
//            e.preventDefault()  // type="submit"時は必要
          console.log("rtcSubmit()")
/*
          let rtcSetDataYear,rtcSetDataMon,rtcSetDataDay,rtcSetDataHour,rtcSetDataMin,rtcSetDataSec
          rtcSetDataYear = this.$('[name=rtcYearVal]').value
          rtcSetDataMon = this.$('[name=rtcMonVal]').value
          rtcSetDataDay = this.$('[name=rtcDayVal]').value
          rtcSetDataHour = this.$('[name=rtcHourVal]').value
          rtcSetDataMin = this.$('[name=rtcMinVal]').value
          rtcSetDataSec = this.$('[name=rtcSecVal]').value
          console.log(rtcSetDataYear+"/"+rtcSetDataMon+"/"+rtcSetDataDay+" "+rtcSetDataHour+":"+rtcSetDataMin+":"+rtcSetDataSec)
          vmUI.rtcDataSet(rtcSetDataYear,rtcSetDataMon,rtcSetDataDay,rtcSetDataHour,rtcSetDataMin,rtcSetDataSec)
*/
                      console.log(this.$('[name=rtcDateVal').value);
                      console.log(this.$('[name=rtcTimeVal').value);
                      let rtcDateAry = this.$('[name=rtcDateVal').value.split('-');
                      let rtcTimeAry = this.$('[name=rtcTimeVal').value.split(':');
                      console.log(rtcDateAry);
                      console.log(rtcTimeAry);
          vmUI.rtcDataSet(rtcDateAry[0],rtcDateAry[1],rtcDateAry[2],rtcTimeAry[0],rtcTimeAry[1],0);
        }
    },

    onMounted(props, state){
      let obs = props.obs;

      // タイムゾーンエリア選択ドロップダウンリスト作成
      console.log("-- Timezone menu make")

      this.makeTimeZoneElement();     // タイムソーンドロップアウトリストの要素作成

              // タイムゾーンデータの送信データ作成用リスト
              console.log("-- Timezone AreaGMT List make")
      this.tzGmtList = this.timeZone.filter(function (element) {
        return element.AREA == "AreaGMT";
      });
      console.log(this.tzGmtList);

      console.log("-- SNTP logArea Init --");
      const logArea = document.getElementById("logNtpSetting");
      const logMessage = "SNTP Logメッセージ"; // ログに表示するメッセージ
      // ログ領域に新しいログメッセージを追加
      logArea.innerHTML += logMessage + "<br>";
      console.log(logArea.innerHTML);
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;

              // STA自動接続有効・無効切替
      obs.on('wifiStaAutoConnect',function(code){
        console.log("obs wifiStaAutoConnect:"+code)
                  //ToDo SNTP auto update timeコメント表示追加
                  this.makeSntpAutoUpdateComment(code);
                  this.update();
      }.bind(this))

      // 言語切り替え
      obs.on('changeLanguage',function(code){
        this.language = code;
        console.log("timeconf.riot:changeLanguage:"+code)
            
        //  _this.setLanguage(code);  // .bind(this)しない場合は_this でthisにアクセスする
                                        // ここのthisはイベント発生元のthis
        this.setLanguage(code);
        this.update();
        this.makeTimeZoneElement();     // タイムソーンドロップアウトリストの要素作成
      }.bind(this))

    },

    // 前回更新時刻	Log表示ができたので不要？
    makeSntpAutoUpdateComment(code){
				if(code){
            this.tStaConnectionSettingState = "";
				}
				else{
            this.tStaConnectionSettingState = "STA自動接続がOFFとなっています。WiFi Station設定を確認してください。";
				}
    },

    /*			getNtpLastUpdateTIme(lastUpdateTime){	// 不要？
                    console.log("== getNtpLastUpdateTIme ==");
                    console.log(lastUpdateTime);
            let getLastUpdateTime;
                    let tmp;
            getLastUpdateTime = lastUpdateTime.Year + "/";
                    tmp = lastUpdateTime.Month;
            getLastUpdateTime += tmp.toString().padStart(2, "0") + "/";
                    tmp = lastUpdateTime.Day;
            getLastUpdateTime += tmp.toString().padStart(2, "0") + " ";
                    tmp = lastUpdateTime.Hour;
            getLastUpdateTime += tmp.toString().padStart(2, "0") + ":";
                    tmp = lastUpdateTime.Min;
            getLastUpdateTime += tmp.toString().padStart(2, "0");

                    this.lastUpdateTime = getLastUpdateTime;
            this.update();

                },
    */
    // タイムソーンドロップアウトリストの要素作成
    makeTimeZoneElement(){
      this.setTimezoneList("timeZoneDataArea",this.timeZoneArea,0);
      // タイムゾーンエリア設定
      var select = document.getElementById("timeZoneDataArea");
      select.options[this.tzAreaId].selected = true;
      // エリア別タイムゾーンリスト作成
      this.makeTimeZoneList(this.tzAreaId);
      // タイムゾーンドロップダウンリスト作成
      this.setTimezoneList("timeZoneData",this.tzList,1);
      // タイムゾーン設定
      this.setTimezon(this.tzList);

    },

    // エリア別タイムゾーンリスト作成
    makeTimeZoneList(dat){
      var area = this.timeZoneArea[dat].AREA;
      this.tzList = this.timeZone.filter(function (element) {
        return element.AREA == area;
      });
//        console.log(this.tzList);
    },

    // タイムゾーン設定
    setTimezon(datalist){
              console.log("-- タイムゾーン設定 --")
      var select = document.getElementById("timeZoneData");
              select.options[this.tzId].selected = true;
    },

    // タイムゾーン/エリア選択ドロップダウンリスト作成
    setTimezoneList(id, datalist,header){
      if(header==1){
        datalist.unshift({"ID":"0","TZ":"","AREA":"","TITLE":"this.tzTopKey"})
      }
//				console.log(datalist);
      var select = document.getElementById(id);
      while (select.firstChild) { // 子ノードoptionを全て削除
        select.removeChild(select.firstChild);
      }
      for(let i=0; i<datalist.length; i++){
        var option = document.createElement("option");
        option.text = eval("{"+datalist[i].TITLE+"}");
      //    console.log(datalist[i])
      //    console.log(option.text)
        option.value = datalist[i].ID;
        select.appendChild(option);
      }
    },

    // SntpSettingLog 取得・表示
    setEventLog(logMessage){
      console.log("-- setEventLog");
      console.log(logMessage);
      const logArea = document.getElementById("logNtpSetting");
      // ログ領域にログメッセージを設定
      logArea.innerHTML = logMessage;
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;
    },

    // SNTP使用スイッチON/OFF表示作成
    setNtpUseTxt(check){
				if(check){
            this.tTimeconf_NtpUse_check = "ON";
				}
				else{
            this.tTimeconf_NtpUse_check = "OFF";
				}
    },

    //SNTP Connection Button spinner clear
    clearSntpSpinner(){
// ボタン内スピナー削除
var Button = document.getElementById('ntpConnectButton');
var spinner = Button.querySelector('.spinner-border');
spinner.classList.add('visually-hidden'); // スピナーを非表示にする
Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
this.update();
    },

    // RTC設定コメント作成
    setRtcSetNtpTxt(ntpuse){
let rtn
    if(ntpuse){
     rtn = "SNTP使用時は、SNTPの時刻が自動的に設定されます。"
    }
    else{
     rtn = ""
    }
return rtn;
},

    // 言語設定
    setLanguage(code){
      console.log("setLanguage")
      this.timezoneKey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.timezoneKey');

      this.tzTopKey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTopKey');

      this.tzAreaAfrica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaAfrica');
      this.tzAreaAmerica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaAmerica');
      this.tzAreaAntarctica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaAntarctica');
      this.tzAreaArctic = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaArctic');
      this.tzAreaAsia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaAsia');
      this.tzAreaAtlantic = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaAtlantic');
      this.tzAreaAustralia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaAustralia');
      this.tzAreaEurope = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaEurope');
      this.tzAreaIndian = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaIndian');
      this.tzAreaPacific = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaPacific');
      this.tzAreaGMT = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAreaGMT');

      this.tzUTC = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzUTC');
      this.tzJapan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJapan');
      this.tzIndia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIndia');
      this.tzHawai = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHawaii');

// Africa
              this.tzAbidjan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAbidjan');
              this.tzAccra = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAccra');
              this.tzBamako = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBamako');
              this.tzBanjul = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBanjul');
              this.tzBissau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBissau');
              this.tzConakry = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzConakry');
              this.tzDakar = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDakar');
              this.tzFreetown = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFreetown');
              this.tzLome = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLome');
              this.tzMonrovia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMonrovia');
              this.tzNouakchott = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNouakchott');
              this.tzOuagadougou = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOuagadougou');
              this.tzSao_Tome = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSao_Tome');
              this.tzCasablanca = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCasablanca');
              this.tzEl_Aaiun = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEl_Aaiun');
              this.tzAlgiers = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAlgiers');
              this.tzCeuta = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCeuta');
              this.tzCeutaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCeutaSummer');
              this.tzTunis = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTunis');
              this.tzBangui = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBangui');
              this.tzBrazzaville = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBrazzaville');
              this.tzDouala = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDouala');
              this.tzKinshasa = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKinshasa');
              this.tzLagos = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLagos');
              this.tzLibreville = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLibreville');
              this.tzLuanda = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLuanda');
              this.tzMalabo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMalabo');
              this.tzNdjamena = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNdjamena');
              this.tzNiamey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNiamey');
              this.tzPorto_Novo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPorto_Novo');
              this.tzWindhoek = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWindhoek');
              this.tzWindhoekSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWindhoekSummer');
              this.tzBlantyre = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBlantyre');
              this.tzBujumbura = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBujumbura');
              this.tzGaborone = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGaborone');
              this.tzHarare = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHarare');
              this.tzKigali = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKigali');
              this.tzLubumbashi = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLubumbashi');
              this.tzLusaka = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLusaka');
              this.tzMaputo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMaputo');
              this.tzCairo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCairo');
              this.tzTripoli = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTripoli');
              this.tzJohannesburg = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJohannesburg');
              this.tzMaseru = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMaseru');
              this.tzMbabane = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMbabane');
              this.tzAddis_Ababa = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAddis_Ababa');
              this.tzAsmera = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAsmera');
              this.tzDar_es_Salaam = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDar_es_Salaam');
              this.tzDjibouti = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDjibouti');
              this.tzKampala = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKampala');
              this.tzKhartoum = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKhartoum');
              this.tzMogadishu = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMogadishu');
              this.tzNairobi = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNairobi');

// America
              this.tzAdak = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAdak');
              this.tzAnchorage = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAnchorage');
              this.tzAnchorageSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAnchorageSummer');
              this.tzJuneau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJuneau');
              this.tzJuneauSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJuneauSummer');
              this.tzNome = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNome');
              this.tzNomeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNomeSummer');
              this.tzYakutat = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYakutat');
              this.tzYakutatSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYakutatSummer');
              this.tzDawson = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDawson');
              this.tzDawsonSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDawsonSummer');
              this.tzLos_Angeles = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLos_Angeles');
              this.tzLos_AngelesSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLos_AngelesSummer');
              this.tzTijuana = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTijuana');
              this.tzTijuanaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTijuanaSummer');
              this.tzVancouver = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVancouver');
              this.tzVancouverSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVancouverSummer');
              this.tzWhitehorse = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWhitehorse');
              this.tzWhitehorseSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWhitehorseSummer');
              this.tzBoise = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBoise');
              this.tzBoiseSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBoiseSummer');
              this.tzChihuahua = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChihuahua');
              this.tzChihuahuaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChihuahuaSummer');
              this.tzDawson_Creek = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDawson_Creek');
              this.tzDenver = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDenver');
              this.tzDenverSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDenverSummer');
              this.tzEdmonton = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEdmonton');
              this.tzEdmontonSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEdmontonSummer');
              this.tzHermosillo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHermosillo');
              this.tzInuvik = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzInuvik');
              this.tzInuvikSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzInuvikSummer');
              this.tzMazatlan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMazatlan');
              this.tzMazatlanSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMazatlanSummer');
              this.tzPhoenix = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPhoenix');
              this.tzShiprock = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzShiprock');
              this.tzShiprockSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzShiprockSummer');
              this.tzYellowknife = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYellowknife');
              this.tzYellowknifeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYellowknifeSummer');
              this.tzBelize = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBelize');
              this.tzCancun = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCancun');
              this.tzCancunSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCancunSummer');
              this.tzChicago = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChicago');
              this.tzChicagoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChicagoSummer');
              this.tzCosta_Rica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCosta_Rica');
              this.tzEl_Salvador = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEl_Salvador');
              this.tzGuatemala = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuatemala');
              this.tzIndiana_Knox = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIndiana_Knox');
              this.tzIndiana_KnoxSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIndiana_KnoxSummer');
              this.tzManagua = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzManagua');
              this.tzMenominee = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMenominee');
              this.tzMenomineeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMenomineeSummer');
              this.tzMerida = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMerida');
              this.tzMeridaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMeridaSummer');
              this.tzMexico_City = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMexico_City');
              this.tzMexico_CitySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMexico_CitySummer');
              this.tzMonterrey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMonterrey');
              this.tzMonterreySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMonterreySummer');
              this.tzRainy_River = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRainy_River');
              this.tzRainy_RiverSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRainy_RiverSummer');
              this.tzRankin_Inlet = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRankin_Inlet');
              this.tzRankin_InletSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRankin_InletSummer');
              this.tzRegina = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRegina');
              this.tzTegucigalpa = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTegucigalpa');
              this.tzWinnipeg = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWinnipeg');
              this.tzWinnipegSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWinnipegSummer');
              this.tzBogota = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBogota');
              this.tzHavana = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHavana');
              this.tzHavanaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHavanaSummer');
              this.tzGuayaquil = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuayaquil');
              this.tzCayman = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCayman');
              this.tzDetroit = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDetroit');
              this.tzDetroitSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDetroitSummer');
              this.tzGrand_Turk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGrand_Turk');
              this.tzGrand_TurkSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGrand_TurkSummer');
              this.tzIndianapolis = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIndianapolis');
              this.tzIndianapolisSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIndianapolisSummer');
              this.tzIqaluit = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIqaluit');
              this.tzIqaluitSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIqaluitSummer');
              this.tzJamaica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJamaica');
              this.tzLouisville = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLouisville');
              this.tzLouisvilleSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLouisvilleSummer');
              this.tzMontreal = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMontreal');
              this.tzMontrealSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMontrealSummer');
              this.tzNassau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNassau');
              this.tzNassauSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNassauSummer');
              this.tzNew_York = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNew_York');
              this.tzNew_YorkSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNew_YorkSummer');
              this.tzNipigon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNipigon');
              this.tzNipigonSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNipigonSummer');
              this.tzPanama = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPanama');
              this.tzPangnirtung = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPangnirtung');
              this.tzPangnirtungSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPangnirtungSummer');
              this.tzResolute = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzResolute');
              this.tzThunder_Bay = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzThunder_Bay');
              this.tzThunder_BaySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzThunder_BaySummer');
              this.tzToronto = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzToronto');
              this.tzTorontoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTorontoSummer');
              this.tzLima = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLima');
              this.tzCaracas = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCaracas');
              this.tzBoa_Vista = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBoa_Vista');
              this.tzCampo_Grande = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCampo_Grande');
              this.tzCampo_GrandeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCampo_GrandeSummer');
              this.tzCuiaba = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCuiaba');
              this.tzCuiabaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCuiabaSummer');
              this.tzEirunepe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEirunepe');
              this.tzManaus = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzManaus');
              this.tzPorto_Velho = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPorto_Velho');
              this.tzRio_Branco = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRio_Branco');
              this.tzAnguilla = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAnguilla');
              this.tzAntigua = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAntigua');
              this.tzAruba = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAruba');
              this.tzBarbados = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBarbados');
              this.tzBlanc_Sablon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBlanc_Sablon');
              this.tzCuracao = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCuracao');
              this.tzDominica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDominica');
              this.tzGlace_Bay = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGlace_Bay');
              this.tzGlace_BaySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGlace_BaySummer');
              this.tzGoose_Bay = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGoose_Bay');
              this.tzGoose_BaySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGoose_BaySummer');
              this.tzGrenada = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGrenada');
              this.tzGuadeloupe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuadeloupe');
              this.tzHalifax = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHalifax');
              this.tzHalifaxSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHalifaxSummer');
              this.tzMarigot = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMarigot');
              this.tzMartinique = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMartinique');
              this.tzMoncton = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMoncton');
              this.tzMonctonSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMonctonSummer');
              this.tzMontserrat = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMontserrat');
              this.tzPuerto_Rico = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPuerto_Rico');
              this.tzSt_Kitts = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_Kitts');
              this.tzSt_Lucia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_Lucia');
              this.tzSt_Thomas = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_Thomas');
              this.tzSt_Vincent = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_Vincent');
              this.tzThule = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzThule');
              this.tzThuleSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzThuleSummer');
              this.tzTortola = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTortola');
              this.tzLa_Paz = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLa_Paz');
              this.tzSantiago = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSantiago');
              this.tzSantiagoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSantiagoSummer');
              this.tzGuyana = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuyana');
              this.tzAsuncion = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAsuncion');
              this.tzAsuncionSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAsuncionSummer');
              this.tzSt_Johns = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_Johns');
              this.tzSt_JohnsSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_JohnsSummer');
              this.tzBuenos_Aires = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBuenos_Aires');
              this.tzCatamarca = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCatamarca');
              this.tzCordoba = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCordoba');
              this.tzJujuy = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJujuy');
              this.tzMendoza = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMendoza');
              this.tzAraguaina = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAraguaina');
              this.tzBahia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBahia');
              this.tzBelem = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBelem');
              this.tzFortaleza = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFortaleza');
              this.tzMaceio = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMaceio');
              this.tzRecife = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRecife');
              this.tzSantarem = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSantarem');
              this.tzSao_Paulo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSao_Paulo');
              this.tzSao_PauloSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSao_PauloSummer');
              this.tzCayenne = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCayenne');
              this.tzMiquelon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMiquelon');
              this.tzMiquelonSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMiquelonSummer');
              this.tzParamaribo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzParamaribo');
              this.tzMontevido = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMontevido');
              this.tzMontevidoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMontevidoSummer');
              this.tzGodthab = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGodthab');
              this.tzGodthabSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGodthabSummer');
              this.tzNoronha = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNoronha');
              this.tzScoresbysund = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzScoresbysund');
              this.tzScoresbysundSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzScoresbysundSummer');
              this.tzDanmarkshavn = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDanmarkshavn');

// Antarctica
              this.tzPalmerStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPalmerStation');
              this.tzPalmerStationSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPalmerStationSummer');
              this.tzRotheraResearchStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRotheraResearchStation');
              this.tzShowaStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzShowaStation');
              this.tzMawsonStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMawsonStation');
              this.tzVostokStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVostokStation');
              this.tzDavisStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDavisStation');
              this.tzCaseyStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCaseyStation');
              this.tzMcMurdoStation = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMcMurdoStation');
              this.tzMcMurdoStationSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMcMurdoStationSummer');

// Arctic
              this.tzLongyearbyen = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLongyearbyen');
              this.tzLongyearbyenSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLongyearbyenSummer');

// Asia
              this.tzAmman = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAmman');
              this.tzAmmanSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAmmanSummer');
              this.tzBeirut = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBeirut');
              this.tzBeirutSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBeirutSummer');
              this.tzDamascus = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDamascus');
              this.tzDamascusSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDamascusSummer');
              this.tzGaza = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGaza');
              this.tzNicosia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNicosia');
              this.tzNicosiaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNicosiaSummer');
              this.tzJerusalem = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJerusalem');
              this.tzAden = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAden');
              this.tzBaghdad = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBaghdad');
              this.tzBahrain = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBahrain');
              this.tzKuwait = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKuwait');
              this.tzQatar = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzQatar');
              this.tzRiyadh = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRiyadh');
              this.tzTehran = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTehran');
              this.tzYerevan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYerevan');
              this.tzYerevanSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYerevanSummer');
              this.tzBaku = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBaku');
              this.tzBakuSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBakuSummer');
              this.tzTbilisi = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTbilisi');
              this.tzDubai = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDubai');
              this.tzMuscat = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMuscat');
              this.tzKabul = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKabul');
              this.tzKarachi = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKarachi');
              this.tzDushanbe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDushanbe');
              this.tzAshgabat = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAshgabat');
              this.tzSamarkand = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSamarkand');
              this.tzTashkent = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTashkent');
              this.tzAqtau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAqtau');
              this.tzAqtobe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAqtobe');
              this.tzOral = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOral');
              this.tzYekaterinbufg = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYekaterinbufg');
              this.tzYekaterinbufgSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYekaterinbufgSummer');
              this.tzCalcutta = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCalcutta');
              this.tzColombo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzColombo');
              this.tzKatmandu = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKatmandu');
              this.tzDhaka = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDhaka');
              this.tzThimphu = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzThimphu');
              this.tzAlmaty = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAlmaty');
              this.tzQyzylorda = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzQyzylorda');
              this.tzBishkek = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBishkek');
              this.tzNovosibirsk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNovosibirsk');
              this.tzNovosibirskSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNovosibirskSummer');
              this.tzOmsk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOmsk');
              this.tzOmskSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOmskSummer');
              this.tzRangoon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRangoon');
              this.tzHovd = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHovd');
              this.tzBangkok = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBangkok');
              this.tzPhnom_Penh = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPhnom_Penh');
              this.tzSaigon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSaigon');
              this.tzVientiane = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVientiane');
              this.tzKrasnoyarsk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKrasnoyarsk');
              this.tzKrasnoyarskSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKrasnoyarskSummer');
              this.tzJakarta = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJakarta');
              this.tzPontianak = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPontianak');
              this.tzBrunei = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBrunei');
              this.tzChoibalsan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChoibalsan');
              this.tzMakassar = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMakassar');
              this.tzBeijing = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBeijing');
              this.tzChongqing = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChongqing');
              this.tzHarbin = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHarbin');
              this.tzKashgar = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKashgar');
              this.tzMacau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMacau');
              this.tzShanghai = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzShanghai');
              this.tzTaipei = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTaipei');
              this.tzUrumqi = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzUrumqi');
              this.tzHong_Kong = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHong_Kong');
              this.tzIrkutsk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIrkutsk');
              this.tzIrkutskSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIrkutskSummer');
              this.tzKuala_Lumpur = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKuala_Lumpur');
              this.tzKuching = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKuching');
              this.tzManila = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzManila');
              this.tzSingapore = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSingapore');
              this.tzUlaanbaatar = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzUlaanbaatar');
              this.tzJayapura = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJayapura');
              this.tzOsaka = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOsaka');
              this.tzSapporo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSapporo');
              this.tzTokyo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTokyo');
              this.tzPyongyang = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPyongyang');
              this.tzSeoul = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSeoul');
              this.tzDili = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDili');
              this.tzYakutsk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYakutsk');
              this.tzYakutskSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzYakutskSummer');
              this.tzSakhalin = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSakhalin');
              this.tzSakhalinSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSakhalinSummer');
              this.tzVladivostok = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVladivostok');
              this.tzVladivostokSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVladivostokSummer');
              this.tzAnadyr = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAnadyr');
              this.tzAnadyrSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAnadyrSummer');
              this.tzKamchatka = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKamchatka');
              this.tzKamchatkaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKamchatkaSummer');
              this.tzMagadan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMagadan');
              this.tzMagadanSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMagadanSummer');

// Atlantic
              this.tzBermuda = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBermuda');
              this.tzBermudaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBermudaSummer');
              this.tzStanley = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzStanley');
              this.tzStanleySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzStanleySummer');
              this.tzAzores = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAzores');
              this.tzAzoresSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAzoresSummer');
              this.tzCape_Verde = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCape_Verde');
              this.tzReykjavik = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzReykjavik');
              this.tzSt_Helena = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSt_Helena');
              this.tzCanary = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCanary');
              this.tzCanarySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCanarySummer');
              this.tzFaeroe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFaeroe');
              this.tzFaeroeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFaeroeSummer');
              this.tzMadeira = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMadeira');
              this.tzMadeiraSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMadeiraSummer');

// Australia
              this.tzPerth = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPerth');
              this.tzEucla = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEucla');
              this.tzAdelaide = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAdelaide');
              this.tzAdelaideSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAdelaideSummer');
              this.tzDarwin = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDarwin');
              this.tzBrisbane = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBrisbane');
              this.tzCurrie = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCurrie');
              this.tzCurrieSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCurrieSummer');
              this.tzHobart = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHobart');
              this.tzHobartSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHobartSummer');
              this.tzLindeman = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLindeman');
              this.tzMelbourne = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMelbourne');
              this.tzMelbourneSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMelbourneSummer');
              this.tzSydney = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSydney');
              this.tzSydneySummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSydneySummer');
              this.tzLord_Howe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLord_Howe');
              this.tzLord_HoweSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLord_HoweSummer');

// Europe
              this.tzDublin = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzDublin');
              this.tzGuernsey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuernsey');
              this.tzIsle_of_Man = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIsle_of_Man');
              this.tzJersey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJersey');
              this.tzLondon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLondon');
              this.tzLisbon = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLisbon');
              this.tzLisbonSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLisbonSummer');
              this.tzAmsterdam = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAmsterdam');
              this.tzAmsterdamSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAmsterdamSummer');
              this.tzAndorra = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAndorra');
              this.tzAndorraSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAndorraSummer');
              this.tzBelgrade = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBelgrade');
              this.tzBelgradeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBelgradeSummer');
              this.tzBerlin = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBerlin');
              this.tzBerlinSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBerlinSummer');
              this.tzBratislava = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBratislava');
              this.tzBratislavaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBratislavaSummer');
              this.tzBrussels = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBrussels');
              this.tzBrusselsSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBrusselsSummer');
              this.tzBudapest = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBudapest');
              this.tzBudapestSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBudapestSummer');
              this.tzCopenhagen = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCopenhagen');
              this.tzCopenhagenSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCopenhagenSummer');
              this.tzGibraltar = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGibraltar');
              this.tzGibraltarSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGibraltarSummer');
              this.tzLjubljana = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLjubljana');
              this.tzLjubljanaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLjubljanaSummer');
              this.tzLuxembourg = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLuxembourg');
              this.tzLuxembourgSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzLuxembourgSummer');
              this.tzMadrid = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMadrid');
              this.tzMadridSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMadridSummer');
              this.tzMalta = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMalta');
              this.tzMaltaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMaltaSummer');
              this.tzMonaco = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMonaco');
              this.tzMonacoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMonacoSummer');
              this.tzOslo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOslo');
              this.tzOsloSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzOsloSummer');
              this.tzParis = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzParis');
              this.tzParisSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzParisSummer');
              this.tzPodgorica = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPodgorica');
              this.tzPodgoricaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPodgoricaSummer');
              this.tzPrague = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPrague');
              this.tzPragueSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPragueSummer');
              this.tzRome = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRome');
              this.tzRomeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRomeSummer');
              this.tzSan_Marino = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSan_Marino');
              this.tzSan_MarinoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSan_MarinoSummer');
              this.tzSarajevo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSarajevo');
              this.tzSarajevoSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSarajevoSummer');
              this.tzSkopje = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSkopje');
              this.tzSkopjeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSkopjeSummer');
              this.tzStockholm = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzStockholm');
              this.tzStockholmSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzStockholmSummer');
              this.tzTirane = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTirane');
              this.tzTiraneSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTiraneSummer');
              this.tzVaduz = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVaduz');
              this.tzVaduzSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVaduzSummer');
              this.tzVatican = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVatican');
              this.tzVaticanSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVaticanSummer');
              this.tzVienna = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVienna');
              this.tzViennaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzViennaSummer');
              this.tzWarsaw = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWarsaw');
              this.tzWarsawSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWarsawSummer');
              this.tzZagreb = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzZagreb');
              this.tzZagrebSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzZagrebSummer');
              this.tzZurich = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzZurich');
              this.tzZurichSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzZurichSummer');
              this.tzAthens = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAthens');
              this.tzAthensSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAthensSummer');
              this.tzBucharest = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBucharest');
              this.tzBucharestSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzBucharestSummer');
              this.tzChisinau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChisinau');
              this.tzChisinauSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChisinauSummer');
              this.tzHelsinki = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHelsinki');
              this.tzHelsinkiSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHelsinkiSummer');
              this.tzIstanbul = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIstanbul');
              this.tzIstanbulSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzIstanbulSummer');
              this.tzKaliningrad = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKaliningrad');
              this.tzKaliningradSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKaliningradSummer');
              this.tzKiev = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKiev');
              this.tzKievSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKievSummer');
              this.tzMariehamn = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMariehamn');
              this.tzMariehamnSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMariehamnSummer');
              this.tzMinsk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMinsk');
              this.tzMinskSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMinskSummer');
              this.tzRiga = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRiga');
              this.tzRigaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRigaSummer');
              this.tzSimferopol = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSimferopol');
              this.tzSimferopolSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSimferopolSummer');
              this.tzSofia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSofia');
              this.tzSofiaSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSofiaSummer');
              this.tzTallinn = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTallinn');
              this.tzTallinnSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTallinnSummer');
              this.tzUzhgorod = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzUzhgorod');
              this.tzUzhgorodSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzUzhgorodSummer');
              this.tzVilnius = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVilnius');
              this.tzVilniusSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVilniusSummer');
              this.tzZaporozhye = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzZaporozhye');
              this.tzZaporozhyeSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzZaporozhyeSummer');
              this.tzMoscow = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMoscow');
              this.tzMoscowSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMoscowSummer');
              this.tzSamara = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSamara');
              this.tzSamaraSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSamaraSummer');
              this.tzVolgograd = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVolgograd');
              this.tzVolgogradSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzVolgogradSummer');

// Indian
              this.tzAntananarivo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAntananarivo');
              this.tzComoro = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzComoro');
              this.tzMayotte = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMayotte');
              this.tzMauritius = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMauritius');
              this.tzReunion = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzReunion');
              this.tzMahe = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMahe');
              this.tzMaldives = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMaldives');
              this.tzKerguelen = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKerguelen');
              this.tzChagos = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChagos');
              this.tzCocos = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzCocos');
              this.tzChristmas = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzChristmas');

// Pacific
              this.tzNiue = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNiue');
              this.tzApia = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzApia');
              this.tzMidway = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMidway');
              this.tzPago_pago = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPago_pago');
              this.tzRarotonga = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzRarotonga');
              this.tzHonolulu = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzHonolulu');
              this.tzJohnston = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzJohnston');
              this.tzTahiti = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTahiti');
              this.tzFakaofo = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFakaofo');
              this.tzMarquesas = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMarquesas');
              this.tzGambier = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGambier');
              this.tzPitcairn = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPitcairn');
              this.tzEaster = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEaster');
              this.tzEasterSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEasterSummer');
              this.tzGalapagos = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGalapagos');
              this.tzPalau = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPalau');
              this.tzGuam = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuam');
              this.tzSaipan = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzSaipan');
              this.tzTruk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTruk');
              this.tzPort_Moresby = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPort_Moresby');
              this.tzKosrae = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKosrae');
              this.tzNoumea = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNoumea');
              this.tzPonape = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzPonape');
              this.tzGuadalcanal = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGuadalcanal');
              this.tzEfate = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEfate');
              this.tzNorfolk = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNorfolk');
              this.tzFiji = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFiji');
              this.tzTarawa = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTarawa');
              this.tzKwajalein = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKwajalein');
              this.tzMajuro = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzMajuro');
              this.tzNauru = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzNauru');
              this.tzAuckland = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAuckland');
              this.tzAucklandSummer = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzAucklandSummer');
              this.tzFunafuti = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzFunafuti');
              this.tzWake = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWake');
              this.tzWallis = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzWallis');
              this.tzEnderbury = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzEnderbury');
              this.tzTongatapu = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzTongatapu');
              this.tzKiritimati = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzKiritimati');

// AreaGMT
              this.tzGMTm1200 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm1200');
              this.tzGMTm1100 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm1100');
              this.tzGMTm1000 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm1000');
              this.tzGMTm0930 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0930');
              this.tzGMTm0900 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0900');
              this.tzGMTm0800 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0800');
              this.tzGMTm0700 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0700');
              this.tzGMTm0600 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0600');
              this.tzGMTm0500 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0500');
              this.tzGMTm0400 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0400');
              this.tzGMTm0330 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0330');
              this.tzGMTm0300 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0300');
              this.tzGMTm0200 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0200');
              this.tzGMTm0100 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTm0100');
              this.tzGMTp0000 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0000');
              this.tzGMTp0100 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0100');
              this.tzGMTp0200 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0200');
              this.tzGMTp0300 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0300');
              this.tzGMTp0330 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0330');
              this.tzGMTp0400 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0400');
              this.tzGMTp0430 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0430');
              this.tzGMTp0500 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0500');
              this.tzGMTp0530 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0530');
              this.tzGMTp0545 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0545');
              this.tzGMTp0600 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0600');
              this.tzGMTp0630 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0630');
              this.tzGMTp0700 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0700');
              this.tzGMTp0800 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0800');
              this.tzGMTp0830 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0830');
              this.tzGMTp0845 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0845');
              this.tzGMTp0900 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0900');
              this.tzGMTp0930 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp0930');
              this.tzGMTp1000 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1000');
              this.tzGMTp1030 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1030');
              this.tzGMTp1100 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1100');
              this.tzGMTp1200 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1200');
              this.tzGMTp1245 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1245');
              this.tzGMTp1300 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1300');
              this.tzGMTp1400 = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('timeConf.tzGMTp1400');
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>時刻設定</h1><div class="row"><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\t\tSNTP設定\r\n\t\t\t\t</div><div class="card-body"><h5 class="card-title">SNTP 使用</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div expr9="expr9" class="form-check form-switch"><input expr10="expr10" class="form-check-input" type="checkbox" type="checkbox"/> </div></div></p><h5 expr11="expr11" class="card-title"> </h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div><select expr12="expr12" class="form-select form-select-sm" aria-label="Time Zone Area" name="timeZoneDataArea" id="timeZoneDataArea"></select></div><div><select expr13="expr13" class="form-select form-select-sm" aria-label="Time Zone2" name="timeZoneData" id="timeZoneData"></select></div></div></p><h5 class="card-title">SNTP auto update time</h5><p class="card-text"><div expr14="expr14" class="col-sm-11 offset-sm-1"> <form expr15="expr15"><div class="mb-3"><input expr16="expr16" type="time" class="form-control form-control-sm" id="ntpUpTime" name="ntpUpTime"/></div><div class="form-group row"><div><button expr17="expr17" class="btn btn-outline-primary btn-sm" value="Setting">Setting</button></div></div></form></div></p><h5 class="card-title">SNTP manual connection</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div><button expr18="expr18" type="submit" id="ntpConnectButton" class="btn btn-outline-primary btn-sm"><span class="spinner-border spinner-border-sm visually-hidden" role="status" aria-hidden="true"></span>\r\n\t\t\t\t\t\t\t\tConnection\r\n\t\t\t\t\t\t\t\t</button></div></div></p><h5 class="card-title">SNTP Log message</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div id="logNtpSetting" style="overflow-y: scroll; height: 100px; border: 1px solid #ccc;padding: 10px;"></div></div></p></div></div></div><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n    \t\t\tRTC設定\r\n    \t\t</div><div class="card-body"><h5 class="card-title">手動時刻設定</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><div expr19="expr19" class> </div><div class="mb-3"><label for="dateInput1" class="form-label">日付</label><input expr20="expr20" type="date" class="form-control form-control-sm" id="dateInput1" name="rtcDateVal"/></div><div class="mb-3"><label for="timeInput1" class="form-label">時刻</label><input expr21="expr21" type="time" class="form-control form-control-sm" id="timeInput1" name="rtcTimeVal"/></div><div class><div class="btn-group" role="group" aria-label="Basic example"><button expr22="expr22" type="button" class="btn btn-outline-primary btn-sm">ブラウザの時間をセットする</button><button expr23="expr23" type="button" class="btn btn-outline-primary btn-sm">更新</button></div></div></div></p></div></div></div></div>',
    [
      {
        redundantAttribute: 'expr9',
        selector: '[expr9]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tTimeconf_NtpUse_check
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr10',
        selector: '[expr10]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.ntpUseToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr11',
        selector: '[expr11]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.timezoneKey
          }
        ]
      },
      {
        redundantAttribute: 'expr12',
        selector: '[expr12]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.changeTimeZoneAreaData
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr13',
        selector: '[expr13]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.changeTimeZoneData
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr14',
        selector: '[expr14]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,

            evaluate: _scope => [
              _scope.tStaConnectionSettingState
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr15',
        selector: '[expr15]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onsubmit',
            evaluate: _scope => _scope.ntpAutoUpdateSubmit
          }
        ]
      },
      {
        redundantAttribute: 'expr16',
        selector: '[expr16]',

        expressions: [
          {
            type: expressionTypes.VALUE,
            evaluate: _scope => _scope.ntpUpTimeVal
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr17',
        selector: '[expr17]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.ntpAutoUpdateSetting
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr18',
        selector: '[expr18]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.ntpConnect
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr19',
        selector: '[expr19]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,

            evaluate: _scope => [
              _scope.tRTCSetNTP
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr20',
        selector: '[expr20]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr21',
        selector: '[expr21]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          }
        ]
      },
      {
        redundantAttribute: 'expr22',
        selector: '[expr22]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => () => _scope.setTime()
          }
        ]
      },
      {
        redundantAttribute: 'expr23',
        selector: '[expr23]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.Timeconf_NtpUse_check
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => () => _scope.rtcSubmit()
          }
        ]
      }
    ]
  ),

  name: 'timeconf'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/view/wificonf.riot":
/*!********************************!*\
  !*** ./src/view/wificonf.riot ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _viewmodel_vmapp_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../viewmodel/vmapp.js */ "./src/viewmodel/vmapp.js");
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  css: null,

  exports: {
    onBeforeMount(props, state) {
      console.log("-- wificonf.riot --")
      let vmUI = props.vmUI;
      let obs = props.obs;

      this.setLanguage("en");
//        this.scanningNow = false;
//        this.scanningConp = false;

      // WiFi Connect button EnableToggleSW 初期化
      this.wifiConectCheck = false;
      this.tWifiConectCheck = "Connect button disabled.";
      
      // WiFi Station 接続情報更新 コールバック設定
      vmUI.updateStaConnStsCallback(this.updateStaConnSts.bind(this));
      // WiFi Station List 取得コールバック設定 --
      vmUI.setWiFiStationListCallback(this.getWifiStationList.bind(this));
      // WiFi EventLog 更新コールバック設定
      vmUI.updateEventLogCallback(this.setEventLog.bind(this));
      // WiFi STA接続更新完了コールバック設定
      vmUI.clearStaReConnectionCallback(this.clearStaConnectionSpinner.bind(this));

      // STA自動接続　チェックボックス初期値設定
              if(vmUI.getNetworkSetting("staAutoConnect") == 1){
                  this.wifiStaAutoUseCheck ="checked";
        this.tWifiStaAutoUseCheck = "自動接続有効";
              }
              else{
                  this.wifiStaAutoUseCheck ="";
        this.tWifiStaAutoUseCheck = "自動接続無効";
              }
      // STA自動接続有効・無効処理
      this.wifiStaAutoUseToggle = (e) => {
        this.wifiStaAutoUseCheck = !this.wifiStaAutoUseCheck;
        if(this.wifiStaAutoUseCheck){
          this.tWifiStaAutoUseCheck = "自動接続有効";
          vmUI.submitDisplaySetting("staAutoConnect", 1);
        }
        else{
          this.tWifiStaAutoUseCheck = "自動接続無効";
          vmUI.submitDisplaySetting("staAutoConnect", 0)
        }
        obs.trigger('wifiStaAutoConnect',this.wifiStaAutoUseCheck); //イベント送信
        this.update();
      }

      // WiFi Connect button EnableToggleSW
      this.wifiConectToggle = (e) => {
        this.wifiConectCheck = !this.wifiConectCheck;
        if(this.wifiConectCheck){
          this.tWifiConectCheck = "Connection button enable.";
        }
        else{
          this.tWifiConectCheck = "Connection button disabled.";
        }
        console.log(this.wifiConectCheck);
        this.update();
      }
      /*
        WiFiアクセスポイントのリストを取得する
      */
      this.getWifiStaList = (e) => {
        console.log("getWifiStaList");
        // ボタン内スピナー表示
        var Button = document.getElementById('getWiFiListButton');
        var spinner = Button.querySelector('.spinner-border');
        Button.classList.add('disabled'); // ボタンを無効化する（オプション）
        spinner.classList.remove('visually-hidden'); // スピナーを表示する

//          this.scanningNow = true;
//          this.scanningConp = false;
        this.update();

        vmUI.getWifiStaList()
      }
      /*
        WiFi SSIDとパスワードを設定する
      */
      this.wifiSetting = (e) => {
        console.log("wifiSetting");
        // ボタン内スピナー表示
        var Button = document.getElementById('ssidSubmit');
        var spinner = Button.querySelector('.spinner-border');
        Button.classList.add('disabled'); // ボタンを無効化する（オプション）
        spinner.classList.remove('visually-hidden'); // スピナーを表示する

        let element = document.getElementById('WiFiStationList');
//          console.log(element);
//          console.log(element.length);
        console.log(element.value);
        let elementpass = document.getElementById('inputSSIDPassword');
        console.log(elementpass.value);
        // SSID,Password送信処理
        if(element.length != 0){
          vmUI.postSsidSetting(element.value,elementpass.value);
        }
        // ボタン内スピナー削除
        // todo.以下の処理は非同期で再接続時に行うべき
        setTimeout(function() {
//            spinner.classList.add('visually-hidden');
//            Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
        }, 2000); // 非同期処理の例として2秒の遅延を追加
      }
      /*
        WiFiSSIDドロップダウンリスト操作
      */
      this.changeWiFiStationList = (e) =>{
        console.log("-- changeWiFiStationList")
        this.setSsidPasswordAreaEnable();   // SSID Password入力エリア許可設定
        this.setSsidSubmitEnable();         // SSID,Password設定ボタン有効・無効設定　STA接続なしの場合、ドロップダウンリストの選択で有効・無効設定する。
        this.update();
      }
    },

    onMounted(props, state){
      let vmUI = props.vmUI;
      let obs = props.obs;

      console.log("-- logArea Init --");
      const logArea = document.getElementById("logWiFi");
      const logMessage = "ログメッセージ"; // ログに表示するメッセージ
      // ログ領域に新しいログメッセージを追加
      logArea.innerHTML += logMessage + "<br>";
      console.log(logArea.innerHTML);
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;

      console.log("-- WiFiStationList menu make");
      this.getStaSsid(vmUI);              //  WiFiネットワーク情報設定（SSID,IPアドレス,設定ボタン）
      this.wiFiStationList = [{ID: "0", TITLE: "this.stationListTopKey"}];
      this.makeWiFiListElement();     // WiFiStation選択ドロップダウンリストの要素作成
      this.setSsidPasswordAreaEnable();   // SSID Password入力エリア許可設定
      this.setSsidSubmitEnable();         // SSID,Password設定ボタン有効・無効設定　STA有無で有効・無効設定する。
      this.update();

      // 言語切り替え
      obs.on('changeLanguage',function(code){
        this.language = code;
        console.log("wifiConf.changeLanguage:"+code)
        //  _this.setLanguage(code);  // .bind(this)しない場合は_this でthisにアクセスする
                                        // ここのthisはイベント発生元のthis
        this.setLanguage(code);
        this.update();
        this.makeWiFiListElement();     // WiFiStation選択ドロップダウンリストの要素作成
      }.bind(this))

    },

    // WiFiネットワーク情報設定（SSID,IPアドレス,設定ボタン）
    getStaSsid(vmUI){
      this.stamodeSsid = vmUI.getNetworkSetting("stamodeSSID");
      this.stamodeIp = vmUI.getNetworkSetting("stamodeIP");
      this.apmodeSsid = vmUI.getNetworkSetting("atmodeSSID");
      this.apmodeIp = vmUI.getNetworkSetting("atmodeIP");
    },

    // WiFi Station 接続情報更新
    updateStaConnSts(objData){
      this.stamodeSsid = objData.staSsid;     // SSID設定
      this.stamodeIp = objData.staIpadr;      // IP Adress設定
//        this.stamodeStatus = objData.staStatus  // Status設定
      this.setSsidSubmitEnable();             // SSID,Password設定ボタン有効・無効設定
      this.update();
    },

    makeWiFiListElement(){
      this.setWiFiStationList("WiFiStationList",this.wiFiStationList);
    },

    getWifiStationList(stationList){
      console.log("== getWifiStationList ==");
      this.jsonWifiListObj = stationList;
      console.log(this.jsonWifiListObj);
      console.log(this.jsonWifiListObj.stationList);
      console.log(this.jsonWifiListObj[0]);
      this.jsonWifiListObj.push({ID: "0", TITLE: "this.stationListTopKey"})
      console.log(this.jsonWifiListObj);

      this.setWiFiStationList("WiFiStationList",this.jsonWifiListObj);
      // WiFiStation選択ドロップダウンリストの要素作成
      this.setSsidPasswordAreaEnable();   // SSID Password入力エリア許可設定
//        this.scanningNow = false;
//        this.scanningConp = true;
      // ボタン内スピナー削除
      var Button = document.getElementById('getWiFiListButton');
      var spinner = Button.querySelector('.spinner-border');
      spinner.classList.add('visually-hidden'); // スピナーを非表示にする
      Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
      
      this.update();

    },

    setWiFiStationList(id, datalist){
//        console.log("-^- setWiFiStationList");
      console.log(datalist);
      console.log(datalist.length);
      var select = document.getElementById(id);
      while (select.firstChild) { // 子ノードoptionを全て削除
        select.removeChild(select.firstChild);
      }
      for(let i=0; i<datalist.length; i++){
        var option = document.createElement("option");
        if(i == (datalist.length - 1)){
          option.text = eval("{"+datalist[i].TITLE+"}");
        }
        else{
          option.text = datalist[i].TITLE;
        }
        console.log(datalist[i])
        console.log(option.text)
        option.value = datalist[i].ID;
        select.appendChild(option);
      }
      this.setSsidSubmitEnable();     // SSID,Password設定ボタン有効・無効設定　ドロップダウンリスト設定で選択変更されるので、有効・無効設定する。
      this.update();
    },

    // SSID Password入力エリア許可設定
    setSsidPasswordAreaEnable(){
//        console.log("-~- setSsidPasswordAreaEnable");
      let element = document.getElementById('WiFiStationList');
      console.log(element.value);
      if(element.value == "0"){         // ドロップダウンリストのID=0が選択されている
        this.wifiSsidPassDisable = true;
        console.log("true");
      }
      else{
        this.wifiSsidPassDisable = false;
        console.log("false");
      }
    },

    // SSID,Password設定ボタン有効・無効設定
    // SSID無し（APモード接続のみ）で、WiFiStation設定消去選択時には、設定ボタン無効とする。
    setSsidSubmitEnable(){
      const ssidStr = this.stamodeSsid;
      let element = document.getElementById('WiFiStationList');
      if(((element.value == "0") && (ssidStr.length == 0)) || (!this.wifiConectChec)){
        document.getElementById("ssidSubmit").disabled = true;
      }
      else{
        document.getElementById("ssidSubmit").disabled = false;
      }
    },

    //STA Connection Button spinner clear
    clearStaConnectionSpinner(){
      // ボタン内スピナー削除
      var Button = document.getElementById('ssidSubmit');
      var spinner = Button.querySelector('.spinner-border');
      spinner.classList.add('visually-hidden');
      Button.classList.remove('disabled'); // ボタンを再度有効化する（オプション）
      this.update();
    },

    // WiFi EventLog 取得・表示
    setEventLog(logMessage){
      console.log("-- setEventLog");
      console.log(logMessage);
      const logArea = document.getElementById("logWiFi");
      // ログ領域にログメッセージを設定
      logArea.innerHTML = logMessage;
      // ログ領域を最下部にスクロールする
      logArea.scrollTop = logArea.scrollHeight;
    },

    // 言語設定
    setLanguage(code){
      console.log("setLanguage")
      this.stationListTopKey = i18next__WEBPACK_IMPORTED_MODULE_1__["default"].t('wifiConf.stationListTopKey');
    }
  },

  template: (
    template,
    expressionTypes,
    bindingTypes,
    getComponent
  ) => template(
    '<h1>Wifi設定</h1><div class="row"><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\tネットワーク接続設定\r\n\t\t\t</div><div class="card-body"><h5 class="card-title">Current Settings</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><table class="table"><tr><td>STAモード SSID</td><td expr68="expr68"> </td></tr><tr><td>STAモード IP Adress</td><td expr69="expr69"> </td></tr><tr><td>APモード SSID</td><td expr70="expr70"> </td></tr><tr><td>APモード IP Adress</td><td expr71="expr71"> </td></tr></table></div></p></div></div></div><div class="col-md-6"><div class="card h-100"><div class="card-header">\r\n\t\t\t\tWiFi Station 設定\r\n\t\t\t</div><div class="card-body"><h5 class="card-title">WiFi Station Setting</h5><p class="card-text"><div class="col-sm-11 offset-sm-1"><table class="table"><tr><td class="itemname-width"><div class="col-sm-4">\r\n                WiFi SSID 検索\r\n                </div><div class="col-sm-8" offset-sm-1><button expr72="expr72" type="submit" id="getWiFiListButton" class="btn btn-outline-primary btn-sm" style="margin-top: 5px;"><span class="spinner-border spinner-border-sm visually-hidden" role="status" aria-hidden="true"></span>\r\n                  Scan SSID\r\n                  </button></div></td></tr><tr><td class="itemname-width"><label for="selectSSID" class="form-label">SSID 選択</label><select expr73="expr73" class="form-select form-select-sm" aria-label="WiFiStationList" name="WiFiStationList" id="WiFiStationList"></select><label for="inputSSIDPassword" class="form-label">Password</label><input expr74="expr74" type="password" class="form-control" id="inputSSIDPassword"/><div expr75="expr75" class="form-check form-switch"><input expr76="expr76" class="form-check-input" type="checkbox"/> </div><button expr77="expr77" type="submit" id="ssidSubmit" class="btn btn-outline-primary btn-sm" style="margin-top: 5px;"><span class="spinner-border spinner-border-sm visually-hidden" role="status" aria-hidden="true"></span>\r\n                  Connection\r\n                </button></td></tr></table></div><h5 class="card-title">STA 自動接続</h5><p class="card-text"><div expr78="expr78" class="col-sm-11 offset-sm-1 form-check form-switch"><input expr79="expr79" class="form-check-input" type="checkbox" type="checkbox"/> </div></p></p></div></div></div><div class="col-md-12"><div class="card h-100"><div class="card-header">\r\n      WiFi Log message\r\n    </div><div class="card-body"><div id="logWiFi" style="overflow-y: scroll; height: 200px; border: 1px solid #ccc;padding: 10px;"></div></div></div></div></div>',
    [
      {
        redundantAttribute: 'expr68',
        selector: '[expr68]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.stamodeSsid
          }
        ]
      },
      {
        redundantAttribute: 'expr69',
        selector: '[expr69]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.stamodeIp
          }
        ]
      },
      {
        redundantAttribute: 'expr70',
        selector: '[expr70]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.apmodeSsid
          }
        ]
      },
      {
        redundantAttribute: 'expr71',
        selector: '[expr71]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 0,
            evaluate: _scope => _scope.apmodeIp
          }
        ]
      },
      {
        redundantAttribute: 'expr72',
        selector: '[expr72]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.getWifiStaList
          }
        ]
      },
      {
        redundantAttribute: 'expr73',
        selector: '[expr73]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onchange',
            evaluate: _scope => _scope.changeWiFiStationList
          }
        ]
      },
      {
        redundantAttribute: 'expr74',
        selector: '[expr74]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => _scope.wifiSsidPassDisable
          }
        ]
      },
      {
        redundantAttribute: 'expr75',
        selector: '[expr75]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tWifiConectCheck
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr76',
        selector: '[expr76]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.wifiConectToggle
          }
        ]
      },
      {
        redundantAttribute: 'expr77',
        selector: '[expr77]',

        expressions: [
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.wifiSetting
          },
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'disabled',
            evaluate: _scope => !_scope.wifiConectCheck
          }
        ]
      },
      {
        redundantAttribute: 'expr78',
        selector: '[expr78]',

        expressions: [
          {
            type: expressionTypes.TEXT,
            childNodeIndex: 1,

            evaluate: _scope => [
              _scope.tWifiStaAutoUseCheck
            ].join(
              ''
            )
          }
        ]
      },
      {
        redundantAttribute: 'expr79',
        selector: '[expr79]',

        expressions: [
          {
            type: expressionTypes.ATTRIBUTE,
            name: 'checked',
            evaluate: _scope => _scope.wifiStaAutoUseCheck
          },
          {
            type: expressionTypes.EVENT,
            name: 'onclick',
            evaluate: _scope => _scope.wifiStaAutoUseToggle
          }
        ]
      }
    ]
  ),

  name: 'wificonf'
});;(() => {
  if (false) {}
})()

/***/ }),

/***/ "./src/model/vfdControllerDomain.js":
/*!******************************************!*\
  !*** ./src/model/vfdControllerDomain.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   vfdControllerDomain: () => (/* binding */ vfdControllerDomain)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
//import {json} from '../../data.js';

var vfdControllerDomain = /*#__PURE__*/function () {
  function vfdControllerDomain(initialSetting) {
    _classCallCheck(this, vfdControllerDomain);
    console.log("-- vfdControllerDomain : initialSetting --");
    //        console.log(this);
    //        console.log(initialSetting);
    this.jsonObj = JSON.parse(initialSetting);
    this.resetJsonTmpData();
    //        console.log(this.jsonObj);
    //        console.log("initialSetting");
    this.ws = null;
    this.reconnectInterval = 5000; // 5秒ごとに再接続を試みる
  }
  _createClass(vfdControllerDomain, [{
    key: "matrixDataIni",
    value: function matrixDataIni() {
      //  this.rows = rows;
      //  this.cols = cols;
      this.bgcolor = 'rgb(0, 0, 0)';
      this.dotcolor = 'rgb(255, 0, 0)';
      //      this.colorMatrix = this.createColorMatrix(this.rows, this.cols, this.bgcolor); // 全てのドットを黒で初期化
    }
    /*
        getColorMatrix(rows,cols){
          return this.colorMatrix[rows][cols];
        }
    */
    /*
        // 色情報を持つ2次元配列を初期化するメソッド
        createColorMatrix(rows, cols, initialColor) {
          return Array.from({ length: rows }, () => Array.from({ length: cols }, () => initialColor));
        }
    */
    /*        // ドットの色を切り替えるロジックを更新
    toggleDot(row, col, dotElement) {
      let newColor;
      if (dotElement.style.backgroundColor != this.dotcolor) {
        newColor = this.dotcolor;   // 黒から設定色へ
      } else {
        newColor = this.bgcolor;    // 設定色から黒へ
      }
      dotElement.style.backgroundColor = newColor;    // 色を切り替え
      this.colorMatrix[row][col] = newColor;          // 配列の色情報を更新
    }
    */

    // -- センサ情報コールバック設定 --
  }, {
    key: "setSensorDataCallback",
    value: function setSensorDataCallback(callbackFunc) {
      console.log("-- setSensorDataCallback : Callback Setting --");
      this._callbackFuncSensorData = callbackFunc;
    }
    // -- 時刻情報コールバック設定 --
  }, {
    key: "setTimeDataCallback",
    value: function setTimeDataCallback(callbackFunc) {
      console.log("-- setTimeDataCallback : Callback Setting --");
      this._callbackFuncTimaData = callbackFunc;
    }
    // -- WiFiStation情報コールバック設定 --
  }, {
    key: "setWiFiStationListCallback",
    value: function setWiFiStationListCallback(callbackFunc) {
      console.log("-- setWiFiStationListCallback : Callback Setting --");
      this._callbackFuncWiFiStationList = callbackFunc;
    }
    // -- WebSocket情報コールバック設定 --
  }, {
    key: "setWebSocketDataCallback",
    value: function setWebSocketDataCallback(callbackFunc) {
      console.log("-- setWebSocketDataCallback : Callback Setting --");
      this._callbackFuncWebSocketData = callbackFunc;
    }
    // -- WebSocket送信コールバック設定 --
  }, {
    key: "setWebsocketSendCallback",
    value: function setWebsocketSendCallback(callbackFunc) {
      console.log("-- setWebsocketSendCallback : Callback Setting --");
      this._callbackFuncWebsocketSend = callbackFunc;
    }

    // --  WebSocket初期化 --
  }, {
    key: "websocketInit",
    value: function websocketInit() {
      var _this = this;
      console.log("websocketInit : webSocketSet:");
      //        this.ws = new WebSocket('ws://' + window.location.hostname + ':81/');
      this.ws = new WebSocket('ws://' + window.location.hostname + '/ws');
      this.ws.onmessage = function (evt) {
        console.log("webSocket onmessage:");
        console.log(evt.data);
        var objData = JSON.parse(evt.data);
        //        console.log(objData.stationList);
        //            console.log(objData);
        //            console.log(Object.keys(objData['sensor']).length);
        //            console.log(objData.sensor);
        //            console.log(objData.sensor[0]);
        //            let sensorDat = [];
        //            for(let i in objData.sensor){
        //                console.log(objData.sensor[i]);
        //                sensorDat.push(objData.sensor[i]);
        //            }
        //            var Time = new Date().toLocaleTimeString();

        if (!(typeof objData.sensor === "undefined")) {
          _this._callbackFuncSensorData(objData); // 受信データ処理コールバック
        }

        if (!(typeof objData.time === "undefined")) {
          _this._callbackFuncTimaData(objData.time);
        }
        _this._callbackFuncWebSocketData(objData);
        if (!(typeof objData.stationList === "undefined")) {
          _this._callbackFuncWiFiStationList(objData.stationList);
        }
      };
      this.ws.onclose = function (evt) {
        console.log("ws: onclose");
        //      this._reconnectWebSocket();
        //          let objData = "{\"websocket\" : \"close\"}";
        //          this._callbackFuncWebsocketSend(objData);
      };

      this.ws.onerror = function (evt) {
        console.log("ws: onerror");
        console.log(evt);
        this.ws.close(); // エラーが発生した場合に接続をクローズ
      };

      this.ws.onopen = function (evt) {
        console.log("ws: onopen");
        var objData = "{\"websocket\" : \"open\"}";
        _this._callbackFuncWebsocketSend(objData);
      };
    }
    // WebSocketの再接続を試みる
  }, {
    key: "_reconnectWebSocket",
    value: function _reconnectWebSocket() {
      var _this2 = this;
      setTimeout(function () {
        console.log("Attempting to reconnect WebSocket...");
        _this2.websocketInit();
      }, this.reconnectInterval);
    }

    // --  WebSocket データ送信 --
  }, {
    key: "websocketSend",
    value: function websocketSend(sendData) {
      console.log("--websocketSend");
      console.log(sendData);
      console.log("WebSocket.readyState:" + this.ws.readyState);
      var ret = this.ws.readyState;
      if (ret == "1") {
        this.ws.send(sendData);
      } else {
        console.log("Cannot Send data.");
      }
      return ret;
    }
  }, {
    key: "resetJsonTmpData",
    value: function resetJsonTmpData() {
      if (this.jsonObj.hasOwnProperty('brDig')) {
        this.jsonObj.brDigtmp = Array.from(this.jsonObj.brDig); // brDigtmp作成
      } else {
        this.jsonObj.brDig = Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        this.jsonObj.brDigtmp = Array.from(this.jsonObj.brDig);
      }
      if (this.jsonObj.hasOwnProperty('glowInTheBright')) {
        this.jsonObj.glowInTheBrighttmp = this.jsonObj.glowInTheBright; // 表示輝度設定画面表示用初期値
      }

      if (this.jsonObj.hasOwnProperty('glowInTheDark')) {
        this.jsonObj.glowInTheDarktmp = this.jsonObj.glowInTheDark; // 表示輝度設定画面表示用初期値
      }
    }
  }, {
    key: "resetBrSetting",
    value: function resetBrSetting() {
      console.log("resetBrSetting");
      this.jsonObj.brDigtmp = Array.from(this.jsonObj.brDig);
      //        this.jsonObj.fadeTimetmp = this.jsonObj.fadeTime;
      //        this.jsonObj.formatHourtmp = this.jsonObj.formatHour;
      //        this.jsonObj.glowBrighttmp = this.jsonObj.glowBright;
      //        this.jsonObj.glowDarktmp = this.jsonObj.glowDark;
    }
  }, {
    key: "writeBrSetting",
    value: function writeBrSetting() {
      console.log("writeBrSetting");
      this.jsonObj.brDig = Array.from(this.jsonObj.brDigtmp);
      //        this.jsonObj.fadeTime = this.jsonObj.fadeTimetmp;
      //        this.jsonObj.formatHour = this.jsonObj.formatHourtmp;
      //        this.jsonObj.glowBright = this.jsonObj.glowBrighttmp;
      //        this.jsonObj.glowDark = this.jsonObj.glowDarktmp;
    }

    // setting.js JSON情報取得
  }, {
    key: "getSettingJsonItem",
    value: function getSettingJsonItem(item) {
      for (var _len = arguments.length, _ref = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        _ref[_key - 1] = arguments[_key];
      }
      var num = _ref[0];
      var data;
      if (typeof num === "number") {
        data = this.jsonObj[item][num - 1];
      } else {
        data = this.jsonObj[item];
      }
      //        console.log("getSettingJsonItem:" + item + ":" + data);
      if (typeof data === 'undefined') {
        data = 0;
      }
      return data;
    }
    // setting.js JSON情報設定
  }, {
    key: "setSettingJsonItem",
    value: function setSettingJsonItem(item, data) {
      for (var _len2 = arguments.length, _ref2 = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        _ref2[_key2 - 2] = arguments[_key2];
      }
      var num = _ref2[0];
      console.log("- setSettingJsonItem -");
      var ret;
      if (typeof num === "number") {
        this.jsonObj[item][num - 1] = data;
        //        console.log(this.jsonObj[item]);
        ret = this.jsonObj[item][num - 1];
      } else {
        this.jsonObj[item] = data;
        ret = this.jsonObj[item];
      }
      console.log(this.jsonObj[item]);
      //        console.log(this.jsonObj);
      return ret;
    }

    // -- JSONデータ POST送信 --
  }, {
    key: "jsonPost",
    value: function jsonPost(sendData) {
      var xhr = new XMLHttpRequest();
      //        xhr.onreadystatechange = function(){
      xhr.onreadystatechange = function (evt) {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            // 受信したデータの処理を記述する
            console.log("200!");
          }
        }
      };
      xhr.open('POST', '/');
      xhr.setRequestHeader('content-type', 'application/JSON;charset=UTF-8');
      xhr.send(sendData);
      return;
    }
  }]);
  return vfdControllerDomain;
}();

/***/ }),

/***/ "./src/view/appmain.js":
/*!*****************************!*\
  !*** ./src/view/appmain.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StartModelSelection: () => (/* binding */ StartModelSelection)
/* harmony export */ });
/* harmony import */ var _riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @riotjs/hot-reload */ "./node_modules/@riotjs/hot-reload/index.js");
/* harmony import */ var _riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var riot__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! riot */ "./node_modules/riot/riot.esm.js");
/* harmony import */ var _app_main_riot__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-main.riot */ "./src/view/app-main.riot");
/* harmony import */ var _viewmodel_vmapp_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../viewmodel/vmapp.js */ "./src/viewmodel/vmapp.js");
/* harmony import */ var _riotjs_observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @riotjs/observable */ "./node_modules/@riotjs/observable/dist/observable.js");
/* harmony import */ var _riotjs_observable__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_riotjs_observable__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _viewmodel_vmDotMatrix_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../viewmodel/vmDotMatrix.js */ "./src/viewmodel/vmDotMatrix.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }






function StartModelSelection() {
  new ModelselectionApp();
}
var ModelselectionApp = /*#__PURE__*/_createClass(function ModelselectionApp() {
  _classCallCheck(this, ModelselectionApp);
  console.log("ModelselectionApp.constructor");
  this.UI = new _viewmodel_vmapp_js__WEBPACK_IMPORTED_MODULE_2__.vfdControllerUI(_initial_setting_);
  var vmUI = this.UI;
  this.dotUI = new _viewmodel_vmDotMatrix_js__WEBPACK_IMPORTED_MODULE_4__.DotMatrixUI();
  var dotMatrixUI = this.dotUI;
  console.log(dotMatrixUI.colorMatrix);

  // websocket処理初期化
  vmUI.websocketInit();
  var obs = _riotjs_observable__WEBPACK_IMPORTED_MODULE_3___default()(this);
  (0,riot__WEBPACK_IMPORTED_MODULE_5__.component)(_app_main_riot__WEBPACK_IMPORTED_MODULE_1__["default"])(document.getElementById('appmain'), {
    vmUI: vmUI,
    dotMatrixUI: dotMatrixUI,
    obs: obs
  });
});

/***/ }),

/***/ "./src/viewmodel/setting.js":
/*!**********************************!*\
  !*** ./src/viewmodel/setting.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelselectionSetting: () => (/* binding */ ModelselectionSetting)
/* harmony export */ });
/* harmony import */ var i18next__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! i18next */ "./node_modules/i18next/dist/esm/i18next.js");
/* harmony import */ var _locales_en_menu_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../locales/en/menu.json */ "./src/locales/en/menu.json");
/* harmony import */ var _locales_ja_menu_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../locales/ja/menu.json */ "./src/locales/ja/menu.json");
/* harmony import */ var _infra_timezone_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../infra/timezone.json */ "./src/infra/timezone.json");
/* harmony import */ var _locales_en_tzlang_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../locales/en/tzlang.json */ "./src/locales/en/tzlang.json");
/* harmony import */ var _locales_ja_tzlang_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../locales/ja/tzlang.json */ "./src/locales/ja/tzlang.json");
/* harmony import */ var _infra_timezoneArea_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../infra/timezoneArea.json */ "./src/infra/timezoneArea.json");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/*
  Webインタフェースのリソース情報の読み込みを行う。
  
*/


//import {langData} from '../infra/vfdi18n.js'






//import timezoneList from '../infra/timezone.js'

var ModelselectionSetting = /*#__PURE__*/function () {
  function ModelselectionSetting(model) {
    _classCallCheck(this, ModelselectionSetting);
    console.log("== Setting.js ==");
    this.model = model;
    //    this.event = event;

    // 初期値設定
    var initValue = this._getInitialSettings();

    // LocaleId初期値取得
    var localesIndex = this.model.getSettingJsonItem("localesId");
    if (localesIndex == 0) {
      this.model.localesId = "ja";
    } else if (localesIndex == 1) {
      this.model.localesId = "en";
    } else {
      this.model.localesId = initValue.localesId; // this.model.localesId が無効値の場合
    }

    // TimeZone 設定
    this.model.timezone = _infra_timezone_json__WEBPACK_IMPORTED_MODULE_3__;
    //    console.log(this.model.timezone);

    this.model.timezoneArea = _infra_timezoneArea_json__WEBPACK_IMPORTED_MODULE_6__;
    //    console.log(this.model.timezoneArea);

    //    model.setLanguage(this.localeID);
    //    langData.lng = this.localeID;
    //    langData.resources.en.translation = enTranslation;
    //    langData.resources.jp.translation = jpTranslation;
    Object.assign(_locales_en_menu_json__WEBPACK_IMPORTED_MODULE_1__, _locales_en_tzlang_json__WEBPACK_IMPORTED_MODULE_4__);
    Object.assign(_locales_ja_menu_json__WEBPACK_IMPORTED_MODULE_2__, _locales_ja_tzlang_json__WEBPACK_IMPORTED_MODULE_5__);
    var rs = {
      en: {
        translation: _locales_en_menu_json__WEBPACK_IMPORTED_MODULE_1__
      },
      ja: {
        translation: _locales_ja_menu_json__WEBPACK_IMPORTED_MODULE_2__
      }
    };
    //    i18next.init(langData);
    i18next__WEBPACK_IMPORTED_MODULE_0__["default"].init({
      //  lng: this.localeID,
      lng: this.model.localesId,
      fallbackLng: 'ja',
      debug: false,
      resources: rs
    });
    //  i18next.changeLanguage('ja');
    //  i18next.changeLanguage(this.model.localesId);
    this.setLanguage(this.model.localesId);
    this.model.eventName = {
      0x10: "0x10:EVENT_BOOT_TASKDEVICECTRL",
      0x11: "0x11:イベント遅延書き込み",
      0x20: "0x20:RTC時刻設定",
      0x21: "0x21:SNTP処理要求",
      0x22: "0x22:SNTP取得 設定時刻接続動作要求",
      0x23: "0x23:SNTP取得 接続動作完了",
      0x24: "0x24:SNTP取得 起動時接続動作要求",
      0x80: "0x80:WiFi自動接続",
      0x81: "0x81:WiFi自動接続完了",
      0x82: "0x82:SNTP処理完了",
      0x83: "0x83:SNTP処理タイムアウト",
      0x84: "0x84:手動接続・WiFi APモード起動",
      0x85: "0x85:手動接続・WiFi APモード起動失敗",
      0x86: "0x86:手動接続・WiFi APモード起動完了",
      0x87: "0x87:手動接続・WiFi STA起動",
      0x88: "0x88:手動接続・WiFi STA接続完了",
      0x89: "0x89:STA再接続・切断",
      0x8A: "0x8A:STA再接続・接続",
      0x8B: "0x8B:SSID削除",
      0x8C: "0x8C:STA再接続・接続完了",
      0x8D: "0x8D:WiFI切断",
      0x8E: "0x8E:STA接続エラー・タイムアウト",
      0x8F: "0x8F:WiFI手動中断",
      0xA0: "0xA0:WiFi SSID 検索",
      0xA1: "0xA1:WiFi SSID 検索完了"
    };
  }

  // -- 言語設定 --
  _createClass(ModelselectionSetting, [{
    key: "setLanguage",
    value: function setLanguage(localeID) {
      //      this.localeID = localeID;
      i18next__WEBPACK_IMPORTED_MODULE_0__["default"].changeLanguage(localeID);
    }
    // -- 設定言語取得 --
    //  getLanguage(){
    //      return this.localeID;
    //  }
  }, {
    key: "_getInitialSettings",
    value: function _getInitialSettings() {
      var initValue = {};
      initValue.localesId = 'ja';
      return initValue;
    }
  }]);
  return ModelselectionSetting;
}();

/***/ }),

/***/ "./src/viewmodel/vmDotMatrix.js":
/*!**************************************!*\
  !*** ./src/viewmodel/vmDotMatrix.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DotMatrixUI: () => (/* binding */ DotMatrixUI)
/* harmony export */ });
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DotMatrixUI = /*#__PURE__*/function () {
  function DotMatrixUI() {
    _classCallCheck(this, DotMatrixUI);
    console.log("-- DotMatrixUI constructor --");
    this.imageCounter = 0;
    this.animationInterval = null;
    this.rows = 8;
    this.cols = 16;
    this.dotcolor = 'rgb(255, 0, 0)';
    this.bgcolor = 'rgb(0, 0, 0)';

    // ドットマトリクス編集領域情報初期化
    this.colorMatrix = [];
    this.clearMatrix();
    console.log(this.colorMatrix);

    // アニメーション情報初期化
    this.animationData = [];
    // 転送用情報初期化
    this.submitData = [];
  }

  // ドットマトリクス編集領域情報作成
  _createClass(DotMatrixUI, [{
    key: "createColorMatrix",
    value: function createColorMatrix(rows, cols, initialColor) {
      return Array.from({
        length: rows
      }, function () {
        return Array.from({
          length: cols
        }, function () {
          return initialColor;
        });
      });
    }
    // ドットマトリクス編集領域情報クリア
  }, {
    key: "clearMatrix",
    value: function clearMatrix() {
      this.colorMatrix = this.createColorMatrix(this.rows, this.cols, this.bgcolor);
    }
  }, {
    key: "setDotcolor",
    value: function setDotcolor(color) {
      this.dotcolor = color;
    }

    // 指定位置のデータの色を反転し、新しい色を返す
  }, {
    key: "toggleDot",
    value: function toggleDot(row, col) {
      var newColor = this.colorMatrix[row][col] !== this.dotcolor ? this.dotcolor : this.bgcolor;
      this.colorMatrix[row][col] = newColor;
      return newColor;
    }

    // 画像データをアニメーション情報と転送用情報に追加
  }, {
    key: "addMiniImageData",
    value: function addMiniImageData(index) {
      var _this = this;
      // メソッド内の実装を追加
      console.log("addMiniImageData");
      var mxTmp = this.colorMatrix.flat(); // 一次元配列に変換
      this.animationData.splice(index + 1, 0, mxTmp); //アニメーション情報に追加する

      var mxColorDat = mxTmp.map(function (x) {
        return _this.convertColorToRGB(x);
      }); //転送用データに変換
      this.submitData.splice(index + 1, 0, mxColorDat); // 転送用情報に追加する
      console.log(this.animationData);
    }

    // 指定したアニメーションデータをドットマトリクス編集領域情報に設定する。
  }, {
    key: "setColorMatrix",
    value: function setColorMatrix(index) {
      console.log("削除番号", index);
      for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 16; col++) {
          this.colorMatrix[row][col] = this.animationData[index][row * this.cols + col];
        }
      }
    }

    // アニメーション情報、転送用情報の削除
  }, {
    key: "deleteMiniImageData",
    value: function deleteMiniImageData(index) {
      this.animationData.splice(index, 1);
      //    console.log(this.animationData);

      this.submitData.splice(index, 1);
      //    console.log(this.submitData);
    }
  }, {
    key: "convertColorToRGB",
    value: function convertColorToRGB(colorString) {
      // 色の文字列からRGB値を抽出する
      var rgbArray = colorString.match(/\d+/g);
      // RGB値をオブジェクトに変換する
      var rgbObject = {
        r: parseInt(rgbArray[0]),
        g: parseInt(rgbArray[1]),
        b: parseInt(rgbArray[2])
      };
      var colorCode = 0;
      if (rgbArray[0] != 0) {
        colorCode += 1;
      }
      if (rgbArray[1] != 0) {
        colorCode += 2;
      }
      if (rgbArray[2] != 0) {
        colorCode += 4;
      }
      //      console.log(colorCode + "\n");
      var colorObject = {
        c: parseInt(colorCode)
      };
      return colorObject;
      //      return rgbObject;
    }
  }, {
    key: "convertCodeToString",
    value: function convertCodeToString(code) {
      var color = "";
      switch (code) {
        case 0:
          color = "rgb(0, 0, 0)";
          break;
        case 1:
          color = "rgb(255, 0, 0)";
          break;
        case 2:
          color = "rgb(0, 255, 0)";
          break;
        case 3:
          color = "rgb(255, 255, 0)";
          break;
        case 4:
          //        color = "rgb(65, 105, 255)";
          color = "rgb(0, 0, 255)";
          break;
        default:
          console.log("Invalid color code");
          return;
        // 無効なdotColorの場合は何もしない
      }

      return color;
    }
  }, {
    key: "updateMiniImagesIndexes",
    value: function updateMiniImagesIndexes() {
      // メソッド内の実装を追加
    }
  }, {
    key: "updateMiniImageSelector",
    value: function updateMiniImageSelector() {
      // メソッド内の実装を追加
    }
  }, {
    key: "animationTest",
    value: function animationTest() {
      // メソッド内の実装を追加
    }
  }]);
  return DotMatrixUI;
}();

/***/ }),

/***/ "./src/viewmodel/vmapp.js":
/*!********************************!*\
  !*** ./src/viewmodel/vmapp.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DotMatrix: () => (/* binding */ DotMatrix),
/* harmony export */   vfdControllerUI: () => (/* binding */ vfdControllerUI)
/* harmony export */ });
/* harmony import */ var _model_vfdControllerDomain__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/vfdControllerDomain */ "./src/model/vfdControllerDomain.js");
/* harmony import */ var _setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./setting */ "./src/viewmodel/setting.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
//import { websocketSend, webSocketSet, vfdControllerDomain } from "../model/vfdControllerDomain";

//import { setSensorData } from './view/dashbord.tag';

var DotMatrix = /*#__PURE__*/_createClass(function DotMatrix() {
  _classCallCheck(this, DotMatrix);
});
var vfdControllerUI = /*#__PURE__*/function () {
  function vfdControllerUI(initialSetting) {
    _classCallCheck(this, vfdControllerUI);
    this.model = new _model_vfdControllerDomain__WEBPACK_IMPORTED_MODULE_0__.vfdControllerDomain(initialSetting);
    this.setting = new _setting__WEBPACK_IMPORTED_MODULE_1__.ModelselectionSetting(this.model);

    //console.log(this.model.timezone);

    this.model.setSensorDataCallback(this.getSensorData.bind(this));
    this.model.setTimeDataCallback(this.getTimeData.bind(this));
    // Websocket取得コールバック設定
    this.model.setWebSocketDataCallback(this.getWebsocketData.bind(this));
    // WiFiStaList取得　コールバック設定
    this.model.setWiFiStationListCallback(this.getWifiList.bind(this));
    // WebSocket送信コールバック設定
    this.model.setWebsocketSendCallback(this.submitWebsocket.bind(this));

    // LogMessage初期化
    this.logdata = "Log start.<br>";
    this.sntpLogdata = "SNTP Log start.<br>";
    console.log(this.logdata);
    this.eventLogName = this.model.eventName;
    /*        this.eventLogName = {
              0x10:"0x10:EVENT_BOOT_TASKDEVICECTRL",
              0x11:"0x11:イベント遅延書き込み",
              0x20:"0x20:RTC時刻設定", 0x21:"0x21:SNTP処理要求",
              0x22:"0x22:SNTP取得 設定時刻接続動作要求",0x23:"0x23:SNTP取得 接続動作完了",
              0x24:"0x24:SNTP取得 起動時接続動作要求",
              0x80:"0x80:WiFi自動接続", 0x81:"0x81:WiFi自動接続完了",
              0x82:"0x82:SNTP処理完了", 0x83:"0x83:SNTP処理タイムアウト",
              0x84:"0x84:手動接続・WiFi APモード起動", 0x85:"0x85:手動接続・WiFi APモード起動失敗",
              0x86:"0x86:手動接続・WiFi APモード起動完了", 0x87:"0x87:手動接続・WiFi STA起動",
              0x88:"0x88:手動接続・WiFi STA接続完了", 0x89:"0x89:STA再接続・切断",
              0x8A:"0x8A:STA再接続・接続", 0x8B:"0x8B:SSID削除",
              0x8C:"0x8C:STA再接続・接続完了", 0x8D:"0x8D:WiFI切断",
              0x8E:"0x8E:STA接続エラー・タイムアウト", 0x8F:"0x8F:WiFI手動中断",
              0xA0:"0xA0:WiFi SSID 検索", 0xA1:"0xA1:WiFi SSID 検索完了"
            };
    */
    var SenserDataX1;
    var SenserDataX2;
  }
  /*
      constructor(containerId, rows, cols, dotcolor) {
        this.containerId = containerId;
        this.rows = rows;
        this.cols = cols;
        this.dotcolor = dotcolor;
        this.bgcolor = 'rgb(0, 0, 0)';
        this.colorMatrix = this.createColorMatrix(rows, cols, this.bgcolor); // 全てのドットを黒で初期化
        this.container = document.getElementById(containerId);
        this.initMatrix();
      }
  */
  // 色情報を持つ2次元配列を初期化するメソッド
  //    createColorMatrix(rows, cols, initialColor) {
  //      return Array.from({ length: rows }, () => Array.from({ length: cols }, () => initialColor));
  //    }
  /*    
      initMatrix(containerId, rows, cols, dotcolor) {
        this.containerId = containerId;
        this.rows = rows;
        this.cols = cols;
        this.dotcolor = dotcolor;
        this.bgcolor = 'rgb(0, 0, 0)';
      //  this.colorMatrix = model.createColorMatrix(rows, cols, this.bgcolor); // 全てのドットを黒で初期化
        this.container = document.getElementById(containerId);
        this.model.matrixDataIni(rows, cols);
      
        this.container.innerHTML = ''; // コンテナをクリア
        for (let row = 0; row < this.rows; row++) {
          for (let col = 0; col < this.cols; col++) {
            const dotElement = document.createElement('div');
            dotElement.className = 'dot';
  //          dotElement.style.backgroundColor = model.colorMatrix[row][col]; // 色情報を配列から取得して適用
            dotElement.style.backgroundColor = this.model.getColorMatrix(row,col); // 色情報を配列から取得して適用
  //          dotElement.addEventListener('click', () => this.model.toggleDot(row, col, dotElement));
            this.dotElementEventSet(row, col, dotElement);
            this.container.appendChild(dotElement);
          }
          this.container.appendChild(document.createElement('br'));
        }
      }
  */
  /*
      dotElementEventSet(row, col, dotElement)
      {
        dotElement.addEventListener('click', () => this.model.toggleDot(row, col, dotElement));
      }
      matrixDataIni(rows, cols)
      {
        this.model.matrixDataIni(rows, cols);
      }
      getColorMatrix(row,col)
      {
        this.model.getColorMatrix(row,col);
      }
  */
  // ドットの色を切り替えるロジックを更新
  /*    toggleDot(row, col, dotElement) {
        let newColor;
        if (dotElement.style.backgroundColor != this.dotcolor) {
          newColor = this.dotcolor;   // 黒から設定色へ
        } else {
          newColor = this.bgcolor;    // 設定色から黒へ
        }
        dotElement.style.backgroundColor = newColor;    // 色を切り替え
        this.colorMatrix[row][col] = newColor;          // 配列の色情報を更新
      }
  */
  _createClass(vfdControllerUI, [{
    key: "websocketInit",
    value: function websocketInit(sensorDataSet) {
      this.model.websocketInit();
    }
    //
  }, {
    key: "setNtpLastUpdateTImeCallback",
    value: function setNtpLastUpdateTImeCallback(callbackFunc) {
      console.log("-- vmapp : NtpLastUpdateTImeCallback : Callback Setting --");
      this._callbackFuncNtpLastUpdateTIme = callbackFunc;
    }
    // WiFi Station 接続情報更新　コールバック設定
  }, {
    key: "updateStaConnStsCallback",
    value: function updateStaConnStsCallback(callbackFunc) {
      console.log("-- vmapp : StaSsidUpdateCallback : Callback Setting --");
      this._callbackFuncUpdateStaConnSts = callbackFunc;
    }
    // DashBord EventLog 更新コールバック設定
  }, {
    key: "updateDashBordEventLogCallback",
    value: function updateDashBordEventLogCallback(callbackFunc) {
      console.log("-- vmapp : updateDashBordEventLogCallback : Callback Setting --");
      this._callbackFuncDashBordEventLog = callbackFunc;
    }
    // WiFi EventLog 更新コールバック設定
  }, {
    key: "updateEventLogCallback",
    value: function updateEventLogCallback(callbackFunc) {
      console.log("-- vmapp : updateEventLogCallback : Callback Setting --");
      this._callbackFuncWiFiEventLog = callbackFunc;
    }
    // SNTP SettingLog 更新コールバック設定
  }, {
    key: "updateSntpEventLogCallback",
    value: function updateSntpEventLogCallback(callbackFunc) {
      console.log("-- vmapp : updateSntpEventLogCallback : Callback Setting --");
      this._callbackFuncSNTPEventLog = callbackFunc;
    }
    // SNTP 手動更新完了コールバック設定
  }, {
    key: "clearSntpSpinnerCallback",
    value: function clearSntpSpinnerCallback(callbackFunc) {
      console.log("-- vmapp : clearSntpSpinnerCallback : Callback Setting --");
      this._callbackFuncClearSntpSpinner = callbackFunc;
    }
    // WiFi STA接続更新完了コールバック設定
  }, {
    key: "clearStaReConnectionCallback",
    value: function clearStaReConnectionCallback(callbackFunc) {
      console.log("-- vmapp : clearStaReConnectionCallback : Callback Setting --");
      this._callbackFuncClearStaReConnection = callbackFunc;
    }
    //
  }, {
    key: "getWebsocketData",
    value: function getWebsocketData(websocketData) {
      if (!(typeof websocketData.lastUpdate === "undefined")) {
        console.log("CallBack getWebsocketData lastUpdate : ");
        console.log(websocketData.lastUpdate);
        this._callbackFuncNtpLastUpdateTIme(websocketData.lastUpdate);
      }
      // WiFi Station 接続情報更新コールバック
      if (!(typeof websocketData.staSsid === "undefined")) {
        console.log("CallBack getWebsocketData staSsid : ");
        console.log(websocketData.staSsid);
        this._callbackFuncUpdateStaConnSts(websocketData);
      }
      // WiFi EventLog 更新コールバック
      if (!(typeof websocketData.eventLog === "undefined")) {
        console.log("CallBack getWebsocketData eventLog : ");
        console.log(websocketData.eventLog);
        console.log(this.logdata);
        // Log作成
        var logTmp = "";
        var eventName = this.eventLogName;
        websocketData.eventLog.forEach(function (obj) {
          var log = obj.year + "/" + obj.month + "/" + obj.day + " " + obj.hour + ":" + obj.min + ":" + obj.sec + " " + eventName[obj.event];
          log = log + ":" + obj.data[0] + ":" + obj.data[1] + ":" + obj.data[2] + ":" + obj.data[3] + ";";
          logTmp += log + "<br>";
        });
        console.log(logTmp);
        this.logdata += logTmp;
        this._callbackFuncWiFiEventLog(this.logdata);
        //    this._callbackFuncDashBordEventLog(this.logdata);

        // SNTP Log
        var sntpComp = false;
        var staReconnentComp = false;
        logTmp = "";
        websocketData.eventLog.forEach(function (obj) {
          if (obj.event >= 0x20 && obj.event <= 0x24 || obj.event == 0x82 || obj.event == 0x83) {
            var log = obj.year + "/" + obj.month + "/" + obj.day + " " + obj.hour + ":" + obj.min + ":" + obj.sec + " " + eventName[obj.event];
            logTmp += log + "<br>";
          }
          if (obj.event == 0x82) {
            // Event:SNTP処理完了
            sntpComp = true;
            console.log("-- SNTP Comp Spinner Clear. --");
          }
          if (obj.event == 0x8C) {
            // Event:STA再接続・接続完了
            staReconnentComp = true;
            console.log("-- STA Reconnect Comp Spinner Clear. --");
          }
        });
        console.log(logTmp);
        this.sntpLogdata += logTmp;
        //    this._callbackFuncSNTPEventLog(this.sntpLogdata);
        if (sntpComp) {
          this._callbackFuncClearSntpSpinner();
        }
        if (staReconnentComp) {
          this._callbackFuncClearStaReConnection();
        }
      }
    }
    // -- WiFi Station List 取得　コールバック設定 --
  }, {
    key: "setWiFiStationListCallback",
    value: function setWiFiStationListCallback(callbackFunc) {
      console.log("-- vmapp : getWiFiListCallback : Callback Setting --");
      this._callbackFuncWiFiStationList = callbackFunc;
    }
  }, {
    key: "getWifiList",
    value: function getWifiList(wifiStaList) {
      console.log("CallBack getWifiList : ");
      console.log(wifiStaList);
      this._callbackFuncWiFiStationList(wifiStaList);
    }
    // -- 時刻情報コールバック設定 --
  }, {
    key: "setTimeDataCallback",
    value: function setTimeDataCallback(callbackFunc) {
      this._callbackFuncTimaData = callbackFunc;
    }
  }, {
    key: "getTimeData",
    value: function getTimeData(TimeData) {
      //        console.log("-- vmapp : getTimeData --")
      this._callbackFuncTimaData(TimeData);
    }
    // -- センサ情報コールバック設定 --
  }, {
    key: "setSensorDataCallback",
    value: function setSensorDataCallback(callbackFunc) {
      console.log("-- vmapp : setSensorDataCallback : Callback Setting --");
      this._callbackFuncSensorData = callbackFunc;
    }
  }, {
    key: "getSensorData",
    value: function getSensorData(sensorData) {
      //        console.log("-- vfdControllerUI.getSensorData --");
      //        console.log(sensorData);
      /*        let data_x1 = JSON.parse(sensorData)["val1"];
              let data_x2 = JSON.parse(sensorData)["val2"];
              document.getElementById("temp").innerHTML = data_x1;
              document.getElementById("humidity").innerHTML = data_x2;
      */
      this._callbackFuncSensorData(sensorData);
    }

    //  --CallbackWebsocket送信
  }, {
    key: "submitWebsocket",
    value: function submitWebsocket(data) {
      console.log("submitWebsocket:" + data);
      return this.model.websocketSend(data);
    }

    // -- タイトル取得 --
  }, {
    key: "getTitle",
    value: function getTitle() {
      return this.model.getSettingJsonItem("title");
    }

    // -- ネットワーク情報取得 --
  }, {
    key: "getNetworkSetting",
    value: function getNetworkSetting(item) {
      return this.model.getSettingJsonItem(item);
    }

    // -- 表示設定情報取得 --
  }, {
    key: "getDisplaySetting",
    value: function getDisplaySetting(item) {
      for (var _len = arguments.length, _ref = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        _ref[_key - 1] = arguments[_key];
      }
      var num = _ref[0];
      return this.model.getSettingJsonItem(item, num);
    }
  }, {
    key: "setDisplaySetting",
    value: function setDisplaySetting(item, data) {
      for (var _len2 = arguments.length, _ref2 = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        _ref2[_key2 - 2] = arguments[_key2];
      }
      var num = _ref2[0];
      return this.model.setSettingJsonItem(item, data, num);
    }

    /*    getDisplaySetting(item){
            return this.model.getSettingJsonItem(item);
        }
    */
    // -- センサ表示フォーマットデータ設定 --
  }, {
    key: "getSensorFormat",
    value: function getSensorFormat() {
      //        let sensorFormat = this.model.getJsonItem("sensorFormat");
      var sensorFormat = [{
        "name": "温度",
        "index": -1,
        "toPrecision": 3
      }, {
        "name": "湿度",
        "index": -1,
        "toPrecision": 3
      }, {
        "name": "気圧",
        "index": 0
      }, {
        "name": "name4",
        "index": 0
      }, {
        "name": "name5",
        "index": 0
      }, {
        "name": "name6",
        "index": 0
      }, {
        "name": "name7",
        "index": 0
      }, {
        "name": "name8",
        "index": 0
      }];
      for (var i = 0; i < sensorFormat.length; i++) {
        sensorFormat[i].data = "sensor" + i;
      }
      return sensorFormat;
    }

    // -- 時計設定情報取得 --
  }, {
    key: "getClockSetting",
    value: function getClockSetting(item) {
      return this.model.getSettingJsonItem(item);
    }
    /*
        getBrightDig(item){
            return this.model.getBrightDig(item);
        }
    */
  }, {
    key: "getLastUpdateTime",
    value: function getLastUpdateTime() {
      var getLastUpdateTime;
      getLastUpdateTime = this.model.getSettingJsonItem("lastUpdateYear").toString() + "/";
      getLastUpdateTime += this.model.getSettingJsonItem("lastUpdateMonth").toString().padStart(2, "0") + "/";
      getLastUpdateTime += this.model.getSettingJsonItem("lastUpdateDay").toString().padStart(2, "0") + " ";
      getLastUpdateTime += this.model.getSettingJsonItem("lastUpdateHour").toString().padStart(2, "0") + ":";
      getLastUpdateTime += this.model.getSettingJsonItem("lastUpdateMin").toString().padStart(2, "0");
      return getLastUpdateTime;
    }
  }, {
    key: "timeConfNtpUsesubmit",
    value: function timeConfNtpUsesubmit(data) {
      console.log("timeConfNtpUsesubmit()");
      var jsondat;
      if (data == true) {
        //            jsondat = "true"
        jsondat = 1;
      } else {
        //            jsondat = "false"
        jsondat = 0;
      }
      this.model.jsonPost(this.makeWebsocketData("ntpSet", jsondat));
      return;
    }
  }, {
    key: "ntpdiffSubmit",
    value: function ntpdiffSubmit(hour, min) {
      console.log("ntpdiffSubmit()");
      var sendData;
      sendData = "{\"ntpDiffHour\" : \"" + hour + "\",\"ntpDiffMin\" : \"" + min + "\"}";
      console.log(sendData);
      this.model.jsonPost(sendData);
    }
  }, {
    key: "ntpAutoUpdateSubmit",
    value: function ntpAutoUpdateSubmit(hour, min) {
      console.log("ntpAutoUpdateSubmit()");
      var sendData;
      sendData = "{\"ntpAutoUpdateHour\" : \"" + hour + "\",\"ntpAutoUpdateMin\" : \"" + min + "\"}";
      console.log(sendData);
      this.model.jsonPost(sendData);
    }

    // 表示設定データ値設定
  }, {
    key: "submitDisplaySetting",
    value: function submitDisplaySetting(item, data) {
      for (var _len3 = arguments.length, _ref3 = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        _ref3[_key3 - 2] = arguments[_key3];
      }
      var num = _ref3[0];
      var ret;
      console.log("submitDisplaySetting:" + data + ":" + item + ":" + num);
      if (typeof num === "number") {
        ret = 0;
      } else {
        ret = this.model.setSettingJsonItem(item, data);
        this.model.websocketSend(this.makeWebsocketData(item, data));
      }
      return ret;
    }

    // tab切替情報送信
  }, {
    key: "submitChangeTab",
    value: function submitChangeTab(data) {
      console.log("submitChangeTab:" + data);
      this.model.websocketSend(this.makeWebsocketData("tabName", data));
    }

    // --  WebSocket送信データ作成 --
  }, {
    key: "makeWebsocketData",
    value: function makeWebsocketData(item, data) {
      var sendData;
      sendData = "{\"" + item + "\" : \"" + data + "\"}";
      console.log("sendData:");
      console.log(sendData);
      return sendData;
    }
  }, {
    key: "dispBrDigSubmit",
    value: function dispBrDigSubmit(num, data) {
      console.log("dispBrDigSubmit");
      var ret1, ret2;
      //    this.model.setBrdighitDigtmp(num,data);
      ret1 = this.model.setSettingJsonItem("brDigtmp", data, num);
      ret2 = this.model.websocketSend(this.makeBrightData(num, data));
      if (ret2 != 1) {// websocket not send
        //       ret1 = "";
      }
      return ret1;
    }
  }, {
    key: "makeBrightData",
    value: function makeBrightData(item, data) {
      var sendData;
      sendData = "{\"brDig\" : [";
      for (var count = 1; count < 9 + 1; count++) {
        sendData = sendData + this.model.getSettingJsonItem("brDigtmp", count);
        //            sendData = sendData + this.model.getBrightDigtmp(count);
        if (count != 9) {
          sendData = sendData + ",";
        }
      }
      sendData = sendData + "]}";
      //        console.log(sendData)

      return sendData;
    }
    // 
  }, {
    key: "resetBrSetting",
    value: function resetBrSetting() {
      console.log("vmapp.resetBrSetting");
      this.model.resetBrSetting();
      this.model.websocketSend(this.makeWebsocketData("resetBrSetting", 1));
      return;
    }
    // 
  }, {
    key: "writeBrSetting",
    value: function writeBrSetting() {
      console.log("vmapp.writeBrSetting");
      this.model.writeBrSetting();
      this.model.websocketSend(this.makeWebsocketData("writeBrSetting", 1));
      return;
    }
    /*
        NTPに接続して時刻を取得する
    */
  }, {
    key: "ntpConnect",
    value: function ntpConnect() {
      console.log("ntpConnect()");
      var sendData;
      sendData = "{\"ntpConnect\" : 1}";
      this.model.jsonPost(sendData);
      return;
    }
    /*
        RTC設定の送信データを作成
    */
  }, {
    key: "rtcDataSet",
    value: function rtcDataSet(rtcSetDataYear, rtcSetDataMon, rtcSetDataDay, rtcSetDataHour, rtcSetDataMin, rtcSetDataSec) {
      console.log("rtcDataSet()");
      var sendData;
      sendData = "{\"rtcSetYear\" : \"" + rtcSetDataYear + "\",";
      sendData = sendData + "\"rtcSetMon\" : \"" + rtcSetDataMon + "\",";
      sendData = sendData + "\"rtcSetDay\" : \"" + rtcSetDataDay + "\",";
      sendData = sendData + "\"rtcSetHour\" : \"" + rtcSetDataHour + "\",";
      sendData = sendData + "\"rtcSetMin\" : \"" + rtcSetDataMin + "\",";
      sendData = sendData + "\"rtcSetSec\" : \"" + rtcSetDataSec + "\"}";
      console.log(sendData);
      this.model.jsonPost(sendData);
      return;
    }
    /*
      WiFiアクセスポイントのリストを取得する
    */
  }, {
    key: "getWifiStaList",
    value: function getWifiStaList() {
      console.log("getWifiStaList()");
      //      this.model.jsonPost(this.makeWebsocketData("getWifiStaList",1))
      this.model.websocketSend(this.makeWebsocketData("getWifiStaList", 1));
      return;
    }

    // SSID設定情報を送信する
  }, {
    key: "postSsidSetting",
    value: function postSsidSetting(ssid, ssidPassword) {
      console.log("-- postSsidSetting()");
      var sendData = "{\"ssid\" : \"" + ssid + "\",";
      sendData = sendData + "\"ssidPassword\" : \"" + ssidPassword + "\"}";
      console.log(sendData);
      //      this.model.jsonPost(sendData);
      this.model.websocketSend(sendData);
    }
  }]);
  return vfdControllerUI;
}();

/***/ }),

/***/ "./node_modules/bianco.dom-to-array/index.next.js":
/*!********************************************************!*\
  !*** ./node_modules/bianco.dom-to-array/index.next.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ domToArray)
/* harmony export */ });
/**
 * Converts any DOM node/s to a loopable array
 * @param   { HTMLElement|NodeList } els - single html element or a node list
 * @returns { Array } always a loopable object
 */
function domToArray(els) {
  // can this object be already looped?
  if (!Array.isArray(els)) {
    // is it a node list?
    if (
      /^\[object (HTMLCollection|NodeList|Object)\]$/
        .test(Object.prototype.toString.call(els))
        && typeof els.length === 'number'
    )
      return Array.from(els)
    else
      // if it's a single node
      // it will be returned as "array" with one single entry
      return [els]
  }
  // this object could be looped out of the box
  return els
}

/***/ }),

/***/ "./node_modules/bianco.query/index.next.js":
/*!*************************************************!*\
  !*** ./node_modules/bianco.query/index.next.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ $)
/* harmony export */ });
/* harmony import */ var bianco_dom_to_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bianco.dom-to-array */ "./node_modules/bianco.dom-to-array/index.next.js");


/**
 * Simple helper to find DOM nodes returning them as array like loopable object
 * @param   { string|DOMNodeList } selector - either the query or the DOM nodes to arraify
 * @param   { HTMLElement }        scope      - context defining where the query will search for the DOM nodes
 * @returns { Array } DOM nodes found as array
 */
function $(selector, scope) {
  return (0,bianco_dom_to_array__WEBPACK_IMPORTED_MODULE_0__["default"])(typeof selector === 'string' ?
    (scope || document).querySelectorAll(selector) :
    selector
  )
}


/***/ }),

/***/ "./node_modules/bootstrap/dist/js/bootstrap.esm.js":
/*!*********************************************************!*\
  !*** ./node_modules/bootstrap/dist/js/bootstrap.esm.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Alert: () => (/* binding */ Alert),
/* harmony export */   Button: () => (/* binding */ Button),
/* harmony export */   Carousel: () => (/* binding */ Carousel),
/* harmony export */   Collapse: () => (/* binding */ Collapse),
/* harmony export */   Dropdown: () => (/* binding */ Dropdown),
/* harmony export */   Modal: () => (/* binding */ Modal),
/* harmony export */   Offcanvas: () => (/* binding */ Offcanvas),
/* harmony export */   Popover: () => (/* binding */ Popover),
/* harmony export */   ScrollSpy: () => (/* binding */ ScrollSpy),
/* harmony export */   Tab: () => (/* binding */ Tab),
/* harmony export */   Toast: () => (/* binding */ Toast),
/* harmony export */   Tooltip: () => (/* binding */ Tooltip)
/* harmony export */ });
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/index.js");
/* harmony import */ var _popperjs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @popperjs/core */ "./node_modules/@popperjs/core/lib/popper.js");
/*!
  * Bootstrap v5.3.2 (https://getbootstrap.com/)
  * Copyright 2011-2023 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */


/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/data.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Constants
 */

const elementMap = new Map();
const Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, new Map());
    }
    const instanceMap = elementMap.get(element);

    // make it clear we only want one instance per element
    // can be removed later when multiple key/instances are fine to be used
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      // eslint-disable-next-line no-console
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);

    // free up element references if there are no instances left for an element
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/index.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const MAX_UID = 1000000;
const MILLISECONDS_MULTIPLIER = 1000;
const TRANSITION_END = 'transitionend';

/**
 * Properly escape IDs selectors to handle weird IDs
 * @param {string} selector
 * @returns {string}
 */
const parseSelector = selector => {
  if (selector && window.CSS && window.CSS.escape) {
    // document.querySelector needs escaping to handle IDs (html5+) containing for instance /
    selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
  }
  return selector;
};

// Shout-out Angus Croll (https://goo.gl/pxwQGp)
const toType = object => {
  if (object === null || object === undefined) {
    return `${object}`;
  }
  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};

/**
 * Public Util API
 */

const getUID = prefix => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));
  return prefix;
};
const getTransitionDurationFromElement = element => {
  if (!element) {
    return 0;
  }

  // Get transition-duration of the element
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);

  // Return 0 if element or transition duration is not found
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }

  // If multiple durations are defined, take the first
  transitionDuration = transitionDuration.split(',')[0];
  transitionDelay = transitionDelay.split(',')[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
const triggerTransitionEnd = element => {
  element.dispatchEvent(new Event(TRANSITION_END));
};
const isElement = object => {
  if (!object || typeof object !== 'object') {
    return false;
  }
  if (typeof object.jquery !== 'undefined') {
    object = object[0];
  }
  return typeof object.nodeType !== 'undefined';
};
const getElement = object => {
  // it's a jQuery object or a node element
  if (isElement(object)) {
    return object.jquery ? object[0] : object;
  }
  if (typeof object === 'string' && object.length > 0) {
    return document.querySelector(parseSelector(object));
  }
  return null;
};
const isVisible = element => {
  if (!isElement(element) || element.getClientRects().length === 0) {
    return false;
  }
  const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible';
  // Handle `details` element as its content may falsie appear visible when it is closed
  const closedDetails = element.closest('details:not([open])');
  if (!closedDetails) {
    return elementIsVisible;
  }
  if (closedDetails !== element) {
    const summary = element.closest('summary');
    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }
    if (summary === null) {
      return false;
    }
  }
  return elementIsVisible;
};
const isDisabled = element => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }
  if (element.classList.contains('disabled')) {
    return true;
  }
  if (typeof element.disabled !== 'undefined') {
    return element.disabled;
  }
  return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
};
const findShadowRoot = element => {
  if (!document.documentElement.attachShadow) {
    return null;
  }

  // Can find the shadow root otherwise it'll return the document
  if (typeof element.getRootNode === 'function') {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }
  if (element instanceof ShadowRoot) {
    return element;
  }

  // when we don't find a shadow root
  if (!element.parentNode) {
    return null;
  }
  return findShadowRoot(element.parentNode);
};
const noop = () => {};

/**
 * Trick to restart an element's animation
 *
 * @param {HTMLElement} element
 * @return void
 *
 * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
 */
const reflow = element => {
  element.offsetHeight; // eslint-disable-line no-unused-expressions
};

const getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
    return window.jQuery;
  }
  return null;
};
const DOMContentLoadedCallbacks = [];
const onDOMContentLoaded = callback => {
  if (document.readyState === 'loading') {
    // add listener on the first call when the document is in loading state
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener('DOMContentLoaded', () => {
        for (const callback of DOMContentLoadedCallbacks) {
          callback();
        }
      });
    }
    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};
const isRTL = () => document.documentElement.dir === 'rtl';
const defineJQueryPlugin = plugin => {
  onDOMContentLoaded(() => {
    const $ = getjQuery();
    /* istanbul ignore if */
    if ($) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $.fn[name];
      $.fn[name] = plugin.jQueryInterface;
      $.fn[name].Constructor = plugin;
      $.fn[name].noConflict = () => {
        $.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};
const execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
  return typeof possibleCallback === 'function' ? possibleCallback(...args) : defaultValue;
};
const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }
    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler);
    execute(callback);
  };
  transitionElement.addEventListener(TRANSITION_END, handler);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};

/**
 * Return the previous/next element of a list.
 *
 * @param {array} list    The list of elements
 * @param activeElement   The active element
 * @param shouldGetNext   Choose to get next or previous element
 * @param isCycleAllowed
 * @return {Element|elem} The proper element
 */
const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement);

  // if the element does not exist in the list return an element
  // depending on the direction and if cycle is allowed
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }
  index += shouldGetNext ? 1 : -1;
  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }
  return list[Math.max(0, Math.min(index, listLength - 1))];
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/event-handler.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);

/**
 * Private methods
 */

function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn) {
  return function handler(event) {
    hydrateObj(event, {
      delegateTarget: element
    });
    if (handler.oneOff) {
      EventHandler.off(element, event.type, fn);
    }
    return fn.apply(element, [event]);
  };
}
function bootstrapDelegationHandler(element, selector, fn) {
  return function handler(event) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }
        hydrateObj(event, {
          delegateTarget: target
        });
        if (handler.oneOff) {
          EventHandler.off(element, event.type, selector, fn);
        }
        return fn.apply(target, [event]);
      }
    }
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
  const isDelegated = typeof handler === 'string';
  // TODO: tooltip passes `false` instead of selector, so we need to check
  const callable = isDelegated ? delegationFunction : handler || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent];
}
function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);

  // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
  // this prevents the handler from being dispatched the same way as mouseover or mouseout does
  if (originalTypeEvent in customEvents) {
    const wrapFunction = fn => {
      return function (event) {
        if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
          return fn.call(this, event);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
  const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
  fn.delegationSelector = isDelegated ? handler : null;
  fn.callable = callable;
  fn.oneOff = oneOff;
  fn.uidEvent = uid;
  handlers[uid] = fn;
  element.addEventListener(typeEvent, fn, isDelegated);
}
function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  const fn = findHandler(events[typeEvent], handler, delegationSelector);
  if (!fn) {
    return;
  }
  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
    }
  }
}
function getTypeEvent(event) {
  // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
  event = event.replace(stripNameRegex, '');
  return customEvents[event] || event;
}
const EventHandler = {
  on(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, false);
  },
  one(element, event, handler, delegationFunction) {
    addHandler(element, event, handler, delegationFunction, true);
  },
  off(element, originalTypeEvent, handler, delegationFunction) {
    if (typeof originalTypeEvent !== 'string' || !element) {
      return;
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith('.');
    if (typeof callable !== 'undefined') {
      // Simplest case: handler is passed, remove that listener ONLY.
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, event] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, '');
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
      }
    }
  },
  trigger(element, event, args) {
    if (typeof event !== 'string' || !element) {
      return null;
    }
    const $ = getjQuery();
    const typeEvent = getTypeEvent(event);
    const inNamespace = event !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    if (inNamespace && $) {
      jQueryEvent = $.Event(event, args);
      $(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }
    const evt = hydrateObj(new Event(event, {
      bubbles,
      cancelable: true
    }), args);
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }
    return evt;
  }
};
function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/manipulator.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

function normalizeData(value) {
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (value === Number(value).toString()) {
    return Number(value);
  }
  if (value === '' || value === 'null') {
    return null;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
}
const Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },
  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },
  getDataAttributes(element) {
    if (!element) {
      return {};
    }
    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, '');
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }
    return attributes;
  },
  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/config.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Class definition
 */

class Config {
  // Getters
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    return config;
  }
  _mergeConfigObj(config, element) {
    const jsonConfig = isElement(element) ? Manipulator.getDataAttribute(element, 'config') : {}; // try to parse

    return {
      ...this.constructor.Default,
      ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
      ...(isElement(element) ? Manipulator.getDataAttributes(element) : {}),
      ...(typeof config === 'object' ? config : {})
    };
  }
  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const [property, expectedTypes] of Object.entries(configTypes)) {
      const value = config[property];
      const valueType = isElement(value) ? 'element' : toType(value);
      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap base-component.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const VERSION = '5.3.2';

/**
 * Class definition
 */

class BaseComponent extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);
    if (!element) {
      return;
    }
    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }

  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }
  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }

  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }
  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap dom/selector-engine.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const getSelector = element => {
  let selector = element.getAttribute('data-bs-target');
  if (!selector || selector === '#') {
    let hrefAttribute = element.getAttribute('href');

    // The only valid content that could double as a selector are IDs or classes,
    // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
    // `document.querySelector` will rightfully complain it is invalid.
    // See https://github.com/twbs/bootstrap/issues/32273
    if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
      return null;
    }

    // Just in case some CMS puts out a full URL with the anchor appended
    if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
      hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== '#' ? parseSelector(hrefAttribute.trim()) : null;
  }
  return selector;
};
const SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  children(element, selector) {
    return [].concat(...element.children).filter(child => child.matches(selector));
  },
  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  focusableChildren(element) {
    const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
    return this.find(focusables, element).filter(el => !isDisabled(el) && isVisible(el));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null;
    }
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.findOne(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.find(selector) : [];
  }
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/component-functions.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

const enableDismissTrigger = (component, method = 'hide') => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
    if (['A', 'AREA'].includes(this.tagName)) {
      event.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target);

    // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method
    instance[method]();
  });
};

/**
 * --------------------------------------------------------------------------
 * Bootstrap alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$f = 'alert';
const DATA_KEY$a = 'bs.alert';
const EVENT_KEY$b = `.${DATA_KEY$a}`;
const EVENT_CLOSE = `close${EVENT_KEY$b}`;
const EVENT_CLOSED = `closed${EVENT_KEY$b}`;
const CLASS_NAME_FADE$5 = 'fade';
const CLASS_NAME_SHOW$8 = 'show';

/**
 * Class definition
 */

class Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  }

  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  }

  // Private
  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Alert.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Alert, 'close');

/**
 * jQuery
 */

defineJQueryPlugin(Alert);

/**
 * --------------------------------------------------------------------------
 * Bootstrap button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$e = 'button';
const DATA_KEY$9 = 'bs.button';
const EVENT_KEY$a = `.${DATA_KEY$9}`;
const DATA_API_KEY$6 = '.data-api';
const CLASS_NAME_ACTIVE$3 = 'active';
const SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
const EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;

/**
 * Class definition
 */

class Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  }

  // Public
  toggle() {
    // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
    this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Button.getOrCreateInstance(this);
      if (config === 'toggle') {
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, event => {
  event.preventDefault();
  const button = event.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button);
  data.toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Button);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/swipe.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$d = 'swipe';
const EVENT_KEY$9 = '.bs.swipe';
const EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
const EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
const EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
const POINTER_TYPE_TOUCH = 'touch';
const POINTER_TYPE_PEN = 'pen';
const CLASS_NAME_POINTER_EVENT = 'pointer-event';
const SWIPE_THRESHOLD = 40;
const Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
const DefaultType$c = {
  endCallback: '(function|null)',
  leftCallback: '(function|null)',
  rightCallback: '(function|null)'
};

/**
 * Class definition
 */

class Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;
    if (!element || !Swipe.isSupported()) {
      return;
    }
    this._config = this._getConfig(config);
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);
    this._initEvents();
  }

  // Getters
  static get Default() {
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
  }

  // Public
  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  }

  // Private
  _start(event) {
    if (!this._supportPointerEvents) {
      this._deltaX = event.touches[0].clientX;
      return;
    }
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX;
    }
  }
  _end(event) {
    if (this._eventIsPointerPenTouch(event)) {
      this._deltaX = event.clientX - this._deltaX;
    }
    this._handleSwipe();
    execute(this._config.endCallback);
  }
  _move(event) {
    this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
  }
  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);
    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }
    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;
    if (!direction) {
      return;
    }
    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
      EventHandler.on(this._element, EVENT_POINTERUP, event => this._end(event));
      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
      EventHandler.on(this._element, EVENT_TOUCHEND, event => this._end(event));
    }
  }
  _eventIsPointerPenTouch(event) {
    return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
  }

  // Static
  static isSupported() {
    return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap carousel.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$c = 'carousel';
const DATA_KEY$8 = 'bs.carousel';
const EVENT_KEY$8 = `.${DATA_KEY$8}`;
const DATA_API_KEY$5 = '.data-api';
const ARROW_LEFT_KEY$1 = 'ArrowLeft';
const ARROW_RIGHT_KEY$1 = 'ArrowRight';
const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

const ORDER_NEXT = 'next';
const ORDER_PREV = 'prev';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const EVENT_SLIDE = `slide${EVENT_KEY$8}`;
const EVENT_SLID = `slid${EVENT_KEY$8}`;
const EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
const EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
const EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
const EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
const EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
const EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
const CLASS_NAME_CAROUSEL = 'carousel';
const CLASS_NAME_ACTIVE$2 = 'active';
const CLASS_NAME_SLIDE = 'slide';
const CLASS_NAME_END = 'carousel-item-end';
const CLASS_NAME_START = 'carousel-item-start';
const CLASS_NAME_NEXT = 'carousel-item-next';
const CLASS_NAME_PREV = 'carousel-item-prev';
const SELECTOR_ACTIVE = '.active';
const SELECTOR_ITEM = '.carousel-item';
const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
const SELECTOR_ITEM_IMG = '.carousel-item img';
const SELECTOR_INDICATORS = '.carousel-indicators';
const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
const KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
const Default$b = {
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  ride: false,
  touch: true,
  wrap: true
};
const DefaultType$b = {
  interval: '(number|boolean)',
  // TODO:v6 remove boolean support
  keyboard: 'boolean',
  pause: '(string|boolean)',
  ride: '(boolean|string)',
  touch: 'boolean',
  wrap: 'boolean'
};

/**
 * Class definition
 */

class Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._addEventListeners();
    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  }

  // Getters
  static get Default() {
    return Default$b;
  }
  static get DefaultType() {
    return DefaultType$b;
  }
  static get NAME() {
    return NAME$c;
  }

  // Public
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    // FIXME TODO use `document.visibilityState`
    // Don't call next when the page isn't visible
    // or the carousel or its parent isn't visible
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this._slide(ORDER_PREV);
  }
  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }
    this._clearInterval();
  }
  cycle() {
    this._clearInterval();
    this._updateInterval();
    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }
  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }
    this.cycle();
  }
  to(index) {
    const items = this._getItems();
    if (index > items.length - 1 || index < 0) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }
    const activeIndex = this._getItemIndex(this._getActive());
    if (activeIndex === index) {
      return;
    }
    const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
    this._slide(order, items[index]);
  }
  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, event => this._keydown(event));
    }
    if (this._config.pause === 'hover') {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }
    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }
  _addTouchEventListeners() {
    for (const img of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img, EVENT_DRAG_START, event => event.preventDefault());
    }
    const endCallBack = () => {
      if (this._config.pause !== 'hover') {
        return;
      }

      // If it's a touch-enabled device, mouseenter/leave are fired as
      // part of the mouse compatibility events on first tap - the carousel
      // would stop cycling until user tapped out of it;
      // here, we listen for touchend, explicitly pause the carousel
      // (as if it's the second time we tap on it, mouseenter compat event
      // is NOT fired) and after a timeout (to allow for mouse compatibility
      // events to fire) we explicitly restart cycling

      this.pause();
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };
    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }
  _keydown(event) {
    if (/input|textarea/i.test(event.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event.key];
    if (direction) {
      event.preventDefault();
      this._slide(this._directionToOrder(direction));
    }
  }
  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }
  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }
    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
    activeIndicator.removeAttribute('aria-current');
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute('aria-current', 'true');
    }
  }
  _updateInterval() {
    const element = this._activeElement || this._getActive();
    if (!element) {
      return;
    }
    const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }
  _slide(order, element = null) {
    if (this._isSliding) {
      return;
    }
    const activeElement = this._getActive();
    const isNext = order === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
    if (nextElement === activeElement) {
      return;
    }
    const nextElementIndex = this._getItemIndex(nextElement);
    const triggerEvent = eventName => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };
    const slideEvent = triggerEvent(EVENT_SLIDE);
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (!activeElement || !nextElement) {
      // Some weirdness is happening, so we bail
      // TODO: change tests that use empty divs to avoid this check
      return;
    }
    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;
    this._setActiveIndicatorElement(nextElementIndex);
    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);
    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };
    this._queueCallback(completeCallBack, activeElement, this._isAnimated());
    if (isCycling) {
      this.cycle();
    }
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }
  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }
  _orderToDirection(order) {
    if (isRTL()) {
      return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Carousel.getOrCreateInstance(this, config);
      if (typeof config === 'number') {
        data.to(config);
        return;
      }
      if (typeof config === 'string') {
        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute('data-bs-slide-to');
  if (slideIndex) {
    carousel.to(slideIndex);
    carousel._maybeEnableCycle();
    return;
  }
  if (Manipulator.getDataAttribute(this, 'slide') === 'next') {
    carousel.next();
    carousel._maybeEnableCycle();
    return;
  }
  carousel.prev();
  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Carousel);

/**
 * --------------------------------------------------------------------------
 * Bootstrap collapse.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$b = 'collapse';
const DATA_KEY$7 = 'bs.collapse';
const EVENT_KEY$7 = `.${DATA_KEY$7}`;
const DATA_API_KEY$4 = '.data-api';
const EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
const EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
const EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
const EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
const EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
const CLASS_NAME_SHOW$7 = 'show';
const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
const WIDTH = 'width';
const HEIGHT = 'height';
const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
const SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
const Default$a = {
  parent: null,
  toggle: true
};
const DefaultType$a = {
  parent: '(null|element)',
  toggle: 'boolean'
};

/**
 * Class definition
 */

class Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (const elem of toggleList) {
      const selector = SelectorEngine.getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter(foundElement => foundElement === this._element);
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._config.toggle) {
      this.toggle();
    }
  }

  // Getters
  static get Default() {
    return Default$a;
  }
  static get DefaultType() {
    return DefaultType$a;
  }
  static get NAME() {
    return NAME$b;
  }

  // Public
  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }
    let activeChildren = [];

    // find active children
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }
    const dimension = this._getDimension();
    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style[dimension] = 0;
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      this._element.style[dimension] = '';
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
    for (const trigger of this._triggerArray) {
      const element = SelectorEngine.getElementFromSelector(trigger);
      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };
    this._element.style[dimension] = '';
    this._queueCallback(complete, this._element, true);
  }
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  }

  // Private
  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle); // Coerce string values
    config.parent = getElement(config.parent);
    return config;
  }
  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
    for (const element of children) {
      const selected = SelectorEngine.getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }
  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    // remove children if greater depth
    return SelectorEngine.find(selector, this._config.parent).filter(element => !children.includes(element));
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  }

  // Static
  static jQueryInterface(config) {
    const _config = {};
    if (typeof config === 'string' && /show|hide/.test(config)) {
      _config.toggle = false;
    }
    return this.each(function () {
      const data = Collapse.getOrCreateInstance(this, _config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function (event) {
  // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
  if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
    event.preventDefault();
  }
  for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(Collapse);

/**
 * --------------------------------------------------------------------------
 * Bootstrap dropdown.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$a = 'dropdown';
const DATA_KEY$6 = 'bs.dropdown';
const EVENT_KEY$6 = `.${DATA_KEY$6}`;
const DATA_API_KEY$3 = '.data-api';
const ESCAPE_KEY$2 = 'Escape';
const TAB_KEY$1 = 'Tab';
const ARROW_UP_KEY$1 = 'ArrowUp';
const ARROW_DOWN_KEY$1 = 'ArrowDown';
const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

const EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
const EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
const EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
const EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
const EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
const CLASS_NAME_SHOW$6 = 'show';
const CLASS_NAME_DROPUP = 'dropup';
const CLASS_NAME_DROPEND = 'dropend';
const CLASS_NAME_DROPSTART = 'dropstart';
const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
const SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
const SELECTOR_MENU = '.dropdown-menu';
const SELECTOR_NAVBAR = '.navbar';
const SELECTOR_NAVBAR_NAV = '.navbar-nav';
const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
const PLACEMENT_TOP = isRTL() ? 'top-end' : 'top-start';
const PLACEMENT_TOPEND = isRTL() ? 'top-start' : 'top-end';
const PLACEMENT_BOTTOM = isRTL() ? 'bottom-end' : 'bottom-start';
const PLACEMENT_BOTTOMEND = isRTL() ? 'bottom-start' : 'bottom-end';
const PLACEMENT_RIGHT = isRTL() ? 'left-start' : 'right-start';
const PLACEMENT_LEFT = isRTL() ? 'right-start' : 'left-start';
const PLACEMENT_TOPCENTER = 'top';
const PLACEMENT_BOTTOMCENTER = 'bottom';
const Default$9 = {
  autoClose: true,
  boundary: 'clippingParents',
  display: 'dynamic',
  offset: [0, 2],
  popperConfig: null,
  reference: 'toggle'
};
const DefaultType$9 = {
  autoClose: '(boolean|string)',
  boundary: '(string|element)',
  display: 'string',
  offset: '(array|string|function)',
  popperConfig: '(null|object|function)',
  reference: '(string|element|object)'
};

/**
 * Class definition
 */

class Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode; // dropdown wrapper
    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
    this._inNavbar = this._detectNavbar();
  }

  // Getters
  static get Default() {
    return Default$9;
  }
  static get DefaultType() {
    return DefaultType$9;
  }
  static get NAME() {
    return NAME$a;
  }

  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._createPopper();

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    this._element.focus();
    this._element.setAttribute('aria-expanded', true);
    this._menu.classList.add(CLASS_NAME_SHOW$6);
    this._element.classList.add(CLASS_NAME_SHOW$6);
    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }
    super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }

  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    if (this._popper) {
      this._popper.destroy();
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6);
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    this._element.setAttribute('aria-expanded', 'false');
    Manipulator.removeDataAttribute(this._menu, 'popper');
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }
  _getConfig(config) {
    config = super._getConfig(config);
    if (typeof config.reference === 'object' && !isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
      // Popper virtual elements require a getBoundingClientRect method
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }
    return config;
  }
  _createPopper() {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
    }
    let referenceElement = this._element;
    if (this._config.reference === 'parent') {
      referenceElement = this._parent;
    } else if (isElement(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === 'object') {
      referenceElement = this._config.reference;
    }
    const popperConfig = this._getPopperConfig();
    this._popper = _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(referenceElement, this._menu, popperConfig);
  }
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }
  _getPlacement() {
    const parentDropdown = this._parent;
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    }

    // We need to trim the value because custom properties can also include spaces
    const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }]
    };

    // Disable Popper if we have a static display or Dropdown is in Navbar
    if (this._inNavbar || this._config.display === 'static') {
      Manipulator.setDataAttribute(this._menu, 'popper', 'static'); // TODO: v6 remove
      defaultBsPopperConfig.modifiers = [{
        name: 'applyStyles',
        enabled: false
      }];
    }
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [defaultBsPopperConfig])
    };
  }
  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => isVisible(element));
    if (!items.length) {
      return;
    }

    // if target isn't included in items (e.g. when expanding the dropdown)
    // allow cycling to get the last item in case key equals ARROW_UP_KEY
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Dropdown.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event) {
    if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY$1) {
      return;
    }
    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
    for (const toggle of openToggles) {
      const context = Dropdown.getInstance(toggle);
      if (!context || context._config.autoClose === false) {
        continue;
      }
      const composedPath = event.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);
      if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
        continue;
      }

      // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu
      if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event.target.tagName))) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event.type === 'click') {
        relatedTarget.clickEvent = event;
      }
      context._completeHide(relatedTarget);
    }
  }
  static dataApiKeydownHandler(event) {
    // If not an UP | DOWN | ESCAPE key => not a dropdown command
    // If input/textarea && if key is other than ESCAPE => not a dropdown command

    const isInput = /input|textarea/i.test(event.target.tagName);
    const isEscapeEvent = event.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event.key);
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    event.preventDefault();

    // TODO: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.3/forms/input-group/
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event.delegateTarget.parentNode);
    const instance = Dropdown.getOrCreateInstance(getToggleButton);
    if (isUpOrDownEvent) {
      event.stopPropagation();
      instance.show();
      instance._selectMenuItem(event);
      return;
    }
    if (instance._isShown()) {
      // else is escape and we check if it is shown
      event.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function (event) {
  event.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});

/**
 * jQuery
 */

defineJQueryPlugin(Dropdown);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/backdrop.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$9 = 'backdrop';
const CLASS_NAME_FADE$4 = 'fade';
const CLASS_NAME_SHOW$5 = 'show';
const EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
const Default$8 = {
  className: 'modal-backdrop',
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: 'body' // give the choice to place backdrop under different elements
};

const DefaultType$8 = {
  className: 'string',
  clickCallback: '(function|null)',
  isAnimated: 'boolean',
  isVisible: 'boolean',
  rootElement: '(element|string)'
};

/**
 * Class definition
 */

class Backdrop extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }

  // Getters
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }

  // Public
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._append();
    const element = this._getElement();
    if (this._config.isAnimated) {
      reflow(element);
    }
    element.classList.add(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      execute(callback);
    });
  }
  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }
  dispose() {
    if (!this._isAppended) {
      return;
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN);
    this._element.remove();
    this._isAppended = false;
  }

  // Private
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement('div');
      backdrop.className = this._config.className;
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }
      this._element = backdrop;
    }
    return this._element;
  }
  _configAfterMerge(config) {
    // use getElement() with the default "body" to get a fresh Element on each instantiation
    config.rootElement = getElement(config.rootElement);
    return config;
  }
  _append() {
    if (this._isAppended) {
      return;
    }
    const element = this._getElement();
    this._config.rootElement.append(element);
    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }
  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/focustrap.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$8 = 'focustrap';
const DATA_KEY$5 = 'bs.focustrap';
const EVENT_KEY$5 = `.${DATA_KEY$5}`;
const EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
const TAB_KEY = 'Tab';
const TAB_NAV_FORWARD = 'forward';
const TAB_NAV_BACKWARD = 'backward';
const Default$7 = {
  autofocus: true,
  trapElement: null // The element to trap focus inside of
};

const DefaultType$7 = {
  autofocus: 'boolean',
  trapElement: 'element'
};

/**
 * Class definition
 */

class FocusTrap extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }

  // Getters
  static get Default() {
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
  }

  // Public
  activate() {
    if (this._isActive) {
      return;
    }
    if (this._config.autofocus) {
      this._config.trapElement.focus();
    }
    EventHandler.off(document, EVENT_KEY$5); // guard against infinite focus loop
    EventHandler.on(document, EVENT_FOCUSIN$2, event => this._handleFocusin(event));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
    this._isActive = true;
  }
  deactivate() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$5);
  }

  // Private
  _handleFocusin(event) {
    const {
      trapElement
    } = this._config;
    if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
      return;
    }
    const elements = SelectorEngine.focusableChildren(trapElement);
    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }
  _handleKeydown(event) {
    if (event.key !== TAB_KEY) {
      return;
    }
    this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/scrollBar.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
const SELECTOR_STICKY_CONTENT = '.sticky-top';
const PROPERTY_PADDING = 'padding-right';
const PROPERTY_MARGIN = 'margin-right';

/**
 * Class definition
 */

class ScrollBarHelper {
  constructor() {
    this._element = document.body;
  }

  // Public
  getWidth() {
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    // give padding to element to balance the hidden scrollbar width
    this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
  }
  reset() {
    this._resetElementAttributes(this._element, 'overflow');
    this._resetElementAttributes(this._element, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }

  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, 'overflow');
    this._element.style.overflow = 'hidden';
  }
  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = element => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = element => {
      const value = Manipulator.getDataAttribute(element, styleProperty);
      // We only want to remove the property if the value is `null`; the value can also be zero
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }
      Manipulator.removeDataAttribute(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if (isElement(selector)) {
      callBack(selector);
      return;
    }
    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel);
    }
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap modal.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$7 = 'modal';
const DATA_KEY$4 = 'bs.modal';
const EVENT_KEY$4 = `.${DATA_KEY$4}`;
const DATA_API_KEY$2 = '.data-api';
const ESCAPE_KEY$1 = 'Escape';
const EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
const EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
const EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
const EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
const EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
const EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
const EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
const EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
const CLASS_NAME_OPEN = 'modal-open';
const CLASS_NAME_FADE$3 = 'fade';
const CLASS_NAME_SHOW$4 = 'show';
const CLASS_NAME_STATIC = 'modal-static';
const OPEN_SELECTOR$1 = '.modal.show';
const SELECTOR_DIALOG = '.modal-dialog';
const SELECTOR_MODAL_BODY = '.modal-body';
const SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
const Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
};
const DefaultType$6 = {
  backdrop: '(boolean|string)',
  focus: 'boolean',
  keyboard: 'boolean'
};

/**
 * Class definition
 */

class Modal extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$6;
  }
  static get DefaultType() {
    return DefaultType$6;
  }
  static get NAME() {
    return NAME$7;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._isTransitioning = true;
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._adjustDialog();
    this._backdrop.show(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    this._isTransitioning = true;
    this._focustrap.deactivate();
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
  }
  dispose() {
    EventHandler.off(window, EVENT_KEY$4);
    EventHandler.off(this._dialog, EVENT_KEY$4);
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }

  // Private
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _showElement(relatedTarget) {
    // try to append dynamic modal
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }
    this._element.style.display = 'block';
    this._element.removeAttribute('aria-hidden');
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.scrollTop = 0;
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW$4);
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, event => {
      if (event.key !== ESCAPE_KEY$1) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog();
      }
    });
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
      // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, event2 => {
        if (this._element !== event.target || this._element !== event2.target) {
          return;
        }
        if (this._config.backdrop === 'static') {
          this._triggerBackdropTransition();
          return;
        }
        if (this._config.backdrop) {
          this.hide();
        }
      });
    });
  }
  _hideModal() {
    this._element.style.display = 'none';
    this._element.setAttribute('aria-hidden', true);
    this._element.removeAttribute('aria-modal');
    this._element.removeAttribute('role');
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    });
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }
  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY;
    // return if the following background transition hasn't yet completed
    if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return;
    }
    if (!isModalOverflowing) {
      this._element.style.overflowY = 'hidden';
    }
    this._element.classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);
    this._element.focus();
  }

  /**
   * The following methods are used to handle overflowing modals
   */

  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? 'paddingLeft' : 'paddingRight';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? 'paddingRight' : 'paddingLeft';
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = '';
    this._element.style.paddingRight = '';
  }

  // Static
  static jQueryInterface(config, relatedTarget) {
    return this.each(function () {
      const data = Modal.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](relatedTarget);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$4, showEvent => {
    if (showEvent.defaultPrevented) {
      // only register focus restorer if modal will actually get shown
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });

  // avoid conflict when clicking modal toggler while another one is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide();
  }
  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);

/**
 * jQuery
 */

defineJQueryPlugin(Modal);

/**
 * --------------------------------------------------------------------------
 * Bootstrap offcanvas.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$6 = 'offcanvas';
const DATA_KEY$3 = 'bs.offcanvas';
const EVENT_KEY$3 = `.${DATA_KEY$3}`;
const DATA_API_KEY$1 = '.data-api';
const EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
const ESCAPE_KEY = 'Escape';
const CLASS_NAME_SHOW$3 = 'show';
const CLASS_NAME_SHOWING$1 = 'showing';
const CLASS_NAME_HIDING = 'hiding';
const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
const OPEN_SELECTOR = '.offcanvas.show';
const EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
const EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
const EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
const EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
const EVENT_RESIZE = `resize${EVENT_KEY$3}`;
const EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
const SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
const Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
const DefaultType$5 = {
  backdrop: '(boolean|string)',
  keyboard: 'boolean',
  scroll: 'boolean'
};

/**
 * Class definition
 */

class Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
  }

  // Getters
  static get Default() {
    return Default$5;
  }
  static get DefaultType() {
    return DefaultType$5;
  }
  static get NAME() {
    return NAME$6;
  }

  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._backdrop.show();
    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }
    this._element.setAttribute('aria-modal', true);
    this._element.setAttribute('role', 'dialog');
    this._element.classList.add(CLASS_NAME_SHOWING$1);
    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate();
      }
      this._element.classList.add(CLASS_NAME_SHOW$3);
      this._element.classList.remove(CLASS_NAME_SHOWING$1);
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._focustrap.deactivate();
    this._element.blur();
    this._isShown = false;
    this._element.classList.add(CLASS_NAME_HIDING);
    this._backdrop.hide();
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
      this._element.removeAttribute('aria-modal');
      this._element.removeAttribute('role');
      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    };
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }

  // Private
  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === 'static') {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }
      this.hide();
    };

    // 'static' option will be translated to true, and booleans will keep their value
    const isVisible = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible ? clickCallback : null
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
      if (event.key !== ESCAPE_KEY) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    });
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Offcanvas.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function (event) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    // focus on trigger when it is closed
    if (isVisible(this)) {
      this.focus();
    }
  });

  // avoid conflict when clicking a toggler of an offcanvas, while another is open
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find('[aria-modal][class*=show][class*=offcanvas-]')) {
    if (getComputedStyle(element).position !== 'fixed') {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);

/**
 * jQuery
 */

defineJQueryPlugin(Offcanvas);

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

// js-docs-start allow-list
const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
const DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
  a: ['target', 'href', 'title', 'rel'],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  div: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
// js-docs-end allow-list

const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);

/**
 * A pattern that recognizes URLs that are safe wrt. XSS in URL navigation
 * contexts.
 *
 * Shout-out to Angular https://github.com/angular/angular/blob/15.2.8/packages/core/src/sanitization/url_sanitizer.ts#L38
 */
// eslint-disable-next-line unicorn/better-regex
const SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
const allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
    }
    return true;
  }

  // Check if a regular expression validates the attribute.
  return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }
  if (sanitizeFunction && typeof sanitizeFunction === 'function') {
    return sanitizeFunction(unsafeHtml);
  }
  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
  const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase();
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }
    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
  }
  return createdDocument.body.innerHTML;
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap util/template-factory.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$5 = 'TemplateFactory';
const Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: '',
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: '<div></div>'
};
const DefaultType$4 = {
  allowList: 'object',
  content: 'object',
  extraClass: '(string|function)',
  html: 'boolean',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  template: 'string'
};
const DefaultContentType = {
  entry: '(string|element|function|null)',
  selector: '(string|element)'
};

/**
 * Class definition
 */

class TemplateFactory extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
  }

  // Getters
  static get Default() {
    return Default$4;
  }
  static get DefaultType() {
    return DefaultType$4;
  }
  static get NAME() {
    return NAME$5;
  }

  // Public
  getContent() {
    return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(content) {
    this._checkContent(content);
    this._config.content = {
      ...this._config.content,
      ...content
    };
    return this;
  }
  toHtml() {
    const templateWrapper = document.createElement('div');
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector);
    }
    const template = templateWrapper.children[0];
    const extraClass = this._resolvePossibleFunction(this._config.extraClass);
    if (extraClass) {
      template.classList.add(...extraClass.split(' '));
    }
    return template;
  }

  // Private
  _typeCheckConfig(config) {
    super._typeCheckConfig(config);
    this._checkContent(config.content);
  }
  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType);
    }
  }
  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);
    if (!templateElement) {
      return;
    }
    content = this._resolvePossibleFunction(content);
    if (!content) {
      templateElement.remove();
      return;
    }
    if (isElement(content)) {
      this._putElementInTemplate(getElement(content), templateElement);
      return;
    }
    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content);
      return;
    }
    templateElement.textContent = content;
  }
  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this]);
  }
  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = '';
      templateElement.append(element);
      return;
    }
    templateElement.textContent = element.textContent;
  }
}

/**
 * --------------------------------------------------------------------------
 * Bootstrap tooltip.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$4 = 'tooltip';
const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
const CLASS_NAME_FADE$2 = 'fade';
const CLASS_NAME_MODAL = 'modal';
const CLASS_NAME_SHOW$2 = 'show';
const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
const EVENT_MODAL_HIDE = 'hide.bs.modal';
const TRIGGER_HOVER = 'hover';
const TRIGGER_FOCUS = 'focus';
const TRIGGER_CLICK = 'click';
const TRIGGER_MANUAL = 'manual';
const EVENT_HIDE$2 = 'hide';
const EVENT_HIDDEN$2 = 'hidden';
const EVENT_SHOW$2 = 'show';
const EVENT_SHOWN$2 = 'shown';
const EVENT_INSERTED = 'inserted';
const EVENT_CLICK$1 = 'click';
const EVENT_FOCUSIN$1 = 'focusin';
const EVENT_FOCUSOUT$1 = 'focusout';
const EVENT_MOUSEENTER = 'mouseenter';
const EVENT_MOUSELEAVE = 'mouseleave';
const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: isRTL() ? 'left' : 'right',
  BOTTOM: 'bottom',
  LEFT: isRTL() ? 'right' : 'left'
};
const Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: 'clippingParents',
  container: false,
  customClass: '',
  delay: 0,
  fallbackPlacements: ['top', 'right', 'bottom', 'left'],
  html: false,
  offset: [0, 6],
  placement: 'top',
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
  title: '',
  trigger: 'hover focus'
};
const DefaultType$3 = {
  allowList: 'object',
  animation: 'boolean',
  boundary: '(string|element)',
  container: '(string|element|boolean)',
  customClass: '(string|function)',
  delay: '(number|object)',
  fallbackPlacements: 'array',
  html: 'boolean',
  offset: '(array|string|function)',
  placement: '(string|function)',
  popperConfig: '(null|object|function)',
  sanitize: 'boolean',
  sanitizeFn: '(null|function)',
  selector: '(string|boolean)',
  template: 'string',
  title: '(string|element|function)',
  trigger: 'string'
};

/**
 * Class definition
 */

class Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof _popperjs_core__WEBPACK_IMPORTED_MODULE_0__ === 'undefined') {
      throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
    }
    super(element, config);

    // Private
    this._isEnabled = true;
    this._timeout = 0;
    this._isHovered = null;
    this._activeTrigger = {};
    this._popper = null;
    this._templateFactory = null;
    this._newContent = null;

    // Protected
    this.tip = null;
    this._setListeners();
    if (!this._config.selector) {
      this._fixTitle();
    }
  }

  // Getters
  static get Default() {
    return Default$3;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  static get NAME() {
    return NAME$4;
  }

  // Public
  enable() {
    this._isEnabled = true;
  }
  disable() {
    this._isEnabled = false;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    if (!this._isEnabled) {
      return;
    }
    this._activeTrigger.click = !this._activeTrigger.click;
    if (this._isShown()) {
      this._leave();
      return;
    }
    this._enter();
  }
  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this._element.getAttribute('data-bs-original-title')) {
      this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
    }
    this._disposePopper();
    super.dispose();
  }
  show() {
    if (this._element.style.display === 'none') {
      throw new Error('Please use show on visible elements');
    }
    if (!(this._isWithContent() && this._isEnabled)) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }

    // TODO: v6 remove this or make it optional
    this._disposePopper();
    const tip = this._getTipElement();
    this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
    const {
      container
    } = this._config;
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    }
    this._popper = this._createPopper(tip);
    tip.classList.add(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we add extra
    // empty mouseover listeners to the body's immediate children;
    // only needed because of broken event delegation on iOS
    // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, 'mouseover', noop);
      }
    }
    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
      if (this._isHovered === false) {
        this._leave();
      }
      this._isHovered = false;
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  hide() {
    if (!this._isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
    if (hideEvent.defaultPrevented) {
      return;
    }
    const tip = this._getTipElement();
    tip.classList.remove(CLASS_NAME_SHOW$2);

    // If this is a touch-enabled device we remove the extra
    // empty mouseover listeners we added for iOS support
    if ('ontouchstart' in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, 'mouseover', noop);
      }
    }
    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    this._isHovered = null; // it is a trick to support manual triggering

    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }
      if (!this._isHovered) {
        this._disposePopper();
      }
      this._element.removeAttribute('aria-describedby');
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  update() {
    if (this._popper) {
      this._popper.update();
    }
  }

  // Protected
  _isWithContent() {
    return Boolean(this._getTitle());
  }
  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    }
    return this.tip;
  }
  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml();

    // TODO: remove this check in v6
    if (!tip) {
      return null;
    }
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    // TODO: v6 the following can be achieved with CSS only
    tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    const tipId = getUID(this.constructor.NAME).toString();
    tip.setAttribute('id', tipId);
    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }
    return tip;
  }
  setContent(content) {
    this._newContent = content;
    if (this._isShown()) {
      this._disposePopper();
      this.show();
    }
  }
  _getTemplateFactory(content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content);
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      });
    }
    return this._templateFactory;
  }
  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    };
  }
  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
  }

  // Private
  _initializeOnDelegatedTarget(event) {
    return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
  }
  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
  }
  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
  }
  _createPopper(tip) {
    const placement = execute(this._config.placement, [this, tip, this._element]);
    const attachment = AttachmentMap[placement.toUpperCase()];
    return _popperjs_core__WEBPACK_IMPORTED_MODULE_1__.createPopper(this._element, tip, this._getPopperConfig(attachment));
  }
  _getOffset() {
    const {
      offset
    } = this._config;
    if (typeof offset === 'string') {
      return offset.split(',').map(value => Number.parseInt(value, 10));
    }
    if (typeof offset === 'function') {
      return popperData => offset(popperData, this._element);
    }
    return offset;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this._element]);
  }
  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: 'flip',
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: 'offset',
        options: {
          offset: this._getOffset()
        }
      }, {
        name: 'preventOverflow',
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: 'arrow',
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: 'preSetPlacement',
        enabled: true,
        phase: 'beforeMain',
        fn: data => {
          // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
          // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
          this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
        }
      }]
    };
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [defaultBsPopperConfig])
    };
  }
  _setListeners() {
    const triggers = this._config.trigger.split(' ');
    for (const trigger of triggers) {
      if (trigger === 'click') {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context.toggle();
        });
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
        EventHandler.on(this._element, eventIn, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
          context._enter();
        });
        EventHandler.on(this._element, eventOut, this._config.selector, event => {
          const context = this._initializeOnDelegatedTarget(event);
          context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
          context._leave();
        });
      }
    }
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  }
  _fixTitle() {
    const title = this._element.getAttribute('title');
    if (!title) {
      return;
    }
    if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
      this._element.setAttribute('aria-label', title);
    }
    this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility
    this._element.removeAttribute('title');
  }
  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true;
      return;
    }
    this._isHovered = true;
    this._setTimeout(() => {
      if (this._isHovered) {
        this.show();
      }
    }, this._config.delay.show);
  }
  _leave() {
    if (this._isWithActiveTrigger()) {
      return;
    }
    this._isHovered = false;
    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide();
      }
    }, this._config.delay.hide);
  }
  _setTimeout(handler, timeout) {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(handler, timeout);
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true);
  }
  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute];
      }
    }
    config = {
      ...dataAttributes,
      ...(typeof config === 'object' && config ? config : {})
    };
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    config.container = config.container === false ? document.body : getElement(config.container);
    if (typeof config.delay === 'number') {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }
    if (typeof config.title === 'number') {
      config.title = config.title.toString();
    }
    if (typeof config.content === 'number') {
      config.content = config.content.toString();
    }
    return config;
  }
  _getDelegateConfig() {
    const config = {};
    for (const [key, value] of Object.entries(this._config)) {
      if (this.constructor.Default[key] !== value) {
        config[key] = value;
      }
    }
    config.selector = false;
    config.trigger = 'manual';

    // In the future can be replaced with:
    // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
    // `Object.fromEntries(keysWithDifferentValues)`
    return config;
  }
  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tooltip.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Tooltip);

/**
 * --------------------------------------------------------------------------
 * Bootstrap popover.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$3 = 'popover';
const SELECTOR_TITLE = '.popover-header';
const SELECTOR_CONTENT = '.popover-body';
const Default$2 = {
  ...Tooltip.Default,
  content: '',
  offset: [0, 8],
  placement: 'right',
  template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
  trigger: 'click'
};
const DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: '(null|string|element|function)'
};

/**
 * Class definition
 */

class Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  static get NAME() {
    return NAME$3;
  }

  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }

  // Private
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Popover.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (typeof data[config] === 'undefined') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * jQuery
 */

defineJQueryPlugin(Popover);

/**
 * --------------------------------------------------------------------------
 * Bootstrap scrollspy.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$2 = 'scrollspy';
const DATA_KEY$2 = 'bs.scrollspy';
const EVENT_KEY$2 = `.${DATA_KEY$2}`;
const DATA_API_KEY = '.data-api';
const EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
const EVENT_CLICK = `click${EVENT_KEY$2}`;
const EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
const CLASS_NAME_ACTIVE$1 = 'active';
const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
const SELECTOR_TARGET_LINKS = '[href]';
const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
const SELECTOR_NAV_LINKS = '.nav-link';
const SELECTOR_NAV_ITEMS = '.nav-item';
const SELECTOR_LIST_ITEMS = '.list-group-item';
const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
const SELECTOR_DROPDOWN = '.dropdown';
const SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
const Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: '0px 0px -25%',
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
const DefaultType$1 = {
  offset: '(number|null)',
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: 'string',
  smoothScroll: 'boolean',
  target: 'element',
  threshold: 'array'
};

/**
 * Class definition
 */

class ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config);

    // this._element is the observablesContainer and config.target the menu links wrapper
    this._targetLinks = new Map();
    this._observableSections = new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh(); // initialize
  }

  // Getters
  static get Default() {
    return Default$1;
  }
  static get DefaultType() {
    return DefaultType$1;
  }
  static get NAME() {
    return NAME$2;
  }

  // Public
  refresh() {
    this._initializeTargetsAndObservables();
    this._maybeEnableSmoothScroll();
    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }
    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }
  dispose() {
    this._observer.disconnect();
    super.dispose();
  }

  // Private
  _configAfterMerge(config) {
    // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
    config.target = getElement(config.target) || document.body;

    // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only
    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
    if (typeof config.threshold === 'string') {
      config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
    }
    return config;
  }
  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    }

    // unregister any previous listeners
    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
      const observableSection = this._observableSections.get(event.target.hash);
      if (observableSection) {
        event.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;
        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: 'smooth'
          });
          return;
        }

        // Chrome 60 doesn't support `scrollTo`
        root.scrollTop = height;
      }
    });
  }
  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver(entries => this._observerCallback(entries), options);
  }

  // The logic of selection
  _observerCallback(entries) {
    const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
    const activate = entry => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
      this._process(targetElement(entry));
    };
    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;
        this._clearActiveClass(targetElement(entry));
        continue;
      }
      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      // if we are scrolling down, pick the bigger offsetTop
      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry);
        // if parent isn't scrolled, let's keep the first visible item, breaking the iteration
        if (!parentScrollTop) {
          return;
        }
        continue;
      }

      // if we are scrolling up, pick the smallest offsetTop
      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }
  _initializeTargetsAndObservables() {
    this._targetLinks = new Map();
    this._observableSections = new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
    for (const anchor of targetLinks) {
      // ensure that the anchor has an id and is not disabled
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }
      const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);

      // ensure that the observableSection exists & is visible
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodeURI(anchor.hash), anchor);
        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }
  _process(target) {
    if (this._activeTarget === target) {
      return;
    }
    this._clearActiveClass(this._config.target);
    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);
    this._activateParents(target);
    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }
  _activateParents(target) {
    // Activate dropdown parents
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      // Set triggered links parents as active
      // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }
  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = ScrollSpy.getOrCreateInstance(this, config);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});

/**
 * jQuery
 */

defineJQueryPlugin(ScrollSpy);

/**
 * --------------------------------------------------------------------------
 * Bootstrap tab.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME$1 = 'tab';
const DATA_KEY$1 = 'bs.tab';
const EVENT_KEY$1 = `.${DATA_KEY$1}`;
const EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
const EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
const EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
const EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
const EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
const EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
const EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
const ARROW_LEFT_KEY = 'ArrowLeft';
const ARROW_RIGHT_KEY = 'ArrowRight';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const HOME_KEY = 'Home';
const END_KEY = 'End';
const CLASS_NAME_ACTIVE = 'active';
const CLASS_NAME_FADE$1 = 'fade';
const CLASS_NAME_SHOW$1 = 'show';
const CLASS_DROPDOWN = 'dropdown';
const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
const NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
const SELECTOR_OUTER = '.nav-item, .list-group-item';
const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // TODO: could only be `tab` in v6
const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;

/**
 * Class definition
 */

class Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);
    if (!this._parent) {
      return;
      // TODO: should throw exception in v6
      // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
    }

    // Set up initial aria attributes
    this._setInitialAttributes(this._parent, this._getChildren());
    EventHandler.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
  }

  // Getters
  static get NAME() {
    return NAME$1;
  }

  // Public
  show() {
    // Shows this elem and deactivate the active sibling if exists
    const innerElem = this._element;
    if (this._elemIsActive(innerElem)) {
      return;
    }

    // Search for active tab on same parent to deactivate it
    const active = this._getActiveElem();
    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });
    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }
    this._deactivate(active, innerElem);
    this._activate(innerElem, active);
  }

  // Private
  _activate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.add(CLASS_NAME_ACTIVE);
    this._activate(SelectorEngine.getElementFromSelector(element)); // Search and activate/show the proper section

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }
      element.removeAttribute('tabindex');
      element.setAttribute('aria-selected', true);
      this._toggleDropDown(element, true);
      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();
    this._deactivate(SelectorEngine.getElementFromSelector(element)); // Search and deactivate the shown section too

    const complete = () => {
      if (element.getAttribute('role') !== 'tab') {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }
      element.setAttribute('aria-selected', false);
      element.setAttribute('tabindex', '-1');
      this._toggleDropDown(element, false);
      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _keydown(event) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event.key)) {
      return;
    }
    event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page
    event.preventDefault();
    const children = this._getChildren().filter(element => !isDisabled(element));
    let nextActiveElement;
    if ([HOME_KEY, END_KEY].includes(event.key)) {
      nextActiveElement = children[event.key === HOME_KEY ? 0 : children.length - 1];
    } else {
      const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
      nextActiveElement = getNextActiveElement(children, event.target, isNext, true);
    }
    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      });
      Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }
  _getChildren() {
    // collection of inner elements
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find(child => this._elemIsActive(child)) || null;
  }
  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, 'role', 'tablist');
    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }
  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);
    const isActive = this._elemIsActive(child);
    const outerElem = this._getOuterElement(child);
    child.setAttribute('aria-selected', isActive);
    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
    }
    if (!isActive) {
      child.setAttribute('tabindex', '-1');
    }
    this._setAttributeIfNotExists(child, 'role', 'tab');

    // set attributes to the related panel too
    this._setInitialAttributesOnTargetPanel(child);
  }
  _setInitialAttributesOnTargetPanel(child) {
    const target = SelectorEngine.getElementFromSelector(child);
    if (!target) {
      return;
    }
    this._setAttributeIfNotExists(target, 'role', 'tabpanel');
    if (child.id) {
      this._setAttributeIfNotExists(target, 'aria-labelledby', `${child.id}`);
    }
  }
  _toggleDropDown(element, open) {
    const outerElem = this._getOuterElement(element);
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }
    const toggle = (selector, className) => {
      const element = SelectorEngine.findOne(selector, outerElem);
      if (element) {
        element.classList.toggle(className, open);
      }
    };
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    outerElem.setAttribute('aria-expanded', open);
  }
  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }
  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  }

  // Try to get the inner element (usually the .nav-link)
  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  }

  // Try to get the outer element (usually the .nav-item)
  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Tab.getOrCreateInstance(this);
      if (typeof config !== 'string') {
        return;
      }
      if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
}

/**
 * Data API implementation
 */

EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
  if (['A', 'AREA'].includes(this.tagName)) {
    event.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  Tab.getOrCreateInstance(this).show();
});

/**
 * Initialize on focus
 */
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
/**
 * jQuery
 */

defineJQueryPlugin(Tab);

/**
 * --------------------------------------------------------------------------
 * Bootstrap toast.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */


/**
 * Constants
 */

const NAME = 'toast';
const DATA_KEY = 'bs.toast';
const EVENT_KEY = `.${DATA_KEY}`;
const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
const EVENT_HIDE = `hide${EVENT_KEY}`;
const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
const EVENT_SHOW = `show${EVENT_KEY}`;
const EVENT_SHOWN = `shown${EVENT_KEY}`;
const CLASS_NAME_FADE = 'fade';
const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility
const CLASS_NAME_SHOW = 'show';
const CLASS_NAME_SHOWING = 'showing';
const DefaultType = {
  animation: 'boolean',
  autohide: 'boolean',
  delay: 'number'
};
const Default = {
  animation: true,
  autohide: true,
  delay: 5000
};

/**
 * Class definition
 */

class Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
  }

  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }

  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._clearTimeout();
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._maybeScheduleHide();
    };
    this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  hide() {
    if (!this.isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE); // @deprecated
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout();
    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    super.dispose();
  }
  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }

  // Private

  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _onInteraction(event, isInteracting) {
    switch (event.type) {
      case 'mouseover':
      case 'mouseout':
        {
          this._hasMouseInteraction = isInteracting;
          break;
        }
      case 'focusin':
      case 'focusout':
        {
          this._hasKeyboardInteraction = isInteracting;
          break;
        }
    }
    if (isInteracting) {
      this._clearTimeout();
      return;
    }
    const nextElement = event.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }
    this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }

  // Static
  static jQueryInterface(config) {
    return this.each(function () {
      const data = Toast.getOrCreateInstance(this, config);
      if (typeof config === 'string') {
        if (typeof data[config] === 'undefined') {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
}

/**
 * Data API implementation
 */

enableDismissTrigger(Toast);

/**
 * jQuery
 */

defineJQueryPlugin(Toast);


//# sourceMappingURL=bootstrap.esm.js.map


/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/resize-observer-polyfill/dist/ResizeObserver.global.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/resize-observer-polyfill/dist/ResizeObserver.global.js ***!
  \*****************************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

(function (global, factory) {
     true ? module.exports = factory() :
    0;
}(this, (function () { 'use strict';

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */
/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = (function () {
    if (typeof Map !== 'undefined') {
        return Map;
    }

    /**
     * Returns index in provided array that matches the specified key.
     *
     * @param {Array<Array>} arr
     * @param {*} key
     * @returns {number}
     */
    function getIndex(arr, key) {
        var result = -1;

        arr.some(function (entry, index) {
            if (entry[0] === key) {
                result = index;

                return true;
            }

            return false;
        });

        return result;
    }

    return (function () {
        function anonymous() {
            this.__entries__ = [];
        }

        var prototypeAccessors = { size: { configurable: true } };

        /**
         * @returns {boolean}
         */
        prototypeAccessors.size.get = function () {
            return this.__entries__.length;
        };

        /**
         * @param {*} key
         * @returns {*}
         */
        anonymous.prototype.get = function (key) {
            var index = getIndex(this.__entries__, key);
            var entry = this.__entries__[index];

            return entry && entry[1];
        };

        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */
        anonymous.prototype.set = function (key, value) {
            var index = getIndex(this.__entries__, key);

            if (~index) {
                this.__entries__[index][1] = value;
            } else {
                this.__entries__.push([key, value]);
            }
        };

        /**
         * @param {*} key
         * @returns {void}
         */
        anonymous.prototype.delete = function (key) {
            var entries = this.__entries__;
            var index = getIndex(entries, key);

            if (~index) {
                entries.splice(index, 1);
            }
        };

        /**
         * @param {*} key
         * @returns {void}
         */
        anonymous.prototype.has = function (key) {
            return !!~getIndex(this.__entries__, key);
        };

        /**
         * @returns {void}
         */
        anonymous.prototype.clear = function () {
            this.__entries__.splice(0);
        };

        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */
        anonymous.prototype.forEach = function (callback, ctx) {
            var this$1 = this;
            if ( ctx === void 0 ) ctx = null;

            for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
                var entry = list[i];

                callback.call(ctx, entry[1], entry[0]);
            }
        };

        Object.defineProperties( anonymous.prototype, prototypeAccessors );

        return anonymous;
    }());
})();

/**
 * Detects whether window and document objects are available in current environment.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

// Returns global object of a current environment.
var global$1 = (function () {
    if (typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.Math === Math) {
        return __webpack_require__.g;
    }

    if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
    }

    if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
    }

    // eslint-disable-next-line no-new-func
    return Function('return this')();
})();

/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */
var requestAnimationFrame$1 = (function () {
    if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
    }

    return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
})();

// Defines minimum timeout before adding a trailing call.
var trailingTimeout = 2;

/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */
var throttle = function (callback, delay) {
    var leadingCall = false,
        trailingCall = false,
        lastCallTime = 0;

    /**
     * Invokes the original callback function and schedules new invocation if
     * the "proxy" was called during current request.
     *
     * @returns {void}
     */
    function resolvePending() {
        if (leadingCall) {
            leadingCall = false;

            callback();
        }

        if (trailingCall) {
            proxy();
        }
    }

    /**
     * Callback invoked after the specified delay. It will further postpone
     * invocation of the original function delegating it to the
     * requestAnimationFrame.
     *
     * @returns {void}
     */
    function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
    }

    /**
     * Schedules invocation of the original function.
     *
     * @returns {void}
     */
    function proxy() {
        var timeStamp = Date.now();

        if (leadingCall) {
            // Reject immediately following calls.
            if (timeStamp - lastCallTime < trailingTimeout) {
                return;
            }

            // Schedule new call to be in invoked when the pending one is resolved.
            // This is important for "transitions" which never actually start
            // immediately so there is a chance that we might miss one if change
            // happens amids the pending invocation.
            trailingCall = true;
        } else {
            leadingCall = true;
            trailingCall = false;

            setTimeout(timeoutCallback, delay);
        }

        lastCallTime = timeStamp;
    }

    return proxy;
};

// Minimum delay before invoking the update of observers.
var REFRESH_DELAY = 20;

// A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.
var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];

// Check if MutationObserver is available.
var mutationObserverSupported = typeof MutationObserver !== 'undefined';

/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */
var ResizeObserverController = function() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];

    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
};

/**
 * Adds observer to observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be added.
 * @returns {void}
 */


/**
 * Holds reference to the controller's instance.
 *
 * @private {ResizeObserverController}
 */


/**
 * Keeps reference to the instance of MutationObserver.
 *
 * @private {MutationObserver}
 */

/**
 * Indicates whether DOM listeners have been added.
 *
 * @private {boolean}
 */
ResizeObserverController.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
        this.observers_.push(observer);
    }

    // Add listeners if they haven't been added yet.
    if (!this.connected_) {
        this.connect_();
    }
};

/**
 * Removes observer from observers list.
 *
 * @param {ResizeObserverSPI} observer - Observer to be removed.
 * @returns {void}
 */
ResizeObserverController.prototype.removeObserver = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer);

    // Remove observer if it's present in registry.
    if (~index) {
        observers.splice(index, 1);
    }

    // Remove listeners if controller has no connected observers.
    if (!observers.length && this.connected_) {
        this.disconnect_();
    }
};

/**
 * Invokes the update of observers. It will continue running updates insofar
 * it detects changes.
 *
 * @returns {void}
 */
ResizeObserverController.prototype.refresh = function () {
    var changesDetected = this.updateObservers_();

    // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.
    if (changesDetected) {
        this.refresh();
    }
};

/**
 * Updates every observer from observers list and notifies them of queued
 * entries.
 *
 * @private
 * @returns {boolean} Returns "true" if any observer has detected changes in
 *  dimensions of it's elements.
 */
ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active observations.
    var activeObservers = this.observers_.filter(function (observer) {
        return observer.gatherActive(), observer.hasActive();
    });

    // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers, e.g. when multiple instances of
    // ResizeObserver are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.
    activeObservers.forEach(function (observer) { return observer.broadcastActive(); });

    return activeObservers.length > 0;
};

/**
 * Initializes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.connect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already added.
    if (!isBrowser || this.connected_) {
        return;
    }

    // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.
    document.addEventListener('transitionend', this.onTransitionEnd_);

    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported) {
        this.mutationsObserver_ = new MutationObserver(this.refresh);

        this.mutationsObserver_.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMSubtreeModified', this.refresh);

        this.mutationEventsAdded_ = true;
    }

    this.connected_ = true;
};

/**
 * Removes DOM listeners.
 *
 * @private
 * @returns {void}
 */
ResizeObserverController.prototype.disconnect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already removed.
    if (!isBrowser || !this.connected_) {
        return;
    }

    document.removeEventListener('transitionend', this.onTransitionEnd_);
    window.removeEventListener('resize', this.refresh);

    if (this.mutationsObserver_) {
        this.mutationsObserver_.disconnect();
    }

    if (this.mutationEventsAdded_) {
        document.removeEventListener('DOMSubtreeModified', this.refresh);
    }

    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
};

/**
 * "Transitionend" event handler.
 *
 * @private
 * @param {TransitionEvent} event
 * @returns {void}
 */
ResizeObserverController.prototype.onTransitionEnd_ = function (ref) {
        var propertyName = ref.propertyName; if ( propertyName === void 0 ) propertyName = '';

    // Detect whether transition may affect dimensions of an element.
    var isReflowProperty = transitionKeys.some(function (key) {
        return !!~propertyName.indexOf(key);
    });

    if (isReflowProperty) {
        this.refresh();
    }
};

/**
 * Returns instance of the ResizeObserverController.
 *
 * @returns {ResizeObserverController}
 */
ResizeObserverController.getInstance = function () {
    if (!this.instance_) {
        this.instance_ = new ResizeObserverController();
    }

    return this.instance_;
};

ResizeObserverController.instance_ = null;

/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */
var defineConfigurable = (function (target, props) {
    for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
        var key = list[i];

        Object.defineProperty(target, key, {
            value: props[key],
            enumerable: false,
            writable: false,
            configurable: true
        });
    }

    return target;
});

/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */
var getWindowOf = (function (target) {
    // Assume that the element is an instance of Node, which means that it
    // has the "ownerDocument" property from which we can retrieve a
    // corresponding global object.
    var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;

    // Return the local global object if it's not possible extract one from
    // provided element.
    return ownerGlobal || global$1;
});

// Placeholder of an empty content rectangle.
var emptyRect = createRectInit(0, 0, 0, 0);

/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */
function toFloat(value) {
    return parseFloat(value) || 0;
}

/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */
function getBordersSize(styles) {
    var positions = [], len = arguments.length - 1;
    while ( len-- > 0 ) positions[ len ] = arguments[ len + 1 ];

    return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];

        return size + toFloat(value);
    }, 0);
}

/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */
function getPaddings(styles) {
    var positions = ['top', 'right', 'bottom', 'left'];
    var paddings = {};

    for (var i = 0, list = positions; i < list.length; i += 1) {
        var position = list[i];

        var value = styles['padding-' + position];

        paddings[position] = toFloat(value);
    }

    return paddings;
}

/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */
function getSVGContentRect(target) {
    var bbox = target.getBBox();

    return createRectInit(0, 0, bbox.width, bbox.height);
}

/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */
function getHTMLElementContentRect(target) {
    // Client width & height properties can't be
    // used exclusively as they provide rounded values.
    var clientWidth = target.clientWidth;
    var clientHeight = target.clientHeight;

    // By this condition we can catch all non-replaced inline, hidden and
    // detached elements. Though elements with width & height properties less
    // than 0.5 will be discarded as well.
    //
    // Without it we would need to implement separate methods for each of
    // those cases and it's not possible to perform a precise and performance
    // effective test for hidden elements. E.g. even jQuery's ':visible' filter
    // gives wrong results for elements with width & height less than 0.5.
    if (!clientWidth && !clientHeight) {
        return emptyRect;
    }

    var styles = getWindowOf(target).getComputedStyle(target);
    var paddings = getPaddings(styles);
    var horizPad = paddings.left + paddings.right;
    var vertPad = paddings.top + paddings.bottom;

    // Computed styles of width & height are being used because they are the
    // only dimensions available to JS that contain non-rounded values. It could
    // be possible to utilize the getBoundingClientRect if only it's data wasn't
    // affected by CSS transformations let alone paddings, borders and scroll bars.
    var width = toFloat(styles.width),
        height = toFloat(styles.height);

    // Width & height include paddings and borders when the 'border-box' box
    // model is applied (except for IE).
    if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
            width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }

        if (Math.round(height + vertPad) !== clientHeight) {
            height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
    }

    // Following steps can't be applied to the document's root element as its
    // client[Width/Height] properties represent viewport area of the window.
    // Besides, it's as well not necessary as the <html> itself neither has
    // rendered scroll bars nor it can be clipped.
    if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight;

        // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.
        if (Math.abs(vertScrollbar) !== 1) {
            width -= vertScrollbar;
        }

        if (Math.abs(horizScrollbar) !== 1) {
            height -= horizScrollbar;
        }
    }

    return createRectInit(paddings.left, paddings.top, width, height);
}

/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
var isSVGGraphicsElement = (function () {
    // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
    // interface.
    if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
    }

    // If it's so, then check that element is at least an instance of the
    // SVGElement and that it has the "getBBox" method.
    // eslint-disable-next-line no-extra-parens
    return function (target) { return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function'; };
})();

/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */
function isDocumentElement(target) {
    return target === getWindowOf(target).document.documentElement;
}

/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */
function getContentRect(target) {
    if (!isBrowser) {
        return emptyRect;
    }

    if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
    }

    return getHTMLElementContentRect(target);
}

/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */
function createReadOnlyRect(ref) {
    var x = ref.x;
    var y = ref.y;
    var width = ref.width;
    var height = ref.height;

    // If DOMRectReadOnly is available use it as a prototype for the rectangle.
    var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
    var rect = Object.create(Constr.prototype);

    // Rectangle's properties are not writable and non-enumerable.
    defineConfigurable(rect, {
        x: x, y: y, width: width, height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
    });

    return rect;
}

/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */
function createRectInit(x, y, width, height) {
    return { x: x, y: y, width: width, height: height };
}

/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */
var ResizeObservation = function(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);

    this.target = target;
};

/**
 * Updates content rectangle and tells whether it's width or height properties
 * have changed since the last broadcast.
 *
 * @returns {boolean}
 */


/**
 * Reference to the last observed content rectangle.
 *
 * @private {DOMRectInit}
 */


/**
 * Broadcasted width of content rectangle.
 *
 * @type {number}
 */
ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect(this.target);

    this.contentRect_ = rect;

    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
};

/**
 * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
 * from the corresponding properties of the last observed content rectangle.
 *
 * @returns {DOMRectInit} Last observed content rectangle.
 */
ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;

    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;

    return rect;
};

var ResizeObserverEntry = function(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);

    // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.
    defineConfigurable(this, { target: target, contentRect: contentRect });
};

var ResizeObserverSPI = function(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();

    if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
};

/**
 * Starts observing provided element.
 *
 * @param {Element} target - Element to be observed.
 * @returns {void}
 */


/**
 * Registry of the ResizeObservation instances.
 *
 * @private {Map<Element, ResizeObservation>}
 */


/**
 * Public ResizeObserver instance which will be passed to the callback
 * function and used as a value of it's "this" binding.
 *
 * @private {ResizeObserver}
 */

/**
 * Collection of resize observations that have detected changes in dimensions
 * of elements.
 *
 * @private {Array<ResizeObservation>}
 */
ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_;

    // Do nothing if element is already being observed.
    if (observations.has(target)) {
        return;
    }

    observations.set(target, new ResizeObservation(target));

    this.controller_.addObserver(this);

    // Force the update of observations.
    this.controller_.refresh();
};

/**
 * Stops observing provided element.
 *
 * @param {Element} target - Element to stop observing.
 * @returns {void}
 */
ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    // Do nothing if current environment doesn't have the Element interface.
    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_;

    // Do nothing if element is not being observed.
    if (!observations.has(target)) {
        return;
    }

    observations.delete(target);

    if (!observations.size) {
        this.controller_.removeObserver(this);
    }
};

/**
 * Stops observing all elements.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
};

/**
 * Collects observation instances the associated element of which has changed
 * it's content rectangle.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.gatherActive = function () {
        var this$1 = this;

    this.clearActive();

    this.observations_.forEach(function (observation) {
        if (observation.isActive()) {
            this$1.activeObservations_.push(observation);
        }
    });
};

/**
 * Invokes initial callback function with a list of ResizeObserverEntry
 * instances collected from active resize observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
        return;
    }

    var ctx = this.callbackCtx_;

    // Create ResizeObserverEntry instance for every active observation.
    var entries = this.activeObservations_.map(function (observation) {
        return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });

    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
};

/**
 * Clears the collection of active observations.
 *
 * @returns {void}
 */
ResizeObserverSPI.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
};

/**
 * Tells whether observer has active observations.
 *
 * @returns {boolean}
 */
ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
};

// Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.
var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();

/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */
var ResizeObserver = function(callback) {
    if (!(this instanceof ResizeObserver)) {
        throw new TypeError('Cannot call a class as a function.');
    }
    if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
    }

    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);

    observers.set(this, observer);
};

// Expose public methods of ResizeObserver.
['observe', 'unobserve', 'disconnect'].forEach(function (method) {
    ResizeObserver.prototype[method] = function () {
        return (ref = observers.get(this))[method].apply(ref, arguments);
        var ref;
    };
});

var index = (function () {
    // Export existing implementation if available.
    if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
    }

    global$1.ResizeObserver = ResizeObserver;

    return ResizeObserver;
})();

return index;

})));


/***/ }),

/***/ "./node_modules/riot/riot.esm.js":
/*!***************************************!*\
  !*** ./node_modules/riot/riot.esm.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __: () => (/* binding */ __),
/* harmony export */   component: () => (/* binding */ component),
/* harmony export */   install: () => (/* binding */ install),
/* harmony export */   mount: () => (/* binding */ mount),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   register: () => (/* binding */ register),
/* harmony export */   uninstall: () => (/* binding */ uninstall),
/* harmony export */   unmount: () => (/* binding */ unmount),
/* harmony export */   unregister: () => (/* binding */ unregister),
/* harmony export */   version: () => (/* binding */ version),
/* harmony export */   withTypes: () => (/* binding */ withTypes)
/* harmony export */ });
/* Riot v6.1.2, @license MIT */
/**
 * Convert a string from camel case to dash-case
 * @param   {string} string - probably a component tag name
 * @returns {string} component name normalized
 */
function camelToDashCase(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
/**
 * Convert a string containing dashes to camel case
 * @param   {string} string - input string
 * @returns {string} my-string -> myString
 */

function dashToCamelCase(string) {
  return string.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}

/**
 * Get all the element attributes as object
 * @param   {HTMLElement} element - DOM node we want to parse
 * @returns {Object} all the attributes found as a key value pairs
 */

function DOMattributesToObject(element) {
  return Array.from(element.attributes).reduce((acc, attribute) => {
    acc[dashToCamelCase(attribute.name)] = attribute.value;
    return acc;
  }, {});
}
/**
 * Move all the child nodes from a source tag to another
 * @param   {HTMLElement} source - source node
 * @param   {HTMLElement} target - target node
 * @returns {undefined} it's a void method ¯\_(ツ)_/¯
 */
// Ignore this helper because it's needed only for svg tags

function moveChildren(source, target) {
  if (source.firstChild) {
    target.appendChild(source.firstChild);
    moveChildren(source, target);
  }
}
/**
 * Remove the child nodes from any DOM node
 * @param   {HTMLElement} node - target node
 * @returns {undefined}
 */

function cleanNode(node) {
  clearChildren(node.childNodes);
}
/**
 * Clear multiple children in a node
 * @param   {HTMLElement[]} children - direct children nodes
 * @returns {undefined}
 */

function clearChildren(children) {
  Array.from(children).forEach(removeChild);
}
/**
 * Remove a node
 * @param {HTMLElement}node - node to remove
 * @returns {undefined}
 */

const removeChild = node => node && node.parentNode && node.parentNode.removeChild(node);
/**
 * Insert before a node
 * @param {HTMLElement} newNode - node to insert
 * @param {HTMLElement} refNode - ref child
 * @returns {undefined}
 */

const insertBefore = (newNode, refNode) => refNode && refNode.parentNode && refNode.parentNode.insertBefore(newNode, refNode);
/**
 * Replace a node
 * @param {HTMLElement} newNode - new node to add to the DOM
 * @param {HTMLElement} replaced - node to replace
 * @returns {undefined}
 */

const replaceChild = (newNode, replaced) => replaced && replaced.parentNode && replaced.parentNode.replaceChild(newNode, replaced);

// Riot.js constants that can be used accross more modules
const COMPONENTS_IMPLEMENTATION_MAP$1 = new Map(),
      DOM_COMPONENT_INSTANCE_PROPERTY$1 = Symbol('riot-component'),
      PLUGINS_SET$1 = new Set(),
      IS_DIRECTIVE = 'is',
      VALUE_ATTRIBUTE = 'value',
      MOUNT_METHOD_KEY = 'mount',
      UPDATE_METHOD_KEY = 'update',
      UNMOUNT_METHOD_KEY = 'unmount',
      SHOULD_UPDATE_KEY = 'shouldUpdate',
      ON_BEFORE_MOUNT_KEY = 'onBeforeMount',
      ON_MOUNTED_KEY = 'onMounted',
      ON_BEFORE_UPDATE_KEY = 'onBeforeUpdate',
      ON_UPDATED_KEY = 'onUpdated',
      ON_BEFORE_UNMOUNT_KEY = 'onBeforeUnmount',
      ON_UNMOUNTED_KEY = 'onUnmounted',
      PROPS_KEY = 'props',
      STATE_KEY = 'state',
      SLOTS_KEY = 'slots',
      ROOT_KEY = 'root',
      IS_PURE_SYMBOL = Symbol('pure'),
      IS_COMPONENT_UPDATING = Symbol('is_updating'),
      PARENT_KEY_SYMBOL = Symbol('parent'),
      ATTRIBUTES_KEY_SYMBOL = Symbol('attributes'),
      TEMPLATE_KEY_SYMBOL = Symbol('template');

var globals = /*#__PURE__*/Object.freeze({
  __proto__: null,
  COMPONENTS_IMPLEMENTATION_MAP: COMPONENTS_IMPLEMENTATION_MAP$1,
  DOM_COMPONENT_INSTANCE_PROPERTY: DOM_COMPONENT_INSTANCE_PROPERTY$1,
  PLUGINS_SET: PLUGINS_SET$1,
  IS_DIRECTIVE: IS_DIRECTIVE,
  VALUE_ATTRIBUTE: VALUE_ATTRIBUTE,
  MOUNT_METHOD_KEY: MOUNT_METHOD_KEY,
  UPDATE_METHOD_KEY: UPDATE_METHOD_KEY,
  UNMOUNT_METHOD_KEY: UNMOUNT_METHOD_KEY,
  SHOULD_UPDATE_KEY: SHOULD_UPDATE_KEY,
  ON_BEFORE_MOUNT_KEY: ON_BEFORE_MOUNT_KEY,
  ON_MOUNTED_KEY: ON_MOUNTED_KEY,
  ON_BEFORE_UPDATE_KEY: ON_BEFORE_UPDATE_KEY,
  ON_UPDATED_KEY: ON_UPDATED_KEY,
  ON_BEFORE_UNMOUNT_KEY: ON_BEFORE_UNMOUNT_KEY,
  ON_UNMOUNTED_KEY: ON_UNMOUNTED_KEY,
  PROPS_KEY: PROPS_KEY,
  STATE_KEY: STATE_KEY,
  SLOTS_KEY: SLOTS_KEY,
  ROOT_KEY: ROOT_KEY,
  IS_PURE_SYMBOL: IS_PURE_SYMBOL,
  IS_COMPONENT_UPDATING: IS_COMPONENT_UPDATING,
  PARENT_KEY_SYMBOL: PARENT_KEY_SYMBOL,
  ATTRIBUTES_KEY_SYMBOL: ATTRIBUTES_KEY_SYMBOL,
  TEMPLATE_KEY_SYMBOL: TEMPLATE_KEY_SYMBOL
});

const EACH = 0;
const IF = 1;
const SIMPLE = 2;
const TAG = 3;
const SLOT = 4;
var bindingTypes = {
  EACH,
  IF,
  SIMPLE,
  TAG,
  SLOT
};

const ATTRIBUTE = 0;
const EVENT = 1;
const TEXT = 2;
const VALUE = 3;
var expressionTypes = {
  ATTRIBUTE,
  EVENT,
  TEXT,
  VALUE
};

const HEAD_SYMBOL = Symbol('head');
const TAIL_SYMBOL = Symbol('tail');

/**
 * Create the <template> fragments text nodes
 * @return {Object} {{head: Text, tail: Text}}
 */

function createHeadTailPlaceholders() {
  const head = document.createTextNode('');
  const tail = document.createTextNode('');
  head[HEAD_SYMBOL] = true;
  tail[TAIL_SYMBOL] = true;
  return {
    head,
    tail
  };
}

/**
 * Create the template meta object in case of <template> fragments
 * @param   {TemplateChunk} componentTemplate - template chunk object
 * @returns {Object} the meta property that will be passed to the mount function of the TemplateChunk
 */

function createTemplateMeta(componentTemplate) {
  const fragment = componentTemplate.dom.cloneNode(true);
  const {
    head,
    tail
  } = createHeadTailPlaceholders();
  return {
    avoidDOMInjection: true,
    fragment,
    head,
    tail,
    children: [head, ...Array.from(fragment.childNodes), tail]
  };
}

/**
 * Helper function to set an immutable property
 * @param   {Object} source - object where the new property will be set
 * @param   {string} key - object key where the new property will be stored
 * @param   {*} value - value of the new property
 * @param   {Object} options - set the propery overriding the default options
 * @returns {Object} - the original object modified
 */
function defineProperty(source, key, value, options) {
  if (options === void 0) {
    options = {};
  }

  /* eslint-disable fp/no-mutating-methods */
  Object.defineProperty(source, key, Object.assign({
    value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  /* eslint-enable fp/no-mutating-methods */

  return source;
}
/**
 * Define multiple properties on a target object
 * @param   {Object} source - object where the new properties will be set
 * @param   {Object} properties - object containing as key pair the key + value properties
 * @param   {Object} options - set the propery overriding the default options
 * @returns {Object} the original object modified
 */

function defineProperties(source, properties, options) {
  Object.entries(properties).forEach(_ref => {
    let [key, value] = _ref;
    defineProperty(source, key, value, options);
  });
  return source;
}
/**
 * Define default properties if they don't exist on the source object
 * @param   {Object} source - object that will receive the default properties
 * @param   {Object} defaults - object containing additional optional keys
 * @returns {Object} the original object received enhanced
 */

function defineDefaults(source, defaults) {
  Object.entries(defaults).forEach(_ref2 => {
    let [key, value] = _ref2;
    if (!source[key]) source[key] = value;
  });
  return source;
}

/**
 * Quick type checking
 * @param   {*} element - anything
 * @param   {string} type - type definition
 * @returns {boolean} true if the type corresponds
 */
function checkType(element, type) {
  return typeof element === type;
}
/**
 * Check if an element is part of an svg
 * @param   {HTMLElement}  el - element to check
 * @returns {boolean} true if we are in an svg context
 */

function isSvg(el) {
  const owner = el.ownerSVGElement;
  return !!owner || owner === null;
}
/**
 * Check if an element is a template tag
 * @param   {HTMLElement}  el - element to check
 * @returns {boolean} true if it's a <template>
 */

function isTemplate(el) {
  return el.tagName.toLowerCase() === 'template';
}
/**
 * Check that will be passed if its argument is a function
 * @param   {*} value - value to check
 * @returns {boolean} - true if the value is a function
 */

function isFunction(value) {
  return checkType(value, 'function');
}
/**
 * Check if a value is a Boolean
 * @param   {*}  value - anything
 * @returns {boolean} true only for the value is a boolean
 */

function isBoolean(value) {
  return checkType(value, 'boolean');
}
/**
 * Check if a value is an Object
 * @param   {*}  value - anything
 * @returns {boolean} true only for the value is an object
 */

function isObject(value) {
  return !isNil(value) && value.constructor === Object;
}
/**
 * Check if a value is null or undefined
 * @param   {*}  value - anything
 * @returns {boolean} true only for the 'undefined' and 'null' types
 */

function isNil(value) {
  return value === null || value === undefined;
}

/**
 * ISC License
 *
 * Copyright (c) 2020, Andrea Giammarchi, @WebReflection
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 * REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 * AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 * INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 * LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
 * OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 * PERFORMANCE OF THIS SOFTWARE.
 */
// fork of https://github.com/WebReflection/udomdiff version 1.1.0
// due to https://github.com/WebReflection/udomdiff/pull/2

/* eslint-disable */

/**
 * @param {Node[]} a The list of current/live children
 * @param {Node[]} b The list of future children
 * @param {(entry: Node, action: number) => Node} get
 * The callback invoked per each entry related DOM operation.
 * @param {Node} [before] The optional node used as anchor to insert before.
 * @returns {Node[]} The same list of future children.
 */

var udomdiff = ((a, b, get, before) => {
  const bLength = b.length;
  let aEnd = a.length;
  let bEnd = bLength;
  let aStart = 0;
  let bStart = 0;
  let map = null;

  while (aStart < aEnd || bStart < bEnd) {
    // append head, tail, or nodes in between: fast path
    if (aEnd === aStart) {
      // we could be in a situation where the rest of nodes that
      // need to be added are not at the end, and in such case
      // the node to `insertBefore`, if the index is more than 0
      // must be retrieved, otherwise it's gonna be the first item.
      const node = bEnd < bLength ? bStart ? get(b[bStart - 1], -0).nextSibling : get(b[bEnd - bStart], 0) : before;

      while (bStart < bEnd) insertBefore(get(b[bStart++], 1), node);
    } // remove head or tail: fast path
    else if (bEnd === bStart) {
      while (aStart < aEnd) {
        // remove the node only if it's unknown or not live
        if (!map || !map.has(a[aStart])) removeChild(get(a[aStart], -1));
        aStart++;
      }
    } // same node: fast path
    else if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
    } // same tail: fast path
    else if (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    } // The once here single last swap "fast path" has been removed in v1.1.0
    // https://github.com/WebReflection/udomdiff/blob/single-final-swap/esm/index.js#L69-L85
    // reverse swap: also fast path
    else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      // this is a "shrink" operation that could happen in these cases:
      // [1, 2, 3, 4, 5]
      // [1, 4, 3, 2, 5]
      // or asymmetric too
      // [1, 2, 3, 4, 5]
      // [1, 2, 3, 5, 6, 4]
      const node = get(a[--aEnd], -1).nextSibling;
      insertBefore(get(b[bStart++], 1), get(a[aStart++], -1).nextSibling);
      insertBefore(get(b[--bEnd], 1), node); // mark the future index as identical (yeah, it's dirty, but cheap 👍)
      // The main reason to do this, is that when a[aEnd] will be reached,
      // the loop will likely be on the fast path, as identical to b[bEnd].
      // In the best case scenario, the next loop will skip the tail,
      // but in the worst one, this node will be considered as already
      // processed, bailing out pretty quickly from the map index check

      a[aEnd] = b[bEnd];
    } // map based fallback, "slow" path
    else {
      // the map requires an O(bEnd - bStart) operation once
      // to store all future nodes indexes for later purposes.
      // In the worst case scenario, this is a full O(N) cost,
      // and such scenario happens at least when all nodes are different,
      // but also if both first and last items of the lists are different
      if (!map) {
        map = new Map();
        let i = bStart;

        while (i < bEnd) map.set(b[i], i++);
      } // if it's a future node, hence it needs some handling


      if (map.has(a[aStart])) {
        // grab the index of such node, 'cause it might have been processed
        const index = map.get(a[aStart]); // if it's not already processed, look on demand for the next LCS

        if (bStart < index && index < bEnd) {
          let i = aStart; // counts the amount of nodes that are the same in the future

          let sequence = 1;

          while (++i < aEnd && i < bEnd && map.get(a[i]) === index + sequence) sequence++; // effort decision here: if the sequence is longer than replaces
          // needed to reach such sequence, which would brings again this loop
          // to the fast path, prepend the difference before a sequence,
          // and move only the future list index forward, so that aStart
          // and bStart will be aligned again, hence on the fast path.
          // An example considering aStart and bStart are both 0:
          // a: [1, 2, 3, 4]
          // b: [7, 1, 2, 3, 6]
          // this would place 7 before 1 and, from that time on, 1, 2, and 3
          // will be processed at zero cost


          if (sequence > index - bStart) {
            const node = get(a[aStart], 0);

            while (bStart < index) insertBefore(get(b[bStart++], 1), node);
          } // if the effort wasn't good enough, fallback to a replace,
          // moving both source and target indexes forward, hoping that some
          // similar node will be found later on, to go back to the fast path
          else {
            replaceChild(get(b[bStart++], 1), get(a[aStart++], -1));
          }
        } // otherwise move the source forward, 'cause there's nothing to do
        else aStart++;
      } // this node has no meaning in the future list, so it's more than safe
      // to remove it, and check the next live node out instead, meaning
      // that only the live list index should be forwarded
      else removeChild(get(a[aStart++], -1));
    }
  }

  return b;
});

const UNMOUNT_SCOPE = Symbol('unmount');
const EachBinding = {
  // dynamic binding properties
  // childrenMap: null,
  // node: null,
  // root: null,
  // condition: null,
  // evaluate: null,
  // template: null,
  // isTemplateTag: false,
  nodes: [],

  // getKey: null,
  // indexName: null,
  // itemName: null,
  // afterPlaceholder: null,
  // placeholder: null,
  // API methods
  mount(scope, parentScope) {
    return this.update(scope, parentScope);
  },

  update(scope, parentScope) {
    const {
      placeholder,
      nodes,
      childrenMap
    } = this;
    const collection = scope === UNMOUNT_SCOPE ? null : this.evaluate(scope);
    const items = collection ? Array.from(collection) : []; // prepare the diffing

    const {
      newChildrenMap,
      batches,
      futureNodes
    } = createPatch(items, scope, parentScope, this); // patch the DOM only if there are new nodes

    udomdiff(nodes, futureNodes, patch(Array.from(childrenMap.values()), parentScope), placeholder); // trigger the mounts and the updates

    batches.forEach(fn => fn()); // update the children map

    this.childrenMap = newChildrenMap;
    this.nodes = futureNodes;
    return this;
  },

  unmount(scope, parentScope) {
    this.update(UNMOUNT_SCOPE, parentScope);
    return this;
  }

};
/**
 * Patch the DOM while diffing
 * @param   {any[]} redundant - list of all the children (template, nodes, context) added via each
 * @param   {*} parentScope - scope of the parent template
 * @returns {Function} patch function used by domdiff
 */

function patch(redundant, parentScope) {
  return (item, info) => {
    if (info < 0) {
      // get the last element added to the childrenMap saved previously
      const element = redundant[redundant.length - 1];

      if (element) {
        // get the nodes and the template in stored in the last child of the childrenMap
        const {
          template,
          nodes,
          context
        } = element; // remove the last node (notice <template> tags might have more children nodes)

        nodes.pop(); // notice that we pass null as last argument because
        // the root node and its children will be removed by domdiff

        if (!nodes.length) {
          // we have cleared all the children nodes and we can unmount this template
          redundant.pop();
          template.unmount(context, parentScope, null);
        }
      }
    }

    return item;
  };
}
/**
 * Check whether a template must be filtered from a loop
 * @param   {Function} condition - filter function
 * @param   {Object} context - argument passed to the filter function
 * @returns {boolean} true if this item should be skipped
 */


function mustFilterItem(condition, context) {
  return condition ? !condition(context) : false;
}
/**
 * Extend the scope of the looped template
 * @param   {Object} scope - current template scope
 * @param   {Object} options - options
 * @param   {string} options.itemName - key to identify the looped item in the new context
 * @param   {string} options.indexName - key to identify the index of the looped item
 * @param   {number} options.index - current index
 * @param   {*} options.item - collection item looped
 * @returns {Object} enhanced scope object
 */


function extendScope(scope, _ref) {
  let {
    itemName,
    indexName,
    index,
    item
  } = _ref;
  defineProperty(scope, itemName, item);
  if (indexName) defineProperty(scope, indexName, index);
  return scope;
}
/**
 * Loop the current template items
 * @param   {Array} items - expression collection value
 * @param   {*} scope - template scope
 * @param   {*} parentScope - scope of the parent template
 * @param   {EachBinding} binding - each binding object instance
 * @returns {Object} data
 * @returns {Map} data.newChildrenMap - a Map containing the new children template structure
 * @returns {Array} data.batches - array containing the template lifecycle functions to trigger
 * @returns {Array} data.futureNodes - array containing the nodes we need to diff
 */


function createPatch(items, scope, parentScope, binding) {
  const {
    condition,
    template,
    childrenMap,
    itemName,
    getKey,
    indexName,
    root,
    isTemplateTag
  } = binding;
  const newChildrenMap = new Map();
  const batches = [];
  const futureNodes = [];
  items.forEach((item, index) => {
    const context = extendScope(Object.create(scope), {
      itemName,
      indexName,
      index,
      item
    });
    const key = getKey ? getKey(context) : index;
    const oldItem = childrenMap.get(key);
    const nodes = [];

    if (mustFilterItem(condition, context)) {
      return;
    }

    const mustMount = !oldItem;
    const componentTemplate = oldItem ? oldItem.template : template.clone();
    const el = componentTemplate.el || root.cloneNode();
    const meta = isTemplateTag && mustMount ? createTemplateMeta(componentTemplate) : componentTemplate.meta;

    if (mustMount) {
      batches.push(() => componentTemplate.mount(el, context, parentScope, meta));
    } else {
      batches.push(() => componentTemplate.update(context, parentScope));
    } // create the collection of nodes to update or to add
    // in case of template tags we need to add all its children nodes


    if (isTemplateTag) {
      nodes.push(...meta.children);
    } else {
      nodes.push(el);
    } // delete the old item from the children map


    childrenMap.delete(key);
    futureNodes.push(...nodes); // update the children map

    newChildrenMap.set(key, {
      nodes,
      template: componentTemplate,
      context,
      index
    });
  });
  return {
    newChildrenMap,
    batches,
    futureNodes
  };
}

function create$6(node, _ref2) {
  let {
    evaluate,
    condition,
    itemName,
    indexName,
    getKey,
    template
  } = _ref2;
  const placeholder = document.createTextNode('');
  const root = node.cloneNode();
  insertBefore(placeholder, node);
  removeChild(node);
  return Object.assign({}, EachBinding, {
    childrenMap: new Map(),
    node,
    root,
    condition,
    evaluate,
    isTemplateTag: isTemplate(root),
    template: template.createDOM(node),
    getKey,
    indexName,
    itemName,
    placeholder
  });
}

/**
 * Binding responsible for the `if` directive
 */

const IfBinding = {
  // dynamic binding properties
  // node: null,
  // evaluate: null,
  // isTemplateTag: false,
  // placeholder: null,
  // template: null,
  // API methods
  mount(scope, parentScope) {
    return this.update(scope, parentScope);
  },

  update(scope, parentScope) {
    const value = !!this.evaluate(scope);
    const mustMount = !this.value && value;
    const mustUnmount = this.value && !value;

    const mount = () => {
      const pristine = this.node.cloneNode();
      insertBefore(pristine, this.placeholder);
      this.template = this.template.clone();
      this.template.mount(pristine, scope, parentScope);
    };

    switch (true) {
      case mustMount:
        mount();
        break;

      case mustUnmount:
        this.unmount(scope);
        break;

      default:
        if (value) this.template.update(scope, parentScope);
    }

    this.value = value;
    return this;
  },

  unmount(scope, parentScope) {
    this.template.unmount(scope, parentScope, true);
    return this;
  }

};
function create$5(node, _ref) {
  let {
    evaluate,
    template
  } = _ref;
  const placeholder = document.createTextNode('');
  insertBefore(placeholder, node);
  removeChild(node);
  return Object.assign({}, IfBinding, {
    node,
    evaluate,
    placeholder,
    template: template.createDOM(node)
  });
}

/**
 * Throw an error with a descriptive message
 * @param   { string } message - error message
 * @returns { undefined } hoppla.. at this point the program should stop working
 */

function panic(message) {
  throw new Error(message);
}
/**
 * Returns the memoized (cached) function.
 * // borrowed from https://www.30secondsofcode.org/js/s/memoize
 * @param {Function} fn - function to memoize
 * @returns {Function} memoize function
 */

function memoize(fn) {
  const cache = new Map();

  const cached = val => {
    return cache.has(val) ? cache.get(val) : cache.set(val, fn.call(this, val)) && cache.get(val);
  };

  cached.cache = cache;
  return cached;
}
/**
 * Evaluate a list of attribute expressions
 * @param   {Array} attributes - attribute expressions generated by the riot compiler
 * @returns {Object} key value pairs with the result of the computation
 */

function evaluateAttributeExpressions(attributes) {
  return attributes.reduce((acc, attribute) => {
    const {
      value,
      type
    } = attribute;

    switch (true) {
      // spread attribute
      case !attribute.name && type === ATTRIBUTE:
        return Object.assign({}, acc, value);
      // value attribute

      case type === VALUE:
        acc.value = attribute.value;
        break;
      // normal attributes

      default:
        acc[dashToCamelCase(attribute.name)] = attribute.value;
    }

    return acc;
  }, {});
}

const ElementProto = typeof Element === 'undefined' ? {} : Element.prototype;
const isNativeHtmlProperty = memoize(name => ElementProto.hasOwnProperty(name)); // eslint-disable-line

/**
 * Add all the attributes provided
 * @param   {HTMLElement} node - target node
 * @param   {Object} attributes - object containing the attributes names and values
 * @returns {undefined} sorry it's a void function :(
 */

function setAllAttributes(node, attributes) {
  Object.entries(attributes).forEach(_ref => {
    let [name, value] = _ref;
    return attributeExpression(node, {
      name
    }, value);
  });
}
/**
 * Remove all the attributes provided
 * @param   {HTMLElement} node - target node
 * @param   {Object} newAttributes - object containing all the new attribute names
 * @param   {Object} oldAttributes - object containing all the old attribute names
 * @returns {undefined} sorry it's a void function :(
 */


function removeAllAttributes(node, newAttributes, oldAttributes) {
  const newKeys = newAttributes ? Object.keys(newAttributes) : [];
  Object.keys(oldAttributes).filter(name => !newKeys.includes(name)).forEach(attribute => node.removeAttribute(attribute));
}
/**
 * Check whether the attribute value can be rendered
 * @param {*} value - expression value
 * @returns {boolean} true if we can render this attribute value
 */


function canRenderAttribute(value) {
  return value === true || ['string', 'number'].includes(typeof value);
}
/**
 * Check whether the attribute should be removed
 * @param {*} value - expression value
 * @returns {boolean} boolean - true if the attribute can be removed}
 */


function shouldRemoveAttribute(value) {
  return !value && value !== 0;
}
/**
 * This methods handles the DOM attributes updates
 * @param   {HTMLElement} node - target node
 * @param   {Object} expression - expression object
 * @param   {string} expression.name - attribute name
 * @param   {*} value - new expression value
 * @param   {*} oldValue - the old expression cached value
 * @returns {undefined}
 */


function attributeExpression(node, _ref2, value, oldValue) {
  let {
    name
  } = _ref2;

  // is it a spread operator? {...attributes}
  if (!name) {
    if (oldValue) {
      // remove all the old attributes
      removeAllAttributes(node, value, oldValue);
    } // is the value still truthy?


    if (value) {
      setAllAttributes(node, value);
    }

    return;
  } // handle boolean attributes


  if (!isNativeHtmlProperty(name) && (isBoolean(value) || isObject(value) || isFunction(value))) {
    node[name] = value;
  }

  if (shouldRemoveAttribute(value)) {
    node.removeAttribute(name);
  } else if (canRenderAttribute(value)) {
    node.setAttribute(name, normalizeValue(name, value));
  }
}
/**
 * Get the value as string
 * @param   {string} name - attribute name
 * @param   {*} value - user input value
 * @returns {string} input value as string
 */

function normalizeValue(name, value) {
  // be sure that expressions like selected={ true } will be always rendered as selected='selected'
  return value === true ? name : value;
}

const RE_EVENTS_PREFIX = /^on/;

const getCallbackAndOptions = value => Array.isArray(value) ? value : [value, false]; // see also https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38


const EventListener = {
  handleEvent(event) {
    this[event.type](event);
  }

};
const ListenersWeakMap = new WeakMap();

const createListener = node => {
  const listener = Object.create(EventListener);
  ListenersWeakMap.set(node, listener);
  return listener;
};
/**
 * Set a new event listener
 * @param   {HTMLElement} node - target node
 * @param   {Object} expression - expression object
 * @param   {string} expression.name - event name
 * @param   {*} value - new expression value
 * @returns {value} the callback just received
 */


function eventExpression(node, _ref, value) {
  let {
    name
  } = _ref;
  const normalizedEventName = name.replace(RE_EVENTS_PREFIX, '');
  const eventListener = ListenersWeakMap.get(node) || createListener(node);
  const [callback, options] = getCallbackAndOptions(value);
  const handler = eventListener[normalizedEventName];
  const mustRemoveEvent = handler && !callback;
  const mustAddEvent = callback && !handler;

  if (mustRemoveEvent) {
    node.removeEventListener(normalizedEventName, eventListener);
  }

  if (mustAddEvent) {
    node.addEventListener(normalizedEventName, eventListener, options);
  }

  eventListener[normalizedEventName] = callback;
}

/**
 * Normalize the user value in order to render a empty string in case of falsy values
 * @param   {*} value - user input value
 * @returns {string} hopefully a string
 */

function normalizeStringValue(value) {
  return isNil(value) ? '' : value;
}

/**
 * Get the the target text node to update or create one from of a comment node
 * @param   {HTMLElement} node - any html element containing childNodes
 * @param   {number} childNodeIndex - index of the text node in the childNodes list
 * @returns {Text} the text node to update
 */

const getTextNode = (node, childNodeIndex) => {
  const target = node.childNodes[childNodeIndex];

  if (target.nodeType === Node.COMMENT_NODE) {
    const textNode = document.createTextNode('');
    node.replaceChild(textNode, target);
    return textNode;
  }

  return target;
};
/**
 * This methods handles a simple text expression update
 * @param   {HTMLElement} node - target node
 * @param   {Object} data - expression object
 * @param   {*} value - new expression value
 * @returns {undefined}
 */

function textExpression(node, data, value) {
  node.data = normalizeStringValue(value);
}

/**
 * This methods handles the input fileds value updates
 * @param   {HTMLElement} node - target node
 * @param   {Object} expression - expression object
 * @param   {*} value - new expression value
 * @returns {undefined}
 */

function valueExpression(node, expression, value) {
  node.value = normalizeStringValue(value);
}

var expressions = {
  [ATTRIBUTE]: attributeExpression,
  [EVENT]: eventExpression,
  [TEXT]: textExpression,
  [VALUE]: valueExpression
};

const Expression = {
  // Static props
  // node: null,
  // value: null,
  // API methods

  /**
   * Mount the expression evaluating its initial value
   * @param   {*} scope - argument passed to the expression to evaluate its current values
   * @returns {Expression} self
   */
  mount(scope) {
    // hopefully a pure function
    this.value = this.evaluate(scope); // IO() DOM updates

    apply(this, this.value);
    return this;
  },

  /**
   * Update the expression if its value changed
   * @param   {*} scope - argument passed to the expression to evaluate its current values
   * @returns {Expression} self
   */
  update(scope) {
    // pure function
    const value = this.evaluate(scope);

    if (this.value !== value) {
      // IO() DOM updates
      apply(this, value);
      this.value = value;
    }

    return this;
  },

  /**
   * Expression teardown method
   * @returns {Expression} self
   */
  unmount() {
    // unmount only the event handling expressions
    if (this.type === EVENT) apply(this, null);
    return this;
  }

};
/**
 * IO() function to handle the DOM updates
 * @param {Expression} expression - expression object
 * @param {*} value - current expression value
 * @returns {undefined}
 */

function apply(expression, value) {
  return expressions[expression.type](expression.node, expression, value, expression.value);
}

function create$4(node, data) {
  return Object.assign({}, Expression, data, {
    node: data.type === TEXT ? getTextNode(node, data.childNodeIndex) : node
  });
}

/**
 * Create a flat object having as keys a list of methods that if dispatched will propagate
 * on the whole collection
 * @param   {Array} collection - collection to iterate
 * @param   {Array<string>} methods - methods to execute on each item of the collection
 * @param   {*} context - context returned by the new methods created
 * @returns {Object} a new object to simplify the the nested methods dispatching
 */
function flattenCollectionMethods(collection, methods, context) {
  return methods.reduce((acc, method) => {
    return Object.assign({}, acc, {
      [method]: scope => {
        return collection.map(item => item[method](scope)) && context;
      }
    });
  }, {});
}

function create$3(node, _ref) {
  let {
    expressions
  } = _ref;
  return Object.assign({}, flattenCollectionMethods(expressions.map(expression => create$4(node, expression)), ['mount', 'update', 'unmount']));
}

function extendParentScope(attributes, scope, parentScope) {
  if (!attributes || !attributes.length) return parentScope;
  const expressions = attributes.map(attr => Object.assign({}, attr, {
    value: attr.evaluate(scope)
  }));
  return Object.assign(Object.create(parentScope || null), evaluateAttributeExpressions(expressions));
} // this function is only meant to fix an edge case
// https://github.com/riot/riot/issues/2842


const getRealParent = (scope, parentScope) => scope[PARENT_KEY_SYMBOL] || parentScope;

const SlotBinding = {
  // dynamic binding properties
  // node: null,
  // name: null,
  attributes: [],

  // template: null,
  getTemplateScope(scope, parentScope) {
    return extendParentScope(this.attributes, scope, parentScope);
  },

  // API methods
  mount(scope, parentScope) {
    const templateData = scope.slots ? scope.slots.find(_ref => {
      let {
        id
      } = _ref;
      return id === this.name;
    }) : false;
    const {
      parentNode
    } = this.node;
    const realParent = getRealParent(scope, parentScope);
    this.template = templateData && create(templateData.html, templateData.bindings).createDOM(parentNode);

    if (this.template) {
      cleanNode(this.node);
      this.template.mount(this.node, this.getTemplateScope(scope, realParent), realParent);
      this.template.children = Array.from(this.node.childNodes);
    }

    moveSlotInnerContent(this.node);
    removeChild(this.node);
    return this;
  },

  update(scope, parentScope) {
    if (this.template) {
      const realParent = getRealParent(scope, parentScope);
      this.template.update(this.getTemplateScope(scope, realParent), realParent);
    }

    return this;
  },

  unmount(scope, parentScope, mustRemoveRoot) {
    if (this.template) {
      this.template.unmount(this.getTemplateScope(scope, parentScope), null, mustRemoveRoot);
    }

    return this;
  }

};
/**
 * Move the inner content of the slots outside of them
 * @param   {HTMLElement} slot - slot node
 * @returns {undefined} it's a void method ¯\_(ツ)_/¯
 */

function moveSlotInnerContent(slot) {
  const child = slot && slot.firstChild;
  if (!child) return;
  insertBefore(child, slot);
  moveSlotInnerContent(slot);
}
/**
 * Create a single slot binding
 * @param   {HTMLElement} node - slot node
 * @param   {string} name - slot id
 * @param   {AttributeExpressionData[]} attributes - slot attributes
 * @returns {Object} Slot binding object
 */


function createSlot(node, _ref2) {
  let {
    name,
    attributes
  } = _ref2;
  return Object.assign({}, SlotBinding, {
    attributes,
    node,
    name
  });
}

/**
 * Create a new tag object if it was registered before, otherwise fallback to the simple
 * template chunk
 * @param   {Function} component - component factory function
 * @param   {Array<Object>} slots - array containing the slots markup
 * @param   {Array} attributes - dynamic attributes that will be received by the tag element
 * @returns {TagImplementation|TemplateChunk} a tag implementation or a template chunk as fallback
 */

function getTag(component, slots, attributes) {
  if (slots === void 0) {
    slots = [];
  }

  if (attributes === void 0) {
    attributes = [];
  }

  // if this tag was registered before we will return its implementation
  if (component) {
    return component({
      slots,
      attributes
    });
  } // otherwise we return a template chunk


  return create(slotsToMarkup(slots), [...slotBindings(slots), {
    // the attributes should be registered as binding
    // if we fallback to a normal template chunk
    expressions: attributes.map(attr => {
      return Object.assign({
        type: ATTRIBUTE
      }, attr);
    })
  }]);
}
/**
 * Merge all the slots bindings into a single array
 * @param   {Array<Object>} slots - slots collection
 * @returns {Array<Bindings>} flatten bindings array
 */


function slotBindings(slots) {
  return slots.reduce((acc, _ref) => {
    let {
      bindings
    } = _ref;
    return acc.concat(bindings);
  }, []);
}
/**
 * Merge all the slots together in a single markup string
 * @param   {Array<Object>} slots - slots collection
 * @returns {string} markup of all the slots in a single string
 */


function slotsToMarkup(slots) {
  return slots.reduce((acc, slot) => {
    return acc + slot.html;
  }, '');
}

const TagBinding = {
  // dynamic binding properties
  // node: null,
  // evaluate: null,
  // name: null,
  // slots: null,
  // tag: null,
  // attributes: null,
  // getComponent: null,
  mount(scope) {
    return this.update(scope);
  },

  update(scope, parentScope) {
    const name = this.evaluate(scope); // simple update

    if (name && name === this.name) {
      this.tag.update(scope);
    } else {
      // unmount the old tag if it exists
      this.unmount(scope, parentScope, true); // mount the new tag

      this.name = name;
      this.tag = getTag(this.getComponent(name), this.slots, this.attributes);
      this.tag.mount(this.node, scope);
    }

    return this;
  },

  unmount(scope, parentScope, keepRootTag) {
    if (this.tag) {
      // keep the root tag
      this.tag.unmount(keepRootTag);
    }

    return this;
  }

};
function create$2(node, _ref2) {
  let {
    evaluate,
    getComponent,
    slots,
    attributes
  } = _ref2;
  return Object.assign({}, TagBinding, {
    node,
    evaluate,
    slots,
    attributes,
    getComponent
  });
}

var bindings = {
  [IF]: create$5,
  [SIMPLE]: create$3,
  [EACH]: create$6,
  [TAG]: create$2,
  [SLOT]: createSlot
};

/**
 * Text expressions in a template tag will get childNodeIndex value normalized
 * depending on the position of the <template> tag offset
 * @param   {Expression[]} expressions - riot expressions array
 * @param   {number} textExpressionsOffset - offset of the <template> tag
 * @returns {Expression[]} expressions containing the text expressions normalized
 */

function fixTextExpressionsOffset(expressions, textExpressionsOffset) {
  return expressions.map(e => e.type === TEXT ? Object.assign({}, e, {
    childNodeIndex: e.childNodeIndex + textExpressionsOffset
  }) : e);
}
/**
 * Bind a new expression object to a DOM node
 * @param   {HTMLElement} root - DOM node where to bind the expression
 * @param   {TagBindingData} binding - binding data
 * @param   {number|null} templateTagOffset - if it's defined we need to fix the text expressions childNodeIndex offset
 * @returns {Binding} Binding object
 */


function create$1(root, binding, templateTagOffset) {
  const {
    selector,
    type,
    redundantAttribute,
    expressions
  } = binding; // find the node to apply the bindings

  const node = selector ? root.querySelector(selector) : root; // remove eventually additional attributes created only to select this node

  if (redundantAttribute) node.removeAttribute(redundantAttribute);
  const bindingExpressions = expressions || []; // init the binding

  return (bindings[type] || bindings[SIMPLE])(node, Object.assign({}, binding, {
    expressions: templateTagOffset && !selector ? fixTextExpressionsOffset(bindingExpressions, templateTagOffset) : bindingExpressions
  }));
}

function createHTMLTree(html, root) {
  const template = isTemplate(root) ? root : document.createElement('template');
  template.innerHTML = html;
  return template.content;
} // for svg nodes we need a bit more work


function createSVGTree(html, container) {
  // create the SVGNode
  const svgNode = container.ownerDocument.importNode(new window.DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`, 'application/xml').documentElement, true);
  return svgNode;
}
/**
 * Create the DOM that will be injected
 * @param {Object} root - DOM node to find out the context where the fragment will be created
 * @param   {string} html - DOM to create as string
 * @returns {HTMLDocumentFragment|HTMLElement} a new html fragment
 */


function createDOMTree(root, html) {
  if (isSvg(root)) return createSVGTree(html, root);
  return createHTMLTree(html, root);
}

/**
 * Inject the DOM tree into a target node
 * @param   {HTMLElement} el - target element
 * @param   {DocumentFragment|SVGElement} dom - dom tree to inject
 * @returns {undefined}
 */

function injectDOM(el, dom) {
  switch (true) {
    case isSvg(el):
      moveChildren(dom, el);
      break;

    case isTemplate(el):
      el.parentNode.replaceChild(dom, el);
      break;

    default:
      el.appendChild(dom);
  }
}

/**
 * Create the Template DOM skeleton
 * @param   {HTMLElement} el - root node where the DOM will be injected
 * @param   {string|HTMLElement} html - HTML markup or HTMLElement that will be injected into the root node
 * @returns {?DocumentFragment} fragment that will be injected into the root node
 */

function createTemplateDOM(el, html) {
  return html && (typeof html === 'string' ? createDOMTree(el, html) : html);
}
/**
 * Get the offset of the <template> tag
 * @param {HTMLElement} parentNode - template tag parent node
 * @param {HTMLElement} el - the template tag we want to render
 * @param   {Object} meta - meta properties needed to handle the <template> tags in loops
 * @returns {number} offset of the <template> tag calculated from its siblings DOM nodes
 */


function getTemplateTagOffset(parentNode, el, meta) {
  const siblings = Array.from(parentNode.childNodes);
  return Math.max(siblings.indexOf(el), siblings.indexOf(meta.head) + 1, 0);
}
/**
 * Template Chunk model
 * @type {Object}
 */


const TemplateChunk = Object.freeze({
  // Static props
  // bindings: null,
  // bindingsData: null,
  // html: null,
  // isTemplateTag: false,
  // fragment: null,
  // children: null,
  // dom: null,
  // el: null,

  /**
   * Create the template DOM structure that will be cloned on each mount
   * @param   {HTMLElement} el - the root node
   * @returns {TemplateChunk} self
   */
  createDOM(el) {
    // make sure that the DOM gets created before cloning the template
    this.dom = this.dom || createTemplateDOM(el, this.html) || document.createDocumentFragment();
    return this;
  },

  // API methods

  /**
   * Attach the template to a DOM node
   * @param   {HTMLElement} el - target DOM node
   * @param   {*} scope - template data
   * @param   {*} parentScope - scope of the parent template tag
   * @param   {Object} meta - meta properties needed to handle the <template> tags in loops
   * @returns {TemplateChunk} self
   */
  mount(el, scope, parentScope, meta) {
    if (meta === void 0) {
      meta = {};
    }

    if (!el) throw new Error('Please provide DOM node to mount properly your template');
    if (this.el) this.unmount(scope); // <template> tags require a bit more work
    // the template fragment might be already created via meta outside of this call

    const {
      fragment,
      children,
      avoidDOMInjection
    } = meta; // <template> bindings of course can not have a root element
    // so we check the parent node to set the query selector bindings

    const {
      parentNode
    } = children ? children[0] : el;
    const isTemplateTag = isTemplate(el);
    const templateTagOffset = isTemplateTag ? getTemplateTagOffset(parentNode, el, meta) : null; // create the DOM if it wasn't created before

    this.createDOM(el); // create the DOM of this template cloning the original DOM structure stored in this instance
    // notice that if a documentFragment was passed (via meta) we will use it instead

    const cloneNode = fragment || this.dom.cloneNode(true); // store root node
    // notice that for template tags the root note will be the parent tag

    this.el = isTemplateTag ? parentNode : el; // create the children array only for the <template> fragments

    this.children = isTemplateTag ? children || Array.from(cloneNode.childNodes) : null; // inject the DOM into the el only if a fragment is available

    if (!avoidDOMInjection && cloneNode) injectDOM(el, cloneNode); // create the bindings

    this.bindings = this.bindingsData.map(binding => create$1(this.el, binding, templateTagOffset));
    this.bindings.forEach(b => b.mount(scope, parentScope)); // store the template meta properties

    this.meta = meta;
    return this;
  },

  /**
   * Update the template with fresh data
   * @param   {*} scope - template data
   * @param   {*} parentScope - scope of the parent template tag
   * @returns {TemplateChunk} self
   */
  update(scope, parentScope) {
    this.bindings.forEach(b => b.update(scope, parentScope));
    return this;
  },

  /**
   * Remove the template from the node where it was initially mounted
   * @param   {*} scope - template data
   * @param   {*} parentScope - scope of the parent template tag
   * @param   {boolean|null} mustRemoveRoot - if true remove the root element,
   * if false or undefined clean the root tag content, if null don't touch the DOM
   * @returns {TemplateChunk} self
   */
  unmount(scope, parentScope, mustRemoveRoot) {
    if (mustRemoveRoot === void 0) {
      mustRemoveRoot = false;
    }

    const el = this.el;

    if (!el) {
      return this;
    }

    this.bindings.forEach(b => b.unmount(scope, parentScope, mustRemoveRoot));

    switch (true) {
      // pure components should handle the DOM unmount updates by themselves
      // for mustRemoveRoot === null don't touch the DOM
      case el[IS_PURE_SYMBOL] || mustRemoveRoot === null:
        break;
      // if children are declared, clear them
      // applicable for <template> and <slot/> bindings

      case Array.isArray(this.children):
        clearChildren(this.children);
        break;
      // clean the node children only

      case !mustRemoveRoot:
        cleanNode(el);
        break;
      // remove the root node only if the mustRemoveRoot is truly

      case !!mustRemoveRoot:
        removeChild(el);
        break;
    }

    this.el = null;
    return this;
  },

  /**
   * Clone the template chunk
   * @returns {TemplateChunk} a clone of this object resetting the this.el property
   */
  clone() {
    return Object.assign({}, this, {
      meta: {},
      el: null
    });
  }

});
/**
 * Create a template chunk wiring also the bindings
 * @param   {string|HTMLElement} html - template string
 * @param   {BindingData[]} bindings - bindings collection
 * @returns {TemplateChunk} a new TemplateChunk copy
 */

function create(html, bindings) {
  if (bindings === void 0) {
    bindings = [];
  }

  return Object.assign({}, TemplateChunk, {
    html,
    bindingsData: bindings
  });
}

/**
 * Method used to bind expressions to a DOM node
 * @param   {string|HTMLElement} html - your static template html structure
 * @param   {Array} bindings - list of the expressions to bind to update the markup
 * @returns {TemplateChunk} a new TemplateChunk object having the `update`,`mount`, `unmount` and `clone` methods
 *
 * @example
 *
 * riotDOMBindings
 *  .template(
 *   `<div expr0><!----></div><div><p expr1><!----><section expr2></section></p>`,
 *   [
 *     {
 *       selector: '[expr0]',
 *       redundantAttribute: 'expr0',
 *       expressions: [
 *         {
 *           type: expressionTypes.TEXT,
 *           childNodeIndex: 0,
 *           evaluate(scope) {
 *             return scope.time;
 *           },
 *         },
 *       ],
 *     },
 *     {
 *       selector: '[expr1]',
 *       redundantAttribute: 'expr1',
 *       expressions: [
 *         {
 *           type: expressionTypes.TEXT,
 *           childNodeIndex: 0,
 *           evaluate(scope) {
 *             return scope.name;
 *           },
 *         },
 *         {
 *           type: 'attribute',
 *           name: 'style',
 *           evaluate(scope) {
 *             return scope.style;
 *           },
 *         },
 *       ],
 *     },
 *     {
 *       selector: '[expr2]',
 *       redundantAttribute: 'expr2',
 *       type: bindingTypes.IF,
 *       evaluate(scope) {
 *         return scope.isVisible;
 *       },
 *       template: riotDOMBindings.template('hello there'),
 *     },
 *   ]
 * )
 */

var DOMBindings = /*#__PURE__*/Object.freeze({
  __proto__: null,
  template: create,
  createBinding: create$1,
  createExpression: create$4,
  bindingTypes: bindingTypes,
  expressionTypes: expressionTypes
});

function noop() {
  return this;
}
/**
 * Autobind the methods of a source object to itself
 * @param   {Object} source - probably a riot tag instance
 * @param   {Array<string>} methods - list of the methods to autobind
 * @returns {Object} the original object received
 */

function autobindMethods(source, methods) {
  methods.forEach(method => {
    source[method] = source[method].bind(source);
  });
  return source;
}
/**
 * Call the first argument received only if it's a function otherwise return it as it is
 * @param   {*} source - anything
 * @returns {*} anything
 */

function callOrAssign(source) {
  return isFunction(source) ? source.prototype && source.prototype.constructor ? new source() : source() : source;
}

/**
 * Converts any DOM node/s to a loopable array
 * @param   { HTMLElement|NodeList } els - single html element or a node list
 * @returns { Array } always a loopable object
 */
function domToArray(els) {
  // can this object be already looped?
  if (!Array.isArray(els)) {
    // is it a node list?
    if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(els)) && typeof els.length === 'number') return Array.from(els);else // if it's a single node
      // it will be returned as "array" with one single entry
      return [els];
  } // this object could be looped out of the box


  return els;
}

/**
 * Simple helper to find DOM nodes returning them as array like loopable object
 * @param   { string|DOMNodeList } selector - either the query or the DOM nodes to arraify
 * @param   { HTMLElement }        ctx      - context defining where the query will search for the DOM nodes
 * @returns { Array } DOM nodes found as array
 */

function $(selector, ctx) {
  return domToArray(typeof selector === 'string' ? (ctx || document).querySelectorAll(selector) : selector);
}

/**
 * Normalize the return values, in case of a single value we avoid to return an array
 * @param   { Array } values - list of values we want to return
 * @returns { Array|string|boolean } either the whole list of values or the single one found
 * @private
 */

const normalize = values => values.length === 1 ? values[0] : values;
/**
 * Parse all the nodes received to get/remove/check their attributes
 * @param   { HTMLElement|NodeList|Array } els    - DOM node/s to parse
 * @param   { string|Array }               name   - name or list of attributes
 * @param   { string }                     method - method that will be used to parse the attributes
 * @returns { Array|string } result of the parsing in a list or a single value
 * @private
 */


function parseNodes(els, name, method) {
  const names = typeof name === 'string' ? [name] : name;
  return normalize(domToArray(els).map(el => {
    return normalize(names.map(n => el[method](n)));
  }));
}
/**
 * Set any attribute on a single or a list of DOM nodes
 * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
 * @param   { string|Object }              name  - either the name of the attribute to set
 *                                                 or a list of properties as object key - value
 * @param   { string }                     value - the new value of the attribute (optional)
 * @returns { HTMLElement|NodeList|Array } the original array of elements passed to this function
 *
 * @example
 *
 * import { set } from 'bianco.attr'
 *
 * const img = document.createElement('img')
 *
 * set(img, 'width', 100)
 *
 * // or also
 * set(img, {
 *   width: 300,
 *   height: 300
 * })
 *
 */


function set(els, name, value) {
  const attrs = typeof name === 'object' ? name : {
    [name]: value
  };
  const props = Object.keys(attrs);
  domToArray(els).forEach(el => {
    props.forEach(prop => el.setAttribute(prop, attrs[prop]));
  });
  return els;
}
/**
 * Get any attribute from a single or a list of DOM nodes
 * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
 * @param   { string|Array }               name  - name or list of attributes to get
 * @returns { Array|string } list of the attributes found
 *
 * @example
 *
 * import { get } from 'bianco.attr'
 *
 * const img = document.createElement('img')
 *
 * get(img, 'width') // => '200'
 *
 * // or also
 * get(img, ['width', 'height']) // => ['200', '300']
 *
 * // or also
 * get([img1, img2], ['width', 'height']) // => [['200', '300'], ['500', '200']]
 */

function get(els, name) {
  return parseNodes(els, name, 'getAttribute');
}

const CSS_BY_NAME = new Map();
const STYLE_NODE_SELECTOR = 'style[riot]'; // memoized curried function

const getStyleNode = (style => {
  return () => {
    // lazy evaluation:
    // if this function was already called before
    // we return its cached result
    if (style) return style; // create a new style element or use an existing one
    // and cache it internally

    style = $(STYLE_NODE_SELECTOR)[0] || document.createElement('style');
    set(style, 'type', 'text/css');
    /* istanbul ignore next */

    if (!style.parentNode) document.head.appendChild(style);
    return style;
  };
})();
/**
 * Object that will be used to inject and manage the css of every tag instance
 */


var cssManager = {
  CSS_BY_NAME,

  /**
   * Save a tag style to be later injected into DOM
   * @param { string } name - if it's passed we will map the css to a tagname
   * @param { string } css - css string
   * @returns {Object} self
   */
  add(name, css) {
    if (!CSS_BY_NAME.has(name)) {
      CSS_BY_NAME.set(name, css);
      this.inject();
    }

    return this;
  },

  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   * @returns {Object} self
   */
  inject() {
    getStyleNode().innerHTML = [...CSS_BY_NAME.values()].join('\n');
    return this;
  },

  /**
   * Remove a tag style from the DOM
   * @param {string} name a registered tagname
   * @returns {Object} self
   */
  remove(name) {
    if (CSS_BY_NAME.has(name)) {
      CSS_BY_NAME.delete(name);
      this.inject();
    }

    return this;
  }

};

/**
 * Function to curry any javascript method
 * @param   {Function}  fn - the target function we want to curry
 * @param   {...[args]} acc - initial arguments
 * @returns {Function|*} it will return a function until the target function
 *                       will receive all of its arguments
 */
function curry(fn) {
  for (var _len = arguments.length, acc = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    acc[_key - 1] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args = [...acc, ...args];
    return args.length < fn.length ? curry(fn, ...args) : fn(...args);
  };
}

/**
 * Get the tag name of any DOM node
 * @param   {HTMLElement} element - DOM node we want to inspect
 * @returns {string} name to identify this dom node in riot
 */

function getName(element) {
  return get(element, IS_DIRECTIVE) || element.tagName.toLowerCase();
}

const COMPONENT_CORE_HELPERS = Object.freeze({
  // component helpers
  $(selector) {
    return $(selector, this.root)[0];
  },

  $$(selector) {
    return $(selector, this.root);
  }

});
const PURE_COMPONENT_API = Object.freeze({
  [MOUNT_METHOD_KEY]: noop,
  [UPDATE_METHOD_KEY]: noop,
  [UNMOUNT_METHOD_KEY]: noop
});
const COMPONENT_LIFECYCLE_METHODS = Object.freeze({
  [SHOULD_UPDATE_KEY]: noop,
  [ON_BEFORE_MOUNT_KEY]: noop,
  [ON_MOUNTED_KEY]: noop,
  [ON_BEFORE_UPDATE_KEY]: noop,
  [ON_UPDATED_KEY]: noop,
  [ON_BEFORE_UNMOUNT_KEY]: noop,
  [ON_UNMOUNTED_KEY]: noop
});
const MOCKED_TEMPLATE_INTERFACE = Object.assign({}, PURE_COMPONENT_API, {
  clone: noop,
  createDOM: noop
});
/**
 * Performance optimization for the recursive components
 * @param  {RiotComponentWrapper} componentWrapper - riot compiler generated object
 * @returns {Object} component like interface
 */

const memoizedCreateComponent = memoize(createComponent);
/**
 * Evaluate the component properties either from its real attributes or from its initial user properties
 * @param   {HTMLElement} element - component root
 * @param   {Object}  initialProps - initial props
 * @returns {Object} component props key value pairs
 */

function evaluateInitialProps(element, initialProps) {
  if (initialProps === void 0) {
    initialProps = {};
  }

  return Object.assign({}, DOMattributesToObject(element), callOrAssign(initialProps));
}
/**
 * Bind a DOM node to its component object
 * @param   {HTMLElement} node - html node mounted
 * @param   {Object} component - Riot.js component object
 * @returns {Object} the component object received as second argument
 */


const bindDOMNodeToComponentObject = (node, component) => node[DOM_COMPONENT_INSTANCE_PROPERTY$1] = component;
/**
 * Wrap the Riot.js core API methods using a mapping function
 * @param   {Function} mapFunction - lifting function
 * @returns {Object} an object having the { mount, update, unmount } functions
 */


function createCoreAPIMethods(mapFunction) {
  return [MOUNT_METHOD_KEY, UPDATE_METHOD_KEY, UNMOUNT_METHOD_KEY].reduce((acc, method) => {
    acc[method] = mapFunction(method);
    return acc;
  }, {});
}
/**
 * Factory function to create the component templates only once
 * @param   {Function} template - component template creation function
 * @param   {RiotComponentWrapper} componentWrapper - riot compiler generated object
 * @returns {TemplateChunk} template chunk object
 */


function componentTemplateFactory(template, componentWrapper) {
  const components = createSubcomponents(componentWrapper.exports ? componentWrapper.exports.components : {});
  return template(create, expressionTypes, bindingTypes, name => {
    // improve support for recursive components
    if (name === componentWrapper.name) return memoizedCreateComponent(componentWrapper); // return the registered components

    return components[name] || COMPONENTS_IMPLEMENTATION_MAP$1.get(name);
  });
}
/**
 * Create a pure component
 * @param   {Function} pureFactoryFunction - pure component factory function
 * @param   {Array} options.slots - component slots
 * @param   {Array} options.attributes - component attributes
 * @param   {Array} options.template - template factory function
 * @param   {Array} options.template - template factory function
 * @param   {any} options.props - initial component properties
 * @returns {Object} pure component object
 */


function createPureComponent(pureFactoryFunction, _ref) {
  let {
    slots,
    attributes,
    props,
    css,
    template
  } = _ref;
  if (template) panic('Pure components can not have html');
  if (css) panic('Pure components do not have css');
  const component = defineDefaults(pureFactoryFunction({
    slots,
    attributes,
    props
  }), PURE_COMPONENT_API);
  return createCoreAPIMethods(method => function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // intercept the mount calls to bind the DOM node to the pure object created
    // see also https://github.com/riot/riot/issues/2806
    if (method === MOUNT_METHOD_KEY) {
      const [element] = args; // mark this node as pure element

      defineProperty(element, IS_PURE_SYMBOL, true);
      bindDOMNodeToComponentObject(element, component);
    }

    component[method](...args);
    return component;
  });
}
/**
 * Create the component interface needed for the @riotjs/dom-bindings tag bindings
 * @param   {RiotComponentWrapper} componentWrapper - riot compiler generated object
 * @param   {string} componentWrapper.css - component css
 * @param   {Function} componentWrapper.template - function that will return the dom-bindings template function
 * @param   {Object} componentWrapper.exports - component interface
 * @param   {string} componentWrapper.name - component name
 * @returns {Object} component like interface
 */


function createComponent(componentWrapper) {
  const {
    css,
    template,
    exports,
    name
  } = componentWrapper;
  const templateFn = template ? componentTemplateFactory(template, componentWrapper) : MOCKED_TEMPLATE_INTERFACE;
  return _ref2 => {
    let {
      slots,
      attributes,
      props
    } = _ref2;
    // pure components rendering will be managed by the end user
    if (exports && exports[IS_PURE_SYMBOL]) return createPureComponent(exports, {
      slots,
      attributes,
      props,
      css,
      template
    });
    const componentAPI = callOrAssign(exports) || {};
    const component = defineComponent({
      css,
      template: templateFn,
      componentAPI,
      name
    })({
      slots,
      attributes,
      props
    }); // notice that for the components create via tag binding
    // we need to invert the mount (state/parentScope) arguments
    // the template bindings will only forward the parentScope updates
    // and never deal with the component state

    return {
      mount(element, parentScope, state) {
        return component.mount(element, state, parentScope);
      },

      update(parentScope, state) {
        return component.update(state, parentScope);
      },

      unmount(preserveRoot) {
        return component.unmount(preserveRoot);
      }

    };
  };
}
/**
 * Component definition function
 * @param   {Object} implementation - the componen implementation will be generated via compiler
 * @param   {Object} component - the component initial properties
 * @returns {Object} a new component implementation object
 */

function defineComponent(_ref3) {
  let {
    css,
    template,
    componentAPI,
    name
  } = _ref3;
  // add the component css into the DOM
  if (css && name) cssManager.add(name, css);
  return curry(enhanceComponentAPI)(defineProperties( // set the component defaults without overriding the original component API
  defineDefaults(componentAPI, Object.assign({}, COMPONENT_LIFECYCLE_METHODS, {
    [PROPS_KEY]: {},
    [STATE_KEY]: {}
  })), Object.assign({
    // defined during the component creation
    [SLOTS_KEY]: null,
    [ROOT_KEY]: null
  }, COMPONENT_CORE_HELPERS, {
    name,
    css,
    template
  })));
}
/**
 * Create the bindings to update the component attributes
 * @param   {HTMLElement} node - node where we will bind the expressions
 * @param   {Array} attributes - list of attribute bindings
 * @returns {TemplateChunk} - template bindings object
 */

function createAttributeBindings(node, attributes) {
  if (attributes === void 0) {
    attributes = [];
  }

  const expressions = attributes.map(a => create$4(node, a));
  const binding = {};
  return Object.assign(binding, Object.assign({
    expressions
  }, createCoreAPIMethods(method => scope => {
    expressions.forEach(e => e[method](scope));
    return binding;
  })));
}
/**
 * Create the subcomponents that can be included inside a tag in runtime
 * @param   {Object} components - components imported in runtime
 * @returns {Object} all the components transformed into Riot.Component factory functions
 */


function createSubcomponents(components) {
  if (components === void 0) {
    components = {};
  }

  return Object.entries(callOrAssign(components)).reduce((acc, _ref4) => {
    let [key, value] = _ref4;
    acc[camelToDashCase(key)] = createComponent(value);
    return acc;
  }, {});
}
/**
 * Run the component instance through all the plugins set by the user
 * @param   {Object} component - component instance
 * @returns {Object} the component enhanced by the plugins
 */


function runPlugins(component) {
  return [...PLUGINS_SET$1].reduce((c, fn) => fn(c) || c, component);
}
/**
 * Compute the component current state merging it with its previous state
 * @param   {Object} oldState - previous state object
 * @param   {Object} newState - new state givent to the `update` call
 * @returns {Object} new object state
 */


function computeState(oldState, newState) {
  return Object.assign({}, oldState, callOrAssign(newState));
}
/**
 * Add eventually the "is" attribute to link this DOM node to its css
 * @param {HTMLElement} element - target root node
 * @param {string} name - name of the component mounted
 * @returns {undefined} it's a void function
 */


function addCssHook(element, name) {
  if (getName(element) !== name) {
    set(element, IS_DIRECTIVE, name);
  }
}
/**
 * Component creation factory function that will enhance the user provided API
 * @param   {Object} component - a component implementation previously defined
 * @param   {Array} options.slots - component slots generated via riot compiler
 * @param   {Array} options.attributes - attribute expressions generated via riot compiler
 * @returns {Riot.Component} a riot component instance
 */


function enhanceComponentAPI(component, _ref5) {
  let {
    slots,
    attributes,
    props
  } = _ref5;
  return autobindMethods(runPlugins(defineProperties(isObject(component) ? Object.create(component) : component, {
    mount(element, state, parentScope) {
      if (state === void 0) {
        state = {};
      }

      // any element mounted passing through this function can't be a pure component
      defineProperty(element, IS_PURE_SYMBOL, false);
      this[PARENT_KEY_SYMBOL] = parentScope;
      this[ATTRIBUTES_KEY_SYMBOL] = createAttributeBindings(element, attributes).mount(parentScope);
      defineProperty(this, PROPS_KEY, Object.freeze(Object.assign({}, evaluateInitialProps(element, props), evaluateAttributeExpressions(this[ATTRIBUTES_KEY_SYMBOL].expressions))));
      this[STATE_KEY] = computeState(this[STATE_KEY], state);
      this[TEMPLATE_KEY_SYMBOL] = this.template.createDOM(element).clone(); // link this object to the DOM node

      bindDOMNodeToComponentObject(element, this); // add eventually the 'is' attribute

      component.name && addCssHook(element, component.name); // define the root element

      defineProperty(this, ROOT_KEY, element); // define the slots array

      defineProperty(this, SLOTS_KEY, slots); // before mount lifecycle event

      this[ON_BEFORE_MOUNT_KEY](this[PROPS_KEY], this[STATE_KEY]); // mount the template

      this[TEMPLATE_KEY_SYMBOL].mount(element, this, parentScope);
      this[ON_MOUNTED_KEY](this[PROPS_KEY], this[STATE_KEY]);
      return this;
    },

    update(state, parentScope) {
      if (state === void 0) {
        state = {};
      }

      if (parentScope) {
        this[PARENT_KEY_SYMBOL] = parentScope;
        this[ATTRIBUTES_KEY_SYMBOL].update(parentScope);
      }

      const newProps = evaluateAttributeExpressions(this[ATTRIBUTES_KEY_SYMBOL].expressions);
      if (this[SHOULD_UPDATE_KEY](newProps, this[PROPS_KEY]) === false) return;
      defineProperty(this, PROPS_KEY, Object.freeze(Object.assign({}, this[PROPS_KEY], newProps)));
      this[STATE_KEY] = computeState(this[STATE_KEY], state);
      this[ON_BEFORE_UPDATE_KEY](this[PROPS_KEY], this[STATE_KEY]); // avoiding recursive updates
      // see also https://github.com/riot/riot/issues/2895

      if (!this[IS_COMPONENT_UPDATING]) {
        this[IS_COMPONENT_UPDATING] = true;
        this[TEMPLATE_KEY_SYMBOL].update(this, this[PARENT_KEY_SYMBOL]);
      }

      this[ON_UPDATED_KEY](this[PROPS_KEY], this[STATE_KEY]);
      this[IS_COMPONENT_UPDATING] = false;
      return this;
    },

    unmount(preserveRoot) {
      this[ON_BEFORE_UNMOUNT_KEY](this[PROPS_KEY], this[STATE_KEY]);
      this[ATTRIBUTES_KEY_SYMBOL].unmount(); // if the preserveRoot is null the template html will be left untouched
      // in that case the DOM cleanup will happen differently from a parent node

      this[TEMPLATE_KEY_SYMBOL].unmount(this, this[PARENT_KEY_SYMBOL], preserveRoot === null ? null : !preserveRoot);
      this[ON_UNMOUNTED_KEY](this[PROPS_KEY], this[STATE_KEY]);
      return this;
    }

  })), Object.keys(component).filter(prop => isFunction(component[prop])));
}
/**
 * Component initialization function starting from a DOM node
 * @param   {HTMLElement} element - element to upgrade
 * @param   {Object} initialProps - initial component properties
 * @param   {string} componentName - component id
 * @returns {Object} a new component instance bound to a DOM node
 */

function mountComponent(element, initialProps, componentName) {
  const name = componentName || getName(element);
  if (!COMPONENTS_IMPLEMENTATION_MAP$1.has(name)) panic(`The component named "${name}" was never registered`);
  const component = COMPONENTS_IMPLEMENTATION_MAP$1.get(name)({
    props: initialProps
  });
  return component.mount(element);
}

/**
 * Similar to compose but performs from left-to-right function composition.<br/>
 * {@link https://30secondsofcode.org/function#composeright see also}
 * @param   {...[function]} fns) - list of unary function
 * @returns {*} result of the computation
 */
/**
 * Performs right-to-left function composition.<br/>
 * Use Array.prototype.reduce() to perform right-to-left function composition.<br/>
 * The last (rightmost) function can accept one or more arguments; the remaining functions must be unary.<br/>
 * {@link https://30secondsofcode.org/function#compose original source code}
 * @param   {...[function]} fns) - list of unary function
 * @returns {*} result of the computation
 */

function compose() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  return fns.reduce((f, g) => function () {
    return f(g(...arguments));
  });
}

const {
  DOM_COMPONENT_INSTANCE_PROPERTY,
  COMPONENTS_IMPLEMENTATION_MAP,
  PLUGINS_SET
} = globals;
/**
 * Riot public api
 */

/**
 * Register a custom tag by name
 * @param   {string} name - component name
 * @param   {Object} implementation - tag implementation
 * @returns {Map} map containing all the components implementations
 */

function register(name, _ref) {
  let {
    css,
    template,
    exports
  } = _ref;
  if (COMPONENTS_IMPLEMENTATION_MAP.has(name)) panic(`The component "${name}" was already registered`);
  COMPONENTS_IMPLEMENTATION_MAP.set(name, createComponent({
    name,
    css,
    template,
    exports
  }));
  return COMPONENTS_IMPLEMENTATION_MAP;
}
/**
 * Unregister a riot web component
 * @param   {string} name - component name
 * @returns {Map} map containing all the components implementations
 */

function unregister(name) {
  if (!COMPONENTS_IMPLEMENTATION_MAP.has(name)) panic(`The component "${name}" was never registered`);
  COMPONENTS_IMPLEMENTATION_MAP.delete(name);
  cssManager.remove(name);
  return COMPONENTS_IMPLEMENTATION_MAP;
}
/**
 * Mounting function that will work only for the components that were globally registered
 * @param   {string|HTMLElement} selector - query for the selection or a DOM element
 * @param   {Object} initialProps - the initial component properties
 * @param   {string} name - optional component name
 * @returns {Array} list of riot components
 */

function mount(selector, initialProps, name) {
  return $(selector).map(element => mountComponent(element, initialProps, name));
}
/**
 * Sweet unmounting helper function for the DOM node mounted manually by the user
 * @param   {string|HTMLElement} selector - query for the selection or a DOM element
 * @param   {boolean|null} keepRootElement - if true keep the root element
 * @returns {Array} list of nodes unmounted
 */

function unmount(selector, keepRootElement) {
  return $(selector).map(element => {
    if (element[DOM_COMPONENT_INSTANCE_PROPERTY]) {
      element[DOM_COMPONENT_INSTANCE_PROPERTY].unmount(keepRootElement);
    }

    return element;
  });
}
/**
 * Define a riot plugin
 * @param   {Function} plugin - function that will receive all the components created
 * @returns {Set} the set containing all the plugins installed
 */

function install(plugin) {
  if (!isFunction(plugin)) panic('Plugins must be of type function');
  if (PLUGINS_SET.has(plugin)) panic('This plugin was already installed');
  PLUGINS_SET.add(plugin);
  return PLUGINS_SET;
}
/**
 * Uninstall a riot plugin
 * @param   {Function} plugin - plugin previously installed
 * @returns {Set} the set containing all the plugins installed
 */

function uninstall(plugin) {
  if (!PLUGINS_SET.has(plugin)) panic('This plugin was never installed');
  PLUGINS_SET.delete(plugin);
  return PLUGINS_SET;
}
/**
 * Helper method to create component without relying on the registered ones
 * @param   {Object} implementation - component implementation
 * @returns {Function} function that will allow you to mount a riot component on a DOM node
 */

function component(implementation) {
  return function (el, props, _temp) {
    let {
      slots,
      attributes,
      parentScope
    } = _temp === void 0 ? {} : _temp;
    return compose(c => c.mount(el, parentScope), c => c({
      props,
      slots,
      attributes
    }), createComponent)(implementation);
  };
}
/**
 * Lift a riot component Interface into a pure riot object
 * @param   {Function} func - RiotPureComponent factory function
 * @returns {Function} the lifted original function received as argument
 */

function pure(func) {
  if (!isFunction(func)) panic('riot.pure accepts only arguments of type "function"');
  func[IS_PURE_SYMBOL] = true;
  return func;
}
/**
 * no-op function needed to add the proper types to your component via typescript
 * @param {Function|Object} component - component default export
 * @returns {Function|Object} returns exactly what it has received
 */

const withTypes = component => component;
/** @type {string} current riot version */

const version = 'v6.1.2'; // expose some internal stuff that might be used from external tools

const __ = {
  cssManager,
  DOMBindings,
  createComponent,
  defineComponent,
  globals
};




/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayLikeToArray)
/* harmony export */ });
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _arrayWithHoles)
/* harmony export */ });
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _assertThisInitialized)
/* harmony export */ });
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _classCallCheck)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/createClass.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/createClass.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _createClass)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _defineProperty)
/* harmony export */ });
/* harmony import */ var _toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toPropertyKey.js */ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js");

function _defineProperty(obj, key, value) {
  key = (0,_toPropertyKey_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _getPrototypeOf)
/* harmony export */ });
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inherits.js":
/*!*************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inherits.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inherits)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/iterableToArray.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _iterableToArray)
/* harmony export */ });
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js":
/*!********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _nonIterableRest)
/* harmony export */ });
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _possibleConstructorReturn)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assertThisInitialized.js */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");


function _possibleConstructorReturn(self, call) {
  if (call && ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return (0,_assertThisInitialized_js__WEBPACK_IMPORTED_MODULE_1__["default"])(self);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toArray.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toArray.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toArray)
/* harmony export */ });
/* harmony import */ var _arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayWithHoles.js */ "./node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js");
/* harmony import */ var _iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./iterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/iterableToArray.js");
/* harmony import */ var _unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./unsupportedIterableToArray.js */ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");
/* harmony import */ var _nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./nonIterableRest.js */ "./node_modules/@babel/runtime/helpers/esm/nonIterableRest.js");




function _toArray(arr) {
  return (0,_arrayWithHoles_js__WEBPACK_IMPORTED_MODULE_0__["default"])(arr) || (0,_iterableToArray_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arr) || (0,_unsupportedIterableToArray_js__WEBPACK_IMPORTED_MODULE_2__["default"])(arr) || (0,_nonIterableRest_js__WEBPACK_IMPORTED_MODULE_3__["default"])();
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js":
/*!****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPrimitive)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");

function _toPrimitive(input, hint) {
  if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if ((0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _toPropertyKey)
/* harmony export */ });
/* harmony import */ var _typeof_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./typeof.js */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toPrimitive.js */ "./node_modules/@babel/runtime/helpers/esm/toPrimitive.js");


function _toPropertyKey(arg) {
  var key = (0,_toPrimitive_js__WEBPACK_IMPORTED_MODULE_1__["default"])(arg, "string");
  return (0,_typeof_js__WEBPACK_IMPORTED_MODULE_0__["default"])(key) === "symbol" ? key : String(key);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _unsupportedIterableToArray)
/* harmony export */ });
/* harmony import */ var _arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arrayLikeToArray.js */ "./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return (0,_arrayLikeToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(o, minLen);
}

/***/ }),

/***/ "./node_modules/i18next/dist/esm/i18next.js":
/*!**************************************************!*\
  !*** ./node_modules/i18next/dist/esm/i18next.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   changeLanguage: () => (/* binding */ changeLanguage),
/* harmony export */   createInstance: () => (/* binding */ createInstance),
/* harmony export */   "default": () => (/* binding */ instance),
/* harmony export */   dir: () => (/* binding */ dir),
/* harmony export */   exists: () => (/* binding */ exists),
/* harmony export */   getFixedT: () => (/* binding */ getFixedT),
/* harmony export */   hasLoadedNamespace: () => (/* binding */ hasLoadedNamespace),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   loadLanguages: () => (/* binding */ loadLanguages),
/* harmony export */   loadNamespaces: () => (/* binding */ loadNamespaces),
/* harmony export */   loadResources: () => (/* binding */ loadResources),
/* harmony export */   reloadResources: () => (/* binding */ reloadResources),
/* harmony export */   setDefaultNamespace: () => (/* binding */ setDefaultNamespace),
/* harmony export */   t: () => (/* binding */ t),
/* harmony export */   use: () => (/* binding */ use)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/classCallCheck */ "./node_modules/@babel/runtime/helpers/esm/classCallCheck.js");
/* harmony import */ var _babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @babel/runtime/helpers/esm/createClass */ "./node_modules/@babel/runtime/helpers/esm/createClass.js");
/* harmony import */ var _babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @babel/runtime/helpers/esm/assertThisInitialized */ "./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js");
/* harmony import */ var _babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inherits */ "./node_modules/@babel/runtime/helpers/esm/inherits.js");
/* harmony import */ var _babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @babel/runtime/helpers/esm/possibleConstructorReturn */ "./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js");
/* harmony import */ var _babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @babel/runtime/helpers/esm/getPrototypeOf */ "./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js");
/* harmony import */ var _babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var _babel_runtime_helpers_esm_toArray__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @babel/runtime/helpers/esm/toArray */ "./node_modules/@babel/runtime/helpers/esm/toArray.js");










function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var consoleLogger = {
  type: 'logger',
  log: function log(args) {
    this.output('log', args);
  },
  warn: function warn(args) {
    this.output('warn', args);
  },
  error: function error(args) {
    this.output('error', args);
  },
  output: function output(type, args) {
    if (console && console[type]) console[type].apply(console, args);
  }
};
var Logger = function () {
  function Logger(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Logger);
    this.init(concreteLogger, options);
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Logger, [{
    key: "init",
    value: function init(concreteLogger) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.prefix = options.prefix || 'i18next:';
      this.logger = concreteLogger || consoleLogger;
      this.options = options;
      this.debug = options.debug;
    }
  }, {
    key: "setDebug",
    value: function setDebug(bool) {
      this.debug = bool;
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return this.forward(args, 'log', '', true);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return this.forward(args, 'warn', '', true);
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      return this.forward(args, 'error', '');
    }
  }, {
    key: "deprecate",
    value: function deprecate() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
    }
  }, {
    key: "forward",
    value: function forward(args, lvl, prefix, debugOnly) {
      if (debugOnly && !this.debug) return null;
      if (typeof args[0] === 'string') args[0] = "".concat(prefix).concat(this.prefix, " ").concat(args[0]);
      return this.logger[lvl](args);
    }
  }, {
    key: "create",
    value: function create(moduleName) {
      return new Logger(this.logger, _objectSpread$6(_objectSpread$6({}, {
        prefix: "".concat(this.prefix, ":").concat(moduleName, ":")
      }), this.options));
    }
  }, {
    key: "clone",
    value: function clone(options) {
      options = options || this.options;
      options.prefix = options.prefix || this.prefix;
      return new Logger(this.logger, options);
    }
  }]);
  return Logger;
}();
var baseLogger = new Logger();

var EventEmitter = function () {
  function EventEmitter() {
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, EventEmitter);
    this.observers = {};
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(EventEmitter, [{
    key: "on",
    value: function on(events, listener) {
      var _this = this;
      events.split(' ').forEach(function (event) {
        _this.observers[event] = _this.observers[event] || [];
        _this.observers[event].push(listener);
      });
      return this;
    }
  }, {
    key: "off",
    value: function off(event, listener) {
      if (!this.observers[event]) return;
      if (!listener) {
        delete this.observers[event];
        return;
      }
      this.observers[event] = this.observers[event].filter(function (l) {
        return l !== listener;
      });
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (this.observers[event]) {
        var cloned = [].concat(this.observers[event]);
        cloned.forEach(function (observer) {
          observer.apply(void 0, args);
        });
      }
      if (this.observers['*']) {
        var _cloned = [].concat(this.observers['*']);
        _cloned.forEach(function (observer) {
          observer.apply(observer, [event].concat(args));
        });
      }
    }
  }]);
  return EventEmitter;
}();

function defer() {
  var res;
  var rej;
  var promise = new Promise(function (resolve, reject) {
    res = resolve;
    rej = reject;
  });
  promise.resolve = res;
  promise.reject = rej;
  return promise;
}
function makeString(object) {
  if (object == null) return '';
  return '' + object;
}
function copy(a, s, t) {
  a.forEach(function (m) {
    if (s[m]) t[m] = s[m];
  });
}
function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }
  function canNotTraverseDeeper() {
    return !object || typeof object === 'string';
  }
  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');
  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};
    var key = cleanKey(stack.shift());
    if (!object[key] && Empty) object[key] = new Empty();
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      object = object[key];
    } else {
      object = {};
    }
  }
  if (canNotTraverseDeeper()) return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}
function setPath(object, path, newValue) {
  var _getLastOfPath = getLastOfPath(object, path, Object),
    obj = _getLastOfPath.obj,
    k = _getLastOfPath.k;
  obj[k] = newValue;
}
function pushPath(object, path, newValue, concat) {
  var _getLastOfPath2 = getLastOfPath(object, path, Object),
    obj = _getLastOfPath2.obj,
    k = _getLastOfPath2.k;
  obj[k] = obj[k] || [];
  if (concat) obj[k] = obj[k].concat(newValue);
  if (!concat) obj[k].push(newValue);
}
function getPath(object, path) {
  var _getLastOfPath3 = getLastOfPath(object, path),
    obj = _getLastOfPath3.obj,
    k = _getLastOfPath3.k;
  if (!obj) return undefined;
  return obj[k];
}
function getPathWithDefaults(data, defaultData, key) {
  var value = getPath(data, key);
  if (value !== undefined) {
    return value;
  }
  return getPath(defaultData, key);
}
function deepExtend(target, source, overwrite) {
  for (var prop in source) {
    if (prop !== '__proto__' && prop !== 'constructor') {
      if (prop in target) {
        if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
          if (overwrite) target[prop] = source[prop];
        } else {
          deepExtend(target[prop], source[prop], overwrite);
        }
      } else {
        target[prop] = source[prop];
      }
    }
  }
  return target;
}
function regexEscape(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
var _entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};
function escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  }
  return data;
}
var isIE10 = typeof window !== 'undefined' && window.navigator && typeof window.navigator.userAgentData === 'undefined' && window.navigator.userAgent && window.navigator.userAgent.indexOf('MSIE') > -1;
var chars = [' ', ',', '?', '!', ';'];
function looksLikeObjectPath(key, nsSeparator, keySeparator) {
  nsSeparator = nsSeparator || '';
  keySeparator = keySeparator || '';
  var possibleChars = chars.filter(function (c) {
    return nsSeparator.indexOf(c) < 0 && keySeparator.indexOf(c) < 0;
  });
  if (possibleChars.length === 0) return true;
  var r = new RegExp("(".concat(possibleChars.map(function (c) {
    return c === '?' ? '\\?' : c;
  }).join('|'), ")"));
  var matched = !r.test(key);
  if (!matched) {
    var ki = key.indexOf(keySeparator);
    if (ki > 0 && !r.test(key.substring(0, ki))) {
      matched = true;
    }
  }
  return matched;
}
function deepFind(obj, path) {
  var keySeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
  if (!obj) return undefined;
  if (obj[path]) return obj[path];
  var paths = path.split(keySeparator);
  var current = obj;
  for (var i = 0; i < paths.length; ++i) {
    if (!current) return undefined;
    if (typeof current[paths[i]] === 'string' && i + 1 < paths.length) {
      return undefined;
    }
    if (current[paths[i]] === undefined) {
      var j = 2;
      var p = paths.slice(i, i + j).join(keySeparator);
      var mix = current[p];
      while (mix === undefined && paths.length > i + j) {
        j++;
        p = paths.slice(i, i + j).join(keySeparator);
        mix = current[p];
      }
      if (mix === undefined) return undefined;
      if (mix === null) return null;
      if (path.endsWith(p)) {
        if (typeof mix === 'string') return mix;
        if (p && typeof mix[p] === 'string') return mix[p];
      }
      var joinedPath = paths.slice(i + j).join(keySeparator);
      if (joinedPath) return deepFind(mix, joinedPath, keySeparator);
      return undefined;
    }
    current = current[paths[i]];
  }
  return current;
}

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ResourceStore = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(ResourceStore, _EventEmitter);
  var _super = _createSuper$3(ResourceStore);
  function ResourceStore(data) {
    var _this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      ns: ['translation'],
      defaultNS: 'translation'
    };
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, ResourceStore);
    _this = _super.call(this);
    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }
    _this.data = data || {};
    _this.options = options;
    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }
    if (_this.options.ignoreJSONStructure === undefined) {
      _this.options.ignoreJSONStructure = true;
    }
    return _this;
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(ResourceStore, [{
    key: "addNamespaces",
    value: function addNamespaces(ns) {
      if (this.options.ns.indexOf(ns) < 0) {
        this.options.ns.push(ns);
      }
    }
  }, {
    key: "removeNamespaces",
    value: function removeNamespaces(ns) {
      var index = this.options.ns.indexOf(ns);
      if (index > -1) {
        this.options.ns.splice(index, 1);
      }
    }
  }, {
    key: "getResource",
    value: function getResource(lng, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var ignoreJSONStructure = options.ignoreJSONStructure !== undefined ? options.ignoreJSONStructure : this.options.ignoreJSONStructure;
      var path = [lng, ns];
      if (key && typeof key !== 'string') path = path.concat(key);
      if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);
      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
      }
      var result = getPath(this.data, path);
      if (result || !ignoreJSONStructure || typeof key !== 'string') return result;
      return deepFind(this.data && this.data[lng] && this.data[lng][ns], key, keySeparator);
    }
  }, {
    key: "addResource",
    value: function addResource(lng, ns, key, value) {
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        silent: false
      };
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var path = [lng, ns];
      if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        value = ns;
        ns = path[1];
      }
      this.addNamespaces(ns);
      setPath(this.data, path, value);
      if (!options.silent) this.emit('added', lng, ns, key, value);
    }
  }, {
    key: "addResources",
    value: function addResources(lng, ns, resources) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
        silent: false
      };
      for (var m in resources) {
        if (typeof resources[m] === 'string' || Object.prototype.toString.apply(resources[m]) === '[object Array]') this.addResource(lng, ns, m, resources[m], {
          silent: true
        });
      }
      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "addResourceBundle",
    value: function addResourceBundle(lng, ns, resources, deep, overwrite) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {
        silent: false
      };
      var path = [lng, ns];
      if (lng.indexOf('.') > -1) {
        path = lng.split('.');
        deep = resources;
        resources = ns;
        ns = path[1];
      }
      this.addNamespaces(ns);
      var pack = getPath(this.data, path) || {};
      if (deep) {
        deepExtend(pack, resources, overwrite);
      } else {
        pack = _objectSpread$5(_objectSpread$5({}, pack), resources);
      }
      setPath(this.data, path, pack);
      if (!options.silent) this.emit('added', lng, ns, resources);
    }
  }, {
    key: "removeResourceBundle",
    value: function removeResourceBundle(lng, ns) {
      if (this.hasResourceBundle(lng, ns)) {
        delete this.data[lng][ns];
      }
      this.removeNamespaces(ns);
      this.emit('removed', lng, ns);
    }
  }, {
    key: "hasResourceBundle",
    value: function hasResourceBundle(lng, ns) {
      return this.getResource(lng, ns) !== undefined;
    }
  }, {
    key: "getResourceBundle",
    value: function getResourceBundle(lng, ns) {
      if (!ns) ns = this.options.defaultNS;
      if (this.options.compatibilityAPI === 'v1') return _objectSpread$5(_objectSpread$5({}, {}), this.getResource(lng, ns));
      return this.getResource(lng, ns);
    }
  }, {
    key: "getDataByLanguage",
    value: function getDataByLanguage(lng) {
      return this.data[lng];
    }
  }, {
    key: "hasLanguageSomeTranslations",
    value: function hasLanguageSomeTranslations(lng) {
      var data = this.getDataByLanguage(lng);
      var n = data && Object.keys(data) || [];
      return !!n.find(function (v) {
        return data[v] && Object.keys(data[v]).length > 0;
      });
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.data;
    }
  }]);
  return ResourceStore;
}(EventEmitter);

var postProcessor = {
  processors: {},
  addPostProcessor: function addPostProcessor(module) {
    this.processors[module.name] = module;
  },
  handle: function handle(processors, value, key, options, translator) {
    var _this = this;
    processors.forEach(function (processor) {
      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
    });
    return value;
  }
};

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var checkedLoadedFor = {};
var Translator = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Translator, _EventEmitter);
  var _super = _createSuper$2(Translator);
  function Translator(services) {
    var _this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Translator);
    _this = _super.call(this);
    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }
    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector', 'i18nFormat', 'utils'], services, (0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    _this.options = options;
    if (_this.options.keySeparator === undefined) {
      _this.options.keySeparator = '.';
    }
    _this.logger = baseLogger.create('translator');
    return _this;
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Translator, [{
    key: "changeLanguage",
    value: function changeLanguage(lng) {
      if (lng) this.language = lng;
    }
  }, {
    key: "exists",
    value: function exists(key) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };
      if (key === undefined || key === null) {
        return false;
      }
      var resolved = this.resolve(key, options);
      return resolved && resolved.res !== undefined;
    }
  }, {
    key: "extractFromKey",
    value: function extractFromKey(key, options) {
      var nsSeparator = options.nsSeparator !== undefined ? options.nsSeparator : this.options.nsSeparator;
      if (nsSeparator === undefined) nsSeparator = ':';
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var namespaces = options.ns || this.options.defaultNS || [];
      var wouldCheckForNsInKey = nsSeparator && key.indexOf(nsSeparator) > -1;
      var seemsNaturalLanguage = !this.options.userDefinedKeySeparator && !options.keySeparator && !this.options.userDefinedNsSeparator && !options.nsSeparator && !looksLikeObjectPath(key, nsSeparator, keySeparator);
      if (wouldCheckForNsInKey && !seemsNaturalLanguage) {
        var m = key.match(this.interpolator.nestingRegexp);
        if (m && m.length > 0) {
          return {
            key: key,
            namespaces: namespaces
          };
        }
        var parts = key.split(nsSeparator);
        if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
        key = parts.join(keySeparator);
      }
      if (typeof namespaces === 'string') namespaces = [namespaces];
      return {
        key: key,
        namespaces: namespaces
      };
    }
  }, {
    key: "translate",
    value: function translate(keys, options, lastKey) {
      var _this2 = this;
      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(options) !== 'object' && this.options.overloadTranslationOptionHandler) {
        options = this.options.overloadTranslationOptionHandler(arguments);
      }
      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(options) === 'object') options = _objectSpread$4({}, options);
      if (!options) options = {};
      if (keys === undefined || keys === null) return '';
      if (!Array.isArray(keys)) keys = [String(keys)];
      var returnDetails = options.returnDetails !== undefined ? options.returnDetails : this.options.returnDetails;
      var keySeparator = options.keySeparator !== undefined ? options.keySeparator : this.options.keySeparator;
      var _this$extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
        key = _this$extractFromKey.key,
        namespaces = _this$extractFromKey.namespaces;
      var namespace = namespaces[namespaces.length - 1];
      var lng = options.lng || this.language;
      var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
      if (lng && lng.toLowerCase() === 'cimode') {
        if (appendNamespaceToCIMode) {
          var nsSeparator = options.nsSeparator || this.options.nsSeparator;
          if (returnDetails) {
            return {
              res: "".concat(namespace).concat(nsSeparator).concat(key),
              usedKey: key,
              exactUsedKey: key,
              usedLng: lng,
              usedNS: namespace
            };
          }
          return "".concat(namespace).concat(nsSeparator).concat(key);
        }
        if (returnDetails) {
          return {
            res: key,
            usedKey: key,
            exactUsedKey: key,
            usedLng: lng,
            usedNS: namespace
          };
        }
        return key;
      }
      var resolved = this.resolve(keys, options);
      var res = resolved && resolved.res;
      var resUsedKey = resolved && resolved.usedKey || key;
      var resExactUsedKey = resolved && resolved.exactUsedKey || key;
      var resType = Object.prototype.toString.apply(res);
      var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
      var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
      var handleAsObjectInI18nFormat = !this.i18nFormat || this.i18nFormat.handleAsObject;
      var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
      if (handleAsObjectInI18nFormat && res && handleAsObject && noObject.indexOf(resType) < 0 && !(typeof joinArrays === 'string' && resType === '[object Array]')) {
        if (!options.returnObjects && !this.options.returnObjects) {
          if (!this.options.returnedObjectHandler) {
            this.logger.warn('accessing an object - but returnObjects options is not enabled!');
          }
          var r = this.options.returnedObjectHandler ? this.options.returnedObjectHandler(resUsedKey, res, _objectSpread$4(_objectSpread$4({}, options), {}, {
            ns: namespaces
          })) : "key '".concat(key, " (").concat(this.language, ")' returned an object instead of string.");
          if (returnDetails) {
            resolved.res = r;
            return resolved;
          }
          return r;
        }
        if (keySeparator) {
          var resTypeIsArray = resType === '[object Array]';
          var copy = resTypeIsArray ? [] : {};
          var newKeyToUse = resTypeIsArray ? resExactUsedKey : resUsedKey;
          for (var m in res) {
            if (Object.prototype.hasOwnProperty.call(res, m)) {
              var deepKey = "".concat(newKeyToUse).concat(keySeparator).concat(m);
              copy[m] = this.translate(deepKey, _objectSpread$4(_objectSpread$4({}, options), {
                joinArrays: false,
                ns: namespaces
              }));
              if (copy[m] === deepKey) copy[m] = res[m];
            }
          }
          res = copy;
        }
      } else if (handleAsObjectInI18nFormat && typeof joinArrays === 'string' && resType === '[object Array]') {
        res = res.join(joinArrays);
        if (res) res = this.extendTranslation(res, keys, options, lastKey);
      } else {
        var usedDefault = false;
        var usedKey = false;
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var hasDefaultValue = Translator.hasDefaultValue(options);
        var defaultValueSuffix = needsPluralHandling ? this.pluralResolver.getSuffix(lng, options.count, options) : '';
        var defaultValue = options["defaultValue".concat(defaultValueSuffix)] || options.defaultValue;
        if (!this.isValidLookup(res) && hasDefaultValue) {
          usedDefault = true;
          res = defaultValue;
        }
        if (!this.isValidLookup(res)) {
          usedKey = true;
          res = key;
        }
        var missingKeyNoValueFallbackToKey = options.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey;
        var resForMissing = missingKeyNoValueFallbackToKey && usedKey ? undefined : res;
        var updateMissing = hasDefaultValue && defaultValue !== res && this.options.updateMissing;
        if (usedKey || usedDefault || updateMissing) {
          this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? defaultValue : res);
          if (keySeparator) {
            var fk = this.resolve(key, _objectSpread$4(_objectSpread$4({}, options), {}, {
              keySeparator: false
            }));
            if (fk && fk.res) this.logger.warn('Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.');
          }
          var lngs = [];
          var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
          if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
            for (var i = 0; i < fallbackLngs.length; i++) {
              lngs.push(fallbackLngs[i]);
            }
          } else if (this.options.saveMissingTo === 'all') {
            lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
          } else {
            lngs.push(options.lng || this.language);
          }
          var send = function send(l, k, specificDefaultValue) {
            var defaultForMissing = hasDefaultValue && specificDefaultValue !== res ? specificDefaultValue : resForMissing;
            if (_this2.options.missingKeyHandler) {
              _this2.options.missingKeyHandler(l, namespace, k, defaultForMissing, updateMissing, options);
            } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
              _this2.backendConnector.saveMissing(l, namespace, k, defaultForMissing, updateMissing, options);
            }
            _this2.emit('missingKey', l, namespace, k, res);
          };
          if (this.options.saveMissing) {
            if (this.options.saveMissingPlurals && needsPluralHandling) {
              lngs.forEach(function (language) {
                _this2.pluralResolver.getSuffixes(language, options).forEach(function (suffix) {
                  send([language], key + suffix, options["defaultValue".concat(suffix)] || defaultValue);
                });
              });
            } else {
              send(lngs, key, defaultValue);
            }
          }
        }
        res = this.extendTranslation(res, keys, options, resolved, lastKey);
        if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = "".concat(namespace, ":").concat(key);
        if ((usedKey || usedDefault) && this.options.parseMissingKeyHandler) {
          if (this.options.compatibilityAPI !== 'v1') {
            res = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? "".concat(namespace, ":").concat(key) : key, usedDefault ? res : undefined);
          } else {
            res = this.options.parseMissingKeyHandler(res);
          }
        }
      }
      if (returnDetails) {
        resolved.res = res;
        return resolved;
      }
      return res;
    }
  }, {
    key: "extendTranslation",
    value: function extendTranslation(res, key, options, resolved, lastKey) {
      var _this3 = this;
      if (this.i18nFormat && this.i18nFormat.parse) {
        res = this.i18nFormat.parse(res, _objectSpread$4(_objectSpread$4({}, this.options.interpolation.defaultVariables), options), resolved.usedLng, resolved.usedNS, resolved.usedKey, {
          resolved: resolved
        });
      } else if (!options.skipInterpolation) {
        if (options.interpolation) this.interpolator.init(_objectSpread$4(_objectSpread$4({}, options), {
          interpolation: _objectSpread$4(_objectSpread$4({}, this.options.interpolation), options.interpolation)
        }));
        var skipOnVariables = typeof res === 'string' && (options && options.interpolation && options.interpolation.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
        var nestBef;
        if (skipOnVariables) {
          var nb = res.match(this.interpolator.nestingRegexp);
          nestBef = nb && nb.length;
        }
        var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
        if (this.options.interpolation.defaultVariables) data = _objectSpread$4(_objectSpread$4({}, this.options.interpolation.defaultVariables), data);
        res = this.interpolator.interpolate(res, data, options.lng || this.language, options);
        if (skipOnVariables) {
          var na = res.match(this.interpolator.nestingRegexp);
          var nestAft = na && na.length;
          if (nestBef < nestAft) options.nest = false;
        }
        if (!options.lng && this.options.compatibilityAPI !== 'v1' && resolved && resolved.res) options.lng = resolved.usedLng;
        if (options.nest !== false) res = this.interpolator.nest(res, function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          if (lastKey && lastKey[0] === args[0] && !options.context) {
            _this3.logger.warn("It seems you are nesting recursively key: ".concat(args[0], " in key: ").concat(key[0]));
            return null;
          }
          return _this3.translate.apply(_this3, args.concat([key]));
        }, options);
        if (options.interpolation) this.interpolator.reset();
      }
      var postProcess = options.postProcess || this.options.postProcess;
      var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;
      if (res !== undefined && res !== null && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
        res = postProcessor.handle(postProcessorNames, res, key, this.options && this.options.postProcessPassResolved ? _objectSpread$4({
          i18nResolved: resolved
        }, options) : options, this);
      }
      return res;
    }
  }, {
    key: "resolve",
    value: function resolve(keys) {
      var _this4 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var found;
      var usedKey;
      var exactUsedKey;
      var usedLng;
      var usedNS;
      if (typeof keys === 'string') keys = [keys];
      keys.forEach(function (k) {
        if (_this4.isValidLookup(found)) return;
        var extracted = _this4.extractFromKey(k, options);
        var key = extracted.key;
        usedKey = key;
        var namespaces = extracted.namespaces;
        if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);
        var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
        var needsZeroSuffixLookup = needsPluralHandling && !options.ordinal && options.count === 0 && _this4.pluralResolver.shouldUseIntlApi();
        var needsContextHandling = options.context !== undefined && (typeof options.context === 'string' || typeof options.context === 'number') && options.context !== '';
        var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language, options.fallbackLng);
        namespaces.forEach(function (ns) {
          if (_this4.isValidLookup(found)) return;
          usedNS = ns;
          if (!checkedLoadedFor["".concat(codes[0], "-").concat(ns)] && _this4.utils && _this4.utils.hasLoadedNamespace && !_this4.utils.hasLoadedNamespace(usedNS)) {
            checkedLoadedFor["".concat(codes[0], "-").concat(ns)] = true;
            _this4.logger.warn("key \"".concat(usedKey, "\" for languages \"").concat(codes.join(', '), "\" won't get resolved as namespace \"").concat(usedNS, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
          }
          codes.forEach(function (code) {
            if (_this4.isValidLookup(found)) return;
            usedLng = code;
            var finalKeys = [key];
            if (_this4.i18nFormat && _this4.i18nFormat.addLookupKeys) {
              _this4.i18nFormat.addLookupKeys(finalKeys, key, code, ns, options);
            } else {
              var pluralSuffix;
              if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count, options);
              var zeroSuffix = "".concat(_this4.options.pluralSeparator, "zero");
              if (needsPluralHandling) {
                finalKeys.push(key + pluralSuffix);
                if (needsZeroSuffixLookup) {
                  finalKeys.push(key + zeroSuffix);
                }
              }
              if (needsContextHandling) {
                var contextKey = "".concat(key).concat(_this4.options.contextSeparator).concat(options.context);
                finalKeys.push(contextKey);
                if (needsPluralHandling) {
                  finalKeys.push(contextKey + pluralSuffix);
                  if (needsZeroSuffixLookup) {
                    finalKeys.push(contextKey + zeroSuffix);
                  }
                }
              }
            }
            var possibleKey;
            while (possibleKey = finalKeys.pop()) {
              if (!_this4.isValidLookup(found)) {
                exactUsedKey = possibleKey;
                found = _this4.getResource(code, ns, possibleKey, options);
              }
            }
          });
        });
      });
      return {
        res: found,
        usedKey: usedKey,
        exactUsedKey: exactUsedKey,
        usedLng: usedLng,
        usedNS: usedNS
      };
    }
  }, {
    key: "isValidLookup",
    value: function isValidLookup(res) {
      return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
    }
  }, {
    key: "getResource",
    value: function getResource(code, ns, key) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      if (this.i18nFormat && this.i18nFormat.getResource) return this.i18nFormat.getResource(code, ns, key, options);
      return this.resourceStore.getResource(code, ns, key, options);
    }
  }], [{
    key: "hasDefaultValue",
    value: function hasDefaultValue(options) {
      var prefix = 'defaultValue';
      for (var option in options) {
        if (Object.prototype.hasOwnProperty.call(options, option) && prefix === option.substring(0, prefix.length) && undefined !== options[option]) {
          return true;
        }
      }
      return false;
    }
  }]);
  return Translator;
}(EventEmitter);

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var LanguageUtil = function () {
  function LanguageUtil(options) {
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, LanguageUtil);
    this.options = options;
    this.supportedLngs = this.options.supportedLngs || false;
    this.logger = baseLogger.create('languageUtils');
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(LanguageUtil, [{
    key: "getScriptPartFromCode",
    value: function getScriptPartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return null;
      var p = code.split('-');
      if (p.length === 2) return null;
      p.pop();
      if (p[p.length - 1].toLowerCase() === 'x') return null;
      return this.formatLanguageCode(p.join('-'));
    }
  }, {
    key: "getLanguagePartFromCode",
    value: function getLanguagePartFromCode(code) {
      if (!code || code.indexOf('-') < 0) return code;
      var p = code.split('-');
      return this.formatLanguageCode(p[0]);
    }
  }, {
    key: "formatLanguageCode",
    value: function formatLanguageCode(code) {
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
        var p = code.split('-');
        if (this.options.lowerCaseLng) {
          p = p.map(function (part) {
            return part.toLowerCase();
          });
        } else if (p.length === 2) {
          p[0] = p[0].toLowerCase();
          p[1] = p[1].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        } else if (p.length === 3) {
          p[0] = p[0].toLowerCase();
          if (p[1].length === 2) p[1] = p[1].toUpperCase();
          if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();
          if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
          if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
        }
        return p.join('-');
      }
      return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
    }
  }, {
    key: "isSupportedCode",
    value: function isSupportedCode(code) {
      if (this.options.load === 'languageOnly' || this.options.nonExplicitSupportedLngs) {
        code = this.getLanguagePartFromCode(code);
      }
      return !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(code) > -1;
    }
  }, {
    key: "getBestMatchFromCodes",
    value: function getBestMatchFromCodes(codes) {
      var _this = this;
      if (!codes) return null;
      var found;
      codes.forEach(function (code) {
        if (found) return;
        var cleanedLng = _this.formatLanguageCode(code);
        if (!_this.options.supportedLngs || _this.isSupportedCode(cleanedLng)) found = cleanedLng;
      });
      if (!found && this.options.supportedLngs) {
        codes.forEach(function (code) {
          if (found) return;
          var lngOnly = _this.getLanguagePartFromCode(code);
          if (_this.isSupportedCode(lngOnly)) return found = lngOnly;
          found = _this.options.supportedLngs.find(function (supportedLng) {
            if (supportedLng === lngOnly) return supportedLng;
            if (supportedLng.indexOf('-') < 0 && lngOnly.indexOf('-') < 0) return;
            if (supportedLng.indexOf(lngOnly) === 0) return supportedLng;
          });
        });
      }
      if (!found) found = this.getFallbackCodes(this.options.fallbackLng)[0];
      return found;
    }
  }, {
    key: "getFallbackCodes",
    value: function getFallbackCodes(fallbacks, code) {
      if (!fallbacks) return [];
      if (typeof fallbacks === 'function') fallbacks = fallbacks(code);
      if (typeof fallbacks === 'string') fallbacks = [fallbacks];
      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;
      if (!code) return fallbacks["default"] || [];
      var found = fallbacks[code];
      if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
      if (!found) found = fallbacks[this.formatLanguageCode(code)];
      if (!found) found = fallbacks[this.getLanguagePartFromCode(code)];
      if (!found) found = fallbacks["default"];
      return found || [];
    }
  }, {
    key: "toResolveHierarchy",
    value: function toResolveHierarchy(code, fallbackCode) {
      var _this2 = this;
      var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
      var codes = [];
      var addCode = function addCode(c) {
        if (!c) return;
        if (_this2.isSupportedCode(c)) {
          codes.push(c);
        } else {
          _this2.logger.warn("rejecting language code not found in supportedLngs: ".concat(c));
        }
      };
      if (typeof code === 'string' && code.indexOf('-') > -1) {
        if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
        if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
        if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
      } else if (typeof code === 'string') {
        addCode(this.formatLanguageCode(code));
      }
      fallbackCodes.forEach(function (fc) {
        if (codes.indexOf(fc) < 0) addCode(_this2.formatLanguageCode(fc));
      });
      return codes;
    }
  }]);
  return LanguageUtil;
}();

var sets = [{
  lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'tl', 'ti', 'tr', 'uz', 'wa'],
  nr: [1, 2],
  fc: 1
}, {
  lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'hi', 'hu', 'hy', 'ia', 'it', 'kk', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'],
  nr: [1, 2],
  fc: 2
}, {
  lngs: ['ay', 'bo', 'cgg', 'fa', 'ht', 'id', 'ja', 'jbo', 'ka', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'],
  nr: [1],
  fc: 3
}, {
  lngs: ['be', 'bs', 'cnr', 'dz', 'hr', 'ru', 'sr', 'uk'],
  nr: [1, 2, 5],
  fc: 4
}, {
  lngs: ['ar'],
  nr: [0, 1, 2, 3, 11, 100],
  fc: 5
}, {
  lngs: ['cs', 'sk'],
  nr: [1, 2, 5],
  fc: 6
}, {
  lngs: ['csb', 'pl'],
  nr: [1, 2, 5],
  fc: 7
}, {
  lngs: ['cy'],
  nr: [1, 2, 3, 8],
  fc: 8
}, {
  lngs: ['fr'],
  nr: [1, 2],
  fc: 9
}, {
  lngs: ['ga'],
  nr: [1, 2, 3, 7, 11],
  fc: 10
}, {
  lngs: ['gd'],
  nr: [1, 2, 3, 20],
  fc: 11
}, {
  lngs: ['is'],
  nr: [1, 2],
  fc: 12
}, {
  lngs: ['jv'],
  nr: [0, 1],
  fc: 13
}, {
  lngs: ['kw'],
  nr: [1, 2, 3, 4],
  fc: 14
}, {
  lngs: ['lt'],
  nr: [1, 2, 10],
  fc: 15
}, {
  lngs: ['lv'],
  nr: [1, 2, 0],
  fc: 16
}, {
  lngs: ['mk'],
  nr: [1, 2],
  fc: 17
}, {
  lngs: ['mnk'],
  nr: [0, 1, 2],
  fc: 18
}, {
  lngs: ['mt'],
  nr: [1, 2, 11, 20],
  fc: 19
}, {
  lngs: ['or'],
  nr: [2, 1],
  fc: 2
}, {
  lngs: ['ro'],
  nr: [1, 2, 20],
  fc: 20
}, {
  lngs: ['sl'],
  nr: [5, 1, 2, 3],
  fc: 21
}, {
  lngs: ['he', 'iw'],
  nr: [1, 2, 20, 21],
  fc: 22
}];
var _rulesPluralsTypes = {
  1: function _(n) {
    return Number(n > 1);
  },
  2: function _(n) {
    return Number(n != 1);
  },
  3: function _(n) {
    return 0;
  },
  4: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  5: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
  },
  6: function _(n) {
    return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
  },
  7: function _(n) {
    return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  8: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
  },
  9: function _(n) {
    return Number(n >= 2);
  },
  10: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
  },
  11: function _(n) {
    return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
  },
  12: function _(n) {
    return Number(n % 10 != 1 || n % 100 == 11);
  },
  13: function _(n) {
    return Number(n !== 0);
  },
  14: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
  },
  15: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
  },
  16: function _(n) {
    return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
  },
  17: function _(n) {
    return Number(n == 1 || n % 10 == 1 && n % 100 != 11 ? 0 : 1);
  },
  18: function _(n) {
    return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
  },
  19: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
  },
  20: function _(n) {
    return Number(n == 1 ? 0 : n == 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
  },
  21: function _(n) {
    return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
  },
  22: function _(n) {
    return Number(n == 1 ? 0 : n == 2 ? 1 : (n < 0 || n > 10) && n % 10 == 0 ? 2 : 3);
  }
};
var deprecatedJsonVersions = ['v1', 'v2', 'v3'];
var suffixesOrder = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
};
function createRules() {
  var rules = {};
  sets.forEach(function (set) {
    set.lngs.forEach(function (l) {
      rules[l] = {
        numbers: set.nr,
        plurals: _rulesPluralsTypes[set.fc]
      };
    });
  });
  return rules;
}
var PluralResolver = function () {
  function PluralResolver(languageUtils) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, PluralResolver);
    this.languageUtils = languageUtils;
    this.options = options;
    this.logger = baseLogger.create('pluralResolver');
    if ((!this.options.compatibilityJSON || this.options.compatibilityJSON === 'v4') && (typeof Intl === 'undefined' || !Intl.PluralRules)) {
      this.options.compatibilityJSON = 'v3';
      this.logger.error('Your environment seems not to be Intl API compatible, use an Intl.PluralRules polyfill. Will fallback to the compatibilityJSON v3 format handling.');
    }
    this.rules = createRules();
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(PluralResolver, [{
    key: "addRule",
    value: function addRule(lng, obj) {
      this.rules[lng] = obj;
    }
  }, {
    key: "getRule",
    value: function getRule(code) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (this.shouldUseIntlApi()) {
        try {
          return new Intl.PluralRules(code, {
            type: options.ordinal ? 'ordinal' : 'cardinal'
          });
        } catch (_unused) {
          return;
        }
      }
      return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
    }
  }, {
    key: "needsPlural",
    value: function needsPlural(code) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var rule = this.getRule(code, options);
      if (this.shouldUseIntlApi()) {
        return rule && rule.resolvedOptions().pluralCategories.length > 1;
      }
      return rule && rule.numbers.length > 1;
    }
  }, {
    key: "getPluralFormsOfKey",
    value: function getPluralFormsOfKey(code, key) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return this.getSuffixes(code, options).map(function (suffix) {
        return "".concat(key).concat(suffix);
      });
    }
  }, {
    key: "getSuffixes",
    value: function getSuffixes(code) {
      var _this = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var rule = this.getRule(code, options);
      if (!rule) {
        return [];
      }
      if (this.shouldUseIntlApi()) {
        return rule.resolvedOptions().pluralCategories.sort(function (pluralCategory1, pluralCategory2) {
          return suffixesOrder[pluralCategory1] - suffixesOrder[pluralCategory2];
        }).map(function (pluralCategory) {
          return "".concat(_this.options.prepend).concat(pluralCategory);
        });
      }
      return rule.numbers.map(function (number) {
        return _this.getSuffix(code, number, options);
      });
    }
  }, {
    key: "getSuffix",
    value: function getSuffix(code, count) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var rule = this.getRule(code, options);
      if (rule) {
        if (this.shouldUseIntlApi()) {
          return "".concat(this.options.prepend).concat(rule.select(count));
        }
        return this.getSuffixRetroCompatible(rule, count);
      }
      this.logger.warn("no plural rule found for: ".concat(code));
      return '';
    }
  }, {
    key: "getSuffixRetroCompatible",
    value: function getSuffixRetroCompatible(rule, count) {
      var _this2 = this;
      var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
      var suffix = rule.numbers[idx];
      if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
        if (suffix === 2) {
          suffix = 'plural';
        } else if (suffix === 1) {
          suffix = '';
        }
      }
      var returnSuffix = function returnSuffix() {
        return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
      };
      if (this.options.compatibilityJSON === 'v1') {
        if (suffix === 1) return '';
        if (typeof suffix === 'number') return "_plural_".concat(suffix.toString());
        return returnSuffix();
      } else if (this.options.compatibilityJSON === 'v2') {
        return returnSuffix();
      } else if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
        return returnSuffix();
      }
      return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
    }
  }, {
    key: "shouldUseIntlApi",
    value: function shouldUseIntlApi() {
      return !deprecatedJsonVersions.includes(this.options.compatibilityJSON);
    }
  }]);
  return PluralResolver;
}();

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function deepFindWithDefaults(data, defaultData, key) {
  var keySeparator = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';
  var ignoreJSONStructure = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var path = getPathWithDefaults(data, defaultData, key);
  if (!path && ignoreJSONStructure && typeof key === 'string') {
    path = deepFind(data, key, keySeparator);
    if (path === undefined) path = deepFind(defaultData, key, keySeparator);
  }
  return path;
}
var Interpolator = function () {
  function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Interpolator);
    this.logger = baseLogger.create('interpolator');
    this.options = options;
    this.format = options.interpolation && options.interpolation.format || function (value) {
      return value;
    };
    this.init(options);
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Interpolator, [{
    key: "init",
    value: function init() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (!options.interpolation) options.interpolation = {
        escapeValue: true
      };
      var iOpts = options.interpolation;
      this.escape = iOpts.escape !== undefined ? iOpts.escape : escape;
      this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
      this.useRawValueToEscape = iOpts.useRawValueToEscape !== undefined ? iOpts.useRawValueToEscape : false;
      this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
      this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
      this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
      this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';
      this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
      this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');
      this.nestingOptionsSeparator = iOpts.nestingOptionsSeparator ? iOpts.nestingOptionsSeparator : iOpts.nestingOptionsSeparator || ',';
      this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;
      this.alwaysFormat = iOpts.alwaysFormat !== undefined ? iOpts.alwaysFormat : false;
      this.resetRegExp();
    }
  }, {
    key: "reset",
    value: function reset() {
      if (this.options) this.init(this.options);
    }
  }, {
    key: "resetRegExp",
    value: function resetRegExp() {
      var regexpStr = "".concat(this.prefix, "(.+?)").concat(this.suffix);
      this.regexp = new RegExp(regexpStr, 'g');
      var regexpUnescapeStr = "".concat(this.prefix).concat(this.unescapePrefix, "(.+?)").concat(this.unescapeSuffix).concat(this.suffix);
      this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');
      var nestingRegexpStr = "".concat(this.nestingPrefix, "(.+?)").concat(this.nestingSuffix);
      this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
    }
  }, {
    key: "interpolate",
    value: function interpolate(str, data, lng, options) {
      var _this = this;
      var match;
      var value;
      var replaces;
      var defaultData = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {};
      function regexSafe(val) {
        return val.replace(/\$/g, '$$$$');
      }
      var handleFormat = function handleFormat(key) {
        if (key.indexOf(_this.formatSeparator) < 0) {
          var path = deepFindWithDefaults(data, defaultData, key, _this.options.keySeparator, _this.options.ignoreJSONStructure);
          return _this.alwaysFormat ? _this.format(path, undefined, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
            interpolationkey: key
          })) : path;
        }
        var p = key.split(_this.formatSeparator);
        var k = p.shift().trim();
        var f = p.join(_this.formatSeparator).trim();
        return _this.format(deepFindWithDefaults(data, defaultData, k, _this.options.keySeparator, _this.options.ignoreJSONStructure), f, lng, _objectSpread$3(_objectSpread$3(_objectSpread$3({}, options), data), {}, {
          interpolationkey: k
        }));
      };
      this.resetRegExp();
      var missingInterpolationHandler = options && options.missingInterpolationHandler || this.options.missingInterpolationHandler;
      var skipOnVariables = options && options.interpolation && options.interpolation.skipOnVariables !== undefined ? options.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
      var todos = [{
        regex: this.regexpUnescape,
        safeValue: function safeValue(val) {
          return regexSafe(val);
        }
      }, {
        regex: this.regexp,
        safeValue: function safeValue(val) {
          return _this.escapeValue ? regexSafe(_this.escape(val)) : regexSafe(val);
        }
      }];
      todos.forEach(function (todo) {
        replaces = 0;
        while (match = todo.regex.exec(str)) {
          var matchedVar = match[1].trim();
          value = handleFormat(matchedVar);
          if (value === undefined) {
            if (typeof missingInterpolationHandler === 'function') {
              var temp = missingInterpolationHandler(str, match, options);
              value = typeof temp === 'string' ? temp : '';
            } else if (options && Object.prototype.hasOwnProperty.call(options, matchedVar)) {
              value = '';
            } else if (skipOnVariables) {
              value = match[0];
              continue;
            } else {
              _this.logger.warn("missed to pass in variable ".concat(matchedVar, " for interpolating ").concat(str));
              value = '';
            }
          } else if (typeof value !== 'string' && !_this.useRawValueToEscape) {
            value = makeString(value);
          }
          var safeValue = todo.safeValue(value);
          str = str.replace(match[0], safeValue);
          if (skipOnVariables) {
            todo.regex.lastIndex += value.length;
            todo.regex.lastIndex -= match[0].length;
          } else {
            todo.regex.lastIndex = 0;
          }
          replaces++;
          if (replaces >= _this.maxReplaces) {
            break;
          }
        }
      });
      return str;
    }
  }, {
    key: "nest",
    value: function nest(str, fc) {
      var _this2 = this;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var match;
      var value;
      var clonedOptions;
      function handleHasOptions(key, inheritedOptions) {
        var sep = this.nestingOptionsSeparator;
        if (key.indexOf(sep) < 0) return key;
        var c = key.split(new RegExp("".concat(sep, "[ ]*{")));
        var optionsString = "{".concat(c[1]);
        key = c[0];
        optionsString = this.interpolate(optionsString, clonedOptions);
        var matchedSingleQuotes = optionsString.match(/'/g);
        var matchedDoubleQuotes = optionsString.match(/"/g);
        if (matchedSingleQuotes && matchedSingleQuotes.length % 2 === 0 && !matchedDoubleQuotes || matchedDoubleQuotes.length % 2 !== 0) {
          optionsString = optionsString.replace(/'/g, '"');
        }
        try {
          clonedOptions = JSON.parse(optionsString);
          if (inheritedOptions) clonedOptions = _objectSpread$3(_objectSpread$3({}, inheritedOptions), clonedOptions);
        } catch (e) {
          this.logger.warn("failed parsing options string in nesting for key ".concat(key), e);
          return "".concat(key).concat(sep).concat(optionsString);
        }
        delete clonedOptions.defaultValue;
        return key;
      }
      while (match = this.nestingRegexp.exec(str)) {
        var formatters = [];
        clonedOptions = _objectSpread$3({}, options);
        clonedOptions = clonedOptions.replace && typeof clonedOptions.replace !== 'string' ? clonedOptions.replace : clonedOptions;
        clonedOptions.applyPostProcessor = false;
        delete clonedOptions.defaultValue;
        var doReduce = false;
        if (match[0].indexOf(this.formatSeparator) !== -1 && !/{.*}/.test(match[1])) {
          var r = match[1].split(this.formatSeparator).map(function (elem) {
            return elem.trim();
          });
          match[1] = r.shift();
          formatters = r;
          doReduce = true;
        }
        value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);
        if (value && match[0] === str && typeof value !== 'string') return value;
        if (typeof value !== 'string') value = makeString(value);
        if (!value) {
          this.logger.warn("missed to resolve ".concat(match[1], " for nesting ").concat(str));
          value = '';
        }
        if (doReduce) {
          value = formatters.reduce(function (v, f) {
            return _this2.format(v, f, options.lng, _objectSpread$3(_objectSpread$3({}, options), {}, {
              interpolationkey: match[1].trim()
            }));
          }, value.trim());
        }
        str = str.replace(match[0], value);
        this.regexp.lastIndex = 0;
      }
      return str;
    }
  }]);
  return Interpolator;
}();

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function parseFormatStr(formatStr) {
  var formatName = formatStr.toLowerCase().trim();
  var formatOptions = {};
  if (formatStr.indexOf('(') > -1) {
    var p = formatStr.split('(');
    formatName = p[0].toLowerCase().trim();
    var optStr = p[1].substring(0, p[1].length - 1);
    if (formatName === 'currency' && optStr.indexOf(':') < 0) {
      if (!formatOptions.currency) formatOptions.currency = optStr.trim();
    } else if (formatName === 'relativetime' && optStr.indexOf(':') < 0) {
      if (!formatOptions.range) formatOptions.range = optStr.trim();
    } else {
      var opts = optStr.split(';');
      opts.forEach(function (opt) {
        if (!opt) return;
        var _opt$split = opt.split(':'),
          _opt$split2 = (0,_babel_runtime_helpers_esm_toArray__WEBPACK_IMPORTED_MODULE_8__["default"])(_opt$split),
          key = _opt$split2[0],
          rest = _opt$split2.slice(1);
        var val = rest.join(':').trim().replace(/^'+|'+$/g, '');
        if (!formatOptions[key.trim()]) formatOptions[key.trim()] = val;
        if (val === 'false') formatOptions[key.trim()] = false;
        if (val === 'true') formatOptions[key.trim()] = true;
        if (!isNaN(val)) formatOptions[key.trim()] = parseInt(val, 10);
      });
    }
  }
  return {
    formatName: formatName,
    formatOptions: formatOptions
  };
}
function createCachedFormatter(fn) {
  var cache = {};
  return function invokeFormatter(val, lng, options) {
    var key = lng + JSON.stringify(options);
    var formatter = cache[key];
    if (!formatter) {
      formatter = fn(lng, options);
      cache[key] = formatter;
    }
    return formatter(val);
  };
}
var Formatter = function () {
  function Formatter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Formatter);
    this.logger = baseLogger.create('formatter');
    this.options = options;
    this.formats = {
      number: createCachedFormatter(function (lng, opt) {
        var formatter = new Intl.NumberFormat(lng, _objectSpread$2({}, opt));
        return function (val) {
          return formatter.format(val);
        };
      }),
      currency: createCachedFormatter(function (lng, opt) {
        var formatter = new Intl.NumberFormat(lng, _objectSpread$2(_objectSpread$2({}, opt), {}, {
          style: 'currency'
        }));
        return function (val) {
          return formatter.format(val);
        };
      }),
      datetime: createCachedFormatter(function (lng, opt) {
        var formatter = new Intl.DateTimeFormat(lng, _objectSpread$2({}, opt));
        return function (val) {
          return formatter.format(val);
        };
      }),
      relativetime: createCachedFormatter(function (lng, opt) {
        var formatter = new Intl.RelativeTimeFormat(lng, _objectSpread$2({}, opt));
        return function (val) {
          return formatter.format(val, opt.range || 'day');
        };
      }),
      list: createCachedFormatter(function (lng, opt) {
        var formatter = new Intl.ListFormat(lng, _objectSpread$2({}, opt));
        return function (val) {
          return formatter.format(val);
        };
      })
    };
    this.init(options);
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Formatter, [{
    key: "init",
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        interpolation: {}
      };
      var iOpts = options.interpolation;
      this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';
    }
  }, {
    key: "add",
    value: function add(name, fc) {
      this.formats[name.toLowerCase().trim()] = fc;
    }
  }, {
    key: "addCached",
    value: function addCached(name, fc) {
      this.formats[name.toLowerCase().trim()] = createCachedFormatter(fc);
    }
  }, {
    key: "format",
    value: function format(value, _format, lng) {
      var _this = this;
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var formats = _format.split(this.formatSeparator);
      var result = formats.reduce(function (mem, f) {
        var _parseFormatStr = parseFormatStr(f),
          formatName = _parseFormatStr.formatName,
          formatOptions = _parseFormatStr.formatOptions;
        if (_this.formats[formatName]) {
          var formatted = mem;
          try {
            var valOptions = options && options.formatParams && options.formatParams[options.interpolationkey] || {};
            var l = valOptions.locale || valOptions.lng || options.locale || options.lng || lng;
            formatted = _this.formats[formatName](mem, l, _objectSpread$2(_objectSpread$2(_objectSpread$2({}, formatOptions), options), valOptions));
          } catch (error) {
            _this.logger.warn(error);
          }
          return formatted;
        } else {
          _this.logger.warn("there was no format function for ".concat(formatName));
        }
        return mem;
      }, value);
      return result;
    }
  }]);
  return Formatter;
}();

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function removePending(q, name) {
  if (q.pending[name] !== undefined) {
    delete q.pending[name];
    q.pendingCount--;
  }
}
var Connector = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(Connector, _EventEmitter);
  var _super = _createSuper$1(Connector);
  function Connector(backend, store, services) {
    var _this;
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, Connector);
    _this = _super.call(this);
    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }
    _this.backend = backend;
    _this.store = store;
    _this.services = services;
    _this.languageUtils = services.languageUtils;
    _this.options = options;
    _this.logger = baseLogger.create('backendConnector');
    _this.waitingReads = [];
    _this.maxParallelReads = options.maxParallelReads || 10;
    _this.readingCalls = 0;
    _this.maxRetries = options.maxRetries >= 0 ? options.maxRetries : 5;
    _this.retryTimeout = options.retryTimeout >= 1 ? options.retryTimeout : 350;
    _this.state = {};
    _this.queue = [];
    if (_this.backend && _this.backend.init) {
      _this.backend.init(services, options.backend, options);
    }
    return _this;
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(Connector, [{
    key: "queueLoad",
    value: function queueLoad(languages, namespaces, options, callback) {
      var _this2 = this;
      var toLoad = {};
      var pending = {};
      var toLoadLanguages = {};
      var toLoadNamespaces = {};
      languages.forEach(function (lng) {
        var hasAllNamespaces = true;
        namespaces.forEach(function (ns) {
          var name = "".concat(lng, "|").concat(ns);
          if (!options.reload && _this2.store.hasResourceBundle(lng, ns)) {
            _this2.state[name] = 2;
          } else if (_this2.state[name] < 0) ; else if (_this2.state[name] === 1) {
            if (pending[name] === undefined) pending[name] = true;
          } else {
            _this2.state[name] = 1;
            hasAllNamespaces = false;
            if (pending[name] === undefined) pending[name] = true;
            if (toLoad[name] === undefined) toLoad[name] = true;
            if (toLoadNamespaces[ns] === undefined) toLoadNamespaces[ns] = true;
          }
        });
        if (!hasAllNamespaces) toLoadLanguages[lng] = true;
      });
      if (Object.keys(toLoad).length || Object.keys(pending).length) {
        this.queue.push({
          pending: pending,
          pendingCount: Object.keys(pending).length,
          loaded: {},
          errors: [],
          callback: callback
        });
      }
      return {
        toLoad: Object.keys(toLoad),
        pending: Object.keys(pending),
        toLoadLanguages: Object.keys(toLoadLanguages),
        toLoadNamespaces: Object.keys(toLoadNamespaces)
      };
    }
  }, {
    key: "loaded",
    value: function loaded(name, err, data) {
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      if (err) this.emit('failedLoading', lng, ns, err);
      if (data) {
        this.store.addResourceBundle(lng, ns, data);
      }
      this.state[name] = err ? -1 : 2;
      var loaded = {};
      this.queue.forEach(function (q) {
        pushPath(q.loaded, [lng], ns);
        removePending(q, name);
        if (err) q.errors.push(err);
        if (q.pendingCount === 0 && !q.done) {
          Object.keys(q.loaded).forEach(function (l) {
            if (!loaded[l]) loaded[l] = {};
            var loadedKeys = q.loaded[l];
            if (loadedKeys.length) {
              loadedKeys.forEach(function (n) {
                if (loaded[l][n] === undefined) loaded[l][n] = true;
              });
            }
          });
          q.done = true;
          if (q.errors.length) {
            q.callback(q.errors);
          } else {
            q.callback();
          }
        }
      });
      this.emit('loaded', loaded);
      this.queue = this.queue.filter(function (q) {
        return !q.done;
      });
    }
  }, {
    key: "read",
    value: function read(lng, ns, fcName) {
      var _this3 = this;
      var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : this.retryTimeout;
      var callback = arguments.length > 5 ? arguments[5] : undefined;
      if (!lng.length) return callback(null, {});
      if (this.readingCalls >= this.maxParallelReads) {
        this.waitingReads.push({
          lng: lng,
          ns: ns,
          fcName: fcName,
          tried: tried,
          wait: wait,
          callback: callback
        });
        return;
      }
      this.readingCalls++;
      var resolver = function resolver(err, data) {
        _this3.readingCalls--;
        if (_this3.waitingReads.length > 0) {
          var next = _this3.waitingReads.shift();
          _this3.read(next.lng, next.ns, next.fcName, next.tried, next.wait, next.callback);
        }
        if (err && data && tried < _this3.maxRetries) {
          setTimeout(function () {
            _this3.read.call(_this3, lng, ns, fcName, tried + 1, wait * 2, callback);
          }, wait);
          return;
        }
        callback(err, data);
      };
      var fc = this.backend[fcName].bind(this.backend);
      if (fc.length === 2) {
        try {
          var r = fc(lng, ns);
          if (r && typeof r.then === 'function') {
            r.then(function (data) {
              return resolver(null, data);
            })["catch"](resolver);
          } else {
            resolver(null, r);
          }
        } catch (err) {
          resolver(err);
        }
        return;
      }
      return fc(lng, ns, resolver);
    }
  }, {
    key: "prepareLoading",
    value: function prepareLoading(languages, namespaces) {
      var _this4 = this;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;
      if (!this.backend) {
        this.logger.warn('No backend was added via i18next.use. Will not load resources.');
        return callback && callback();
      }
      if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
      if (typeof namespaces === 'string') namespaces = [namespaces];
      var toLoad = this.queueLoad(languages, namespaces, options, callback);
      if (!toLoad.toLoad.length) {
        if (!toLoad.pending.length) callback();
        return null;
      }
      toLoad.toLoad.forEach(function (name) {
        _this4.loadOne(name);
      });
    }
  }, {
    key: "load",
    value: function load(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {}, callback);
    }
  }, {
    key: "reload",
    value: function reload(languages, namespaces, callback) {
      this.prepareLoading(languages, namespaces, {
        reload: true
      }, callback);
    }
  }, {
    key: "loadOne",
    value: function loadOne(name) {
      var _this5 = this;
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var s = name.split('|');
      var lng = s[0];
      var ns = s[1];
      this.read(lng, ns, 'read', undefined, undefined, function (err, data) {
        if (err) _this5.logger.warn("".concat(prefix, "loading namespace ").concat(ns, " for language ").concat(lng, " failed"), err);
        if (!err && data) _this5.logger.log("".concat(prefix, "loaded namespace ").concat(ns, " for language ").concat(lng), data);
        _this5.loaded(name, err, data);
      });
    }
  }, {
    key: "saveMissing",
    value: function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
      var options = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      var clb = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : function () {};
      if (this.services.utils && this.services.utils.hasLoadedNamespace && !this.services.utils.hasLoadedNamespace(namespace)) {
        this.logger.warn("did not save key \"".concat(key, "\" as the namespace \"").concat(namespace, "\" was not yet loaded"), 'This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!');
        return;
      }
      if (key === undefined || key === null || key === '') return;
      if (this.backend && this.backend.create) {
        var opts = _objectSpread$1(_objectSpread$1({}, options), {}, {
          isUpdate: isUpdate
        });
        var fc = this.backend.create.bind(this.backend);
        if (fc.length < 6) {
          try {
            var r;
            if (fc.length === 5) {
              r = fc(languages, namespace, key, fallbackValue, opts);
            } else {
              r = fc(languages, namespace, key, fallbackValue);
            }
            if (r && typeof r.then === 'function') {
              r.then(function (data) {
                return clb(null, data);
              })["catch"](clb);
            } else {
              clb(null, r);
            }
          } catch (err) {
            clb(err);
          }
        } else {
          fc(languages, namespace, key, fallbackValue, clb, opts);
        }
      }
      if (!languages || !languages[0]) return;
      this.store.addResource(languages[0], namespace, key, fallbackValue);
    }
  }]);
  return Connector;
}(EventEmitter);

function get() {
  return {
    debug: false,
    initImmediate: true,
    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false,
    supportedLngs: false,
    nonExplicitSupportedLngs: false,
    load: 'all',
    preload: false,
    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',
    partialBundledLanguages: false,
    saveMissing: false,
    updateMissing: false,
    saveMissingTo: 'fallback',
    saveMissingPlurals: true,
    missingKeyHandler: false,
    missingInterpolationHandler: false,
    postProcess: false,
    postProcessPassResolved: false,
    returnNull: true,
    returnEmptyString: true,
    returnObjects: false,
    joinArrays: false,
    returnedObjectHandler: false,
    parseMissingKeyHandler: false,
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      var ret = {};
      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(args[1]) === 'object') ret = args[1];
      if (typeof args[1] === 'string') ret.defaultValue = args[1];
      if (typeof args[2] === 'string') ret.tDescription = args[2];
      if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(args[2]) === 'object' || (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(args[3]) === 'object') {
        var options = args[3] || args[2];
        Object.keys(options).forEach(function (key) {
          ret[key] = options[key];
        });
      }
      return ret;
    },
    interpolation: {
      escapeValue: true,
      format: function format(value, _format, lng, options) {
        return value;
      },
      prefix: '{{',
      suffix: '}}',
      formatSeparator: ',',
      unescapePrefix: '-',
      nestingPrefix: '$t(',
      nestingSuffix: ')',
      nestingOptionsSeparator: ',',
      maxReplaces: 1000,
      skipOnVariables: true
    }
  };
}
function transformOptions(options) {
  if (typeof options.ns === 'string') options.ns = [options.ns];
  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];
  if (options.supportedLngs && options.supportedLngs.indexOf('cimode') < 0) {
    options.supportedLngs = options.supportedLngs.concat(['cimode']);
  }
  return options;
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0,_babel_runtime_helpers_esm_getPrototypeOf__WEBPACK_IMPORTED_MODULE_6__["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function noop() {}
function bindMemberFunctions(inst) {
  var mems = Object.getOwnPropertyNames(Object.getPrototypeOf(inst));
  mems.forEach(function (mem) {
    if (typeof inst[mem] === 'function') {
      inst[mem] = inst[mem].bind(inst);
    }
  });
}
var I18n = function (_EventEmitter) {
  (0,_babel_runtime_helpers_esm_inherits__WEBPACK_IMPORTED_MODULE_4__["default"])(I18n, _EventEmitter);
  var _super = _createSuper(I18n);
  function I18n() {
    var _this;
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 ? arguments[1] : undefined;
    (0,_babel_runtime_helpers_esm_classCallCheck__WEBPACK_IMPORTED_MODULE_1__["default"])(this, I18n);
    _this = _super.call(this);
    if (isIE10) {
      EventEmitter.call((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    }
    _this.options = transformOptions(options);
    _this.services = {};
    _this.logger = baseLogger;
    _this.modules = {
      external: []
    };
    bindMemberFunctions((0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
    if (callback && !_this.isInitialized && !options.isClone) {
      if (!_this.options.initImmediate) {
        _this.init(options, callback);
        return (0,_babel_runtime_helpers_esm_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_5__["default"])(_this, (0,_babel_runtime_helpers_esm_assertThisInitialized__WEBPACK_IMPORTED_MODULE_3__["default"])(_this));
      }
      setTimeout(function () {
        _this.init(options, callback);
      }, 0);
    }
    return _this;
  }
  (0,_babel_runtime_helpers_esm_createClass__WEBPACK_IMPORTED_MODULE_2__["default"])(I18n, [{
    key: "init",
    value: function init() {
      var _this2 = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 ? arguments[1] : undefined;
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      if (!options.defaultNS && options.defaultNS !== false && options.ns) {
        if (typeof options.ns === 'string') {
          options.defaultNS = options.ns;
        } else if (options.ns.indexOf('translation') < 0) {
          options.defaultNS = options.ns[0];
        }
      }
      var defOpts = get();
      this.options = _objectSpread(_objectSpread(_objectSpread({}, defOpts), this.options), transformOptions(options));
      if (this.options.compatibilityAPI !== 'v1') {
        this.options.interpolation = _objectSpread(_objectSpread({}, defOpts.interpolation), this.options.interpolation);
      }
      if (options.keySeparator !== undefined) {
        this.options.userDefinedKeySeparator = options.keySeparator;
      }
      if (options.nsSeparator !== undefined) {
        this.options.userDefinedNsSeparator = options.nsSeparator;
      }
      function createClassOnDemand(ClassOrObject) {
        if (!ClassOrObject) return null;
        if (typeof ClassOrObject === 'function') return new ClassOrObject();
        return ClassOrObject;
      }
      if (!this.options.isClone) {
        if (this.modules.logger) {
          baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
        } else {
          baseLogger.init(null, this.options);
        }
        var formatter;
        if (this.modules.formatter) {
          formatter = this.modules.formatter;
        } else if (typeof Intl !== 'undefined') {
          formatter = Formatter;
        }
        var lu = new LanguageUtil(this.options);
        this.store = new ResourceStore(this.options.resources, this.options);
        var s = this.services;
        s.logger = baseLogger;
        s.resourceStore = this.store;
        s.languageUtils = lu;
        s.pluralResolver = new PluralResolver(lu, {
          prepend: this.options.pluralSeparator,
          compatibilityJSON: this.options.compatibilityJSON,
          simplifyPluralSuffix: this.options.simplifyPluralSuffix
        });
        if (formatter && (!this.options.interpolation.format || this.options.interpolation.format === defOpts.interpolation.format)) {
          s.formatter = createClassOnDemand(formatter);
          s.formatter.init(s, this.options);
          this.options.interpolation.format = s.formatter.format.bind(s.formatter);
        }
        s.interpolator = new Interpolator(this.options);
        s.utils = {
          hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
        };
        s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
        s.backendConnector.on('*', function (event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }
          _this2.emit.apply(_this2, [event].concat(args));
        });
        if (this.modules.languageDetector) {
          s.languageDetector = createClassOnDemand(this.modules.languageDetector);
          if (s.languageDetector.init) s.languageDetector.init(s, this.options.detection, this.options);
        }
        if (this.modules.i18nFormat) {
          s.i18nFormat = createClassOnDemand(this.modules.i18nFormat);
          if (s.i18nFormat.init) s.i18nFormat.init(this);
        }
        this.translator = new Translator(this.services, this.options);
        this.translator.on('*', function (event) {
          for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }
          _this2.emit.apply(_this2, [event].concat(args));
        });
        this.modules.external.forEach(function (m) {
          if (m.init) m.init(_this2);
        });
      }
      this.format = this.options.interpolation.format;
      if (!callback) callback = noop;
      if (this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
        var codes = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        if (codes.length > 0 && codes[0] !== 'dev') this.options.lng = codes[0];
      }
      if (!this.services.languageDetector && !this.options.lng) {
        this.logger.warn('init: no languageDetector is used and no lng is defined');
      }
      var storeApi = ['getResource', 'hasResourceBundle', 'getResourceBundle', 'getDataByLanguage'];
      storeApi.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store;
          return (_this2$store = _this2.store)[fcName].apply(_this2$store, arguments);
        };
      });
      var storeApiChained = ['addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle'];
      storeApiChained.forEach(function (fcName) {
        _this2[fcName] = function () {
          var _this2$store2;
          (_this2$store2 = _this2.store)[fcName].apply(_this2$store2, arguments);
          return _this2;
        };
      });
      var deferred = defer();
      var load = function load() {
        var finish = function finish(err, t) {
          if (_this2.isInitialized && !_this2.initializedStoreOnce) _this2.logger.warn('init: i18next is already initialized. You should call init just once!');
          _this2.isInitialized = true;
          if (!_this2.options.isClone) _this2.logger.log('initialized', _this2.options);
          _this2.emit('initialized', _this2.options);
          deferred.resolve(t);
          callback(err, t);
        };
        if (_this2.languages && _this2.options.compatibilityAPI !== 'v1' && !_this2.isInitialized) return finish(null, _this2.t.bind(_this2));
        _this2.changeLanguage(_this2.options.lng, finish);
      };
      if (this.options.resources || !this.options.initImmediate) {
        load();
      } else {
        setTimeout(load, 0);
      }
      return deferred;
    }
  }, {
    key: "loadResources",
    value: function loadResources(language) {
      var _this3 = this;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var usedCallback = callback;
      var usedLng = typeof language === 'string' ? language : this.language;
      if (typeof language === 'function') usedCallback = language;
      if (!this.options.resources || this.options.partialBundledLanguages) {
        if (usedLng && usedLng.toLowerCase() === 'cimode') return usedCallback();
        var toLoad = [];
        var append = function append(lng) {
          if (!lng) return;
          var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);
          lngs.forEach(function (l) {
            if (toLoad.indexOf(l) < 0) toLoad.push(l);
          });
        };
        if (!usedLng) {
          var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
          fallbacks.forEach(function (l) {
            return append(l);
          });
        } else {
          append(usedLng);
        }
        if (this.options.preload) {
          this.options.preload.forEach(function (l) {
            return append(l);
          });
        }
        this.services.backendConnector.load(toLoad, this.options.ns, function (e) {
          if (!e && !_this3.resolvedLanguage && _this3.language) _this3.setResolvedLanguage(_this3.language);
          usedCallback(e);
        });
      } else {
        usedCallback(null);
      }
    }
  }, {
    key: "reloadResources",
    value: function reloadResources(lngs, ns, callback) {
      var deferred = defer();
      if (!lngs) lngs = this.languages;
      if (!ns) ns = this.options.ns;
      if (!callback) callback = noop;
      this.services.backendConnector.reload(lngs, ns, function (err) {
        deferred.resolve();
        callback(err);
      });
      return deferred;
    }
  }, {
    key: "use",
    value: function use(module) {
      if (!module) throw new Error('You are passing an undefined module! Please check the object you are passing to i18next.use()');
      if (!module.type) throw new Error('You are passing a wrong module! Please check the object you are passing to i18next.use()');
      if (module.type === 'backend') {
        this.modules.backend = module;
      }
      if (module.type === 'logger' || module.log && module.warn && module.error) {
        this.modules.logger = module;
      }
      if (module.type === 'languageDetector') {
        this.modules.languageDetector = module;
      }
      if (module.type === 'i18nFormat') {
        this.modules.i18nFormat = module;
      }
      if (module.type === 'postProcessor') {
        postProcessor.addPostProcessor(module);
      }
      if (module.type === 'formatter') {
        this.modules.formatter = module;
      }
      if (module.type === '3rdParty') {
        this.modules.external.push(module);
      }
      return this;
    }
  }, {
    key: "setResolvedLanguage",
    value: function setResolvedLanguage(l) {
      if (!l || !this.languages) return;
      if (['cimode', 'dev'].indexOf(l) > -1) return;
      for (var li = 0; li < this.languages.length; li++) {
        var lngInLngs = this.languages[li];
        if (['cimode', 'dev'].indexOf(lngInLngs) > -1) continue;
        if (this.store.hasLanguageSomeTranslations(lngInLngs)) {
          this.resolvedLanguage = lngInLngs;
          break;
        }
      }
    }
  }, {
    key: "changeLanguage",
    value: function changeLanguage(lng, callback) {
      var _this4 = this;
      this.isLanguageChangingTo = lng;
      var deferred = defer();
      this.emit('languageChanging', lng);
      var setLngProps = function setLngProps(l) {
        _this4.language = l;
        _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);
        _this4.resolvedLanguage = undefined;
        _this4.setResolvedLanguage(l);
      };
      var done = function done(err, l) {
        if (l) {
          setLngProps(l);
          _this4.translator.changeLanguage(l);
          _this4.isLanguageChangingTo = undefined;
          _this4.emit('languageChanged', l);
          _this4.logger.log('languageChanged', l);
        } else {
          _this4.isLanguageChangingTo = undefined;
        }
        deferred.resolve(function () {
          return _this4.t.apply(_this4, arguments);
        });
        if (callback) callback(err, function () {
          return _this4.t.apply(_this4, arguments);
        });
      };
      var setLng = function setLng(lngs) {
        if (!lng && !lngs && _this4.services.languageDetector) lngs = [];
        var l = typeof lngs === 'string' ? lngs : _this4.services.languageUtils.getBestMatchFromCodes(lngs);
        if (l) {
          if (!_this4.language) {
            setLngProps(l);
          }
          if (!_this4.translator.language) _this4.translator.changeLanguage(l);
          if (_this4.services.languageDetector && _this4.services.languageDetector.cacheUserLanguage) _this4.services.languageDetector.cacheUserLanguage(l);
        }
        _this4.loadResources(l, function (err) {
          done(err, l);
        });
      };
      if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
        setLng(this.services.languageDetector.detect());
      } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
        if (this.services.languageDetector.detect.length === 0) {
          this.services.languageDetector.detect().then(setLng);
        } else {
          this.services.languageDetector.detect(setLng);
        }
      } else {
        setLng(lng);
      }
      return deferred;
    }
  }, {
    key: "getFixedT",
    value: function getFixedT(lng, ns, keyPrefix) {
      var _this5 = this;
      var fixedT = function fixedT(key, opts) {
        var options;
        if ((0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(opts) !== 'object') {
          for (var _len3 = arguments.length, rest = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
            rest[_key3 - 2] = arguments[_key3];
          }
          options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
        } else {
          options = _objectSpread({}, opts);
        }
        options.lng = options.lng || fixedT.lng;
        options.lngs = options.lngs || fixedT.lngs;
        options.ns = options.ns || fixedT.ns;
        options.keyPrefix = options.keyPrefix || keyPrefix || fixedT.keyPrefix;
        var keySeparator = _this5.options.keySeparator || '.';
        var resultKey;
        if (options.keyPrefix && Array.isArray(key)) {
          resultKey = key.map(function (k) {
            return "".concat(options.keyPrefix).concat(keySeparator).concat(k);
          });
        } else {
          resultKey = options.keyPrefix ? "".concat(options.keyPrefix).concat(keySeparator).concat(key) : key;
        }
        return _this5.t(resultKey, options);
      };
      if (typeof lng === 'string') {
        fixedT.lng = lng;
      } else {
        fixedT.lngs = lng;
      }
      fixedT.ns = ns;
      fixedT.keyPrefix = keyPrefix;
      return fixedT;
    }
  }, {
    key: "t",
    value: function t() {
      var _this$translator;
      return this.translator && (_this$translator = this.translator).translate.apply(_this$translator, arguments);
    }
  }, {
    key: "exists",
    value: function exists() {
      var _this$translator2;
      return this.translator && (_this$translator2 = this.translator).exists.apply(_this$translator2, arguments);
    }
  }, {
    key: "setDefaultNamespace",
    value: function setDefaultNamespace(ns) {
      this.options.defaultNS = ns;
    }
  }, {
    key: "hasLoadedNamespace",
    value: function hasLoadedNamespace(ns) {
      var _this6 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!this.isInitialized) {
        this.logger.warn('hasLoadedNamespace: i18next was not initialized', this.languages);
        return false;
      }
      if (!this.languages || !this.languages.length) {
        this.logger.warn('hasLoadedNamespace: i18n.languages were undefined or empty', this.languages);
        return false;
      }
      var lng = options.lng || this.resolvedLanguage || this.languages[0];
      var fallbackLng = this.options ? this.options.fallbackLng : false;
      var lastLng = this.languages[this.languages.length - 1];
      if (lng.toLowerCase() === 'cimode') return true;
      var loadNotPending = function loadNotPending(l, n) {
        var loadState = _this6.services.backendConnector.state["".concat(l, "|").concat(n)];
        return loadState === -1 || loadState === 2;
      };
      if (options.precheck) {
        var preResult = options.precheck(this, loadNotPending);
        if (preResult !== undefined) return preResult;
      }
      if (this.hasResourceBundle(lng, ns)) return true;
      if (!this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages) return true;
      if (loadNotPending(lng, ns) && (!fallbackLng || loadNotPending(lastLng, ns))) return true;
      return false;
    }
  }, {
    key: "loadNamespaces",
    value: function loadNamespaces(ns, callback) {
      var _this7 = this;
      var deferred = defer();
      if (!this.options.ns) {
        if (callback) callback();
        return Promise.resolve();
      }
      if (typeof ns === 'string') ns = [ns];
      ns.forEach(function (n) {
        if (_this7.options.ns.indexOf(n) < 0) _this7.options.ns.push(n);
      });
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "loadLanguages",
    value: function loadLanguages(lngs, callback) {
      var deferred = defer();
      if (typeof lngs === 'string') lngs = [lngs];
      var preloaded = this.options.preload || [];
      var newLngs = lngs.filter(function (lng) {
        return preloaded.indexOf(lng) < 0;
      });
      if (!newLngs.length) {
        if (callback) callback();
        return Promise.resolve();
      }
      this.options.preload = preloaded.concat(newLngs);
      this.loadResources(function (err) {
        deferred.resolve();
        if (callback) callback(err);
      });
      return deferred;
    }
  }, {
    key: "dir",
    value: function dir(lng) {
      if (!lng) lng = this.resolvedLanguage || (this.languages && this.languages.length > 0 ? this.languages[0] : this.language);
      if (!lng) return 'rtl';
      var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ug', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam', 'ckb'];
      var languageUtils = this.services && this.services.languageUtils || new LanguageUtil(get());
      return rtlLngs.indexOf(languageUtils.getLanguagePartFromCode(lng)) > -1 || lng.toLowerCase().indexOf('-arab') > 1 ? 'rtl' : 'ltr';
    }
  }, {
    key: "cloneInstance",
    value: function cloneInstance() {
      var _this8 = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;
      var mergedOptions = _objectSpread(_objectSpread(_objectSpread({}, this.options), options), {
        isClone: true
      });
      var clone = new I18n(mergedOptions);
      if (options.debug !== undefined || options.prefix !== undefined) {
        clone.logger = clone.logger.clone(options);
      }
      var membersToCopy = ['store', 'services', 'language'];
      membersToCopy.forEach(function (m) {
        clone[m] = _this8[m];
      });
      clone.services = _objectSpread({}, this.services);
      clone.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      clone.translator = new Translator(clone.services, clone.options);
      clone.translator.on('*', function (event) {
        for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }
        clone.emit.apply(clone, [event].concat(args));
      });
      clone.init(mergedOptions, callback);
      clone.translator.options = clone.options;
      clone.translator.backendConnector.services.utils = {
        hasLoadedNamespace: clone.hasLoadedNamespace.bind(clone)
      };
      return clone;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        options: this.options,
        store: this.store,
        language: this.language,
        languages: this.languages,
        resolvedLanguage: this.resolvedLanguage
      };
    }
  }]);
  return I18n;
}(EventEmitter);
(0,_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_7__["default"])(I18n, "createInstance", function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var callback = arguments.length > 1 ? arguments[1] : undefined;
  return new I18n(options, callback);
});
var instance = I18n.createInstance();
instance.createInstance = I18n.createInstance;

var createInstance = instance.createInstance;
var dir = instance.dir;
var init = instance.init;
var loadResources = instance.loadResources;
var reloadResources = instance.reloadResources;
var use = instance.use;
var changeLanguage = instance.changeLanguage;
var getFixedT = instance.getFixedT;
var t = instance.t;
var exists = instance.exists;
var setDefaultNamespace = instance.setDefaultNamespace;
var hasLoadedNamespace = instance.hasLoadedNamespace;
var loadNamespaces = instance.loadNamespaces;
var loadLanguages = instance.loadLanguages;




/***/ }),

/***/ "./src/infra/timezone.json":
/*!*********************************!*\
  !*** ./src/infra/timezone.json ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"timezoneList":[{"ID":"Africa000","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzAbidjan"},{"ID":"Africa001","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzAccra"},{"ID":"Africa002","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzBamako"},{"ID":"Africa003","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzBanjul"},{"ID":"Africa004","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzBissau"},{"ID":"Africa005","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzConakry"},{"ID":"Africa006","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzDakar"},{"ID":"Africa007","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzFreetown"},{"ID":"Africa008","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzLome"},{"ID":"Africa009","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzMonrovia"},{"ID":"Africa010","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzNouakchott"},{"ID":"Africa011","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzOuagadougou"},{"ID":"Africa012","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzSao_Tome"},{"ID":"Africa013","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzCasablanca"},{"ID":"Africa014","TZ":"GMT-00:00","AREA":"Africa","TITLE":"this.tzEl_Aaiun"},{"ID":"Africa015","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzAlgiers"},{"ID":"Africa016","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzCeuta"},{"ID":"Africa017","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzCeutaSummer"},{"ID":"Africa018","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzTunis"},{"ID":"Africa019","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzBangui"},{"ID":"Africa020","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzBrazzaville"},{"ID":"Africa021","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzDouala"},{"ID":"Africa022","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzKinshasa"},{"ID":"Africa023","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzLagos"},{"ID":"Africa024","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzLibreville"},{"ID":"Africa025","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzLuanda"},{"ID":"Africa026","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzMalabo"},{"ID":"Africa027","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzNdjamena"},{"ID":"Africa028","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzNiamey"},{"ID":"Africa029","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzPorto_Novo"},{"ID":"Africa030","TZ":"GMT-01:00","AREA":"Africa","TITLE":"this.tzWindhoek"},{"ID":"Africa031","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzWindhoekSummer"},{"ID":"Africa032","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzBlantyre"},{"ID":"Africa033","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzBujumbura"},{"ID":"Africa034","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzGaborone"},{"ID":"Africa035","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzHarare"},{"ID":"Africa036","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzKigali"},{"ID":"Africa037","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzLubumbashi"},{"ID":"Africa038","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzLusaka"},{"ID":"Africa039","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzMaputo"},{"ID":"Africa040","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzCairo"},{"ID":"Africa041","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzTripoli"},{"ID":"Africa042","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzJohannesburg"},{"ID":"Africa043","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzMaseru"},{"ID":"Africa044","TZ":"GMT-02:00","AREA":"Africa","TITLE":"this.tzMbabane"},{"ID":"Africa045","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzAddis_Ababa"},{"ID":"Africa046","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzAsmera"},{"ID":"Africa047","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzDar_es_Salaam"},{"ID":"Africa048","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzDjibouti"},{"ID":"Africa049","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzKampala"},{"ID":"Africa050","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzKhartoum"},{"ID":"Africa051","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzMogadishu"},{"ID":"Africa052","TZ":"GMT-03:00","AREA":"Africa","TITLE":"this.tzNairobi"},{"ID":"America000","TZ":"GMT+10:00","AREA":"America","TITLE":"this.tzAdak"},{"ID":"America001","TZ":"GMT+09:00","AREA":"America","TITLE":"this.tzAnchorage"},{"ID":"America002","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzAnchorageSummer"},{"ID":"America003","TZ":"GMT+09:00","AREA":"America","TITLE":"this.tzJuneau"},{"ID":"America004","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzJuneauSummer"},{"ID":"America005","TZ":"GMT+09:00","AREA":"America","TITLE":"this.tzNome"},{"ID":"America006","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzNomeSummer"},{"ID":"America007","TZ":"GMT+09:00","AREA":"America","TITLE":"this.tzYakutat"},{"ID":"America008","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzYakutatSummer"},{"ID":"America009","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzDawson"},{"ID":"America010","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzDawsonSummer"},{"ID":"America011","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzLos_Angeles"},{"ID":"America012","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzLos_AngelesSummer"},{"ID":"America013","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzTijuana"},{"ID":"America014","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzTijuanaSummer"},{"ID":"America015","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzVancouver"},{"ID":"America016","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzVancouverSummer"},{"ID":"America017","TZ":"GMT+08:00","AREA":"America","TITLE":"this.tzWhitehorse"},{"ID":"America018","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzWhitehorseSummer"},{"ID":"America019","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzBoise"},{"ID":"America020","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzBoiseSummer"},{"ID":"America021","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzChihuahua"},{"ID":"America022","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzChihuahuaSummer"},{"ID":"America023","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzDawson_Creek"},{"ID":"America024","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzDenver"},{"ID":"America025","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzDenverSummer"},{"ID":"America026","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzEdmonton"},{"ID":"America027","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzEdmontonSummer"},{"ID":"America028","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzHermosillo"},{"ID":"America029","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzInuvik"},{"ID":"America030","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzInuvikSummer"},{"ID":"America031","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzMazatlan"},{"ID":"America032","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzMazatlanSummer"},{"ID":"America033","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzPhoenix"},{"ID":"America034","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzShiprock"},{"ID":"America035","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzShiprockSummer"},{"ID":"America036","TZ":"GMT+07:00","AREA":"America","TITLE":"this.tzYellowknife"},{"ID":"America037","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzYellowknifeSummer"},{"ID":"America038","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzBelize"},{"ID":"America039","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzCancun"},{"ID":"America040","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzCancunSummer"},{"ID":"America041","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzChicago"},{"ID":"America042","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzChicagoSummer"},{"ID":"America043","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzCosta_Rica"},{"ID":"America044","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzEl_Salvador"},{"ID":"America045","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzGuatemala"},{"ID":"America046","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzIndiana_Knox"},{"ID":"America047","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzIndiana_KnoxSummer"},{"ID":"America048","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzManagua"},{"ID":"America049","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzMenominee"},{"ID":"America050","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzMenomineeSummer"},{"ID":"America051","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzMerida"},{"ID":"America052","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzMeridaSummer"},{"ID":"America053","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzMexico_City"},{"ID":"America054","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzMexico_CitySummer"},{"ID":"America055","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzMonterrey"},{"ID":"America056","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzMonterreySummer"},{"ID":"America057","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzRainy_River"},{"ID":"America058","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzRainy_RiverSummer"},{"ID":"America059","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzRankin_Inlet"},{"ID":"America060","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzRankin_InletSummer"},{"ID":"America061","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzRegina"},{"ID":"America062","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzTegucigalpa"},{"ID":"America063","TZ":"GMT+06:00","AREA":"America","TITLE":"this.tzWinnipeg"},{"ID":"America064","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzWinnipegSummer"},{"ID":"America065","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzBogota"},{"ID":"America066","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzHavana"},{"ID":"America067","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzHavanaSummer"},{"ID":"America068","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzGuayaquil"},{"ID":"America069","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzCayman"},{"ID":"America070","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzDetroit"},{"ID":"America071","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzDetroitSummer"},{"ID":"America072","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzGrand_Turk"},{"ID":"America073","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzGrand_TurkSummer"},{"ID":"America074","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzIndianapolis"},{"ID":"America075","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzIndianapolisSummer"},{"ID":"America076","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzIqaluit"},{"ID":"America077","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzIqaluitSummer"},{"ID":"America078","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzJamaica"},{"ID":"America079","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzLouisville"},{"ID":"America080","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzLouisvilleSummer"},{"ID":"America081","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzMontreal"},{"ID":"America082","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzMontrealSummer"},{"ID":"America083","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzNassau"},{"ID":"America084","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzNassauSummer"},{"ID":"America085","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzNew_York"},{"ID":"America086","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzNew_YorkSummer"},{"ID":"America087","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzNipigon"},{"ID":"America088","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzNipigonSummer"},{"ID":"America089","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzPanama"},{"ID":"America090","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzPangnirtung"},{"ID":"America091","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzPangnirtungSummer"},{"ID":"America092","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzResolute"},{"ID":"America093","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzThunder_Bay"},{"ID":"America094","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzThunder_BaySummer"},{"ID":"America095","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzToronto"},{"ID":"America096","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzTorontoSummer"},{"ID":"America097","TZ":"GMT+05:00","AREA":"America","TITLE":"this.tzLima"},{"ID":"America098","TZ":"GMT+04:30","AREA":"America","TITLE":"this.tzCaracas"},{"ID":"America099","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzBoa_Vista"},{"ID":"America100","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzCampo_Grande"},{"ID":"America101","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzCampo_GrandeSummer"},{"ID":"America102","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzCuiaba"},{"ID":"America103","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzCuiabaSummer"},{"ID":"America104","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzEirunepe"},{"ID":"America105","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzManaus"},{"ID":"America106","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzPorto_Velho"},{"ID":"America107","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzRio_Branco"},{"ID":"America108","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzAnguilla"},{"ID":"America109","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzAntigua"},{"ID":"America110","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzAruba"},{"ID":"America111","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzBarbados"},{"ID":"America112","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzBlanc_Sablon"},{"ID":"America113","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzCuracao"},{"ID":"America114","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzDominica"},{"ID":"America115","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzGlace_Bay"},{"ID":"America116","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzGlace_BaySummer"},{"ID":"America117","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzGoose_Bay"},{"ID":"America118","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzGoose_BaySummer"},{"ID":"America119","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzGrenada"},{"ID":"America120","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzGuadeloupe"},{"ID":"America121","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzHalifax"},{"ID":"America122","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzHalifaxSummer"},{"ID":"America123","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzMarigot"},{"ID":"America124","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzMartinique"},{"ID":"America125","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzMoncton"},{"ID":"America126","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzMonctonSummer"},{"ID":"America127","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzMontserrat"},{"ID":"America128","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzPuerto_Rico"},{"ID":"America129","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzSt_Kitts"},{"ID":"America130","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzSt_Lucia"},{"ID":"America131","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzSt_Thomas"},{"ID":"America132","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzSt_Vincent"},{"ID":"America133","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzThule"},{"ID":"America134","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzThuleSummer"},{"ID":"America135","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzTortola"},{"ID":"America136","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzLa_Paz"},{"ID":"America137","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzSantiago"},{"ID":"America138","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzSantiagoSummer"},{"ID":"America139","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzGuyana"},{"ID":"America140","TZ":"GMT+04:00","AREA":"America","TITLE":"this.tzAsuncion"},{"ID":"America141","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzAsuncionSummer"},{"ID":"America142","TZ":"GMT+03:30","AREA":"America","TITLE":"this.tzSt_Johns"},{"ID":"America143","TZ":"GMT+02:30","AREA":"America","TITLE":"this.tzSt_JohnsSummer"},{"ID":"America144","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzBuenos_Aires"},{"ID":"America145","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzCatamarca"},{"ID":"America146","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzCordoba"},{"ID":"America147","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzJujuy"},{"ID":"America148","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzMendoza"},{"ID":"America149","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzAraguaina"},{"ID":"America150","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzBahia"},{"ID":"America151","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzBelem"},{"ID":"America152","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzFortaleza"},{"ID":"America153","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzMaceio"},{"ID":"America154","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzRecife"},{"ID":"America155","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzSantarem"},{"ID":"America156","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzSao_Paulo"},{"ID":"America157","TZ":"GMT+02:00","AREA":"America","TITLE":"this.tzSao_PauloSummer"},{"ID":"America158","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzCayenne"},{"ID":"America159","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzMiquelon"},{"ID":"America160","TZ":"GMT+02:00","AREA":"America","TITLE":"this.tzMiquelonSummer"},{"ID":"America161","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzParamaribo"},{"ID":"America162","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzMontevido"},{"ID":"America163","TZ":"GMT+02:00","AREA":"America","TITLE":"this.tzMontevidoSummer"},{"ID":"America164","TZ":"GMT+03:00","AREA":"America","TITLE":"this.tzGodthab"},{"ID":"America165","TZ":"GMT+02:00","AREA":"America","TITLE":"this.tzGodthabSummer"},{"ID":"America166","TZ":"GMT+02:00","AREA":"America","TITLE":"this.tzNoronha"},{"ID":"America167","TZ":"GMT+01:00","AREA":"America","TITLE":"this.tzScoresbysund"},{"ID":"America168","TZ":"GMT-00:00","AREA":"America","TITLE":"this.tzScoresbysundSummer"},{"ID":"America169","TZ":"GMT-00:00","AREA":"America","TITLE":"this.tzDanmarkshavn"},{"ID":"Antarctica000","TZ":"GMT+04:00","AREA":"Antarctica","TITLE":"this.tzPalmerStation"},{"ID":"Antarctica001","TZ":"GMT+03:00","AREA":"Antarctica","TITLE":"this.tzPalmerStationSummer"},{"ID":"Antarctica002","TZ":"GMT+03:00","AREA":"Antarctica","TITLE":"this.tzRotheraResearchStation"},{"ID":"Antarctica003","TZ":"GMT-03:00","AREA":"Antarctica","TITLE":"this.tzShowaStation"},{"ID":"Antarctica004","TZ":"GMT-05:00","AREA":"Antarctica","TITLE":"this.tzMawsonStation"},{"ID":"Antarctica005","TZ":"GMT-06:00","AREA":"Antarctica","TITLE":"this.tzVostokStation"},{"ID":"Antarctica006","TZ":"GMT-07:00","AREA":"Antarctica","TITLE":"this.tzDavisStation"},{"ID":"Antarctica007","TZ":"GMT-08:00","AREA":"Antarctica","TITLE":"this.tzCaseyStation"},{"ID":"Antarctica008","TZ":"GMT-12:00","AREA":"Antarctica","TITLE":"this.tzMcMurdoStation"},{"ID":"Antarctica009","TZ":"GMT-13:00","AREA":"Antarctica","TITLE":"this.tzMcMurdoStationSummer"},{"ID":"Arctic000","TZ":"GMT-01:00","AREA":"Arctic","TITLE":"this.tzLongyearbyen"},{"ID":"Arctic001","TZ":"GMT-02:00","AREA":"Arctic","TITLE":"this.tzLongyearbyenSummer"},{"ID":"Asia000","TZ":"GMT-02:00","AREA":"Asia","TITLE":"this.tzAmman"},{"ID":"Asia001","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzAmmanSummer"},{"ID":"Asia002","TZ":"GMT-02:00","AREA":"Asia","TITLE":"this.tzBeirut"},{"ID":"Asia003","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzBeirutSummer"},{"ID":"Asia004","TZ":"GMT-02:00","AREA":"Asia","TITLE":"this.tzDamascus"},{"ID":"Asia005","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzDamascusSummer"},{"ID":"Asia006","TZ":"GMT-02:00","AREA":"Asia","TITLE":"this.tzGaza"},{"ID":"Asia007","TZ":"GMT-02:00","AREA":"Asia","TITLE":"this.tzNicosia"},{"ID":"Asia008","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzNicosiaSummer"},{"ID":"Asia009","TZ":"GMT-02:00","AREA":"Asia","TITLE":"this.tzJerusalem"},{"ID":"Asia010","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzAden"},{"ID":"Asia011","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzBaghdad"},{"ID":"Asia012","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzBahrain"},{"ID":"Asia013","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzKuwait"},{"ID":"Asia014","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzQatar"},{"ID":"Asia015","TZ":"GMT-03:00","AREA":"Asia","TITLE":"this.tzRiyadh"},{"ID":"Asia016","TZ":"GMT-03:30","AREA":"Asia","TITLE":"this.tzTehran"},{"ID":"Asia017","TZ":"GMT-04:00","AREA":"Asia","TITLE":"this.tzYerevan"},{"ID":"Asia018","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzYerevanSummer"},{"ID":"Asia019","TZ":"GMT-04:00","AREA":"Asia","TITLE":"this.tzBaku"},{"ID":"Asia020","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzBakuSummer"},{"ID":"Asia021","TZ":"GMT-04:00","AREA":"Asia","TITLE":"this.tzTbilisi"},{"ID":"Asia022","TZ":"GMT-04:00","AREA":"Asia","TITLE":"this.tzDubai"},{"ID":"Asia023","TZ":"GMT-04:00","AREA":"Asia","TITLE":"this.tzMuscat"},{"ID":"Asia024","TZ":"GMT-04:30","AREA":"Asia","TITLE":"this.tzKabul"},{"ID":"Asia025","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzKarachi"},{"ID":"Asia026","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzDushanbe"},{"ID":"Asia027","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzAshgabat"},{"ID":"Asia028","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzSamarkand"},{"ID":"Asia029","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzTashkent"},{"ID":"Asia030","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzAqtau"},{"ID":"Asia031","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzAqtobe"},{"ID":"Asia032","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzOral"},{"ID":"Asia033","TZ":"GMT-05:00","AREA":"Asia","TITLE":"this.tzYekaterinbufg"},{"ID":"Asia034","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzYekaterinbufgSummer"},{"ID":"Asia035","TZ":"GMT-05:30","AREA":"Asia","TITLE":"this.tzCalcutta"},{"ID":"Asia036","TZ":"GMT-05:30","AREA":"Asia","TITLE":"this.tzColombo"},{"ID":"Asia037","TZ":"GMT-05:45","AREA":"Asia","TITLE":"this.tzKatmandu"},{"ID":"Asia038","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzDhaka"},{"ID":"Asia039","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzThimphu"},{"ID":"Asia040","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzAlmaty"},{"ID":"Asia041","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzQyzylorda"},{"ID":"Asia042","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzBishkek"},{"ID":"Asia043","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzNovosibirsk"},{"ID":"Asia044","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzNovosibirskSummer"},{"ID":"Asia045","TZ":"GMT-06:00","AREA":"Asia","TITLE":"this.tzOmsk"},{"ID":"Asia046","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzOmskSummer"},{"ID":"Asia047","TZ":"GMT-06:30","AREA":"Asia","TITLE":"this.tzRangoon"},{"ID":"Asia048","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzHovd"},{"ID":"Asia049","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzBangkok"},{"ID":"Asia050","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzPhnom_Penh"},{"ID":"Asia051","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzSaigon"},{"ID":"Asia052","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzVientiane"},{"ID":"Asia053","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzKrasnoyarsk"},{"ID":"Asia054","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzKrasnoyarskSummer"},{"ID":"Asia055","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzJakarta"},{"ID":"Asia056","TZ":"GMT-07:00","AREA":"Asia","TITLE":"this.tzPontianak"},{"ID":"Asia057","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzBrunei"},{"ID":"Asia058","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzChoibalsan"},{"ID":"Asia059","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzMakassar"},{"ID":"Asia060","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzBeijing"},{"ID":"Asia061","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzChongqing"},{"ID":"Asia062","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzHarbin"},{"ID":"Asia063","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzKashgar"},{"ID":"Asia064","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzMacau"},{"ID":"Asia065","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzShanghai"},{"ID":"Asia066","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzTaipei"},{"ID":"Asia067","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzUrumqi"},{"ID":"Asia068","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzHong_Kong"},{"ID":"Asia069","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzIrkutsk"},{"ID":"Asia070","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzIrkutskSummer"},{"ID":"Asia071","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzKuala_Lumpur"},{"ID":"Asia072","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzKuching"},{"ID":"Asia073","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzManila"},{"ID":"Asia074","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzSingapore"},{"ID":"Asia075","TZ":"GMT-08:00","AREA":"Asia","TITLE":"this.tzUlaanbaatar"},{"ID":"Asia076","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzJayapura"},{"ID":"Asia077","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzOsaka"},{"ID":"Asia078","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzSapporo"},{"ID":"Asia079","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzTokyo"},{"ID":"Asia080","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzPyongyang"},{"ID":"Asia081","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzSeoul"},{"ID":"Asia082","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzDili"},{"ID":"Asia083","TZ":"GMT-09:00","AREA":"Asia","TITLE":"this.tzYakutsk"},{"ID":"Asia084","TZ":"GMT-10:00","AREA":"Asia","TITLE":"this.tzYakutskSummer"},{"ID":"Asia085","TZ":"GMT-10:00","AREA":"Asia","TITLE":"this.tzSakhalin"},{"ID":"Asia086","TZ":"GMT-11:00","AREA":"Asia","TITLE":"this.tzSakhalinSummer"},{"ID":"Asia087","TZ":"GMT-10:00","AREA":"Asia","TITLE":"this.tzVladivostok"},{"ID":"Asia088","TZ":"GMT-11:00","AREA":"Asia","TITLE":"this.tzVladivostokSummer"},{"ID":"Asia089","TZ":"GMT-11:00","AREA":"Asia","TITLE":"this.tzAnadyr"},{"ID":"Asia090","TZ":"GMT-12:00","AREA":"Asia","TITLE":"this.tzAnadyrSummer"},{"ID":"Asia091","TZ":"GMT-11:00","AREA":"Asia","TITLE":"this.tzKamchatka"},{"ID":"Asia092","TZ":"GMT-12:00","AREA":"Asia","TITLE":"this.tzKamchatkaSummer"},{"ID":"Asia093","TZ":"GMT-11:00","AREA":"Asia","TITLE":"this.tzMagadan"},{"ID":"Asia094","TZ":"GMT-12:00","AREA":"Asia","TITLE":"this.tzMagadanSummer"},{"ID":"Atlantic000","TZ":"GMT+04:00","AREA":"Atlantic","TITLE":"this.tzBermuda"},{"ID":"Atlantic001","TZ":"GMT+03:00","AREA":"Atlantic","TITLE":"this.tzBermudaSummer"},{"ID":"Atlantic002","TZ":"GMT+04:00","AREA":"Atlantic","TITLE":"this.tzStanley"},{"ID":"Atlantic003","TZ":"GMT+03:00","AREA":"Atlantic","TITLE":"this.tzStanleySummer"},{"ID":"Atlantic004","TZ":"GMT+01:00","AREA":"Atlantic","TITLE":"this.tzAzores"},{"ID":"Atlantic005","TZ":"GMT-00:00","AREA":"Atlantic","TITLE":"this.tzAzoresSummer"},{"ID":"Atlantic006","TZ":"GMT+01:00","AREA":"Atlantic","TITLE":"this.tzCape_Verde"},{"ID":"Atlantic007","TZ":"GMT-00:00","AREA":"Atlantic","TITLE":"this.tzReykjavik"},{"ID":"Atlantic008","TZ":"GMT-00:00","AREA":"Atlantic","TITLE":"this.tzSt_Helena"},{"ID":"Atlantic009","TZ":"GMT-00:00","AREA":"Atlantic","TITLE":"this.tzCanary"},{"ID":"Atlantic010","TZ":"GMT-01:00","AREA":"Atlantic","TITLE":"this.tzCanarySummer"},{"ID":"Atlantic011","TZ":"GMT-00:00","AREA":"Atlantic","TITLE":"this.tzFaeroe"},{"ID":"Atlantic012","TZ":"GMT-01:00","AREA":"Atlantic","TITLE":"this.tzFaeroeSummer"},{"ID":"Atlantic013","TZ":"GMT-00:00","AREA":"Atlantic","TITLE":"this.tzMadeira"},{"ID":"Atlantic014","TZ":"GMT-01:00","AREA":"Atlantic","TITLE":"this.tzMadeiraSummer"},{"ID":"Australia000","TZ":"GMT-08:00","AREA":"Australia","TITLE":"this.tzPerth"},{"ID":"Australia001","TZ":"GMT-08:45","AREA":"Australia","TITLE":"this.tzEucla"},{"ID":"Australia002","TZ":"GMT-09:30","AREA":"Australia","TITLE":"this.tzAdelaide"},{"ID":"Australia003","TZ":"GMT-10:30","AREA":"Australia","TITLE":"this.tzAdelaideSummer"},{"ID":"Australia004","TZ":"GMT-09:30","AREA":"Australia","TITLE":"this.tzDarwin"},{"ID":"Australia005","TZ":"GMT-10:00","AREA":"Australia","TITLE":"this.tzBrisbane"},{"ID":"Australia006","TZ":"GMT-10:00","AREA":"Australia","TITLE":"this.tzCurrie"},{"ID":"Australia007","TZ":"GMT-11:00","AREA":"Australia","TITLE":"this.tzCurrieSummer"},{"ID":"Australia008","TZ":"GMT-10:00","AREA":"Australia","TITLE":"this.tzHobart"},{"ID":"Australia009","TZ":"GMT-11:00","AREA":"Australia","TITLE":"this.tzHobartSummer"},{"ID":"Australia010","TZ":"GMT-10:00","AREA":"Australia","TITLE":"this.tzLindeman"},{"ID":"Australia011","TZ":"GMT-10:00","AREA":"Australia","TITLE":"this.tzMelbourne"},{"ID":"Australia012","TZ":"GMT-11:00","AREA":"Australia","TITLE":"this.tzMelbourneSummer"},{"ID":"Australia013","TZ":"GMT-10:00","AREA":"Australia","TITLE":"this.tzSydney"},{"ID":"Australia014","TZ":"GMT-11:00","AREA":"Australia","TITLE":"this.tzSydneySummer"},{"ID":"Australia015","TZ":"GMT-10:30","AREA":"Australia","TITLE":"this.tzLord_Howe"},{"ID":"Australia016","TZ":"GMT-11:00","AREA":"Australia","TITLE":"this.tzLord_HoweSummer"},{"ID":"Europe000","TZ":"GMT-00:00","AREA":"Europe","TITLE":"this.tzDublin"},{"ID":"Europe001","TZ":"GMT-00:00","AREA":"Europe","TITLE":"this.tzGuernsey"},{"ID":"Europe002","TZ":"GMT-00:00","AREA":"Europe","TITLE":"this.tzIsle_of_Man"},{"ID":"Europe003","TZ":"GMT-00:00","AREA":"Europe","TITLE":"this.tzJersey"},{"ID":"Europe004","TZ":"GMT-00:00","AREA":"Europe","TITLE":"this.tzLondon"},{"ID":"Europe005","TZ":"GMT-00:00","AREA":"Europe","TITLE":"this.tzLisbon"},{"ID":"Europe006","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzLisbonSummer"},{"ID":"Europe007","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzAmsterdam"},{"ID":"Europe008","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzAmsterdamSummer"},{"ID":"Europe009","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzAndorra"},{"ID":"Europe010","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzAndorraSummer"},{"ID":"Europe011","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzBelgrade"},{"ID":"Europe012","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzBelgradeSummer"},{"ID":"Europe013","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzBerlin"},{"ID":"Europe014","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzBerlinSummer"},{"ID":"Europe015","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzBratislava"},{"ID":"Europe016","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzBratislavaSummer"},{"ID":"Europe017","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzBrussels"},{"ID":"Europe018","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzBrusselsSummer"},{"ID":"Europe019","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzBudapest"},{"ID":"Europe020","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzBudapestSummer"},{"ID":"Europe021","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzCopenhagen"},{"ID":"Europe022","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzCopenhagenSummer"},{"ID":"Europe023","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzGibraltar"},{"ID":"Europe024","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzGibraltarSummer"},{"ID":"Europe025","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzLjubljana"},{"ID":"Europe026","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzLjubljanaSummer"},{"ID":"Europe027","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzLuxembourg"},{"ID":"Europe028","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzLuxembourgSummer"},{"ID":"Europe029","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzMadrid"},{"ID":"Europe030","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzMadridSummer"},{"ID":"Europe031","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzMalta"},{"ID":"Europe032","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzMaltaSummer"},{"ID":"Europe033","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzMonaco"},{"ID":"Europe034","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzMonacoSummer"},{"ID":"Europe035","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzOslo"},{"ID":"Europe036","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzOsloSummer"},{"ID":"Europe037","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzParis"},{"ID":"Europe038","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzParisSummer"},{"ID":"Europe039","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzPodgorica"},{"ID":"Europe040","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzPodgoricaSummer"},{"ID":"Europe041","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzPrague"},{"ID":"Europe042","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzPragueSummer"},{"ID":"Europe043","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzRome"},{"ID":"Europe044","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzRomeSummer"},{"ID":"Europe045","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzSan_Marino"},{"ID":"Europe046","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzSan_MarinoSummer"},{"ID":"Europe047","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzSarajevo"},{"ID":"Europe048","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzSarajevoSummer"},{"ID":"Europe049","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzSkopje"},{"ID":"Europe050","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzSkopjeSummer"},{"ID":"Europe051","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzStockholm"},{"ID":"Europe052","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzStockholmSummer"},{"ID":"Europe053","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzTirane"},{"ID":"Europe054","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzTiraneSummer"},{"ID":"Europe055","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzVaduz"},{"ID":"Europe056","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzVaduzSummer"},{"ID":"Europe057","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzVatican"},{"ID":"Europe058","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzVaticanSummer"},{"ID":"Europe059","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzVienna"},{"ID":"Europe060","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzViennaSummer"},{"ID":"Europe061","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzWarsaw"},{"ID":"Europe062","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzWarsawSummer"},{"ID":"Europe063","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzZagreb"},{"ID":"Europe064","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzZagrebSummer"},{"ID":"Europe065","TZ":"GMT-01:00","AREA":"Europe","TITLE":"this.tzZurich"},{"ID":"Europe066","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzZurichSummer"},{"ID":"Europe067","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzAthens"},{"ID":"Europe068","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzAthensSummer"},{"ID":"Europe069","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzBucharest"},{"ID":"Europe070","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzBucharestSummer"},{"ID":"Europe071","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzChisinau"},{"ID":"Europe072","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzChisinauSummer"},{"ID":"Europe073","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzHelsinki"},{"ID":"Europe074","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzHelsinkiSummer"},{"ID":"Europe075","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzIstanbul"},{"ID":"Europe076","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzIstanbulSummer"},{"ID":"Europe077","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzKaliningrad"},{"ID":"Europe078","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzKaliningradSummer"},{"ID":"Europe079","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzKiev"},{"ID":"Europe080","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzKievSummer"},{"ID":"Europe081","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzMariehamn"},{"ID":"Europe082","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzMariehamnSummer"},{"ID":"Europe083","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzMinsk"},{"ID":"Europe084","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzMinskSummer"},{"ID":"Europe085","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzRiga"},{"ID":"Europe086","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzRigaSummer"},{"ID":"Europe087","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzSimferopol"},{"ID":"Europe088","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzSimferopolSummer"},{"ID":"Europe089","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzSofia"},{"ID":"Europe090","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzSofiaSummer"},{"ID":"Europe091","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzTallinn"},{"ID":"Europe092","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzTallinnSummer"},{"ID":"Europe093","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzUzhgorod"},{"ID":"Europe094","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzUzhgorodSummer"},{"ID":"Europe095","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzVilnius"},{"ID":"Europe096","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzVilniusSummer"},{"ID":"Europe097","TZ":"GMT-02:00","AREA":"Europe","TITLE":"this.tzZaporozhye"},{"ID":"Europe098","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzZaporozhyeSummer"},{"ID":"Europe099","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzMoscow"},{"ID":"Europe100","TZ":"GMT-04:00","AREA":"Europe","TITLE":"this.tzMoscowSummer"},{"ID":"Europe101","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzSamara"},{"ID":"Europe102","TZ":"GMT-04:00","AREA":"Europe","TITLE":"this.tzSamaraSummer"},{"ID":"Europe103","TZ":"GMT-03:00","AREA":"Europe","TITLE":"this.tzVolgograd"},{"ID":"Europe104","TZ":"GMT-04:00","AREA":"Europe","TITLE":"this.tzVolgogradSummer"},{"ID":"Indian000","TZ":"GMT-03:00","AREA":"Indian","TITLE":"this.tzAntananarivo"},{"ID":"Indian001","TZ":"GMT-03:00","AREA":"Indian","TITLE":"this.tzComoro"},{"ID":"Indian002","TZ":"GMT-03:00","AREA":"Indian","TITLE":"this.tzMayotte"},{"ID":"Indian003","TZ":"GMT-04:00","AREA":"Indian","TITLE":"this.tzMauritius"},{"ID":"Indian004","TZ":"GMT-04:00","AREA":"Indian","TITLE":"this.tzReunion"},{"ID":"Indian005","TZ":"GMT-04:00","AREA":"Indian","TITLE":"this.tzMahe"},{"ID":"Indian006","TZ":"GMT-05:00","AREA":"Indian","TITLE":"this.tzMaldives"},{"ID":"Indian007","TZ":"GMT-05:00","AREA":"Indian","TITLE":"this.tzKerguelen"},{"ID":"Indian008","TZ":"GMT-06:00","AREA":"Indian","TITLE":"this.tzChagos"},{"ID":"Indian009","TZ":"GMT-06:30","AREA":"Indian","TITLE":"this.tzCocos"},{"ID":"Indian010","TZ":"GMT-07:00","AREA":"Indian","TITLE":"this.tzChristmas"},{"ID":"Pacific000","TZ":"GMT+11:00","AREA":"Pacific","TITLE":"this.tzNiue"},{"ID":"Pacific001","TZ":"GMT+11:00","AREA":"Pacific","TITLE":"this.tzApia"},{"ID":"Pacific002","TZ":"GMT+11:00","AREA":"Pacific","TITLE":"this.tzMidway"},{"ID":"Pacific003","TZ":"GMT+11:00","AREA":"Pacific","TITLE":"this.tzPago_pago"},{"ID":"Pacific004","TZ":"GMT+10:00","AREA":"Pacific","TITLE":"this.tzRarotonga"},{"ID":"Pacific005","TZ":"GMT+10:00","AREA":"Pacific","TITLE":"this.tzHonolulu"},{"ID":"Pacific006","TZ":"GMT+10:00","AREA":"Pacific","TITLE":"this.tzJohnston"},{"ID":"Pacific007","TZ":"GMT+10:00","AREA":"Pacific","TITLE":"this.tzTahiti"},{"ID":"Pacific008","TZ":"GMT+10:00","AREA":"Pacific","TITLE":"this.tzFakaofo"},{"ID":"Pacific009","TZ":"GMT+09:30","AREA":"Pacific","TITLE":"this.tzMarquesas"},{"ID":"Pacific010","TZ":"GMT+09:00","AREA":"Pacific","TITLE":"this.tzGambier"},{"ID":"Pacific011","TZ":"GMT+08:00","AREA":"Pacific","TITLE":"this.tzPitcairn"},{"ID":"Pacific012","TZ":"GMT+06:00","AREA":"Pacific","TITLE":"this.tzEaster"},{"ID":"Pacific013","TZ":"GMT+05:00","AREA":"Pacific","TITLE":"this.tzEasterSummer"},{"ID":"Pacific014","TZ":"GMT+06:00","AREA":"Pacific","TITLE":"this.tzGalapagos"},{"ID":"Pacific015","TZ":"GMT-09:00","AREA":"Pacific","TITLE":"this.tzPalau"},{"ID":"Pacific016","TZ":"GMT-10:00","AREA":"Pacific","TITLE":"this.tzGuam"},{"ID":"Pacific017","TZ":"GMT-10:00","AREA":"Pacific","TITLE":"this.tzSaipan"},{"ID":"Pacific018","TZ":"GMT-10:00","AREA":"Pacific","TITLE":"this.tzTruk"},{"ID":"Pacific019","TZ":"GMT-10:00","AREA":"Pacific","TITLE":"this.tzPort_Moresby"},{"ID":"Pacific020","TZ":"GMT-11:00","AREA":"Pacific","TITLE":"this.tzKosrae"},{"ID":"Pacific021","TZ":"GMT-11:00","AREA":"Pacific","TITLE":"this.tzNoumea"},{"ID":"Pacific022","TZ":"GMT-11:00","AREA":"Pacific","TITLE":"this.tzPonape"},{"ID":"Pacific023","TZ":"GMT-11:00","AREA":"Pacific","TITLE":"this.tzGuadalcanal"},{"ID":"Pacific024","TZ":"GMT-11:00","AREA":"Pacific","TITLE":"this.tzEfate"},{"ID":"Pacific025","TZ":"GMT-11:30","AREA":"Pacific","TITLE":"this.tzNorfolk"},{"ID":"Pacific026","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzFiji"},{"ID":"Pacific027","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzTarawa"},{"ID":"Pacific028","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzKwajalein"},{"ID":"Pacific029","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzMajuro"},{"ID":"Pacific030","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzNauru"},{"ID":"Pacific031","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzAuckland"},{"ID":"Pacific032","TZ":"GMT-13:00","AREA":"Pacific","TITLE":"this.tzAucklandSummer"},{"ID":"Pacific033","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzFunafuti"},{"ID":"Pacific034","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzWake"},{"ID":"Pacific035","TZ":"GMT-12:00","AREA":"Pacific","TITLE":"this.tzWallis"},{"ID":"Pacific036","TZ":"GMT-13:00","AREA":"Pacific","TITLE":"this.tzEnderbury"},{"ID":"Pacific037","TZ":"GMT-13:00","AREA":"Pacific","TITLE":"this.tzTongatapu"},{"ID":"Pacific038","TZ":"GMT-14:00","AREA":"Pacific","TITLE":"this.tzKiritimati"},{"ID":"AreaGMT000","TZ":"GMT+12:00","AREA":"AreaGMT","TITLE":"this.tzGMTm1200"},{"ID":"AreaGMT001","TZ":"GMT+11:00","AREA":"AreaGMT","TITLE":"this.tzGMTm1100"},{"ID":"AreaGMT002","TZ":"GMT+10:00","AREA":"AreaGMT","TITLE":"this.tzGMTm1000"},{"ID":"AreaGMT003","TZ":"GMT+09:30","AREA":"AreaGMT","TITLE":"this.tzGMTm0930"},{"ID":"AreaGMT004","TZ":"GMT+09:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0900"},{"ID":"AreaGMT005","TZ":"GMT+08:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0800"},{"ID":"AreaGMT006","TZ":"GMT+07:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0700"},{"ID":"AreaGMT007","TZ":"GMT+06:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0600"},{"ID":"AreaGMT008","TZ":"GMT+05:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0500"},{"ID":"AreaGMT009","TZ":"GMT+04:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0400"},{"ID":"AreaGMT010","TZ":"GMT+03:30","AREA":"AreaGMT","TITLE":"this.tzGMTm0330"},{"ID":"AreaGMT011","TZ":"GMT+03:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0300"},{"ID":"AreaGMT012","TZ":"GMT+02:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0200"},{"ID":"AreaGMT013","TZ":"GMT+01:00","AREA":"AreaGMT","TITLE":"this.tzGMTm0100"},{"ID":"AreaGMT014","TZ":"GMT-00:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0000"},{"ID":"AreaGMT015","TZ":"GMT-01:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0100"},{"ID":"AreaGMT016","TZ":"GMT-02:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0200"},{"ID":"AreaGMT017","TZ":"GMT-03:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0300"},{"ID":"AreaGMT018","TZ":"GMT-03:30","AREA":"AreaGMT","TITLE":"this.tzGMTp0330"},{"ID":"AreaGMT019","TZ":"GMT-04:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0400"},{"ID":"AreaGMT020","TZ":"GMT-04:30","AREA":"AreaGMT","TITLE":"this.tzGMTp0430"},{"ID":"AreaGMT021","TZ":"GMT-05:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0500"},{"ID":"AreaGMT022","TZ":"GMT-05:30","AREA":"AreaGMT","TITLE":"this.tzGMTp0530"},{"ID":"AreaGMT023","TZ":"GMT-05:45","AREA":"AreaGMT","TITLE":"this.tzGMTp0545"},{"ID":"AreaGMT024","TZ":"GMT-06:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0600"},{"ID":"AreaGMT025","TZ":"GMT-06:30","AREA":"AreaGMT","TITLE":"this.tzGMTp0630"},{"ID":"AreaGMT026","TZ":"GMT-07:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0700"},{"ID":"AreaGMT027","TZ":"GMT-08:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0800"},{"ID":"AreaGMT028","TZ":"GMT-08:30","AREA":"AreaGMT","TITLE":"this.tzGMTp0830"},{"ID":"AreaGMT029","TZ":"GMT-08:45","AREA":"AreaGMT","TITLE":"this.tzGMTp0845"},{"ID":"AreaGMT030","TZ":"GMT-09:00","AREA":"AreaGMT","TITLE":"this.tzGMTp0900"},{"ID":"AreaGMT031","TZ":"GMT-09:30","AREA":"AreaGMT","TITLE":"this.tzGMTp0930"},{"ID":"AreaGMT032","TZ":"GMT-10:00","AREA":"AreaGMT","TITLE":"this.tzGMTp1000"},{"ID":"AreaGMT033","TZ":"GMT-10:30","AREA":"AreaGMT","TITLE":"this.tzGMTp1030"},{"ID":"AreaGMT034","TZ":"GMT-11:00","AREA":"AreaGMT","TITLE":"this.tzGMTp1100"},{"ID":"AreaGMT035","TZ":"GMT-12:00","AREA":"AreaGMT","TITLE":"this.tzGMTp1200"},{"ID":"AreaGMT036","TZ":"GMT-12:45","AREA":"AreaGMT","TITLE":"this.tzGMTp1245"},{"ID":"AreaGMT037","TZ":"GMT-13:00","AREA":"AreaGMT","TITLE":"this.tzGMTp1300"},{"ID":"AreaGMT038","TZ":"GMT-14:00","AREA":"AreaGMT","TITLE":"this.tzGMTp1400"}]}');

/***/ }),

/***/ "./src/infra/timezoneArea.json":
/*!*************************************!*\
  !*** ./src/infra/timezoneArea.json ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"timezoneAreaList":[{"ID":0,"AREA":"Africa","TITLE":"this.tzAreaAfrica"},{"ID":1,"AREA":"America","TITLE":"this.tzAreaAmerica"},{"ID":2,"AREA":"Antarctica","TITLE":"this.tzAreaAntarctica"},{"ID":3,"AREA":"Arctic","TITLE":"this.tzAreaArctic"},{"ID":4,"AREA":"Asia","TITLE":"this.tzAreaAsia"},{"ID":5,"AREA":"Atlantic","TITLE":"this.tzAreaAtlantic"},{"ID":6,"AREA":"Australia","TITLE":"this.tzAreaAustralia"},{"ID":7,"AREA":"Europe","TITLE":"this.tzAreaEurope"},{"ID":8,"AREA":"Indian","TITLE":"this.tzAreaIndian"},{"ID":9,"AREA":"Pacific","TITLE":"this.tzAreaPacific"},{"ID":10,"AREA":"AreaGMT","TITLE":"this.tzAreaGMT"}]}');

/***/ }),

/***/ "./src/locales/en/menu.json":
/*!**********************************!*\
  !*** ./src/locales/en/menu.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"main.dashbord":"Dashbord","key":"hello world!!","key2":"Happy?","timeConf.timezoneKey":"TimeZone","timeConf.tzTopKey":"Please select","wifiConf.stationListTopKey":"WiFiStation Erace"}');

/***/ }),

/***/ "./src/locales/en/tzlang.json":
/*!************************************!*\
  !*** ./src/locales/en/tzlang.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"timeConf.tzAreaAfrica":"Africa","timeConf.tzAreaAmerica":"America","timeConf.tzAreaAntarctica":"Antarctica","timeConf.tzAreaArctic":"Arctic","timeConf.tzAreaAsia":"Asia","timeConf.tzAreaAtlantic":"Atlantic","timeConf.tzAreaAustralia":"Australia","timeConf.tzAreaEurope":"Europe","timeConf.tzAreaIndian":"Indian","timeConf.tzAreaPacific":"Pacific","timeConf.tzAreaGMT":"GMT standard","timeConf.tzAbidjan":"GMT / Abidjan / Greenwich Mean Time","timeConf.tzAccra":"GMT / Accra / Greenwich Mean Time","timeConf.tzBamako":"GMT / Bamako / Greenwich Mean Time","timeConf.tzBanjul":"GMT / Banjul / Greenwich Mean Time","timeConf.tzBissau":"GMT / Bissau / Greenwich Mean Time","timeConf.tzConakry":"GMT / Conakry / Greenwich Mean Time","timeConf.tzDakar":"GMT / Dakar / Greenwich Mean Time","timeConf.tzFreetown":"GMT / Freetown / Greenwich Mean Time","timeConf.tzLome":"GMT / Lome / Greenwich Mean Time","timeConf.tzMonrovia":"GMT / Monrovia / Greenwich Mean Time","timeConf.tzNouakchott":"GMT / Nouakchott / Greenwich Mean Time","timeConf.tzOuagadougou":"GMT / Ouagadougou / Greenwich Mean Time","timeConf.tzSao_Tome":"GMT / Sao_Tome / Greenwich Mean Time","timeConf.tzCasablanca":"WET / Casablanca / Western European time","timeConf.tzEl_Aaiun":"WET / El_Aaiun / Western European time","timeConf.tzAlgiers":"CET / Algiers / Central European Time","timeConf.tzCeuta":"CET / Ceuta / Central European Time","timeConf.tzCeutaSummer":"CEST / Ceuta / Central European Summer Time","timeConf.tzTunis":"CET / Tunis / Central European Time","timeConf.tzBangui":"WAT / Bangui / West africa time","timeConf.tzBrazzaville":"WAT / Brazzaville / West africa time","timeConf.tzDouala":"WAT / Douala / West africa time","timeConf.tzKinshasa":"WAT / Kinshasa / West africa time","timeConf.tzLagos":"WAT / Lagos / West africa time","timeConf.tzLibreville":"WAT / Libreville / West africa time","timeConf.tzLuanda":"WAT / Luanda / West africa time","timeConf.tzMalabo":"WAT / Malabo / West africa time","timeConf.tzNdjamena":"WAT / Ndjamena / West africa time","timeConf.tzNiamey":"WAT / Niamey / West africa time","timeConf.tzPorto_Novo":"WAT / Porto-Novo / West africa time","timeConf.tzWindhoek":"WAT / Windhoek / West africa time","timeConf.tzWindhoekSummer":"WAST / Windhoek / West Africa Daylight Time","timeConf.tzBlantyre":"CAT / Blantyre / Central african time","timeConf.tzBujumbura":"CAT / Bujumbura / Central african time","timeConf.tzGaborone":"CAT / Gaborone / Central african time","timeConf.tzHarare":"CAT / Harare / Central african time","timeConf.tzKigali":"CAT / Kigali / Central african time","timeConf.tzLubumbashi":"CAT / Lubumbashi / Central african time","timeConf.tzLusaka":"CAT / Lusaka / Central african time","timeConf.tzMaputo":"CAT / Maputo / Central african time","timeConf.tzCairo":"EET / Cairo / Eastern European time","timeConf.tzTripoli":"EET / Tripoli / Eastern European time","timeConf.tzJohannesburg":"SAST / Johannesburg / South Africa Standard Time","timeConf.tzMaseru":"SAST / Maseru / South Africa Standard Time","timeConf.tzMbabane":"SAST / Mbabane / South Africa Standard Time","timeConf.tzAddis_Ababa":"EAT / Addis_Ababa / east africa time","timeConf.tzAsmera":"EAT / Asmera / east africa time","timeConf.tzDar_es_Salaam":"EAT / Dar_es_Salaam / east africa time","timeConf.tzDjibouti":"EAT / Djibouti / east africa time","timeConf.tzKampala":"EAT / Kampala / east africa time","timeConf.tzKhartoum":"EAT / Khartoum / east africa time","timeConf.tzMogadishu":"EAT / Mogadishu / east africa time","timeConf.tzNairobi":"EAT / Nairobi / east africa time","timeConf.tzAdak":"HST / Adak / Hawaii Aleutian Standard Time","timeConf.tzAnchorage":"AKST / Anchorage / Alaska Standard Time","timeConf.tzAnchorageSummer":"AKDT / Anchorage / Alaska Daylight Saving Time","timeConf.tzJuneau":"AKST / Juneau / Alaska Standard Time","timeConf.tzJuneauSummer":"AKDT / Juneau / Alaska Daylight Saving Time","timeConf.tzNome":"AKST / Nome / Alaska Standard Time","timeConf.tzNomeSummer":"AKDT / Nome / Alaska Daylight Saving Time","timeConf.tzYakutat":"AKST / Yakutat / Alaska Standard Time","timeConf.tzYakutatSummer":"AKDT / Yakutat / Alaska Daylight Saving Time","timeConf.tzDawson":"PST / Dawson / Pacific Standard Time","timeConf.tzDawsonSummer":"PDT / Dawson / Pacific Daylight Time","timeConf.tzLos_Angeles":"PST / Los_Angeles / Pacific Standard Time","timeConf.tzLos_AngelesSummer":"PDT / Los_Angeles / Pacific Daylight Time","timeConf.tzTijuana":"PST / Tijuana / Pacific Standard Time","timeConf.tzTijuanaSummer":"PDT / Tijuana / Pacific Daylight Time","timeConf.tzVancouver":"PST / Vancouver / Pacific Standard Time","timeConf.tzVancouverSummer":"PDT / Vancouver / Pacific Daylight Time","timeConf.tzWhitehorse":"PST / Whitehorse / Pacific Standard Time","timeConf.tzWhitehorseSummer":"PDT / Whitehorse / Pacific Daylight Time","timeConf.tzBoise":"MST / Boise / Mountain Standard Time","timeConf.tzBoiseSummer":"MDT / Boise / Mountain Daylight Saving Time","timeConf.tzChihuahua":"MST / Chihuahua / Mountain Standard Time","timeConf.tzChihuahuaSummer":"MDT / Chihuahua / Mountain Daylight Saving Time","timeConf.tzDawson_Creek":"MST / Dawson_Creek / Mountain Standard Time","timeConf.tzDenver":"MST / Denver / Mountain Standard Time","timeConf.tzDenverSummer":"MDT / Denver / Mountain Daylight Saving Time","timeConf.tzEdmonton":"MST / Edmonton / Mountain Standard Time","timeConf.tzEdmontonSummer":"MDT / Edmonton / Mountain Daylight Saving Time","timeConf.tzHermosillo":"MST / Hermosillo / Mountain Standard Time","timeConf.tzInuvik":"MST / Inuvik / Mountain Standard Time","timeConf.tzInuvikSummer":"MDT / Inuvik / Mountain Daylight Saving Time","timeConf.tzMazatlan":"MST / Mazatlan / Mountain Standard Time","timeConf.tzMazatlanSummer":"MDT / Mazatlan / Mountain Daylight Saving Time","timeConf.tzPhoenix":"MST / Phoenix / Mountain Standard Time","timeConf.tzShiprock":"MST / Shiprock / Mountain Standard Time","timeConf.tzShiprockSummer":"MDT / Shiprock / Mountain Daylight Saving Time","timeConf.tzYellowknife":"MST / Yellowknife / Mountain Standard Time","timeConf.tzYellowknifeSummer":"MDT / Yellowknife / Mountain Daylight Saving Time","timeConf.tzBelize":"CST / Belize / Central Standard Time","timeConf.tzCancun":"CST / Cancun / Central Standard Time","timeConf.tzCancunSummer":"CDT / Cancun / Central Daylight Time","timeConf.tzChicago":"CST / Chicago / Central Standard Time","timeConf.tzChicagoSummer":"CDT / Chicago / Central Daylight Time","timeConf.tzCosta_Rica":"CST / Costa_Rica / Central Standard Time","timeConf.tzEl_Salvador":"CST / El_Salvador / Central Standard Time","timeConf.tzGuatemala":"CST / Guatemala / Central Standard Time","timeConf.tzIndiana_Knox":"CST / Indiana/Knox / Central Standard Time","timeConf.tzIndiana_KnoxSummer":"CDT / Indiana/Knox / Central Daylight Time","timeConf.tzManagua":"CST / Managua / Central Standard Time","timeConf.tzMenominee":"CST / Menominee / Central Standard Time","timeConf.tzMenomineeSummer":"CDT / Menominee / Central Daylight Time","timeConf.tzMerida":"CST / Merida / Central Standard Time","timeConf.tzMeridaSummer":"CDT / Merida / Central Daylight Time","timeConf.tzMexico_City":"CST / Mexico_City / Central Standard Time","timeConf.tzMexico_CitySummer":"CDT / Mexico_City / Central Daylight Time","timeConf.tzMonterrey":"CST / Monterrey / Central Standard Time","timeConf.tzMonterreySummer":"CDT / Monterrey / Central Daylight Time","timeConf.tzRainy_River":"CST / Rainy_River / Central Standard Time","timeConf.tzRainy_RiverSummer":"CDT / Rainy_River / Central Daylight Time","timeConf.tzRankin_Inlet":"CST / Rankin_Inlet / Central Standard Time","timeConf.tzRankin_InletSummer":"CDT / Rankin_Inlet / Central Daylight Time","timeConf.tzRegina":"CST / Regina / Central Standard Time","timeConf.tzTegucigalpa":"CST / Tegucigalpa / Central Standard Time","timeConf.tzWinnipeg":"CST / Winnipeg / Central Standard Time","timeConf.tzWinnipegSummer":"CDT / Winnipeg / Central Daylight Time","timeConf.tzBogota":"COT / Bogota / Columbia Time","timeConf.tzHavana":"CST / Havana / Cuba Standard Time","timeConf.tzHavanaSummer":"CDT / Havana / Cuba Daylight Saving Time","timeConf.tzGuayaquil":"ECT / Guayaquil / Ecuador Time","timeConf.tzCayman":"EST / Cayman / Eastern Standard Time","timeConf.tzDetroit":"EST / Detroit / Eastern Standard Time","timeConf.tzDetroitSummer":"EDT / Detroit / Eastern Daylight Time","timeConf.tzGrand_Turk":"EST / Grand_Turk / Eastern Standard Time","timeConf.tzGrand_TurkSummer":"EDT / Grand_Turk / Eastern Daylight Time","timeConf.tzIndianapolis":"EST / Indianapolis / Eastern Standard Time","timeConf.tzIndianapolisSummer":"EDT / Indianapolis / Eastern Daylight Time","timeConf.tzIqaluit":"EST / Iqaluit / Eastern Standard Time","timeConf.tzIqaluitSummer":"EDT / Iqaluit / Eastern Daylight Time","timeConf.tzJamaica":"EST / Jamaica / Eastern Standard Time","timeConf.tzLouisville":"EST / Louisville / Eastern Standard Time","timeConf.tzLouisvilleSummer":"EDT / Louisville / Eastern Daylight Time","timeConf.tzMontreal":"EST / Montreal / Eastern Standard Time","timeConf.tzMontrealSummer":"EDT / Montreal / Eastern Daylight Time","timeConf.tzNassau":"EST / Nassau / Eastern Standard Time","timeConf.tzNassauSummer":"EDT / Nassau / Eastern Daylight Time","timeConf.tzNew_York":"EST / New_York / Eastern Standard Time","timeConf.tzNew_YorkSummer":"EDT / New_York / Eastern Daylight Time","timeConf.tzNipigon":"EST / Nipigon / Eastern Standard Time","timeConf.tzNipigonSummer":"EDT / Nipigon / Eastern Daylight Time","timeConf.tzPanama":"EST / Panama / Eastern Standard Time","timeConf.tzPangnirtung":"EST / Pangnirtung / Eastern Standard Time","timeConf.tzPangnirtungSummer":"EDT / Pangnirtung / Eastern Daylight Time","timeConf.tzResolute":"EST / Resolute / Eastern Standard Time","timeConf.tzThunder_Bay":"EST / Thunder_Bay / Eastern Standard Time","timeConf.tzThunder_BaySummer":"EDT / Thunder_Bay / Eastern Daylight Time","timeConf.tzToronto":"EST / Toronto / Eastern Standard Time","timeConf.tzTorontoSummer":"EDT / Toronto / Eastern Daylight Time","timeConf.tzLima":"PET / Lima / Peru time","timeConf.tzCaracas":"VET / Caracas / Venezuela time","timeConf.tzBoa_Vista":"AMT / Boa_Vista / Amazon Time","timeConf.tzCampo_Grande":"AMT / Campo_Grande / Amazon Time","timeConf.tzCampo_GrandeSummer":"AMST / Campo_Grande / Amazon Daylight Saving Time","timeConf.tzCuiaba":"AMT / Cuiaba / Amazon Time","timeConf.tzCuiabaSummer":"AMST / Cuiaba / Amazon Daylight Saving Time","timeConf.tzEirunepe":"AMT / Eirunepe / Amazon Time","timeConf.tzManaus":"AMT / Manaus / Amazon Time","timeConf.tzPorto_Velho":"AMT / Porto_Velho / Amazon Time","timeConf.tzRio_Branco":"AMT / Rio_Branco / Amazon Time","timeConf.tzAnguilla":"AST / Anguilla / Atlantic Standard Time","timeConf.tzAntigua":"AST / Antigua / Atlantic Standard Time","timeConf.tzAruba":"AST / Aruba / Atlantic Standard Time","timeConf.tzBarbados":"AST / Barbados / Atlantic Standard Time","timeConf.tzBlanc_Sablon":"AST / Blanc-Sablon / Atlantic Standard Time","timeConf.tzCuracao":"AST / Curacao / Atlantic Standard Time","timeConf.tzDominica":"AST / Dominica / Atlantic Standard Time","timeConf.tzGlace_Bay":"AST / Glace_Bay / Atlantic Standard Time","timeConf.tzGlace_BaySummer":"ADT / Glace_Bay / Atlantic Daylight Saving Time","timeConf.tzGoose_Bay":"AST / Goose_Bay / Atlantic Standard Time","timeConf.tzGoose_BaySummer":"ADT / Goose_Bay / Atlantic Daylight Saving Time","timeConf.tzGrenada":"AST / Grenada / Atlantic Standard Time","timeConf.tzGuadeloupe":"AST / Guadeloupe / Atlantic Standard Time","timeConf.tzHalifax":"AST / Halifax / Atlantic Standard Time","timeConf.tzHalifaxSummer":"ADT / Halifax / Atlantic Daylight Saving Time","timeConf.tzMarigot":"AST / Marigot / Atlantic Standard Time","timeConf.tzMartinique":"AST / Martinique / Atlantic Standard Time","timeConf.tzMoncton":"AST / Moncton / Atlantic Standard Time","timeConf.tzMonctonSummer":"ADT / Moncton / Atlantic Daylight Saving Time","timeConf.tzMontserrat":"AST / Montserrat / Atlantic Standard Time","timeConf.tzPuerto_Rico":"AST / Puerto_Rico / Atlantic Standard Time","timeConf.tzSt_Kitts":"AST / St_Kitts / Atlantic Standard Time","timeConf.tzSt_Lucia":"AST / St_Lucia / Atlantic Standard Time","timeConf.tzSt_Thomas":"AST / St_Thomas / Atlantic Standard Time","timeConf.tzSt_Vincent":"AST / St_Vincent / Atlantic Standard Time","timeConf.tzThule":"AST / Thule / Atlantic Standard Time","timeConf.tzThuleSummer":"ADT / Thule / Atlantic Daylight Saving Time","timeConf.tzTortola":"AST / Tortola / Atlantic Standard Time","timeConf.tzLa_Paz":"BOT / La_Paz / Bolivia Time","timeConf.tzSantiago":"CLT / Santiago / Chile time","timeConf.tzSantiagoSummer":"CLST / Santiago / Chile Daylight Saving Time","timeConf.tzGuyana":"GYT / Guyana / Guyana Time","timeConf.tzAsuncion":"PYT / Asuncion / Paraguay time","timeConf.tzAsuncionSummer":"PYST / Asuncion / Paraguay Daylight Saving Time","timeConf.tzSt_Johns":"NST / St_Johns / Newfoundland Time","timeConf.tzSt_JohnsSummer":"NDT / St_Johns / Newfoundland Daylight Saving Time","timeConf.tzBuenos_Aires":"ART / Buenos_Aires / Argentina time","timeConf.tzCatamarca":"ART / Catamarca / Argentina time","timeConf.tzCordoba":"ART / Cordoba / Argentina time","timeConf.tzJujuy":"ART / Jujuy / Argentina time","timeConf.tzMendoza":"ART / Mendoza / Argentina time","timeConf.tzAraguaina":"BRT / Araguaina / Brasilia Time","timeConf.tzBahia":"BRT / Bahia / Brasilia Time","timeConf.tzBelem":"BRT / Belem / Brasilia Time","timeConf.tzFortaleza":"BRT / Fortaleza / Brasilia Time","timeConf.tzMaceio":"BRT / Maceio / Brasilia Time","timeConf.tzRecife":"BRT / Recife / Brasilia Time","timeConf.tzSantarem":"BRT / Santarem / Brasilia Time","timeConf.tzSao_Paulo":"BRT / Sao_Paulo / Brasilia Time","timeConf.tzSao_PauloSummer":"BRST / Sao_Paulo / Brasilia Daylight Saving Time","timeConf.tzCayenne":"GFT / Cayenne / French Guiana Time","timeConf.tzMiquelon":"PMST / Miquelon / Saint Pierre Miquelon Standard Time","timeConf.tzMiquelonSummer":"PMDT / Miquelon / Saint Pierre Miquelon Daylight Saving Time","timeConf.tzParamaribo":"SRT / Paramaribo / Suriname Time","timeConf.tzMontevido":"UYT / Montevido / Uruguay time","timeConf.tzMontevidoSummer":"UYST / Montevido / Uruguay Daylight Saving Time","timeConf.tzGodthab":"WGT / Godthab / West Greenland Time","timeConf.tzGodthabSummer":"WGST / Godthab / West Greenland Daylight Saving Time","timeConf.tzNoronha":"FNT / Noronha / Fernando de Noronha Time","timeConf.tzScoresbysund":"EGT / Scoresbysund / East Greenland Time","timeConf.tzScoresbysundSummer":"EGST / Scoresbysund / East Greenland Daylight Saving Time","timeConf.tzDanmarkshavn":"GMT / Danmarkshavn / Greenwich Mean Time","timeConf.tzPalmerStation":"CLT / Palmer Station / Chile time","timeConf.tzPalmerStationSummer":"CLST / Palmer Station / Chile Daylight Saving Time","timeConf.tzRotheraResearchStation":"ROTT / Rothera Research Station / Rosella Time","timeConf.tzShowaStation":"SYOT / Showa Station / Showa Time","timeConf.tzMawsonStation":"MAWT / Mawson Station / Mawson Time","timeConf.tzVostokStation":"VOST / Vostok Station / Vostok Time","timeConf.tzDavisStation":"DAVT / Davis Station / Davis Time","timeConf.tzCaseyStation":"AWST / Casey Station / Australia West Standard Time","timeConf.tzMcMurdoStation":"NZST / McMurdo Station / New Zealand Standard Time","timeConf.tzMcMurdoStationSummer":"NZDT / McMurdo Station / New Zealand Daylight Saving Time","timeConf.tzLongyearbyen":"CET / Longyearbyen / Central European Time","timeConf.tzLongyearbyenSummer":"CEST / Longyearbyen / Central European Summer Time","timeConf.tzAmman":"EET / Amman / Eastern European Time","timeConf.tzAmmanSummer":"EEST / Amman / Eastern European Daylight Saving Time","timeConf.tzBeirut":"EET / Beirut / Eastern European Time","timeConf.tzBeirutSummer":"EEST / Beirut / Eastern European Daylight Saving Time","timeConf.tzDamascus":"EET / Damascus / Eastern European Time","timeConf.tzDamascusSummer":"EEST / Damascus / Eastern European Daylight Saving Time","timeConf.tzGaza":"EET / Gaza / Eastern European Time","timeConf.tzNicosia":"EET / Nicosia / Eastern European Time","timeConf.tzNicosiaSummer":"EEST / Nicosia / Eastern European Daylight Saving Time","timeConf.tzJerusalem":"IST / Jerusalem / Israel Standard Time","timeConf.tzAden":"AST / Aden / Arabic Standard Time","timeConf.tzBaghdad":"AST / Baghdad / Arabic Standard Time","timeConf.tzBahrain":"AST / Bahrain / Arabic Standard Time","timeConf.tzKuwait":"AST / Kuwait / Arabic Standard Time","timeConf.tzQatar":"AST / Qatar / Arabic Standard Time","timeConf.tzRiyadh":"AST / Riyadh / Arabic Standard Time","timeConf.tzTehran":"IRST / Tehran / Iran Standard Time","timeConf.tzYerevan":"AMT / Yerevan / Armenia time","timeConf.tzYerevanSummer":"AMST / Yerevan / Armenian Daylight Saving Time","timeConf.tzBaku":"AZT / Baku / Azerbaijan time","timeConf.tzBakuSummer":"AZST / Baku / Azerbaijan Daylight Saving Time","timeConf.tzTbilisi":"GET / Tbilisi / Georgian time","timeConf.tzDubai":"GST / Dubai / (Persian) Gulf Standard Time","timeConf.tzMuscat":"GST / Muscat / (Persian) Gulf Standard Time","timeConf.tzKabul":"AFT / Kabul / Afghanistan time","timeConf.tzKarachi":"PKT / Karachi / Pakistan Time","timeConf.tzDushanbe":"TJT / Dushanbe / Tajikistan time","timeConf.tzAshgabat":"TMT / Ashgabat / Turkmenian time","timeConf.tzSamarkand":"UZT / Samarkand / Uzbekistan time","timeConf.tzTashkent":"UZT / Tashkent / Uzbekistan time","timeConf.tzAqtau":"WKST / Aqtau / West Kazakhstan Standard Time","timeConf.tzAqtobe":"WKST / Aqtobe / West Kazakhstan Standard Time","timeConf.tzOral":"WKST / Oral / West Kazakhstan Standard Time","timeConf.tzYekaterinbufg":"YEKT / Yekaterinbufg / Yekaterinburg time","timeConf.tzYekaterinbufgSummer":"YEKST / Yekaterinbufg / Yekaterinburg Daylight Saving Time","timeConf.tzCalcutta":"IST / Calcutta / India Standard Time","timeConf.tzColombo":"IST / Colombo / India Standard Time","timeConf.tzKatmandu":"NPT / Katmandu / Nepal Time","timeConf.tzDhaka":"BDT / Dhaka / Bangladesh Time","timeConf.tzThimphu":"BTT / Thimphu / Bhutan Time","timeConf.tzAlmaty":"EKST / Almaty / East Kazakhstan Standard Time","timeConf.tzQyzylorda":"EKST / Qyzylorda / East Kazakhstan Standard Time","timeConf.tzBishkek":"KGT / Bishkek / Kyrgyz Time","timeConf.tzNovosibirsk":"NOVT / Novosibirsk / Novosibilux time","timeConf.tzNovosibirskSummer":"NOVST / Novosibirsk / Novosibirks Daylight Saving Time","timeConf.tzOmsk":"OMST / Omsk / Omsk time","timeConf.tzOmskSummer":"OMSST / Omsk / Omsk Daylight Saving Time","timeConf.tzRangoon":"MMT / Rangoon / Myanmar time","timeConf.tzHovd":"HOVT / Hovd / Hovd Time","timeConf.tzBangkok":"ICT / Bangkok / Indochina Time","timeConf.tzPhnom_Penh":"ICT / Phnom_Penh / Indochina Time","timeConf.tzSaigon":"ICT / Saigon / Indochina Time","timeConf.tzVientiane":"ICT / Vientiane / Indochina Time","timeConf.tzKrasnoyarsk":"KRAT / Krasnoyarsk / Krasnoyarsk time","timeConf.tzKrasnoyarskSummer":"KRAST / Krasnoyarsk / Krasnoyarsk Daylight Saving Time","timeConf.tzJakarta":"WIT / Jakarta / West Indonesia Time","timeConf.tzPontianak":"WIT / Pontianak / West Indonesia Time","timeConf.tzBrunei":"BNT / Brunei / Brunei Darussalam Time","timeConf.tzChoibalsan":"CHOT / Choibalsan / Choibalsan Time","timeConf.tzMakassar":"CIT / Makassar / Central Indonesia Time","timeConf.tzBeijing":"CST / Beijing / China Standard Time","timeConf.tzChongqing":"CST / Chongqing / China Standard Time","timeConf.tzHarbin":"CST / Harbin / China Standard Time","timeConf.tzKashgar":"CST / Kashgar / China Standard Time","timeConf.tzMacau":"CST / Macau / China Standard Time","timeConf.tzShanghai":"CST / Shanghai / China Standard Time","timeConf.tzTaipei":"CST / Taipei / Taipei Standard Time","timeConf.tzUrumqi":"CST / Urumqi / China Standard Time","timeConf.tzHong_Kong":"HKT / Hong_Kong / Hong Kong Time","timeConf.tzIrkutsk":"IRKT / Irkutsk / Irkutsk time","timeConf.tzIrkutskSummer":"IRKST / Irkutsk / Irkutsk Daylight Saving Time","timeConf.tzKuala_Lumpur":"MYT / Kuala_Lumpur / Malaysia time","timeConf.tzKuching":"MYT / Kuching / Malaysia time","timeConf.tzManila":"PHT / Manila / Philippines time","timeConf.tzSingapore":"SGT / Singapore / Singapore Standard Time","timeConf.tzUlaanbaatar":"ULAT / Ulaanbaatar / Ulaanbaatar time","timeConf.tzJayapura":"EIT / Jayapura / East Indonesia Time","timeConf.tzOsaka":"JST / Osaka / Japan standard time","timeConf.tzSapporo":"JST / Sapporo / Japan standard time","timeConf.tzTokyo":"JST / Tokyo / Japan standard time","timeConf.tzPyongyang":"KST / Pyongyang / Korea Standard Time","timeConf.tzSeoul":"KST / Seoul / Korea Standard Time","timeConf.tzDili":"TLT / Dili / East Timor Time","timeConf.tzYakutsk":"YAKT / Yakutsk / Yakutsk time","timeConf.tzYakutskSummer":"YAKST / Yakutsk / Yakutsk Daylight Saving Time","timeConf.tzSakhalin":"SAKT / Sakhalin / Sakhalin time","timeConf.tzSakhalinSummer":"SAKST / Sakhalin / Sakhalin Daylight Saving Time","timeConf.tzVladivostok":"VLAT / Vladivostok / Vladivostok time","timeConf.tzVladivostokSummer":"VLAST / Vladivostok / Vladivostok Daylight Saving Time","timeConf.tzAnadyr":"MAGT / Anadyr / Magadan Time","timeConf.tzAnadyrSummer":"MAGST / Anadyr / Magadan Daylight Saving Time","timeConf.tzKamchatka":"MAGT / Kamchatka / Magadan Time","timeConf.tzKamchatkaSummer":"MAGST / Kamchatka / Magadan Daylight Saving Time","timeConf.tzMagadan":"MAGT / Magadan / Magadan Time","timeConf.tzMagadanSummer":"MAGST / Magadan / Magadan Daylight Saving Time","timeConf.tzBermuda":"AST / Bermuda / Atlantic Standard Time","timeConf.tzBermudaSummer":"ADT / Bermuda / Atlantic Daylight Time","timeConf.tzStanley":"FKT / Stanley / Falkland islands time","timeConf.tzStanleySummer":"FSKT / Stanley / Falkland Islands Daylight Time","timeConf.tzAzores":"AZOT / Azores / Azores time","timeConf.tzAzoresSummer":"AZOST / Azores / Azores Daylight Time","timeConf.tzCape_Verde":"CVT / Cape_Verde / Cape_Verde Time","timeConf.tzReykjavik":"GMT / Reykjavik / Greenwich Mean Time","timeConf.tzSt_Helena":"GMT / St_Helena / Greenwich Mean Time","timeConf.tzCanary":"WET / Canary / Western European time","timeConf.tzCanarySummer":"WEST / Canary / Western European Summer Time","timeConf.tzFaeroe":"WET / Faeroe / Western European time","timeConf.tzFaeroeSummer":"WEST / Faeroe / Western European Summer Time","timeConf.tzMadeira":"WET / Madeira / Western European time","timeConf.tzMadeiraSummer":"WEST / Madeira / Western European Summer Time","timeConf.tzPerth":"AWST / Perth / Australia West Standard Time","timeConf.tzEucla":"ACWST / Eucla / Australian Midwest Standard Time","timeConf.tzAdelaide":"ACST / Adelaide / Australia Central Standard Time","timeConf.tzAdelaideSummer":"ACDT / Adelaide / Australia Central Daylight Time","timeConf.tzDarwin":"ACST / Darwin / Australia Central Standard Time","timeConf.tzBrisbane":"AEST / Brisbane / Australian Eastern Standard Time","timeConf.tzCurrie":"AEST / Currie / Australian Eastern Standard Time","timeConf.tzCurrieSummer":"AEDT / Currie / Australian Eastern Daylight Time","timeConf.tzHobart":"AEST / Hobart / Australian Eastern Standard Time","timeConf.tzHobartSummer":"AEDT / Hobart / Australian Eastern Daylight Time","timeConf.tzLindeman":"AEST / Lindeman / Australian Eastern Standard Time","timeConf.tzMelbourne":"AEST / Melbourne / Australian Eastern Standard Time","timeConf.tzMelbourneSummer":"AEDT / Melbourne / Australian Eastern Daylight Time","timeConf.tzSydney":"AEST / Sydney / Australian Eastern Standard Time","timeConf.tzSydneySummer":"AEDT / Sydney / Australian Eastern Daylight Time","timeConf.tzLord_Howe":"LHST / Lord_Howe / Lord Howe Standard Time","timeConf.tzLord_HoweSummer":"LHDT / Lord_Howe / Lord Howe Daylight Saving Time","timeConf.tzDublin":"GMT / Dublin / Greenwich Mean Time","timeConf.tzGuernsey":"GMT / Guernsey / Greenwich Mean Time","timeConf.tzIsle_of_Man":"GMT / Isle_of_Man / Greenwich Mean Time","timeConf.tzJersey":"GMT / Jersey / Greenwich Mean Time","timeConf.tzLondon":"GMT / London / Greenwich Mean Time","timeConf.tzLisbon":"WET / Lisbon / Western European Time","timeConf.tzLisbonSummer":"WEST / Lisbon / Western European Summer Time","timeConf.tzAmsterdam":"CET / Amsterdam / Central European Time","timeConf.tzAmsterdamSummer":"CEST / Amsterdam / Central European Summer Time","timeConf.tzAndorra":"CET / Andorra / Central European Time","timeConf.tzAndorraSummer":"CEST / Andorra / Central European Summer Time","timeConf.tzBelgrade":"CET / Belgrade / Central European Time","timeConf.tzBelgradeSummer":"CEST / Belgrade / Central European Summer Time","timeConf.tzBerlin":"CET / Berlin / Central European Time","timeConf.tzBerlinSummer":"CEST / Berlin / Central European Summer Time","timeConf.tzBratislava":"CET / Bratislava / Central European Time","timeConf.tzBratislavaSummer":"CEST / Bratislava / Central European Summer Time","timeConf.tzBrussels":"CET / Brussels / Central European Time","timeConf.tzBrusselsSummer":"CEST / Brussels / Central European Summer Time","timeConf.tzBudapest":"CET / Budapest / Central European Time","timeConf.tzBudapestSummer":"CEST / Budapest / Central European Summer Time","timeConf.tzCopenhagen":"CET / Copenhagen / Central European Time","timeConf.tzCopenhagenSummer":"CEST / Copenhagen / Central European Summer Time","timeConf.tzGibraltar":"CET / Gibraltar / Central European Time","timeConf.tzGibraltarSummer":"CEST / Gibraltar / Central European Summer Time","timeConf.tzLjubljana":"CET / Ljubljana / Central European Time","timeConf.tzLjubljanaSummer":"CEST / Ljubljana / Central European Summer Time","timeConf.tzLuxembourg":"CET / Luxembourg / Central European Time","timeConf.tzLuxembourgSummer":"CEST / Luxembourg / Central European Summer Time","timeConf.tzMadrid":"CET / Madrid / Central European Time","timeConf.tzMadridSummer":"CEST / Madrid / Central European Summer Time","timeConf.tzMalta":"CET / Malta / Central European Time","timeConf.tzMaltaSummer":"CEST / Malta / Central European Summer Time","timeConf.tzMonaco":"CET / Monaco / Central European Time","timeConf.tzMonacoSummer":"CEST / Monaco / Central European Summer Time","timeConf.tzOslo":"CET / Oslo / Central European Time","timeConf.tzOsloSummer":"CEST / Oslo / Central European Summer Time","timeConf.tzParis":"CET / Paris / Central European Time","timeConf.tzParisSummer":"CEST / Paris / Central European Summer Time","timeConf.tzPodgorica":"CET / Podgorica / Central European Time","timeConf.tzPodgoricaSummer":"CEST / Podgorica / Central European Summer Time","timeConf.tzPrague":"CET / Prague / Central European Time","timeConf.tzPragueSummer":"CEST / Prague / Central European Summer Time","timeConf.tzRome":"CET / Rome / Central European Time","timeConf.tzRomeSummer":"CEST / Rome / Central European Summer Time","timeConf.tzSan_Marino":"CET / San_Marino / Central European Time","timeConf.tzSan_MarinoSummer":"CEST / San_Marino / Central European Summer Time","timeConf.tzSarajevo":"CET / Sarajevo / Central European Time","timeConf.tzSarajevoSummer":"CEST / Sarajevo / Central European Summer Time","timeConf.tzSkopje":"CET / Skopje / Central European Time","timeConf.tzSkopjeSummer":"CEST / Skopje / Central European Summer Time","timeConf.tzStockholm":"CET / Stockholm / Central European Time","timeConf.tzStockholmSummer":"CEST / Stockholm / Central European Summer Time","timeConf.tzTirane":"CET / Tirane / Central European Time","timeConf.tzTiraneSummer":"CEST / Tirane / Central European Summer Time","timeConf.tzVaduz":"CET / Vaduz / Central European Time","timeConf.tzVaduzSummer":"CEST / Vaduz / Central European Summer Time","timeConf.tzVatican":"CET / Vatican / Central European Time","timeConf.tzVaticanSummer":"CEST / Vatican / Central European Summer Time","timeConf.tzVienna":"CET / Vienna / Central European Time","timeConf.tzViennaSummer":"CEST / Vienna / Central European Summer Time","timeConf.tzWarsaw":"CET / Warsaw / Central European Time","timeConf.tzWarsawSummer":"CEST / Warsaw / Central European Summer Time","timeConf.tzZagreb":"CET / Zagreb / Central European Time","timeConf.tzZagrebSummer":"CEST / Zagreb / Central European Summer Time","timeConf.tzZurich":"CET / Zurich / Central European Time","timeConf.tzZurichSummer":"CEST / Zurich / Central European Summer Time","timeConf.tzAthens":"EET / Athens / Eastern European Time","timeConf.tzAthensSummer":"EEST / Athens / Eastern European Daylight Saving Time","timeConf.tzBucharest":"EET / Bucharest / Eastern European Time","timeConf.tzBucharestSummer":"EEST / Bucharest / Eastern European Daylight Saving Time","timeConf.tzChisinau":"EET / Chisinau / Eastern European Time","timeConf.tzChisinauSummer":"EEST / Chisinau / Eastern European Daylight Saving Time","timeConf.tzHelsinki":"EET / Helsinki / Eastern European Time","timeConf.tzHelsinkiSummer":"EEST / Helsinki / Eastern European Daylight Saving Time","timeConf.tzIstanbul":"EET / Istanbul / Eastern European Time","timeConf.tzIstanbulSummer":"EEST / Istanbul / Eastern European Daylight Saving Time","timeConf.tzKaliningrad":"EET / Kaliningrad / Eastern European Time","timeConf.tzKaliningradSummer":"EEST / Kaliningrad / Eastern European Daylight Saving Time","timeConf.tzKiev":"EET / Kiev / Eastern European Time","timeConf.tzKievSummer":"EEST / Kiev / Eastern European Daylight Saving Time","timeConf.tzMariehamn":"EET / Mariehamn / Eastern European Time","timeConf.tzMariehamnSummer":"EEST / Mariehamn / Eastern European Daylight Saving Time","timeConf.tzMinsk":"EET / Minsk / Eastern European Time","timeConf.tzMinskSummer":"EEST / Minsk / Eastern European Daylight Saving Time","timeConf.tzRiga":"EET / Riga / Eastern European Time","timeConf.tzRigaSummer":"EEST / Riga / Eastern European Daylight Saving Time","timeConf.tzSimferopol":"EET / Simferopol / Eastern European Time","timeConf.tzSimferopolSummer":"EEST / Simferopol / Eastern European Daylight Saving Time","timeConf.tzSofia":"EET / Sofia / Eastern European Time","timeConf.tzSofiaSummer":"EEST / Sofia / Eastern European Daylight Saving Time","timeConf.tzTallinn":"EET / Tallinn / Eastern European Time","timeConf.tzTallinnSummer":"EEST / Tallinn / Eastern European Daylight Saving Time","timeConf.tzUzhgorod":"EET / Uzhgorod / Eastern European Time","timeConf.tzUzhgorodSummer":"EEST / Uzhgorod / Eastern European Daylight Saving Time","timeConf.tzVilnius":"EET / Vilnius / Eastern European Time","timeConf.tzVilniusSummer":"EEST / Vilnius / Eastern European Daylight Saving Time","timeConf.tzZaporozhye":"EET / Zaporozhye / Eastern European Time","timeConf.tzZaporozhyeSummer":"EEST / Zaporozhye / Eastern European Daylight Saving Time","timeConf.tzMoscow":"MSK / Moscow / Moscow Standard Time","timeConf.tzMoscowSummer":"MSKS / Moscow / Moscow Daylight Saving Time","timeConf.tzSamara":"MSK / Samara / Moscow Standard Time","timeConf.tzSamaraSummer":"MSKS / Samara / Moscow Daylight Saving Time","timeConf.tzVolgograd":"VOLT / Volgograd / Volgograd time","timeConf.tzVolgogradSummer":"VOLST / Volgograd / Volgograd Daylight Saving Time","timeConf.tzAntananarivo":"EAT / Antananarivo / East africa time","timeConf.tzComoro":"EAT / Comoro / East africa time","timeConf.tzMayotte":"EAT / Mayotte / East africa time","timeConf.tzMauritius":"MUT / Mauritius / Mauritius time","timeConf.tzReunion":"RET / Reunion / Reunion time","timeConf.tzMahe":"SCT / Mahe / Seychelles time","timeConf.tzMaldives":"MVT / Maldives / Maldives time","timeConf.tzKerguelen":"TFT / Kerguelen / French South Territory Time","timeConf.tzChagos":"IOT / Chagos / Indian Ocean Time","timeConf.tzCocos":"CCT / Cocos / Cocos island time","timeConf.tzChristmas":"CXT / Christmas / Christmas island time","timeConf.tzNiue":"NUT / Niue / Niue Time","timeConf.tzApia":"SST / Apia / Samoa Standard Time","timeConf.tzMidway":"SST / Midway / Samoa Standard Time","timeConf.tzPago_pago":"SST / Pago_pago / Samoa Standard Time","timeConf.tzRarotonga":"CKT / Rarotonga / Cook Islands Time","timeConf.tzHonolulu":"HST / Honolulu / Hawaii Aleutian Standard Time","timeConf.tzJohnston":"HST / Johnston / Hawaii Aleutian Standard Time","timeConf.tzTahiti":"TAHT / Tahiti / Tahiti Time","timeConf.tzFakaofo":"TKT / Fakaofo / Tokelau Time","timeConf.tzMarquesas":"MART / Marquesas / Marquise Time","timeConf.tzGambier":"GAMT / Gambier / Gambia time","timeConf.tzPitcairn":"PNT / Pitcairn / Pitcairn Time","timeConf.tzEaster":"EAST / Easter / Easter Island Time","timeConf.tzEasterSummer":"EASST / Easter / Easter Island Daylight Saving Time","timeConf.tzGalapagos":"GALT / Galapagos / Galapagos Time","timeConf.tzPalau":"PWT / Palau / Palau Time","timeConf.tzGuam":"CHST / Guam / Chamorro Standard Time","timeConf.tzSaipan":"CHST / Saipan / Chamorro Standard Time","timeConf.tzTruk":"CHUT / Truk / Chuuk Time","timeConf.tzPort_Moresby":"PGT / Port_Moresby / Papua New Guinea Time","timeConf.tzKosrae":"KOST / Kosrae / Kosrae Time","timeConf.tzNoumea":"NCT / Noumea / New Caledonia Time","timeConf.tzPonape":"PONT / Ponape / Pompeii (Ponape) time","timeConf.tzGuadalcanal":"SBT / Guadalcanal / Solomon Islands Time","timeConf.tzEfate":"VUT / Efate / Vanuatu Time","timeConf.tzNorfolk":"NFT / Norfolk / Norfolk Islands Time","timeConf.tzFiji":"FJT / Fiji / Fiji Time","timeConf.tzTarawa":"GILT / Tarawa / Gilbert Islands Time","timeConf.tzKwajalein":"MHT / Kwajalein / Marshall Islands Time","timeConf.tzMajuro":"MHT / Majuro / Marshall Islands Time","timeConf.tzNauru":"NRT / Nauru / Nauru Time","timeConf.tzAuckland":"NZST / Auckland / New Zealand Standard Time","timeConf.tzAucklandSummer":"NZDT / Auckland / New Zealand Daylight Saving Time","timeConf.tzFunafuti":"TVT / Funafuti / Tuvalu Time","timeConf.tzWake":"WAKT / Wake / Wake Island Time","timeConf.tzWallis":"WFT / Wallis / Wallis and Futuna Time","timeConf.tzEnderbury":"PHOT / Enderbury / Phoenix Islands Time","timeConf.tzTongatapu":"TOT / Tongatapu / Tonga Time","timeConf.tzKiritimati":"LINT / Kiritimati / Line Islands Time","timeConf.tzGMTm1200":"GMT-12:00","timeConf.tzGMTm1100":"GMT-11:00","timeConf.tzGMTm1000":"GMT-10:00","timeConf.tzGMTm0930":"GMT-9:30","timeConf.tzGMTm0900":"GMT-9:00","timeConf.tzGMTm0800":"GMT-8:00","timeConf.tzGMTm0700":"GMT-7:00","timeConf.tzGMTm0600":"GMT-6:00","timeConf.tzGMTm0500":"GMT-5:00","timeConf.tzGMTm0400":"GMT-4:00","timeConf.tzGMTm0330":"GMT-3:30","timeConf.tzGMTm0300":"GMT-3:00","timeConf.tzGMTm0200":"GMT-2:00","timeConf.tzGMTm0100":"GMT-1:00","timeConf.tzGMTp0000":"GMT","timeConf.tzGMTp0100":"GMT+1:00","timeConf.tzGMTp0200":"GMT+2:00","timeConf.tzGMTp0300":"GMT+3:00","timeConf.tzGMTp0330":"GMT+3:30","timeConf.tzGMTp0400":"GMT+4:00","timeConf.tzGMTp0430":"GMT+4:30","timeConf.tzGMTp0500":"GMT+5:00","timeConf.tzGMTp0530":"GMT+5:30","timeConf.tzGMTp0545":"GMT+5:45","timeConf.tzGMTp0600":"GMT+6:00","timeConf.tzGMTp0630":"GMT+6:30","timeConf.tzGMTp0700":"GMT+7:00","timeConf.tzGMTp0800":"GMT+8:00","timeConf.tzGMTp0830":"GMT+8:30","timeConf.tzGMTp0845":"GMT+8:45","timeConf.tzGMTp0900":"GMT+9:00","timeConf.tzGMTp0930":"GMT+9:30","timeConf.tzGMTp1000":"GMT+10:00","timeConf.tzGMTp1030":"GMT+10:30","timeConf.tzGMTp1100":"GMT+11:00","timeConf.tzGMTp1200":"GMT+12:00","timeConf.tzGMTp1245":"GMT+12:45","timeConf.tzGMTp1300":"GMT+13:00","timeConf.tzGMTp1400":"GMT+14:00"}');

/***/ }),

/***/ "./src/locales/ja/menu.json":
/*!**********************************!*\
  !*** ./src/locales/ja/menu.json ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"main.dashbord":"ダッシュボード","timeConf.timezoneKey":"タイムゾーン","timeConf.tzTopKey":"選択してください","wifiConf.stationListTopKey":"WiFiStation 設定消去","key":"世界よこんにちは!","key2":"しあわせ?"}');

/***/ }),

/***/ "./src/locales/ja/tzlang.json":
/*!************************************!*\
  !*** ./src/locales/ja/tzlang.json ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"timeConf.tzAreaAfrica":"アフリカ","timeConf.tzAreaAmerica":"アメリカ-北、中央、および南","timeConf.tzAreaAntarctica":"南極","timeConf.tzAreaArctic":"北極","timeConf.tzAreaAsia":"アジア","timeConf.tzAreaAtlantic":"大西洋","timeConf.tzAreaAustralia":"オーストラリア","timeConf.tzAreaEurope":"ヨーロッパ","timeConf.tzAreaIndian":"インド洋","timeConf.tzAreaPacific":"太平洋","timeConf.tzAreaGMT":"GMT基準","timeConf.tzAbidjan":"GMT / アビジャン / グリニッジ標準時間","timeConf.tzAccra":"GMT / アクラ / グリニッジ標準時間","timeConf.tzBamako":"GMT / バマコ / グリニッジ標準時間","timeConf.tzBanjul":"GMT / バンジュール / グリニッジ標準時間","timeConf.tzBissau":"GMT / ビサウ / グリニッジ標準時間","timeConf.tzConakry":"GMT / コナクリ / グリニッジ標準時間","timeConf.tzDakar":"GMT / ダカール / グリニッジ標準時間","timeConf.tzFreetown":"GMT / フリータウン / グリニッジ標準時間","timeConf.tzLome":"GMT / ロメ / グリニッジ標準時間","timeConf.tzMonrovia":"GMT / モンロビア / グリニッジ標準時間","timeConf.tzNouakchott":"GMT / ヌアクショット / グリニッジ標準時間","timeConf.tzOuagadougou":"GMT / ワガドゥグー / グリニッジ標準時間","timeConf.tzSao_Tome":"GMT / サントメ / グリニッジ標準時間","timeConf.tzCasablanca":"WET / カサブランカ / 西ヨーロッパ時間","timeConf.tzEl_Aaiun":"WET / アイウン / 西ヨーロッパ時間","timeConf.tzAlgiers":"CET / アルジェ / 中央ヨーロッパ時間","timeConf.tzCeuta":"CET / セウタ / 中央ヨーロッパ時間","timeConf.tzCeutaSummer":"CEST / セウタ / 中央ヨーロッパ夏時間","timeConf.tzTunis":"CET / チュニス / 中央ヨーロッパ時間","timeConf.tzBangui":"WAT / バンギ / 西アフリカ時間","timeConf.tzBrazzaville":"WAT / ブラザヴィル / 西アフリカ時間","timeConf.tzDouala":"WAT / ドゥアラ / 西アフリカ時間","timeConf.tzKinshasa":"WAT / キンシャサ / 西アフリカ時間","timeConf.tzLagos":"WAT / ラゴス / 西アフリカ時間","timeConf.tzLibreville":"WAT / リーブルヴィル / 西アフリカ時間","timeConf.tzLuanda":"WAT / ルアンダ / 西アフリカ時間","timeConf.tzMalabo":"WAT / マラボ / 西アフリカ時間","timeConf.tzNdjamena":"WAT / ンジャメナ / 西アフリカ時間","timeConf.tzNiamey":"WAT / ニアメ / 西アフリカ時間","timeConf.tzPorto_Novo":"WAT / ポルトノヴォ / 西アフリカ時間","timeConf.tzWindhoek":"WAT / ウィントフック / 西アフリカ時間","timeConf.tzWindhoekSummer":"WAST / ウィントフック / 西アフリカ夏時間","timeConf.tzBlantyre":"CAT / ブランタイヤ / 中央アフリカ時間","timeConf.tzBujumbura":"CAT / ブジュンブラ / 中央アフリカ時間","timeConf.tzGaborone":"CAT / ハボローネ / 中央アフリカ時間","timeConf.tzHarare":"CAT / ハボローネ / 中央アフリカ時間","timeConf.tzKigali":"CAT / キガリ / 中央アフリカ時間","timeConf.tzLubumbashi":"CAT / ルブンバシ / 中央アフリカ時間","timeConf.tzLusaka":"CAT / ルサカ / 中央アフリカ時間","timeConf.tzMaputo":"CAT / マプト / 中央アフリカ時間","timeConf.tzCairo":"EET / マプト / 東ヨーロッパ時間","timeConf.tzTripoli":"EET / マプト / 東ヨーロッパ時間","timeConf.tzJohannesburg":"SAST / ヨハネスブルグ / 南アフリカ標準時間","timeConf.tzMaseru":"SAST / マセル / 南アフリカ標準時間","timeConf.tzMbabane":"SAST / ムババーネ / 南アフリカ標準時間","timeConf.tzAddis_Ababa":"EAT / アディスアベバ / 東アフリカ時間","timeConf.tzAsmera":"EAT / アスマラ / 東アフリカ時間","timeConf.tzDar_es_Salaam":"EAT / ダルエスサラーム / 東アフリカ時間","timeConf.tzDjibouti":"EAT / ジブチ / 東アフリカ時間","timeConf.tzKampala":"EAT / カンパラ / 東アフリカ時間","timeConf.tzKhartoum":"EAT / ハルツーム / 東アフリカ時間","timeConf.tzMogadishu":"EAT / モガディシュ / 東アフリカ時間","timeConf.tzNairobi":"EAT / モガディシュ / 東アフリカ時間","timeConf.tzAdak":"HST / アダック島 / ハワイ・アリューシャン標準時間","timeConf.tzAnchorage":"AKST / アンカレッジ / アラスカ標準時間","timeConf.tzAnchorageSummer":"AKDT / アンカレッジ / アラスカ夏時間","timeConf.tzJuneau":"AKST / ジュノー / アラスカ標準時間","timeConf.tzJuneauSummer":"AKDT / ジュノー / アラスカ夏時間","timeConf.tzNome":"AKST / ノーム / アラスカ標準時間","timeConf.tzNomeSummer":"AKDT / ノーム / アラスカ夏時間","timeConf.tzYakutat":"AKST / ヤクタト / アラスカ標準時間","timeConf.tzYakutatSummer":"AKDT / ヤクタト / アラスカ夏時間","timeConf.tzDawson":"PST / ドーソン / 太平洋標準時間","timeConf.tzDawsonSummer":"PDT / ドーソン / 太平洋夏時間","timeConf.tzLos_Angeles":"PST / ロサンゼルス / 太平洋標準時間","timeConf.tzLos_AngelesSummer":"PDT / ロサンゼルス / 太平洋夏時間","timeConf.tzTijuana":"PST / ティフアナ / 太平洋標準時間","timeConf.tzTijuanaSummer":"PDT / ティフアナ / 太平洋夏時間","timeConf.tzVancouver":"PST / バンクーバー / 太平洋標準時間","timeConf.tzVancouverSummer":"PDT / バンクーバー / 太平洋夏時間","timeConf.tzWhitehorse":"PST / ホワイトホース / 太平洋標準時間","timeConf.tzWhitehorseSummer":"PDT / ホワイトホース / 太平洋夏時間","timeConf.tzBoise":"MST / ボイシ / 山岳部標準時間","timeConf.tzBoiseSummer":"MDT / ボイシ / 山岳部夏時間","timeConf.tzChihuahua":"MST / チワワ / 山岳部標準時間","timeConf.tzChihuahuaSummer":"MDT / チワワ / 山岳部夏時間","timeConf.tzDawson_Creek":"MST / ドーソン・クリーク / 山岳部標準時間","timeConf.tzDenver":"MST / デンバー / 山岳部標準時間","timeConf.tzDenverSummer":"MDT / デンバー / 山岳部夏時間","timeConf.tzEdmonton":"MST / エドモントン / 山岳部標準時間","timeConf.tzEdmontonSummer":"MDT / エドモントン / 山岳部夏時間","timeConf.tzHermosillo":"MST / エルモシージョ / 山岳部標準時間","timeConf.tzInuvik":"MST / イヌヴィック / 山岳部標準時間","timeConf.tzInuvikSummer":"MDT / イヌヴィック / 山岳部夏時間","timeConf.tzMazatlan":"MST / マサトラン / 山岳部標準時間","timeConf.tzMazatlanSummer":"MDT / マサトラン / 山岳部夏時間","timeConf.tzPhoenix":"MST / フェニックス / 山岳部標準時間","timeConf.tzShiprock":"MST / シップロック / 山岳部標準時間","timeConf.tzShiprockSummer":"MDT / シップロック / 山岳部夏時間","timeConf.tzYellowknife":"MST / イエローナイフ / 山岳部標準時間","timeConf.tzYellowknifeSummer":"MDT / イエローナイフ / 山岳部夏時間","timeConf.tzBelize":"CST / ベリーズ / 中部標準時間","timeConf.tzCancun":"CST / カンクン / 中部標準時間","timeConf.tzCancunSummer":"CDT / カンクン / 中部夏時間","timeConf.tzChicago":"CST / シカゴ / 中部標準時間","timeConf.tzChicagoSummer":"CDT / シカゴ / 中部夏時間","timeConf.tzCosta_Rica":"CST / コスタリカ / 中部標準時間","timeConf.tzEl_Salvador":"CST / エルサルバドル / 中部標準時間","timeConf.tzGuatemala":"CST / グアテマラ / 中部標準時間","timeConf.tzIndiana_Knox":"CST / インディアナ/ノックス / 中部標準時間","timeConf.tzIndiana_KnoxSummer":"CDT / インディアナ/ノックス / 中部夏時間","timeConf.tzManagua":"CST / マナグア / 中部標準時間","timeConf.tzMenominee":"CST / メノミニー / 中部標準時間","timeConf.tzMenomineeSummer":"CDT / メノミニー / 中部夏時間","timeConf.tzMerida":"CST / メリダ / 中部標準時間","timeConf.tzMeridaSummer":"CDT / メリダ / 中部夏時間","timeConf.tzMexico_City":"CST / メキシコシティ / 中部標準時間","timeConf.tzMexico_CitySummer":"CDT / メキシコシティ / 中部夏時間","timeConf.tzMonterrey":"CST / モンテレー / 中部標準時間","timeConf.tzMonterreySummer":"CDT / モンテレー / 中部夏時間","timeConf.tzRainy_River":"CST / レイニーリバー / 中部標準時間","timeConf.tzRainy_RiverSummer":"CDT / レイニーリバー / 中部夏時間","timeConf.tzRankin_Inlet":"CST / ランキンインレット / 中部標準時間","timeConf.tzRankin_InletSummer":"CDT / ランキンインレット / 中部夏時間","timeConf.tzRegina":"CST / レジャイナ / 中部標準時間","timeConf.tzTegucigalpa":"CST / テグシガルパ / 中部標準時間","timeConf.tzWinnipeg":"CST / ウィニペグ / 中部標準時間","timeConf.tzWinnipegSummer":"CDT / ウィニペグ / 中部夏時間","timeConf.tzBogota":"COT / ボゴタ / コロンビア時間","timeConf.tzHavana":"CST / ボゴタ / キューバ標準時間","timeConf.tzHavanaSummer":"CDT / ボゴタ / キューバ夏時間","timeConf.tzGuayaquil":"ECT / グアヤキル / エクアドル時間","timeConf.tzCayman":"EST / ケイマン諸島 / 東部標準時間","timeConf.tzDetroit":"EST / デトロイト / 東部標準時間","timeConf.tzDetroitSummer":"EDT / デトロイト / 東部夏時間","timeConf.tzGrand_Turk":"EST / グランドターク島 / 東部標準時間","timeConf.tzGrand_TurkSummer":"EDT / グランドターク島 / 東部夏時間","timeConf.tzIndianapolis":"EST / インディアナポリス / 東部標準時間","timeConf.tzIndianapolisSummer":"EDT / インディアナポリス / 東部夏時間","timeConf.tzIqaluit":"EST / イカルイト / 東部標準時間","timeConf.tzIqaluitSummer":"EDT / イカルイト / 東部夏時間","timeConf.tzJamaica":"EST / ジャマイカ / 東部標準時間","timeConf.tzLouisville":"EST / ルイビル / 東部標準時間","timeConf.tzLouisvilleSummer":"EDT / ルイビル / 東部夏時間","timeConf.tzMontreal":"EST / モントリオール / 東部標準時間","timeConf.tzMontrealSummer":"EDT / モントリオール / 東部夏時間","timeConf.tzNassau":"EST / ナッソー / 東部標準時間","timeConf.tzNassauSummer":"EDT / ナッソー / 東部夏時間","timeConf.tzNew_York":"EST / ニューヨーク / 東部標準時間","timeConf.tzNew_YorkSummer":"EDT / ニューヨーク / 東部夏時間","timeConf.tzNipigon":"EST / ニピゴン / 東部標準時間","timeConf.tzNipigonSummer":"EDT / ニピゴン / 東部夏時間","timeConf.tzPanama":"EST / パナマ / 東部標準時間","timeConf.tzPangnirtung":"EST / パングナータング / 東部標準時間","timeConf.tzPangnirtungSummer":"EDT / パングナータング / 東部夏時間","timeConf.tzResolute":"EST / リゾルト / 東部標準時間","timeConf.tzThunder_Bay":"EST / サンダー・ベイ / 東部標準時間","timeConf.tzThunder_BaySummer":"EDT / サンダー・ベイ / 東部夏時間","timeConf.tzToronto":"EST / トロント / 東部標準時間","timeConf.tzTorontoSummer":"EDT / トロント / 東部夏時間","timeConf.tzLima":"PET / ライマ / ペルー時間","timeConf.tzCaracas":"VET / カラカス / ベネズエラ時間","timeConf.tzBoa_Vista":"AMT / カラカス / アマゾン時間","timeConf.tzCampo_Grande":"AMT / カンポ・グランデ / アマゾン時間","timeConf.tzCampo_GrandeSummer":"AMST / カンポ・グランデ / アマゾン夏時間","timeConf.tzCuiaba":"AMT / クイアバ / アマゾン時間","timeConf.tzCuiabaSummer":"AMST / クイアバ / アマゾン夏時間","timeConf.tzEirunepe":"AMT / エイルネペ / アマゾン時間","timeConf.tzManaus":"AMT / エイルネペ / アマゾン時間","timeConf.tzPorto_Velho":"AMT / ポルト・ヴェーリョ / アマゾン時間","timeConf.tzRio_Branco":"AMT / リオブランコ / アマゾン時間","timeConf.tzAnguilla":"AST / アンギラ / アトランティック標準時間","timeConf.tzAntigua":"AST / アンティグア / アトランティック標準時間","timeConf.tzAruba":"AST / アルバ / アトランティック標準時間","timeConf.tzBarbados":"AST / バルバドス / アトランティック標準時間","timeConf.tzBlanc_Sablon":"AST / ブラン・サブロン / アトランティック標準時間","timeConf.tzCuracao":"AST / キュラソー / アトランティック標準時間","timeConf.tzDominica":"AST / キュラソー / アトランティック標準時間","timeConf.tzGlace_Bay":"AST / グレースベイ / アトランティック標準時間","timeConf.tzGlace_BaySummer":"ADT / グレースベイ / アトランティック夏時間","timeConf.tzGoose_Bay":"AST / グースベイ / アトランティック標準時間","timeConf.tzGoose_BaySummer":"ADT / グースベイ / アトランティック夏時間","timeConf.tzGrenada":"AST / グレナダ / アトランティック標準時間","timeConf.tzGuadeloupe":"AST / グアドループ / アトランティック標準時間","timeConf.tzHalifax":"AST / ハリファックス / アトランティック標準時間","timeConf.tzHalifaxSummer":"ADT / ハリファックス / アトランティック夏時間","timeConf.tzMarigot":"AST / マリゴ / アトランティック標準時間","timeConf.tzMartinique":"AST / マルティニーク / アトランティック標準時間","timeConf.tzMoncton":"AST / モンクトン / アトランティック標準時間","timeConf.tzMonctonSummer":"ADT / モンクトン / アトランティック夏時間","timeConf.tzMontserrat":"AST / モントセラト / アトランティック標準時間","timeConf.tzPuerto_Rico":"AST / プエルトリコ / アトランティック標準時間","timeConf.tzSt_Kitts":"AST / セント・クリストファー / アトランティック標準時間","timeConf.tzSt_Lucia":"AST / セント・ルシア / アトランティック標準時間","timeConf.tzSt_Thomas":"AST / セント・トーマス / アトランティック標準時間","timeConf.tzSt_Vincent":"AST / セント・ビンセント / アトランティック標準時間","timeConf.tzThule":"AST / チューレ / アトランティック標準時間","timeConf.tzThuleSummer":"ADT / チューレ / アトランティック夏時間","timeConf.tzTortola":"AST / トルトラ島 / アトランティック標準時間","timeConf.tzLa_Paz":"BOT / ラ・パス / ボリビア時間","timeConf.tzSantiago":"CLT / サンディエゴ / チリ時間","timeConf.tzSantiagoSummer":"CLST / サンディエゴ / チリ夏時間","timeConf.tzGuyana":"GYT / ギアナ / ガイアナ時間","timeConf.tzAsuncion":"PYT / アスンシオン / パラグアイ時間","timeConf.tzAsuncionSummer":"PYST / アスンシオン / パラグアイ夏時間","timeConf.tzSt_Johns":"NST / セント・ジョンズ / ニューファンドランド時間","timeConf.tzSt_JohnsSummer":"NDT / セント・ジョンズ / ニューファンドランド夏時間","timeConf.tzBuenos_Aires":"ART / ブエノスアイレス / アルゼンチン時間","timeConf.tzCatamarca":"ART / カタマルカ / アルゼンチン時間","timeConf.tzCordoba":"ART / コルドバ / アルゼンチン時間","timeConf.tzJujuy":"ART / フフイ / アルゼンチン時間","timeConf.tzMendoza":"ART / メンドーサ / アルゼンチン時間","timeConf.tzAraguaina":"BRT / アラグアイナ / ブラジリア時間","timeConf.tzBahia":"BRT / バイーア / ブラジリア時間","timeConf.tzBelem":"BRT / ベレン / ブラジリア時間","timeConf.tzFortaleza":"BRT / フォルタレザ / ブラジリア時間","timeConf.tzMaceio":"BRT / マセイオ / ブラジリア時間","timeConf.tzRecife":"BRT / レシフェ / ブラジリア時間","timeConf.tzSantarem":"BRT / サンタレン / ブラジリア時間","timeConf.tzSao_Paulo":"BRT / サンパウロ / ブラジリア時間","timeConf.tzSao_PauloSummer":"BRST / サンパウロ / ブラジリア夏時間","timeConf.tzCayenne":"GFT / シャイアン / フランス領ギアナ時間","timeConf.tzMiquelon":"PMST / ミクロン / サンピエール・ミクロン標準時間","timeConf.tzMiquelonSummer":"PMDT / ミクロン / サンピエール・ミクロン夏時間","timeConf.tzParamaribo":"SRT / パラマリボ / スリナム時間","timeConf.tzMontevido":"UYT / モンテビデオ / ウルグアイ時間","timeConf.tzMontevidoSummer":"UYST / モンテビデオ / ウルグアイ夏時間","timeConf.tzGodthab":"WGT / ゴッドタブ / 西グリーンランド時間","timeConf.tzGodthabSummer":"WGST / ゴッドタブ / 西グリーンランド夏時間","timeConf.tzNoronha":"FNT / ノローニャ / フェルナンド・デ・ノローニャ時間","timeConf.tzScoresbysund":"EGT / スコルズビスーン / 東グリーンランド時間","timeConf.tzScoresbysundSummer":"EGST / スコルズビスーン / 東グリーンランド夏時間","timeConf.tzDanmarkshavn":"GMT / デンマークシャウン / グリニッジ標準時間","timeConf.tzPalmerStation":"CLT / パーマー基地 / チリ時間","timeConf.tzPalmerStationSummer":"CLST / パーマー基地 / チリ夏時間","timeConf.tzRotheraResearchStation":"ROTT / ロゼラ研究基地 / ロゼラ時間","timeConf.tzShowaStation":"SYOT / 昭和基地 / 昭和時間","timeConf.tzMawsonStation":"MAWT / モーソン基地 / モーソン時間","timeConf.tzVostokStation":"VOST / ボストーク基地 / ボストーク時間","timeConf.tzDavisStation":"DAVT / デービス基地 / デービス時間","timeConf.tzCaseyStation":"AWST / ケーシー基地 / オーストラリア西標準時間","timeConf.tzMcMurdoStation":"NZST / マクマード基地 / ニュージーランド標準時間","timeConf.tzMcMurdoStationSummer":"NZDT / マクマード基地 / ニュージーランド夏時間","timeConf.tzLongyearbyen":"CET / ロングイェールビーン / 中央ヨーロッパ時間","timeConf.tzLongyearbyenSummer":"CEST / ロングイェールビーン / 中央ヨーロッパ夏時間","timeConf.tzAmman":"EET / アンマン / 東ヨーロッパ時間","timeConf.tzAmmanSummer":"EEST / アンマン / 東ヨーロッパ夏時間","timeConf.tzBeirut":"EET / ベイルート / 東ヨーロッパ時間","timeConf.tzBeirutSummer":"EEST / ベイルート / 東ヨーロッパ夏時間","timeConf.tzDamascus":"EET / ダマスカス / 東ヨーロッパ時間","timeConf.tzDamascusSummer":"EEST / ダマスカス / 東ヨーロッパ夏時間","timeConf.tzGaza":"EET / ガザ / 東ヨーロッパ時間","timeConf.tzNicosia":"EET / ニコシア / 東ヨーロッパ時間","timeConf.tzNicosiaSummer":"EEST / ニコシア / 東ヨーロッパ夏時間","timeConf.tzJerusalem":"IST / エルサレム / イスラエル標準時間","timeConf.tzAden":"AST / アデン / アラビア標準時間","timeConf.tzBaghdad":"AST / バグダード / アラビア標準時間","timeConf.tzBahrain":"AST / バーレーン / アラビア標準時間","timeConf.tzKuwait":"AST / クウェート / アラビア標準時間","timeConf.tzQatar":"AST / カタール / アラビア標準時間","timeConf.tzRiyadh":"AST / リヤド / アラビア標準時間","timeConf.tzTehran":"IRST / テヘラン / イラン標準時間","timeConf.tzYerevan":"AMT / エレバン / アルメニア時間","timeConf.tzYerevanSummer":"AMST / エレバン / アルメニア夏時間","timeConf.tzBaku":"AZT / バクー / アゼルバイジャン時間","timeConf.tzBakuSummer":"AZST / バクー / アゼルバイジャン夏時間","timeConf.tzTbilisi":"GET / バクー / グルジア時間","timeConf.tzDubai":"GST / ドバイ / (ペルシア)湾標準時間","timeConf.tzMuscat":"GST / マスカット / (ペルシア)湾標準時間","timeConf.tzKabul":"AFT / マスカット / アフガニスタン時間","timeConf.tzKarachi":"PKT / カラチ / パキスタン時間","timeConf.tzDushanbe":"TJT / ドゥシャンベ / タジキスタン時間","timeConf.tzAshgabat":"TMT / アシガバート / トルクメニアン時間","timeConf.tzSamarkand":"UZT / サマルカンド / ウズベキスタン時間","timeConf.tzTashkent":"UZT / タシュケント / ウズベキスタン時間","timeConf.tzAqtau":"WKST / アクタウ / 西カザフスタン標準時間","timeConf.tzAqtobe":"WKST / アクトベ / 西カザフスタン標準時間","timeConf.tzOral":"WKST / オーラル / 西カザフスタン標準時間","timeConf.tzYekaterinbufg":"YEKT / エカテリンブルグ / エカテリンブルク時間","timeConf.tzYekaterinbufgSummer":"YEKST / エカテリンブルグ / エカテリンブルク夏時間","timeConf.tzCalcutta":"IST / コルカタ / インド標準時間","timeConf.tzColombo":"IST / コロンボ / インド標準時間","timeConf.tzKatmandu":"NPT / カトマンズ / ネパール時間","timeConf.tzDhaka":"BDT / ダッカ / バングラデシュ時間","timeConf.tzThimphu":"BTT / ティンプー / ブータン時間","timeConf.tzAlmaty":"EKST / アルマトイ / 東カザフスタン標準時","timeConf.tzQyzylorda":"EKST / クズロルダ / 東カザフスタン標準時","timeConf.tzBishkek":"KGT / ビシュケク / キルギス時間","timeConf.tzNovosibirsk":"NOVT / ノヴォシビルスク / ノヴォシビルクス時間","timeConf.tzNovosibirskSummer":"NOVST / ノヴォシビルスク / ノヴォシビルクス夏時間","timeConf.tzOmsk":"OMST / オムスク / オムスク時間","timeConf.tzOmskSummer":"OMSST / オムスク / オムスク夏時間","timeConf.tzRangoon":"MMT / ヤンゴン / ミャンマー時間","timeConf.tzHovd":"HOVT / ホブド / ホブド時間","timeConf.tzBangkok":"ICT / バンコク / インドシナ時間","timeConf.tzPhnom_Penh":"ICT / プノンペン / インドシナ時間","timeConf.tzSaigon":"ICT / サイゴン / インドシナ時間","timeConf.tzVientiane":"ICT / ヴィエンチャン / インドシナ時間","timeConf.tzKrasnoyarsk":"KRAT / クラスノヤルスク / クラスノヤルスク時間","timeConf.tzKrasnoyarskSummer":"KRAST / クラスノヤルスク / クラスノヤルスク夏時間","timeConf.tzJakarta":"WIT / ジャカルタ / 西インドネシア時間","timeConf.tzPontianak":"WIT / ポンティアナック / 西インドネシア時間","timeConf.tzBrunei":"BNT / ブルネイ / ブルネイ・ダルッサラーム時間","timeConf.tzChoibalsan":"CHOT / チョイバルサン / チョイバルサン時間","timeConf.tzMakassar":"CIT / マカッサル / 中央インドネシア時間","timeConf.tzBeijing":"CST / 北京 / 中国標準時間","timeConf.tzChongqing":"CST / 重慶 / 中国標準時間","timeConf.tzHarbin":"CST / ハルビン / 中国標準時間","timeConf.tzKashgar":"CST / カシュガル / 中国標準時間","timeConf.tzMacau":"CST / マカオ / 中国標準時間","timeConf.tzShanghai":"CST / 上海 / 中国標準時間","timeConf.tzTaipei":"CST / 台北 / 台北標準時間","timeConf.tzUrumqi":"CST / ウルムチ / 中国標準時間","timeConf.tzHong_Kong":"HKT / 香港 / 香港時間","timeConf.tzIrkutsk":"IRKT / イルクーツク / イルクーツク時間","timeConf.tzIrkutskSummer":"IRKST / イルクーツク / イルクーツク夏時間","timeConf.tzKuala_Lumpur":"MYT / クアラルンプール / マレーシア時間","timeConf.tzKuching":"MYT / クチン / マレーシア時間","timeConf.tzManila":"PHT / マニラ / フィリピン時間","timeConf.tzSingapore":"SGT / シンガポール / シンガポール標準時間","timeConf.tzUlaanbaatar":"ULAT / ウランバートル / ウランバートル時間","timeConf.tzJayapura":"EIT / ジャヤプラ / 東インドネシア時間","timeConf.tzOsaka":"JST / 大阪 / 日本標準時間","timeConf.tzSapporo":"JST / 札幌 / 日本標準時間","timeConf.tzTokyo":"JST / 東京 / 日本標準時間","timeConf.tzPyongyang":"KST / 平壌 / 韓国標準時間","timeConf.tzSeoul":"KST / ソウル / 韓国標準時間","timeConf.tzDili":"TLT / ディリ / 東ティモール時間","timeConf.tzYakutsk":"YAKT / ヤクーツク / ヤクーツク時間","timeConf.tzYakutskSummer":"YAKST / ヤクーツク / ヤクーツク夏時間","timeConf.tzSakhalin":"SAKT / サハリン / サハリン時間","timeConf.tzSakhalinSummer":"SAKST / サハリン / サハリン夏時間","timeConf.tzVladivostok":"VLAT / ウラジオストク / ウラジオストック時間","timeConf.tzVladivostokSummer":"VLAST / ウラジオストク / ウラジオストック夏時間","timeConf.tzAnadyr":"MAGT / アナディリ / マガダン時間","timeConf.tzAnadyrSummer":"MAGST / アナディリ / マガダン夏時間","timeConf.tzKamchatka":"MAGT / カムチャツカ / マガダン時間","timeConf.tzKamchatkaSummer":"MAGST / カムチャツカ / マガダン夏時間","timeConf.tzMagadan":"MAGT / マガダン / マガダン時間","timeConf.tzMagadanSummer":"MAGST / マガダン / マガダン夏時間","timeConf.tzBermuda":"AST / バミューダ / アトランティック標準時間","timeConf.tzBermudaSummer":"ADT / バミューダ / アトランティック夏時間","timeConf.tzStanley":"FKT / スタンリー / フォークランド諸島時間","timeConf.tzStanleySummer":"FSKT / スタンリー / フォークランド諸島夏時間","timeConf.tzAzores":"AZOT / アゾレス / アゾレス時間","timeConf.tzAzoresSummer":"AZOST / アゾレス / アゾレス夏時間","timeConf.tzCape_Verde":"CVT / カーボベルデ / カーボベルデ時間","timeConf.tzReykjavik":"GMT / レイキャヴィーク / グリニッジ標準時間","timeConf.tzSt_Helena":"GMT / セントヘレナ / グリニッジ標準時間","timeConf.tzCanary":"WET / カナリア / 西ヨーロッパ時間","timeConf.tzCanarySummer":"WEST / カナリア / 西ヨーロッパ夏時間","timeConf.tzFaeroe":"WET / フェロー / 西ヨーロッパ時間","timeConf.tzFaeroeSummer":"WEST / フェロー / 西ヨーロッパ夏時間","timeConf.tzMadeira":"WET / マデイラ / 西ヨーロッパ時間","timeConf.tzMadeiraSummer":"WEST / マデイラ / 西ヨーロッパ夏時間","timeConf.tzPerth":"AWST / パース / オーストラリア西標準時間","timeConf.tzEucla":"ACWST / ユークラ / オーストラリア中西部標準時間","timeConf.tzAdelaide":"ACST / アデレード / オーストラリア中部標準時間","timeConf.tzAdelaideSummer":"ACDT / アデレード / オーストラリア中部夏時間","timeConf.tzDarwin":"ACST / ダーウィン / オーストラリア中部標準時間","timeConf.tzBrisbane":"AEST / ブリスベン / オーストラリア東部標準時間","timeConf.tzCurrie":"AEST / カリー / オーストラリア東部標準時間","timeConf.tzCurrieSummer":"AEDT / カリー / オーストラリア東部夏時間","timeConf.tzHobart":"AEST / ホバート / オーストラリア東部標準時間","timeConf.tzHobartSummer":"AEDT / ホバート / オーストラリア東部夏時間","timeConf.tzLindeman":"AEST / リンデマン / オーストラリア東部標準時間","timeConf.tzMelbourne":"AEST / メルボルン / オーストラリア東部標準時間","timeConf.tzMelbourneSummer":"AEDT / メルボルン / オーストラリア東部夏時間","timeConf.tzSydney":"AEST / シドニー / オーストラリア東部標準時間","timeConf.tzSydneySummer":"AEDT / シドニー / オーストラリア東部夏時間","timeConf.tzLord_Howe":"LHST / ロード・ハウ / ロード・ハウ標準時間","timeConf.tzLord_HoweSummer":"LHDT / ロード・ハウ / ロード・ハウ夏時間","timeConf.tzDublin":"GMT / ダブリン / グリニッジ標準時間","timeConf.tzGuernsey":"GMT / ガーンジー / グリニッジ標準時間","timeConf.tzIsle_of_Man":"GMT / マン島 / グリニッジ標準時間","timeConf.tzJersey":"GMT / ジャージー / グリニッジ標準時間","timeConf.tzLondon":"GMT / ロンドン / グリニッジ標準時間","timeConf.tzLisbon":"WET / リスボン / 西ヨーロッパ時間","timeConf.tzLisbonSummer":"WEST / リスボン / 西ヨーロッパ夏時間","timeConf.tzAmsterdam":"CET / アムステルダム / 中央ヨーロッパ時間","timeConf.tzAmsterdamSummer":"CEST / アムステルダム / 中央ヨーロッパ夏時間","timeConf.tzAndorra":"CET / アンドラ / 中央ヨーロッパ時間","timeConf.tzAndorraSummer":"CEST / アンドラ / 中央ヨーロッパ夏時間","timeConf.tzBelgrade":"CET / ベオグラード / 中央ヨーロッパ時間","timeConf.tzBelgradeSummer":"CEST / ベオグラード / 中央ヨーロッパ夏時間","timeConf.tzBerlin":"CET / ベルリン / 中央ヨーロッパ時間","timeConf.tzBerlinSummer":"CEST / ベルリン / 中央ヨーロッパ夏時間","timeConf.tzBratislava":"CET / ブラチスラヴァ / 中央ヨーロッパ時間","timeConf.tzBratislavaSummer":"CEST / ブラチスラヴァ / 中央ヨーロッパ夏時間","timeConf.tzBrussels":"CET / ブリュッセル / 中央ヨーロッパ時間","timeConf.tzBrusselsSummer":"CEST / ブリュッセル / 中央ヨーロッパ夏時間","timeConf.tzBudapest":"CET / ブダペスト / 中央ヨーロッパ時間","timeConf.tzBudapestSummer":"CEST / ブダペスト / 中央ヨーロッパ夏時間","timeConf.tzCopenhagen":"CET / コペンハーゲン / 中央ヨーロッパ時間","timeConf.tzCopenhagenSummer":"CEST / コペンハーゲン / 中央ヨーロッパ夏時間","timeConf.tzGibraltar":"CET / ジブラルタル / 中央ヨーロッパ時間","timeConf.tzGibraltarSummer":"CEST / ジブラルタル / 中央ヨーロッパ夏時間","timeConf.tzLjubljana":"CET / リュブリャナ / 中央ヨーロッパ時間","timeConf.tzLjubljanaSummer":"CEST / リュブリャナ / 中央ヨーロッパ夏時間","timeConf.tzLuxembourg":"CET / ルクセンブルク / 中央ヨーロッパ時間","timeConf.tzLuxembourgSummer":"CEST / ルクセンブルク / 中央ヨーロッパ夏時間","timeConf.tzMadrid":"CET / マドリード / 中央ヨーロッパ時間","timeConf.tzMadridSummer":"CEST / マドリード / 中央ヨーロッパ夏時間","timeConf.tzMalta":"CET / マルタ / 中央ヨーロッパ時間","timeConf.tzMaltaSummer":"CEST / マルタ / 中央ヨーロッパ夏時間","timeConf.tzMonaco":"CET / モナコ / 中央ヨーロッパ時間","timeConf.tzMonacoSummer":"CEST / モナコ / 中央ヨーロッパ夏時間","timeConf.tzOslo":"CET / オスロ / 中央ヨーロッパ時間","timeConf.tzOsloSummer":"CEST / オスロ / 中央ヨーロッパ夏時間","timeConf.tzParis":"CET / パリ / 中央ヨーロッパ時間","timeConf.tzParisSummer":"CEST / パリ / 中央ヨーロッパ夏時間","timeConf.tzPodgorica":"CET / ポドゴリツァ / 中央ヨーロッパ時間","timeConf.tzPodgoricaSummer":"CEST / ポドゴリツァ / 中央ヨーロッパ夏時間","timeConf.tzPrague":"CET / プラハ / 中央ヨーロッパ時間","timeConf.tzPragueSummer":"CEST / プラハ / 中央ヨーロッパ夏時間","timeConf.tzRome":"CET / ローマ / 中央ヨーロッパ時間","timeConf.tzRomeSummer":"CEST / ローマ / 中央ヨーロッパ夏時間","timeConf.tzSan_Marino":"CET / サンマリノ / 中央ヨーロッパ時間","timeConf.tzSan_MarinoSummer":"CEST / サンマリノ / 中央ヨーロッパ夏時間","timeConf.tzSarajevo":"CET / サラエヴォ / 中央ヨーロッパ時間","timeConf.tzSarajevoSummer":"CEST / サラエヴォ / 中央ヨーロッパ夏時間","timeConf.tzSkopje":"CET / スコピエ / 中央ヨーロッパ時間","timeConf.tzSkopjeSummer":"CEST / スコピエ / 中央ヨーロッパ夏時間","timeConf.tzStockholm":"CET / ストックホルム / 中央ヨーロッパ時間","timeConf.tzStockholmSummer":"CEST / ストックホルム / 中央ヨーロッパ夏時間","timeConf.tzTirane":"CET / ティラナ / 中央ヨーロッパ時間","timeConf.tzTiraneSummer":"CEST / ティラナ / 中央ヨーロッパ夏時間","timeConf.tzVaduz":"CET / ファドゥーツ / 中央ヨーロッパ時間","timeConf.tzVaduzSummer":"CEST / ファドゥーツ / 中央ヨーロッパ夏時間","timeConf.tzVatican":"CET / バチカン / 中央ヨーロッパ時間","timeConf.tzVaticanSummer":"CEST / バチカン / 中央ヨーロッパ夏時間","timeConf.tzVienna":"CET / ウィーン / 中央ヨーロッパ時間","timeConf.tzViennaSummer":"CEST / ウィーン / 中央ヨーロッパ夏時間","timeConf.tzWarsaw":"CET / ワルシャワ / 中央ヨーロッパ時間","timeConf.tzWarsawSummer":"CEST / ワルシャワ / 中央ヨーロッパ夏時間","timeConf.tzZagreb":"CET / ザグレブ / 中央ヨーロッパ時間","timeConf.tzZagrebSummer":"CEST / ザグレブ / 中央ヨーロッパ夏時間","timeConf.tzZurich":"CET / チューリッヒ / 中央ヨーロッパ時間","timeConf.tzZurichSummer":"CEST / チューリッヒ / 中央ヨーロッパ夏時間","timeConf.tzAthens":"EET / アテネ / 東ヨーロッパ時間","timeConf.tzAthensSummer":"EEST / アテネ / 東ヨーロッパ夏時間","timeConf.tzBucharest":"EET / ブカレスト / 東ヨーロッパ時間","timeConf.tzBucharestSummer":"EEST / ブカレスト / 東ヨーロッパ夏時間","timeConf.tzChisinau":"EET / キシナウ / 東ヨーロッパ時間","timeConf.tzChisinauSummer":"EEST / キシナウ / 東ヨーロッパ夏時間","timeConf.tzHelsinki":"EET / ヘルシンキ / 東ヨーロッパ時間","timeConf.tzHelsinkiSummer":"EEST / ヘルシンキ / 東ヨーロッパ夏時間","timeConf.tzIstanbul":"EET / イスタンブール / 東ヨーロッパ時間","timeConf.tzIstanbulSummer":"EEST / イスタンブール / 東ヨーロッパ夏時間","timeConf.tzKaliningrad":"EET / カリーニングラード / 東ヨーロッパ時間","timeConf.tzKaliningradSummer":"EEST / カリーニングラード / 東ヨーロッパ夏時間","timeConf.tzKiev":"EET / キーウ / 東ヨーロッパ時間","timeConf.tzKievSummer":"EEST / キーウ / 東ヨーロッパ夏時間","timeConf.tzMariehamn":"EET / マリエハムン / 東ヨーロッパ時間","timeConf.tzMariehamnSummer":"EEST / マリエハムン / 東ヨーロッパ夏時間","timeConf.tzMinsk":"EET / ミンスク / 東ヨーロッパ時間","timeConf.tzMinskSummer":"EEST / ミンスク / 東ヨーロッパ夏時間","timeConf.tzRiga":"EET / リガ / 東ヨーロッパ時間","timeConf.tzRigaSummer":"EEST / リガ / 東ヨーロッパ夏時間","timeConf.tzSimferopol":"EET / シンフェロポリ / 東ヨーロッパ時間","timeConf.tzSimferopolSummer":"EEST / シンフェロポリ / 東ヨーロッパ夏時間","timeConf.tzSofia":"EET / ソフィア / 東ヨーロッパ時間","timeConf.tzSofiaSummer":"EEST / ソフィア / 東ヨーロッパ夏時間","timeConf.tzTallinn":"EET / タリン / 東ヨーロッパ時間","timeConf.tzTallinnSummer":"EEST / タリン / 東ヨーロッパ夏時間","timeConf.tzUzhgorod":"EET / ウジュホロド / 東ヨーロッパ時間","timeConf.tzUzhgorodSummer":"EEST / ウジュホロド / 東ヨーロッパ夏時間","timeConf.tzVilnius":"EET / ヴィリニュス / 東ヨーロッパ時間","timeConf.tzVilniusSummer":"EEST / ヴィリニュス / 東ヨーロッパ夏時間","timeConf.tzZaporozhye":"EET / ザポリージャ / 東ヨーロッパ時間","timeConf.tzZaporozhyeSummer":"EEST / ザポリージャ / 東ヨーロッパ夏時間","timeConf.tzMoscow":"MSK / モスクワ / モスクワ標準時間","timeConf.tzMoscowSummer":"MSKS / モスクワ / モスクワ夏時間","timeConf.tzSamara":"MSK / サマーラ / モスクワ標準時間","timeConf.tzSamaraSummer":"MSKS / サマーラ / モスクワ夏時間","timeConf.tzVolgograd":"VOLT / ヴォルゴグラード / ヴォルゴグラード時間","timeConf.tzVolgogradSummer":"VOLST / ヴォルゴグラード / ヴォルゴグラード夏時間","timeConf.tzAntananarivo":"EAT / アンタナナリボ / 東アフリカ時間","timeConf.tzComoro":"EAT / コモロ / 東アフリカ時間","timeConf.tzMayotte":"EAT / マヨット / 東アフリカ時間","timeConf.tzMauritius":"MUT / モーリシャス / モーリシャス時間","timeConf.tzReunion":"RET / レユニオン / レユニオン時間","timeConf.tzMahe":"SCT / マヘ島 / セーシェル時間","timeConf.tzMaldives":"MVT / モルディブ / モルディブ時間","timeConf.tzKerguelen":"TFT / ケルゲレン / フランス領極南時間","timeConf.tzChagos":"IOT / チャゴス / インド洋時間","timeConf.tzCocos":"CCT / ココス島 / ココス島時間","timeConf.tzChristmas":"CXT / クリスマス島 / クリスマス島時間","timeConf.tzNiue":"NUT / ニウエ / ニウエ時間","timeConf.tzApia":"SST / アピア / サモア標準時間","timeConf.tzMidway":"SST / ミッドウェー / サモア標準時間","timeConf.tzPago_pago":"SST / パゴパゴ / サモア標準時間","timeConf.tzRarotonga":"CKT / ラロトンガ / クック諸島時間","timeConf.tzHonolulu":"HST / ホノルル / ハワイ・アリューシャン標準時間","timeConf.tzJohnston":"HST / ジョンストン / ハワイ・アリューシャン標準時間","timeConf.tzTahiti":"TAHT / タヒチ / タヒチ時間","timeConf.tzFakaofo":"TKT / ファカオフォ島 / トケラウ時間","timeConf.tzMarquesas":"MART / マルキーズ / マルキーズ時間","timeConf.tzGambier":"GAMT / ガンビエ諸島 / ガンビア時間","timeConf.tzPitcairn":"PNT / ピトケアン諸島 / ピトケアン時間","timeConf.tzEaster":"EAST / イースター島 / イースター島時間","timeConf.tzEasterSummer":"EASST / イースター島 / イースター島夏時間","timeConf.tzGalapagos":"GALT / ガラパゴス諸島 / ガラパゴス時間","timeConf.tzPalau":"PWT / パラオ / パラオ時間","timeConf.tzGuam":"CHST / グアム / チャモロ標準時間","timeConf.tzSaipan":"CHST / サイパン / チャモロ標準時間","timeConf.tzTruk":"CHUT / トラック島 / チューク時間","timeConf.tzPort_Moresby":"PGT / ポートモレスビー / パプアニューギニア時間","timeConf.tzKosrae":"KOST / コスラエ / コスラエ時間","timeConf.tzNoumea":"NCT / ヌメア / ニューカレドニア時間","timeConf.tzPonape":"PONT / ポンペイ島 / ポンペイ(ポナペ)時間","timeConf.tzGuadalcanal":"SBT / ガダルカナル島 / ソロモン諸島時間","timeConf.tzEfate":"VUT / エファテ島 / バヌアツ時間","timeConf.tzNorfolk":"NFT / ノーフォーク諸島 / ノーフォーク諸島時間","timeConf.tzFiji":"FJT / フィジー / フィジー時間","timeConf.tzTarawa":"GILT / タラワ / ギルバート諸島時間","timeConf.tzKwajalein":"MHT / クェゼリン島 / マーシャル諸島時間","timeConf.tzMajuro":"MHT / マジュロ / マーシャル諸島時間","timeConf.tzNauru":"NRT / ナウル / ナウル時間","timeConf.tzAuckland":"NZST / オークランド / ニュージーランド標準時間","timeConf.tzAucklandSummer":"NZDT / オークランド / ニュージーランド夏時間","timeConf.tzFunafuti":"TVT / フナフティ島 / ツバル時間","timeConf.tzWake":"WAKT / ウェーク島 / ウェーク島時間","timeConf.tzWallis":"WFT / ウォリス島 / ウォリス・フツナ時間","timeConf.tzEnderbury":"PHOT / エンダーベリー島 / フェニックス諸島時間","timeConf.tzTongatapu":"TOT / トンガタプ島 / トンガ時間","timeConf.tzKiritimati":"LINT / キリスィマスィ島 / ライン諸島時間","timeConf.tzGMTm1200":"GMT-12:00","timeConf.tzGMTm1100":"GMT-11:00","timeConf.tzGMTm1000":"GMT-10:00","timeConf.tzGMTm0930":"GMT-9:30","timeConf.tzGMTm0900":"GMT-9:00","timeConf.tzGMTm0800":"GMT-8:00","timeConf.tzGMTm0700":"GMT-7:00","timeConf.tzGMTm0600":"GMT-6:00","timeConf.tzGMTm0500":"GMT-5:00","timeConf.tzGMTm0400":"GMT-4:00","timeConf.tzGMTm0330":"GMT-3:30","timeConf.tzGMTm0300":"GMT-3:00","timeConf.tzGMTm0200":"GMT-2:00","timeConf.tzGMTm0100":"GMT-1:00","timeConf.tzGMTp0000":"GMT","timeConf.tzGMTp0100":"GMT+1:00","timeConf.tzGMTp0200":"GMT+2:00","timeConf.tzGMTp0300":"GMT+3:00","timeConf.tzGMTp0330":"GMT+3:30","timeConf.tzGMTp0400":"GMT+4:00","timeConf.tzGMTp0430":"GMT+4:30","timeConf.tzGMTp0500":"GMT+5:00","timeConf.tzGMTp0530":"GMT+5:30","timeConf.tzGMTp0545":"GMT+5:45","timeConf.tzGMTp0600":"GMT+6:00","timeConf.tzGMTp0630":"GMT+6:30","timeConf.tzGMTp0700":"GMT+7:00","timeConf.tzGMTp0800":"GMT+8:00","timeConf.tzGMTp0830":"GMT+8:30","timeConf.tzGMTp0845":"GMT+8:45","timeConf.tzGMTp0900":"GMT+9:00","timeConf.tzGMTp0930":"GMT+9:30","timeConf.tzGMTp1000":"GMT+10:00","timeConf.tzGMTp1030":"GMT+10:30","timeConf.tzGMTp1100":"GMT+11:00","timeConf.tzGMTp1200":"GMT+12:00","timeConf.tzGMTp1245":"GMT+12:45","timeConf.tzGMTp1300":"GMT+13:00","timeConf.tzGMTp1400":"GMT+14:00"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var bootstrap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.esm.js");
/* harmony import */ var _index_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.scss */ "./src/index.scss");
/* harmony import */ var _riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @riotjs/hot-reload */ "./node_modules/@riotjs/hot-reload/index.js");
/* harmony import */ var _riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_riotjs_hot_reload__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _view_appmain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view/appmain */ "./src/view/appmain.js");
// BootstrapのJavaScript側の機能を読み込む


// スタイルシートを読み込む



(0,_view_appmain__WEBPACK_IMPORTED_MODULE_3__.StartModelSelection)();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map