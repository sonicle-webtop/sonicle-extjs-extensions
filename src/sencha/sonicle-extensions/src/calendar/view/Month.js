/**
 * Displays a calendar view by month. This class does not usually need to be 
 * used directly as you can use a {@link Sonicle.calendar.Panel CalendarPanel} to manage 
 * multiple calendar views at once including the month view.
 */
Ext.define('Sonicle.calendar.view.Month', {
	extend: 'Sonicle.calendar.view.AbstractCalendar',
	alias: 'widget.monthview',
	requires: [
		'Ext.XTemplate',
		'Sonicle.calendar.util.EventUtils',
		'Sonicle.calendar.template.Month',
		'Sonicle.calendar.util.WeekEventRenderer',
		'Sonicle.calendar.view.MonthDayDetail'
	],
	
	/**
	 * @cfg {Boolean} showTime
	 * True to display the current time in today's box in the calendar, false to not display it (defautls to true)
	 */
	showTime: true,
	
	/**
	 * @cfg {Boolean} showTodayText
	 * True to display the {@link #todayText} string in today's box in the calendar, false to not display it (defautls to true)
	 */
	showTodayText: true,
	
	/**
	 * @cfg {Boolean} showHeader
	 * True to display a header beneath the navigation bar containing the week names above each week's column, false not to 
	 * show it and instead display the week names in the first row of days in the calendar (defaults to false).
	 */
	showHeader: false,
	
	/**
	 * @cfg {Boolean} showWeekLinks
	 * True to display an extra column before the first day in the calendar that links to the {@link Sonicle.calendar.WeekView view}
	 * for each individual week, false to not show it (defaults to false). If true, the week links can also contain the week 
	 * number depending on the value of {@link #showWeekNumbers}.
	 */
	showWeekLinks: false,
	
	/**
	 * @cfg {Boolean} showWeekNumbers
	 * True to show the week number for each week in the calendar in the week link column, false to show nothing (defaults to false).
	 * Note that if {@link #showWeekLinks} is false this config will have no affect even if true.
	 */
	showWeekNumbers: false,
	
	/**
	 * @cfg {String} weekLinkOverClass
	 * The CSS class name applied when the mouse moves over a week link element (only applies when {@link #showWeekLinks} is true,
	 * defaults to 'ext-week-link-over').
	 */
	weekLinkOverClass: 'ext-week-link-over',
	
	/**
	 * @cfg {Number} morePanelMinWidth
	 * When there are more events in a given day than can be displayed in the calendar view, the extra events
	 * are hidden and a "{@link #moreText more events}" link is displayed. When clicked, the link pops up a
	 * detail panel that displays all events for that day. By default the panel will be the same width as the day
	 * box, but this config allows you to set the minimum width of the panel in the case where the width
	 * of the day box is too narrow for the events to be easily readable (defaults to 220 pixels).
	 */
	morePanelMinWidth: 220,
	
	/**
	 * @cfg {String} todayText
	 * The text to display in the current day's box in the calendar when {@link #showTodayText} is true (defaults to 'Today')
	 */
	todayText: 'Today',
	
	/**
	 * @cfg {String} moreText
	 * The text to display in a day box when there are more events than can be displayed and a link is provided to
	 * show a popup window with all events for that day (defaults to '+{0} more...', where {0} will be
	 * replaced by the number of additional events that are not currently displayed for the day).
	 */
	moreText: '+{0} more...',
	
	//private properties -- do not override:
	weekCount: -1,
	dayCount: 7, // defaults to auto by month
	moreSelector: '.ext-cal-ev-more',
	weekLinkSelector: '.ext-cal-week-link',
	moreElIdDelimiter: '-more-',
	weekLinkIdDelimiter: 'ext-cal-week-',
	
	/**
	 * @event dayclick
	 * Fires after the user clicks within the view container and not on an event element
	 * @param {Sonicle.calendar.view.Month} this
	 * @param {Date} dt The date/time that was clicked on
	 * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
	 * MonthView always return true for this param.
	 * @param {Ext.core.Element} el The Element that was clicked on
	 */

	/**
	 * @event weekclick
	 * Fires after the user clicks within a week link (when {@link #showWeekLinks is true)
	 * @param {Sonicle.calendar.view.Month} this
	 * @param {Date} dt The start date of the week that was clicked on
	 */

	// inherited docs
	//dayover: true,
	// inherited docs
	//dayout: true

	initDD: function() {
		var me = this;
		var cfg = {
			view: me,
			createText: me.ddCreateEventText,
			copyText: me.ddCopyEventText,
			moveText: me.ddMoveEventText,
			dateFormat: me.ddDateFormat,
			ddGroup: 'MonthViewDD'
		};
		
		me.dragZone = Ext.create('Sonicle.calendar.dd.DragZone', me.el, cfg);
		me.dropZone = Ext.create('Sonicle.calendar.dd.DropZone', me.el, cfg);
	},
	
	onDestroy: function() {
		var me = this;
		Ext.destroy(me.ddSelector);
		Ext.destroy(me.dragZone);
		Ext.destroy(me.dropZone);

		me.callParent(arguments);
	},
	
	afterRender: function() {
		var me = this;
		if (!me.tpl) {
			me.tpl = Ext.create('Sonicle.calendar.template.Month', {
				id: me.id,
				showTodayText: me.showTodayText,
				todayText: me.todayText,
				showTime: me.showTime,
				showHeader: me.showHeader,
				showWeekLinks: me.showWeekLinks,
				showWeekNumbers: me.showWeekNumbers
			});
		}
		me.tpl.compile();
		me.addCls('ext-cal-monthview ext-cal-ct');

		me.callParent(arguments);
	},
	
	onResize: function() {
		var me = this;
		if (me.monitorResize) {
			me.maxEventsPerDay = me.computeMaxEventsPerDay();
			me.refresh(false);
		}
	},
	
	forceSize: function() {
		var me = this;
		// Compensate for the week link gutter width if visible
		if (me.showWeekLinks && me.el) {
			var hd = me.el.down('.ext-cal-hd-days-tbl'),
					bgTbl = me.el.select('.ext-cal-bg-tbl'),
					evTbl = me.el.select('.ext-cal-evt-tbl'),
					wkLinkW = me.el.down('.ext-cal-week-link').getWidth(),
					w = me.el.getWidth() - wkLinkW;

			hd.setWidth(w);
			bgTbl.setWidth(w);
			evTbl.setWidth(w);
		}
		me.callParent(arguments);
	},
	
	initClock: function() {
		var me = this;
		if (Ext.fly(me.id + '-clock') !== null) {
			me.prevClockDay = new Date().getDay();
			if (me.clockTask) {
				Ext.TaskManager.stop(me.clockTask);
			}
			
			me.clockTask = Ext.TaskManager.start({
				run: function() {
					var el = Ext.fly(me.id + '-clock'),
							t = new Date(),
							timeFmt = Sonicle.calendar.util.EventUtils.timeFmt(me.use24HourTime);

					if (t.getDay() === me.prevClockDay) {
						if (el) {
							el.update(Ext.Date.format(t, timeFmt));
						}
					} else {
						me.prevClockDay = t.getDay();
						me.moveTo(t);
					}
				},
				scope: me,
				interval: 1000
			});
		}
	},
	
	/**
	 * @protected
	 */
	getEventBodyMarkup: function() {
		var me = this;
		if (!me.eventBodyMarkup) {
			me.eventBodyMarkup = [
				'<tpl if="_isRecurring || _isBroken">',
				'<i class="ext-cal-ic {_recIconCls}">&#160;</i>',
				'</tpl>',
				'<tpl if="_hasTimezone">',
				'<i class="ext-cal-ic {_tzIconCls}">&#160;</i>',
				'</tpl>',
				'<tpl if="_hasAttendees">',
				'<i class="ext-cal-ic {_attIconCls}">&#160;</i>',
				'</tpl>',
				'<tpl if="_isPrivate">',
				'<i class="ext-cal-ic {_pvtIconCls}">&#160;</i>',
				'</tpl>',
				'<tpl if="_hasReminder">',
				'<i class="ext-cal-ic {_remIconCls}">&#160;</i>',
				'</tpl>',
				'<tpl if="_hasComments">',
				'<i class="ext-cal-ic {_commIconCls}">&#160;</i>',
				'</tpl>',
				'{Title}'
			].join('');
		}
		return me.eventBodyMarkup;
	},
	
	/**
	 * @protected
	 */
	getEventTemplate: function() {
		var me = this, tpl, body;
		if (!me.eventTpl) {
			body = me.getEventBodyMarkup();

			tpl = !(Ext.isIE || Ext.isOpera) ?
					new Ext.XTemplate(
							'<div id="{_elId}" data-qtitle="{Title}" data-qtip="{Tooltip}" data-draggable="{_isDraggable}" class="{_selectorCls} {_spanCls} {_colorCls} ext-cal-evt ext-cal-evr" style="background:{_bgColor};">',
								'<div class="ext-evt-bd" style="color:{_foreColor};">', body, '</div>',
							'</div>'
							)
					: new Ext.XTemplate(
							'<tpl if="_renderAsAllDay">',
							'<div id="{_elId}" data-qtitle="{Title}" data-qtip="{Tooltip}" data-draggable="{_isDraggable}" class="{_selectorCls} {_spanCls} {_colorCls} ext-cal-evo" style="background:{_bgColor};">',
								'<div class="ext-cal-evm">',
									'<div class="ext-cal-evi">',
							'</tpl>',
							'<tpl if="!_renderAsAllDay">',
							'<div id="{_elId}" data-qtitle="{Title}" data-qtip="{Tooltip}" class="{_selectorCls} {_colorCls} ext-cal-evt ext-cal-evr" style="background:{_bgColor};">',
							'</tpl>',
							'<div class="ext-evt-bd" style="color:{_foreColor};">', body, '</div>',
							'<tpl if="_renderAsAllDay">',
									'</div>',
								'</div>',
							'</tpl>',
							'</div>'
							);
			tpl.compile();
			me.eventTpl = tpl;
		}
		return me.eventTpl;
	},
	
	getTemplateEventData: function(evt) {
		var me = this,
				EM = Sonicle.calendar.data.EventMappings,
				EU = Sonicle.calendar.util.EventUtils,
				selector = me.getEventSelectorCls(evt[EM.Id.name]),
				bgColor = (evt[EM.Color.name] || ''),
				dinfo = EU.buildDisplayInfo(evt, EU.dateFmt(), EU.timeFmt(me.use24HourTime));
		
		return Ext.applyIf({
			_elId: selector + '-' + evt._weekIndex,
			_selectorCls: selector,
			_bgColor: bgColor,
			_foreColor: me.getEventForeColor(bgColor),
			_colorCls: 'ext-color-' + (evt[EM.Color.name] || 'nocolor') + (evt._renderAsAllDay ? '-ad' : ''),
			_isDraggable: EU.isMovable(evt),
			_hasTimezone: (evt[EM.HasTimezone.name] === true),
			_isPrivate: (evt[EM.IsPrivate.name] === true),
			_hasReminder: (evt[EM.Reminder.name] !== -1),
			_hasAttendees: (evt[EM.HasAttendees.name] === true),
			_isRecurring: (evt[EM.IsRecurring.name] === true),
			_isBroken: (evt[EM.IsBroken.name] === true),
			_hasComments: (evt[EM.HasComments.name] === true),
			_tzIconCls: me.timezoneIconCls,
			_pvtIconCls: me.privateIconCls,
			_remIconCls: me.reminderIconCls,
			_attIconCls: me.attendeesIconCls,
			_recIconCls: (evt[EM.IsBroken.name] === true) ? me.recurrenceBrokenIconCls : me.recurrenceIconCls,
			_commIconCls: me.commentsIconCls,
			Title: dinfo.title,
			Tooltip: dinfo.tooltip
		},
		evt);
	},
	
	refresh: function(reloadData) {
		var me = this;
		if (me.detailPanel) me.detailPanel.hide();
		if (!me.isHeaderView) {
			me.maxEventsPerDay = me.computeMaxEventsPerDay();
		} else {
			me.maxEventsPerDay = 3;
		}
		me.callParent(arguments);

		if (me.showTime !== false) me.initClock();
	},
	
	renderItems: function() {
		var me = this;
		Sonicle.calendar.util.WeekEventRenderer.render({
			eventGrid: me.allDayOnly ? me.allDayGrid : me.eventGrid,
			viewStart: me.viewStart,
			tpl: me.getEventTemplate(),
			maxEventsPerDay: me.maxEventsPerDay,
			id: me.id,
			templateDataFn: Ext.bind(me.getTemplateEventData, me),
			evtMaxCount: me.evtMaxCount,
			weekCount: me.weekCount,
			dayCount: me.dayCount,
			moreText: me.moreText
		});
		me.fireEvent('eventsrendered', me);
	},
	
	getDayEl: function(dt) {
		return Ext.get(this.getDayId(dt));
	},
	
	getDayId: function(dt) {
		if (Ext.isDate(dt)) {
			dt = Ext.Date.format(dt, 'Ymd');
		}
		return this.id + this.dayElIdDelimiter + dt;
	},
	
	getWeekIndex: function(dt) {
		var el = this.getDayEl(dt).up('.ext-cal-wk-ct');
		return parseInt(el.id.split('-wk-')[1], 10);
	},
	
	getDaySize: function(contentOnly) {
		var me = this,
				box = me.el.getBox(),
				padding = me.getViewPadding(),
				w = (box.width - padding.width) / me.dayCount,
				h = (box.height - padding.height) / me.getWeekCount();
		
		if (contentOnly) {
			// measure last row instead of first in case text wraps in first row
			var hd = me.el.select('.ext-cal-dtitle').last().parent('tr');
			h = hd ? h - hd.getHeight(true) : h;
		}
		return {height: h, width: w};
	},
	
	getEventHeight: function() {
		var me = this, evt;
		if (!me.eventHeight) {
			evt = me.el.select('.ext-cal-evt').first();
			if (evt) {
				me.eventHeight = evt.parent('td').getHeight();
			} else {
				return 18; // no events rendered, so try setting this.eventHeight again later
			}
		}
		return me.eventHeight;
	},
	
	computeMaxEventsPerDay: function() {
		var dayHeight = this.getDaySize(true).height,
				eventHeight = this.getEventHeight();
		return Math.max(Math.floor((dayHeight - eventHeight) / eventHeight), 0);
	},
	
	getViewPadding: function(sides) {
		sides = sides || 'tlbr';
		var me = this,
				top = sides.indexOf('t') > -1,
				left = sides.indexOf('l') > -1,
				right = sides.indexOf('r') > -1,
				height = me.showHeader && top ? me.el.select('.ext-cal-hd-days-tbl').first().getHeight() : 0,
				width = 0;

		if (me.isHeaderView) {
			if (left) {
				width = me.el.select('.ext-cal-gutter').first().getWidth();
			}
			if (right) {
				width += me.el.select('.ext-cal-gutter-rt').first().getWidth();
			}
		} else if (me.showWeekLinks && left) {
			width = me.el.select('.ext-cal-week-link').first().getWidth();
		}

		return {
			height: height,
			width: width
		};
	},
	
	getDayAt: function(x, y) {
		var me = this,
				box = me.el.getBox(),
				padding = me.getViewPadding('tl'), // top/left only since we only want the xy offsets
				daySize = me.getDaySize(),
				dayL = Math.floor(((x - box.x - padding.width) / daySize.width)),
				dayT = Math.floor(((y - box.y - padding.height) / daySize.height)),
				days = (dayT * 7) + dayL,
				dt = Sonicle.Date.add(me.viewStart, {days: days});
		return {
			date: dt,
			el: me.getDayEl(dt)
		};
	},
	
	/**
	 * @protected
	 */
	moveNext: function() {
		return this.moveMonths(1, true);
	},
	
	/**
	 * @protected
	 */
	movePrev: function() {
		return this.moveMonths(-1, true);
	},
	
	onInitDrag: function() {
		var me = this;
		me.callParent(arguments);

		if (me.dayOverClass) {
			Ext.select(me.daySelector).removeCls(me.dayOverClass);
		}
		if (me.detailPanel) me.detailPanel.hide();
	},
	
	// private
	onMoreClick: function(dt) {
		var me = this;
		if (!me.detailPanel) {
			me.detailPanel = Ext.create('Ext.Panel', {
				id: me.id + '-details-panel',
				title: Ext.Date.format(dt, 'F j'),
				layout: 'fit',
				floating: true,
				renderTo: Ext.getBody(),
				tools: [{
						type: 'close',
						handler: function(e, t, p) {
							p.ownerCt.hide();
						}
					}],
				items: {
					xtype: 'monthdaydetailview',
					id: me.id + '-details-view',
					date: dt,
					view: me,
					store: me.store,
					listeners: {
						'eventsrendered': Ext.bind(me.onDetailViewUpdated, me)
					}
				}
			});
		} else {
			me.detailPanel.setTitle(Ext.Date.format(dt, 'F j'));
		}
		me.detailPanel.getComponent(me.id + '-details-view').update(dt);
	},
	
	onDetailViewUpdated: function(view, dt, numEvents) {
		var me = this,
				p = me.detailPanel,
				dayEl = me.getDayEl(dt),
				box = dayEl.getBox();
		
		p.setWidth(Math.max(box.width, me.morePanelMinWidth));
		p.show();
		p.getEl().alignTo(dayEl, 't-t?');
	},
	
	onHide: function() {
		var me = this;
		me.callParent(arguments);

		if (me.detailPanel) me.detailPanel.hide();
	},
	
	onClick: function(e, t) {
		var me = this, el, date;
		if (me.detailPanel) me.detailPanel.hide();
		
		// The superclass handled the click already so exit
		if (Sonicle.calendar.view.Month.superclass.onClick.apply(me, arguments)) return;
		
		if (me.dropZone) me.dropZone.clearShims();
		
		if (el = e.getTarget(me.weekLinkSelector, 3)) {
			date = el.id.split(me.weekLinkIdDelimiter)[1];
			me.fireEvent('weekclick', me, Ext.Date.parseDate(date, 'Ymd'));
			return;
		}
		if (el = e.getTarget(me.moreSelector, 3)) {
			date = el.id.split(me.moreElIdDelimiter)[1];
			me.onMoreClick(Ext.Date.parseDate(date, 'Ymd'));
			return;
		}
		if (el = e.getTarget('td', 3)) {
			if (el.id && el.id.indexOf(me.dayElIdDelimiter) > -1) {
				date = me.getDateFromId(el.id, me.dayElIdDelimiter);
				me.fireEvent('day'+e.type, me, Ext.Date.parseDate(date, 'Ymd'), true, Ext.get(me.getDayId(date)));
				return;
			}
		}
	},
	
	handleDayMouseEvent: function(e, t, type) {
		var me = this,
				el = e.getTarget(me.weekLinkSelector, 3, true);
		if (el && me.weekLinkOverClass) {
			el[type === 'over' ? 'addCls' : 'removeCls'](me.weekLinkOverClass);
			return;
		}
		me.callParent(arguments);
	}
});
