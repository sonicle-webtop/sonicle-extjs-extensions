/* @private
 * This is an internal helper class.
 */
Ext.define('Sonicle.calendar.util.EventUtils', {
	requires: ['Sonicle.Date'],
	
	statics: {
		
		dateFmt: function() {
			return 'd/m/Y';
		},
		
		timeFmt: function(use24HourTime) {
			return (use24HourTime) ? 'G:i' : 'g:ia';
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
			return SoDate.diff(start, end, 'hours');
		},
		
		/**
		* Builds strings useful for displaying an event.
		* @param {Object} edata Event data.
		* @param {String} timeFmt Desired time format string.
		* @return {Object} An object containing title and tooltip properties.
		*/
		buildDisplayInfo: function(edata, dateFmt, timeFmt) {
			var EM = Sonicle.calendar.data.EventMappings,
					XDate = Ext.Date,
					SoDate = Sonicle.Date,
					evTit = edata[EM.Title.name],
					evLoc = edata[EM.Location.name],
					evOwn = edata[EM.Owner.name],
					evStaDt = edata[EM.StartDate.name],
					evEndDt = edata[EM.EndDate.name],
					evIsAD = edata[EM.IsAllDay.name] === true,
					sdate = XDate.format(evStaDt, dateFmt),
					stime = XDate.format(edata[EM.StartDate.name], timeFmt),
					edate = XDate.format(evEndDt, dateFmt),
					etime = XDate.format(edata[EM.EndDate.name], timeFmt),
					tit = Ext.isEmpty(evLoc) ? evTit : Ext.String.format('{0} @{1}', evTit, evLoc),
					tip;
			
			if (SoDate.diffDays(evStaDt, evEndDt) === 0) {
				tip = sdate + (evIsAD ? '' : ' ' + stime + ' - ' + etime);
				//tip = startd + ' ' + startt + ' - ' + endt;
			} else {
				tip = sdate + (evIsAD ? '' : ' ' + stime) + '<br>' + edate + (evIsAD ? '' : ' ' + etime);
				//tip = startd + ' ' + startt + '<br>' + endd + ' ' + endt;
			}
			if (!Ext.isEmpty(evOwn)) tip += ('<br>(' + evOwn + ')');
			
			return {
				title: tit,
				tooltip: tip
			};
	   }
	}
});
