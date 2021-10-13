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
	
	layout: 'container',
	defaultBindProperty: 'value',
	
	config: {
		/**
		 * @cfg {Date} startDate
		 * The start date of the underlying recurrence series.
		 */
		startDate: null,
		
		/**
		 * @cfg {Boolean} [allowRawFreqSelection=true]
		 * Set to `false` in order to prevent user selection on raw freq. entry.
		 */
		allowRawFreqSelection: true
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
	
	endsText: 'Ends',
	frequencyTexts: {
		'none': 'Does not repeat',
		'raw': 'Custom',
		'3': 'Daily',
		'2': 'Weekly',
		'1': 'Monthly',
		'0': 'Yearly'
	},
	onEveryText: 'Every',
	onEveryWeekdayText: 'Every weekday',
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
	byDayText: 'day',
	byWeekdayText: 'weekday',
	byWeText: 'weekend',
	endsNeverText: 'never',
	endsAfterText: 'after',
	endsByText: 'by',
	occurrenceText: 'occurrence(s)',
	rawFieldEmptyText: 'Paste here a RRULE string that follows iCalendar RFC',
	
	/**
     * @event select
	 * Fires when the user selects a frequency for this recurrence.
	 * @param {Sonicle.form.field.rr.Recurrence} this
	 * @param {none|raw|Strinn} event The Rule frequency
     */
	
	/**
	 * @private
	 */
	rrule: null,
	
	suspendOnRRuleCfgChange: 0,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.isAvailRRule = Ext.isDefined(window['RRule']);
		me.checkAvail();
	},
	
	initComponent: function() {
		var me = this;
		
		me.items = [{
			xtype: 'fieldcontainer',
			layout: 'anchor',
			items: [
				{
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
							{name: 'id', type: 'string'},
							{name: 'desc', type: 'string'}
						],
						data: me.buildFreqComboData(me.freqOptions)
					},
					valueField: 'id',
					displayField: 'desc',
					listeners: {
						beforeselect: function(s, rec) {
							if ((rec.get('id') === 'raw') && (me.getAllowRawFreqSelection() === false)) {
								return false;
							} else {
								return true;
							}
						},
						select: function(s, rec) {
							me.onFrequencyChange(rec.get('id'));
						}
					}
				}
			]
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
			items: [
				{
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
					ordinalsTexts: me.ordinalsTexts,
					byDayText: me.byDayText,
					byWeekdayText: me.byWeekdayText,
					byWeText: me.byWeText,
					monthText: me.monthText
				}, {
					xtype: 'sorryearly',
					itemId: me.optsCtItemId(RRule.YEARLY),
					onDayText: me.onDayText,
					onTheText: me.onTheText,
					ofText: me.ofText,
					ofEveryText: me.ofEveryText,
					ordinalsTexts: me.ordinalsTexts,
					byDayText: me.byDayText,
					byWeekdayText: me.byWeekdayText,
					byWeText: me.byWeText,
					yearText: me.yearText
				}
			]
		}, {
			xtype: 'container',
			itemId: 'durct',
			hideMode: 'offsets',
			//hidden: !me.getShowRawValue(),
			defaults: {
				startDay: me.startDay,
				dateFormat: me.dateFormat,
				startDate: me.getStartDate(),
				listeners: {
					rrulecfgchange: me.onRRuleCfgChange,
					scope: me
				}
			},
			items: [
				{
					xtype: 'fieldset',
					collapsed: true,
					anchor: '100%',
					width: '100%',
					title: me.endsText
				}, {
					xtype: 'sorrduration',
					itemId: 'dur',
					endsText: me.endsText,
					endsNeverText: me.endsNeverText,
					endsAfterText: me.endsAfterText,
					endsByText: me.endsByText,
					occurrenceText: me.occurrenceText
				}
			]	
		}, {
			xtype: 'textfield',
			itemId: 'rawfld',
			hideMode: 'offsets',
			selectOnFocus: true,
			readOnly: true,
			hidden: true,
			emptyText: me.rawFieldEmptyText,
			listeners: {
				paste: {
					element: 'inputEl',
					fn: function(e) {
						e.stopEvent();
						var be = e.event, txt;
						if (be && be.clipboardData && be.clipboardData.types && be.clipboardData.getData) {
							txt = be.clipboardData.getData('text/plain');
							if (me.fromRRuleString(txt)) {
								me.setValue(txt);
							} else {
								me.fireEvent('rawpasteinvalid', me);
							}
						}
					}
				}
			},
			width: '100%'
		}];
		me.callParent(arguments);
		me.initField();
	},
	
	afterRender: function() {
		var me = this;
		me.callParent();
		me.configureUi(me.rrule ? me.rrule.origOptions.freq : 'none', me.rrule);
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
		if (me.suspendOnRRuleCfgChange === 0) {
			me.configureUi(me.rrule ? me.rrule.origOptions.freq : 'none', me.rrule);
		}
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
			durCt.getComponent('dur').setStartDate(newValue);
		}
	},
	
	privates: {
		checkAvail: function() {
			if (!this.isAvailRRule) Ext.raise('Library RRule is required (see https://github.com/jakubroztocil/rrule)');
		},
		
		optsCtItemId: function(freq) {
			return 'freq-'+freq;
		},
		
		configureUi: function(freq, rrule) {
			var me = this,
					freqCbo = me.getComponent(0).getComponent('freqcbo'),
					optsCt = me.getComponent('optsct'),
					durCt = me.getComponent('durct'),
					rawFld = me.getComponent('rawfld');

			rawFld.setValue(rrule ? rrule.toString() : null);

			if (freq === 'none') {
				optsCt.hide();
				durCt.hide();
				rawFld.hide();

			} else if (freq === 'raw') {
				optsCt.hide();
				durCt.hide();
				rawFld.show();

			} else {
				var ok = true;
				if (rrule !== undefined) {
					ok = optsCt.getComponent(me.optsCtItemId(freq)).setRRule(rrule);
					if (ok) durCt.getComponent('dur').setRRule(rrule);
				}
				if (ok) {
					optsCt.setActiveItem(me.optsCtItemId(freq));
					optsCt.show();
					durCt.show();
					rawFld.hide();

				} else {
					freq = 'raw';
					optsCt.hide();
					durCt.hide();
					rawFld.show();
				}
			}
			freqCbo.setValue(freq);
		},

		onFrequencyChange: function(freq) {
			var me = this, cfg;
			if (freq === 'none') {
				me.setValue(null);
			} else if (freq === 'raw') {
				me.configureUi('raw', me.rrule);
			} else {
				cfg = me.buildRRuleCfg(null, null);
				me.setValue(new RRule(cfg).toString());
			}
			me.fireEvent('select', me, freq);
		},

		onRRuleCfgChange: function(s, rrCfg) {
			var me = this, cfg;
			if (s.isXType('sorrduration')) {
				cfg = me.buildRRuleCfg(null, rrCfg);
			} else {
				cfg = me.buildRRuleCfg(rrCfg, null);
			}
			me.suspendOnRRuleCfgChange++;
			me.setValue(new RRule(cfg).toString());
			me.suspendOnRRuleCfgChange--;
		},
		
		buildRRuleCfg: function(freqCfg, durCfg) {
			var me = this,
					freqCbo, optsCt, durCt, freqCmp;

			if (!freqCfg) {
				freqCbo = me.getComponent(0).getComponent('freqcbo');
				optsCt = me.getComponent('optsct');
				freqCmp = optsCt.getComponent(me.optsCtItemId(freqCbo.getValue()));
				if (freqCmp) freqCfg = freqCmp.getRRuleConfig();
			}
			if (!durCfg) {
				durCt = me.getComponent('durct');
				durCfg = durCt.getComponent('dur').getRRuleConfig();
			}
			return Ext.apply(freqCfg, durCfg);
		},

		buildFreqComboData: function(freqOptions) {
			var me = this,
					freqTexts = me.frequencyTexts,
					data = [], freq;
			data.push(['none', freqTexts['none']]);
			for (var i=0; i < freqOptions.length; i++) {
				freq = freqOptions[i];
				data.push([freq+'', freqTexts[freq]]);
			}
			data.push(['raw', freqTexts['raw']]);
			return data;
		},

		fromRRuleString: function(s) {
			try {
				return RRule.fromString(s);
			} catch(err) {
				return false;
			}
		}
	}
});
