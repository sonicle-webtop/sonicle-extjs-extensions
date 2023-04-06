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
		PSTATE_PROMPTED: 'prompted'
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
	 * If procol registration has already been issued, nothing will be done unless `force` option is specified.
	 * @param {String} proto The protocol to be registered.
	 * @param {String} url The URL template of the handler. The `%s` will be replaced with the `href` of the link.
	 * @param {String} [opts.friendlyName] The user friendly name for the protocol handler.
	 * @param {Boolean} [opts.force] Set to `true` to force registering again ignoring the prompt state.
	 * @returns {Boolean}
	 */
	register: function(proto, url, opts) {
		opts = opts || {};
		var me = this,
			ME = me.self,
			force = Ext.isBoolean(opts.force) ? opts.force : false;
		if (!me.api) return;
		
		try {
			if (!force && me.checkPromptState(proto) === ME.PSTATE_PROMPTED) return false;
			window.navigator.registerProtocolHandler(proto, url, opts.friendlyName);
			me.setPromptState(proto, ME.PSTATE_PROMPTED);
			return true;
			
		} catch (e) {
			if (console && console.error) console.error(e);
			return false;
		}
	},
	
	/**
	 * Removes a handler for a given URL scheme.
	 * @param {String} proto The protocol that was registered.
	 * @param {String} url The URL template of the handler. Must match the one used in registering process.
	 * @returns {Boolean}
	 */
	unregister: function(proto, url) {
		var me = this;
		if (!me.api) return;
		
		try {
			window.navigator.unregisterProtocolHandler(proto, url);
			me.resetPromptState(proto);
			return true;
			
		} catch (e) {
			if (console && console.error) console.error(e);
			return false;
		}
	},
	
	/**
	 * Checks if a request for handling the specified protocol has been issued in past.
	 * @param {String} proto The protocol to check.
	 * @returns {String}
	 */
	checkPromptState: function(proto) {
		var me = this,
			ME = me.self,
			key = me.buildPromptStateKey(proto),
			state = Ext.state.Manager.get(key);
		
		if (state === ME.PSTATE_PROMPTED) {
			return state;
		} else {
			return ME.PSTATE_UNKNOWN;
		}
	},
	
	/**
	 * Resets the prompt state for passed protocol.
	 * @param {String} proto The protocol to check.
	 * @returns {String}
	 */
	resetPromptState: function(proto) {
		var me = this,
			key = me.buildPromptStateKey(proto);
		Ext.state.Manager.clear(key);
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
			return this.stateKeyPrefix + 'protocolhandlerpstate@' + proto;
		},
		
		setPromptState: function(proto, state) {
			var me = this,
				key = me.buildPromptStateKey(proto);
			Ext.state.Manager.set(key, state);
		}
	}
});
