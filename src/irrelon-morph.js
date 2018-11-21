const activeMorphs = [];

const trackProps = [
	{name: 'top', units: 'px'},
	{name: 'left', units: 'px'},
	{name: 'width'},
	{name: 'height'},
	{name: 'backgroundColor'},
	{name: 'backgroundImage'},
	{name: 'borderBottomLeftRadius'},
	{name: 'borderBottomRightRadius'},
	{name: 'borderTopLeftRadius'},
	{name: 'borderTopRightRadius'},
	{name: 'position', applyVal: false},
	{name: 'marginTop', applyVal: false},
	{name: 'marginLeft', applyVal: false},
	{name: 'marginBottom', applyVal: false},
	{name: 'marginRight', applyVal: false},
	{name: 'paddingTop', applyVal: false},
	{name: 'paddingLeft', applyVal: false},
	{name: 'paddingBottom', applyVal: false},
	{name: 'paddingRight', applyVal: false},
	{name: 'borderTopWidth'},
	{name: 'borderLeftWidth'},
	{name: 'borderRightWidth'},
	{name: 'borderBottomWidth'},
	{name: 'borderTopColor'},
	{name: 'borderLeftColor'},
	{name: 'borderRightColor'},
	{name: 'borderBottomColor'}
];

class ScannedNode {
	constructor (node) {
		this.node = node;
		this.style = {};
		
		this.scanNode(node);
	}
	
	scanNode (node) {
		const styles = window.getComputedStyle(node);
		const bounds = node.getBoundingClientRect();
		
		this.parentNode = node.parentNode;
		this.nextSibling = node.nextSibling;
		
		trackProps.forEach((prop) => {
			this.style[prop.name] = styles[prop.name];
		});
		
		this.style.top = bounds.top;
		this.style.left = bounds.left;
	}
}

const registerMorph = (morphData) => {
	activeMorphs.push(morphData);
};

const removeMorph = (morphData) => {
	const index = activeMorphs.indexOf(morphData);
	if (index === -1) {
		return;
	}
	
	activeMorphs.splice(index, 1);
};

const applyStyles = (targetElem, targetData, options = {}) => {
	const {modifier, overrides} = options;
	
	trackProps.forEach((prop) => {
		let applyVal = prop.applyVal !== false;
		if (overrides && overrides[prop.name] && overrides[prop.name].applyVal !== undefined) {
			applyVal = overrides[prop.name].applyVal;
		}
		
		if (!applyVal) return;
		
		let modifierVal;
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

const morphElement = (sourceData, targetData, duration, options) => {
	options = options || {};
	
	return new Promise((resolve) => {
		if (!(sourceData instanceof ScannedNode)) {
			// We have to scan the source node
			sourceData = new ScannedNode(sourceData);
		}
		
		const source = sourceData.node;
		
		// Hide the source
		source.style.display = 'none';
		
		// Read css from target
		if (!(targetData instanceof ScannedNode)) {
			// We have to scan the source node
			targetData = new ScannedNode(targetData);
		}
		
		const target = targetData.node;
		let targetPlaceholder;
		
		if (!target.getAttribute('data-morph-in-place')) {
			// Create a placeholder at the target location to maintain scrolling
			targetPlaceholder = document.createElement(target.tagName);
			
			//console.log('------- Placeholder');
			applyStyles(targetPlaceholder, targetData, {
				modifier: (prop) => {
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
		}
		
		// Apply source css to target
		//console.log('------- Target move to source');
		applyStyles(target, sourceData);
		
		if (!target.getAttribute('data-morph-in-place')) {
			target.style.margin = '0px';
			target.style.position = 'absolute';
			document.body.appendChild(target);
		}
		
		setTimeout(() => {
			target.style.transition = `all ${duration}ms`;
			
			// Apply target css to target
			//console.log('------- Target move to target');
			applyStyles(target, targetData, {
				modifier: (prop) => {
					switch (prop.name) {
						case 'top':
							return document.body.scrollTop;
						
						case 'left':
							return document.body.scrollLeft;
					}
				}
			});
		}, 1);
		
		const morphData = {
			target,
			targetData,
			targetPlaceholder
		};
		
		morphData.timeoutId = setTimeout(() => {
			resolve(morphData);
		}, duration);
		
		registerMorph(morphData);
	});
};

const endMorph = (morphData) => {
	removeMorph(morphData);
	
	// Check that our DOM is still viable and not changed since we started this animation
	morphData.targetData.parentNode.insertBefore(morphData.target, morphData.targetData.nextSibling);
	
	if (!morphData.target.getAttribute('data-morph-in-place')) {
		morphData.targetPlaceholder.parentNode.removeChild(morphData.targetPlaceholder);
	}
	
	morphData.target.removeAttribute('style');
};

const cancelAllMorphs = () => {
	//console.log('Cancelling all morphs');
	
	// Cancel all morph functions
	for (let i = activeMorphs.length - 1; i >= 0; i--) {
		cancelMorph(activeMorphs[i]);
	}
	
	// Clear the canceller array
	activeMorphs.length = 0;
};

const cancelMorph = (morphData) => {
	// Cancel single morph
	clearTimeout(morphData.timeoutId);
	
	// Return the target to its original settings
	endMorph(morphData);
};

export default morphElement;

export {
	ScannedNode,
	trackProps,
	endMorph,
	cancelMorph,
	cancelAllMorphs
}