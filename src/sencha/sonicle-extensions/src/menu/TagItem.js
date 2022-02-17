/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.menu.TagItem', {
	extend: 'Ext.menu.CheckItem',
	alias: 'widget.somenutagitem',
	
	config: {
		color: null
	},
	
	/**
	 * @cfg {String} [defaultColor=#FFFFFF]
	 * Color to use as default if color is missing.
	 */
	defaultColor: '#FFFFFF',
	
	showCheckbox: false,
	glyph: 'xf02b@\'Font Awesome 5 Free\'',
	checkedCls: 'x-grid-item-selected',
	uncheckedCls: '',
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.applyIconColor(me.color);
	},
	
	updateColor: function(nv, ov) {
		this.applyIconColor(nv);
	},
	
	applyIconColor: function(color) {
		var iconEl = this.iconEl;
		if (iconEl && iconEl.dom) {
			// Use iconEl.dom.style instead of iconEl.getStyle() in order to avoid uncaught exception:
			// Uncaught TypeError: Cannot read property '0' of undefined at constructor.getStyle
			iconEl.dom.style.color = color || this.defaultColor;
			iconEl.dom.style.opacity = 1;
		}
	}
});
