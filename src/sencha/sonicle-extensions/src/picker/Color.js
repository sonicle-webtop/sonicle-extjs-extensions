/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.picker.Color', {
	extend: 'Ext.picker.Color',
	alias: ['widget.socolorpicker'],
	
	/**
	 * @cfg {Number} tileSize
	 * The size in pixels of a single color tile. This must track  
	 * real dimensions defined in CSS definitions.
	 */
	tileSize: 24,
	
	/**
	 * @cfg {Number} tilesPerRow
	 * The desired number tiles to display for each row.
	 */
	tilesPerRow: 8,
	
	/**
	 * @cfg {String[]} colors
	 * An array of 6-digit color hex code strings (WITHOUT the # symbol and UPPERCASE).
	 */
	
	onRender: function() {
		var me = this, item, size;
		me.callParent(arguments);
		
		item = me.el.down('.' + me.itemCls, true);
		if (item) {
			size = Ext.fly(item).getWidth() || 24;
			me.setWidth(me.tilesPerRow * size);
			me.setHeight((Ext.isArray(me.colors) ? Math.ceil(me.colors.length/me.tilesPerRow) : 1) * size);
		}
	},
	
	/**
	 * @override select
	 * Override default implementation in order to:
	 * - check item before calling Ext.fly
	 */
	select: function(color, suppressEvent) {
		var me = this,
			selectedCls = me.selectedCls,
			value = me.value,
			el, item;
		
		color = color.replace('#', '');
		if (!me.rendered) {
			me.value = color;
			return;
		}
		
		if (color !== value || me.allowReselect) {
			el = me.el;
			if (me.value) {
				item = el.down('a.color-' + value, true);
				if (item) Ext.fly(item).removeCls(selectedCls);
			}
			item = el.down('a.color-' + color, true);
			if (item) Ext.fly(item).addCls(selectedCls);
			me.value = color;
			if (suppressEvent !== true) {
				me.fireEvent('select', me, color);
			}
		}
	}
});
