/*
 * ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.Announcement', {
	singleton: true,
	requires: [
		'Sonicle.AnnouncementBar'
	],
	
	/**
	 * @private
	 * @property {Array} stack
	 */
	stack: null,
	
	/**
	 * @private
	 * @property {Sonicle.AnnouncementBar} bar
	 */
	bar: null,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.stack = [];
	},
	
	/**
	 * Sets the announcementBar that should be used for showing announcements.
	 * @param {Sonicle.Announcement} bar
	 * @returns {Sonicle.Announcement}
	 */
	register: function(bar) {
		var me = this;
		
		if (me.bar) return;
		if (!bar.isXType('soannouncementbar')) return;
		if (me.stack.length) {
			bar.setAnnouncement(me.stack.shift());
		}
		
		me.bar = bar;
		me.bar.on('hide', function() {
			if (me.stack.length) {
				me.bar.setAnnouncement(me.stack.shift());
			}
		});
		return me.bar;
	},
	
	/**
	 * Shows the configured announcement if, and only if the current announcement is not visible.
	 * Otherwise, the announcement will be placed on a stack and processed once the current
	 * announcement was hidden.
	 * @param {Object} annCfg Announcement config.
	 * @returns {Sonicle.AnnouncementBar}
	 */
	show: function(annCfg) {
		var me = this,
			bar = me.bar;
		
		if (!bar || bar.isVisible()) {
			me.stack.push(annCfg);
			return;
		}
		return bar.setAnnouncement(annCfg || bar.currentAnnouncement());
	},
	
	/**
	 * Shows the configured announcement immediately before any existing announcement.
	 * @param {Object} annCfg Announcement config.
	 * @returns {Sonicle.AnnouncementBar}
	 */
	urge: function(annCfg) {
		var me = this,
			bar = me.bar;
		
		if (bar && bar.currentAnnouncement()) {
			me.stack.unshift(bar.currentAnnouncement());
		}
		if (!bar) {
			me.stack.unshift(annCfg);
			return;
		}
		return bar.setAnnouncement(annCfg);
	},
	
	/**
	 * Closes and destroys the AnnouncementBar.
	 */
	close: function(cfg) {
		var me = this,
			bar = me.bar;
		
		if (bar) bar.close();
		me.stack.splice(0);
		me.bar = null;
	}
});
