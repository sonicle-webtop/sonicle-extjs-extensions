/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.NoAutocomplete', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sonoautocomplete',
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		field.on('render', me.onCmpRender, me, {single: true});
	},
	
	onCmpRender: function(s) {
		if(s.inputEl) {
			s.inputEl.set({
				autocomplete: (s.inputType === 'password') ? 'new-password' : 'nope'
			});
		}
	}
});
