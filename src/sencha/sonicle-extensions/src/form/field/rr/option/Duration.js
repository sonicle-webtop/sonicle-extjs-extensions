/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Duration', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorrduration',
	
	minHeight: null,
	
	viewModel: {
		data: {
			opt1: null,
			opt2: null,
			count: null,
			opt3: null,
			until: null
		}
	},
	
	layout: 'hbox',
	defaults: {
		style: {marginRight: '5px'}
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.add([{
			xtype: 'radiofield',
				itemId: 'opt1',
				name: me.id + '-endmode',
				bind: '{opt1}',
				boxLabel: me.endsNeverText,
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				},
				width: 70
			}, {
				xtype: 'radiofield',
				itemId: 'opt2',
				name: me.id + '-endmode',
				bind: '{opt2}',
				boxLabel: me.endsAfterText,
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'numberfield',
				itemId: 'opt2-count',
				bind: '{count}',
				minValue: 1,
				maxValue: 99,
				allowDecimals: false,
				allowBlank: false,
				listeners: {
					change: me.fieldOnChange,
					scope: me
				},
				width: 60
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.occurrenceText,
				width: 100
			}, {
				xtype: 'radiofield',
				itemId: 'opt3',
				name: me.id + '-endmode',
				bind: '{opt3}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				},
				boxLabel: me.endsByText
			}, {
				xtype: 'datefield',
				itemId: 'opt3-until',
				bind: '{until}',
				startDay: me.startDay,
				format: me.dateFormat,
				allowBlank: false,
				listeners: {
					change: me.fieldOnChange,
					scope: me
				},
				width: 120
		}]);
	},
	
	fieldOnChange: function(s, nv, ov) {
		var me = this, vm = me.getViewModel();
		if (me.suspendOnChange === 0) {
			vm.set('opt1', false);
			vm.set('opt2', false);
			vm.set('opt3', false);
			vm.set(s.getItemId().split('-')[0], true);
		}
		me.callParent(arguments);
	},
	
	shouldSkipChange: function(field) {
		var data = this.getViewModel().getData();
		if ((data.opt1 === true) && (field.getItemId().indexOf('opt1-') === -1)) return true;
		if ((data.opt2 === true) && (field.getItemId().indexOf('opt2-') === -1)) return true;
		if ((data.opt3 === true) && (field.getItemId().indexOf('opt3-') === -1)) return true;
		return false;
	},
	
	validateRRule: function(rr) {
		return true;
	},
	
	applyRRule: function(rr) {
		var me = this,
				rrCfg = rr.origOptions,
				data = Ext.apply(me.getVMData(), {
					opt1: false,
					opt2: false,
					opt3: false
				});
		
		if (me.isOpt2(rrCfg)) {
			data.opt2 = true;
			data.count = rrCfg.count;
		} else if (me.isOpt3(rrCfg)) {
			data.opt3 = true;
			data.until = rrCfg.until;
			//data.until = Ext.Date.utcToLocal(rrCfg.until);
		} else {
			data.opt1 = true;
		}
		
		me.getViewModel().set(data);
	},
	
	getRRuleConfig: function() {
		var me = this,
				data = me.getVMData();
		
		if (data.opt1 === true) {
			return {};
		} else if (data.opt2 === true) {
			return {
				count: data.count
			};
		} else if (data.opt3 === true) {
			return {
				until: Ext.Date.utc(data.until.getFullYear(), data.until.getMonth(), data.until.getDate())
			};
		} else {
			return {};
		}
	},
	
	isOpt2: function(rrCfg) {
		return Ext.isDefined(rrCfg.count);
	},
	
	isOpt3: function(rrCfg) {
		return Ext.isDefined(rrCfg.until);
	},
	
	calculateVMDataDefaults: function() {
		var stDt = this.startDate;
		if (Ext.isDate(stDt)) {
			return {
				until: stDt
			};
		} else {
			return {};
		}
	},
	
	returnVMDataDefaults: function() {
		return {
			opt1: true,
			opt2: false,
			count: 1,
			opt3: false,
			until: new Date()
		};
	}
});
