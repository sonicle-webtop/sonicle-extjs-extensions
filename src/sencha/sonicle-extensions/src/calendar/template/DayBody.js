/**
 * This is the template used to render the scrolling body container used in
 * {@link Sonicle.calendar.view.Day DayView} and {@link Sonicle.calendar.view.Week WeekView}. 
 * This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Sonicle.calendar.data.EventModel}.
 * 
 * Note that this template would not normally be used directly. Instead you would 
 * use the {@link Sonicle.calendar.view.DayTemplate} that internally creates 
 * an instance of this template along with a {@link Sonicle.calendar.DayHeaderTemplate}.
 */
Ext.define('Sonicle.calendar.template.DayBody', {
	extend: 'Ext.XTemplate',
	requires: [
		'Sonicle.Date'
	],
	
	$dayColumnElIdDelimiter: '-day-col-',
	
	constructor: function (cfg) {
		Ext.apply(this, cfg);

		this.callParent([
			'<table class="ext-cal-bg-tbl" cellspacing="0" cellpadding="0">',
				'<tbody>',
					'<tr height="1">',
						'<td class="ext-cal-gutter"></td>',
						'<td colspan="{dayCount}">',
							'<div class="ext-cal-bg-rows">',
								'<div class="ext-cal-bg-rows-inner">',
								'<tpl for="times">',
									'<div class="ext-cal-bg-row ext-row-{[xindex]} {[this.getRowBgCls(xindex, parent.bustimes)]}" style="height:{parent.hourHeight}px;">',
										'<div class="ext-cal-bg-row-div {parent.hourSeparatorCls}" style="height:{parent.hourSeparatorHeight}px;"></div>',
									'</div>',
								'</tpl>',
								'</div>',
							'</div>',
						'</td>',
					'</tr>',
					'<tr>',
						'<td class="ext-cal-day-times">',
						'<tpl for="times">',
							'<div class="ext-cal-bg-row" style="height:{parent.hourHeight}px;">',
								//'<div class="ext-cal-day-time-inner" style="height:{parent.hourHeight}px;">{.}</div>',
								'<div class="ext-cal-day-time-inner" style="height:{parent.hourHeight}px;">',
									'<span class="ext-cal-day-time-hours">',
										'{[Ext.Date.format(values, parent.hFmt)]}',
									'</span>',
									'{[Ext.Date.format(values, parent.mFmt)]}',
								'</div>',
							'</div>',
						'</tpl>',
						'</td>',
						'<tpl for="days">',
						'<td class="ext-cal-day-col">',
							'<div class="ext-cal-day-col-inner">',
								'<div id="{[this.id]}-day-col-{.:date("Ymd")}" class="ext-cal-day-col-gutter" style="height:{parent.dayHeight}px;"></div>',
							'</div>',
						'</td>',
						'</tpl>',
					'</tr>',
				'</tbody>',
			'</table>', {
				getRowBgCls: function(i, bustimes) {
					return (this.highlightBusinessHours && bustimes[i-1]) ? 'ext-cal-bg-row-business' : 'ext-cal-bg-row-normal';
				},
				formatH: function(values, fmt) {
					return Ext.Date.format(values, (this.use24HourTime) ? 'G' : 'g');
				},
				formatM: function(values, fmt) {
					return Ext.Date.format(values, (this.use24HourTime) ? 'i' : 'a');
				}
			}
		]);
	},
	
	// private
	applyTemplate: function(o) {
		var me = this,
				XDate = Ext.Date,
				SoDate = Sonicle.Date,
				start = me.viewStartHour,
				end = me.viewEndHour,
				mins = me.hourIncrement,
				dayHeight = me.hourHeight * (end - start),
				dt = SoDate.add(XDate.clearTime(o.viewStart, true), {hours: 12}),
				days = [],
				times = [],
				bustimes = [],
				i = 0;
		
		me.today = SoDate.today();
		me.dayCount = me.dayCount || 1;
		
		for (; i < me.dayCount; i++) {
			days[i] = SoDate.add(dt, {days: i});
		}

		// use a fixed DST-safe date so times don't get skipped on DST boundaries
		dt = SoDate.add(new Date('5/26/1972'), {hours: start});

		for (i=start; i<end; i++) {
			times.push(dt);
			bustimes.push((i >= me.businessHoursStart) && (i < me.businessHoursEnd));
			dt = SoDate.add(dt, {minutes: mins});
		}

		return me.applyOut({
			days: days,
			dayCount: days.length,
			times: times,
			bustimes: bustimes,
			hFmt: (me.use24HourTime) ? 'G' : 'g',
			mFmt: (me.use24HourTime) ? 'i' : 'a',
			hourHeight: me.hourHeight,
			hourSeparatorCls: me.showHourSeparator ? '' : 'no-sep', // the class suppresses the default separator
			dayHeight: dayHeight,
			hourSeparatorHeight: (me.hourHeight / 2)
		}, []).join('');
	},
	
	apply: function(values) {
		return this.applyTemplate.apply(this, arguments);
	},
	
	dayColumnId: function(date) {
		var me = this;
		return me.id + me.$dayColumnElIdDelimiter + Ext.Date.format(date, 'Ymd');
	}
});
