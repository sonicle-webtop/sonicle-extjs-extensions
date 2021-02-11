/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.column.Color', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.socolorcolumn',
	require: [
		'Sonicle.Utils',
		'Sonicle.view.BoundList'
	],
	
	tdCls: 'so-'+'grid-cell-colorcolumn',
	innerCls: 'so-'+'grid-cell-inner-colorcolumn',
	
	/**
	 * @cfg {swatch|text} colorize [colorize=swatch]
	 * Specify the target element on which apply the color: the marker itself or display text.
	 */
	colorize: 'swatch',
	
	/**
	 * @cfg {rounded|square|circle} [swatchGeometry=rounded]
	 * Changes the geometry of the swatch that displays the color.
	 */
	swatchGeometry: 'rounded',
	
	/**
	 * @cfg {String} colorField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as 
	 * color swatch instead of using an icon. To determine the color dynamically, 
	 * configure the column with a `getColor` function.
	 */
	
	/**
	 * @cfg {Function} [getColor]
	 * A function which returns the value for color.
	 */
	
	/**
	 * @cfg {String} displayField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as display value.
	 */
	
	swatchCls: 'so-'+'grid-colorcolumn-swatch',
	
	constructor: function() {
		this.scope = this;
		this.callParent(arguments);
	},
	
	defaultRenderer: function(value, cellValues) {
		var me = this,
				BL = Sonicle.view.BoundList,
				colorizeSwatch = (me.colorize === 'swatch'),
				geomSwatchCls = me.swatchCls + '-' + me.swatchGeometry,
				rec = cellValues ? cellValues.record : null,
				color = Sonicle.Utils.rendererEvalValue(value, rec, me.colorField, me.getColor),
				display = Sonicle.Utils.rendererEvalValue(value, rec, me.displayField, null, '');
		
		if (colorizeSwatch) {
			return '<div class="' + me.swatchCls + ' ' + geomSwatchCls + '" style="' + BL.generateColorStyles('swatch', color) + '"></div>' + display;
		} else {
			return '<span style="' + BL.generateColorStyles('text', color) + '">' + display + '</span>';
		}
	}
});
