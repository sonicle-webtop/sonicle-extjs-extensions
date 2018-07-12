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
	 * @property {Boolean} api
	 */
	api: false,
	
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
	 * @event visibilitychange
	 * Fires when page visibility changes.
	 */
	
	constructor: function(cfg) {
		var me = this, chk;
		me.initConfig(cfg);
		me.mixins.observable.constructor.call(me, cfg);
		me.callParent([cfg]);
		
		chk = me.checkApi();
		if (chk) {
			me.api = true;
			me.hiddenProp = chk[0];
			me.visibilityEvent = chk[1];
			document.addEventListener(me.visibilityEvent, me.onVisibilityChange.bind(me));
		}
	},
	
	/**
	 * Checks if Visibility API is supported.
	 * @return {Boolean}
	 */
	isSupported: function() {
		return this.api;
	},
	
	isHidden: function() {
		return !this.isSupported() ? false : document[this.hiddenProp];
	},
	
	privates: {
		onVisibilityChange: function() {
			this.fireEvent('visibilitychange');
		},
		
		checkApi: function() {
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
		}
	}
});
