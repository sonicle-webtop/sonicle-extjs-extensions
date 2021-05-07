/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.validator.Port', {
	extend: 'Ext.data.validator.Format',
	alias: 'data.validator.soport',
	
	type: 'soport',
	
	config: {
		message: 'Is not a valid network port number',
		
		/**
		 * https://stackoverflow.com/questions/12968093/regex-to-validate-port-number
		 * https://github.com/cusspvz/proxywrap/issues/13
		 * A matcher to check for network port.
		 */
		matcher: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
	}
});
