/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.PageActivityMonitor', {
	singleton: true,
	requires: [
		'Sonicle.ActivityMonitor'
	],
	mixins: [
		'Ext.mixin.Observable'
	],
	
	config: {
		/**
		 * @cfg {Number} timeout
		 * The amount of time (ms) before the user is considered idle
		 */
		timeout: 30000
	},
	
	/**
	 * @private
	 * @property {Sonicle.ActivityMonitor} monitor
	 */
	monitor: null,
	
	/**
	 * @event change
	 * Fires when activity status changed
	 * @param {Sonicle.PageActivityMonitor} this The activity monitor
	 * @param {Boolean} idle True, if the user is idle, false otherwise
	 */
	
	constructor: function(cfg) {
		var me = this;
		me.initConfig(cfg);
		me.mixins.observable.constructor.call(me, cfg);
		me.callParent([cfg]);
		me.monitor = Ext.create('Sonicle.ActivityMonitor', {targetEl: Ext.getBody()});
		me.monitor.on('change', me.onMonitorChange, me);
	},
	
	destroy: function() {
		var me = this;
		me.monitor.un(me.onMonitorChange, me);
		me.monitor = null;
	},
	
	start: function(timeout) {
		var mon = this.monitor;
		if (mon) mon.start(timeout);
	},
	
	stop: function() {
		var mon = this.monitor;
		if (mon) mon.stop();
	},
	
	isIdle: function() {
		var mon = this.monitor;
		return mon ? mon.isIdle() : undefined;
	},
	
	getRemainingTime: function() {
		var mon = this.monitor;
		return mon ? mon.getRemainingTime() : undefined;
	},
	
	getElapsedTime: function() {
		var mon = this.monitor;
		return mon ? mon.getElapsedTime() : undefined;
	},
	
	getLastActiveTime: function() {
		var mon = this.monitor;
		return mon ? mon.getLastActiveTime() : undefined;
	},
	
	privates: {
		onMonitorChange: function(s, idle) {
			this.fireEvent('change', this, idle);
		}
	}
});
