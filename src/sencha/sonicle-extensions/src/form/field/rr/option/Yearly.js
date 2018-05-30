/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Yearly', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorryearly',
	
	viewModel: {
		formulas: {
			foOpt1ByMonthDayMaxValue: function(get) {
				return Sonicle.Date.getDaysInMonth(parseInt(get('opt1ByMonth')) || 31);
			},
			foOpt1ByMonthDay: {
				get: function(get) {
					var max = get('foOpt1ByMonthDayMaxValue'),
							val = get('opt1ByMonthDay');
					return val > max ? max : val;
				},
				set: function(val) {
					this.set('opt1ByMonthDay', val);
				}
			}
		},
		data: {
			opt1: null,
			opt1ByMonth: null,
			opt1ByMonthDay: null,
			opt1Interval: null,
			opt2: null,
			opt2ByPos: null,
			opt2ByWeekDay: null,
			opt2ByMonth: null,
			opt2Interval: null
		}
	},
	
	initComponent: function() {
		var me = this,
				SoDate = Sonicle.Date;
		me.callParent(arguments);
		me.add([{
			xtype: 'fieldcontainer',
			layout: 'hbox',
			defaults: {
				style: {marginRight: '5px'},
				flex: 1
			},
			items: [{
				xtype: 'radiofield',
				itemId: 'opt1',
				name: me.id + '-yearlytype',
				bind: '{opt1}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.onDayText
			}, {
				xtype: 'combo',
				itemId: 'opt1-bymonth',
				bind: '{opt1ByMonth}',
				editable: false,
				typeAhead: false,
				forceSelection: true,
				triggerAction: 'all',
				store: {
					type: 'array',
					autoLoad: true,
					fields: [
						{name: 'id', type: 'int'},
						{name: 'desc', type: 'string'}
					],
					data: [
						[1, SoDate.getMonthName(0, true)],
						[2, SoDate.getMonthName(1, true)],
						[3, SoDate.getMonthName(2, true)],
						[4, SoDate.getMonthName(3, true)],
						[5, SoDate.getMonthName(4, true)],
						[6, SoDate.getMonthName(5, true)],
						[7, SoDate.getMonthName(6, true)],
						[8, SoDate.getMonthName(7, true)],
						[9, SoDate.getMonthName(8, true)],
						[10, SoDate.getMonthName(9, true)],
						[11, SoDate.getMonthName(10, true)],
						[12, SoDate.getMonthName(11, true)]
					]
				},
				allowBlank: false,
				valueField: 'id',
				displayField: 'desc',
				listeners: {
					select: me.fieldOnChange,
					scope: me
				},
				width: 120
			}, {
				xtype: 'numberfield',
				itemId: 'opt1-bymonthday',
				bind: {
					value: '{foOpt1ByMonthDay}',
					maxValue: '{foOpt1ByMonthDayMaxValue}'
				},
				minValue: 1,
				allowBlank: false,
				listeners: {
					change: me.fieldOnChange,
					scope: me
				},
				width: 60
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.ofEveryText
			}, {
				xtype: 'numberfield',
				itemId: 'opt1-interval',
				bind: '{opt1Interval}',
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
				text: me.yearText
			}]
		}, {
			xtype: 'fieldcontainer',
			layout: 'hbox',
			defaults: {
				style: {marginRight: '5px'},
				flex: 1
			},
			items: [{
				xtype: 'radiofield',
				itemId: 'opt2',
				name: me.id + '-yearlytype',
				bind: '{opt2}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.onTheText
			}, {
				xtype: 'combo',
				itemId: 'opt2-bypos',
				bind: '{opt2ByPos}',
				editable: false,
				typeAhead: false,
				forceSelection: true,
				triggerAction: 'all',
				store: {
					type: 'array',
					autoLoad: true,
					fields: [
						{name: 'id', type: 'int'},
						{name: 'desc', type: 'string'}
					],
					data: [
						[1, me.ordinalsTexts['1']],
						[2, me.ordinalsTexts['2']],
						[3, me.ordinalsTexts['3']],
						[4, me.ordinalsTexts['4']],
						[-2, me.ordinalsTexts['-2']],
						[-1, me.ordinalsTexts['-1']]
					]
				},
				allowBlank: false,
				valueField: 'id',
				displayField: 'desc',
				listeners: {
					select: me.fieldOnChange,
					scope: me
				},
				width: 120
			}, {
				xtype: 'combo',
				itemId: 'opt2-byweekday',
				bind: '{opt2ByWeekDay}',
				editable: false,
				typeAhead: false,
				forceSelection: true,
				triggerAction: 'all',
				store: {
					type: 'array',
					autoLoad: true,
					fields: [
						{name: 'id', type: 'int'},
						{name: 'desc', type: 'string'}
					],
					data: [
						[-1, me.byDayText],
						[-2, me.byWeekdayText],
						[-3, me.byWeText],
						[1, SoDate.getDayName(1, true)],
						[2, SoDate.getDayName(2, true)],
						[3, SoDate.getDayName(3, true)],
						[4, SoDate.getDayName(4, true)],
						[5, SoDate.getDayName(5, true)],
						[6, SoDate.getDayName(6, true)],
						[0, SoDate.getDayName(0, true)]
					]
				},
				allowBlank: false,
				valueField: 'id',
				displayField: 'desc',
				listeners: {
					select: me.fieldOnChange,
					scope: me
				},
				width: 100
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.ofText
			}, {
				xtype: 'combo',
				itemId: 'opt2-bymonth',
				bind: '{opt2ByMonth}',
				editable: false,
				typeAhead: false,
				forceSelection: true,
				triggerAction: 'all',
				store: {
					type: 'array',
					autoLoad: true,
					fields: [
						{name: 'id', type: 'int'},
						{name: 'desc', type: 'string'}
					],
					data: [
						[1, SoDate.getMonthName(0, true)],
						[2, SoDate.getMonthName(1, true)],
						[3, SoDate.getMonthName(2, true)],
						[4, SoDate.getMonthName(3, true)],
						[5, SoDate.getMonthName(4, true)],
						[6, SoDate.getMonthName(5, true)],
						[7, SoDate.getMonthName(6, true)],
						[8, SoDate.getMonthName(7, true)],
						[9, SoDate.getMonthName(8, true)],
						[10, SoDate.getMonthName(9, true)],
						[11, SoDate.getMonthName(10, true)],
						[12, SoDate.getMonthName(11, true)]
					]
				},
				allowBlank: false,
				valueField: 'id',
				displayField: 'desc',
				listeners: {
					select: me.fieldOnChange,
					scope: me
				},
				width: 120
			}, {
				xtype: 'label',
				cls: 'x-form-cb-label-default',
				text: me.ofEveryText
			}, {
				xtype: 'numberfield',
				itemId: 'opt2-interval',
				bind: '{opt2Interval}',
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
				text: me.yearText
			}]
		}]);
	},
	
	fieldOnChange: function(s, nv, ov) {
		var me = this, vm = me.getViewModel();
		if (me.suspendOnChange === 0) {
			vm.set('opt1', false);
			vm.set('opt2', false);
			vm.set(s.getItemId().split('-')[0], true);
		}
		me.callParent(arguments);
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
		if (rrCfg.freq !== RRule.YEARLY) return false;
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
			data.opt1ByMonth = me.asArray(rrCfg.bymonth)[0];
			data.opt1ByMonthDay = me.asArray(rrCfg.bymonthday)[0];
			if (rrCfg.interval) data.opt1Interval = rrCfg.interval;
			
		} else if (me.isOpt2(rrCfg)) {
			data.opt2 = true;
			data.opt2ByPos = me.asArray(rrCfg.bysetpos)[0];
			if (me.asArray(rrCfg.bymonthday).length === 4) {
				data.opt2ByWeekDay = -1;
			} else if (me.asArray(rrCfg.bymonthday).length === 5) {
				data.opt2ByWeekDay = -1;
			} else if (me.asArray(rrCfg.byweekday).length === 2) {
				data.opt2ByWeekDay = -3;
			} else {
				data.opt2ByWeekDay = me.byWeekdayToJsWeekday(me.asArray(rrCfg.byweekday))[0];
			}
			data.opt2ByMonth = me.asArray(rrCfg.bymonth)[0];
			if (rrCfg.interval) data.opt2Interval = rrCfg.interval;
		}
		
		me.getViewModel().set(data);
	},
	
	getRRuleConfig: function() {
		var me = this,
				data = me.getVMData();
		
		if (data.opt1 === true) {
			return {
				freq: RRule.YEARLY,
				bymonth: [data.opt1ByMonth],
				bymonthday: [data.opt1ByMonthDay],
				interval: data.opt1Interval
			};
		} else if (data.opt2 === true) {
			if (data.opt2ByWeekDay === -3) {
				return {
					freq: RRule.YEARLY,
					bysetpos: [data.opt2ByPos],
					byweekday: [RRule.SA, RRule.SU],
					bymonth: [data.opt2ByMonth],
					interval: data.opt2Interval
				};
				
			} else if (data.opt2ByWeekDay === -2) {
				return {
					freq: RRule.YEARLY,
					bysetpos: [data.opt2ByPos],
					byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
					bymonth: [data.opt2ByMonth],
					interval: data.opt2Interval
				};
				
			} else if ((data.opt2ByWeekDay === -1 && (data.opt2ByPos === -1))) {
				return {
					freq: RRule.YEARLY,
					bysetpos: [-1],
					bymonthday: [28, 29, 30, 31],
					bymonth: [data.opt2ByMonth],
					interval: data.opt2Interval
				};
				
			} else if ((data.opt2ByWeekDay === -1 && (data.opt2ByPos === -2))) {
				return {
					freq: RRule.YEARLY,
					bysetpos: [-2],
					bymonthday: [27, 28, 29, 30, 31],
					bymonth: [data.opt2ByMonth],
					interval: data.opt2Interval
				};
				
			} else if (data.opt2ByWeekDay === -1) {
				return {
					freq: RRule.YEARLY,
					bymonthday: data.opt2ByPos,
					bymonth: [data.opt2ByMonth],
					interval: data.opt2Interval
				};
				
			} else {
				return {
					freq: RRule.YEARLY,
					bysetpos: [data.opt2ByPos],
					byweekday: me.jsWeekdayToByWeekday(me.asArray(data.opt2ByWeekDay)),
					bymonth: [data.opt2ByMonth],
					interval: data.opt2Interval
				};
			}
		} else {
			return {};
		}
	},
	
	isOpt1: function(rrCfg) {
		var me = this;
		if (Ext.isDefined(rrCfg.bymonth) && Ext.isDefined(rrCfg.bymonthday)) {
			if ((me.asArray(rrCfg.bymonth).length === 1)
					&& (me.asArray(rrCfg.bymonthday).length === 1)) return true;
		}
		return false;
	},
	
	isOpt2: function(rrCfg) {
		var me = this;
		if (Ext.isDefined(rrCfg.bysetpos) && Ext.isDefined(rrCfg.bymonthday) && Ext.isDefined(rrCfg.bymonth)) {
			var bsps = me.asArray(rrCfg.bysetpos);
			var bmds = me.asArray(rrCfg.bymonthday);
			if ((bsps.length === 1)
					&& (bsps[0] === -1)
					&& (bmds.length === 4)
					&& (Ext.Array.difference(bmds, [28, 29, 30, 31]).length === 0)
					&& (me.asArray(rrCfg.bymonth).length === 1)) return true; // last day of...
			if ((bsps.length === 1)
					&& (bsps[0] === -2)
					&& (bmds.length === 5)
					&& (Ext.Array.difference(bmds, [27, 28, 29, 30, 31]).length === 0)
					&& (me.asArray(rrCfg.bymonth).length === 1)) return true; // last-1 day of...
		}
		if (Ext.isDefined(rrCfg.bysetpos) && Ext.isDefined(rrCfg.byweekday) && Ext.isDefined(rrCfg.bymonth)) {
			var bsps = me.asArray(rrCfg.bysetpos);
			var bwds = me.asArray(rrCfg.byweekday);
			if ((bsps.length === 1)
					&& (bwds.length === 2)
					&& (Ext.Array.difference(bwds, [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR]).length === 0)
					&& (me.asArray(rrCfg.bymonth).length === 1)) return true; // weekday of...
			if ((bsps.length === 1)
					&& (bwds.length === 2)
					&& (Ext.Array.difference(bwds, [RRule.SA, RRule.SU]).length === 0)
					&& (me.asArray(rrCfg.bymonth).length === 1)) return true; // weekend of...
			if ((bsps.length === 1)
					&& (bwds.length === 1)
					&& (me.asArray(rrCfg.bymonth).length === 1)) return true; // dayX of...
			
		}
		return false;
	},
	
	calculateVMDataDefaults: function() {
		var stDt = this.startDate, nth;
		if (Ext.isDate(stDt)) {
			var nth = Sonicle.Date.getNthWeekDayOfMonth(stDt);
			return {
				opt1ByMonth: stDt.getMonth()+1,
				opt1ByMonthDay: stDt.getDate(),
				opt2ByPos: (nth > 4) ? -1 : nth,
				opt2ByWeekDay: stDt.getDay(),
				opt2ByMonth: stDt.getMonth()+1
			};
		} else {
			return {};
		}
	},
	
	returnVMDataDefaults: function() {
		return {
			opt1: true,
			opt1ByMonth: 1,
			opt1ByMonthDay: 1,
			opt1Interval: 1,
			opt2: false,
			opt2ByPos: 1,
			opt2ByWeekDay: 1,
			opt2ByMonth: 1,
			opt2Interval: 1
		};
	}
});
