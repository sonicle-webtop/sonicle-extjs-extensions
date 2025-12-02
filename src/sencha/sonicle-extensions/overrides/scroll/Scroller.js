/**
 * Override original {@link Ext.scroll.Scroller}
 * - Add support to trackPosition config, add refreshScrollCls and isScrollPosAtBoundary methods.
 */
Ext.define('Sonicle.scroll.Scroller', {
	override: 'Ext.scroll.Scroller',
	
	config: {
		
		/**
		 * @cfg {Boolean|String} [trackPosition=false]
		 * Specifies a string that activates tracking for available directions:
		 * use `h` for horizontal, `v` for vertical. Set to `true` (or `vh`) 
		 * to activate both horizontal and vertical tracking.
		 */
		trackPosition: false
		
		/*
		verticalBeginSelector: undefined,
		
		verticalEndSelector: undefined,
		
		horizontalBeginSelector: undefined,
		
		horizontalEndSelector: undefined
		*/
	},
	
	privates: {
		updateSize: function(size) {
			var me = this,
				trackDirection = me.computeTrackPositionDirection();
			me.callParent(arguments);
			if (trackDirection && me.getElement()) {
				// Check positionDirty: if already dirty, calling getPosition() will
				// issue a updateDomScrollPosition implicitly. (See {@link #getPosition source})
				// Otherwise force a refresh of scroll CSS classes.
				if (me.positionDirty) {
					me.getPosition();
				} else {
					me.refreshScrollCls(trackDirection, me.getPosition(), me.getMaxPosition(), me.getScrollElement(), me.elementCls);
				}
			}
		},
		
		computeTrackPositionDirection: function() {
			var track = this.getTrackPosition(), dir;
			if (Ext.isBoolean(track) && track === true) dir = 'vh';
			else if (Ext.isString(track)) dir = track;
			return dir;
		},
		
		updateDomScrollPosition: function(silent) {
			var me = this,
				trackDirection = me.computeTrackPositionDirection(),
				ret = me.callParent(arguments);
			if (trackDirection) me.refreshScrollCls(trackDirection, ret, me.getMaxPosition(), me.getScrollElement(), me.elementCls);
			return ret;
		},
		
		refreshScrollCls: function(direction, pos, maxPos, scrollEl, baseCls) {
			direction = direction || '';
			if (scrollEl && !scrollEl.destroyed) {
				var me = this,
					/*
					lookupEl = function(rootEl, selector) {
						if (rootEl && Ext.isString(selector)) {
							return Ext.fly(Ext.dom.Query.selectNode(selector, rootEl.dom));
						} else {
							return rootEl;
						}
					},
					*/
					addOrRemoveCls = function(el, addOrRemove, forceRemove) {
						if (el) {
							addOrRemove = Ext.Array.from(addOrRemove);
							for (var i=0; i<addOrRemove.length; i++) {
								el[forceRemove === true || addOrRemove[i][0] === false ? 'removeCls' : 'addCls'](addOrRemove[i][1]);
							}
						}
					},
					vertical = direction.indexOf('v') !== -1,
					horizontal = direction.indexOf('h') !== -1,
					lower, upper;
				
				addOrRemoveCls(scrollEl, [vertical, baseCls + '-track-y']);
				if (vertical) {
					lower = me.isScrollPosAtBoundary('lower', pos.y, 0, 5);
					upper = me.isScrollPosAtBoundary('upper', pos.y, maxPos.y, 5);
					addOrRemoveCls(scrollEl, [[lower, baseCls + '-y-pos-begin'], [!lower && !upper, baseCls + '-y-pos-mid'], [upper, baseCls + '-y-pos-end']], lower && upper);
				}
				addOrRemoveCls(scrollEl, [horizontal, baseCls + '-track-x']);
				if (horizontal) {
					lower = me.isScrollPosAtBoundary('lower', pos.x, 0, 5);
					upper = me.isScrollPosAtBoundary('upper', pos.x, maxPos.x, 5);
					addOrRemoveCls(scrollEl, [[lower, baseCls + '-x-pos-begin'], [!lower && !upper, baseCls + '-x-pos-mid'], [upper, baseCls + '-x-pos-end']], lower && upper);
				}
			}
		},
		
		/*
		refreshScrollCls_withSelector: function(direction, pos, maxPos, scrollEl, baseCls) {
			direction = direction || '';
			if (scrollEl && !scrollEl.destroyed) {
				var me = this,
					lookupEl = function(rootEl, selector) {
						if (rootEl && Ext.isString(selector)) {
							return Ext.fly(Ext.dom.Query.selectNode(selector, rootEl.dom));
						} else {
							return rootEl;
						}
					},
					addOrRemoveCls = function(el, addOrRemove, forceRemove) {
						if (el) {
							addOrRemove = Ext.Array.from(addOrRemove);
							for (var i=0; i<addOrRemove.length; i++) {
								el[forceRemove === true || addOrRemove[i][0] === false ? 'removeCls' : 'addCls'](addOrRemove[i][1]);
							}
						}
					},
					vertical = direction.indexOf('v') !== -1,
					horizontal = direction.indexOf('h') !== -1,
					lower, upper;
				
				addOrRemoveCls(scrollEl, [vertical, baseCls + '-track-y']);
				if (vertical) {
					lower = me.isScrollPosAtBoundary('lower', pos.y, 0, 5);
					upper = me.isScrollPosAtBoundary('upper', pos.y, maxPos.y, 5);
					addOrRemoveCls(lookupEl(scrollEl, me.getVerticalBeginSelector()), [[lower, baseCls + '-y-pos-begin'], [!lower && !upper, baseCls + '-y-pos-mid']], lower && upper);
					addOrRemoveCls(lookupEl(scrollEl, me.getVerticalEndSelector()), [[upper, baseCls + '-y-pos-end'], [!lower && !upper, baseCls + '-y-pos-mid']], lower && upper);
				}
				addOrRemoveCls(scrollEl, [horizontal, baseCls + '-track-x']);
				if (horizontal) {
					lower = me.isScrollPosAtBoundary('lower', pos.x, 0, 5);
					upper = me.isScrollPosAtBoundary('upper', pos.x, maxPos.x, 5);
					addOrRemoveCls(lookupEl(scrollEl, me.getVerticalBeginSelector()), [[lower, baseCls + '-x-pos-begin'], [!lower && !upper, baseCls + '-x-pos-mid']], lower && upper);
					addOrRemoveCls(lookupEl(scrollEl, me.getVerticalEndSelector()), [[upper, baseCls + '-x-pos-end'], [!lower && !upper, baseCls + '-x-pos-mid']], lower && upper);
				}
			}
		},
		*/
		
		isScrollPosAtBoundary: function(type, currentPos, boundaryPos, pxThreshold) {
			if (Ext.isNumber(currentPos) && Ext.isNumber(boundaryPos)) {
				var pos = Math.floor(currentPos);
				if ('lower' === type) {
					return (pos >= boundaryPos) && (pxThreshold > 0 && pos < (boundaryPos + pxThreshold));
				} else {
					return (pos <= boundaryPos) && (pxThreshold > 0 && pos > (boundaryPos - pxThreshold));
				}
			}
		}
	}
});
