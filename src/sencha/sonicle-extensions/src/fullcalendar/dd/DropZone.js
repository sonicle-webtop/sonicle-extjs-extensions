/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.dd.DropZone', {
	extend: 'Ext.dd.DropZone',
	
	/**
	 * @cfg {Sonicle.fullcalendar.FullCalendar} calendar
	 */
	calendar: undefined,
	
	ddGroup: 'socalendar',
	
	constructor: function(el, cfg) {
		var me = this;
		if (Ext.isEmpty(cfg.calendar)) Ext.raise('Config `calendar` is mandatory');
		me.callParent(arguments);
	},
	
	getTargetFromEvent: function(e) {
		var fc = this.calendar.calendar,
			fcddata = Sonicle.fullcalendar.FullCalendar.fcExtractDragData(fc);
		// We actually do NOT have a valid el to return: return the extracted DD data.
		if (fcddata && fcddata.allowed) return fcddata;
		return false;
	},
	
	onNodeOver: function(node, source, e, data) {
		if (node) {
			var op = source.dragOperation(node.context, e);
			source.proxy.updateMessage(op, node.start, node.end, node.allDay || node.viewAllDay);
			if (node.allDayMutation === true && source.isAllDayMutationDisabled()) {
				return false;
			} else {
				return source.proxy.getDropAllowedCls(op);
			}
		} else {
			source.proxy.setMessage(null);
			return false;
		}
	},
	
	onNodeDrop: function(node, source, e, data) {
		if ('selection' === node.context) source.selectionDrop(node.start, node.end, node.allDay);
		// We always return true to hide repairing on origin component.
		return true;
	}
});
