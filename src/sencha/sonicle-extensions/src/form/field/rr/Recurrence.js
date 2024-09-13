/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
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
		 * @cfg {Boolean} [allowRawFreqSelection=true]
		 * Set to `false` in order to prevent user selection on raw freq. entry.
		 */
		allowRawFreqSelection: true
	},
	
	/**
	 * @cfg {Date} [defaultStartDate]
	 * The default start-date when defining new rule.
	 * If not defined, current date will be used instead.
	 */
	defaultStartDate: undefined,
	
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
		var me = this,
			ME = Sonicle.form.field.rr.Recurrence;
		
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
						var be = e.event, paste, start, rr;
						if (be && be.clipboardData && be.clipboardData.types && be.clipboardData.getData) {
							paste = be.clipboardData.getData('text/plain');
							start = me.getStartDate();
							if (rr = ME.parseRRuleString(paste, start)) {
								me.setValue(rr.toString());
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
	
	getDefaultStartDate: function() {
		var deflt = this.defaultStartDate;
		return Ext.isDate(deflt) ? deflt : new Date();
	},
	
	setDefaultStartDate: function(date) {
		this.defaultStartDate = date;
	},
	
	setValue: function(value, /*private*/ uiSilent) {
		var me = this,
			ME = Sonicle.form.field.rr.Recurrence,
			rr;
		
		if (Ext.isEmpty(value)) {
			me.value = null;
			me.rrule = null;
		} else {
			me.value = value;
			rr = ME.parseRRuleString(value);
			me.rrule = rr ? rr : null;
		}
		if (!uiSilent) {
			// If call to setValue comes from inside, we skip ui updates to 
			// avoid unuseful updates and subsequent event fires!
			me.configureUi(me.rrule ? me.rrule.origOptions.freq : 'none', me.rrule);
		}
		me.checkChange();
		return me;
	},
	
	getStartDate: function() {
		var me = this;
		return me.rrule ? me.rrule.options.dtstart : me.getDefaultStartDate();
	},
	
	isEqual: function(value1, value2) {
		return Sonicle.form.field.rr.Recurrence.isRRuleEqual(value1, value2);
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
			
			rawFld.setValue(rrule ? Sonicle.form.field.rr.Recurrence.splitRRuleString(rrule.toString()).rrule : null);

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
				me.setValue(new RRule(cfg).toString(), true);
			}
			me.fireEvent('select', me, freq);
		},

		onRRuleCfgChange: function(s, rrCfg) {
			var me = this, cfg;
			if (me.suspendOnRRuleCfgChange === 0) {
				if (s.isXType('sorrduration')) {
					cfg = me.buildRRuleCfg(null, rrCfg);
				} else {
					cfg = me.buildRRuleCfg(rrCfg, null);
				}
				me.setValue(new RRule(cfg).toString(), true);
			}
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
			return Ext.apply(freqCfg, durCfg, {
				dtstart: me.getStartDate()
			});
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
		}
	},
	
	statics: {
		
		/**
		 * Parses an RRule String with optionally a start Date with accoring format.
		 * In source string, recurrence rule can be specified as plain string (eg. 'FREQ=DAILY;INTERVAL=1')
		 * or using named-parameter notation (eg. 'RRULE:FREQ=DAILY;INTERVAL=1').
		 * Starting date can be reported accordingly (eg. 'DTSTART:20240723T220000Z');
		 * the separator between two named-parameters is '\n' character.
		 * @param {String} s The input String to be parsed
		 * @param {Date|String} [start] A start date as Date object or in String representation.
		 * @param {String} [format] Format pattern for start Date, if was specified as String. Defaults to ISO date (`c`).
		 */
		parseRRuleString: function(s, start, format) {
			var rr, start;
			if (!Ext.isEmpty(s)) {
				try {
					rr = RRule.fromString(s);
				} catch(err) {
					return false;
				}
				if (start) {
					start = Sonicle.Date.parse(start, format || 'c');
					rr = new RRule(Ext.apply(rr.origOptions || {}, {
						dtstart: start
					}));
				}
			}
			return rr;
		},
		
		/**
		 * Returns whether two RRules are logically equal. Comparison is NOT 
		 * done by simply comparing strings: rules are firstly splitted into 
		 * tokens, then resulting tokens sorted by value and finally re-joined 
		 * into strings. This allow consistent results if same tokens are in 
		 * different positions in the rrule string.
		 * @param {String} rrule1 The first RRule to compare
		 * @param {String} rrule2 The second RRule to compare
		 * @return {Boolean} True if the values are equal, false if inequal.
		 */
		isRRuleEqual: function(rrule1, rrule2) {
			var s1 = Ext.isString(rrule1) ? rrule1 : '',
				s2 = Ext.isString(rrule2) ? rrule2 : '',
				spl1 = s1.split(';'),
				spl2 = s2.split(';');
			if (spl1.length !== spl2.length) return false;
			spl1.sort();
			spl2.sort();
			return spl1.join(';') === spl2.join(';');
		},
		
		/**
		 * Translates a JS weekday number into RRule's byWeekday value. Array are supported.
		 * @param {Number|Number[]} jsWeekday One or many JS weekday numbers.
		 * @return {Number|Number[]} byWeekday value(s)
		 */
		jsWeekdayToByWeekday: function(jsWeekday) {
			var ME = Sonicle.form.field.rr.Recurrence;
			if (Ext.isArray(jsWeekday)) {
				var arr = [];
				for (var i=0; i<jsWeekday.length; i++) {
					arr.push(ME.jsWeekdayToRRuleWeekday(jsWeekday[i]));
				}
				return arr;
			} else {
				return ME.jsWeekdayToRRuleWeekday(jsWeekday);
			}
		},
		
		/**
		 * Translates an RRule's byWeekday value into JS weekday. Array are supported.
		 * @param {Number|Number[]} byWeekday One or many RRule's byWeekday values.
		 * @return {Number|Number[]} weekday value(s)
		 */
		byWeekdayToJsWeekday: function(byWeekday) {
			if (Ext.isArray(byWeekday)) {
				var arr = [];
				for (var i=0; i<byWeekday.length; i++) {
					arr.push(byWeekday[i].getJsWeekday());
				}
				return arr;
			} else {
				return byWeekday.getJsWeekday();
			}
		},
		
		/**
		 * @private
		 */
		jsWeekdayToRRuleWeekday: function(jsWeekday) {
			switch(jsWeekday) {
				case 0:
					return RRule.SU;
				case 1:
					return RRule.MO;
				case 2:
					return RRule.TU;
				case 3:
					return RRule.WE;
				case 4:
					return RRule.TH;
				case 5:
					return RRule.FR;
				case 6:
					return RRule.SA;
			}
		},
		
		joinRRuleString: function(rrule, start) {
			var SoS = Sonicle.String,
				rr = SoS.removeStart(rrule, 'RRULE:'),
				tokens = [];
			if (Ext.isDate(start)) {
				tokens.push('DTSTART:'+Sonicle.form.field.rr.Recurrence.formatDTStart(start));
			}
			if (!Ext.isEmpty(rrule)) {
				tokens.push('RRULE:'+rr);
			}
			return SoS.join('\n', tokens);
		},
		
		parseDTStart: function(s) {
			var dtstart;
			if (!Ext.isEmpty(s) && s.length === 16) {
				dtstart = Ext.Date.parse(s.slice(0, 4)+'-'+s.slice(4, 6)+'-'+s.slice(6, 8)+'T'+s.slice(9, 11)+':'+s.slice(11, 13)+':'+s.slice(13), 'C');
			}
			return dtstart;
		},
		
		formatDTStart: function(dtstart) {
			return Ext.Date.format(dtstart, 'C')
				.split('-').join('')
				.split(':').join('')
				.slice(0,15).concat('Z');
		},
		
		splitRRuleString: function(text) {
			var tokens = Sonicle.String.parseKVArray(text, [], undefined, '\n', ':'),
				rrule, start, i;
			if (!Ext.isEmpty(tokens)) {
				for (i=0; i<tokens.length; i++) {
					if (tokens[i][0] === 'RRULE') {
						rrule = tokens[i][1];
					} else if (tokens[i][0] === 'DTSTART') {
						start = Sonicle.form.field.rr.Recurrence.parseDTStart(tokens[i][1]);
					}
				}
			}
			return {rrule: rrule, start: start};
		}
	}
});
