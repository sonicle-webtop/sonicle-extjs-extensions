/**
 * This is the template used to render calendar views based on small day boxes 
 * within a non-scrolling container (currently the {@link Sonicle.calendar.view.Month MonthView} 
 * and the all-day headers for {@link Sonicle.calendar.view.Day DayView} 
 * and {@link Sonicle.calendar.view.Week WeekView}. This template is 
 * automatically bound to the underlying event store by the calendar components 
 * and expects records of type {@link Sonicle.calendar.data.EventModel}.
 */
Ext.define('Sonicle.calendar.template.BoxLayout', {
	extend: 'Ext.XTemplate',
	requires: [
		'Sonicle.Date',
		'Sonicle.calendar.util.EventUtils'
	],
	
	firstWeekDateFormat: 'D j',
	
	otherWeeksDateFormat: 'j',
	
	singleDayDateFormat: 'l, F j, Y',
	
	multiDayFirstDayFormat: 'M j, Y',
	
	multiDayMonthStartFormat: 'M j',
	
	constructor: function (config) {
		var me = this;
		Ext.apply(me, config);
		
		var weekLinkTpl = me.showWeekLinks ? '<div id="{weekLinkId}" class="ext-cal-week-link">{weekNum}</div>' : '';
		me.callParent([
			'<tpl for="weeks">',
			'<div id="{[this.id]}-wk-{[xindex-1]}" class="ext-cal-wk-ct" style="top:{[this.getRowTop(xindex, xcount)]}%; height:{[this.getRowHeight(xcount)]}%;">',
				weekLinkTpl,
				'<table class="ext-cal-bg-tbl" cellpadding="0" cellspacing="0">',
				'<tbody>',
					'<tr>',
					'<tpl for=".">',
						'<td id="{[this.id]}-day-{date:date("Ymd")}" class="{cellCls}">&#160;</td>',
					'</tpl>',
					'</tr>',
				'</tbody>',
				'</table>',
				'<table class="ext-cal-evt-tbl" cellpadding="0" cellspacing="0">',
				'<tbody>',
					'<tr>',
					'<tpl for=".">',
						'<td id="{[this.id]}-ev-day-{date:date("Ymd")}" class="{titleCls}"><div>{title}</div></td>',
					'</tpl>',
					'</tr>',
				'</tbody>',
				'</table>',
			'</div>',
			'</tpl>', {
				getRowTop: function (i, ln) {
					return ((i-1)*(100/ln));
				},
				getRowHeight: function (ln) {
					return 100/ln;
				}
			}
		]);
	},
	
	applyTemplate: function(o) {
		Ext.apply(this, o);
		
		var me = this,
				XDate = Ext.Date,
				SoDate = Sonicle.Date,
				first = true,
				isToday = false,
				showMonth = false,
				prevMonth = false,
				nextMonth = false,
				isWeekend = false,
				weekendCls = o.weekendCls,
				prevMonthCls = o.prevMonthCls,
				nextMonthCls = o.nextMonthCls,
				todayCls = o.todayCls,
				dt = SoDate.add(XDate.clearTime(me.viewStart, true), {hours: 12}),
				thisMonth = me.startDate.getMonth(),
				weeks = [[]],
				title = '';

		for (var w=0; w < me.weekCount || me.weekCount === -1; w++) {
			if (dt > me.viewEnd) {
				break;
			}
			weeks[w] = [];

			for (var d=0; d < me.dayCount; d++) {
				isToday = SoDate.isToday(dt);
				showMonth = first || (dt.getDate() === 1);
				prevMonth = (dt.getMonth() < thisMonth) && me.weekCount === -1;
				nextMonth = (dt.getMonth() > thisMonth) && me.weekCount === -1;
				isWeekend = SoDate.isWeekend(dt);

				if (dt.getDay() === 1) {
					// The ISO week format 'W' is relative to a Monday week start. If we
					// make this check on Sunday the week number will be off.
					weeks[w].weekNum = me.showWeekNumbers ? XDate.format(dt, 'W') : '&#160;';
					weeks[w].weekLinkId = 'ext-cal-week-' + XDate.format(dt, 'Ymd');
				}

				if (showMonth) {
					if (isToday) {
						title = me.getTodayText();
					} else {
						title = XDate.format(dt, me.dayCount === 1 ? 'l, F j, Y' : (first ? 'D, M j, Y' : 'M j'));
					}
				} else {
					var dayFmt = (w === 0 && me.showHeader !== true) ? 'D j' : 'j';
					title = isToday ? me.getTodayText() : XDate.format(dt, dayFmt);
				}

				weeks[w].push({
					title: title,
					date: Ext.Date.clone(dt),
					titleCls: 'ext-cal-dtitle ' + (isToday ? ' ext-cal-dtitle-today' : '') +
							(w === 0 ? ' ext-cal-dtitle-first' : '') +
							(prevMonth ? ' ext-cal-dtitle-prev' : '') +
							(nextMonth ? ' ext-cal-dtitle-next' : ''),
					cellCls: 'ext-cal-day ' + (isToday ? ' ' + todayCls : '') +
							(d === 0 ? ' ext-cal-day-first' : '') +
							(prevMonth ? ' ' + prevMonthCls : '') +
							(nextMonth ? ' ' + nextMonthCls : '') +
							(isWeekend && weekendCls ? ' ' + weekendCls : '')
				});
				dt = SoDate.add(dt, {days: 1});
				first = false;
			}
		}

		return me.applyOut({
			weeks: weeks
		}, []).join('');
	},
	
	getTodayText: function() {
		var me = this,
				XDate = Ext.Date,
				dt = XDate.format(new Date(), 'l, F j, Y'),
				timeFmt = Sonicle.calendar.util.EventUtils.timeFmt(me.use24HourTime)+' ',
				todayText = me.showTodayText !== false ? me.todayText : '',
				timeText = me.showTime !== false ? (' <span id="' + me.id + '-clock" class="ext-cal-dtitle-time">' + XDate.format(new Date(), timeFmt) + '</span>') : '',
				separator = todayText.length > 0 || timeText.length > 0 ? ' &mdash; ' : '',
				fmt;

		if (me.dayCount === 1) {
			return dt + separator + todayText + timeText;
		} else {
			fmt = me.weekCount === 1 ? 'D j' : 'j';
			return todayText.length > 0 ? todayText + timeText : XDate.format(new Date(), fmt) + timeText;
		}
	}
},

function () {
	this.createAlias('apply', 'applyTemplate');
});
