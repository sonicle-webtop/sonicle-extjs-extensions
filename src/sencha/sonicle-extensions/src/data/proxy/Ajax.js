/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.proxy.Ajax', {
	extend: 'Ext.data.proxy.Ajax',
	alias: 'proxy.soajax',
	
	config: {
		/**
		 * @cfg {Boolean} [autoAbort]
		 * Set to `true` to automatically abort last request if another one is issued.
		 */
		autoAbort: false
	},
	
	doRequest: function(operation) {
		var me = this;
		if (me.getAutoAbort()) me.abort();
		return me.callParent(arguments);
	}
});
