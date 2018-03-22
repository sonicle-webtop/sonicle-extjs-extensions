/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Daily', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorrdaily',
	
	viewModel: {
		data: {
			opt1: null,
			opt1Interval: null,
			opt2: null
		}
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.add([{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			defaults: {
				margin: '0 5 0 0',
				flex: 1
			},
			items: [{
				xtype: 'radiofield',
				itemId: 'opt1',
				name: me.id + '-dailytype',
				bind: '{opt1}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'label',
				text: me.onEveryText
			}, {
				xtype: 'numberfield',
				itemId: 'opt1-interval',
				bind: '{opt1Interval}',
				minValue: 1,
				maxValue: 999,
				allowDecimals: false,
				allowBlank: false,
				listeners: {
					change: me.fieldOnChange,
					scope: me
				},
				width: 60
			}, {
				xtype: 'label',
				text: me.dayText
			}]
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			defaults: {
				margin: '0 5 0 0',
				flex: 1
			},
			items: [{
				xtype: 'radiofield',
				itemId: 'opt2',
				name: me.id + '-dailytype',
				bind: '{opt2}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'label',
				text: me.onEveryWeekdayText
			}]
		}]);
	},
	
	shouldSkipChange: function(field) {
		var data = this.getViewModel().getData();
		if ((data.opt1 === true) && (field.getItemId().indexOf('opt1-') === -1)) return true;
		if ((data.opt2 === true) && (field.getItemId().indexOf('opt2-') === -1)) return true;
		return false;
	},
	
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
		
		me.getViewModel().set(data);
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
	},
	
	returnVMDataDefaults: function() {
		return {
			opt1: true,
			opt1Interval: 1,
			opt2: false
		};
	}
});
