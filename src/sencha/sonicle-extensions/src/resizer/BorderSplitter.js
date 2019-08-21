/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.resizer.BorderSplitter', {
	extend: 'Ext.resizer.BorderSplitter',
	alias: ['widget.sobordersplitter'],
	
	refresh: function() {
		var me = this,
				cmp = this.getCollapseTarget(),
				ss = cmp.lockSplitter;
		
		if (me.tracker) {
			me.mun(me.tracker, 'beforedragstart', me.preventTrackerDrag, me);
			if (ss === true) me.mon(me.tracker, 'beforedragstart', me.preventTrackerDrag, me);
		}
	},
	
	toggleTargetCmp: function() {
		var cmp = this.getCollapseTarget();
		if (!cmp.lockSplitter) this.callParent(arguments);
	},
	
	preventTrackerDrag: function() {
		return false;
	}
});
