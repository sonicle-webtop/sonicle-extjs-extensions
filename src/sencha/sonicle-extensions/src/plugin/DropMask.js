/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.plugin.DropMask', {
	extend: 'Ext.plugin.Abstract',
    alias: 'plugin.sodropmask',
	mixins: ['Sonicle.mixin.DragOverMonitor'],
	
	text: 'Drop here',
	dropMaskCls: 'so-dropmask',
	
	init: function(cmp) {
		var me = this;
		me.setCmp(cmp);
		me.initDragMonitoring(cmp);
	},
	
	destroy: function() {
		var me = this,
			cmp = me.getCmp();
		me.cleanupDragMonitoring(cmp);
		me.setCmp(null);
	},
	
	shouldSkipMasking: function(dragOp) {
		return false;
	},
	
	onDragOperationEnter: function(dragOp) {
		//console.log('onDragOperationEnter');
		var me = this;
		if (me.shouldSkipMasking(dragOp) === false) {
			me.getCmp().mask(me.text, me.dropMaskCls);
		}
	},
	
	onDragOperationLeave: function(dragOp) {
		//console.log('onDragOperationLeave');
		var me = this;
		if (me.shouldSkipMasking(dragOp) === false) {
			me.getCmp().unmask();
		}
	}
});
