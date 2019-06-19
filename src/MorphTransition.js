/* eslint-env browser */
// We (supposedly) know what we're doing
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import {timeoutsShape} from 'react-transition-group/utils/PropTypes';
import morphElement, {ScannedNode, cancelAllMorphs, endMorph} from './irrelon-morph';

function areChildrenDifferent (oldChildren, newChildren) {
	if (oldChildren === newChildren) {
		return false;
	}
	
	return !(React.isValidElement(oldChildren) &&
		React.isValidElement(newChildren) &&
		oldChildren.key != null &&
		oldChildren.key === newChildren.key);
}

function buildClassName (className, state) {
	switch (state) {
		case 'enter':
			return `${className} enter`;
		case 'entering':
			return `${className} enter ${className} enter active`;
		case 'entered':
			return `${className} enter.done`;
		case 'exit':
			return `${className} exit`;
		case 'exiting':
			return `${className} exit ${className} exit active`;
		case 'exited':
			return `${className} exit done`;
		default:
			return ''
	}
}

function shouldDelayEnter (children) {
	return React.isValidElement(children) && children.type.pageTransitionDelayEnter;
}

class MorphTransition extends React.Component {
	constructor (props) {
		super(props);
		
		const {children} = props;
		this.state = {
			state: 'enter',
			isIn: !shouldDelayEnter(children),
			currentChildren: children,
			nextChildren: null,
			renderedChildren: children,
			showLoading: false,
		};
	}
	
	componentDidMount () {
		if (shouldDelayEnter(this.props.children)) {
			this.setState({
				timeoutId: this.startEnterTimer()
			});
		}
	}
	
	componentDidUpdate (prevProps, prevState) {
		const {
			currentChildren,
			renderedChildren,
			nextChildren,
			isIn,
			state,
		} = this.state;
		const {children} = this.props;
		const hasNewChildren = areChildrenDifferent(currentChildren, children);
		const needsTransition = areChildrenDifferent(renderedChildren, children);
		
		if (hasNewChildren) {
			// We got a new set of children while we were transitioning some in
			// Immediately start transitioning out this component and update the next
			// component
			this.setState({
				isIn: false,
				nextChildren: children,
				currentChildren: children,
			});
			if (this.state.timeoutId) {
				clearTimeout(this.state.timeoutId)
			}
			//console.log('New DOM changes');
		} else if (needsTransition && !isIn && state === 'exited') {
			if (shouldDelayEnter(nextChildren)) {
				// Wait for the ready callback to actually transition in, but still
				// mount the component to allow it to start loading things
				this.setState({
					renderedChildren: nextChildren,
					nextChildren: null
				})
			} else {
				// No need to wait, mount immediately
				this.setState({
					isIn: true,
					renderedChildren: nextChildren,
					nextChildren: null,
					timeoutId: this.startEnterTimer()
				})
			}
		} else if (prevState.showLoading && !this.state.showLoading) {
			// We hid the loading indicator; now that that change has been flushed to
			// the DOM, we can now bring in the next component!
			this.setState({
				isIn: true,
			})
		}
	}
	
	componentWillUnmount () {
		if (this.state.timeoutId) {
			clearTimeout(this.state.timeoutId);
		}
	}
	
	onEnter (pageElem) {
		//console.log('onEnter');
		// It's safe to reenable scrolling now
		this.disableScrolling = false;
		this.setState({
			state: 'enter',
			showLoading: false
		});
		
		if (!this._sourceMorphElements) {
			return;
		}
		
		// Find the source and target pairs
		const promiseArr = [];
		
		this._sourceMorphElements.forEach((sourceItem) => {
			const sourceNode = sourceItem.node;
			const customTargetSelector = sourceNode.getAttribute("data-morph-target");
			const targetSelector = customTargetSelector || "#" + sourceItem.node.id;
			
			promiseArr.push(new Promise((resolve) => {
				const target = pageElem.querySelector(targetSelector);
				
				if (target) {
					morphElement(sourceItem, target, parseInt(sourceNode.getAttribute('data-morph-ms'), 10) || 600).then((morphData) => {
						endMorph(morphData);
						resolve();
					});
				} else {
					resolve();
				}
			}));
		});
		
		Promise.all(promiseArr).then(() => {
			this.onMorphComplete(pageElem);
		});
	}
	
