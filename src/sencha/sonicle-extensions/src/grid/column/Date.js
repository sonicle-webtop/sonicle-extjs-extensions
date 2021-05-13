/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Date', {
	extend: 'Ext.grid.column.Date',
	alias: 'widget.sodatecolumn',
	uses: [
		'Sonicle.Utils'
	],
	
	/**
	 * @cfg {String} tipField
	 * The fieldName for getting the tooltip to apply to to value.
	 * To determine the class dynamically, configure the column with a `getTip` function.
	 */
	tipField: null,
	
	/**
	 * @cfg {Function} getTip
	 * A function which returns the tooltip to apply to value.
	 */
	getTip: null,
	
	defaultRenderer: function(value, cellValues, record/*, rowIdx, colIdx, store, view*/) {
		var me = this,
			SoU = Sonicle.Utils,
			ttip = SoU.rendererEvalValue(value, record, me.tipField, me.getTip, undefined);
		return '<span ' + SoU.generateTooltipAttrs(ttip) + '>' + me.callParent(arguments) + '</span>';
	},
	
	updater: function(cell, value, record/*, view, dataSource*/) {
		Ext.fly(cell).down(this.getView().innerSelector, true).innerHTML = Sonicle.grid.column.Date.prototype.defaultRenderer.call(this, value, record);
	}
});
