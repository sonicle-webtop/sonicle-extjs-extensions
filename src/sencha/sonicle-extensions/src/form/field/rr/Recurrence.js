/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.Recurrence', {
	extend: 'Ext.form.FieldContainer',
	alias: ['widget.sorrfield', 'widget.sorecurrencefield'],
	requires: [
		'Ext.form.Label',
		'Sonicle.Date',
		'Sonicle.form.field.rr.option.Daily',
		'Sonicle.form.field.rr.option.Weekly',
		'Sonicle.form.field.rr.option.Monthly',
		'Sonicle.form.field.rr.option.Yearly',
		'Sonicle.form.field.rr.option.Duration'
	],
    mixins: {
        field: 'Ext.form.field.Field'
    },
	
	layout: 'anchor',
	defaults: {
		anchor: '100%'
	},
	defaultBindProperty: 'value',
	
	config: {
		startDate: null,
		
		showRawValue: false
	},
	
	/**
	 * @cfg {Number} [startDay=0]
	 * Day index at which the week should begin, 0-based.
	 * Defaults to `0` (Sunday).
	 */
	startDay: 0,
	
	/**
	 * @cfg {String} [dateFormat='m/d/Y']
	 * The default date format string which can be overriden for localization support. 
	 * The format must be valid according to {@link Ext.Date#parse}.
	 */
	dateFormat: 'm/d/Y',
	
	/**
	 * @cfg {Array} [freqOptions]
	 * Frequency options to support in lookup combo.
	 * Each item within the provided array may follow RRule library frequency
	 * constants. Defaults to DAILY, WEEKLY, MONTHLY, YEARLY.
	 */
	freqOptions: [RRule.DAILY, RRule.WEEKLY, RRule.MONTHLY, RRule.YEARLY],
	
	repeatsText: 'Repeats',
	endsText: 'Ends',
	frequencyTexts: {
		'-1': 'Does not repeat',
		'3': 'Daily',
		'2': 'Weekly',
		'1': 'Monthly',
		'0': 'Yearly'
	},
	onEveryText: 'Every',
	onEveryWeekdayText: 'Every week-day',
	onDayText: 'Day',
	onTheText: 'The',
	thDayText: '° day',
	ofText: 'of',
	ofEveryText: 'of every',
	dayText: 'day(s)',
	weekText: 'week(s)',
	monthText: 'month(s)',
	yearText: 'year(s)',
	ordinalsTexts: {
		'1': 'first',
		'2': 'second',
		'3': 'third',
		'4': 'fourth',
		'-2': 'second-last',
		'-1': 'last'
	},
	endsNeverText: 'never',
	endsAfterText: 'after',
	endsByText: 'by',
	occurrenceText: 'occurrence(s)',
	
	/**
	 * @private
	 */
	rrule: null,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.isAvailRRule = Ext.isDefined(window['RRule']);
		me.checkAvail();
	},
	
	initComponent: function() {
		var me = this;
		
		me.items = [{
			xtype: 'container',
			layout: 'form',
			items: [{
				xtype: 'fieldcontainer',
				layout: 'hbox',
				items: [{
					xtype: 'combo',
					itemId: 'freqcbo',
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
						data: me.buildFreqComboData(me.freqOptions)
					},
					valueField: 'id',
					displayField: 'desc',
					listeners: {
						select: function(s, rec) {
							me.onFrequencyChange(rec.get('id'));
						}
					}
				}],
				fieldLabel: me.repeatsText
			}]
		}, {
			xtype: 'container',
			itemId: 'optsct',
			hideMode: 'offsets',
			hidden: true,
			defaults: {
				startDay: me.startDay,
				dateFormat: me.dateFormat,
				startDate: me.getStartDate(),
				listeners: {
					rrulecfgchange: me.onRRuleCfgChange,
					scope: me
				}
			},
			layout: 'card',
			items: [{
				xtype: 'sorrdaily',
				itemId: me.optsCtItemId(RRule.DAILY),
				onEveryText: me.onEveryText,
				onEveryWeekdayText: me.onEveryWeekdayText,
				dayText: me.dayText
			}, {
				xtype: 'sorrweekly',
				itemId: me.optsCtItemId(RRule.WEEKLY),
				onEveryText: me.onEveryText,
				weekText: me.weekText
			}, {
				xtype: 'sorrmonthly',
				itemId: me.optsCtItemId(RRule.MONTHLY),
				onTheText: me.onTheText,
				thDayText: me.thDayText,
				ofEveryText: me.ofEveryText,
				monthText: me.monthText,
				ordinalsTexts: me.ordinalsTexts
			}, {
				xtype: 'sorryearly',
				itemId: me.optsCtItemId(RRule.YEARLY),
				onDayText: me.onDayText,
				onTheText: me.onTheText,
				ofText: me.ofText,
				ofEveryText: me.ofEveryText,
				ordinalsTexts: me.ordinalsTexts,
				yearText: me.yearText
			}]
		}, {
			xtype: 'container',
			itemId: 'durct',
			hideMode: 'offsets',
			hidden: !me.getShowRawValue(),
			defaults: {
				startDay: me.startDay,
				dateFormat: me.dateFormat,
				startDate: me.getStartDate(),
				listeners: {
					rrulecfgchange: me.onRRuleCfgChange,
					scope: me
				}
			},
			items: [{
				xtype: 'sorrduration',
				endsText: me.endsText,
				endsNeverText: me.endsNeverText,
				endsAfterText: me.endsAfterText,
				endsByText: me.endsByText,
				occurrenceText: me.occurrenceText
			}]	
		}, {
			xtype: 'textfield',
			itemId: 'rawfld',
			readOnly: true,
			selectOnFocus: true,
			hideMode: 'offsets',
			hidden: false
		}];
		me.callParent(arguments);
		me.initField();
	},
	
	afterRender: function() {
		var me = this;
		me.callParent();
		me.configureUi(me.rrule ? me.rrule.origOptions.freq : -1 , me.rrule);
	},
	
	setValue: function(value) {
		var me = this, rr;
		
		if (Ext.isEmpty(value)) {
			me.value = null;
			me.rrule = null;
		} else {
			me.value = value;
			rr = me.fromRRuleString(value);
			me.rrule = rr ? rr : null;
		}
		me.configureUi(me.rrule ? me.rrule.origOptions.freq : -1 , me.rrule);
		me.checkChange();
		return me;
	},
	
	updateStartDate: function(newValue, oldValue) {
		var me = this, optsCt, durCt;
		if (me.rendered) {
			optsCt = me.getComponent('optsct');
			optsCt.items.each(function(item) {
				item.setStartDate(newValue);
			});
			durCt = me.getComponent('durct');
			durCt.getComponent(0).setStartDate(newValue);
		}
	},
	
	updateShowRawValue: function(newValue, oldValue) {
		var me = this, rawFld;
		if (me.rendered) {
			rawFld = me.getComponent('rawfld');
			if (newValue === true) {
				rawFld.show();
			} else if (newValue === false) {
				rawFld.hide();
			}
		}
	},
	
	configureUi: function(freq, rrule) {
		var me = this,
				freqCbo = me.getComponent(0).getComponent(0).getComponent('freqcbo'),
				optsCt = me.getComponent('optsct'),
				durCt = me.getComponent('durct'),
				rawFld = me.getComponent('rawfld');
		
		freqCbo.setValue(freq);
		rawFld.setValue(rrule ? rrule.toString() : null);
		if (freq === -1) {
			optsCt.hide();
			durCt.hide();
			rawFld.hide();
		} else {
			optsCt.setActiveItem(me.optsCtItemId(freq));
			if (rrule !== undefined) {
				optsCt.getComponent(me.optsCtItemId(freq)).setRRule(rrule);
				durCt.getComponent(0).setRRule(rrule);
			}
			optsCt.show();
			durCt.show();
			if (me.getShowRawValue() === true) rawFld.show();
		}
	},
	
	onFrequencyChange: function(freq) {
		var me = this, cfg;
		if (freq === -1) {
			me.setValue(null);
		} else {
			cfg = me.buildRRuleCfg(null, null);
			me.setValue(new RRule(cfg).toString());
		}	
	},
	
	onRRuleCfgChange: function(s, rrCfg) {
		var me = this, cfg;
		if (s.isXType('sorrduration')) {
			cfg = me.buildRRuleCfg(null, rrCfg);
		} else {
			cfg = me.buildRRuleCfg(rrCfg, null);
		}
		me.setValue(new RRule(cfg).toString());
	},
	
	buildRRuleCfg: function(freqCfg, durCfg) {
		var me = this,
				freqCbo, optsCt, durCt, freqCmp;
		
		if (!freqCfg) {
			freqCbo = me.getComponent(0).getComponent(0).getComponent('freqcbo');
			optsCt = me.getComponent('optsct');
			freqCmp = optsCt.getComponent(me.optsCtItemId(freqCbo.getValue()));
			if (freqCmp) freqCfg = freqCmp.getRRuleConfig();
		}
		if (!durCfg) {
			durCt = me.getComponent('durct');
			durCfg = durCt.getComponent(0).getRRuleConfig();
		}
		return Ext.apply(freqCfg, durCfg);
	},
	
	buildFreqComboData: function(freqOptions) {
		var me = this,
				freqTexts = me.frequencyTexts,
				data = [], freq;
		data.push([-1, freqTexts['-1']]);
		for (var i=0; i < freqOptions.length; i++) {
			freq = freqOptions[i];
			data.push([freq, freqTexts[freq]]);
		}
		return data;
	},
	
	fromRRuleString: function(s) {
		try {
			return RRule.fromString(s);
		} catch(err) {
			return false;
		}
	},
	
	privates: {
		checkAvail: function() {
			if (!this.isAvailRRule) Ext.raise('Library RRule is required (see https://github.com/jakubroztocil/rrule)');
		},
		
		optsCtItemId: function(freq) {
			return 'freq-'+freq;
		}
	}
});
