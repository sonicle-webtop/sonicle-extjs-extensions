/*
 * Internal drop zone implementation for the calendar day and week views.
 */
Ext.define('Sonicle.calendar.dd.DayDropZone', {
	extend: 'Sonicle.calendar.dd.DropZone',
	requires: [
		'Sonicle.Date',
		'Sonicle.calendar.util.EventUtils'
	],
	
	ddGroup: 'DayViewDD',
	
	updateProxy: function(e, data, start, end) {
		var me = this,
				timeFmt = Sonicle.calendar.util.EventUtils.timeFmt(me.use24HourTime),
				copy = false,
				text, dt;
		
		if(data.type === 'caldrag') {
			text = me.createText;
			dt = Ext.String.format(me.dateRangeFormat, 
					Ext.Date.format(start, timeFmt), 
					Ext.Date.format(end, timeFmt));
			
		} else if(data.type === 'eventdrag') {
			copy = e.ctrlKey || e.altKey;
			text = (e.ctrlKey || e.altKey) ? me.copyText : me.moveText;
			dt = Ext.Date.format(start, (me.dateFormat + ' ' + timeFmt));
			
		} else if(data.type === 'eventresize') {
			text = me.resizeText;
			dt = Ext.String.format(me.dateRangeFormat, 
					Ext.Date.format(start, timeFmt), 
					Ext.Date.format(end, timeFmt));
		}
		
		data.proxy.updateMsg(Ext.String.format(text, dt));
		return data.proxy.getDropAllowedCls(copy);
	},
	
	onNodeOver: function(n, dd, e, data) {
		var me = this,
				XDate = Ext.Date,
				SoDate = Sonicle.Date,
				EM = Sonicle.calendar.data.EventMappings,
				box,endDt,diff,curr,
				start,end,evtEl,dayCol;

		if (data.type === 'caldrag') {
			if (!me.dragStartMarker) {
				// Since the container can scroll, this gets a little tricky.
				// There is no el in the DOM that we can measure by default since
				// the box is simply calculated from the original drag start (as opposed
				// to dragging or resizing the event where the orig event box is present).
				// To work around this we add a placeholder el into the DOM and give it
				// the original starting time's box so that we can grab its updated
				// box measurements as the underlying container scrolls up or down.
				// This placeholder is removed in onNodeDrop.
				me.dragStartMarker = n.el.parent().createChild({
					style: 'position:absolute;'
				});
				me.dragStartMarker.setBox(n.timeBox);
				me.dragCreateDt = n.date;
			}
			box = me.dragStartMarker.getBox();
			box.height = Math.ceil(Math.abs(e.xy[1] - box.y) / n.timeBox.height) * n.timeBox.height;

			if (e.xy[1] < box.y) {
				box.height += n.timeBox.height;
				box.y = box.y - box.height + n.timeBox.height;
				endDt = XDate.add(me.dragCreateDt, XDate.MINUTE, me.ddIncrement, true);
			} else {
				n.date = XDate.add(n.date, XDate.MINUTE, me.ddIncrement, true);
			}
			me.shim(me.dragCreateDt, box);
			
			diff = SoDate.diff(me.dragCreateDt, n.date, XDate.MINUTE, true);
			curr = XDate.add(me.dragCreateDt, XDate.MINUTE, diff, true);
			me.dragStartDate = SoDate.min(me.dragCreateDt, curr);
			me.dragEndDate = endDt || SoDate.max(me.dragCreateDt, curr);
			return me.updateProxy(e, data, me.dragStartDate, me.dragEndDate);
			
		} else {
			evtEl = Ext.get(data.ddel);
			dayCol = evtEl.parent().parent();
			box = evtEl.getBox();
			box.width = dayCol.getWidth();

			if (data.type === 'eventdrag') {
				if (me.dragOffset === undefined) {
					// on fast drags there is a lag between the original drag start xy position and
					// that first detected within the drop zone's getTargetFromEvent method (which is
					// where n.timeBox comes from). to avoid a bad offset we calculate the
					// timeBox based on the initial drag xy, not the current target xy.
					//var initialTimeBox = me.view.getDayAt(data.xy[0], data.xy[1]).timeBox;
					//me.dragOffset = initialTimeBox.y - box.y;
					me.dragOffset = n.timeBox.y - box.y;
					box.y = n.timeBox.y - me.dragOffset;
				} else {
					box.y = n.timeBox.y;
				}
				
				box.x = n.el.getX();
				me.shim(n.date, box);
				return me.updateProxy(e, data, n.date, n.date);
				
			} else if (data.type === 'eventresize') {
				var units, newy;
				if (!me.resizeDt) me.resizeDt = n.date;
				box.x = dayCol.getLeft();
				
				if (data.direction === 'bottom') {
					if (e.getY() <= box.y) {
						units = 1;
					} else {
						units = Math.ceil(Math.abs(e.getY() - box.y) / n.timeBox.height);
						n.date = XDate.add(n.date, XDate.MINUTE, me.ddIncrement, true);
					}
					newy = box.y;
					start = XDate.clone(data.eventStart);
					end = XDate.add(XDate.clone(start), XDate.MINUTE, units * me.ddIncrement, true);
					
				} else if (data.direction === 'top') {
					if (e.getY() >= (box.y + box.height)) {
						units = 1;
					} else {
						units = Math.ceil(Math.abs(e.getY() - (box.y + box.height)) / n.timeBox.height);
						n.date = XDate.add(n.date, XDate.MINUTE, -me.ddIncrement, true);
					}
					newy = (box.y + box.height) - (n.timeBox.height * units);
					end = XDate.clone(data.eventEnd);
					start = XDate.add(XDate.clone(end), XDate.MINUTE, units * -me.ddIncrement, true);
				}
				
				box.y = newy;
				box.height = n.timeBox.height * units;
				me.shim(me.resizeDt, box);
				
				//data.resizeDates = {};
				//data.resizeDates[EM.StartDate.name] = start;
				//data.resizeDates[EM.EndDate.name] = end;
				data.resizeDates = {
					StartDate: start,
					EndDate: end
				};
				
				return me.updateProxy(e, data, start, end);
				
				/*
				box.x = dayCol.getX();
				
				var units;
				if (data.direction === 'bottom') {
					if (!me.resizeDt) {
						me.resizeDt = n.date;
						me.resizeBox = {
							yRef: box.y, // Reference y-coord for computing units
							height: box.height
						};
					}
					units = (e.xy[1] <= me.resizeBox.yRef) ? 1 : Math.ceil(Math.abs(e.xy[1] - me.resizeBox.yRef) / n.timeBox.height);
					box.height = units * n.timeBox.height;
					
					if (e.xy[1] >= me.resizeBox.yRef) n.date = XDate.add(n.date, XDate.MINUTE, me.ddIncrement, true);
					curr = SoDate.copyTime(n.date, me.resizeDt);
					start = data.eventStart;
					end = SoDate.max(curr, XDate.add(data.eventStart, XDate.MINUTE, me.ddIncrement, true));
					
				} else {
					if (!me.resizeDt) {
						me.resizeDt = n.date;
						me.resizeBox = {
							y: box.y,
							yRef: box.y + box.height, // Reference y-coord for computing units
							height: box.height
						};
					}
					
					units = (e.xy[1] >= me.resizeBox.yRef) ? 1 : Math.ceil(Math.abs(e.xy[1] - me.resizeBox.yRef) / n.timeBox.height);
					box.y = me.resizeBox.yRef - (units * n.timeBox.height);
					box.height = units * n.timeBox.height;
					
					if (e.xy[1] <= me.resizeBox.yRef) n.date = XDate.add(n.date, XDate.MINUTE, -me.ddIncrement, true);
					curr = XDate.add(SoDate.copyTime(n.date, me.resizeDt), XDate.MINUTE, me.ddIncrement, true);
					start = SoDate.min(curr, SoDate.add(data.eventEnd, {minutes: -me.ddIncrement}, true));
					end = data.eventEnd;
				}
				
				me.shim(me.resizeDt, box);
				
				data.resizeDates = {
					StartDate: start,
					EndDate: end
				};
				return me.updateProxy(e, data, start, end);
				*/
			}
		}
	},
	
	shim: function(dt, box) {
		var me = this;
		Ext.each(me.shims,
				function(shim) {
					if (shim) {
						shim.isActive = false;
						shim.hide();
					}
				}
		);

		var shim = me.shims[0];
		if (!shim) {
			shim = me.createShim();
			me.shims[0] = shim;
		}

		shim.isActive = true;
		shim.show();
		shim.setBox(box);
		me.DDMInstance.notifyOccluded = true;
	},
	
	onNodeDrop: function(n, dd, e, data) {
		var me = this,
				rec;
		if (n && data) {
			if (data.type === 'eventdrag') {
				rec = me.view.getEventRecordFromEl(data.ddel);
				me.view.onEventDrop(rec, n.date, (e.ctrlKey || e.altKey) ? 'copy' : 'move');
				me.onCalendarDragComplete();
				delete me.dragOffset;
				return true;
			}
			if (data.type === 'eventresize') {
				rec = me.view.getEventRecordFromEl(data.ddel);
				me.view.onEventResize(rec, data.resizeDates);
				me.onCalendarDragComplete();
				delete me.resizeDt;
				delete me.resizeBox;
				return true;
			}
			if (data.type === 'caldrag') {
				Ext.destroy(me.dragStartMarker);
				delete me.dragStartMarker;
				delete me.dragCreateDt;
				this.view.onCalendarEndDrag(me.dragStartDate, me.dragEndDate,
						Ext.bind(me.onCalendarDragComplete, me));
				//shims are NOT cleared here -- they stay visible until the handling
				//code calls the onCalendarDragComplete callback which hides them.
				return true;
			}
		}
		me.onCalendarDragComplete();
		return false;
	}
});