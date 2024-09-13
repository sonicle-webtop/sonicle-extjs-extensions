/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Abstract', {
	extend: 'Ext.container.Container',
	requires: [
		'Sonicle.Date'
	],
	
	referenceHolder: true,
	layout: 'form',
	minHeight: 70,
	
	/**
	 * @cfg {RRule} rrule
	 * The underlying recurrence definition.
	 */
	rrule: undefined,
	
	suspendOnChange: 0, // Counter to ignore fields change events issuing change task!
	rruleCfgChangeBuffer: 200,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
	},
	
	onDestroy: function() {
		var me = this,
            task = me.rruleCfgChangeTask;
		if (task) task.cancel();
		me.callParent();
	},
	
	/**
	 * This method must be overridden into child classes 
	 * to implement required custom logic.
	 * 
	 * @return {Object} RRule configuration
	 */
	getRRuleConfig: function() {
		Ext.raise('Override me');
	},
	
	setRRule: function(value) {
		var me = this;
		me.rrule = value;
		if (value === null) {
			return true;
		} else {
			if (me.validateRRule(value) !== false) {
				me.suspendOnChange++;
				me.applyRRule(value);
				// Keep delay otherwise internal field's change event may fire after updating internal viewModel, and we don't want it.
				Ext.defer(function() { me.suspendOnChange--; }, 250);
				return true;
			} else {
				return false;
			}
		}
	},
	
	getStartDate: function() {
		var me = this,
			rrule = me.rrule;
		return rrule ? rrule.options.dtstart : new Date();
	},
	
	privates: {
		/**
		 * This method must be overridden into child classes 
		 * to implement required custom logic.
		 * 
		 * @param {RRule} rr The RRule instance.
		 * @return {Boolean}
		 */
		validateRRule: function(rr) {
			Ext.raise('Override me');
		},
		
		/**
		 * This method should be overridden into child classes 
		 * to implement required custom logic.
		 * 
		 * @param {RRule} rr The RRule instance.
		 */
		applyRRule: function(rr) {

		},
		
		/**
		 * This method should be overridden into child classes 
		 * to implement required custom logic.
		 * 
		 * @param {Ext.form.field.Base} field
		 * @return {Boolean}
		 */
		shouldSkipChange: function(field) {
			return false;
		},
		
		/**
		 * This method can be overridden into child classes 
		 * to implement required custom logic.
		 * 
		 * @return {Object} Dynamic default configuration.
		 */
		returnVMDataStartDependantDefaults: function() {
			return {};
		},

		/**
		 * This method must be overridden into child classes
		 * to implement required custom logic.
		 * 
		 * @return {Object} Base default configuration.
		 */
		returnVMDataDefaults: function() {
			Ext.raise('Override me');
		},
		
		fieldOnChange: function(s, nv, ov) {
			var me = this;
			if (me.shouldSkipChange(s) === false) {
				if (s.isXType('combo')) {
					// Within combos this is called by the select event in which
					// new and old values are not available. It' always a valid change.
					me.onRRuleCfgChange();
				} else if (s.isXType('checkboxfield') || s.isXType('radiofield')) {
					// For checkbox and radio fields we cannot rely on oldValue 
					// (is oldValue null?); we must use a private duringSetValue flag.
					if (!s.duringSetValue) me.onRRuleCfgChange();
				} else {
					//if (ov !== null) me.onRRuleCfgChange();
					me.onRRuleCfgChange();
				}
			}
		},
		
		optionSelectorOnChange: function(s, nv, ov) {
			var me = this;
			// Skip value changes originating from code/binding, we are interested
			// only in changes coming from user interaction.
			if (s.isXType('radiofield')) {
				// For radio fields we cannot rely on oldValue (is oldValue null?); 
				// we must use a private duringSetValue flag.
				if (!s.duringSetValue && (nv === true)) me.onRRuleCfgChange();
			}
		},
		
		onRRuleCfgChange: function() {
			if (this.suspendOnChange === 0) this.startRRuleCfgChangeTask();
		},
		
		getVMData: function() {
			var me = this,
				vm = me.getViewModel(),
				data = vm.get('data');

			if (data.opt1 !== null) {
				return data;
			} else {
				data = Ext.apply({}, me.returnVMDataStartDependantDefaults(), me.returnVMDataDefaults());
				vm.set('data', data);
				return data;
			}
		},
		
		startRRuleCfgChangeTask: function() {
			var me = this,
				task = me.rruleCfgChangeTask;
			if (!task) {
				me.rruleCfgChangeTask = task = new Ext.util.DelayedTask(me.doRRuleCfgChangeTask, me);
			}
			task.delay(me.rruleCfgChangeBuffer);
		},

		doRRuleCfgChangeTask: function() {
			this.fireEvent('rrulecfgchange', this, this.getRRuleConfig());
		},

		asArray: function(item) {
			if (Ext.isArray(item)) {
				return item;
			} else {
				return Ext.isDefined(item) ? [item] : [];
			}
		}
	}
});
