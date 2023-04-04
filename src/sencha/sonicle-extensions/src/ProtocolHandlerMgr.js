/*
 * ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.ProtocolHandlerMgr', {
	singleton: true,
	uses: [
		'Ext.state.Manager'
	],
	
	config: {
		stateKeyPrefix: ''
	},
	
	/**
	 * @readonly
	 * @property {Boolean} api
	 */
	api: false,
	
	constructor: function(cfg) {
		var me = this;
		me.initConfig(cfg);
		me.callParent([cfg]);
		me.api = me.checkApi();
	},
	
	statics: {
		PSTATE_UNKNOWN: 'unknown',
		PSTATE_PROMPED: 'prompted'
	},
	
	/**
	 * Checks if Notification API is supported.
	 * @return {Boolean}
	 */
	isSupported: function() {
		return this.api;
	},
	
	/**
	 * Registers an application as handler for specified protocol.
	 * @param {String} proto The protocol to be registered.
	 * @param {String} url The URL template of the handler. The `%s` will be replaced with the `href` of the link.
	 * @param {String} [opts.friendlyName] The user friendly name for the protocol handler.
	 * @param {Boolean} [opts.force] Set to `true` to force prompting again.
	 * @returns {Boolean}
	 */
	register: function(proto, url, opts) {
		opts = opts || {};
		var me = this,
			force = Ext.isBoolean(opts.force) ? opts.force : false;
		if (!me.api) return;
		
		try {
			if (!force && me.checkState(proto) === me.self.PSTATE_PROMPED) return false;
			window.navigator.registerProtocolHandler(proto, url, opts.friendlyName);
			me.setPromptState(proto, me.self.PSTATE_PROMPED);
			return true;
			
		} catch (e) {
			return false;
		}
	},
	
	/**
	 * Removes a handler for a given URL scheme.
	 * @param {String} proto The protocol registered.
	 * @param {String} url The URL template of the handler. Must match the one used in registering process.
	 * @returns {Boolean}
	 */
	unregister: function(proto, url) {
		var me = this;
		if (!me.api) return;
		
		try {
			window.navigator.unregisterProtocolHandler(proto, url);
			me.clearPromptState(proto);
			return true;
			
		} catch (e) {
			return false;
		}
	},
	
	clearPromptState: function(proto) {
		var me = this,
			key = me.buildPromptStateKey(proto);
		Ext.state.Manager.clear(key);
	},
	
	checkPromptState: function(proto) {
		var me = this,
			key = me.buildStateKey(proto),
			state = Ext.state.Manager.get(key);
		
		if (state === me.self.PSTATE_PROMPED) {
			return state;
		} else {
			return me.self.PSTATE_UNKNOWN;
		}
	},
	
	privates: {
		checkApi: function() {
			try {
				var nav = window.navigator;
				return !!(nav.registerProtocolHandler && nav.unregisterProtocolHandler);
				
			} catch (e) {
				return false;
			}
		},
		
		buildPromptStateKey: function(proto) {
			return this.stateKeyPrefix + 'protocolhandler@' + proto;
		},
		
		setPromptState: function(proto, state) {
			var me = this,
				key = me.buildPromptStateKey(proto);
			Ext.state.Manager.set(key, state);
		}
	}
});
