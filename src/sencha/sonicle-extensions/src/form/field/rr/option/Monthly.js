/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Monthly', {
	extend: 'Sonicle.form.field.rr.option.Abstract',
	alias: 'widget.sorrmonthly',
	
	viewModel: {
		data: {
			opt1: null,
			opt1ByMonthDay: null,
			opt1Interval: null,
			opt2: null,
			opt2ByPos: null,
			opt2ByWeekDay: null,
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
				margin: '0 5 0 0',
				flex: 1
			},
			items: [{
				xtype: 'radiofield',
				itemId: 'opt1',
				name: me.id + '-monthlytype',
				bind: '{opt1}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'label',
				text: me.onTheText
			}, {
				xtype: 'numberfield',
				itemId: 'opt1-bymonthday',
				bind: '{opt1ByMonthDay}',
				minValue: 1,
				maxValue: 31,
				allowDecimals: false,
				allowBlank: false,
				listeners: {
					change: me.fieldOnChange,
					scope: me
				},
				width: 60
			}, {
				xtype: 'label',
				text: me.thDayText + ', ' + me.ofEveryText
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
				text: me.monthText
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
				name: me.id + '-monthlytype',
				bind: '{opt2}',
				listeners: {
					change: me.optionSelectorOnChange,
					scope: me
				}
			}, {
				xtype: 'label',
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
				text: me.monthText
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
		if (rrCfg.freq !== RRule.MONTHLY) return false;
		if (!me.isOpt1(rrCfg) && !me.isOpt2(rrCfg)) return false;
		if (me.isOpt1(rrCfg)) {
			if (me.asArray(rrCfg.bymonthday).length !== 1) return false;
		} else if (me.isOpt2(rrCfg)) {
			if (me.asArray(rrCfg.bysetpos).length !== 1) return false;
			if (me.asArray(rrCfg.byweekday).length !== 1) return false;
		}
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
			data.opt1ByMonthDay = me.asArray(rrCfg.bymonthday)[0];
			if (rrCfg.interval) data.opt1Interval = rrCfg.interval;
			
		} else if (me.isOpt2(rrCfg)) {
			data.opt2 = true;
			data.opt2ByPos = me.asArray(rrCfg.bysetpos)[0];
			data.opt2ByWeekDay = me.byWeekdayToJsWeekday(me.asArray(rrCfg.byweekday))[0];
			if (rrCfg.interval) data.opt2Interval = rrCfg.interval;
		}
		
		me.getViewModel().set(data);
	},
	
	getRRuleConfig: function() {
		var me = this,
				data = me.getVMData();
		
		if (data.opt1 === true) {
			return {
				freq: RRule.MONTHLY,
				bymonthday: [data.opt1ByMonthDay],
				interval: data.opt1Interval
			};
		} else if (data.opt2 === true) {
			return {
				freq: RRule.MONTHLY,
				bysetpos: [data.opt2ByPos],
				byweekday: me.jsWeekdayToByWeekday(me.asArray(data.opt2ByWeekDay)),
				interval: data.opt2Interval
			};
		} else {
			return {};
		}
	},
	
	isOpt1: function(rrCfg) {
		return Ext.isDefined(rrCfg.bymonthday);
	},
	
	isOpt2: function(rrCfg) {
		return Ext.isDefined(rrCfg.bysetpos) && Ext.isDefined(rrCfg.byweekday);
	},
	
	calculateVMDataDefaults: function() {
		var stDt = this.startDate, nth;
		if (Ext.isDate(stDt)) {
			var nth = Sonicle.Date.getNthWeekDayOfMonth(stDt);
			return {
				opt1ByMonthDay: stDt.getDate(),
				opt2ByPos: (nth > 4) ? -1 : nth,
				opt2ByWeekDay: stDt.getDay()
			};
		} else {
			return {};
		}
	},
	
	returnVMDataDefaults: function() {
		return {
			opt1: true,
			opt1ByMonthDay: 1,
			opt1Interval: 1,
			opt2: false,
			opt2ByPos: 1,
			opt2ByWeekDay: 1,
			opt2Interval: 1
		};
	}
});
