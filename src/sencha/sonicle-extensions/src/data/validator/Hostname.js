/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Hostname', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.sohostname',
	requires: [
		'Sonicle.String'
	],
	
	type: 'sohostname',
	
	config: {
		message: 'Is not a valid hostname',
		
		/**
		 * A matcher to check for hostname.
		 */
		matcher: Sonicle.String.reHostname
	}
});

