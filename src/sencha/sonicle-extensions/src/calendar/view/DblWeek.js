/**
 * Displays a calendar view by 2-week. This class does not usually need to be 
 * used directly as you can use a {@link Sonicle.calendar.Panel CalendarPanel} to manage 
 * multiple calendar views at once including the 2-week view.
 */
Ext.define('Sonicle.calendar.view.DblWeek', {
    extend: 'Sonicle.calendar.view.Month',
	alias: 'widget.dblweekview',
	
	constructor: function(cfg) {
		cfg.weekCount = 2;
		this.callParent([cfg]);
	},
	
	moveNext: function() {
		return this.moveWeeks(this.weekCount, true);
	},
	
	movePrev: function() {
		return this.moveWeeks(-this.weekCount, true);
	}
});
