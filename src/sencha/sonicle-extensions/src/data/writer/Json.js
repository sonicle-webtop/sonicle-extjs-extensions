/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.data.writer.Json', {
	extend: 'Ext.data.writer.Json',
	alias: 'writer.sojson',
	
	config: {
		
		/**
		 * @cfg {Boolean} writeAssociated
		 * Set to `true` to write associated entities data into json response.
		 */
		writeAssociated: true
		
		/**
		 * @cfg {Boolean} writeChanges
		 * Set to `true` to write session {@link Ext.data.Session#getChanges} 
		 * instead of actual associated data. Only valid if {@link #writeAssociated} is active.
		 */
		//writeChanges: false
	},
	
	getRecordData: function(record, operation) {
		var me = this,
				writeAssociated = me.getWriteAssociated(),
				data = me.callParent(arguments),
				assoObj, associatedData;
		
		if (writeAssociated) {
			associatedData = record.getAssociatedData({}, {associated:true, serialize: true});
			Ext.iterate(record.associations, function(key, association) {
				// Depending on the association type, the extracted object can be:
				// - store : for 1-n relations (defined by hasMany) - assoObj.isStore
				// - model : for 1-1 relation (defined by hasOne) - assoObj.isModel
				assoObj = record[association.getterName]();
				data[association.role] = associatedData[association.role];
			});
		}
		return data;
	}
	
	/*
	__getRecordData: function(record, operation) {
		var me = this,
				writeAssociated = me.getWriteAssociated(),
				writeChanges = me.getWriteChanges(),
				data = me.callParent(arguments),
				changes, assoObj, model, modelCN, associatedData, associatedData2;
		
		if (writeAssociated) {
			if (record.session && writeChanges) changes = record.session.getChanges();
			associatedData = record.getAssociatedData();
			associatedData2 = record.getAssociatedData({}, {associated:true, serialize: true});
			Ext.iterate(record.associations, function(key, association) {
				// Depending on the association type, the extracted object can be:
				// - store : for 1-n relations (defined by hasMany)
				// - model : for 1-1 relation (defined by hasOne)
				assoObj = record[association.getterName]();
				if (assoObj.isStore) {
					model = assoObj.getModel();
					modelCN = Ext.getClassName(model);
					if (changes && changes[modelCN]) {
						data[association.role] = me.extractAssociatedData(assoObj, model.getFieldsMap(), changes[modelCN]);
					} else {
						data[association.role] = me.extractAssociatedData(assoObj, model.getFieldsMap(), associatedData[association.role]);
					}
					
				} else if (assoObj.isModel) {
					modelCN = Ext.getClassName(assoObj);
					if (changes && changes[modelCN]) {
						data[association.role] = changes[modelCN];
					} else {
						data[association.role] = associatedData2[association.role];
					}
				}
			});
		}
		return data;
	},
	
	privates: {		
		extractAssociatedData: function(store, fieldsMap, arrData) {
			var me = this,
					dateFormat = me.getDateFormat(),
					ret = arrData,
					record, field, key, value, i;

			for (i=0; i<arrData.length; i++) {
				record = store.getAt(i);
				for (key in arrData[i]) {
					value = arrData[i][key];
					if ((field = fieldsMap[key])) {
						// Allow this Writer to take over formatting date values if it has a
						// dateFormat specified. Only check isDate on fields declared as dates
						// for efficiency.
						if (field.isDateField && dateFormat && Ext.isDate(value)) {
							value = Ext.Date.format(value, dateFormat);
						} else if (field.serialize) {
							value = field.serialize(value, record);
						}
					}
					ret[i][key] = value;
				}
			}
			return ret;
		}
	}
	*/
});
