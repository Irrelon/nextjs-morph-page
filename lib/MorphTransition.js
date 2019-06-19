"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _Transition = _interopRequireDefault(require("react-transition-group/Transition"));

var _PropTypes = require("react-transition-group/utils/PropTypes");

var _irrelonMorph = _interopRequireWildcard(require("./irrelon-morph"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function areChildrenDifferent(oldChildren, newChildren) {
  if (oldChildren === newChildren) {
    return false;
  }

  return !(_react.default.isValidElement(oldChildren) && _react.default.isValidElement(newChildren) && oldChildren.key != null && oldChildren.key === newChildren.key);
}

function buildClassName(className, state) {
  switch (state) {
    case 'enter':
      return "".concat(className, " enter");

    case 'entering':
      return "".concat(className, " enter ").concat(className, " enter active");

    case 'entered':
      return "".concat(className, " enter.done");

    case 'exit':
      return "".concat(className, " exit");

    case 'exiting':
      return "".concat(className, " exit ").concat(className, " exit active");

    case 'exited':
      return "".concat(className, " exit done");

    default:
      return '';
  }
}

function shouldDelayEnter(children) {
  return _react.default.isValidElement(children) && children.type.pageTransitionDelayEnter;
}

var MorphTransition =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MorphTransition, _React$Component);

  function MorphTransition(props) {
    var _this;

    _classCallCheck(this, MorphTransition);

    _this = _possibleConstructorReturn(this, (MorphTransition.__proto__ || Object.getPrototypeOf(MorphTransition)).call(this, props));
    var children = props.children;
    _this.state = {
      state: 'enter',
      isIn: !shouldDelayEnter(children),
      currentChildren: children,
      nextChildren: null,
      renderedChildren: children,
      showLoading: false
    };
    return _this;
  }

  _createClass(MorphTransition, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (shouldDelayEnter(this.props.children)) {
        this.setState({
          timeoutId: this.startEnterTimer()
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _state = this.state,
          currentChildren = _state.currentChildren,
          renderedChildren = _state.renderedChildren,
          nextChildren = _state.nextChildren,
          isIn = _state.isIn,
          state = _state.state;
      var children = this.props.children;
      var hasNewChildren = areChildrenDifferent(currentChildren, children);
      var needsTransition = areChildrenDifferent(renderedChildren, children);

      if (hasNewChildren) {
        // We got a new set of children while we were transitioning some in
        // Immediately start transitioning out this component and update the next
        // component
        this.setState({
          isIn: false,
          nextChildren: children,
          currentChildren: children
        });

        if (this.state.timeoutId) {
          clearTimeout(this.state.timeoutId);
        } //console.log('New DOM changes');

      } else if (needsTransition && !isIn && state === 'exited') {
        if (shouldDelayEnter(nextChildren)) {
          // Wait for the ready callback to actually transition in, but still
          // mount the component to allow it to start loading things
          this.setState({
            renderedChildren: nextChildren,
            nextChildren: null
          });
        } else {
          // No need to wait, mount immediately
          this.setState({
            isIn: true,
            renderedChildren: nextChildren,
            nextChildren: null,
            timeoutId: this.startEnterTimer()
          });
        }
      } else if (prevState.showLoading && !this.state.showLoading) {
        // We hid the loading indicator; now that that change has been flushed to
        // the DOM, we can now bring in the next component!
        this.setState({
          isIn: true
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
      }
    }
  }, {
    key: "onEnter",
    value: function onEnter(pageElem) {
      var _this2 = this;

      //console.log('onEnter');
      // It's safe to reenable scrolling now
      this.disableScrolling = false;
      this.setState({
        state: 'enter',
        showLoading: false
      });

      if (!this._sourceMorphElements) {
        return;
      } // Find the source and target pairs


      var promiseArr = [];

      this._sourceMorphElements.forEach(function (sourceItem) {
        var sourceNode = sourceItem.node;
        var customTargetSelector = sourceNode.getAttribute("data-morph-target");
        var targetSelector = customTargetSelector || "#" + sourceItem.node.id;
        promiseArr.push(new Promise(function (resolve) {
          var target = pageElem.querySelector(targetSelector);

          if (target) {
            (0, _irrelonMorph.default)(sourceItem, target, parseInt(sourceNode.getAttribute('data-morph-ms'), 10) || 600).then(function (morphData) {
              (0, _irrelonMorph.endMorph)(morphData);
              resolve();
            });
          } else {
            resolve();
          }
        }));
      });

      Promise.all(promiseArr).then(function () {
        _this2.onMorphComplete(pageElem);
      });
    }
  }, {
    key: "onEntering",
    value: function onEntering() {
      //console.log('onEntering');
      this.setState({
        state: 'entering'
      });
    }
  }, {
    key: "scanDomForMorphElements",
    value: function scanDomForMorphElements(pageElem) {
      var morphElems = pageElem.querySelectorAll('[data-morph-ms]');
      var sourceSnapshot = [];

      if (morphElems && morphElems.length) {
        for (var i = 0; i < morphElems.length; i++) {
          sourceSnapshot.push(new _irrelonMorph.ScannedNode(morphElems[i]));
        }
      }

      return sourceSnapshot;
    }
  }, {
    key: "onEntered",
    value: function onEntered(pageElem) {
      var _this3 = this;

      //console.log('onEntered');
      this.setState({
        state: 'entered'
      });
      setTimeout(function () {
        _this3._sourceMorphElements = _this3.scanDomForMorphElements(pageElem); //console.log('On entered detected ' + this._sourceMorphElements.length + ' new source elements');
      }, 1);
    }
  }, {
    key: "onMorphComplete",
    value: function onMorphComplete(pageElem) {
      this._sourceMorphElements = this.scanDomForMorphElements(pageElem); //console.log('On entered detected ' + this._sourceMorphElements.length + ' new source elements');
    }
  }, {
    key: "onExit",
    value: function onExit() {
      //console.log('onExit');
      // Disable scrolling until this component has unmounted
      this.disableScrolling = true;
      this.setState({
        state: 'exit'
      });
      (0, _irrelonMorph.cancelAllMorphs)();
    }
  }, {
    key: "onExiting",
    value: function onExiting() {
      //console.log('onExiting');
      this.setState({
        state: 'exiting'
      });
    }
  }, {
    key: "onExited",
    value: function onExited() {
      //console.log('onExited');
      this.setState({
        state: 'exited',
        renderedChildren: null
      });
    }
  }, {
    key: "onChildLoaded",
    value: function onChildLoaded() {
      //console.log('Child loaded');
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId);
      }

      this.setState({
        isIn: true
      });
    }
  }, {
    key: "startEnterTimer",
    value: function startEnterTimer() {
      var _this4 = this;

      return setTimeout(function () {
        _this4.setState({
          showLoading: true
        });
      }, this.props.loadingDelay);
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var _props = this.props,
          timeout = _props.timeout,
          loadingCallbackName = _props.loadingCallbackName;
      var _state2 = this.state,
          children = _state2.renderedChildren,
          state = _state2.state;

      if (['entering', 'exiting', 'exited'].indexOf(state) !== -1) {
        // Need to reflow!
        // eslint-disable-next-line no-unused-expressions
        if (document.body) {
          document.body.scrollTop;
        }
      }

      var containerClassName = buildClassName(this.props.classNames, state);
      return _react.default.createElement(_Transition.default, {
        timeout: timeout,
        "in": this.state.isIn,
        appear: true,
        onEnter: function onEnter() {
          return _this5.onEnter.apply(_this5, arguments);
        },
        onEntering: function onEntering() {
          return _this5.onEntering.apply(_this5, arguments);
        },
        onEntered: function onEntered() {
          return _this5.onEntered.apply(_this5, arguments);
        },
        onExit: function onExit() {
          return _this5.onExit.apply(_this5, arguments);
        },
        onExiting: function onExiting() {
          return _this5.onExiting.apply(_this5, arguments);
        },
        onExited: function onExited() {
          return _this5.onExited.apply(_this5, arguments);
        }
      }, _react.default.createElement("div", {
        className: containerClassName
      }, children && _react.default.cloneElement(children, _defineProperty({}, loadingCallbackName, function () {
        return _this5.onChildLoaded();
      }))));
    }
  }]);

  return MorphTransition;
}(_react.default.Component);

MorphTransition.propTypes = {
  children: _propTypes.default.node.isRequired,
  classNames: _propTypes.default.string.isRequired,
  timeout: _propTypes.default.number.isRequired,
  loadingComponent: _propTypes.default.element,
  loadingDelay: _propTypes.default.number,
  loadingCallbackName: _propTypes.default.string,

  /* eslint-disable react/require-default-props */
  loadingTimeout: function loadingTimeout(props) {
    var pt = _PropTypes.timeoutsShape;

    if (props.loadingComponent) {
      pt = pt.isRequired;
    }

    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    return pt.apply(void 0, [props].concat(args));
  },
  loadingClassNames: function loadingClassNames(props) {
    var pt = _propTypes.default.string;

    if (props.loadingTimeout) {
      pt = pt.isRequired;
    }

    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    return pt.apply(void 0, [props].concat(args));
  },

  /* eslint-enable react/require-default-props */
  monkeyPatchScrolling: _propTypes.default.bool
};
MorphTransition.defaultProps = {
  loadingComponent: null,
  loadingCallbackName: 'pageTransitionReadyToEnter',
  loadingDelay: 500,
  monkeyPatchScrolling: false
};
var _default = MorphTransition;
exports.default = _default;