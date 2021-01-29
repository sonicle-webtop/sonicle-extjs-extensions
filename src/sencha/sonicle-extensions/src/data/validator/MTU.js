/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.MTU', {
	extend: 'Ext.data.validator.Range',
	alias: 'data.validator.somtu',
	
	type: 'somtu',
	min: 1280,
	max: 65520
});
