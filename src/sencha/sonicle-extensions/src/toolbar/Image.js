/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.toolbar.Image', {
	extend: 'Ext.toolbar.Item',
	alias: ['widget.so-tbimage', 'widget.tbimage'],
	
	/**
	 * @cfg {"small"/"medium"/"large"} scale
	 * The size of the Image: 16px, 24px, 32px.
	 */
	scale: 'small',
	
	/**
	 * @cfg {String} imageCls
	 * The CSS class to apply to the image element.
	 */
	
	renderTpl: [
		'<i id="{id}-imageEl" data-ref="imageEl" class="{baseCls}-image {imageCls}" role="presentation"></i>'
	],
	childEls: ['imageEl'],
	
	baseCls: 'so-tbimage',
	
	autoEl: {
		tag: 'span',
		hidefocus: 'on',
		unselectable: 'on'
	},
	
	initRenderData: function() {
		var me = this;
		return Ext.apply(me.callParent(), {
			imageCls: me.imageCls || ''
		});
	},
	
	onRender: function(parentNode, containerIdx) {
		var me = this;
		me.callParent(arguments);
		me.el.addCls(me.baseCls+'-'+me.scale);
	},
	
	setScale: function(scale) {
		var me = this,
			oldScale = me.scale;
		if (me.rendered) {
			me.el.removeCls(me.baseCls+'-'+oldScale);
			me.el.addCls(me.baseCls+'-'+scale);
		}
		me.scale = scale;
	}
});