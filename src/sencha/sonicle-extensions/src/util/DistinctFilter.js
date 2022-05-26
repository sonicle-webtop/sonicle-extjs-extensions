/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.util.DistinctFilter', {
	extend: 'Ext.util.Filter',
	
	constructor: function(cfg) {
		this.callParent([cfg]);
		this.distinctValues = {};
	},
	
	destroy: function() {
		delete this.distinctValues;
		this.callParent();
	},
	
	resetDistinctValues: function() {
		this.distinctValues = {};
	},
	
	filterIfDistinct: function(value) {
		var me = this;
		if (me.distinctValues && me.distinctValues[value] !== true) {
			me.distinctValues[value] = true;
			return true;
		} else {
			return false;
		}
	}
	
	/*
	createRegexFilter: function() {
		var me = this,
			anyMatch = !!me.getAnyMatch(),
			exact = !!me.getExactMatch(),
			value = me.getValue(),
			matcher = Ext.String.createRegex(value,
				!anyMatch,  // startsWith
				!anyMatch && exact, // endsWith
				!me.getCaseSensitive());
		
		return function(item) {
			var val = me.getPropertyValue(item);
			return matcher ? matcher.test(val) : (val == null);
		}
	}
	*/
});
