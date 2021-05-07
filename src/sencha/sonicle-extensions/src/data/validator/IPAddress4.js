/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.IPAddress4', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.soipaddress4',
	
	type: 'soipaddress4',
	
	config: {
		message: 'Is not a valid IPv4 address',
		
		/**
		 * https://stackoverflow.com/questions/5284147/validating-ipv4-addresses-with-regexp/5284179#5284179
		 * A matcher to check for IPv4 address in dotted notation.
		 */
		matcher: /^\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b$/
	}
});
