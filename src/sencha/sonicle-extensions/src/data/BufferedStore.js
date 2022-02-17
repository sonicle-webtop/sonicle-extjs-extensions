/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * @deprecated Seems not used anymore
 */
Ext.define('Sonicle.data.BufferedStore', {
	extend: 'Ext.data.BufferedStore',

	afterChange: function(record, modifiedFieldNames, type) {
		this.fireEvent('update', this, record, Ext.data.Model.EDIT, modifiedFieldNames/*,{}*/);
	},
	
	afterEdit: function(record, modifiedFieldNames) {
		this.needsSync = this.needsSync || record.dirty;
		this.afterChange(record, modifiedFieldNames, Ext.data.Model.EDIT);				
	}
	
});
