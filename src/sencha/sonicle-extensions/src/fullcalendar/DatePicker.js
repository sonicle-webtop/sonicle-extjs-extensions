/*
 * ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.DatePicker', {
	extend: 'Sonicle.picker.Date',
	alias: 'widget.sofullcalendardatepicker',
	requires: [
		'Sonicle.fullcalendar.api.DropZone'
	],
	
	ddTargetCls: '',
	
	initDDDropZone: function() {
		var me = this,
			tbody = me.eventEl.select('tbody').elements[0];
		
		me.dddz = Ext.create('Ext.dd.DropZone', tbody, {
			view: me,
			
			getTargetFromEvent: function(e) {
				var cellEl = e.getTarget('.x-datepicker-cell', 2, true);
				return (cellEl) ? cellEl : null;
			},
			
			onNodeEnter: function(node, source, e, data) {
				var cls = this.view.ddTargetCls;
				if(!Ext.isEmpty(cls)) Ext.fly(node).addCls(cls);
			},
			
			onNodeOut: function(node, source, e, data) {
				var cls = this.view.ddTargetCls;
				if(!Ext.isEmpty(cls)) Ext.fly(node).removeCls(cls);
			},
			
			onNodeOver: function(node, source, e, data) {
				if (Sonicle.fullcalendar.api.DnDMgr.isDragMine(data)) {
					var dropData = Sonicle.fullcalendar.api.DnDMgr.prepareDropData(true, this.extractDate(node));
					return Sonicle.fullcalendar.api.DnDMgr.performOver(source, e, data, dropData);
				}/* else {
					var self = this,
							dz = source.view.dropZone,
							cellDate = self.extractDate(node),
							newDate = Sonicle.Date.copyDate(cellDate, data.eventStart);
					return dz.updateProxy(e, data, newDate, newDate);
				}*/
			},
			
			onNodeDrop: function(node, source, e, data) {
				if (Sonicle.fullcalendar.api.DnDMgr.isDragMine(data)) {
					var dropData = Sonicle.fullcalendar.api.DnDMgr.prepareDropData(true, this.extractDate(node));
					Sonicle.fullcalendar.api.DnDMgr.performDrop(source, e, data, dropData);
				}/* else {
					var self = this,
							dz = source.view.dropZone,
							cellDate = self.extractDate(node),
							newDate = Sonicle.Date.copyDate(cellDate, data.eventStart);
					dz.onNodeDrop({date: newDate}, source, e, data);
				}*/
			},
			
			extractDate: function(targetEl) {
				var dtEl = targetEl.down('.x-datepicker-date', true);
				return new Date(dtEl.dateValue);
			}
		});
		me.dddz.addToGroup('socalendar');
		
		/*
		if (Ext.ClassManager.get('Sonicle.fullcalendar.api.DropZone') && false) {
			me.fcdz = new Sonicle.fullcalendar.api.DropZone(tbody, {
				getTargetFromEvent: function(e) {
					var cellEl = e.getTarget('.x-datepicker-cell', 2, true);
					return (cellEl) ? cellEl : null;
				},
				
				getDropDataFromNode: function(node, source, e, data) {
					if (node) {
						var el = node.down('.x-datepicker-date', true);
						if (el) {
							return {
								start: new Date(el.dateValue),
								allDay: true
							};
						}
					}
					return false;
				},
				
				onNodeEnter: function(node, source, e, data) {
					var cls = me.ddTargetCls;
					if (!Ext.isEmpty(cls)) Ext.fly(node).addCls(cls);
				},

				onNodeOut: function(node, source, e, data) {
					var cls = me.ddTargetCls;
					if (!Ext.isEmpty(cls)) Ext.fly(node).removeCls(cls);
				}
			});
		}
		*/
	}
});