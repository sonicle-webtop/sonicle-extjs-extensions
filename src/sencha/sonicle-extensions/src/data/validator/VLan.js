/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.VLan', {
	extend: 'Ext.data.validator.Range',
	alias: 'data.validator.sovlan',
	
	type: 'sovlan',
	min: 1,
	max: 4094
});
