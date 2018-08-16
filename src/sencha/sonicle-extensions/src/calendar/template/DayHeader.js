/**
 * This is the template used to render the all-day event container used in
 * {@link Sonicle.calendar.view.Day DayView} and {@link Sonicle.calendar.view.Week WeekView}. 
 * Internally the majority of the layout logic is deferred to an instance 
 * of {@link Sonicle.calendar.template.BoxLayout}.
 * 
 * This template is automatically bound to the underlying event store by the 
 * calendar components and expects records of type {@link Sonicle.calendar.data.EventModel}.
 * 
 * Note that this template would not normally be used directly. Instead you would 
 * use the {@link Sonicle.calendar.view.DayTemplate} that internally creates 
 * an instance of this template along with a {@link Sonicle.calendar.template.DayBody}.
 */
Ext.define('Sonicle.calendar.template.DayHeader', {
	extend: 'Ext.XTemplate',
	requires: ['Sonicle.calendar.template.BoxLayout'],
	
	constructor: function(config) {
		var me = this;
		Ext.apply(me, config);

		me.allDayTpl = Ext.create('Sonicle.calendar.template.BoxLayout', config);
		me.allDayTpl.compile();
		
		me.callParent([
			'<div class="ext-cal-hd-ct">',
				'<table class="ext-cal-hd-days-tbl" cellspacing="0" cellpadding="0">',
					'<tbody>',
						'<tr>',
							'<td class="ext-cal-gutter"></td>',
							'<td class="ext-cal-hd-days-td"><div class="ext-cal-hd-ad-inner">{allDayTpl}</div></td>',
							'<td class="ext-cal-gutter-rt"></td>',
						'</tr>',
					'</tbody>',
				'</table>',
			'</div>'
		]);
	},
	
	applyTemplate: function(o) {
		return this.applyOut({
			allDayTpl: this.allDayTpl.apply(o)
		}, []).join('');
	},
	
	apply: function(values) {
		return this.applyTemplate.apply(this, arguments);
	}
});
