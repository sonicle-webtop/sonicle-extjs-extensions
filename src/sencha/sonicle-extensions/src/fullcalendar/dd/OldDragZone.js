/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.dd.OldDragZone', {
	extend: 'Ext.dd.DragZone',
	
	allowCopy: true,
	
	calendar: undefined,
	
	ddGroup: 'socalendar',
	eventSelector: '.fc-event-draggable',
	
	constructor: function(el, cfg) {
		var me = this;
		me.callParent(arguments);
		me.ddel = document.createElement('div');
		me.ddel.className = Ext.baseCSSPrefix + 'grid-dd-wrap';
	},
	
	handleMouseDown: function(e) {
		var me = this,
			data;
		if (me.dragging) {
			return;
		}
		data = me.getDragData(e);
		if (data && me.onBeforeDrag(data, e) !== false) {
			me.dragData = data;
			me.proxy.stop();
			
			// --> Original impl. from Ext.dd.DragDrop#handleMouseDown
			if ((me.primaryButtonOnly && e.button) || me.isLocked()) {
				return;
			}
			me.DDMInstance.refreshCache(me.groups);
			if (me.hasOuterHandles || me.DDMInstance.isOverTarget(e.getPoint(), me)) {
				if (me.clickValidator(e)) {
					me.setStartPosition();
					me.b4MouseDown(e);
					me.onMouseDown(e);
					me.DDMInstance.handleMouseDown(e, me);
					//me.DDMInstance.stopEvent(e); // Do NOT stop event!!!
				}
			}
			// <-- Original impl. from Ext.dd.DragDrop#handleMouseDown
		}
	},
	
	onInitDrag: function(x, y) {
		console.log('onInitDrag');
		var me = this,
			data = me.dragData,
			fcData = Sonicle.fullcalendar.FullCalendar.fcExtractDragData(data.fc);
		
		//Ext.fly(me.ddel).setHtml(me.buildDragText(data.copy, ));
		me.proxy.update(me.ddel);
		me.onStartDrag(x, y);
	},
	
	getDragData: function(e) {
		console.log('getDragData');
		var me = this,
			el = e.getTarget(me.eventSelector),
			ddel;
		
		if (el) {
			return {
				fc: me.calendar.getCalendar(),
				copy: me.allowCopy && e.ctrlKey,
				event: e,
				ddel: me.ddel,
				fromPosition: Ext.fly(el).getXY()
			};
		}
	},
	
	getRepairXY: function(e, data) {
		return data ? data.fromPosition : false;
	},
	
	updateDragText: function(x, y) {
		var me = this,
			cal = me.calendar,
			date = cal.timeGridSlotDate(x, y);
		
		
		console.log('updateDragText');
	},
	
	privates: {
		buildDragText: function(copy, start, end, allDay) {
			var me = this,
				cal = me.calendar,
				opts = {timezone: 'UTC'},
				s = '';
			
			if (!Ext.isDate(start) || !Ext.isDate(end)) return s;
			if (Sonicle.Date.diffDays(start, end) === 0) {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'}, opts);
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(start, {hour: 'numeric', minute: '2-digit'}, opts);
					s += ' - ';
					s += cal.formatDate(end, {hour: 'numeric', minute: '2-digit'}, opts);
				}
			} else {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'}, opts);
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(start, {hour: 'numeric', minute: '2-digit'}, opts);
				}
				s += ' - ';
				s += cal.formatDate(end, {month: 'short', day: '2-digit'}, opts);
				if (!allDay) {
					s += ' ';
					s += cal.formatDate(end, {hour: 'numeric', minute: '2-digit'}, opts);
				}
			}
			return s;
		},
		
		
		
		
		
		
		
		
		
		
		
		buildDragText2: function(copy, start, end, allDay) {
			var me = this,
				cal = me.calendar,
				days = Sonicle.Date.diffDays(start, end),
				s = '';
			
			if (days === 0) {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'});
				s += ' ';
				s += cal.formatDate(start, {hour: 'numeric', minutes: '2-digit'});
				s += ' - ';
				s += cal.formatDate(end, {hour: 'numeric', minutes: '2-digit'});
			} else {
				s += cal.formatDate(start, {month: 'short', day: '2-digit'});
				s += ' ';
				s += cal.formatDate(start, {hour: 'numeric', minutes: '2-digit'});
				s += ' - ';
				s += cal.formatDate(end, {month: 'short', day: '2-digit'});
				s += ' ';
				s += cal.formatDate(end, {hour: 'numeric', minutes: '2-digit'});
			}
			return Ext.String.format(copy ? me.copyText : me.moveText, s);
		}
	}
});
