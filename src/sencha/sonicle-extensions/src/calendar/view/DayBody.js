/**
 * This is the scrolling container within the day and week views where 
 * non-all-day events are displayed. Normally you should not need to use this 
 * class directly -- instead you should use {@link Sonicle.calendar.view.Day DayView} 
 * which aggregates this class and the {@link Sonicle.calendar.view.DayHeader DayHeaderView} 
 * into the single unified view presented by {@link Sonicle.calendar.Panel CalendarPanel}.
 */
Ext.define('Sonicle.calendar.view.DayBody', {
	extend: 'Sonicle.calendar.view.AbstractCalendar',
	alias: 'widget.daybodyview',
	requires: [
		'Ext.XTemplate',
		'Sonicle.calendar.template.DayBody',
		'Sonicle.calendar.data.EventMappings',
		'Sonicle.calendar.dd.DayDragZone',
		'Sonicle.calendar.dd.DayDropZone'
	],
	uses: [
		'Sonicle.grid.column.Tag'
	],
	
	hourIncrement: 60,
	
	dayColumnElIdDelimiter: '-day-col-',
	
	config: {
		/**
		 * @cfg {Boolean} showNowMarker
		 * `true` to show a marker on the view that equates to the current local time.
		 */
		showNowMarker: true
	},
	
	/**
	 * @event beforeeventresize
	 * Fires after the user drags the resize handle of an event to resize it, but before the resize
	 * operation is carried out. This is a cancelable event, so returning false from a handler will
	 * cancel the resize operation.
	 * @param {Sonicle.calendar.view.DayBody} this
	 * @param {Sonicle.calendar.data.EventModel} rec The original {@link
	 * Extensible.calendar.data.EventModel record} for the event that was resized
	 * @param {Object} data An object containing the new start and end dates that will be set into the
	 * event record if the event is not canceled. Format of the object is: {StartDate: [date], EndDate: [date]}
	 */
	
	/**
	 * @event eventresize
	 * Fires after the user has drag-dropped the resize handle of an event and the resize operation is
	 * complete. If you need to cancel the resize operation you should handle the {@link #beforeeventresize}
	 * event and return false from your handler function.
	 * @param {Sonicle.calendar.view.DayBody} this
	 * @param {Sonicle.calendar.EventModel} rec The {@link Sonicle.calendar.EventModel record} for the event that was resized
	 * containing the updated start and end dates
	 */

	/**
	 * @event dayclick
	 * Fires after the user clicks within the day view container and not on an event element
	 * @param {Sonicle.calendar.view.DayBody} this
	 * @param {Date} dt The date/time that was clicked on
	 * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
	 * DayBodyView always return false for this param.
	 * @param {Ext.core.Element} el The Element that was clicked on
	 * @param {Ext.event.Event} evt The raw event object.
	 */
	
	/**
	 * @event daydblclick
	 * Fires after the user clicks within the day view container and not on an event element
	 * @param {Sonicle.calendar.view.DayBody} this
	 * @param {Date} dt The date/time that was clicked on
	 * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
	 * DayBodyView always return false for this param.
	 * @param {Ext.core.Element} el The Element that was clicked on
	 * @param {Ext.event.Event} evt The raw event object.
	 */
	
	$nowMarkerCls: 'so-'+'cal-now-marker',
	slotTicks: 5,
	slotsPerHour: null, // calculated below
	
	constructor: function(cfg) {
		var me = this;
		me.slotsPerHour = 60 / me.slotTicks;
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		me.incrementsPerHour = me.hourIncrement / me.ddIncrement;
		me.minEventHeight = me.minEventDisplayMinutes / (me.hourIncrement / me.hourHeight);
	},
	
	doDestroy: function() {
		var me = this;
		me.setShowNowMarker(false);
		me.callParent();
	},
	
	initDD: function() {
		var me = this, cfg = {
			use24HourTime: me.use24HourTime,
			createText: me.ddCreateEventText,
			copyText: me.ddCopyEventText,
			moveText: me.ddMoveEventText,
			resizeText: me.ddResizeEventText,
			dateFormat: me.ddDateFormat,
			ddIncrement: me.ddIncrement
		};

		me.el.ddScrollConfig = {
			// scrolling is buggy in IE/Opera for some reason. A larger vthresh
			// makes it at least functional if not perfect
			vthresh: Ext.isIE || Ext.isOpera ? 100 : 40,
			hthresh: -1,
			frequency: 50,
			increment: 100,
			ddGroup: 'DayViewDD'
		};
		me.dragZone = Ext.create('Sonicle.calendar.dd.DayDragZone', me.el, Ext.apply({
			view: me,
			containerScroll: true
		},
		cfg));

		me.dropZone = Ext.create('Sonicle.calendar.dd.DayDropZone', me.el, Ext.apply({
			view: me
		},
		cfg));
	},
	
	updateShowNowMarker: function(showNowMarker) {
		var me = this,
				markerId = me.nowMarkerId();
		
		clearInterval(me.showNowInterval);
		me.showNowInterval = null;
		Ext.destroy(Ext.fly(markerId));
		
		if (showNowMarker) {
			if (!me.isConfiguring) me.checkNowMarker();
			me.showNowInterval = Ext.interval(me.checkNowMarker, 300000, me); // 5 mins 
		}
	},
	
	renderTemplate: function() {
		var me = this;
		me.callParent();
		if (me.tpl) {
			me.checkNowMarker();
		}
	},
	
	refresh: function(reloadData) {
		var me = this;
		//		top = me.el.getScroll().top;
		me.callParent(arguments);
		
		// skip this if the initial render scroll position has not yet been set.
		// necessary since IE/Opera must be deferred, so the first refresh will
		// override the initial position by default and always set it to 0.
		/*
		if (me.scrollReady) {
			//console.log('scroll ready');
			me.scrollTo(top);
		}
		*/
	},
	
	/**
	 * Scrolls the container to the specified vertical position. If the view is large enough that
	 * there is no scroll overflow then this method will have no effect.
	 * @param {Number} y The new vertical scroll position in pixels 
	 * @param {Boolean} defer (optional) <p>True to slightly defer the call, false to execute immediately.</p> 
	 * <p>This method will automatically defer itself for IE and Opera (even if you pass false) otherwise
	 * the scroll position will not update in those browsers. You can optionally pass true, however, to
	 * force the defer in all browsers, or use your own custom conditions to determine whether this is needed.</p>
	 * <p>Note that this method should not generally need to be called directly as scroll position is managed internally.</p>
	 */
	scrollTo: function(y, defer) {
		var me = this,
				defer = defer || (Ext.isIE || Ext.isOpera);
		if (defer) {
			Ext.defer(function() {
				me.el.scrollTo('top', y, true);
				//me.scrollReady = true;
			}, 50, this);
		} else {
			me.el.scrollTo('top', y, true);
			//me.scrollReady = true;
		}
	},
	
	afterRender: function() {
		var me = this;
		if (!me.tpl) {
			me.tpl = Ext.create('Sonicle.calendar.template.DayBody', {
				id: me.id,
				use24HourTime: me.use24HourTime,
				dayCount: me.dayCount,
				showTodayText: me.showTodayText,
				todayText: me.todayText,
				showTime: me.showTime,
				showHourSeparator: me.showHourSeparator,
				viewStartHour: me.viewStartHour,
				viewEndHour: me.viewEndHour,
				hourIncrement: me.hourIncrement,
				hourHeight: me.hourHeight,
				highlightBusinessHours: me.highlightBusinessHours,
				businessHoursStart: me.businessHoursStart,
				businessHoursEnd: me.businessHoursEnd
			});
		}
		me.tpl.compile();
		me.addCls('ext-cal-body-ct');
		
		me.callParent(arguments);
		
		// default scroll position to scrollStartHour (7am by default) or min view hour if later
		var startHour = Math.max(me.scrollStartHour, me.viewStartHour),
				scrollStart = Math.max(0, startHour - me.viewStartHour);
		if (scrollStart > 0) me.scrollTo(scrollStart * me.hourHeight, true);
	},
	
	forceSize: Ext.emptyFn,
	
	onEventResize: function(rec, data) {
		var me = this,
				SoDate = Sonicle.Date,
				EM = Sonicle.calendar.data.EventMappings;

		if (SoDate.compare(rec.data[EM.StartDate.name], data.StartDate) === 0 &&
				SoDate.compare(rec.data[EM.EndDate.name], data.EndDate) === 0) {
			// no changes
			return;
		}
		
		if (me.fireEvent('beforeeventresize', me, rec, data) !== false) {
			me.doEventResize(rec, data);
		}
	},
	
	doEventResize: function(rec, data) {
		var me = this,
				EM = Sonicle.calendar.data.EventMappings;
		
		rec.set(EM.StartDate.name, data.StartDate);
		rec.set(EM.EndDate.name, data.EndDate);
		rec.commit();
		
		me.fireEvent('eventupdate', this, rec);
		me.fireEvent('eventresize', this, rec);
	},
	
	/**
	 * @protected
	 */
	getEventBodyMarkup: function() {
		if (!this.eventBodyMarkup) {
			this.eventBodyMarkup = [
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
				'<tpl if="_hasMeeting">',
				'<i class="ext-cal-ic {_meetIconCls}">&#160;</i>',
				'<tpl elseif="_hasComments">',
				'<i class="ext-cal-ic {_commIconCls}">&#160;</i>',
				'</tpl>',
				'{Title}',
				'<tpl for="_tags">',
				'<span style="color:{color};margin:0 0 0 2px">',
					'<i class="fas fa-tag"></i>',
				'</span>',
				'</tpl>'
			].join('');
		}
		return this.eventBodyMarkup;
	},
	
	/**
	 * @protected
	 */
	getEventTemplate: function() {
		var me = this;
		if (!me.eventTpl) {
			me.eventTpl = !(Ext.isIE || Ext.isOpera) ?
				Ext.create('Ext.XTemplate',
					'<div id="{_elId}" data-qtitle="{TooltipTitle}" data-qtip="{Tooltip}" data-draggable="{_isDraggable}" data-resizable="{_isResizable}" class="{_selectorCls} {_colorCls} {_spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px; background:{_bgColor};">',
						'<tpl if="_isResizable">',
						'<div class="ext-evt-rsz ext-evt-rsz-top"><div class="ext-evt-rsz-h">&#160;</div></div>',
						'</tpl>',
						'<div class="ext-evt-bd" style="color:{_foreColor};">', me.getEventBodyMarkup(), '</div>',
						'<tpl if="_isResizable">',
						'<div class="ext-evt-rsz ext-evt-rsz-bottom"><div class="ext-evt-rsz-h">&#160;</div></div>',
						'</tpl>',
					'</div>'
				)
				: Ext.create('Ext.XTemplate',
					'<div id="{_elId}" data-qtitle="{Title}" data-qtip="{Tooltip}" data-draggable="{_isDraggable}" data-resizable="{_isResizable}" class="ext-cal-evt {_selectorCls} {_spanCls} {_colorCls}-x" style="left: {_left}%; width: {_width}%; top: {_top}px; background:{_bgColor};">',
						'<div class="ext-cal-evb">&#160;</div>',
						'<dl style="height: {_height}px;" class="ext-cal-evdm">',
							'<tpl if="_isResizable">',
							'<div class="ext-evt-rsz ext-evt-rsz-top"><div class="ext-evt-rsz-h">&#160;</div></div>',
							'</tpl>',
							'<dd class="ext-evt-bd" style="color:{_foreColor};">', me.getEventBodyMarkup(), '</dd>',
							'<tpl if="_isResizable">',
							'<div class="ext-evt-rsz ext-evt-rsz-bottom"><div class="ext-evt-rsz-h">&#160;</div></div>',
							'</tpl>',
						'</dl>',
						'<div class="ext-cal-evb">&#160;</div>',
					'</div>'
				);
			me.eventTpl.compile();
		}
		return me.eventTpl;
	},
	
	/**
	 * <p>Returns the XTemplate that is bound to the calendar's event store (it expects records of type
	 * {@link Sonicle.calendar.EventRecord}) to populate the calendar views with <strong>all-day</strong> events. 
	 * Internally this method by default generates different markup for browsers that support CSS border radius 
	 * and those that don't. This method can be overridden as needed to customize the markup generated.</p>
	 * <p>Note that this method calls {@link #getEventBodyMarkup} to retrieve the body markup for events separately
	 * from the surrounding container markup.  This provdes the flexibility to customize what's in the body without
	 * having to override the entire XTemplate. If you do override this method, you should make sure that your 
	 * overridden version also does the same.</p>
	 * @return {Ext.XTemplate} The event XTemplate
	 */
	getEventAllDayTemplate: function() {
		if (!this.eventAllDayTpl) {
			var tpl,
					body = this.getEventBodyMarkup();

			tpl = !(Ext.isIE || Ext.isOpera) ?
				Ext.create('Ext.XTemplate',
					'<div id="{_elId}" class="{_selectorCls} {_colorCls} {_spanCls} ext-cal-evt ext-cal-evr" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px; background:{_bgColor};">',
					body,
					'</div>'
				)
				: Ext.create('Ext.XTemplate',
					'<div id="{_elId}" class="ext-cal-evt" style="left: {_left}%; width: {_width}%; top: {_top}px; height: {_height}px; background:{_bgColor};">',
						'<div class="{_selectorCls} {_spanCls} {_colorCls} ext-cal-evo">',
							'<div class="ext-cal-evm">',
								'<div class="ext-cal-evi">',
								body,
							'</div>',
						'</div>',
					'</div></div>'
				);
			tpl.compile();
			this.eventAllDayTpl = tpl;
		}
		return this.eventAllDayTpl;
	},
	
	getTemplateEventData: function(evt, date) {
		var me = this,
				soDate = Sonicle.Date,
				SoS = Sonicle.String,
				EU = Sonicle.calendar.util.EventUtils,
				EM = Sonicle.calendar.data.EventMappings,
				isSpan = me.isEventSpanning(evt),
				spanTop = false,
				spanBottom = false,
				selector = me.getEventSelectorCls(evt[EM.Id.name]),
				start = evt[EM.StartDate.name],
				end = evt[EM.EndDate.name],
				dtags = Sonicle.form.field.Tag.buildTagsData(me.tagsStore, me.tagNameField, me.tagColorField, -1, evt[EM.Tags.name]),
				dinfo = EU.buildDisplayInfo(evt, dtags, EU.dateFmt(), EU.timeFmt(me.use24HourTime)),
				data = {};
		
		if(isSpan) {
			// Make use of weekIndex property already known for drawing
			// horizontal spanning events
			evt._weekIndex = soDate.diffDays(date, start)+1;
			if(soDate.diffDays(start, date) === 0) {
				spanBottom = true;
				data[EM.EndDate.name] = end = soDate.setTime(date, 23, 59, 59);
			} else if (soDate.diffDays(end, date) === 0) {
				spanTop = true;
				data[EM.StartDate.name] = start = soDate.setTime(date, 0, 0, 0);
			} else {
				data[EM.EndDate.name] = end = soDate.setTime(date, 23, 59, 59);
				data[EM.StartDate.name] = start = soDate.setTime(date, 0, 0, 0);
			}
		}
		Ext.apply(evt, me.getTemplateEventBox(start, end));
		data._elId = selector + (evt._weekIndex ? '-' + evt._weekIndex : '');
		data._selectorCls = selector;
		data._bgColor = (evt[EM.Color.name] || '');
		data._foreColor = me.getEventForeColor(data._bgColor),
		data._colorCls = 'ext-color-' + (evt[EM.Color.name] || 'nocolor') + (evt._renderAsAllDay ? '-ad' : '');
		data._spanCls = (!isSpan ? '' : (!spanTop && !spanBottom ? 'ext-cal-ev-spanboth' : (spanBottom ? 'ext-cal-ev-spanbottom' : 'ext-cal-ev-spantop')));
		data._isDraggable = (!me.readOnly && !isSpan) ? EU.isMovable(evt) : false;
		data._isResizable = (!me.readOnly && !isSpan && me.enableEventResize) ? EU.isMovable(evt) : false;
		data._hasTimezone = (evt[EM.HasTimezone.name] === true);
		data._isPrivate = (evt[EM.IsPrivate.name] === true);
		data._hasReminder = (evt[EM.Reminder.name] !== -1);
		data._hasMeeting = !Ext.isEmpty(evt[EM.Meeting.name]);
		data._hasAttendees = (evt[EM.HasAttendees.name] === true);
		data._isRecurring = (evt[EM.IsRecurring.name] === true);
		data._isBroken = (evt[EM.IsBroken.name] === true);
		data._hasComments = (evt[EM.HasComments.name] === true);
		data._tzIconCls = me.timezoneIconCls;
		data._pvtIconCls = me.privateIconCls;
		data._remIconCls = me.reminderIconCls;
		data._attIconCls = me.attendeesIconCls;
		data._recIconCls = (evt[EM.IsBroken.name] === true) ? me.recurrenceBrokenIconCls : me.recurrenceIconCls;
		data._meetIconCls = me.meetingIconCls;
		data._commIconCls = me.commentsIconCls;
		data._tags = dtags,
		data.isSpan = isSpan;
		data.spanTop = spanTop;
		data.spanBottom = spanBottom;
		data.Title = SoS.htmlAttributeEncode(dinfo.title);
		//looks like tooltip title needs to be encoded twice or any html will be interpreted
		//[ see https://forum.sencha.com/forum/showthread.php?333529 ]
		data.TooltipTitle = SoS.htmlAttributeEncode(data.Title);
		//we want html to be interpreted instead here
		data.Tooltip = SoS.htmlAttributeEncode(dinfo.tooltip);
		return Ext.applyIf(data, evt);
	},
	
	getEventPositionOffsets: function() {
		return {
			top: 0,
			height: -1
		};
	},
	
	getTemplateEventBox: function(start, end) {
		var me = this,
				heightFactor = me.hourHeight / me.hourIncrement,
				startOffset = Math.max(start.getHours() - me.viewStartHour, 0),
				endOffset = Math.min(end.getHours() - me.viewStartHour, me.viewEndHour - me.viewStartHour),
				startMins = startOffset * me.hourIncrement,
				endMins = endOffset * me.hourIncrement,
				viewEndDt = Ext.Date.clearTime(Sonicle.Date.add(end, {hours: me.viewEndHour})),
				evtOffsets = this.getEventPositionOffsets();
		
		if (start.getHours() >= me.viewStartHour) {
			// only add the minutes if the start is visible, otherwise it offsets the event incorrectly
			startMins += start.getMinutes();
		}
		if (end <= viewEndDt) {
			// only add the minutes if the end is visible, otherwise it offsets the event incorrectly
			endMins += end.getMinutes();
		}
		
		return {
			_left: 0,
			_width: 100,
			_top: startMins * heightFactor + evtOffsets.top,
			_height: Math.max(((endMins - startMins) * heightFactor), me.minEventHeight) + evtOffsets.height
		};
	},
	
	/**
	 * Render events.
	 * The event layout is based on this article: http://stackoverflow.com/questions/11311410/ and this sample
	 * implementation http://jsbin.com/detefuveta/5/edit?html,js,output     *
	 */
	renderItems: function() {
		var me = this;
		
		// This is legacy rendering (instead of 2 sentences below), here for easy revert-back! (WT-680)
		//me.legacyRenderItems();
		
		me.layoutAndRenderItems(me.filterEventsToRender());
		me.fireEvent('eventsrendered', me);
     },
	 
	/**
	 * @protected
	 * Filters events and returns a list of events that need to be displayed by the day body view.
	 * For example, all-day events and multi-day events are filtered out because they are not
	 * displayed in the body. This is a private helper function.
	 * @returns {Array} An array of events.
	 */
	filterEventsToRender: function() {
		var me = this,
				EM = Sonicle.calendar.data.EventMappings,
				evt,
				evts = [];
		
		for (var day = 0; day < me.dayCount; day++) {
			var ev = 0,
					d = me.eventGrid[0][day],
					ct = d ? d.length : 0;
			
			for (; ev < ct; ev++) {
				evt = d[ev];
                if (!evt) continue;
				
				var item = evt.data || evt.event.data,
						ad = item[EM.IsAllDay.name] === true,
						span = me.isEventSpanning(evt.event || evt),
						renderAsAllDay = ad || (span && (me.eventDurationInHours(evt.event || evt) >= 24)),
						date;
				
				// this event is already rendered in the header view
				if (renderAsAllDay) continue;
				
				Ext.apply(item, {
					cls: 'ext-cal-ev',
					_positioned: true
				});
                
				date = Sonicle.Date.add(me.viewStart, {days: day});
				evts.push({
					data: me.getTemplateEventData(item, date),
					date: date
				});
			}
		}
		return evts;
	},
	
	/**
	 * @protected
	 * Layout events and render to DOM.
	 * @param {Array} events An array of events.
	 */
	layoutAndRenderItems: function(evts) {
		var me = this,
				EM = Sonicle.calendar.data.EventMappings,
				i = 0,
				j = 0,
				l = evts.length,
				evt,
				minEventDuration = (me.minEventDisplayMinutes || 0) * 60 * 1000,
				lastEventEnding = 0,
				columns = [], // virtual columns for placement of the events
				eventGroups = [];
		
		for (i=0; i<l; i++) {
			evt =  evts[i];
			if (lastEventEnding !== 0 && evt.data[EM.StartDate.name].getTime() >= lastEventEnding) {
				// This event does not overlap with the current event group. Start a new event group.
				eventGroups.push(columns);
				columns = [];
				lastEventEnding = 0;
            }
            
			var placed = false;
			for (j = 0; j < columns.length; j++) {
				var col = columns[j];
				if (!me.isOverlapping(col[col.length-1], evt)) {
					col.push(evt);
					placed = true;
					break;
				}
			}
			if (!placed) columns.push([evt]);
			
            // Remember the last event time of the event group.
			// Very short events have a minimum duration on screen (we can't see a one minute event).
			var eventDuration = evt.data[EM.EndDate.name].getTime() - evt.data[EM.StartDate.name].getTime(),
					eventEnding;
            
			if (eventDuration < minEventDuration) {
				eventEnding = evt.data[EM.StartDate.name].getTime() + minEventDuration;
			} else {
				eventEnding = evt.data[EM.EndDate.name].getTime();
			}
			if (eventEnding > lastEventEnding) lastEventEnding = eventEnding;
		}
		
		// Push the last event group, if there is one.
		if (columns.length > 0) eventGroups.push(columns);

		// Rendering loop
		l = eventGroups.length;
		
		// Loop over all the event groups.
		for (i = 0; i < l; i++) {
			var evtGroup = eventGroups[i],
					numColumns = evtGroup.length;
			
			// Loop over all the virtual columns of an event group
			for (j = 0; j < numColumns; j++) {
				col = evtGroup[j];
				
				// Loop over all the events of a virtual column
				for (var k = 0; k < col.length; k++) {
					evt = col[k];
					
					// Check if event is rightmost of a group and can be expanded to the right
					var colSpan = me.expandEvent(evt, j, evtGroup);
					
					evt.data._width = (100 * colSpan / numColumns);
					evt.data._left = (j / numColumns) * 100;
					var markup = me.getEventTemplate().apply(evt.data),
							target = target = me.getDayId(evt.date, null, evt.data.CalendarId);
					Ext.DomHelper.append(target, markup);
				}
			}
		}
	},
	
	/**
	 * @private
	 * Expand events at the far right to use up any remaining space.
	 * @param {Object} evt Event to process.
	 * @param {int} iColumn Virtual column to where the event will be rendered.
	 * @param {Array} columns List of virtual colums for event group. Each column contains a list of events.
	 * @return {Number}
	 */
	expandEvent: function(evt, iColumn, columns) {
		var me = this,
				colSpan = 1;
		
		// To see the output without event expansion, uncomment
		// the line below. Watch column 3 in the output.
		// return colSpan;
		
		for (var i = iColumn + 1; i < columns.length; i++) {
			var col = columns[i];
			for (var j = 0; j < col.length; j++) {
				var evt1 = col[j];
				if (me.isOverlapping(evt, evt1)) return colSpan;
			}
			colSpan++;
		}
		return colSpan;
	},
	
	/*
	legacyRenderItems: function() {
		var me = this,
				XDate = Ext.Date,
				EM = Sonicle.calendar.data.EventMappings,
				day = 0,
				evts = [], evt;
		
		for (; day < me.dayCount; day++) {
			var ev = 0,
					d = me.eventGrid[0][day],
					ct = d ? d.length : 0;
			
			for (; ev < ct; ev++) {
				evt = d[ev];
				if (!evt) continue;
				
				var item = evt.data || evt.event.data,
						ad = item[EM.IsAllDay.name] === true,
						span = me.isEventSpanning(evt.event || evt),
						date;
				
				//TODO: 24h threshold as config
				if (ad || (span && (me.eventDurationInHours(evt.event || evt) >= 24))) {
					// this event is already rendered in the header view
					continue; 
				}
				
				Ext.apply(item, {
					cls: 'ext-cal-ev',
					_positioned: true
				});
				date = XDate.add(me.viewStart, XDate.DAY, day, true);
				evts.push({
					data: me.getTemplateEventData(item, date),
					date: date
				});
			}
		}
		
		// overlapping event pre-processing loop
		var l = evts.length,
				overlapCols = [],
				evt2,
				dt,
				i, j;
		
		for (i=0; i<l; i++) {
			evt = evts[i].data;
			evt2 = null;
			dt = evt[EM.StartDate.name].getDate();
			
			for (j=0; j<l; j++) {
				if (i === j) continue;
				
				evt2 = evts[j].data;
				if (me.isOverlapping(evt, evt2)) {
					evt._overlap = evt._overlap === undefined ? 1 : evt._overlap+1;
					if (i < j) {
						if (evt._overcol === undefined) evt._overcol = 0;
						evt2._overcol = evt._overcol + 1;
						overlapCols[dt] = overlapCols[dt] ? Math.max(overlapCols[dt], evt2._overcol) : evt2._overcol;
					}
				}
			}
		}
		
		// rendering loop
		for (i=0; i<l; i++) {
			evt = evts[i].data;
			dt = evt[EM.StartDate.name].getDate();
			
			if (evt._overlap !== undefined) {
				var colWidth = 100 / (overlapCols[dt]+1),
						evtWidth = 100 - (colWidth * evt._overlap);
				
				evt._width = colWidth;
				evt._left = colWidth * evt._overcol;
			}
			
			var markup = me.getEventTemplate().apply(evt),
					target = me.id + '-day-col-' + Ext.Date.format(evts[i].date, 'Ymd');
			Ext.DomHelper.append(target, markup);
		}
		
		me.fireEvent('eventsrendered', me);
	},
	*/
	
	getDayColumn: function(date) {
		return this.el.down('#' + this.tpl.dayColumnId(date));
	},
	
	getDayEl: function(dt) {
		return Ext.get(this.getDayId(dt));
	},
	
	getDayId: function(dt) {
		if (Ext.isDate(dt)) {
			dt = Ext.Date.format(dt, 'Ymd');
		}
		return this.id + this.dayColumnElIdDelimiter + dt;
	},
	
	getDaySize: function() {
		var box = this.el.down('.ext-cal-day-col-inner').getBox();
		return {
			height: box.height,
			width: box.width
		};
	},
	
	getDayAt: function(x, y) {
		var me = this,
				xoffset = me.el.down('.ext-cal-day-times').getWidth(),
				viewBox = me.el.getBox(),
				daySize = me.getDaySize(false),
				relX = x - viewBox.x - xoffset,
				dayIndex = Math.floor(relX / daySize.width), // clicked col index
				scroll = me.el.getScroll(),
				row = me.el.down('.ext-cal-bg-row'), // first avail row, just to calc size
				rowH = row.getHeight() / me.incrementsPerHour,
				relY = y - viewBox.y - rowH + scroll.top,
				rowIndex = Math.max(0, Math.ceil(relY / rowH)),
				mins = rowIndex * (me.hourIncrement / me.incrementsPerHour),
				//dt = Sonicle.Date.add(me.viewStart, {days: dayIndex, minutes: mins, hours: me.viewStartHour}),
				dt = Sonicle.Date.add(Ext.Date.clearTime(me.viewStart), {days: dayIndex, minutes: mins, hours: me.viewStartHour}, true),
				el = me.getDayEl(dt),
				timeX = x;

		if (el) {
			timeX = el.getX();
		}

		return {
			date: dt,
			el: el,
			// this is the box for the specific time block in the day that was clicked on:
			timeBox: {
				x: timeX,
				y: (rowIndex * me.hourHeight / me.incrementsPerHour) + viewBox.y - scroll.top,
				width: daySize.width,
				height: rowH
			}
		};
	},
	
	onClick: function(e, t) {
		var me = this, el, date, day;
		
		// The superclass handled the click already so exit
		if (me.dragPending || Sonicle.calendar.view.DayBody.superclass.onClick.apply(this, arguments)) return;
		// ignore clicks on the times-of-day gutter
		if (e.getTarget('.ext-cal-day-times', 3) !== null) return;
		
		if (el = e.getTarget('td', 3)) {
			if (el.id && el.id.indexOf(me.dayElIdDelimiter) > -1) {
				date = me.getDateFromId(el.id, me.dayElIdDelimiter);
				// We handle dayclick/daydblclick in same way...
				me.fireEvent('day'+e.type, me, Ext.Date.parseDate(date, 'Ymd'), true, Ext.get(me.getDayId(date, true)), e);
				return;
			}
		}
		
		day = me.getDayAt(e.getX(), e.getY());
		if (day && day.date) {
			// We handle click/dblclick in same way...
			me.fireEvent('day'+e.type, me, day.date, false, null, e);
			return;
		}
	},
	
	onContextMenu: function(e, t) {
		var me = this, el, day;
		
		// The superclass handled the click already so exit
		if (Sonicle.calendar.view.DayBody.superclass.onContextMenu.apply(me, arguments)) return;
		
		if (el = e.getTarget('.ext-cal-day-col-gutter', 2, true)) {
			day = me.getDayAt(e.getX(), e.getY());
			if (day && day.date) {
				me.fireEvent('daycontextmenu', me, day.date, false, e, el);
			}
		}
	},
	
	getVisibleBounds: function() {
		var me = this,
				ExDate = Ext.Date,
				bounds = me.callParent(arguments);
		return {
			start: ExDate.add(bounds.start, ExDate.HOUR, me.viewStartHour, true),
			end: ExDate.subtract(bounds.end, ExDate.HOUR, 24 - me.viewEndHour, true)
		};
	},
	
	/**
	 * @protected
	 */
	isActiveView: function() {
		var pnl = this.ownerCalendarPanel;
		return (pnl && pnl.getActiveView().isDayView);
	},
	
	privates: {
		nowMarkerId: function() {
			return this.id + '-now-marker';
		},
		
		checkNowMarker: function() {
			if (this.getShowNowMarker()) {
				this.doCheckNowMarker();
			}
		},
		
		/**
		 * Checks the position of the now marker, hides/shows it in the correct 
		 * place as required. Does not check the existence of the config flag, 
		 * assumes it's true at this point.
		 */
		doCheckNowMarker: function() {
			var me = this,
					XDate = Ext.Date,
					EU = Sonicle.calendar.util.EventUtils,
					minSlotHeight = me.hourHeight / me.slotsPerHour,
					days = me.dayCount,
					startHour = me.viewStartHour,
					endHour = me.viewEndHour,
					markerId = me.nowMarkerId(),
					now = EU.roundDate(EU.getLocalNow(), me.slotTicks * 1000),
					y = now.getFullYear(),
					m = now.getMonth(),
					d = now.getDate(),
					h = now.getHours(),
					min = now.getMinutes(),
					vbounds, dt, end,
					offset, pos, i;
			
			Ext.destroy(Ext.fly(markerId));
			if (!me.el || !me.el.isVisible(true)) return;
			
			vbounds = me.getVisibleBounds();
			dt = EU.utcToLocal(vbounds.start);
			end = EU.utcToLocal(vbounds.end);

			if (dt <= now && now < end) {
				for (i = 0; i < days; ++i) {
					if (dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d) {
						// Same day, check time ranges 
						if (startHour <= h && (h < endHour || h === endHour && min === 0)) {
							dt.setHours(startHour);
							offset = XDate.diff(dt, now, XDate.MINUTE);
							pos = (offset / me.slotTicks) * minSlotHeight;
						}
						break;
					}
					dt = XDate.add(dt, XDate.DAY, 1, true);
				}
			}

			if (pos !== undefined) {
				Ext.fly(me.getDayColumn(dt)).createChild({
					id: markerId,
					cls: me.$nowMarkerCls,
					style: { top: pos + 'px' }
				}, null, true);
			}
		}
	}
});
