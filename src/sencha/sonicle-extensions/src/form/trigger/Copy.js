/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.trigger.Copy', {
	extend: 'Ext.form.trigger.Trigger',
	alias: 'trigger.socopy',
	uses: [
		'Sonicle.ClipboardMgr'
	],
	
	/**
	 * @cfg {Boolean} [copyEmptyValue=true]
	 * Set to `false` to skip clipboard copy if value is empty. Default to `true`.
	 */
	copyEmptyValue: true,
	
	/**
     * @event copy
     * Fires when the underlying component input field's value has been copied using this trigger.
	 * @param {Ext.form.field.Text} this
     */
	
	cls: 'so-' + 'form-copy-trigger',
	extraCls: 'far fa-clone',

	handler: function(cmp) {
		var val = cmp.getValue();
		if (this.copyEmptyValue || !Ext.isEmpty(val)) {
			Sonicle.ClipboardMgr.copy(val);
			cmp.fireEvent('copy', cmp);
		}
	}
});
