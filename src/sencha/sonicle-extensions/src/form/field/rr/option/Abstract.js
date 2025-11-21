/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.rr.option.Abstract', {
	extend: 'Ext.container.Container',
	requires: [
		'Sonicle.Date',
		'Sonicle.VMUtils'
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
		 * This method must be overridden in child classes 
		 * to implement required custom logic.
		 * 
		 * @param {RRule} rr The RRule instance.
		 * @return {Boolean}
		 */
		validateRRule: function(rr) {
			Ext.raise('Override me');
		},
		
		/**
		 * This method should be overridden in child classes 
		 * to implement required custom logic.
		 * 
		 * @param {RRule} rr The RRule instance.
		 */
		applyRRule: function(rr) {
			// Override me!
		},
		
		/**
		 * This method can be overridden in child classes 
		 * to implement required custom logic.
		 * 
		 * @return {Object} Dynamic default configuration.
		 */
		returnVMDataStartDependantDefaults: function() {
			return {};
		},

		/**
		 * This method must be overridden in child classes
		 * to implement required custom logic.
		 * 
		 * @return {Object} Base default configuration.
		 */
		returnVMDataDefaults: function() {
			Ext.raise('Override me');
		},
		
		/**
		 * Helper method to be called in child classes to define a formula
		 * for a field dependend to an Option.
		 * @param {String} prefix ViewModel's property prefix.
		 * @param {String} name Property name to bind.
		 * @param {String} refOpt Boolean property name from which the bound property is related to.
		 * @param {String[]} resetOpts An array of Boolean property names to reset to `false` when a value to the bound property is set.
		 * @param {Object} [opts] An object containing configuration.
		 * @param {Function} [opts.getFn] A custom get Function to use.
		 * @param {Function} [opts.beforeSetFn] A hook point add logic before setting to the bound property value, it's executed just after resetting values.
		 * @return {Object} Formula configuration object
		 */
		bindFormulaOptField: function(prefix, name, refOpt, resetOpts, opts) {
			opts = opts || {};
			var me = this;
			return Sonicle.VMUtils.foPropTwoWay(prefix, name,
				Ext.isFunction(opts.getFn) ? opts.getFn : function(v) { return v; },
				function(v, path) {
					me.suspendOnChange++;
					for (var i=0; i<resetOpts.length; i++) this.set(prefix+'.'+resetOpts[i], false);
					Ext.callback(opts.beforeSetFn, this, [v, path, prefix]);
					me.suspendOnChange--;
					this.set(prefix+'.'+refOpt, true);
					return v;
				}
			);
		},
		
		/**
		 * A ready-to-use handler to be called in child classes for properly setup a deep bind listener.
		 * @param {Mixed} nv
		 * @param {Mixed} ov
		 */
		onBindFieldsChanged: function(nv, ov) {
			if (ov !== undefined && this.suspendOnChange === 0) {
				this.onRRuleCfgChange();
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
