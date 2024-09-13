/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.fullcalendar.dd.DragZone', {
	extend: 'Ext.dd.DragZone',
	requires: [
		'Sonicle.fullcalendar.dd.StatusProxy'
	],
	
	/**
	 * @cfg {Boolean} allowCopy
	 * Specifies whether copy operation is allowed or not.
	 */
	allowCopy: true,
	
	/**
	 * @cfg {Sonicle.fullcalendar.FullCalendar} calendar
	 */
	calendar: undefined,
	
	repairHighlightColor: false,
	ddGroup: 'socalendar',
	eventSelector: '.fc-event-draggable',
	daySelector: '.fc-daygrid-day-frame',
	slotSelector: '.fc-timegrid-slot',
	
	constructor: function(el, cfg) {
		var me = this;
		if (Ext.isEmpty(cfg.calendar)) Ext.raise('Config `calendar` is mandatory');
		if (!cfg.proxy) {
			cfg.proxy = new Sonicle.fullcalendar.dd.StatusProxy({
				id: cfg.calendar.el.id + '-drag-status-proxy',
				calendar: cfg.calendar
			});
		}
		me.callParent(arguments);
	},
	
	/**
	 * Override default handleMouseDown in order to NOT call `me.DDMInstance.stopEvent(e)`;
	 * dragging MUST be handled by original impl. in FullCalendar.
	 * This resulting method is a mixup of {@link Ext.dd.DragSource#handleMouseDown} and {@link Ext.dd.DragDrop#handleMouseDown}.
	 */
	handleMouseDown: function(e) {
		// >>> Original impl. from {@link Ext.dd.DragSource#handleMouseDown} STARTS here!
		var me = this,
			data;
		if (me.dragging) {
			return;
		}
		data = me.getDragData(e);
		if (data && me.onBeforeDrag(data, e) !== false) {
			me.dragData = data;
			me.proxy.stop();
			//me.callParent(arguments); // Do NOT call parent!!!
			
			// >>> Original impl. from {@link Ext.dd.DragDrop#handleMouseDown} STARTS here!
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
			// <<< Original impl. from {@link Ext.dd.DragDrop#handleMouseDown} ENDS here!
		}
		// <<< Original impl. from {@link Ext.dd.DragSource#handleMouseDown} ENDS here!
	},
	
	/**
	 * Override default startDrag to cancel drag operation when return of onInitDrag is falsy
	 */
	startDrag: function(x, y) {
		var me = this;
        me.proxy.reset();
        me.proxy.hidden = false;
        me.dragging = true;
        me.proxy.update("");
		if (me.onInitDrag(x, y) === false) {
			me.hideProxy();
		} else {
			me.proxy.show();
		}
    },
	
	/**
	 * Override default onInitDrag to NOT clone ddel.
	 */
	onInitDrag: function(x, y) {
		var me = this,
			ddata = me.dragData,
			fcdd = ddata.fcGetDragData();
		if (!fcdd) return false;
		me.proxy.updateMessage(me.dragOperation(fcdd.context, ddata.dde), fcdd.start, fcdd.end, fcdd.allDay || fcdd.viewAllDay);
		me.onStartDrag(x, y);
	},
	
	onBeforeDrag: function(data, e) {
		return true;
	},
	
	getDragData: function(e) {
		var me = this,
			cal = me.calendar,
			fc = cal.getCalendar(),
			el;
		
		if (el = e.getTarget(me.eventSelector)) {
			return {
				eventId: me.eventId(el),
				eventDraggable: me.eventDraggable(el),
				fc: fc,
				fcGetDragData: function() {
					return Sonicle.fullcalendar.FullCalendar.fcExtractDragData(fc);
				},
				fromPosition: Ext.fly(el).getXY(),
				ddel: el,
				dde: e
			};
		} else if ((el = e.getTarget(me.daySelector)) || (el = e.getTarget(me.slotSelector))) {
			return {
				fc: fc,
				fcGetDragData: function() {
					return Sonicle.fullcalendar.FullCalendar.fcExtractDragData(fc);
				},
				ddel: el,
				dde: e
			};
		}
	},
	
	getRepairXY: function(e, data) {
		return false;
	},
	
	/**
	 * Extracts event's ID from event's UI Element.
	 * @param {Ext.dom.Element} eventEl The rendered event Element.
	 * @return {String}
	 */
	eventId: function(eventEl) {
		return eventEl ? eventEl.getAttribute('data-eventid') : undefined;
	},
	
	/**
	 * Extracts event's draggable flag from event's UI Element.
	 * @param {Ext.dom.Element} eventEl The rendered event Element.
	 * @return {String}
	 */
	eventDraggable: function(eventEl) {
		return eventEl ? eventEl.getAttribute('data-draggable') : undefined;
	},
	
	/**
	 * Returns a String describing the specific drag operation: resize, move, copy or select.
	 * @param {drag|resize|selection} context The dragging context.
	 * @param {Ext.event.Event} e The dragging event.
	 * @return {resize|move|copy|add}
	 */
	dragOperation: function(context, e) {
		if ('resize' === context) {
			return 'resize';
		} else if ('selection' === context) {
			return 'add';
		} else {
			return this.allowCopy && e.ctrlKey ? 'copy' : 'move';
		}
	},
	
	/**
	 * Performs a drop-selection operation.
	 * @param {Date} start The start bound.
	 * @param {Date} end The end bound.
	 * @param {Boolean} allDay If boundaries are all-day.
	 */
	selectionDrop: function(start, end, allDay) {
		var cal = this.calendar;
		if (cal.getSelectForAdd()) {
			cal.fireSelectAdd(start, end, allDay);
		}
	},
	
	/**
	 * Performs a drop-move operation.
	 * @param {String} eventId The ID of the involved event.
	 * @param {Date} newStart The new start to be set.
	 * @param {Date} newEnd The new end to be set.
	 * @param {Ext.event.Event} e The dragging event.
	 * @return {Boolean}
	 */
	eventDropMove: function(eventId, newStart, newEnd, e) {
		var fc = this.calendar.getCalendar(), fn;
		if (fc) {
			fn = fc.getOption('eventDrop');
			if (Ext.isFunction(fn)) {
				// In order to call internal FC handler, we need to rebuild
				// the same argument: this replicates "info" object structure 
				// (https://fullcalendar.io/docs/eventDrop) with only fields 
				// used by our implementation.
				// See {@link Panel#fcHandleEventDrop} for more info.
				fn.call(fc, {
					event: {
						id: eventId,
						start: newStart,
						end: newEnd
					},
					jsEvent: e,
					revert: Ext.emptyFn
				});
			}
		}
		// We always return true to hide reairing on origin component.
		return true;
	},
	
	/**
	 * Returns a flag indicating if allDay mutations are disabled.
	 * @return {Boolean}
	 */
	isAllDayMutationDisabled: function() {
		return this.calendar.getEventAllowAllDayMutation() === false;
	}
});
