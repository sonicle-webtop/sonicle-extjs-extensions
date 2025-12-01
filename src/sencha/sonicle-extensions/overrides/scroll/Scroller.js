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
					vertical = direction.indexOf('v') !== -1,
					horizontal = direction.indexOf('h') !== -1;
				
				if (vertical) {
					scrollEl[me.isScrollPosAtBoundary('lower', pos.y, 0, 5) ? 'addCls' : 'removeCls'](baseCls + '-y-at-start');
					scrollEl[me.isScrollPosAtBoundary('upper', pos.y, maxPos.y, 5) ? 'addCls' : 'removeCls'](baseCls + '-y-at-end');
				}
				if (horizontal) {
					scrollEl[me.isScrollPosAtBoundary('lower', pos.x, 0, 5) ? 'addCls' : 'removeCls'](baseCls + '-x-at-start');
					scrollEl[me.isScrollPosAtBoundary('upper', pos.x, maxPos.x, 5) ? 'addCls' : 'removeCls'](baseCls + '-x-at-end');
				}
			}
		},
		
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
