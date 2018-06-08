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
	
	constructor: function(cfg) {
		var me = this;
		me.mixins.observable.constructor.call(me, cfg);
		me.callParent([cfg]);
		
		me.isAvailScreenfull = Ext.isDefined(window['screenfull']);
		if (me.isAvailScreenfull) {
			me.changeListener = Ext.bind(me.onFullscreenChange, me);
			screenfull.on('change', me.changeListener);
		}
	},
	
	destroy: function() {
		var me = this;
		me.callParent();
		if (me.isAvailScreenfull) {
			if (me.changeListener) screenfull.off('change', me.changeListener);
		}
	},
	
	request: function(el) {
		var me = this;
		me.checkLib();
		if (el) {
			screenfull.request(el);
		} else {
			screenfull.request();
		}
	},
	
	privates: {
		checkLib: function() {
			if (!this.isAvailScreenfull) Ext.raise('Library screenfull is required (see https://github.com/sindresorhus/screenfull.js)');
		},
		
		onFullscreenChange: function() {
			this.fireEvent('change', this, screenfull.isFullscreen);
		}
	}
});
