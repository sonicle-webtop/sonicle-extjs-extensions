/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.ViewDropZone', {
	extend: 'Ext.view.DropZone',
	
	indicatorHtml: '<div class="' + Ext.baseCSSPrefix + 'grid-drop-indicator-left" role="presentation"></div><div class="' + Ext.baseCSSPrefix + 'grid-drop-indicator-right" role="presentation"></div>',
	indicatorCls: Ext.baseCSSPrefix + 'grid-drop-indicator',
	
	/**
	 * @template
	 * A `true` function by default, but provided so that you can disable dragging 
	 * under some custom conditions.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Ext.data.Model} record The record mouseovered upon.
	 * @param {HTMLElement} item The grid row mouseovered upon.
	 * @param {Object} data The drag data.
	 * @param {Ext.event.Event} e The mouseover event.
	 * @return {Boolean} `false` to disallow dropping, `true` otherwise
	 */
	isDropAllowed: Ext.returnTrue,
	
	/**
	 * @template
	 * A function to effectively handle the data/record involved in drag operation.
	 * @param {Object} data The drag data.
	 * @param {Ext.data.Model} overRecord The Model over which the drop gesture took place.
	 * @param {String} dropPosition `"before"` or `"after"` depending on whether the cursor is above or below the mid-line of the node.
	 */
	handleNodeDrop: Ext.emptyFn,
	
	/**
	 * Override original onNodeOver to recalculate valid value using isDropAllowed
	 */
	onNodeOver: function(node, dragZone, e, data) {
		var me = this,
				overRecord = me.view.getRecord(node);
		
		if (!Ext.Array.contains(data.records, overRecord)) {
			me.positionIndicator(node, data, e);
		}
		me.valid = me.isDropAllowed(me.view, overRecord, node, data, e, dragZone) === true;
		return me.valid ? me.dropAllowed : me.dropNotAllowed;
	}
});
