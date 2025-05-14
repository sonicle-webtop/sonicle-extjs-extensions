/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.api.EventWithResourceDataMixin', {
	extend: 'Sonicle.fullcalendar.api.EventDataMixin',
	requires: [
		'Sonicle.String',
		'Sonicle.Object',
		'Sonicle.ColorUtils'
	],
	
	resourceIdField: '',
	resourceParentIdField: null,
	resourceTitleField: '',
	
	toFCEvent: function(opts) {
		var me = this;
		return Ext.apply(me.callParent(arguments) || {}, {
			resourceId: Sonicle.Object.stringValue(me.get(me.resourceIdField))
		});
	},
	
	toFCResource: function(opts) {
		opts = opts || {};
		var me = this,
			id = Sonicle.Object.stringValue(me.get(me.resourceIdField)),
			obj = {
				id: id,
				title: Sonicle.String.coalesce(me.get(me.resourceTitleField), id),
				eventTextColor: Sonicle.ColorUtils.bestForeColor(me.getColor(), me.colorShadeMode || 'fixed'),
				extendedProps: me.fcPrepareResourceExtendedProps()
			};
			
			if (!Ext.isEmpty(me.resourceParentIdField)) obj.parentId = me.get(me.resourceParentIdField);
			
		return obj;
	},
	
	privates: {
		fcPrepareResourceExtendedProps: function() {
			var me = this;
			return {
				color: me.getColor()
			};
		}
	}
});