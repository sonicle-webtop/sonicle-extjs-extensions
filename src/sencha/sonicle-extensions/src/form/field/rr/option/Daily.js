/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Daily', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorrdaily',
	
	viewModel: {
		data: {
			data: {
				opt1: null,
				opt1Interval: null,
				opt2: null
			}
		}
	},
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		
		Sonicle.VMUtils.applyFormulas(me.getViewModel(), {
			foOpt1Interval: me.bindFormulaOptField('data', 'opt1Interval', 'opt1', ['opt2'])
		});
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.add([{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			defaults: {
				style: {marginRight: '5px'},
				flex: 1
			},
			items: [
				{
					xtype: 'radiofield',
					itemId: 'opt1',
					name: me.id + '-dailytype',
					bind: '{data.opt1}'
				}, {
					xtype: 'label',
					cls: 'x-form-cb-label-default',
					text: me.onEveryText
				}, {
					xtype: 'numberfield',
					itemId: 'opt1-interval',
					bind: '{foOpt1Interval}',
					minValue: 1,
					maxValue: 999,
					allowDecimals: false,
					allowBlank: false,
					width: 80
				}, {
					xtype: 'label',
					cls: 'x-form-cb-label-default',
					text: me.dayText
				}
			]
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			defaults: {
				style: {marginRight: '5px'},
				flex: 1
			},
			items: [
				{
					xtype: 'radiofield',
					itemId: 'opt2',
					name: me.id + '-dailytype',
					bind: '{data.opt2}'
				}, {
					xtype: 'label',
					cls: 'x-form-cb-label-default',
					text: me.onEveryWeekdayText
				}
			]
		}]);
		
		me.getViewModel().bind('{data}', me.onBindFieldsChanged, me, {deep: true});
	},
	
	getRRuleConfig: function() {
		var me = this,
			data = me.getVMData();
		
		if (data.opt1 === true) {
			return {
				freq: RRule.DAILY,
				interval: data.opt1Interval
			};
		} else if (data.opt2 === true) {
			return {
				freq: RRule.DAILY,
				byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]
			};
		} else {
			return {};
		}
	},
	
	privates: {
		validateRRule: function(rr) {
			var me = this,
				rrCfg = rr.origOptions;
			if (rrCfg.freq !== RRule.DAILY) return false;
			if (!me.isOpt1(rrCfg) && !me.isOpt2(rrCfg)) return false;
			return true;
		},
		
		applyRRule: function(rr) {
			var me = this,
				rrCfg = rr.origOptions,
				data = Ext.apply(me.getVMData(), {
					opt1: false,
					opt2: false
				});

			if (me.isOpt1(rrCfg)) {
				data.opt1 = true;
				if (rrCfg.interval) data.opt1Interval = rrCfg.interval;

			} else if (me.isOpt2(rrCfg)) {
				data.opt2 = true;
			}

			me.getViewModel().set('data', data);
		},
		
		returnVMDataDefaults: function() {
			return {
				opt1: true,
				opt1Interval: 1,
				opt2: false
			};
		},
		
		isOpt1: function(rrCfg) {
			return !Ext.isDefined(rrCfg.byweekday);
		},

		isOpt2: function(rrCfg) {
			return Ext.isDefined(rrCfg.byweekday)
				&& (rrCfg.byweekday.indexOf(RRule.MO) !== -1)
				&& (rrCfg.byweekday.indexOf(RRule.TU) !== -1)
				&& (rrCfg.byweekday.indexOf(RRule.WE) !== -1)
				&& (rrCfg.byweekday.indexOf(RRule.TH) !== -1)
				&& (rrCfg.byweekday.indexOf(RRule.FR) !== -1)
				&& (rrCfg.byweekday.indexOf(RRule.SA) === -1)
				&& (rrCfg.byweekday.indexOf(RRule.SU) === -1)
				&& (!Ext.isDefined(rrCfg.interval) || (Ext.isDefined(rrCfg.interval) && (rrCfg.interval === 1)));
		}
	}
});
