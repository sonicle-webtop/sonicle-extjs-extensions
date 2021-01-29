/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Custom', {
	extend:'Ext.data.validator.Validator',
	alias: 'data.validator.socustom',
	mixins: ['Sonicle.mixin.ConditionalValidator'],
	
	type: 'socustom',
	
	validate: function(v, rec) {
		var me = this, cb;
		if (!me.shouldValidate(v, rec)) return true;
		cb = Ext.callback(me.fn, me.scope || me, [v, rec]);
		return cb !== undefined ? cb : false;
	}
});
