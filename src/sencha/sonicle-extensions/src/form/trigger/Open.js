/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.trigger.Open', {
	extend: 'Sonicle.form.trigger.Hideable',
	alias: 'trigger.soopen',
	uses: [
		'Sonicle.ClipboardMgr',
		'Sonicle.URLMgr'
	],
	
	hideOn: 'empty',
	hideWhenMouseOut: false,
	
	/**
     * @event beforeopen
     * Fires when the underlying component input field's value has been  using this trigger.
	 * @param {Ext.form.field.Text} this
     */
	
	/**
     * @event open
     * Fires when the underlying component input field's value has been opened using this trigger.
	 * @param {Ext.form.field.Text} this
     */
	
	cls: 'so-' + 'form-open-trigger',
	extraCls: 'fas fa-external-link-alt',

	handler: function(cmp) {
		var val = cmp.getValue();
		if (cmp.fireEvent('beforeopen', cmp) !== false) {
			if (Sonicle.String.startsWith(val, 'http', true)) {
				Sonicle.URLMgr.open(val, true);
				cmp.fireEvent('open', cmp);
			}
		}
	},
	
	isTriggerNeeded: function() {
		var me = this;
		if (!me.callParent()) {
			return false;
		} else {
			return Sonicle.String.startsWith(me.field.getValue(), 'http', true);
		}
	}
});
