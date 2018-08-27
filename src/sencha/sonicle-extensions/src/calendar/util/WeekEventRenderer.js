/* @private
 * This is an internal helper class for the calendar views and should not be overridden.
 * It is responsible for the base event rendering logic underlying all views based on a 
 * box-oriented layout that supports day spanning (MonthView, MultiWeekView, DayHeaderView).
 */
Ext.define('Sonicle.calendar.util.WeekEventRenderer', {
	requires: [
		'Ext.DomHelper',
		'Sonicle.Date'
	],
	
	statics: {
		/**
		 * Retrieve the event layout table row for the specified week and row index. If
		 * the row does not already exist it will get created and appended to the DOM.
		 * This method does not check against the max allowed events -- it is the responsibility
		 * of calling code to ensure that an event row at the specified index is really needed.
		 */
		getEventRow: function(viewId, weekIndex, rowIndex) {
			var indexOffset = 1, //skip the first row with date #'s
					evtRow,
					wkRow = Ext.get(viewId + '-wk-' + weekIndex);
			if (wkRow) {
				var table = wkRow.child('.ext-cal-evt-tbl', true);
				evtRow = table.tBodies[0].childNodes[rowIndex + indexOffset];
				if (!evtRow) {
					evtRow = Ext.core.DomHelper.append(table.tBodies[0], '<tr></tr>');
				}
			}
			return Ext.get(evtRow);
		},
		
		/**
		 * @private
		 * Render an individual event
		 */
		renderEvent: function(event, weekIndex, dayIndex, eventIndex, dayCount, currentDate, renderCfg) {
			var XDate = Ext.Date,
					SoDate = Sonicle.Date,
					EM = Sonicle.calendar.data.EventMappings,
					EU = Sonicle.calendar.util.EventUtils,
					data = event.data || event.event.data,
					startOfWeek = Ext.Date.clearTime(currentDate, true),
					//endOfWeek = XDate.add(startOfWeek, XDate.DAY, dayCount - dayIndex, true),
					endOfWeek = SoDate.add(startOfWeek, {days: dayCount - dayIndex, millis: -1}, true),
					likeSingle = !data[EM.IsAllDay.name] && EU.isLikeSingleDay(data[EM.StartDate.name], data[EM.EndDate.name]),
					daysToEventEnd = SoDate.diffDays(currentDate, data[EM.EndDate.name]) + 1,
					// Restrict the max span to the current week only since this is for the current week's markup
					colspan = Math.min(daysToEventEnd, dayCount - dayIndex),
					evtRow;
			
			// The view passes a template function to use when rendering the events.
			// These are special data values that get passed back to the template.
			data._weekIndex = weekIndex;
			data._renderAsAllDay = data[EM.IsAllDay.name] || event.isSpanStart;
			data.spanLeft = likeSingle ? false : SoDate.isBefore(data[EM.StartDate.name], startOfWeek);
			data.spanRight = likeSingle ? false : SoDate.isAfter(data[EM.EndDate.name], endOfWeek);
			data._spanCls = (data.spanLeft ? (data.spanRight ? 'ext-cal-ev-spanboth' : 
					'ext-cal-ev-spanleft') : (data.spanRight ? 'ext-cal-ev-spanright' : ''));
			
			evtRow = this.getEventRow(renderCfg.id, weekIndex, eventIndex);
			var cellCfg = {
				tag: 'td',
				cls: 'ext-cal-ev',
				// This is where the passed template gets processed and the markup returned
				cn: renderCfg.tpl.apply(renderCfg.templateDataFn(data))
			};
			if (!likeSingle && (colspan > 1)) {
				cellCfg.colspan = colspan;
			}
			Ext.DomHelper.append(evtRow, cellCfg);
		},
		
		/**
		 * @private
		 * Events are collected into a big multi-dimensional array in the view, then passed here
		 * for rendering. The event grid consists of an array of weeks (1-n), each of which contains an
		 * array of days (1-7), each of which contains an array of events and span placeholders (0-n).
		 * @param {Object} cfg An object containing all of the supported config options (see
		 * Sonicle.calendar.view.Month.renderItems() to see what gets passed).
		 */
		render: function(cfg) {
			var me = this,
					XDate = Ext.Date,
					SoDate = Sonicle.Date,
					grid = cfg.eventGrid,
					maxEPD = (cfg.maxEventsPerDay !== undefined) ? cfg.maxEventsPerDay : 999,
					weekCount = (cfg.weekCount < 1) ? 6 : cfg.weekCount,
					dayCount = (cfg.weekCount === 1) ? cfg.dayCount : 7,
					dt = SoDate.add(XDate.clearTime(cfg.viewStart, true), {hours: 12}),
					spaceChr = '&#160;',
					wi = 0,
					di, ei, wGrid, dGrid, sdt, evtRow, cellCfg, eventCount, skippedCount, evt;
			
			// renderCfg.id -> renderCfg.viewId (nella nuova release)
			
			// Loop through each week in the overall event grid
			for (; wi < weekCount; wi++) {
				wGrid = grid[wi];
				di = 0;
				
				// Loop through each day in the current week grid
				for (; di < dayCount; di++) {
					sdt = XDate.format(dt, 'Ymd');
					
					// Make sure there is actually a day to process events for first
					if (wGrid && wGrid[di]) {
						dGrid = wGrid[di];
						eventCount = dGrid.length;
						skippedCount = 0;
						ei = 0;
						
						// Loop through each event in the current day grid. Note that this grid can
						// also contain placeholders representing segments of spanning events, though
						// for simplicity's sake these will all be referred to as "events" in comments.
						for (; ei < eventCount; ei++) {
							if (!dGrid[ei]) {
								// There is no event at the current index
								if (ei >= maxEPD) {
									// We've already hit the max count of displayable event rows, so
									// skip adding any additional empty row markup. In this case, since
									// there is no event we don't track it as a skipped event as below.
									continue;
								}
								
								// Insert an empty TD since there is no event at this index
								evtRow = me.getEventRow(cfg.id, wi, ei);
								Ext.DomHelper.append(evtRow, {
									tag: 'td',
									id: cfg.id + '-empty-' + eventCount + '-day-' + sdt,
									cls: 'ext-cal-ev',
									//style: 'outline: 1px solid red;', // helpful for debugging
									html: spaceChr
								});
								
							} else {
								if (ei >= maxEPD) {
									// We've hit the max count of displayable event rows, but since there
									// is an event at the current index we have to track the count of events
									// that aren't being rendered so that we can provide the proper count
									// when displaying the "more events" link below.
									skippedCount++;
									continue;
								}
								evt = dGrid[ei];

								// We only want to insert the markup for an event that does not span days, or
								// if it does span, only for the initial instance (not any of its placeholders
								// in the event grid, which are there only to reserve the space in the layout).
								if (!evt.isSpan || evt.isSpanStart) {
									me.renderEvent(evt, wi, di, ei, dayCount, dt, cfg);
								}
							}	
						}
						
						// We're done processing all of the events for the current day. Time to insert the
						// "more events" link or the last empty TD for the day, if needed.
						
						if (skippedCount > 0) {
							// We hit one or more events in the grid that could not be displayed since the max
							// events per day count was exceeded, so add the "more events" link.
							evtRow = me.getEventRow(cfg.id, wi, maxEPD);
							Ext.DomHelper.append(evtRow, {
								tag: 'td',
								id: 'ext-cal-ev-more-' + sdt,
								cls: 'ext-cal-ev-more',
								//style: 'outline: 1px solid blue;', // helpful for debugging
								cn: {
									tag: 'a',
									html: Ext.String.format(cfg.moreText, skippedCount)
								}
							});
							
						} else if (eventCount < cfg.evtMaxCount[wi]) {
							// We did NOT hit the max event count, meaning that we are now left with a gap in
							// the layout table which we need to fill with one last empty TD.
							evtRow = me.getEventRow(cfg.id, wi, eventCount);
							if (evtRow) {
								cellCfg = {
									tag: 'td',
									id: cfg.id + '-empty-' + (eventCount + 1) + '-day-' + sdt,
									cls: 'ext-cal-ev',
									//style: 'outline: 1px solid green;', // helpful for debugging
									html: spaceChr
								};
								
								// It's easy to determine at this point how many extra rows are needed, so
								// just add a rowspan rather than multiple dummy TDs if needed.
								var rowspan = cfg.evtMaxCount[wi] - eventCount;
								if (rowspan > 1) {
									cellCfg.rowspan = rowspan;
								}
								Ext.DomHelper.append(evtRow, cellCfg);
							}
						}
						// Else the event count for the current day equals the max event count, so the current
						// day is completely filled up with no additional placeholder markup needed.
							
					} else {
						// There are no events for the current day, so no need to go through all the logic
						// above -- simply append an empty TD spanning the total row count for the week.
						evtRow = me.getEventRow(cfg.id, wi, 0);
						if (evtRow) {
							cellCfg = {
								tag: 'td',
								id: cfg.id + '-empty-day-' + sdt,
								cls: 'ext-cal-ev',
								//style: 'outline: 1px solid purple;', // helpful for debugging
								html: spaceChr
							};
							if (cfg.evtMaxCount[wi] > 1) {
								cellCfg.rowSpan = cfg.evtMaxCount[wi];
							}
							Ext.DomHelper.append(evtRow, cellCfg);
						}
					}
					
					// Move to the next date and restart the loop
					dt = SoDate.add(dt, {days: 1});
				}
			}
		}
	}
});
