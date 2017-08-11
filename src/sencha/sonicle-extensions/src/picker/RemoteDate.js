/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.picker.RemoteDate', {
	extend: 'Ext.picker.Date',
	alias: 'widget.soremotedatepicker',
	
	config: {
		/**
		 * @cfg {String} ajaxUrl
		 * The URL to which to send the request.
		 */
		ajaxUrl: null,
		
		/**
		 * @cfg {Object/String} ajaxExtraParams
		 * An object containing properties which are used as parameters to 
		 * the request or a url encoded string.
		 */
		ajaxExtraParams: null,
		
		/**
		 * @cfg {String} [ajaxYearParam]
		 * The name of the year parameter to send in a request.
		 */
		ajaxYearParam: 'year',
		
		/**
		 * @cfg {String} [rootProperty]
		 * Name of the property from which to retrieve the array of valid dates.
		 * Dates must be represented as string in the format 'yyyy-mm-dd'.
		 */
		rootProperty: 'data',
		
		/**
		 * @cfg {String} [successProperty]
		 * Name of the property from which to retrieve the `success` attribute, 
		 * the value of which indicates whether a given request succeeded or 
		 * failed (typically a boolean or 'true'|'false').
		 */
		successProperty: 'success'
	},
	
	/**
	 * @readOnly
	 * @property {Number} lastReqYear
	 */
	
	/**
	 * @readOnly
	 * @property {Ext.data.request.Ajax} pendingReq
	 */
	
	initComponent: function() {
		var me = this;
		me.maxDate = new Date();
		me.callParent(arguments);
		me.evaluateValue(me.getValue());
	},
	
	setValue: function(value) {
		var ret = this.callParent(arguments);
		this.evaluateValue(value);
		return ret;
	},
	
	evaluateValue: function(value) {
		var me = this, y;
		if (value) {
			y = parseInt(Ext.Date.format(value, 'Y'));
			if (me.lastReqYear !== y) {
				me.lastReqYear = y;
				me.requestDates(y);
			}
		}	
	},
	
	requestDates: function(year) {
		var me = this, obj = {};
		
		if (me.pendingReq) {
			me.pendingReq.abort();
			me.pendingReq = null;
		}
		me.setLoading(true);
		obj[me.getAjaxYearParam()] = year;
		me.pendingReq = Ext.Ajax.request({
			url: me.getAjaxUrl,
			params: Ext.apply(me.getAjaxExtraParams() || {}, obj),
			success: function(resp, opts) {
				me.pendingReq = null;
				me.setLoading(false);
				var json = Ext.decode(resp.responseText);
				if (json[me.successProperty] === true) {
					me.setDisabledDates(me.computeDisabled(year, json[me.rootProperty]));
				}
			},
			failure: function(resp, opts) {
				me.pendingReq = null;
				me.setLoading(false);
			},
			scope: me
		});
	},
	
	computeDisabled: function(year, dates) {
		var SoDate = Sonicle.Date,
				sNow = new Date().toLocaleDateString(),
				vmap = {}, ddates = [], i, dt, sDt;
		// Builds a map of valid dates
		for (i=0; i<dates.length; i++) {
			vmap[Ext.Date.parse(dates[i], 'Y-m-d').toLocaleDateString()] = 1;
		}
		dt = new Date(year, 0, 1);
		for (i=0; i<=365; i++) {
			sDt = dt.toLocaleDateString();
			if (!vmap[sDt] && (sDt !== sNow)) {
				ddates.push(Ext.Date.format(dt, this.format));
			}
			dt = SoDate.add(dt, {days: 1});
		}
		return ddates;
	}
});
