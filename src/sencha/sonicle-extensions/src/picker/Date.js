/*
 * ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.picker.Date', {
	extend: 'Ext.picker.Date',
	alias: 'widget.sodatepicker',
	requires: [
		'Sonicle.Date'
	],
	
	config: {
		/**
		 * @cfg {Boolean} highlightPrevDays
		 * Set to `true` to highlight (according to desired mode) date cells 
		 * belonging to the previous month.
		 */
		highlightPrevDays: false,
		
		/**
		 * @cfg {Boolean} highlightNextDays
		 * Set to `true` to highlight (according to desired mode) date cells 
		 * belonging to the next month.
		 */
		highlightNextDays: false,
		
		/**
		 * @cfg {Boolean} hidePrevDays
		 * Set to `true` to hide date cells belonging to the previous month.
		 */
		hidePrevDays: false,
		
		/**
		 * @cfg {Boolean} hideNextDays
		 * Set to `true` to hide date cells belonging to the next month.
		 */
		hideNextDays: false,
		
		/**
		 * @cfg {Boolean} showDayInfo
		 * Set to `false` to not show info (week no.) tooltip on a day date.
		 */
		showDayInfo: true
	},
	
	/*
	 * @cfg {String} format
	 * String used for formatting date.
	 */
	format: 'Y-m-d',
	
	/*
	 * @cfg {Boolean} showMonthpicker
	 * Set to `false` to prevent the month picker being displayed.
	 */
	showMonthpicker: true,
	
	/*
	 * @cfg {String} dayText
	 * The text to display in the day info tooltip
	 */
	dayText: 'Day',
	
	/*
	 * @cfg {String} weekText
	 * The text to display in the day info tooltip
	 */
	weekText: 'Week',
	
	/**
	 * @cfg {RegExp} [fullDatesRE=null]
	 * JavaScript regular expression used to treat as full-day a pattern of dates.
	 * The {@link #fullDates} config will generate this regex internally, but if 
	 * you specify fullDatesRE it will take precedence over the fullDates value.
	 */
	fullDatesRE: null,
	
	/**
	 * @cfg {String[]} fullDates
	 * An array of 'dates' (in string format) to treat as full-day. These strings 
	 * will be used to build a dynamic regular expression so they are very powerful. Some examples:
	 *
	 *   - ['03/08/2003', '09/16/2003'] would bold those exact dates
	 *   - ['03/08', '09/16'] would bold those days for every year
	 *   - ['^03/08'] would only match the beginning (useful if you are using short years)
	 *   - ['03/../2006'] would bold every day in March 2006
	 *   - ['^03'] would bold every day in every March
	 *
	 * Note that the format of the dates included in the array should exactly match the {@link #format} config. In order
	 * to support regular expressions, if you are using a date format that has '.' in it, you will have to escape the
	 * dot when restricting dates. For example: ['03\\.08\\.03'].
	 */
	fullDates: null,
	
	highlightCls: 'so-'+'datepicker-highlighted',
	fullDateCls: 'so-'+'datepicker-fulldate',
	
	/**
	 * @property {Date} highlightDate
	 */
	highlightDate: null,
	
	constructor: function(cfg) {
		var me = this;
		if (Ext.isDate(cfg.highlightDate)) me.setHighlightDate(cfg.highlightDate);
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.initFullDates();
	},
	
	initDDDropZone: function() {
		// Override me to support drop-zone!
	},
	
	getHighlightMode: function() {
		return this.highlightMode;
	},
	
	setHighlightMode: function(value) {
		var me = this;
		me.highlightMode = value;
		me.update(me.activeDate);
	},
	
	getHighlightDate: function() {
		return this.highlightDate;
	},
	
	setHighlightDate: function(date, update) {
		var me = this;
		if (Ext.isDate(date)) me.highlightDate = Ext.Date.clearTime(date, true);
		if (update) me.update(me.value);
	},
	
	setFullDates: function(dates, update) {
		var me = this;
		if (Ext.isArray(dates)) {
			me.fullDates = dates;
			me.fullDatesRE = null;
		} else {
			me.fullDatesRE = dates;
		}
		me.initFullDates();
		if (update) me.update(me.value);
		return me;
	},
	
	showPrevMonth: function(e) {
		var me = this;
		me.callParent(arguments);
		me.fireEvent('select', me, me.value);
	},
	
	showNextMonth: function(e) {
		var me = this;
		me.callParent(arguments);
		me.fireEvent('select', me, me.value);
	},
	
	showPrevYear: function() {
		var me = this;
		me.callParent(arguments);
		me.fireEvent('select', me, me.value);
	},
	
	showNextYear: function() {
		var me = this;
		me.callParent(arguments);
		me.fireEvent('select', me, me.value);
	},
	
	/**
	 * Override original {@link Ext.picker.Date#selectedUpdate}
	 */
	selectedUpdate: function(date) {
		var me = this;
		me.callParent(arguments);
		me.updateStyles();
	},
	
	/**
	 * Override original {@link Ext.picker.Date#fullUpdate}
	 */
	fullUpdate: function(date) {
		var me = this;
		me.callParent(arguments);
		me.updateStyles();
	},
	
	/**
	 * Override original {@link Ext.picker.Date#handleDateClick}
	 */
	handleDateClick: function(e, t) {
		var me = this, day;
		if (t.dateValue && me.highlightMode === 'w5') {
			// Avoids click on saturday and sunday
			day = new Date(t.dateValue).getDay();
			if ((day === 0) || (day === 6)) return;
		}
		me.callParent(arguments);
	},
	
	onRender: function(container, position) {
		var me = this;
		me.callParent(arguments);
		me.initDDDropZone();
		
		// Override original behaviour in order to make some tunings:
		// we need to completely disable monthpicker making also its
		// button un-useful
		if (!me.showMonthpicker) {
			me.prevEl.setVisible(false);
			me.nextEl.setVisible(false);
			me.monthBtn.setTooltip(null);
			me.monthBtn._disabledCls = '';
			me.monthBtn.setDisabled(true);
			me.monthBtn.setStyle('cursor', 'auto');
			Ext.defer(me.monthBtn._removeSplitCls, 100, me.monthBtn);
		}
	},
	
	/*
	doShowMonthPicker: function() {
		// Override original behaviour in order to prevent monthpicker display
		if(this.showMonthpicker) this.callParent(arguments);
	},
	*/
	
	onOkClick: function(picker, value) {
		var me = this;
		me.callParent(arguments);
		// Override original behaviour in order to fire select event
		// after choosing new month 
		me.fireEvent('select', me, me.value);
	},
	
	privates: {
		initFullDates: function() {
			var me = this,
				bd = me.fullDates,
				fmt = me.format,
				re = '(?:',
				len,
				b, bLen, bI;

			me.fullDatesRE = null;
			if (bd && (bd.length > 0)) {
				len = bd.length - 1;
				bLen = bd.length;

				for (b = 0; b < bLen; b++) {
					bI = bd[b];
					re += Ext.isDate(bI) ? '^' + Ext.String.escapeRegex(Ext.Date.dateFormat(bI, fmt)) + '$' : bI;
					if (b !== len) re += '|';
				}
				me.fullDatesRE = new RegExp(re + ')');
			}
		},
		
		updateStyles: function() {
			var me = this,
				XD = Ext.Date,
				XA = Ext.Array,
				SoD = Sonicle.Date,
				hdate = me.highlightDate,
				highlightCls = me.highlightCls,
				fullCls = me.fullDateCls,
				selCls = me.selectedCls, 
				cells = me.cells,
				fmt = me.format,
				fdMatch = me.fullDatesRE, 
				mode = me.highlightMode,
				sday = me.startDay, 
				t1 = XD.getFirstDateOfMonth(me.getValue()).getTime(), 
				t31 = XD.getLastDateOfMonth(me.getValue()).getTime(), 
				len = cells.getCount(),
				multirowHighlight = false,
				cell, full, dv, d, tfrom, tto, formatValue;

			// Defines highlighting bounds
			if (mode === 'd') {
				tfrom = hdate.getTime();
				tto = hdate.getTime();
			} else if (mode === 'w5') {
				var foffs = [1,0];
				d = SoD.add(SoD.getFirstDateOfWeek(hdate, sday), {days: foffs[sday]});
				tfrom = d.getTime();
				tto = SoD.add(d, {days: (5-1)}).getTime();
			} else if ((mode === 'w')) {
				d = SoD.getFirstDateOfWeek(hdate, sday);
				tfrom = d.getTime();
				tto = SoD.add(d, {days: (7-1)}).getTime();
			} else if(mode === 'dw') {
				multirowHighlight = true;
				d = SoD.getFirstDateOfWeek(hdate, sday);
				tfrom = d.getTime();
				tto = SoD.add(d, {days: (14-1)}).getTime();
			} else if (mode === 'm') {
				multirowHighlight = true;
				tfrom = XD.getFirstDateOfMonth(hdate).getTime();
				tto = XD.getLastDateOfMonth(hdate).getTime();
			}
			if ((tfrom < t1) && !me.highlightPrevDays) tfrom = t1;
			if ((tto > t31) && !me.highlightNextDays) tto = t31;

			// Loop through cells
			for (var c = 0; c < len; c++) {
				cell = cells.item(c);
				dv = me.textNodes[c].dateValue;
				d = new Date(dv);

				// Highlight days in current view...
				if (!Ext.isEmpty(highlightCls)) {
					var toAdd = [], toRem = [];
					if ((dv >= tfrom) && (dv <= tto)) {
						toAdd.push(highlightCls);
						XA.push((dv === tfrom) ? toAdd : toRem, highlightCls + '-begin');
						XA.push((dv === tto) ? toAdd : toRem, highlightCls + '-end');
						XA.push(multirowHighlight ? toAdd : toRem, highlightCls + '-row');
					} else {
						XA.push(toRem, [highlightCls, highlightCls + '-begin', highlightCls + '-end', highlightCls + '-row']);
					}
					if (!Ext.isEmpty(toRem)) cell.removeCls(toRem);
					if (!Ext.isEmpty(toAdd)) cell.addCls(toAdd);
				}

				// Removes selection on the first day if it differs from highlight date
				if ((d.getDate() === 1) && (!XD.isEqual(d, hdate))) {
					if (cell.hasCls(selCls)) cell.removeCls(selCls);
				}

				// Mark full dates
				full = false;
				if (fdMatch && fmt) {
					formatValue = XD.dateFormat(d, fmt);
					full = fdMatch.test(formatValue);
				}
				if (!Ext.isEmpty(fullCls)) {
					if (full) {
						cell.addCls(fullCls);
					} else {
						cell.removeCls(fullCls);
					}
				}

				// Hide cells...
				if ((me.hidePrevDays && (dv < t1)) || (me.hideNextDays && (dv > t31))) {
					cell.setStyle('visibility', 'hidden');
				} else {
					cell.setStyle('visibility', '');
				}
				if (me.showDayInfo) cell.dom.setAttribute('data-qtip', me.formatDayTip(d));
			}
		},
		
		formatDayTip: function(date) {
			return Ext.String.format('{0}:&nbsp;{1}&nbsp;-&nbsp;{2}:&nbsp;{3}', this.dayText, Ext.Date.getDayOfYear(date)+1, this.weekText, Ext.Date.getWeekOfYear(date));
		}
	}
});
