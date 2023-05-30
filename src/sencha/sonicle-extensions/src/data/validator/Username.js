/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Username', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.sousername',
	requires: [
		'Sonicle.String'
	],
	
	type: 'sousername',
	
	config: {
		
		/**
		 * @cfg {String} message
		 * The error message to return when the value is not a valid IPv4 netmask.
		 */
		message: 'Is not a valid username',
		
		/**
		 * @cfg {RegExp} matcher
		 * A matcher to check for username.
		 */
		matcher: Sonicle.String.reUsernameChars
	},
	
	statics: {
		maskRe: /[a-z0-9\.\-\_]/i
	}
});
