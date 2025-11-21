/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Duration', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorrduration',
	
	minHeight: null,
	
	viewModel: {
		data: {
			data: {
				opt1: null,
				opt2: null,
				opt2Count: null,
				opt3: null,
				opt3Until: null
			}
		}
	},
	
	layout: 'hbox',
	defaults: {
		style: {marginRight: '5px'}
	},
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		
		Sonicle.VMUtils.applyFormulas(me.getViewModel(), {
			foOpt2Count: me.bindFormulaOptField('data', 'opt2Count', 'opt2', ['opt1', 'opt3']),
			foOpt3Until: me.bindFormulaOptField('data', 'opt3Until', 'opt3', ['opt1', 'opt2'])
		});
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.add([{
			xtype: 'radiofield',
				name: me.id + '-endmode',
				bind: '{data.opt1}',
				boxLabel: me.endsNeverText,
				width: 70
			}, {
				xtype: 'radiofield',
				name: me.id + '-endmode',
				bind: '{data.opt2}',
				boxLabel: me.endsAfterText
			}, {
				xtype: 'numberfield',
				bind: '{foOpt2Count}',
				minValue: 1,
				maxValue: 99,
				allowDecimals: false,
				allowBlank: false,
				width: 80
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.occurrenceText,
				width: 100
			}, {
				xtype: 'radiofield',
				name: me.id + '-endmode',
				bind: '{data.opt3}',
				boxLabel: me.endsByText
			}, {
				xtype: 'datefield',
				bind: '{foOpt3Until}',
				startDay: me.startDay,
				format: me.dateFormat,
				allowBlank: false,
				width: 120
		}]);
		
		me.getViewModel().bind('{data}', me.onBindFieldsChanged, me, {deep: true});
	},
	
	getRRuleConfig: function() {
		var me = this,
			data = me.getVMData();
		
		if (data.opt1 === true) {
			return {};
		} else if (data.opt2 === true) {
			return {
				count: data.opt2Count
			};
		} else if (data.opt3 === true) {
			var until = data.opt3Until;
			return {
				until: Ext.Date.utc(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate(), until.getUTCHours(), until.getUTCMinutes(), until.getUTCSeconds())
			};
		} else {
			return {};
		}
	},
	
	privates: {
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
				data.opt2Count = rrCfg.count;
			} else if (me.isOpt3(rrCfg)) {
				data.opt3 = true;
				data.opt3Until = rrCfg.until;
				//data.opt3Until = Ext.Date.utcToLocal(rrCfg.until);
			} else {
				data.opt1 = true;
			}

			me.getViewModel().set('data', data);
		},
		
		returnVMDataStartDependantDefaults: function() {
			var start = this.getStartDate();
			if (Ext.isDate(start)) {
				return {
					opt3Until: start
				};
			} else {
				return {};
			}
		},

		returnVMDataDefaults: function() {
			return {
				opt1: true,
				opt2: false,
				opt2Count: 1,
				opt3: false,
				opt3Until: new Date()
			};
		},
		
		isOpt2: function(rrCfg) {
			return Ext.isDefined(rrCfg.count);
		},

		isOpt3: function(rrCfg) {
			return Ext.isDefined(rrCfg.until);
		}
	}
});
