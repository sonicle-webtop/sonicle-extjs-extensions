/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.Repeat', {
	extend: 'Ext.form.FieldContainer',
	alias: 'widget.sorrrepeatfield',
	requires: [
		'Sonicle.Date',
		'Sonicle.form.field.ComboBox',
		'Sonicle.form.field.rr.Recurrence'
	],
	mixins: {
        field: 'Ext.form.field.Field'
    },
	
	/**
	 * @cfg {Date} [defaultStartDate]
	 * The default start-date when defining new rule.
	 * If not defined, current date will be used instead.
	 */
	defaultStartDate: undefined,
	
	layout: 'fit',
	defaultBindProperty: 'value',
	
	recurrenceIconCls: 'fas fa-repeat',
	
	noneText: 'Does not repeat',
	dailyText: 'Daily',
	weeklyText: 'Weekly',
	monthlyText: 'Monthly',
	yearlyText: 'Yearly',
	advancedText: 'Advanced',
	
	/**
	 * @private
	 */
	parsed: null,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.isAvailRRule = Ext.isDefined(window['RRule']);
		me.checkAvail();
	},
	
	initComponent: function() {
		var me = this;
		me.items = [
			{
				xtype: 'socombo',
				typeAhead: true,
				queryMode: 'local',
				forceSelection: true,
				checkedSelection: true,
				selectOnFocus: true,
				triggerAction: 'all',
				store: {
					type: 'array',
					autoLoad: true,
					fields: [
						{name: 'id', type: 'string'},
						{name: 'desc', type: 'string'}
					],
					data: [
						['none', me.noneText],
						['daily', me.dailyText],
						['weekly', me.weeklyText],
						['monthly', me.monthlyText],
						['yearly', me.yearlyText],
						['advanced', me.advancedText]
					]
				},
				valueField: 'id',
				displayField: 'desc',
				submitEmptyText: false,
				staticIconCls: me.recurrenceIconCls,
				listeners: {
					select: function(s, rec) {
						me.onRepeatSelect(rec.get('id'));
					},
					scope: me
				},
				value: 'none'
			}
		];
		me.callParent(arguments);
		me.initField();
	},
	
	getDefaultStartDate: function() {
		var deflt = this.defaultStartDate;
		return Ext.isDate(deflt) ? deflt : new Date();
	},
	
	setDefaultStartDate: function(date) {
		this.defaultStartDate = date;
	},
	
	setValue: function(value) {
		var me = this, parsed;
		me.parsed = parsed = me.parseRRule(value);
		me.getComponent(0).setValue(parsed.repeat);
		me.mixins.field.setValue.call(me, parsed.rrule ? value : null);
		return me;
	},
	
	getStartDate: function() {
		var me = this,
			parsed = me.parsed;
		return parsed && parsed.rrule ? parsed.rrule.options.dtstart : me.getDefaultStartDate();
	},
	
	privates: {
		checkAvail: function() {
			if (!this.isAvailRRule) Ext.raise('Library RRule is required (see https://github.com/jakubroztocil/rrule)');
		},
		
		onRepeatSelect: function(repeat) {
			var me = this;
			me.setValue(me.toValue(repeat, me.getStartDate()));
			me.fireEvent('select', me, repeat);
		},
		
		toValue: function(repeat, start) {
			return (repeat === 'none') ? null : new RRule(this.buildRRuleCfg(repeat, start)).toString();
		},
		
		parseRRule: function(s) {
			var repeat = 'none',
				SoRR = Sonicle.form.field.rr.Recurrence,
				rr = SoRR.parseRRuleString(s),
				rrOpts, origOpts, dtstart, commonRepeat;

			if (rr) {
				rrOpts = rr.options;
				origOpts = rr.origOptions;
				dtstart = rrOpts.dtstart;
				if (rrOpts.freq === RRule.DAILY) { //FREQ=DAILY;INTERVAL=1
					if (rrOpts.count === null
						&& rrOpts.until === null
						&& rrOpts.interval === 1
						&& rrOpts.byweekday === null
						) commonRepeat = 'daily';
				} else if (rrOpts.freq === RRule.WEEKLY) { //FREQ=WEEKLY;BYDAY=WE;INTERVAL=1
					if (rrOpts.count === null
						&& rrOpts.until === null
						&& rrOpts.interval === 1
						&& Ext.Array.toValue(rrOpts.byweekday) === SoRR.jsWeekdayToByWeekday(dtstart.getDay()).weekday
						//&& (Ext.isArray(rrOpts.byweekday) && rrOpts.byweekday.length === 1 && rrOpts.byweekday[0] === SoRR.jsWeekdayToRRuleWeekday(start.getDay()).weekday)
						) commonRepeat = 'weekly';
				} else if (rrOpts.freq === RRule.WEEKLY) { //FREQ=MONTHLY;BYMONTHDAY=20;INTERVAL=1
					if (rrOpts.count === null
						&& rrOpts.until === null
						&& rrOpts.interval === 1
						&& Ext.Array.toValue(rrOpts.bymonthday) === dtstart.getDate()
						) commonRepeat = 'monthly';
				} else if (rrOpts.freq === RRule.YEARLY) { //FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=20;INTERVAL=1
					if (rrOpts.count === null
						&& rrOpts.until === null
						&& rrOpts.interval === 1
						&& Ext.Array.toValue(rrOpts.bymonth) === (dtstart.getMonth()+1)
						&& Ext.Array.toValue(rrOpts.bymonthday) === dtstart.getDate()
						) commonRepeat = 'yearly';
				}
				repeat = (commonRepeat) ? commonRepeat : 'advanced';
			}
			return { repeat: repeat, rrule: rr };
		},
		
		buildRRuleCfg: function(repeat, start) {
			start = Sonicle.Date.idate(start);
			var SoRR = Sonicle.form.field.rr.Recurrence, cfg;
			if ('daily' === repeat) { //FREQ=DAILY;INTERVAL=1
				cfg = {
					dtstart: start,
					freq: RRule.DAILY,
					interval: 1
				};
			} else if ('weekly' === repeat) { //FREQ=WEEKLY;BYDAY=WE;INTERVAL=1
				cfg = {
					dtstart: start,
					freq: RRule.WEEKLY,
					interval: 1,
					byweekday: SoRR.jsWeekdayToByWeekday([start.getDay()])
				};
			} else if ('monthly' === repeat) { //FREQ=MONTHLY;BYMONTHDAY=20;INTERVAL=1
				cfg = {
					dtstart: start,
					freq: RRule.MONTHLY,
					interval: 1,
					bymonthday: [start.getDate()]
				};
			} else if ('yearly' === repeat) { //FREQ=YEARLY;BYMONTH=3;BYMONTHDAY=20;INTERVAL=1
				cfg = {
					dtstart: start,
					freq: RRule.YEARLY,
					interval: 1,
					bymonth: [start.getMonth()+1],
					bymonthday: [start.getDate()]
				};
			} else if ('advanced' === repeat) { //FREQ=WEEKLY;BYDAY=WE;INTERVAL=1;UNTIL=20240920T063039Z
				cfg = {
					dtstart: start,
					freq: RRule.WEEKLY,
					interval: 1,
					byweekday: SoRR.jsWeekdayToByWeekday([start.getDay()]),
					until: Sonicle.Date.add(start, {months: 6})
				};
			}
			return cfg;
		}
	}
});