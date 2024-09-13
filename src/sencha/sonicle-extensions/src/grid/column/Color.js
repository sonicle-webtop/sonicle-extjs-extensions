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
	noLabelInnerCls: 'so-'+'colorcolumn-nolabel',
	swatchElCls: 'so-'+'colorcolumn-swatch',
	labelElCls: 'so-'+'colorcolumn-label',
	
	/**
	 * @cfg {swatch|text} colorize [colorize=swatch]
	 * Specify the target element on which apply the color: the marker itself or display text (label).
	 */
	colorize: 'swatch',
	
	/**
	 * @cfg {rounded|square|circle} [swatchGeometry=rounded]
	 * Changes the geometry of the swatch that displays the color.
	 */
	swatchGeometry: 'rounded',
	
	/**
	 * @cfg {Function} [getColor]
	 * A function which returns the value for color.
	 */
	
	/**
	 * @cfg {Boolean} hideLabel
	 * False to display column's value next to the icon.
	 */
	hideLabel: false,
	
	/**
	 * @cfg {Function} getLabel
	 * A function which returns the label to display next to the color swatch.
	 */
	getText: null,
	
	/**
	 * @cfg {String} labelField
	 * The underlying {@link Ext.data.Field#name data field name} to bind as display value.
	 */
	
	/**
	 * @cfg {String} labelCls
	 * An optional extra CSS class that will be added to this component's label.
	 */
	
	/**
	 * @cfg {String} tooltipField
	 * The fieldName for getting the tooltip to apply to icon image.
	 * To calculate value dynamically, configure the column with a `getTooltip` function.
	 */
	tooltipField: null,
	
	/**
	 * @cfg {Function} getTooltip
	 * A function which returns a computed tooltip to apply to icon image.
	 */
	getTooltip: null,
	
	constructor: function() {
		this.scope = this;
		this.callParent(arguments);
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		if (me.hideLabel === true) {
			me.innerCls += ' ' + me.noLabelInnerCls;
		}
	},
	
	defaultRenderer: function(value, cellValues) {
		var me = this,
			SoS = Sonicle.String,
			SoU = Sonicle.Utils,
			BL = Sonicle.view.BoundList,
			swatchElCls = me.swatchElCls,
			geomSwatchElCls = swatchElCls + '-' + me.swatchGeometry,
			hasLabel = me.hideLabel !== true,
			labelElCls = me.labelElCls,
			labelCls = SoS.deflt(me.labelCls, ''),
			colorizeSwatch = (me.colorize === 'swatch'),
			rec = cellValues ? cellValues.record : null,
			color = SoU.rendererEvalValue(value, rec, me.colorField || me.dataIndex, me.getColor),
			tt = SoU.rendererEvalValue(value, rec, me.tooltipField, me.getTooltip, null),
			ttAttrs = '', label;
		
		if (hasLabel || !colorizeSwatch) label = SoS.deflt(SoU.rendererEvalValue(value, rec, me.labelField, me.getLabel), '', Ext.String.htmlEncode);
		if (tt) ttAttrs = Sonicle.Utils.generateTooltipAttrs(tt);
		if (colorizeSwatch) {
			return '<div class="' + swatchElCls + ' ' + geomSwatchElCls + '" style="' + BL.generateColorStyles('swatch', color) + '" ' + ttAttrs + '></div>' + (hasLabel ? '<span class="' + labelElCls + ' ' + labelCls + '">' + label + '</span>' : '');
		} else {
			return '<span class="' + labelElCls + ' ' + labelCls + '" style="' + BL.generateColorStyles('text', color) + '" ' + ttAttrs + '>' + label + '</span>';
		}
	}
});
