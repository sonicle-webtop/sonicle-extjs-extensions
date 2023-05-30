/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Host', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.sohost',
	requires: [
		'Sonicle.String'
	],
	
	type: 'sohost',
	
	config: {
		message: 'Is not a valid network host',
		
		/**
		 * A matcher to check for network host as hostname or IPv4 address (dotted notation).
		 */
		matcher: [Sonicle.String.reIPAddress4, Sonicle.String.reHostname]
	}
});