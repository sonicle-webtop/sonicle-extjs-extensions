/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.tool.base.Select', {
	extend: 'Ext.form.field.ComboBox',
	requires: [
		'Sonicle.String'
	],
	
	editable: false,
	typeAhead: false,
	forceSelection: true,
	triggerAction: 'all',
	submitEmptyText: false
});
