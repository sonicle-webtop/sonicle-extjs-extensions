/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * This requires: https://github.com/sindresorhus/screenfull.js
 */
Ext.define('Sonicle.FullscreenMgr', {
	singleton: true,
	mixins: [
		'Ext.mixin.Observable'
	],
	
	/**
	 * @readonly
	 * @property {Boolean} screenfulLoaded
	 * `true` if screenfull library is available, `false` otherwise.
	 */
	
	/**
	 * @readonly
	 * @property {Boolean} fullscreenApi
	 * `true` if Full Screen API is supported, `false` otherwise.
	 * https://caniuse.com/#feat=fullscreen
	 */
	
	constructor: function(cfg) {
		var me = this;
		me.mixins.observable.constructor.call(me, cfg);
		me.callParent([cfg]);
		me.screenfulLoaded = Ext.isDefined(window['screenfull']);
		me.fullscreenApi = me.screenfulLoaded && window['screenfull'] !== false;
		if (me.fullscreenApi) {
			me.changeListener = Ext.bind(me.onFullscreenChange, me);
			screenfull.on('change', me.changeListener);
		}
		me.checkLib();
	},
	
	destroy: function() {
		var me = this;
		if (me.fullscreenApi && me.changeListener) {
			screenfull.off('change', me.changeListener);
		}
		me.callParent();
	},
	
	request: function(el) {
		if (!this.fullscreenApi) return;
		if (el) {
			screenfull.request(el);
		} else {
			screenfull.request();
		}
	},
	
	privates: {
		checkLib: function() {
			if (!this.screenfulLoaded) Ext.warn('Library screenfull is required (see https://github.com/sindresorhus/screenfull.js)');
		},
		
		onFullscreenChange: function() {
			this.fireEvent('change', this, screenfull.isFullscreen);
		}
	}
});
