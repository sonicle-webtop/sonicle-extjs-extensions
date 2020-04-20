/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.ColorDisplay', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.socolordisplayfield'],
	uses: [
		'Sonicle.String'
	],
	
	/**
	 * @cfg {rounded|square|circle} [swatchGeometry=rounded]
	 * Sets the color marker geomerty.
	 */
	swatchGeometry: 'rounded',
	
	fieldCls: 'so-' + 'colordisplay-field',
	fieldBodyCls: 'so-' + 'colordisplay-field-body',
	swatchCls: 'so-'+'colordisplay-swatch',
	outlineBaseCls: 'so-'+'colordisplay-outline',
	
	onRender: function() {
		var me = this;
		me.callParent();
		if (me.inputEl) {
			me.inputEl.addCls(me.swatchCls + '-' + me.swatchGeometry);
		}
	},
	
	setValue: function(value) {
		var me = this;
		if (me.rendered) {
			me.inputEl.applyStyles({
				backgroundColor: value
			});
			if (Sonicle.String.iequals(value, '#FFFFFF')) {
				me.inputEl.addCls(me.outlineBaseCls + '-light');
			} else {
				me.inputEl.removeCls(me.outlineBaseCls + '-light');
			}
		}
		return me.callParent(arguments);
	},
	
	getDisplayValue: function() {
		var me = this,
				display = me.callParent();
		
		if (me.renderer) {
			return display;
		} else {
			return '<div />';
		}
	}
});
