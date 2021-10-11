/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.Date', {
	singleton: true,
	
	fmtCache: {},
	javaFmtMapping: {
		d: 'j',
		dd: 'd',
		y: 'Y',
		yy: 'y',
		yyy: 'Y',
		yyyy: 'Y',
		a: 'A',
		M: 'n',
		MM: 'm',
		MMM: 'M',
		MMMM: 'F',
		h: 'g',
		hh: 'h',
		H: 'G',
		HH: 'H',
		m: 'i',
		mm: 'i',
		s: 's',
		ss: 's',
		S: 'u',
		SS: 'u',
		SSS: 'u',
		E: 'D',
		EEE: 'D',
		EEEE: 'l',
		D: 'z',
		w: 'W',
		ww: 'W',
		z: 'T',
		zzzz: 'T',
		Z: 'O',
		X: 'O',
		XX: 'O',
		XXX: 'P',
		u: 'w'
	},
	
	extFmtMapping: {
		j: 'd',
		d: 'dd',
		y: 'yy',
		Y: 'yyyy',
		a: 'A',
		A: 'A',
		n: 'M',
		m: 'MM',
		M: 'MMM',
		F: 'MMMM',
		g: 'h',
		h: 'hh',
		G: 'H',
		H: 'HH',
		i: 'mm',
		s: 'ss',
		u: 'SSS',
		D: 'EEE',
		l: 'EEEE',
		z: 'D',
		W: 'ww',
		T: 'zzz',
		O: 'Z',
		P: 'XXX',
		w: 'u'
	},
	
	/**
	 * Translates the Java date format string to a ExtJs format string.
	 * @param {String} javaFmt The Java format String to be translated.
	 * @returns {String} Equivalent ExtJs format string
	 */
	toExtFormat: function(javaFmt) {
		var me = this, key = 'ext';
		if(!me.fmtCache[key]) me.fmtCache[key] = {};
		if(!me.fmtCache[key][javaFmt]) {
			me.fmtCache[key][javaFmt] = me.translateFormat(javaFmt, me.javaFmtMapping);
		}
		return me.fmtCache[key][javaFmt];
	},
	
	/**
	 * Translates the ExtJs date format string to a Java format string.
	 * @param {String} extFmt The format String to be translated.
	 * @returns {String} Equivalent Java format string
	 */
	toJavaFormat: function(extFmt) {
		var me = this, key = 'java';
		if(!me.fmtCache[key]) me.fmtCache[key] = {};
		if(!me.fmtCache[key][extFmt]) {
			me.fmtCache[key][extFmt] = me.translateFormat(extFmt, me.extFmtMapping);
		}
		return me.fmtCache[key][extFmt];
	},
	
	/**
	 * Translates the java date format String to a ExtJs format String.
	 * @param {String} format The unmodified format string.
	 * @param {Object} mapping The date format mapping object.
	 * @returns {String}
	 */
	translateFormat: function(format, mapping) {
		var me = this,
				len = format.length,
				i = 0,
				beginIndex = -1,
				lastCh = null,
				curCh = '',
				result = '';
		
		for(; i < len; i++) {
			curCh = format.charAt(i);
			if(lastCh === null || lastCh !== curCh) { // change detected
				result = me._appendMappedString(format, mapping, beginIndex, i, result);
				beginIndex = i;
			}
			lastCh = curCh;
		}
		return me._appendMappedString(format, mapping, beginIndex, i, result);
	},
	
	/**
	 * @private
	 * Checks if the substring is a mapped date format pattern and adds it to the result format String.
	 * @param {String} format The unmodified format String.
	 * @param {Object} mapping The date format mapping Object.
	 * @param {Number} beginIndex The begin index of the continuous format characters.
	 * @param {Number} currentIndex The last index of the continuous format characters.
	 * @param {String} result The result format String.
	 * @returns {String}
	 */
	_appendMappedString: function(format, mapping, beginIndex, currentIndex, result) {
		var temp;
		if(beginIndex !== -1) {
			temp = format.substring(beginIndex, currentIndex);
			// check if the temporary string has a known mapping
			if (mapping[temp]) {
				temp = mapping[temp];
			}
			result = result.concat(temp);
		}
		return result;
	},
	
	/**
	 * Return itself if value is a Date, otherwise the Date specified as **else** parameter.
	 * If **else** parameter is `true`, new Date object will be returned as fallback.
	 * @param {Mixed} value Value to check.
	 * @param {Date|Boolean} elseDateOrNew A Date value to return instead, or `true` to return a new Date object.
	 * @returns {Date}
	 */
	idate: function(value, elseDateOrNew) {
		return Ext.isDate(value) ? value : (true === elseDateOrNew || !Ext.isDate(elseDateOrNew) ? new Date() : elseDateOrNew);
	},
	
	/**
	 * Creates and returns a new Date instance with the exact same date value 
	 * as the called instance. If the supplied value is not a valid date object, 
	 * null will be returned.
	 * @param {Date} The date.
	 * @returns {Date} The new Date instance.
	 */
	clone: function(date) {
		return !Ext.isDate(date) ? null : Ext.Date.clone(date);
	},
	
	/**
	 * Formats a date given the supplied format string. If the supplied value
	 * is not a valid date object, null will be returned.
	 * @param {Date} date The date to format
	 * @param {String} format The format string
	 * @returns {String} The formatted date or null if date parameter is not a JavaScript Date object
	 */
	format: function(date, format) {
		return !Ext.isDate(date) ? null : Ext.Date.format(date, format);
	},
	
	/**
	 * Parses the passed string using the specified date format.
	 * {@link Sonicle.Date#parse Sonicle.Date.parse} is alias for {@link Ext.Date#parse Ext.Date.parse}
	 * @param {String} input The raw date string.
	 * @param {String} format The expected date string format.
	 * @param {Boolean} [strict=false] (optional) `true` to validate date strings while parsing (i.e. prevents JavaScript Date "rollover").
	 * Invalid date strings will return `null` when parsed.
	 * @return {Date/null} The parsed Date, or `null` if an invalid date string.
	 */
	parse: function(input, format, strict) {
		return Ext.Date.parse(input, format, strict);
	},
	
	/**
	 * Get the day name (localized) for the given day number.
	 * @param {Number} day A zero-based day number (0=sunday, 1=monday, etc...).
	 * @param {Boolean} [lowercase] True to return a lowercase value.
	 * @returns {String} The day name.
	 */
	getDayName: function(day, lowercase) {
		var s = Ext.Date.dayNames[day];
		return (lowercase === true) ? s.toLowerCase() : s;
	},
	
	/**
	 * Get the short day name (localized) for the given day number.
	 * @param {Number} day A zero-based day number (0=sunday, 1=monday, etc...).
	 * @returns {String} The short day name.
	 */
	getShortDayName: function(day) {
		return Ext.Date.getShortDayName(day);
	},
	
	/**
	 * Get the initial day name letter (localized) for the given day number.
	 * @param {Number} day A zero-based day number (0=sunday, 1=monday, etc...).
	 * @returns {String} The day name beginning letter.
	 */
	getShortestDayName: function(day) {
		return Ext.Date.getShortDayName(day).substring(0, 1);
	},
	
	/**
	 * Get the month name (localized) for the given month number.
	 * @param {Number} day A zero-based month number.
	 * @param {Boolean} [lowercase] True to return a lowercase value.
	 * @returns {String} The month name.
	 */
	getMonthName: function(month, lowercase) {
		var s = Ext.Date.monthNames[month];
		return (lowercase === true) ? s.toLowerCase() : s;
	},
	
	/**
	 * Calculate the `Date.timezoneOffset()` difference between two dates.
	 * @param {Date} start The first date.
	 * @param {Date} end The second date.
	 * @param {String} [unit] The time unit to return. Valid values are 'minutes' (the default), 'seconds' or 'millis'.
	 * @returns {Number} The time difference between the timezoneOffset values in the units specified by the unit param.
	 */
	diffTimezones: function(start, end, unit) {
		var XDate = Ext.Date,
				miDiff = start.getTimezoneOffset() - end.getTimezoneOffset(); // minutes
		if (unit === XDate.SECOND || unit === 'seconds') {
			return miDiff * 60;
		} else if (unit === XDate.MILLI || unit === 'millis') {
			return miDiff * 60 * 1000;	
		}
		return miDiff;
	},
	
	/**
	 * Returns the time duration between two dates in the specified units. For finding the number of
	 * calendar days (ignoring time) between two dates use {@link Sonicle.Date.diffDays diffDays} instead.
	 * @param {Date} start The start date
	 * @param {Date} end The end date
	 * @param {String} [unit=millis] The time unit to return. Valid values are 'millis' (the default),
	 * 'seconds', 'minutes' or 'hours'.
	 * {Boolean} [preventDstAdjust=false] `true` to prevent adjustments when crossing DST boundaries.
	 * @return {Number} The time difference between the dates in the units specified by the unit param,
	 * rounded to the nearest even unit via Math.round().
	 */
	diff: function (start, end, unit, preventDstAdjust) {
		var XD = Ext.Date,
				denom = 1, msDiff;
		
		if (!Ext.isDate(start) || !Ext.isDate(end)) return null;
		msDiff = preventDstAdjust ? (XD.localToUtc(end).getTime() - XD.localToUtc(start).getTime()) : (end.getTime() - start.getTime());
		if (unit === XD.SECOND || unit === 'seconds') {
			denom = 1000;
		} else if (unit === XD.MINUTE || unit === 'minutes') {
			denom = 1000 * 60;
		} else if (unit === XD.HOUR || unit === 'hours') {
			denom = 1000 * 60 * 60;
		}
		return Math.round(msDiff / denom);
		
		/*
		var XDate = Ext.Date,
				msDiff = end.getTime() - start.getTime(),
				msTzOff = preventDstAdjust ? this.diffTimezones(start, end, XDate.MILLI) : 0,
				denom = 1,
				diff;

		if (unit === XDate.SECOND || unit === 'seconds') {
			denom = 1000;
		} else if (unit === XDate.MINUTE || unit === 'minutes') {
			denom = 1000 * 60;
		} else if (unit === XDate.HOUR || unit === 'hours') {
			denom = 1000 * 60 * 60;
		}
		diff = Math.round(msDiff / denom);
		return (msTzOff !== 0) ? (diff + Math.round(msTzOff / denom)) : diff;
		*/
	},
	
	/**
	 * Calculates the number of calendar days between two dates, ignoring time values.
	 * A time span that starts at 11pm (23:00) on Monday and ends at 1am (01:00) 
	 * on Wednesday is only 26 total hours, but it spans 3 calendar days, 
	 * so this function would return 2.
	 * For the  exact time difference, use {@link Sonicle.Date.diff diff} instead.
	 * 
	 * NOTE that the dates passed into this function are expected to be in local 
	 * time matching the system timezone. This does not work with timezone-relative 
	 * or UTC dates as the exact date boundaries can shift with timezone shifts, 
	 * affecting the output.
	 * If you need precise control over the difference, use {@link Sonicle.Date.diff diff} instead.
	 * 
	 * @param {Date} start The start date
	 * @param {Date} end The end date
	 * @return {Number} The number of calendar days difference between the dates
	 */
	diffDays: function (start, end) {
		// All calculations are in milliseconds
		var day = 1000 * 60 * 60 * 24,
				clear = Ext.Date.clearTime,
				timezoneOffset = (start.getTimezoneOffset() - end.getTimezoneOffset()) * 60 * 1000,
				diff = clear(end, true).getTime() - clear(start, true).getTime() + timezoneOffset,
				days = Math.round(diff / day);

		return days;
	},
	
	/**
	 * Copies the date value from one date object into another without altering the target's
	 * date value. This function returns a new Date instance without modifying either original value.
	 * @param {Date} from The original date from which to copy the date
	 * @param {Date} to The target date to copy the date to
	 * @returns {Date} The new date/time value
	 */
	copyDate: function(from, to) {
		var dt = Ext.Date.clone(to);
		dt.setFullYear(
				from.getFullYear(),
				from.getMonth(),
				from.getDate()
		);
		return dt;
	},
	
	/**
	 * Copies the time value from one date object into another without altering the target's
	 * date value. This function returns a new Date instance without modifying either original value.
	 * @param {Date} from The original date from which to copy the time
	 * @param {Date} to The target date to copy the time to
	 * @return {Date} The new date/time value
	 */
	copyTime: function(from, to) {
		var dt = Ext.Date.clone(to);
		dt.setHours(
				from.getHours(),
				from.getMinutes(),
				from.getSeconds(),
				from.getMilliseconds()
		);
		return dt;
	},
	
	setTime: function(dateTime, h, m, s) {
		var dt = Ext.Date.clone(dateTime);
		dt.setHours(h, m, s, 0);
		return dt;
	},
	
	/**
	 * Compares two dates and returns a value indicating how they relate to each other.
	 * @param {Date} date1 The first date.
	 * @param {Date} date2 The second date.
	 * @param {Boolean} [precise] `true` to include milliseconds in the comparison.
	 * @param {Boolean} preventDstAdjust `true` to prevent adjustments when crossing DST boundaries.
	 * @returns {Number} A negative integer, zero, or a positive integer as the first argument is less than, equal to, or greater than the second.
	 */
	compare: function(date1, date2, precise, preventDstAdjust) {
		var XDate = Ext.Date,
				dt1 = XDate.clone(date1),
				dt2 = XDate.clone(date2);
		
		if (precise !== true) {
			dt1.setMilliseconds(0);
			dt2.setMilliseconds(0);
		}
		if (preventDstAdjust === true) {
			dt1 = XDate.localToUtc(dt1);
			dt2 = XDate.localToUtc(dt2);
		}
		return dt1.getTime() - dt2.getTime();
	},
	
	/**
	 * Checks if the first date is before the second one.
	 * @param {Date} date1 The first date.
	 * @param {Date} date2 The second date.
	 * @returns {Boolean}
	 */
	isBefore: function(date1, date2) {
		return this.compare(date1, date2, false, true) < 0;
	},
	
	/**
	 * Checks if the first date is before or equal to the second one.
	 * @param {Date} date1 The first date.
	 * @param {Date} date2 The second date.
	 * @returns {Boolean}
	 */
	isBeforeOrEqual: function(date1, date2) {
		return this.compare(date1, date2, false, true) <= 0;
	},
	
	/**
	 * Checks if the first date is after the second one.
	 * @param {Date} date1 The first date.
	 * @param {Date} date2 The second date.
	 * @returns {Boolean}
	 */
	isAfter: function(date1, date2) {
		return this.compare(date1, date2, false, true) > 0;
	},
	
	/**
	 * Checks if the first date is after or equal to the second one.
	 * @param {Date} date1 The first date.
	 * @param {Date} date2 The second date.
	 * @returns {Boolean}
	 */
	isAfterOrEqual: function(date1, date2) {
		return this.compare(date1, date2, false, true) >= 0;
	},
	
	/**
	 * Returns the maximum date value passed into the function. Any number of date
	 * objects can be passed as separate params.
	 * @param {Date} dt1 The first date
	 * @param {Date} dt2 The second date
	 * @param {Date} dtN (optional) The Nth date, etc.
	 * @return {Date} A new date instance with the latest date value that was passed to the function
	 */
	max: function() {
		return this.maxOrMin.apply(this, [true, arguments]);
	},
	
	/**
	 * Returns the minimum date value passed into the function. Any number of date
	 * objects can be passed as separate params.
	 * @param {Date} dt1 The first date
	 * @param {Date} dt2 The second date
	 * @param {Date} dtN (optional) The Nth date, etc.
	 * @return {Date} A new date instance with the earliest date value that was passed to the function
	 */
	min: function() {
		return this.maxOrMin.apply(this, [false, arguments]);
	},
	
	// private helper fn
	maxOrMin: function(max) {
		var dt = (max ? 0 : Number.MAX_VALUE),
				i = 0,
				args = arguments[1],
				ln = args.length;
		for (; i < ln; i++) {
			if (args[i]) dt = Math[max ? 'max' : 'min'](dt, args[i].getTime());
		}
		return new Date(dt);
	},
	
	isInRange: function(dt, rangeStart, rangeEnd) {
		return  (dt >= rangeStart && dt <= rangeEnd);
	},
	
	/**
	 * Returns true if two date ranges overlap (either one starts or ends within the other, or one completely
	 * overlaps the start and end of the other), else false if they do not.
	 * @param {Date} start1 The start date of range 1
	 * @param {Date} end1   The end date of range 1
	 * @param {Date} start2 The start date of range 2
	 * @param {Date} end2   The end date of range 2
	 * @return {Booelan} True if the ranges overlap, else false
	 */
	rangesOverlap: function(start1, end1, start2, end2) {
		var startsInRange = (start1 >= start2 && start1 <= end2),
				endsInRange = (end1 >= start2 && end1 <= end2),
				spansRange = (start1 <= start2 && end1 >= end2);

		return (startsInRange || endsInRange || spansRange);
	},
	
	/**
	 * Returns true if the specified date is a Saturday or Sunday, else false.
	 * @param {Date} dt The date to test
	 * @return {Boolean} True if the date is a weekend day, else false
	 */
	isWeekend: function(dt) {
		return dt.getDay() % 6 === 0;
	},
	
	/**
	 * Returns true if the specified date falls on a Monday through Friday, else false.
	 * @param {Date} dt The date to test
	 * @return {Boolean} True if the date is a week day, else false
	 */
	isWeekday: function(dt) {
		return dt.getDay() % 6 !== 0;
	},
	
	/**
	 * Returns true if the specified date's time component equals 00:00, ignoring
	 * seconds and milliseconds.
	 * @param {Object} dt The date to test
	 * @return {Boolean} True if the time is midnight, else false
	 */
	isMidnight: function(dt) {
		return dt.getHours() === 0 && dt.getMinutes() === 0;
	},
	
	/**
	 * Returns true if the specified date is the current browser-local date, else false.
	 * @param {Object} dt The date to test
	 * @return {Boolean} True if the date is today, else false
	 */
	isToday: function(dt) {
		var me = this,
				ndt = me.add(Ext.Date.clearTime(dt, true), {hours: 12});
		return me.diffDays(ndt, me.today()) === 0;
	},
	
	/**
	 * Convenience method to get the current browser-local date with no time value.
	 * @return {Date} The current date, with time 12:00
	 */
	today: function() {
		return this.add(Ext.Date.clearTime(new Date()), {hours: 12});
	},
	
	/**
	 * Add time to the specified date and returns a new Date instance as the 
	 * result (does not alter the original date object). Time can be specified 
	 * in any combination of milliseconds to years, and the function automatically 
	 * takes leap years and daylight savings into account.
	 * Some syntax examples:
	 *		var now = new Date();
	 *		// Add 24 hours to the current date/time:
	 *		var tomorrow = Extensible.Date.add(now, { days: 1 });
	 *		// More complex, returning a date only with no time value:
	 *		var futureDate = Extensible.Date.add(now, {
	 *			weeks: 1,
	 *			days: 5,
	 *			minutes: 30
	 *		});
	 * 
	 * @param {Date} date The starting date to which to add time
	 * @param {Object} intervals A config object that can contain one or more of the 
	 * following properties, each with an integer value:
	 * 
	 *	* millis
	 *	* seconds
	 *	* minutes
	 *	* hours
	 *	* days
	 *	* weeks
	 *	* months
	 *	* years
	 *	
	 *	@param {Boolean} [preventDstAdjust=false] `true` to prevent adjustments when crossing DST boundaries.
	 *	@return {Date} A new date instance containing the resulting date/time value
	 */
	add: function(date, intervals, preventDstAdjust) {
		if (!intervals) return date;
		if (preventDstAdjust === undefined) preventDstAdjust = false;
		var XDate = Ext.Date,
				dateAdd = XDate.add,
				ndt = XDate.clone(date);

		if (intervals.years) {
			ndt = dateAdd(ndt, XDate.YEAR, intervals.years, preventDstAdjust);
		}
		if (intervals.months) {
			ndt = dateAdd(ndt, XDate.MONTH, intervals.months, preventDstAdjust);
		}
		if (intervals.weeks) {
			ndt = dateAdd(ndt, XDate.DAY, (intervals.days || 0) + (intervals.weeks * 7), preventDstAdjust);
		}
		if (intervals.days) {
			ndt = dateAdd(ndt, XDate.DAY, intervals.days, preventDstAdjust);
		}
		if (intervals.hours) {
			ndt = dateAdd(ndt, XDate.HOUR, intervals.hours, preventDstAdjust);
		}
		if (intervals.minutes) {
			ndt = dateAdd(ndt, XDate.MINUTE, intervals.minutes, preventDstAdjust);
		}
		if (intervals.seconds) {
			ndt = dateAdd(ndt, XDate.SECOND, intervals.seconds, preventDstAdjust);
		}
		if (intervals.millis) {
			ndt = dateAdd(ndt, XDate.MILLI, intervals.millis, preventDstAdjust);
		}
		return ndt;
	},
	
	getFirstDateOfWeek: function(date, startDay) {
		var XDate = Ext.Date,
				newDate = XDate.clearTime(date, true),
				day = newDate.getDay(),
				sub;
		
		if (day !== startDay) {
			if (day === 0) {
				sub = 6;
			} else {
				sub = day - startDay;
			}
			return XDate.add(newDate, XDate.DAY, -sub);
		} else {
			return newDate;
		}
	},
	
	getLastDateOfWeek: function(date, startDay) {
		var XDate = Ext.Date,
				start = this.getFirstDateOfWeek(date, startDay);
		
		return XDate.add(start, XDate.DAY, 6);
	},
	
	/**
	 * Get the number of days in the month. If passed month is a date, 
	 * return value will be adjusted for leap year.
	 * @param {Number|Date} month The month number or a date
	 * @return {Number} The number of days in the month.
	 */
	getDaysInMonth: function(month) {
		if (Ext.isDate(month)) {
			return Ext.Date.getDaysInMonth(month);
		} else {
			var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			return daysInMonth[month-1];
		}
	},
	
	/**
	 * Get the n-th week-day of a date. In other words: the week-day of the 
	 * passed date is the n-th week-day of the month.
	 * @param {Date} date The date
	 * @returns {Number} The ordinal week-day number.
	 */
	getNthWeekDayOfMonth: function(date) {
		return Math.floor((date.getDate()+6)/7);
	},
	
	/**
	 * Formats a duration value into a String like XX:XX:XX.
	 * @param {Integer} value Duration value in seconds.
	 * @returns {String} Duration value string
	 */
	formatDuration: function(value) {
		var h = 0, m = 0, s = 0, v = value,
			fnPad = function(s) {
				return Ext.String.leftPad(s, 2, '0');
			};

		if (Ext.isNumber(v)) {
			h = Math.floor(v / 3600);
			v = v % 3600;
			m = Math.floor(v / 60);
			s = Math.floor(v % 60);
		}
		return fnPad(h) + ':' + fnPad(m) + ':' + fnPad(s);
	},
	
	/**
	 * Parses a duration String like XX:XX:XX into the equivalend number of seconds.
	 * @param {String} value Duration string.
	 * @returns {Number} Duration value in seconds
	 */
	parseDuration: function(value) {
		var tks = Sonicle.String.split(value, ':', 3),
				mul = [3600, 60, 1],
				fnParse = function(s) {
					var x = parseInt(s);
					return Ext.isNumeric(x) ? x : 0;
				},
				dur = 0, i;

		for (i=0; i<tks.length; i++) {
			dur += fnParse(tks[i]) * mul[i];
		}
		return dur;
	},
	
	/**
	 * Rounds time of passed date to nearest minutes.
	 * https://stackoverflow.com/questions/4968250/how-to-round-time-to-the-nearest-quarter-hour-in-javascript	
	 * @param {Date} date The date to be rounded
	 * @param {Integer} minutes Minutes interval to round to.
	 * @param {nearest|up|down} [method=nearest] Round method.
	 * @returns {Date} The new rounded Date
	 */
	roundTime: function(date, minutes, method) {
		if (!Ext.isDate(date) || !Ext.isNumber(minutes) || minutes <= 0) return date;
		var ms = minutes * 60 * 1000,
			roundFn = 'round';
		
		if ('up' === method) {
			roundFn = 'ceil';
		} else if ('down' === method) {
			roundFn = 'floor';
		}
		return new Date(Math[roundFn](date.getTime() / ms) * ms);
	},
	
	/**
	 * Converts passed value in seconds in a human readable format: like `1y 2d 10h 22m 3s`.
	 * @param {Integer} seconds Duration value in seconds.
	 * @param {Object/Boolean} [units] A config object to control time units to use in 
	 * output: when not provided or set to `true`, all units are activated by default.
	 * @param {Object} [symbols] A config object that can override defaults units 
	 * symbols: `['y', 'd', 'h', 'm', 's']`: `y` for years, `d` for days, 
	 * `h` for hours, `m` for minutes, `s` for seconds.
	 * @returns {String} Duration value String in readable format
	 */
	humanReadableDuration: function(seconds, units, symbols) {
		if (units === true) units = {};
		units = Ext.apply({}, units || {}, {years: true, days: true, hours: true, minutes: true, seconds: true});
		var flo = Math.floor,
				syms = Ext.isArray(symbols) ? symbols : ['y', 'd', 'h', 'm', 's'],
				vals = [0, 0, 0, 0, 0],
				toks = [], v = seconds, i;
		
		if (Ext.isNumber(v)) {
			if (units['years'] === true) {
				vals[0] = flo(v / 31536000);
				v = v % 31536000;
			}
			if (units['days'] === true) {
				vals[1] = flo(v / 86400);
				v = v % 86400;
			}
			if (units['hours'] === true) {
				vals[2] = flo(v / 3600);
				v = v % 3600;
			}
			if (units['minutes'] === true) {
				vals[3] = flo(v / 60);
			}
			if (units['seconds'] === true) {
				vals[4] = flo(v % 60);
			}
		}
		
		for (i=0; i<vals.length; i++) {
			if (vals[i] > 0) {
				toks.push(vals[i]+''+syms[i]);
			}
		}
		return Sonicle.String.join(toks.length > 2 ? ', ' : ' ', toks);
	}
	
	/*
	utcTimezoneOffset: function(date) {
		var ExDate = Ext.Date,
				tzOffset = date.getTimezoneOffset();
		return ExDate.subtract(date, ExDate.MINUTE, tzOffset);
	}
	*/
});
