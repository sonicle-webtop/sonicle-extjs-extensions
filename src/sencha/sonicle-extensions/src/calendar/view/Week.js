/**
 * Displays a calendar view by week. This class does not usually need to be 
 * used directly as you can use a {@link Sonicle.calendar.Panel CalendarPanel} to manage 
 * multiple calendar views at once including the week view.
 */
Ext.define('Sonicle.calendar.view.Week', {
    extend: 'Sonicle.calendar.view.Day',
	alias: 'widget.weekview',
	
	constructor: function(cfg) {
		cfg.dayCount = 7;
		this.callParent([cfg]);
	}
});
