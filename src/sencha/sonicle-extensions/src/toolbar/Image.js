/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.toolbar.Image', {
	extend: 'Ext.toolbar.Item',
	alias: ['widget.sotbimage', 'widget.tbimage'],
	
	/**
	 * @cfg {"small"/"medium"/"large"} scale
	 * The size of the Image: 16px, 24px, 32px.
	 */
	scale: 'small',
	
	autoEl: 'i',
	componentCls: 'so-tbimage',
	
	onRender: function(parentNode, containerIdx) {
		var me = this;
		me.callParent(arguments);
		me.el.addCls(me.componentCls+'-'+me.scale);
	},
	
	setScale: function(scale) {
		var me = this,
			oldScale = me.scale;
		if (me.rendered) {
			me.el.removeCls(me.componentCls+'-'+oldScale);
			me.el.addCls(me.componentCls+'-'+scale);
		}
		me.scale = scale;
	}
});