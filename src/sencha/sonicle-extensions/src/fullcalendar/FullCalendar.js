/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 * 
 * https://github.com/fullcalendar/fullcalendar/issues/2430
 * https://github.com/fullcalendar/fullcalendar/issues/4643
 * https://github.com/fullcalendar/fullcalendar/issues/2748
 * https://github.com/fullcalendar/fullcalendar/issues/440
 * https://github.com/fullcalendar/fullcalendar/issues/3743
 * https://stackoverflow.com/questions/53272526/fullcalendar-removing-the-dot-in-event
 * https://github.com/mherrmann/fullcalendar-rightclick
 */
Ext.define('Sonicle.fullcalendar.FullCalendar', {
	extend: 'Ext.Component',
	alias: 'widget.sofullcalendar',
	requires: [
		'Sonicle.fullcalendar.dd.StatusProxy',
		'Sonicle.fullcalendar.dd.DragZone',
		'Sonicle.fullcalendar.dd.DropZone'
	],
	
	config: {
		
		calendar: true,
		
		/**
		 * @cfg {Boolean} [selectForAdd]
		 * A selection represents a new event being created. To disable this behaviour set this to `false`.
		 */
		selectForAdd: true,
		
		/**
		 * @cfg {Boolean} [eventAllowAllDayMutation]
		 * Set to `false` to disable dragging from a timed section to an all-day section and vice versa.
		 */
		eventAllowAllDayMutation: true
	},
	
	/**
	 * @cfg {Object} [texts]
	 */
	
	baseCls: 'so-' + 'fullcalendar',
	
	childEls: ['innerEl'],
	renderTpl: [
		'<div id="{id}-innerEl" data-ref="innerEl" role="presentation"></div>'
	],
	
	/**
	 * @event eventclick
	 * Fired when event is clicked.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Mixed} id
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event eventdblclick
	 * Fired when event is double clicked.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Mixed} id
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event eventcontextmenu
	 * Fired when event is right clicked.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Mixed} id
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event dayclick
	 * Fired when day/date is clicked.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Date} date
	 * @param {Boolean} allDay
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event daydblclick
	 * Fired when day/date is double clicked.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Date} date
	 * @param {Boolean} allDay
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event daycontextmenu
	 * Fired when day/date is right clicked.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Date} date
	 * @param {Boolean} allDay
	 * @param {Ext.event.Event} e
	 */
	
	/**
	 * @event selectadd
	 * Fired when a period range is selected for adding.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {Date} start
	 * @param {Date} end
	 * @param {Boolean} allDay
	 */
	
	/**
	 * @event viewchange
	 * Fired when the calendar switched to a new view.
	 * @param {Sonicle.calendar.FullCalendar} this
	 * @param {String} view
	 * @param {Object} info Extra information about current view change:
	 * @param {Object} info.start View's start range.
	 * @param {Object} info.end View's end range.
	 * @param {Object} info.date View's current date.
	 * @param {Object} info.move Move operation reason, one of: previous, next, today, todate or <null> when no move occurred.
	 */
	
	doDestroy: function() {
		this.setCalendar(null);
		this.callParent();
	},
	
	applyCalendar: function(calendar) {
		var me = this, cal;
		if (!calendar) { // null/undefined/false
			cal = me.getCalendar();
			if (cal && cal.isReady) {
				if (me.dragZone) me.dragZone = me.dragZone.destroy();
				if (me.dropZone) me.dropZone = me.dropZone.destroy();
				//if (me.dragTracker) me.dragTracker = me.dragTracker.destroy();
				//if (me.dragProxy) me.dragProxy = me.dragProxy.destroy();
				cal.destroy();
			}
			return null;
		} else if (Ext.isBoolean(calendar)) { // true
			calendar = {};
		}
		return calendar;
	},
	
	onRender: function(parentNode, containerIdx) {
		var me = this,
			config = me.getCalendar(),
			texts = me.texts || {},
			cal;
		me.callParent(arguments);
		cal = me.createCalendar(config);
		if (cal && cal.isReady) {
			cal.render();
			me.dragZone = new Sonicle.fullcalendar.dd.DragZone(cal.el, {
				calendar: me,
				proxy: new Sonicle.fullcalendar.dd.StatusProxy({
					id: me.el.id + '-drag-status-proxy',
					calendar: me,
					dragTextAdd: texts.ddCreate,
					dragTextMove: texts.ddMove,
					dragTextCopy: texts.ddCopy,
					dragTextResize: texts.ddResize
				})
			});
			me.dropZone = new Sonicle.fullcalendar.dd.DropZone(cal.el, {calendar: me});
			/*
			me.dragTracker = new Ext.dd.DragTracker({
				el: cal.el,
				preventDefault: false,
				listeners: {
					dragstart: {fn: me.onCalDragStart, scope: me, args: [cal]},
					mousemove: {fn: me.onCalDragMouseMove, scope: me, args: [cal]},
					// Delays dragend listener a little bit to allow FC select callback to be managed before!
					dragend: {fn: me.onCalDragEnd, scope: me, args: [cal], delay: 200}
				}
			});
			me.dragProxy = new Sonicle.fullcalendar.dd.StatusProxy({
				id: me.el.id + '-drag-status-proxy',
				animRepair: true,
				calendar: me
			});
			*/
		}
	},
	
	onResize: function(width, height, oldWidth, oldHeight) {
		var me = this,
			cal = me.getCalendar();
		me.callParent(arguments);
		if (cal && cal.isReady) {
			cal.updateSize();
		}
	},
	
	/**
	 * Sets a configuration option.
	 * @param {String} name The option's name.
	 * @param {Mixed} value The option's value.
	 */
	setOption: function(name, value) {
		var fc = this.getCalendar();
		if (fc && fc.isReady) fc.setOption(name, value);
	},
	
	/**
	 * Gets a configuration option's value.
	 * @param {String} name The option's name.
	 * @returns {Mixed} Option value
	 */
	getOption: function(name) {
		var fc = this.getCalendar(), value;
		if (fc && fc.isReady) value = fc.getOption(name);
		return value;
	},
	
	/**
	 * Moves the calendar to an arbitrary date.
	 * @param {String|Date} date An ISO date String (in `Y-m-d` format) or a Date object.
	 */
	moveTo: function(date) {
		var cal = this.getCalendar();
		if (cal && cal.isReady) {
			cal.gotoDate(Ext.isDate(date) ? Ext.Date.format(date, 'Y-m-d') : date);
			this.fireViewChange(cal.view, cal.getDate(), 'todate');
		}
	},
	
	/**
	 * Moves the calendar on today date.
	 */
	moveToday: function() {
		var cal = this.getCalendar();
		if (cal && cal.isReady) {
			cal.today();
			this.fireViewChange(cal.view, cal.getDate(), 'today');
		}
	},
	
	/**
	 * Moves the calendar one step backward (by a month or week for example).
	 */
	movePrevious: function() {
		var cal = this.getCalendar();
		if (cal && cal.isReady) {
			cal.prev();
			this.fireViewChange(cal.view, cal.getDate(), 'previous');
		}
	},
	
	/**
	 * Moves the calendar one step forward (by a month or week for example).
	 */
	moveNext: function() {
		var cal = this.getCalendar();
		if (cal && cal.isReady) {
			cal.next();
			this.fireViewChange(cal.view, cal.getDate(), 'next');
		}
	},
	
	/**
	 * Immediately switches to a different view. Optionally it can navigate to a date.
	 * @param {String} name View's name.
	 * @param {String|Date} [date] An ISO date String (in `Y-m-d` format) or a Date object.
	 */
	changeView: function(name, date) {
		var cal = this.getCalendar(), oname;
		if (cal && cal.isReady) {
			oname = cal.view.type;
			cal.changeView(name, Ext.isDate(date) ? Ext.Date.format(date, 'Y-m-d') : date);
			if (cal.view.type !== oname) {
				this.fireViewChange(cal.view, cal.getDate());
			}
		}
	},
	
	/**
	 * Returns an object containing active view's boundary dates.
	 * @returns {Object}
	 */
	getViewBounds: function() {
		var cal = this.getCalendar(), o;
		if (cal && cal.isReady && cal.view) {
			o = {
				start: cal.view.activeStart,
				end: cal.view.activeEnd
			};
		}
		return o;
	},
	
	fireViewChange: function(view, date, moveType) {
		var me = this;
		me.fireEvent('viewchange', me, view.type, {
			start: view.activeStart,
			end: view.activeEnd,
			date: Ext.isDate(date) ? date : XD.parse(date, 'Y-m-d'),
			moveType: moveType
		});
		
		/*
		if (Ext.isString(view)) {
			me.fireEvent('viewchange', me, view, {
				start: viewStart,
				end: viewEnd,
				date: Ext.isDate(date) ? date : XD.parse(date, 'Y-m-d')
			});
		} else if (Ext.isObject(view)) {
			
		}
		*/
	},
	
	/**
	 * Programmatically selects a period of time.
	 * @param {String|Date} start An ISO date-time String (in `Y-m-d H:i` format) or a Date object.
	 * @param {String|Date} [end] An ISO date-time String (in `Y-m-d H:i` format) or a Date object.
	 * @param {Boolean} [allDay]
	 */
	select: function(start, end, allDay) {
		var fc = this.getCalendar(), obj;
		if (fc && fc.isReady) {
			obj = {start: Ext.isDate(start) ? Ext.Date.format(start, 'Y-m-d H:i') : start};
			if (Ext.isDefined(end)) obj.end = Ext.isDate(end) ? Ext.Date.format(end, 'Y-m-d H:i') : end;
			if (Ext.isBoolean(allDay)) obj.allDay = allDay;
			fc.select(obj);
		}
	},
	
	/**
	 * Clears the current selection.
	 */
	clearSelection: function() {
		var fc = this.getCalendar();
		if (fc && fc.isReady) fc.unselect();
	},
	
	/**
	 * Formats a Date object into a string following calendar's locale setup.
	 * @param {Date} date Date object to format.
	 * @param {Object} formatOptions Format options accorging to {@link https://fullcalendar.io/docs/date-formatting}.
	 * @param {Object} [opts] An object containing configuration.
	 * 
	 * This object may contain any of the following properties:
	 * 
	 * @param {String} [opts.timezone] Timezone.
	 * @returns {String}
	 */
	formatDate: function(date, formatOptions, opts) {
		opts = opts || {};
		var fc = this.getCalendar(), s;
		if (fc && fc.isReady) {
			if (Ext.isString(opts.timezone)) {
				s = FullCalendar.formatDate(date, Ext.apply(formatOptions, {
					timeZone: opts.timezone,
					locale: fc.getCurrentData().dateEnv.locale.codeArg
				}));
			} else {
				s = fc.formatDate(date, formatOptions);
			}
		}
		return s;
	},
	
	/**
	 * Reloads all events from all sources, or optionally target the operation on a specified Source.
	 * @param {String} [sourceId] An event Source ID.
	 */
	reloadEvents: function(sourceId) {
		var fc = this.getCalendar(), source;
		if (fc && fc.isReady) {
			if (!Ext.isEmpty(sourceId)) {
				source = fc.getEventSourceById(sourceId);
				if (source) source.refetch();
			} else {
				fc.refetchEvents();
			}
		}	
	},
	
	/**
	 * Adds an event to a Source.
	 * @param {Object} fcEvent
	 * @param {String|Object|true} source The event Source: a String ID, a Source Object or `true` for the first event Source.
	 */
	addEvent: function(fcEvent, source) {
		var fc = this.getCalendar();
		if (fc && fc.isReady) fc.addEvent(fcEvent, source);
	},
	
	/**
	 * Removes an event.
	 * @param {String|Nummer} id The event ID.
	 * @returns {Boolean}
	 */
	removeEvent: function(id) {
		var fc = this.getCalendar(), event;
		if (fc && fc.isReady) {
			event = fc.getEventById(Ext.isObject(id) ? id.id : id);
			if (event) {
				event.remove();
				return true;
			}
		}
	},
	
	/**
	 * Removes all events associated with specified Source and prevents it from being fetched again.
	 * @param {String} sourceId
	 * @returns {Boolean}
	 */
	removeEventSource: function(sourceId) {
		var fc = this.getCalendar(), source;
		if (fc && fc.isReady) {
			if (Ext.isEmpty(sourceId)) Ext.raise('Source is mandatory');
			source = fc.getEventSourceById(sourceId);
			if (source) {
				source.remove();
				return true;
			}
		}	
	},
	
	/**
	 * In Grid like views, extracts the javascript Date referenced by the passed column/day Element
	 * @param {HTMLElement} dayEl The DOM node from which extract `data-date` attribute's value.
	 * @returns {Date} The Date or undefined
	 */
	gridDayDate: function(dayEl) {
		var sdate = dayEl ? dayEl.getAttribute('data-date') : null, dt;
		if (!Ext.isEmpty(sdate)) dt = Ext.Date.parse(sdate, 'Y-m-d');
		return dt;
	},
	
	/**
	 * In TimeGrid like views, finds the javascript Date referenced by XY coordinates.
	 * @param {Number|HTMLElement} x The X coordinate or the DOM node from which extract `data-date` attribute's value.
	 * @param {Number|HTMLElement} y The Y coordinate or the DOM node from which extract `data-time` attribute's value.
	 * @returns {Date} The Date or undefined
	 */
	findTimeGridSlotDateAt: function(x, y) {
		var me = this,
			SoS = Sonicle.String,
			strings = [], fmts = [],
			sdate, stime;
		if (Ext.isNumber(x)) {
			sdate = me.findTimeGridSlotDayAt(x);
		} else if (x) {
			sdate = x.getAttribute('data-date');
		}
		if (Ext.isNumber(y)) {
			stime = me.findTimeGridSlotTimeAt(y);
		} else if (y) {
			stime = y.getAttribute('data-time');
		}
		
		if (!Ext.isEmpty(sdate)) {
			strings.push(sdate);
			fmts.push('Y-m-d');
		}
		if (!Ext.isEmpty(stime)) {
			strings.push(stime);
			fmts.push('H:i:s');
		}
		return !Ext.isEmpty(strings) ? Ext.Date.parse(SoS.join(' ', strings), SoS.join(' ', fmts)) : undefined;
	},
	
	/**
	 * In TimeGrid like views, finds the day-date at precise X coordinate (usually from pointer related events).
	 * @param {Number} x The X coordinate.
	 * @returns {String} The day-date (in Y-m-d format) or undefined
	 */
	findTimeGridSlotDayAt: function(x) {
		var fc = this.getCalendar(),
			date;
		
		if (fc && fc.isReady) {
			var calDomEl = fc.el,
				colEls = Ext.fly(calDomEl).down('.fc-timegrid-cols').query('.fc-timegrid-col', false),
				colEl, i;
			
			for (i=0; i<colEls.length; i++) {
				var el = colEls[i],
					elX = el.getX();
				if (x >= elX && x <= (elX + el.getWidth())) {
					colEl = el;
					break;
				}
			}
			if (colEl) date = colEl.getAttribute('data-date');
		}
		return date;
	},
	
	/**
	 * In TimeGrid like views, finds the day-time at precise Y coordinate (usually from pointer related events).
	 * @param {Number} y The Y coordinate.
	 * @returns {String} The day-time (in H:i:s format) or undefined
	 */
	findTimeGridSlotTimeAt: function(y) {
		var fc = this.getCalendar(),
			time;
		if (fc && fc.isReady) {
			var calDomEl = fc.el,
				slotEls = Ext.fly(calDomEl).down('.fc-timegrid-slots').query('.fc-timegrid-slot', false),
				slotEl, i;
			
			for (i=0; i<slotEls.length; i++) {
				var el = slotEls[i],
					elY = el.getY();
				if (y >= elY && y <= (elY + el.getHeight())) {
					slotEl = el;
					break;
				}
				if (slotEl) time = slotEl.getAttribute('data-time');
			}
		}
		return time;
	},
	
	/**
	 * Returns a flag indicating if allDay mutations are disabled.
	 * @return {Boolean}
	 */
	isAllDayMutationDisabled: function() {
		return this.getEventAllowAllDayMutation() === false;
	},
	
	privates: {
		
		fireSelectAdd: function(start, end, allDay) {
			var me = this;
			me.fireEvent('selectadd', me, start, end, allDay);
			me.clearSelection();
		},
		
		onFCDayEvent: function(e) {
			var me = this,
				SoS = Sonicle.String,
				el;
			
			if (SoS.isIn(e.type, ['click', 'dblclick', 'contextmenu'])) {
				if (el = e.getTarget('.fc-day')) {
					var date = me.gridDayDate(el);
					if (date) me.fireEvent('day'+e.type, me, date, true, e);
				}
			}
		},
		
		onFCViewEvent: function(view, e) {
			var me = this,
				SoS = Sonicle.String,
				btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(view),
				el;
			
			if (SoS.isIn(e.type, ['click', 'dblclick', 'contextmenu'])) {
				if (el = e.getTarget('.fc-event')) {
					var id = el.getAttribute('data-eventid'), rec;
					if (!Ext.isEmpty(id)) {
						 me.fireEvent('event'+e.type, me, id, e);
					}
				} else if ((btype === 'timeGrid') && (el = e.getTarget('.fc-timegrid-slot'))) {
					var date = me.findTimeGridSlotDateAt(e.getX(), el);
					if (date) me.fireEvent('day'+e.type, me, date, false, e);
					
				} else if ((btype === 'timeGrid') && (el = e.getTarget('.fc-timegrid-col-bg', 50, true))) {
					var date = me.findTimeGridSlotDateAt(el.findParent('.fc-day'), e.getY());
					if (date) me.fireEvent('day'+e.type, me, date, false, e);
				
				} else if ((btype === 'timeGrid') && (el = e.getTarget('.fc-timegrid-body', 50, true))) {
					var date = me.findTimeGridSlotDateAt(e.getX(), e.getY());
					if (date) me.fireEvent('day'+e.type, me, date, false, e);
					
				} else if (el = e.getTarget('.fc-day')) {
					var date = me.gridDayDate(el);
					if (date) me.fireEvent('day'+e.type, me, date, true, e);
				}
			}
		},
		
		onFCDayCellDidMount: function(info) {
			var me = this,
				el = Ext.get(info.el);
			
			if (el.hasCls('fc-more-popover')) {
				me.attachListener(el, ['dblclick', 'click', 'contextmenu'], me.onFCViewEvent, me, {args: [info.view]});
			}
		},
		
		onFCEventDidMount: function(info) {
			// Add useful data on event's element
			Ext.fly(info.el).set({
				'data-eventid': info.event.id,
				'data-draggable': info.event.startEditable || info.event.durationEditable
			});
		},
		
		onFCViewDidMount: function(info) {
			var me = this,
				btype = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(info.view),
				el = Ext.get(info.el),
				els;

			if (btype === 'timeGrid') {
				els = [el.down('.fc-daygrid-body', false), el.down('.fc-timegrid-body', false)];
			} else if (btype === 'dayGrid') {
				els = [el.down('.fc-daygrid-body', false)];
			}
			Ext.iterate(els, function(el) {
				if (el) me.attachListener(el, ['dblclick', 'click', 'contextmenu'], me.onFCViewEvent, me, {args: [info.view]});
			});
		},
		
		onFCDayHeaderDidMount: function(info) {
			var me = this,
				el = Ext.get(info.el);
			me.attachListener(el, ['dblclick', 'click', 'contextmenu'], me.onFCDayEvent, me);
		},
		
		onFCAllDayDidMount: function(info) {
			// Style allDay box like background!
			Ext.fly(info.el).addCls('fc-cell-shaded');
		},
		
		onFCAllDayContent: function(info) {
			// Do NOT display any text in allDay box!
			return '';
		},
		
		onFCEventDragStart: function(info) {
			if (this.dragZone) {
				var data = this.dragZone.dragData;
				if (data.ddel) Ext.fly(data.ddel).setStyle('pointer-events', 'none');
			}
		},
		
		onFCEventDragStop: function(info) {
			if (this.dragZone) {
				// Restore initial configuration about pointer-events: 
				// this actually removes styles modification on ddel.
				var data = this.dragZone.dragData;
				if (data.ddel) Ext.fly(data.ddel).setStyle('pointer-events');
			}
		},
		
		onFCEventDrop: function(info) {
			if (this.isAllDayMutationDisabled()) {
				var allDayMutation = (info.event._def.allDay !== info.oldEvent._def.allDay);
				if (allDayMutation) {
					info.revert();
					return false;
				}
			}
		},
		
		createCalendar: function(config) {
			var me = this,
				el = me.innerEl,
				baseConfig = me.createCalendarBaseConfig(config),
				cfg, cal;
			
			if (el) {
				cfg = Ext.merge(config || {}, baseConfig || {});
				me.calendar = cal = new FullCalendar.Calendar(el.dom, Ext.apply(cfg, {
					height: '100%',
					expandRows: true,
					headerToolbar: false,
					footerToolbar: false
				}));
				cal.isReady = true;
				return cal;
			}
		},
		
		createCalendarBaseConfig: function(config) {
			var me = this,
				hook = function(name, localFn, intercept) {
					if (Ext.isFunction(config[name])) {
						if (intercept === true) {
							return Ext.Function.createInterceptor(config[name], localFn, me);
						} else {
							return Ext.Function.createSequence(localFn, config[name], me);
						}
					} else {
						return Ext.bind(localFn, me);
					}
				};
			
			return {
				eventDidMount: hook('eventDidMount', me.onFCEventDidMount),
				dayCellDidMount: hook('dayCellDidMount', me.onFCDayCellDidMount),
				viewDidMount: hook('viewDidMount', me.onFCViewDidMount),
				dayHeaderDidMount: hook('dayHeaderDidMount', me.onFCDayHeaderDidMount),
				allDayDidMount: hook('allDayDidMount', me.onFCAllDayDidMount),
				allDayContent: hook('allDayContent', me.onFCAllDayContent),
				eventDragStart: hook('eventDragStart', me.onFCEventDragStart),
				eventDragStop: hook('eventDragStop', me.onFCEventDragStop),
				eventDrop: hook('eventDrop', me.onFCEventDrop, true)
			};
		},
		
		attachListener: function(el, events, handler, scope, options) {
			Ext.iterate(events, function(event) {
				el.on(event, handler, scope, Ext.apply({}, options || {}, {priority: 100}));
			});
		}
	},
	
	statics: {
		
		/**
		* Returns the base-type of a FullCalendar's View: passing a Month view this
		* will return `dayGrid`.
		* @param {FullCalendar.View} view FullCalendar view.
		* @returns {undefined|String}
		*/
		fcViewBaseType: function(view) {
			var SoS = Sonicle.String,
				type = view.getOption('type');
			if (SoS.startsWith(type, 'timeGrid')) return 'timeGrid';
			if (SoS.startsWith(type, 'dayGrid')) return 'dayGrid';
			if (SoS.startsWith(type, 'list')) return 'list';
			if (SoS.startsWith(type, 'resourceTimeline')) return 'resourceTimeline';
			return undefined;
		},
	   
	   /**
	    * Returns drag information about current drag/resize/selection operation.
		* Result can be undefined is case there is no dragging operation in progress.
		* @param {FullCalendar} fc FullCalendar instance.
		* @returns {undefined|Object}
	    */
		fcExtractDragData: function(fc) {
			var fcdata = fc.getCurrentData(),
				ddata;
			
			if (fcdata.eventDrag && fcdata.eventDrag.isEvent) {
				ddata = {
					context: 'drag',
					origDef: Ext.Object.getValues(fcdata.eventDrag.affectedEvents.defs)[0],
					newDef: Ext.Object.getValues(fcdata.eventDrag.mutatedEvents.defs)[0],
					newInst: Ext.Object.getValues(fcdata.eventDrag.mutatedEvents.instances)[0]
				};
				ddata.allowed = Ext.isDefined(ddata.newDef) && Ext.isDefined(ddata.newInst);
				ddata.allDayMutation = (ddata.allowed && (ddata.origDef.allDay !== ddata.newDef.allDay));
				
			} else if (fcdata.eventResize && fcdata.eventResize.isEvent) {
				ddata = {
					context: 'resize',
					origDef: Ext.Object.getValues(fcdata.eventResize.affectedEvents.defs)[0],
					newDef: Ext.Object.getValues(fcdata.eventResize.mutatedEvents.defs)[0],
					newInst: Ext.Object.getValues(fcdata.eventResize.mutatedEvents.instances)[0]
				};
				ddata.allowed = Ext.isDefined(ddata.newDef) && Ext.isDefined(ddata.newInst);
				
			} else if (fcdata.dateSelection) {
				ddata = {
					context: 'selection',
					allowed: true,
					start: Ext.Date.utcToLocal(fcdata.dateSelection.range.start),
					end: Ext.Date.utcToLocal(fcdata.dateSelection.range.end),
					allDay: fcdata.dateSelection.allDay
				};
			}
			
			if (ddata) {
				if (ddata.context !== 'selection') {
					Ext.apply(ddata, {
						// Extracted range dates are in UTC, let's convert them to local dates!
						start: ddata.allowed ? Ext.Date.utcToLocal(ddata.newInst.range.start) : null,
						end: ddata.allowed ? Ext.Date.utcToLocal(ddata.newInst.range.end) : null,
						allDay: ddata.allowed ? ddata.newDef.allDay : null
					});
				}
				ddata.viewAllDay = Sonicle.fullcalendar.FullCalendar.fcViewBaseType(fcdata.viewApi) === 'dayGrid';
			}
			return ddata;
		}
	}
});
