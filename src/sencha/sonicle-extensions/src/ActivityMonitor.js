/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.ActivityMonitor', {
	mixins: [
		'Ext.mixin.Observable'
	],
	
	/**
	 * @cfg {Ext.dom.Element} targetEl
	 * The element on which operate.
	 */
	targetEl: null,
	
	config: {
		/**
		 * @cfg {Number} timeout
		 * The amount of time (ms) before the user is considered idle.
		 */
		timeout: 30000
	},
	
	/**
	 * @cfg {String[]} activityEvents
	 * An array of events that, when fired, should track user activity.
	 */
	activityEvents: ['mousemove', 'mousedown', 'keypress', 'DOMMouseScroll', 'mousewheel', 'touchmove', 'MSPointerMove'],
	
	/**
	 * @readonly
	 * @property {Boolean} enabled
	 * Indicates if the idle timer is enabled
	 */
	enabled: false,
	
	/**
	 * @readonly
	 * @property {Date} toggleDate
	 * The last time state changed
	 */
	toggleDate: null,
	
	/**
	 * @readonly
	 * @property {Date} lastActive
	 * The last time timer was active
	 */
	lastActive: null,
	
	/**
	 * @readonly
	 * @property {Boolean} enabled
	 * Indicates if the user is idle
	 */
	idle: false,
	
	/**
	 * @private
	 * @property {Number} tId
	 */
	tId: -1,
	
	/**
	 * @private
	 * @property {Object} evtsMap
	 */
	evtsMap: null,
	
	/**
	 * @event change
	 * Fires when activity status changed
	 * @param {Sonicle.ActivityMonitor} this The activity monitor
	 * @param {Boolean} idle True, if the user is idle, false otherwise
	 */
	
	constructor: function(cfg) {
		var me = this;
		if (!cfg.targetEl || !(cfg.targetEl instanceof Ext.dom.Element)) {
			Ext.raise('You must specify a valid targetEl');
		}
		me.initConfig(cfg);
		me.mixins.observable.constructor.call(me, cfg);
		me.callParent([cfg]);
		Ext.each(me.activityEvents, function(event) {
			me.evtsMap[event] = true;
		});
	},
	
	destroy: function() {
		this.stop();
		this.targetEl = null;
	},
	
	/**
	 * Resume tracking of a specific activity event.
	 * @param {String} eventName One event name of {@link #activityEvents}
	 */
	enableActivityEvent: function(eventName) {
		this.evtsMap[eventName] = true;
	},
	
	/**
	 * Stop tracking of a specific activity event.
	 * @param {String} eventName One event name of {@link #activityEvents}
	 */
	disableActivityEvent: function(eventName) {
		this.evtsMap[eventName] = false;
	},
	
	/**
	 * Start monitoring the target element.
	 * @param {Number} [timeout] Optional {@link #timeout} override.
	 */
	start: function(timeout) {
		var me = this, el = me.targetEl;
		if (!me.enabled) {
			if (Ext.isNumber(timeout)) me.setTimeout(timeout);
			me.toggleDate = +new Date();
			me.lastActive = me.toggleDate;
			Ext.each(me.activityEvents, function(event) {
				if (me.evtsMap[event] === true) el.on(event, me.onUserActivity, me);
			});
			me.enabled = true;
			me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
		}
	},
	
	/**
	 * Stop monitoring the target element.
	 */
	stop: function() {
		var me = this, el = me.targetEl;
		if (me.enabled) {
			clearTimeout(me.tId);
			Ext.each(me.activityEvents, function(event) {
				el.un(event, me.onUserActivity, me);
			});
			me.enabled = false;
		}
	},
	
	/**
	 * Returns if the user is currently in idle.
	 * @return {Boolean}
	 */
	isIdle: function() {
		return this.idle;
	},
	
	/**
	 * Returns the remaining millis until next status transition.
	 * @return {Number}
	 */
	getRemainingTime: function() {
		var me = this, remain;
		if (!me.enabled && me.idle) return 0;
		remain = me.getTimeout() - ((+new Date()) - me.lastActive);
		return (remain < 0) ? 0 : remain;
	},
	
	getElapsedTime: function() {
		return this.enabled ? (+new Date()) - this.toggleDate : 0;
	},
	
	/**
	 * Return the timestamp (in millis) of the last tracked user activity.
	 * @return {Number}
	 */
	getLastActiveTime: function() {
		return this.lastActive;
	},
	
	privates: {
		onUserActivity: function(e) {
			var me = this;
			
			if (e.type === 'mousemove') {
				// If coord are same, it didn't move
				if (e.pageX === me.oldPageX && e.pageY === me.oldPageY) return;
				// If coord don't exist how could it move
				if (typeof e.pageX === undefined && typeof e.pageY === undefined) return;
				// Under 200 ms is hard to do, and you would have to stop, as continuous activity will bypass this
				if (((+new Date()) - me.toggleDate) < 200) return;
			}
			
			clearTimeout(me.tId);
			if (me.idle) me.toggleIdleState();
			
			me.lastActive = +new Date();
			me.oldPageX = e.pageX;
			me.oldPageY = e.pageY;
			
			me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
			
			/*
			clearTimeout(me.tId);
			if (me.enabled) {
				if (me.idle) {
					if ((e.type === 'mousemove' || e.type === 'touchmove') && (me.activeSwitchCounter < 5)) {
						me.activeSwitchCounter++;
						return;
					}
					me.activeSwitchCounter = 0;
					me.toggleIdleState();
				}
				me.lastActivity = new Date();
				me.tId = Ext.Function.defer(me.toggleIdleState, me.getTimeout(), me);
			}
			*/
		},
		
		toggleIdleState: function() {
			var me = this;
			me.idle = !me.idle;
			me.toggleDate = +new Date();
			me.fireEvent('change', me, me.idle);
		}
	}
});
