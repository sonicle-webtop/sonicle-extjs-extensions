/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.button.Toggle', {
	extend: 'Ext.button.Button',
	alias: ['widget.sotogglebutton'],
	
	/**
	 * @cfg {String} onIconCls
	 * One or more space separated CSS classes to be applied to the icon 
	 * element when the button is pressed.
	 */
	
	/**
	 * @cfg {String} offIconCls
	 * One or more space separated CSS classes to be applied to the icon 
	 * element when the button is not pressed.
	 */
	
	/**
	 * @cfg {Number/String} onGlyph
	 * A numeric unicode character code to use as the icon 
	 * when the button is pressed.
	 */
	
	/**
	 * @cfg {Number/String} offGlyph
	 * A numeric unicode character code to use as the icon 
	 * when the button is not pressed.
	 */
	
	/**
	 * @param {String} onText
	 * Text to display when the button is pressed.
	 */
	
	/**
	 * @param {String} offText
	 * Text to display when the button is pressed.
	 */
	
	/**
	 * @param {String} onTooltip
	 * Tooltip to display when the button is pressed.
	 */
	
	/**
	 * @param {String} offTooltip
	 * Tooltip to display when the button is pressed.
	 */
	
	constructor: function(cfg) {
		this.callParent([Ext.apply(cfg || {}, {
				enableToggle: true
		})]);
	},
	
	beforeRender: function() {
		var me = this;
		me.callParent();
		me.syncConfigs(me.pressed);
	},
	
	toggle: function(state, suppressEvent) {
		var me = this;
		me.callParent(arguments);
		me.syncConfigs(me.pressed);
	},
	
	/*
	onMouseDown: function(e) {
		var me = this;
		me.callParent(arguments);
		if (!me.disabled && e.button === 0) {
			me.syncConfigs(me.pressed);
		}
	},
	
	onMouseUp: function(e) {
		var me = this;
		me.callParent(arguments);
		if (!me.destroyed && e.button === 0) {
			if (!me.pressed) {
				me.syncConfigs(me.pressed);
			}
		}
	},
	*/
	
	syncConfigs: function(pressed) {
		var me = this;
		if (pressed) {
			if (me.onIconCls) me.setIconCls(me.onIconCls);
			if (me.onGlyph) me.setGlyph(me.onGlyph);
			if (me.onText) me.setText(me.onText);
			if (me.onTooltip) me.setTooltip(me.onTooltip);
		} else {
			if (me.offIconCls) me.setIconCls(me.offIconCls);
			if (me.offGlyph) me.setGlyph(me.offGlyph);
			if (me.offText) me.setText(me.offText);
			if (me.offTooltip) me.setTooltip(me.offTooltip);
		}
	}
});
