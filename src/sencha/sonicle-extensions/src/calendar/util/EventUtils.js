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
			var soDate = Sonicle.Date,
					diff = soDate.diffDays(start, end);
			//if((diff <= 1) && soDate.isMidnight(end)) return false;
			return (diff > 0);
		},
		
		isLikeSingleDay: function(start, end) {
			var soDate = Sonicle.Date;
			return (soDate.isMidnight(start) && soDate.isMidnight(end) && (soDate.diffDays(start, end) === 1));
		},
		
		durationInHours: function(start, end) {
			var soDate = Sonicle.Date;
			return soDate.diff(start, end, 'hours');
		},
		
		/**
		* Builds strings useful for displaying an event.
		* @param {Object} edata Event data.
		* @param {String} timeFmt Desired time format string.
		* @return {Object} An object containing title and tooltip properties.
		*/
		buildDisplayInfo: function(edata, dateFmt, timeFmt) {
			var EM = Sonicle.calendar.data.EventMappings,
					eDate = Ext.Date,
					soDate = Sonicle.Date,
					etitle = edata[EM.Title.name],
					elocation = edata[EM.Location.name],
					eowner = edata[EM.Owner.name],
					esd = edata[EM.StartDate.name],
					eed = edata[EM.EndDate.name],
					startd = eDate.format(esd, dateFmt),
					startt = eDate.format(edata[EM.StartDate.name], timeFmt),
					endd = eDate.format(eed, dateFmt),
					endt = eDate.format(edata[EM.EndDate.name], timeFmt),
					tit = Ext.isEmpty(elocation) ? etitle : Ext.String.format('{0} @{1}', etitle, elocation),
					tip;
			
			if (soDate.diffDays(esd, eed) === 0) {
				tip = startd + ' ' + startt + ' - ' + endt;
			} else {
				tip = startd + ' ' + startt + '<br>' + endd + ' ' + endt;
			}
			if (!Ext.isEmpty(eowner)) tip += ('<br>(' + eowner + ')');
			
			return {
				title: tit,
				tooltip: tip
				//tooltip: Ext.String.format('{0} {1}<br>{2} {3}{4}', startd, startt, endd, endt, tipown)
			};
	   }
	}
});
