/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Link', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.solinkcolumn',
	
	/**
	 * @cfg {Boolean} [preserveWhitespaces=false]
	 * `True` to encode whitespaces in order to preserve them in the HTML output.
	 */
	preserveWhitespaces: false,
	
	linkCls: 'so-'+'grid-linkcolumn',
	
	/**
	 * @event linkclick
	 * Fires when the link is clicked
	 * @param {Sonicle.grid.column.Link} this LinkColumn
	 * @param {Number} rowIndex The row index
	 * @param {Ext.data.Model} record The record that is being clicked
	 */
	
	processEvent: function(type, view, cell, recordIndex, cellIndex, e, record, row) {
		var me = this, ret;
		if ((e.type === 'click') && (e.target.tagName.toLowerCase() === 'span') && (e.target.className.indexOf(me.linkCls) !== -1)) {
			// FixMe
			// Sometimes this event will fire also at the drop-click ending a 
			// drag operation when source and target elements are the same.
			// I was not able to find a way to filter out this situations.
			// We will dig into this later...
			me.fireEvent('linkclick', me, recordIndex, record);
		} else {
			ret = me.callParent(arguments);
		}
		return ret;
	},
	
	defaultRenderer: function(value) {
		var me = this,
				val = Ext.String.htmlEncode(value);
		if (me.preserveWhitespaces) val = Sonicle.String.htmlEncodeWhitespaces(val);
		return '<span class="' + me.linkCls + '">' + val + '</span>';
	},
	
	updater: function(cell, value) {
		cell = Ext.fly(cell);
		Ext.fly(cell.down(this.getView().innerSelector, true).firstChild).setHtml(value);
	}
});

