/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Weekly', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorrweekly',
	
	viewModel: {
		data: {
			data: {
				opt1: null,
				opt1Interval: null,
				opt1Day0: null,
				opt1Day1: null,
				opt1Day2: null,
				opt1Day3: null,
				opt1Day4: null,
				opt1Day5: null,
				opt1Day6: null
			}	
		}
	},
	
	initComponent: function() {
		var me = this,
			SoD = Sonicle.Date;
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
					name: me.id + '-weeklytype',
					bind: '{data.opt1}',
					listeners: {
						change: me.optionSelectorOnChange,
						scope: me
					}
				}, {
					xtype: 'label',
					cls: 'x-form-cb-label-default',
					text: me.onEveryText
				}, {
					xtype: 'numberfield',
					itemId: 'opt1-interval',
					bind: '{data.opt1Interval}',
					minValue: 1,
					maxValue: 99,
					allowDecimals: false,
					allowBlank: false,
					listeners: {
						change: me.fieldOnChange,
						scope: me
					},
					width: 80
				}, {
					xtype: 'label',
					cls: 'x-form-cb-label-default',
					text: me.weekText
				}
			]
		}, {
			xtype: 'checkboxgroup',
			padding: '0 0 0 50',
			defaults: {
				margin: '0 20 0 0'
			},
			items: [
				{
					itemId: 'opt1-day1',
					bind: '{data.opt1Day1}',
					boxLabel: SoD.getShortDayName(1),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}, {
					itemId: 'opt1-day2',
					bind: '{data.opt1Day2}',
					boxLabel: SoD.getShortDayName(2),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}, {
					itemId: 'opt1-day3',
					bind: '{data.opt1Day3}',
					boxLabel: SoD.getShortDayName(3),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}, {
					itemId: 'opt1-day4',
					bind: '{data.opt1Day4}',
					boxLabel: SoD.getShortDayName(4),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}, {
					itemId: 'opt1-day5',
					bind: '{data.opt1Day5}',
					boxLabel: SoD.getShortDayName(5),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}, {
					itemId: 'opt1-day6',
					bind: '{data.opt1Day6}',
					boxLabel: SoD.getShortDayName(6),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}, {
					itemId: 'opt1-day0',
					bind: '{data.opt1Day0}',
					boxLabel: SoD.getShortDayName(0),
					listeners: {
						change: me.fieldOnChange,
						scope: me
					}
				}
			]
		}]);
	},
	
	getRRuleConfig: function() {
		var me = this,
			data = me.getVMData(),
			byweekday = [];
		
		if (data.opt1 === true) {
			Ext.iterate([0,1,2,3,4,5,6], function(day) {
				if (data['opt1Day'+day] === true) {
					byweekday.push(Sonicle.form.field.rr.Recurrence.jsWeekdayToRRuleWeekday(day));
				}
			});
			return {
				freq: RRule.WEEKLY,
				byweekday: byweekday,
				interval: data.opt1Interval
			};
		} else {
			return {};
		}
	},
	
	privates: {
		validateRRule: function(rr) {
			var me = this,
				rrCfg = rr.origOptions;
			if (rrCfg.freq !== RRule.WEEKLY) return false;
			if (!me.isOpt1(rrCfg)) return false;
			return true;
		},
		
		applyRRule: function(rr) {
			var me = this,
				rrCfg = rr.origOptions,
				data = Ext.apply(me.getVMData(), {
					opt1: false
				}),
				days;

			if (me.isOpt1(rrCfg)) {
				data.opt1 = true;
				days = Sonicle.form.field.rr.Recurrence.byWeekdayToJsWeekday(me.asArray(rrCfg.byweekday));
				Ext.iterate(days, function(day) {
					data['opt1Day'+day] = true;
				});
				if (rrCfg.interval) data.opt1Interval = rrCfg.interval;	
			}

			me.getViewModel().set('data', data);
		},
		
		returnVMDataDefaults: function() {
			return {
				opt1: true,
				opt1Interval: 1,
				opt1Day0: false,
				opt1Day1: false,
				opt1Day2: false,
				opt1Day3: false,
				opt1Day4: false,
				opt1Day5: false,
				opt1Day6: false
			};
		},
		
		isOpt1: function(rrCfg) {
			if (Ext.isDefined(rrCfg.bymonth)) return false;
			if (Ext.isDefined(rrCfg.bymonthday)) return false;
			if (Ext.isDefined(rrCfg.bysetpos)) return false;
			return true;
		}
	}
});
