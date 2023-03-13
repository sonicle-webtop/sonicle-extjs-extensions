/* @private
 * This is an internal helper class.
 */
Ext.define('Sonicle.calendar.util.EventUtils', {
	singleton: true,
	requires: [
		'Sonicle.Date',
		'Sonicle.grid.column.Tag'
	],
	
	dateFmt: function() {
		return 'd/m/Y';
	},

	timeFmt: function(use24HourTime) {
		return (use24HourTime) ? 'G:i' : 'g:ia';
	},

	/**
	 * Round a date to the nearest minimum slot.
	 * @param {Date} dt The date.
	 * @param {Integer} slotTicks The slot size in millis.
	 * @returns {Date} The rounded date.
	 */
	roundDate: function(dt, slotTicks) {
		return new Date(Ext.Number.roundToNearest(dt.getTime(), slotTicks));
	},
	
	/**
	* Get the current (default) timezone offset.
	* @returns {Number} The browser's zone offset.
	*/
	getLocalTimezoneOffset: function() {
		return (new Date()).getTimezoneOffset();
	},

   /**
	* Get the current local date.
	* @returns {Date} The date.
	*/
	getLocalNow: function() {
		return new Date();
	},
	
	/**
	 * Creates a UTC date at the specified time, taking into account
	 * the timezone offset. For example if the timezone offset is +01:00GMT
	 * and the values are 2010-01-05:00:00, then the resulting value would be
	 * 2010-01-04:23:00.
	 * @param {Date} dt The date.
	 * @param {Integer} defaultOffset The base offset in minutes.
	 * @returns {Date} The offset date
	 */
	toUtcOffset: function(dt, defaultOffset) {
		var ExDate = Ext.Date,
				autoOffset = (defaultOffset === undefined),
				udt = ExDate.localToUtc(dt),
				tzOffset = autoOffset ? udt.getTimezoneOffset() : defaultOffset,
				dtOffset;
		
		if (autoOffset) {
			dtOffset = dt.getTimezoneOffset();
			if (dtOffset !== tzOffset) {
				tzOffset += dtOffset - tzOffset;
			}
		}
		return ExDate.add(udt, ExDate.MINUTE, tzOffset);
	},
	
	/**
	 * Get a UTC date as a local date, taking into account the defaultOffset.
	 * For example, if the current date is:
	 * `Thu May 05 2016 10:00:00 GMT+1000` and the timezoneOffset is `-60`, then the value will
	 * be `Thu May 05 2016 01:00:00 GMT+1000`.
	 * @param {Date} dt The date.
	 * @param {Integer} defaultOffset The base offset in minutes.
	 * @returns {Date} The offset
	 */
	utcToLocal: function(dt, defaultOffset) {
		var ExDate = Ext.Date,
				autoOffset = (defaultOffset === undefined),
				localOffset = dt.getTimezoneOffset(),
				ret;
		
		if (autoOffset) {
			ret = ExDate.clone(dt);
		} else {
			// This needs modified version of Ext.Date that uses the preventDstAdjust parameter
			ret = ExDate.add(dt, ExDate.MINUTE, (defaultOffset - localOffset) * -1, true);
		}
		return ret;
	},
	
	utcTimezoneOffset: function(dt, defaultOffset) {
		var ExDate = Ext.Date,
				autoOffset = (defaultOffset === undefined),
				tzOffset = autoOffset ? dt.getTimezoneOffset() : defaultOffset;
		return ExDate.subtract(dt, ExDate.MINUTE, tzOffset);
	},
	
	isMovable: function(rec) {
		var EM = Sonicle.calendar.data.EventMappings,
				data = (rec.data) ? rec.data : rec,
				isRR = (data[EM.IsRecurring.name] === true),
				//isRBro = (data[EM.IsBroken.name] === true),
				isRO = (data[EM.IsReadOnly.name] === true);

		if(isRR || isRO) return false;
		return true;
	},

	isSpanning: function(start, end) {
		var SoDate = Sonicle.Date,
				diff = SoDate.diffDays(start, end);
		//if((diff <= 1) && soDate.isMidnight(end)) return false;
		return (diff > 0);
	},

	isLikeSingleDay: function(start, end) {
		var SoDate = Sonicle.Date;
		return (SoDate.isMidnight(start) && SoDate.isMidnight(end) && (SoDate.diffDays(start, end) === 1));
	},

	durationInHours: function(start, end) {
		var SoDate = Sonicle.Date;
		return SoDate.diff(start, end, 'hours', true);
	},

	/**
	* Builds strings useful for displaying an event.
	* @param {Object} edata Event data.
	* @param {String} timeFmt Desired time format string.
	* @return {Object} An object containing title and tooltip properties.
	*/
	buildDisplayInfo: function(edata, tdata, dateFmt, timeFmt) {
		var EM = Sonicle.calendar.data.EventMappings,
				XDate = Ext.Date,
				SoDate = Sonicle.Date,
				calName = edata[EM.CalendarName.name],
				evTit = edata[EM.Title.name],
				evDesc = edata[EM.Description.name],
				evLoc = edata[EM.Location.name],
				evOwn = edata[EM.Owner.name],
				evOrg = edata[EM.Org.name],
				evStaDt = edata[EM.StartDate.name],
				evEndDt = edata[EM.EndDate.name],
				evIsAD = edata[EM.IsAllDay.name] === true,
				sdate = XDate.format(evStaDt, dateFmt),
				stime = XDate.format(edata[EM.StartDate.name], timeFmt),
				edate = XDate.format(evEndDt, dateFmt),
				etime = XDate.format(edata[EM.EndDate.name], timeFmt),
				tit = Ext.isEmpty(evLoc) ? evTit : Ext.String.format('{0} @{1}', evTit, evLoc),
				iconDate = 'far fa-clock',
				iconOrganizer = 'fas fa-user-clock',
				iconCalendar = 'far fa-calendar',
				tip, thtml;

		if (SoDate.diffDays(evStaDt, evEndDt) === 0) {
			tip = '<span class="ext-evt-tooltip-descriptor"><i class="' + iconDate + '"></i></span>' + sdate + (evIsAD ? '' : ' ' + stime + ' - ' + etime);
			//tip = startd + ' ' + startt + ' - ' + endt;
		} else {
			tip = '<span class="ext-evt-tooltip-descriptor"><i class="' + iconDate + '"></i></span>' + sdate + (evIsAD ? '' : ' ' + stime) + 
					'<br><span class="ext-evt-tooltip-descriptor"><i class="' + iconDate + '"></i></span>' + edate + (evIsAD ? '' : ' ' + etime);
			//tip = startd + ' ' + startt + '<br>' + endd + ' ' + endt;
		}
		if (!Ext.isEmpty(evOrg)) tip += '<br><span class="ext-evt-tooltip-descriptor"><i class="' + iconOrganizer + '"></i></span>' + evOrg;
		tip += '<br><span class="ext-evt-tooltip-descriptor"><i class="' + iconCalendar + '"></i></span>' + calName;
		if (!Ext.isEmpty(evOwn)) tip += ' (' + evOwn + ')';
		
		if (!Ext.isEmpty(evDesc)) tip += '<br><br>' + evDesc;
		
		thtml = Sonicle.form.field.Tag.generateTagsMarkup(tdata);
		if (!Ext.isEmpty(thtml)) tip += '<br><br>' + thtml;

		return {
			title: tit,
			tooltip: Ext.String.htmlEncode(tip)
		};
	}
});
