/**
 * This is the header area container within the day and week views where 
 * all-day events are displayed. Normally you should not need to use this class 
 * directly -- instead you should use {@link Sonicle.calendar.view.Day DayView} 
 * which aggregates this class and the {@link Sonicle.calendar.view.DayBody DayBodyView} 
 * into the single unified view presented by {@link Sonicle.calendar.Panel CalendarPanel}
 */
Ext.define('Sonicle.calendar.view.DayHeader', {
	extend: 'Sonicle.calendar.view.Month',
	alias: 'widget.dayheaderview',
	requires: [
		'Sonicle.calendar.template.DayHeader'
	],
	
	weekCount: 1,
	dayCount: 1,
	allDayOnly: true,
	monitorResize: false,
	isHeaderView: true,
	
	/**
	 * @event dayclick
	 * Fires after the user clicks within the day view container and not on an event element
	 * @param {Sonicle.calendar.DayBodyView} this
	 * @param {Date} dt The date/time that was clicked on
	 * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
	 * DayHeaderView always return true for this param.
	 * @param {Ext.core.Element} el The Element that was clicked on
	 * @param {Ext.event.Event} evt The raw event object.
	 */
	
	/**
	 * @event daydblclick
	 * Fires after the user clicks within the day view container and not on an event element
	 * @param {Sonicle.calendar.DayBodyView} this
	 * @param {Date} dt The date/time that was clicked on
	 * @param {Boolean} allday True if the day clicked on represents an all-day box, else false. Clicks within the 
	 * DayHeaderView always return true for this param.
	 * @param {Ext.core.Element} el The Element that was clicked on
	 * @param {Ext.event.Event} evt The raw event object.
	 */
	
	afterRender: function() {
		var me = this;
		if (!me.tpl) {
			me.tpl = Ext.create('Sonicle.calendar.template.DayHeader', {
				id: me.id,
				showTodayText: me.showTodayText,
				todayText: me.todayText,
				showTime: me.showTime
			});
		}
		me.tpl.compile();
		me.addCls('ext-cal-day-header');

		me.callParent(arguments);
	},
	
	forceSize: Ext.emptyFn,
	
	refresh: function(reloadData) {
		this.callParent(arguments);
		this.recalcHeaderBox();
	},
	
	recalcHeaderBox: function () {
		var me = this, tbl = me.el.down('.ext-cal-evt-tbl'),
				h = tbl.getHeight();
		//h = Math.max(tbl.getHeight(), 80);
		tbl.setHeight(h);
		me.el.setHeight(h + 7);

		// These should be auto-height, but since that does not work reliably
		// across browser / doc type, we have to size them manually
		me.el.down('.ext-cal-hd-ad-inner').setHeight(h + 5);
		me.el.down('.ext-cal-bg-tbl').setHeight(h + 5);
	},
	
	moveNext: function() {
		return this.moveDays(this.dayCount, false);
	},
	
	movePrev: function() {
		return this.moveDays(-this.dayCount, false);
	},
	
	onClick: function(e, t) {
		var me = this,
				el = e.getTarget('td', 3),
				parts,
				dt;
		if (el) {
			if (el.id && el.id.indexOf(me.dayElIdDelimiter) > -1) {
				parts = el.id.split(me.dayElIdDelimiter);
				dt = parts[parts.length - 1];
				// We handle click/dblclick in same way...
				me.fireEvent('day' + e.type, me, Ext.Date.parseDate(dt, 'Ymd'), true, Ext.get(me.getDayId(dt)), e);
				return;
			}
		}
		me.callParent(arguments);
	},
	
	/**
	 * @protected
	 */
	isActiveView: function () {
		var pnl = this.ownerCalendarPanel;
		return (pnl && pnl.getActiveView().isDayView);
	}
});
