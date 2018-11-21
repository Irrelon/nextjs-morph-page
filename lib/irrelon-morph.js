"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelAllMorphs = exports.cancelMorph = exports.endMorph = exports.trackProps = exports.ScannedNode = exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var activeMorphs = [];
var trackProps = [{
  name: 'top',
  units: 'px'
}, {
  name: 'left',
  units: 'px'
}, {
  name: 'width'
}, {
  name: 'height'
}, {
  name: 'backgroundColor'
}, {
  name: 'backgroundImage'
}, {
  name: 'borderBottomLeftRadius'
}, {
  name: 'borderBottomRightRadius'
}, {
  name: 'borderTopLeftRadius'
}, {
  name: 'borderTopRightRadius'
}, {
  name: 'position',
  applyVal: false
}, {
  name: 'marginTop',
  applyVal: false
}, {
  name: 'marginLeft',
  applyVal: false
}, {
  name: 'marginBottom',
  applyVal: false
}, {
  name: 'marginRight',
  applyVal: false
}, {
  name: 'paddingTop',
  applyVal: false
}, {
  name: 'paddingLeft',
  applyVal: false
}, {
  name: 'paddingBottom',
  applyVal: false
}, {
  name: 'paddingRight',
  applyVal: false
}, {
  name: 'borderTopWidth'
}, {
  name: 'borderLeftWidth'
}, {
  name: 'borderRightWidth'
}, {
  name: 'borderBottomWidth'
}, {
  name: 'borderTopColor'
}, {
  name: 'borderLeftColor'
}, {
  name: 'borderRightColor'
}, {
  name: 'borderBottomColor'
}];
exports.trackProps = trackProps;

var ScannedNode =
/*#__PURE__*/
function () {
  function ScannedNode(node) {
    _classCallCheck(this, ScannedNode);

    this.node = node;
    this.style = {};
    this.scanNode(node);
  }

  _createClass(ScannedNode, [{
    key: "scanNode",
    value: function scanNode(node) {
      var _this = this;

      var styles = window.getComputedStyle(node);
      var bounds = node.getBoundingClientRect();
      this.parentNode = node.parentNode;
      this.nextSibling = node.nextSibling;
      trackProps.forEach(function (prop) {
        _this.style[prop.name] = styles[prop.name];
      });
      this.style.top = bounds.top;
      this.style.left = bounds.left;
    }
  }]);

  return ScannedNode;
}();

exports.ScannedNode = ScannedNode;

var registerMorph = function registerMorph(morphData) {
  activeMorphs.push(morphData);
};

var removeMorph = function removeMorph(morphData) {
  var index = activeMorphs.indexOf(morphData);

  if (index === -1) {
    return;
  }

  activeMorphs.splice(index, 1);
};

var applyStyles = function applyStyles(targetElem, targetData) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var modifier = options.modifier,
      overrides = options.overrides;
  trackProps.forEach(function (prop) {
    var applyVal = prop.applyVal !== false;

    if (overrides && overrides[prop.name] && overrides[prop.name].applyVal !== undefined) {
      applyVal = overrides[prop.name].applyVal;
    }

    if (!applyVal) return;
    var modifierVal;

    if (modifier) {
      modifierVal = modifier(prop);
    }

    if (modifierVal !== undefined) {
      targetElem.style[prop.name] = targetData.style[prop.name] + modifierVal + (prop.units ? prop.units : '');
    } else {
      targetElem.style[prop.name] = targetData.style[prop.name] + (prop.units ? prop.units : '');
    }
  });
};

var morphElement = function morphElement(sourceData, targetData, duration, options) {
  options = options || {};
  return new Promise(function (resolve) {
    if (!(sourceData instanceof ScannedNode)) {
      // We have to scan the source node
      sourceData = new ScannedNode(sourceData);
    }

    var source = sourceData.node; // Hide the source

    source.style.display = 'none'; // Read css from target

    if (!(targetData instanceof ScannedNode)) {
      // We have to scan the source node
      targetData = new ScannedNode(targetData);
    }

    var target = targetData.node;
    var targetPlaceholder;

    if (!target.getAttribute('data-morph-in-place')) {
      // Create a placeholder at the target location to maintain scrolling
      targetPlaceholder = document.createElement(target.tagName); //console.log('------- Placeholder');

      applyStyles(targetPlaceholder, targetData, {
        modifier: function modifier(prop) {
          switch (prop.name) {
            case 'top':
              return document.body.scrollTop;

            case 'left':
              return document.body.scrollLeft;
          }
        },
        overrides: {
          marginTop: {
            applyVal: true
          },
          marginLeft: {
            applyVal: true
          },
          marginRight: {
            applyVal: true
          },
          marginBottom: {
            applyVal: true
          },
          backgroundImage: {
            applyVal: false
          },
          backgroundColor: {
            applyVal: false
          }
        }
      });

      if (options.paintTarget) {
        targetPlaceholder.style.backgroundColor = '#ff0000';
      }

      targetData.parentNode.insertBefore(targetPlaceholder, targetData.nextSibling);
    } // Apply source css to target
    //console.log('------- Target move to source');


    applyStyles(target, sourceData);

    if (!target.getAttribute('data-morph-in-place')) {
      target.style.margin = '0px';
      target.style.position = 'absolute';
      document.body.appendChild(target);
    }

    setTimeout(function () {
      target.style.transition = "all ".concat(duration, "ms"); // Apply target css to target
      //console.log('------- Target move to target');

      applyStyles(target, targetData, {
        modifier: function modifier(prop) {
          switch (prop.name) {
            case 'top':
              return document.body.scrollTop;

            case 'left':
              return document.body.scrollLeft;
          }
        }
      });
    }, 1);
    var morphData = {
      target: target,
      targetData: targetData,
      targetPlaceholder: targetPlaceholder
    };
    morphData.timeoutId = setTimeout(function () {
      resolve(morphData);
    }, duration);
    registerMorph(morphData);
  });
};

var endMorph = function endMorph(morphData) {
  removeMorph(morphData); // Check that our DOM is still viable and not changed since we started this animation

  morphData.targetData.parentNode.insertBefore(morphData.target, morphData.targetData.nextSibling);

  if (!morphData.target.getAttribute('data-morph-in-place')) {
    morphData.targetPlaceholder.parentNode.removeChild(morphData.targetPlaceholder);
  }

  morphData.target.removeAttribute('style');
};

exports.endMorph = endMorph;

var cancelAllMorphs = function cancelAllMorphs() {
  //console.log('Cancelling all morphs');
  // Cancel all morph functions
  for (var i = activeMorphs.length - 1; i >= 0; i--) {
    cancelMorph(activeMorphs[i]);
  } // Clear the canceller array


  activeMorphs.length = 0;
};

exports.cancelAllMorphs = cancelAllMorphs;

var cancelMorph = function cancelMorph(morphData) {
  // Cancel single morph
  clearTimeout(morphData.timeoutId); // Return the target to its original settings

  endMorph(morphData);
};

exports.cancelMorph = cancelMorph;
var _default = morphElement;
exports.default = _default;