	onEntering () {
		//console.log('onEntering');
		this.setState({
			state: 'entering',
		})
	}
	
	scanDomForMorphElements (pageElem) {
		const morphElems = pageElem.querySelectorAll('[data-morph-ms]');
		const sourceSnapshot = [];
		
		if (morphElems && morphElems.length) {
			for (let i = 0; i < morphElems.length; i++) {
				sourceSnapshot.push(new ScannedNode(morphElems[i]));
			}
		}
		
		return sourceSnapshot;
	}
	
	onEntered (pageElem) {
		//console.log('onEntered');
		this.setState({
			state: 'entered',
		});
		
		setTimeout(() => {
			this._sourceMorphElements = this.scanDomForMorphElements(pageElem);
			//console.log('On entered detected ' + this._sourceMorphElements.length + ' new source elements');
		}, 1);
	}
	
	onMorphComplete (pageElem) {
		this._sourceMorphElements = this.scanDomForMorphElements(pageElem);
		//console.log('On entered detected ' + this._sourceMorphElements.length + ' new source elements');
	}
	
	onExit () {
		//console.log('onExit');
		// Disable scrolling until this component has unmounted
		this.disableScrolling = true;
		this.setState({
			state: 'exit',
		});
		
		cancelAllMorphs();
	}
	
	onExiting () {
		//console.log('onExiting');
		this.setState({
			state: 'exiting',
		});
	}
	
	onExited () {
		//console.log('onExited');
		this.setState({
			state: 'exited',
			renderedChildren: null
		});
	}
	
	onChildLoaded () {
		//console.log('Child loaded');
		if (this.state.timeoutId) {
			clearTimeout(this.state.timeoutId)
		}
		
		this.setState({
			isIn: true,
		});
	}
	
	startEnterTimer () {
		return setTimeout(() => {
			this.setState({
				showLoading: true,
			})
		}, this.props.loadingDelay)
	}
	
	render () {
		const {timeout, loadingCallbackName} = this.props;
		const {renderedChildren: children, state} = this.state;
		
		if (['entering', 'exiting', 'exited'].indexOf(state) !== -1) {
			// Need to reflow!
			// eslint-disable-next-line no-unused-expressions
			if (document.body) {
				document.body.scrollTop
			}
		}
		
		const containerClassName = buildClassName(this.props.classNames, state);
		
		return (
			<Transition
				timeout={timeout}
				in={this.state.isIn}
				appear
				onEnter={(...args) => this.onEnter(...args)}
				onEntering={(...args) => this.onEntering(...args)}
				onEntered={(...args) => this.onEntered(...args)}
				onExit={(...args) => this.onExit(...args)}
				onExiting={(...args) => this.onExiting(...args)}
				onExited={(...args) => this.onExited(...args)}
			>
				<div className={containerClassName}>
					{children &&
					React.cloneElement(children, {
						[loadingCallbackName]: () => this.onChildLoaded(),
					})}
				</div>
			</Transition>
		)
	}
}

MorphTransition.propTypes = {
	children: PropTypes.node.isRequired,
	classNames: PropTypes.string.isRequired,
	timeout: PropTypes.number.isRequired,
	loadingComponent: PropTypes.element,
	loadingDelay: PropTypes.number,
	loadingCallbackName: PropTypes.string,
	/* eslint-disable react/require-default-props */
	loadingTimeout: (props, ...args) => {
		let pt = timeoutsShape;
		if (props.loadingComponent) {
			pt = pt.isRequired
		}
		return pt(props, ...args)
	},
	loadingClassNames: (props, ...args) => {
		let pt = PropTypes.string;
		if (props.loadingTimeout) {
			pt = pt.isRequired
		}
		return pt(props, ...args)
	},
	/* eslint-enable react/require-default-props */
	monkeyPatchScrolling: PropTypes.bool,
};

MorphTransition.defaultProps = {
	loadingComponent: null,
	loadingCallbackName: 'pageTransitionReadyToEnter',
	loadingDelay: 500,
	monkeyPatchScrolling: false,
};

export default MorphTransition
