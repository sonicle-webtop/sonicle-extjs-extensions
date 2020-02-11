/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.grid.property.Property', {
	extend: 'Ext.grid.property.Grid',
	alias: 'widget.sopropertygrid',
	
	/**
	 * @cfg {Boolean} insertMissingProps
	 */
	insertMissingProps: true,
	
	/**
	 * @cfg {Boolean} removeUnconfiguredProps
	 */
	removeUnconfiguredProps: true,
	
	//https://www.sencha.com/forum/showthread.php?293947-How-do-I-control-the-store-type-for-an-association-store
	
	setSource: function(source, sourceConfig) {
		var me = this,
				sourceCfg = sourceConfig || me.sourceConfig,
				newSource;
		
		console.log('setSource');
		if ((me.insertMissingProps || me.removeUnconfiguredProps) && source && sourceCfg !== undefined) {
			newSource = {};
			Ext.iterate(source, function(name, value) {
				if (!me.removeUnconfiguredProps || Ext.isDefined(sourceCfg[name])) {
					newSource[name] = value;
				}
			});
			if (me.insertMissingProps) {
				console.log('insertMissingProps');
				Ext.iterate(sourceCfg, function(name, obj) {
					if (!Ext.isDefined(newSource[name])) {
						newSource[name] = obj.defaultValue;
					}
				});
			}
			me.callParent([newSource, sourceConfig]);
			
		} else {
			me.callParent(arguments);
		}
	},
	
	
	
	
	setSource2: function(source, sourceConfig) {
		var me = this,
				sourceCfg = sourceConfig || me.sourceConfig;
		
		console.log('setSource');
		if ((me.insertMissingProps || me.removeUnconfiguredProps) && source && sourceCfg !== undefined) {
			if (me.insertMissingProps) {
				console.log('insertMissingProps');
				Ext.iterate(sourceCfg, function(name, obj) {
					if (!Ext.isDefined(source[name])) {
						source[name] = obj.defaultValue;
					}
				});
			}
			if (me.removeUnconfiguredProps) {
				console.log('removeUnconfiguredProps');
				var arr = Ext.Array.difference(Ext.Object.getAllKeys(source), Ext.Object.getAllKeys(sourceCfg)), i;
				for (i=0; i<arr.length; i++) {
					delete source[arr[i]];
				}
			}
		}
		me.callParent(arguments);
	},
	
	setSourceConfig: function(sourceConfig) {
		var me = this;
		if (sourceConfig !== undefined) {
			me.sourceConfig = Ext.apply({}, sourceConfig);
			me.configure(me.sourceConfig);
		}
	}
});
