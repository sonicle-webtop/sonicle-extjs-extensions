/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.button.Toggle', {
	extend: 'Ext.button.Button',
	alias: ['widget.sotogglebutton'],
	requires: [
		'Sonicle.Utils'
	],
	
	cls: 'so-'+'toggle-button',
	
	/**
	 * @cfg {Boolean} disablePressedStyle
	 * Set to `true` to turn-off pressed styling.
	 */
	
	/**
	 * @cfg {String} iconCls
	 * One or more space separated CSS classes to be applied to the icon 
	 * element when the button is both pressed/not pressed.
	 * It's meant to be used instead of {@link #onIconCls} and {@link offIconCls}.
	 */
	
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
	 * @cfg {Number/String} glyph
	 * A numeric unicode character code to use as the icon  
	 * element when the button is both pressed/not pressed.
	 * It's meant to be used instead of {@link onGlyph} and {@link offGlyph}.
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
	 * @cfg {String} text
	 * Text to display when the button is both pressed/not pressed.
	 * It's meant to be used instead of {@link onText} and {@link offText}.
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
	 * @cfg {String} tooltip
	 * Tooltip to display when the button is both pressed/not pressed.
	 * It's meant to be used instead of {@link onTooltip} and {@link offTooltip}.
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
		this.callParent([Ext.apply(cfg || {}, {enableToggle: true})]);
	},
	
	/*
	constructor: function(cfg) {
		var me = this,
			icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, ['disablePressedStyle']);
		
		cfg.enableToggle = true;
		if (icfg.disablePressedStyle === true) cfg._pressedCls = me._pressedCls + '-disarmed';
		me.callParent([cfg]);
	},
	*/
	
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
