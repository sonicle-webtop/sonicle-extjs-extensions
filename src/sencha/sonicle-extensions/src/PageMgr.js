/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.PageMgr', {
	singleton: true,
	mixins: [
		'Ext.mixin.Observable'
	],
	
	/**
	 * @readonly
	 * @property {Boolean} visibiltyApi
	 * `true` if Visibility API is supported, `false` otherwise.
	 * https://caniuse.com/#search=visibilitychange
	 */
	
	/**
	 * @readonly
	 * @property {String} hiddenProp
	 */
	hiddenProp: null,
	
	/**
	 * @readonly
	 * @property {String} visibilityEvent
	 */
	visibilityEvent: null,
	
	/**
	 * @readonly
	 * @property {String} pageTitle
	 */
	
	/**
	 * @readonly
	 * @property {Object} blinkInterval
	 */
	
	/**
	 * @event visibilitychange
	 * Fires when page visibility changes.
	 */
	
	constructor: function(cfg) {
		var me = this, test;
		me.initConfig(cfg);
		me.mixins.observable.constructor.call(me, cfg);
		me.callParent([cfg]);
		test = me.testVisibilityApi();
		if (test) {
			me.visibiltyApi = true;
			me.hiddenProp = test[0];
			me.visibilityEvent = test[1];
			document.addEventListener(me.visibilityEvent, me.onVisibilityChange.bind(me));
		}
	},
	
	/**
	 * Returns if page is currently not directly visible.
	 * @returns {Boolean}
	 */
	isHidden: function() {
		return !this.visibiltyApi ? false : document[this.hiddenProp];
	},
	
	/**
	 * Starts page title blinking.
	 * @param {String} msg The alternative message.
	 * @param {Integer} interval Blinking speed interval in millis.
	 */
	blinkTitle: function(msg, interval) {
		var me = this,
				doc = document;
		if (!me.blinkInterval) {
			me.pageTitle = doc.title;
			me.blinkInterval = window.setInterval(function() {
				doc.title = (me.pageTitle === doc.title) ? msg : me.pageTitle;
			}, interval ? interval : 1000);
		}
	},
	
	/**
	 * Stops page title blinking.
	 */
	stopBlinkTitle: function() {
		var me = this;
		window.clearInterval(me.blinkInterval);
		me.blinkInterval = null;
		document.title = me.pageTitle;
	},
	
	privates: {
		testVisibilityApi: function() {
			try {
				if('hidden' in document) {
					return ['hidden','visibilitychange'];
				} else {
					var prefixes = ['webkit','moz','ms','o'];
					for(var i=0; i<prefixes.length; i++) {
						if((document[prefixes[i]+'Hidden']) in document) {
							return [prefixes[i]+'Hidden', prefixes[i]+'visibilitychange'];
						}
					}
					return false;
				}
			} catch (e) {
				return false;
			}
		},
		
		onVisibilityChange: function() {
			this.fireEvent('visibilitychange');
		}
	}
});
