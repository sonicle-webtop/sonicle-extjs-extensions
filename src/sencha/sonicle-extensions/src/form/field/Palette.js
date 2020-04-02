/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.Palette', {
	extend: 'Ext.form.field.Picker',
	alias: ['widget.sopalettefield'],
	uses: [
		'Sonicle.String',
		'Sonicle.picker.Color'
	],
	
	/**
	 * @cfg {Boolean} useHash
	 * `True` to prepend # symbol.
	 */
	useHash: true,
	
	/**
	 * @cfg {Number} tilesPerRow
	 * The desired number tiles to display for each row.
	 */
	
	/**
	 * @cfg {String[]} colors
	 * An array of 6-digit color hex code strings (WITHOUT the # symbol and UPPERCASE).
	 */
	
	editable: false,
	regex: /^[\#]?[0-9A-F]{6}$/i,
	invalidText: "Colors must be in hex format (like [#]FFFFFF)",
	matchFieldWidth: false,
	
	afterRender: function() {
		var me = this;
		me.callParent();
		me.updateColor(me.value);
	},
	
	getValue: function() {
		var me = this,
			SoS = Sonicle.String,
			value = me.callParent();
		return me.useHash ? SoS.prepend(value, '#', true) : SoS.removeStart(value, '#');
	},
	
	setValue: function(color) {
		var me = this,
			SoS = Sonicle.String,
			value = me.useHash ? SoS.prepend(color, '#', true) : SoS.removeStart(color, '#');
		me.callParent([value]);
		me.updateColor(value);
	},
	
	updateColor: function(color) {
		var SoS = Sonicle.String,
				el = this.inputEl,
				style = this.hideTrigger ? {cursor: 'pointer'} : {};
		if (el) {
			if (!Ext.isEmpty(color)) {
				Ext.apply(style, {
					color: SoS.prepend(color, '#', true),
					backgroundColor: SoS.prepend(color, '#', true),
					backgroundImage: 'none',
					boxShadow: '0px 0px 0px 1px white inset'
				});
			}
			el.setStyle(style);
		}
	},
	
	createPicker: function() {
		var me = this, cfg = {};
		if (Ext.isArray(me.colors)) cfg.colors = me.colors;
		if (Ext.isNumber(me.tilesPerRow)) cfg.tilesPerRow = me.tilesPerRow;
		return Ext.create(Ext.apply(cfg, {
			xtype: 'socolorpicker',
			pickerField: me,
			floating: true,
			focusable: false, // Key events are listened from the input field which is never blurred
			listeners: {
				select: function() {
					me.collapse();
				}
			}
		}));
	},
			
	onExpand: function() {
		var value = this.getValue();
		if (value) this.picker.select(value, true);
	},
	
	onCollapse: function() {
		this.setValue(this.picker.getValue());
	}
});
