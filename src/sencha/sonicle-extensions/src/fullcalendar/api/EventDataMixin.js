/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.api.EventDataMixin', {
	extend: 'Ext.Mixin',
	requires: [
		'Sonicle.Object',
		'Sonicle.ColorUtils'
	],
	
	mixinConfig: {
		id: 'sofullcalendareventdata'
	},
	
	idField: 'id',
	allDayField: 'allDay',
	startField: 'start',
	endField: 'end',
	titleField: 'title',
	colorField: 'color',
	colorShadeMode: 'brightness',
	resourceIdField: undefined, // Relates an event to a resource
	
	toFCEvent: function(opts) {
		opts = opts || {};
		var me = this,
			SoO = Sonicle.Object,
			obj = {
				id: me.getId(),
				allDay: SoO.booleanValue(me.get(me.allDayField), false),
				start: Ext.Date.format(me.get(me.startField), 'Y-m-d H:i:s').replace(' ', 'T'),
				end: Ext.Date.format(me.get(me.endField), 'Y-m-d H:i:s').replace(' ', 'T'),
				title: me.get(me.titleField),
				color: me.getColor(),
				textColor: Sonicle.ColorUtils.bestForeColor(me.getColor(), me.colorShadeMode || 'fixed'),
				extendedProps: me.fcPrepareEventExtendedProps()
			},
			editable = me.fcIsEditable(),
			startEditable = me.fcIsStartEditable(),
			durationEditable = me.fcIsDurationEditable();
		
		if (Ext.isString(me.resourceIdField)) Ext.apply(obj, { resourceId: Sonicle.Object.stringValue(me.get(me.resourceIdField)) });
		if (Ext.isBoolean(editable)) Ext.apply(obj, { editable: editable });
		if (Ext.isBoolean(startEditable)) Ext.apply(obj, { startEditable: startEditable });
		if (Ext.isBoolean(durationEditable)) Ext.apply(obj, { durationEditable: durationEditable });
		return obj;
	},
	
	privates: {
		getColor: function() {
			return this.get(this.colorField);
		},
		
		fcIsEditable: function() {
			return undefined;
		},

		fcIsStartEditable: function() {
			return undefined;
		},

		fcIsDurationEditable: function() {
			return undefined;
		},

		fcPrepareEventExtendedProps: function() {
			var me = this;
			return {
				startDate: me.get(me.startField),
				endDate: me.get(me.endField),
				isAllDay: me.get(me.allDayField),
				color: me.getColor()
			};
		}
	}	
});
