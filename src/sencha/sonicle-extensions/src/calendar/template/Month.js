/**
 * This is the template used to render the {@link Sonicle.calendar.view.Month MonthView}. 
 * Internally this class defers to an instance of {@link Sonicle.calendar.template.BoxLayout} 
 * to handle the inner layout rendering and adds containing elements around
 * that to form the month view.
 * 
 * This template is automatically bound to the underlying event store by the
 * calendar components and expects records of type {@link Sonicle.calendar.data.EventModel}.
 */
Ext.define('Sonicle.calendar.template.Month', {
	extend: 'Ext.XTemplate',
	requires: ['Sonicle.calendar.template.BoxLayout'],
	
	/**
	 * @cfg {String} dayHeaderFormat
	 * The date format to use for day headers, if used (defaults to 'D', e.g. 'Mon' for Monday)
	 */
	dayHeaderFormat: 'D',
	
	/**
	 * @cfg {String} dayHeaderTitleFormat
	 * The date format to use for the day header's HTML title attribute displayed on mouseover
	 * (defaults to 'l, F j, Y', e.g. 'Monday, December 27, 2010')
	 */
	dayHeaderTitleFormat: 'l, F j, Y',
	
	constructor: function(config) {
		var me = this;
		Ext.apply(me, config);

		me.weekTpl = Ext.create('Sonicle.calendar.template.BoxLayout', config);
		me.weekTpl.compile();

		var weekLinkTpl = me.showWeekLinks ? '<div class="ext-cal-week-link-hd">&#160;</div>' : '';
		me.callParent([
			'<div class="ext-cal-inner-ct {extraClasses}">',
				'<div class="ext-cal-hd-ct ext-cal-month-hd">',
					weekLinkTpl,
					'<table class="ext-cal-hd-days-tbl" cellpadding="0" cellspacing="0">',
					'<tbody>',
						'<tr>',
							'<tpl for="days">',
								'<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{title}">{name}</th>',
								//'<th class="ext-cal-hd-day{[xindex==1 ? " ext-cal-day-first" : ""]}" title="{.:date("l, F j, Y")}">{.:date("D")}</th>',
							'</tpl>',
						'</tr>',
					'</tbody>',
					'</table>',
				'</div>',
				'<div class="ext-cal-body-ct">{weeks}</div>',
			'</div>'
		]);
	},
	
	// private
	applyTemplate: function(o) {
		var me = this,
				XDate = Ext.Date,
				SoDate = Sonicle.Date,
				weeks = me.weekTpl.apply(o),
				dt = SoDate.add(XDate.clearTime(o.viewStart, true), {hours: 12}),
				days = [];

		for (var i = 0; i < 7; i++) {
			days.push({
				name: XDate.format(dt, me.dayHeaderFormat),
				title: XDate.format(dt, me.dayHeaderTitleFormat)
			});
			dt = SoDate.add(dt, {days: 1});
		}

		var extraClasses = me.showHeader === true ? '' : 'ext-cal-noheader';
		if (me.showWeekLinks) {
			extraClasses += ' ext-cal-week-links';
		}

		return me.applyOut({
			days: days,
			weeks: weeks,
			extraClasses: extraClasses
		}, []).join('');
	},
	
	apply: function(values) {
		return this.applyTemplate.apply(this, arguments);
	}
});
