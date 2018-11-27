/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.DragZone', {
	extend: 'Ext.view.DragZone',
	
	/**
	 * @template
	 * An false function by default, but provided so that you can disable dragging 
	 * below some custom conditions.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Ext.data.Model} record The record mousedowned upon.
	 * @param {HTMLElement} item The grid row mousedowned upon.
	 * @param {Ext.event.Event} e The mousedown event.
	 * @return {Boolean} `true` to disallow dragging, `false` otherwise
	 */
	isDragDisallowed: Ext.returnFalse,
	
	/**
	 * @template
	 * An empty function by default, but provided so that you can return custom
	 * data to append into original dragData object.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Object} data The original dragData object.
	 * @return {Object} New data to append
	 */
	getDragItemData: Ext.emptyFn,
	
	/**
	 * @template
	 * An empty function by default, but provided so that you can specify a custom drag text.
	 * @param {Ext.view.View} view The underlyning view object
	 * @param {Object} data The original dragData object.
	 * @return {String} The drag text to display
	 */
	getDragItemText: Ext.emptyFn,
	
	isPreventDrag: function(e, record, item, index) {
		var me = this;
		return me.callParent(arguments) || me.isDragDisallowed(me.view, record, item, index, e);
	},
	
	getDragData: function(e) {
		var me = this,
				data = me.callParent(arguments);
		if (Ext.isObject(data)) {
			data = Ext.apply(data, {itemRecord: me.view.getRecord(data.item)});
			return Ext.applyIf(data, me.getDragItemData(me.view, data, e) || {});
		} else {
			return data;
		}
	},
	
	getDragText: function() {
		var me = this,
				txt = me.getDragItemText(me.view, me.dragData);
		return Ext.isString(txt) ? txt : me.callParent(arguments);
	}
});
