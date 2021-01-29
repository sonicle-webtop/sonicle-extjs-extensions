/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Netmask4', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.sonetmask4',
	
	type: 'sonetmask4',
	
	config: {
		/**
		 * @cfg {String} message
		 * The error message to return when the value is not a valid IPv4 netmask.
		 */
		message: 'Is not a valid IPv4 netmask',
		
		//https://stackoverflow.com/questions/5360768/regular-expression-for-subnet-masking/5360788#5360788
		/**
		 * @cfg {RegExp} matcher
		 * A matcher to check for IPv4 netmask in dotted notation.
		 */
		matcher: /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/
	}
});
