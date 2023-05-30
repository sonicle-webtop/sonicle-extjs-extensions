/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Port', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.soport',
	requires: [
		'Sonicle.String'
	],
	
	type: 'soport',
	
	config: {
		message: 'Is not a valid network port number',
		
		/**
		 * A matcher to check for network port.
		 */
		matcher: Sonicle.String.rePort
	}
});
