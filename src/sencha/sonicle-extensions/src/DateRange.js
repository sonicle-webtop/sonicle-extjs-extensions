/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.DateRange', {
	isRange: true,
	
	start: null,
	
	end: null,
	
	constructor: function(start, end) {
		this.start = start;
		this.end = end;
	},
	
	equals: function(start, end) {
		if (!start) return false;
		var other = this.self.asRange(start, end);
		return this.start.getTime() === other.start.getTime() && this.end.getTime() === other.end.getTime();
	},
	
	clone: function() {
		var me = this,
				XDate = Ext.Date,
				DR = me.self;
		return new DR(XDate.clone(me.start), XDate.clone(me.end));
	},
	
	contains: function(date) {
		return this.start <= date && date <= this.end;
	},
	
	statics: {
		asRange: (function () {
			var rng = null;
			return function (start, end) {
				if (start.isRange) return start;
				if (!rng) rng = new Sonicle.DateRange();
				rng.start = start;
				rng.end = end;
				return rng;
			};
		})()
	}
});
