/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * https://github.com/IonDen/ion.sound
 */
Ext.define('Sonicle.Sound', {
	singleton: true,
	
	config: {
		path: '',
		volume: 0.5,
		preload: true
	},
	
	/**
	 * @readonly
	 * @property {Boolean} ionSoundLoaded
	 * `true` if ion.sound library is available, `false` otherwise.
	 */
	
	constructor: function(cfg) {
		var me = this;
		me.initConfig(cfg);
		me.callParent([cfg]);
		me.ionSoundLoaded = Ext.isDefined(window['ion']);
	},
	
	/**
	 * Adds sound(s) configuration.
	 * @param {Object/Object[]} sounds The sound or array of sounds to add.
	 */
	add: function(sounds) {
		var me = this;
		me.checkLib();
		if (!me.ionSoundLoaded) return;
		ion.sound({
			sounds: Ext.isArray(sounds) ? sounds : [sounds],
			path: me.getPath(),
			volume: me.getVolume(),
			preload: me.getPreload()
		});
	},
	
	play: function(name, opts) {
		opts = opts || {};
		this.checkLib();
		if (!this.ionSoundLoaded) return;
		ion.sound.play(name, opts);
	},
	
	pause: function(name) {
		this.checkLib();
		if (!this.ionSoundLoaded) return;
		ion.sound.pause(name);
	},
	
	stop: function(name) {
		this.checkLib();
		if (!this.ionSoundLoaded) return;
		ion.sound.stop(name);
	},
	
	privates: {
		checkLib: function() {
			if (!this.ionSoundLoaded) Ext.warn('Library ion.sound is required (see https://github.com/IonDen/ion.sound)');
		}
	}
});