/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.ColorDisplay', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.socolordisplayfield'],
	
	/**
	 * @cfg {square|circle} [geometry=square]
	 * Sets the color marker geomerty.
	 */
	geometry: 'square',
	
	fieldCls: 'so-' + 'form-colordisplay-field',
	fieldBodyCls: 'so-' + 'form-colordisplay-field-body',
	
	onRender: function() {
		var me = this,
				size = 16;
		me.callParent();
		if (me.inputEl) {
			me.inputEl.applyStyles({
				//width: size + 'px',
				//height: size + 'px',
				borderRadius: me.buildRadius()
			});
		}
	},
	
	setValue: function(value) {
		var me = this;
		if (me.rendered) {
			me.inputEl.applyStyles({
				backgroundColor: value
			});
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
	},
	
	privates: {
		buildRadius: function() {
			return (this.geometry === 'circle') ? '50%' : null;
		}
	}
});
