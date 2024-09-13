/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.api.DropZone', {
	extend: 'Ext.dd.DropZone',
	requires: [
		'Sonicle.fullcalendar.api.DnDMgr'
	],
	
	ddGroup: 'socalendar',
	
	getTargetFromEvent: function(e) {
		return false;
	},
	
	getDropDataFromNode: function(node, source, e, data) {
		return false;
	},
	
	onNodeOver: function(node, source, e, data) {
		var dropData;
		if (dropData = this.getDropDataFromNode(node, source, e, data)) {
			return Sonicle.fullcalendar.api.DnDMgr.performOver(source, e, data, dropData);
		}
		return false;
	},
	
	onNodeDrop: function(node, source, e, data) {
		var dropData;
		if (dropData = this.getDropDataFromNode(node, source, e, data)) {
			return Sonicle.fullcalendar.api.DnDMgr.performDrop(source, e, data, dropData);
		}
	}
});