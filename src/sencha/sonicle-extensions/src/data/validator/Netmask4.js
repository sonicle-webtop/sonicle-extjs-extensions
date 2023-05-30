/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Netmask4', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.sonetmask4',
	requires: [
		'Sonicle.String'
	],
	
	type: 'sonetmask4',
	
	config: {
		/**
		 * @cfg {String} message
		 * The error message to return when the value is not a valid IPv4 netmask.
		 */
		message: 'Is not a valid IPv4 netmask',
		
		/**
		 * @cfg {RegExp} matcher
		 * A matcher to check for IPv4 netmask in dotted notation.
		 */
		matcher: Sonicle.String.reNetmask4
	}
});
