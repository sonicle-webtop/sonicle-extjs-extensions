/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.IPAddress4', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.soipaddress4',
	requires: [
		'Sonicle.String'
	],
	
	type: 'soipaddress4',
	
	config: {
		message: 'Is not a valid IPv4 address',
		
		/**
		 * A matcher to check for IPv4 address in dotted notation.
		 */
		matcher: Sonicle.String.reIPAddress4
	}
});
