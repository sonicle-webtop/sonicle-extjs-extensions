/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.VMUtils', {
    singleton: true,
	uses: [
		'Sonicle.String'
	],
	
	/**
	 * Applies provided formula definition to passed ViewModel.
	 * @param {Ext.app.ViewModel} vm ViewModel instance.
	 * @param {Object} formulas An object that defines named values whose value is managed by function calls to be set.
	 */
	applyFormulas: function(vm, formulas) {
		if (vm && vm.isViewModel) {
			vm.setFormulas(Ext.apply(vm.getFormulas() || {}, formulas));
		}
	},
	
	/**
	 * Applies provided stores definition to passed ViewModel.
	 * @param {Ext.app.ViewModel} vm ViewModel instance.
	 * @param {Object} stores A declaration of `Ext.data.Store` configurations to be set.
	 */
	applyStores: function(vm, stores) {
		if (vm && vm.isViewModel) {
			vm.setStores(Ext.apply(vm.getStores() || {}, stores));
		}
	},
	
	/**
	 * Extracts "field" names defined in 'data' property of specified viewModel
	 * @param {Ext.data.ViewModel} vm The ViewModel instance.
	 * @returns {String[]} The names defined into 'data' Object.
	 */
	getDataNames: function(vm) {
		return (vm && vm.isViewModel) ? Ext.Object.getKeys(vm.get('data')) : null;
	},
	
	/**
	 * Initializes 'data' property of specified viewModel
	 * @param {Ext.data.ViewModel} vm The ViewModel instance.
	 * @param {Object} initialData Object containing initial values to set.
	 * @param {String[]} [names] Array of field names whose values, if defined, will be initialized.
	 */
	setInitialData: function(vm, initialData, names) {
		if (vm && vm.isViewModel && Ext.isObject(initialData)) {
			if (Ext.isArray(names)) {
				Ext.iterate(names, function(name) {
					var value = initialData[name];
					if (Ext.isDefined(value)) vm.set('data.' + name, value);
				});
			} else {
				Ext.iterate(initialData, function(name, value) {
					if (Ext.isDefined(value)) vm.set('data.' + name, value);
				});
			}
		}
	},
	
	
	/**
	 * Sets arbitrary data into ViewModel
	 * @param {Ext.data.ViewModel} vm The ViewModel instance.
	 * @param {String} [pathPrefix] The path prefix inside ViewModel where to place data content.
	 * @param {Obejct} data A data Object containing props with values to set.
	 */
	set: function(vm, pathPrefix, data) {
		if (arguments.length < 3) {
			data = pathPrefix;
			pathPrefix = undefined;
		}
		if (vm && vm.isViewModel) {
			var prefix = (Ext.isString(pathPrefix) && !Ext.isEmpty(pathPrefix)) ? pathPrefix + '.' : '';
			if (Ext.isObject(data)) {
				Ext.iterate(data, function(name, value) {
					vm.set(prefix + name, value);
				});
			}
		}
	},
	
	/**
	 * Sets passed data object into 'data' property of specified viewModel.
	 * @param {Ext.data.ViewModel} vm The ViewModel instance.
	 * @param {Object|Object[]} data The data object containing field data or an array of values.
	 * @param {String[]} [names] Array of field names whose value are specified before as array of values.
	 */
	setData: function(vm, data, names) {
		if (vm && vm.isViewModel) {
			if (Ext.isArray(data) && Ext.isArray(names) && data.length === names.length) {
				Ext.iterate(data, function(value, i) {
					vm.set('data.' + names[i], value);
				});
			} else if (Ext.isObject(data)) {
				Ext.iterate(data, function(name, value) {
					vm.set('data.' + name, value);
				});
			}
		}
	},
	
	/**
	 * Gets data object from 'data' property of specified viewModel.
	 * @param {Ext.data.ViewModel} vm The ViewModel instance.
	 * @param {String[]|String} [names] Array of field names or a single name to get value of.
	 * @returns {Object} An object containing 
	 */
	getData: function(vm, names) {
		var data;
		if (vm && vm.isViewModel) {
			if (Ext.isArray(names)) {
				data = {};
				Ext.iterate(names, function(name) {
					data[name] = vm.get('data.' + name);
				});
			} else if (!Ext.isEmpty(names) && Ext.isString(names)) {
				data = vm.get('data.' + names);
			} else {
				data = vm.get('data');
			}
		}
		return data;
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that is able   
	 * to perform a two-way binding within a ViewModel's property.
	 * @param {String} pathPrefix ViewModel's property prefix.
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {String} propName Property name to bind.
	 * @param {Function} getFn Function that calculate and return the value to get.
	 * @param {Function} setFn Function that calculate and return the value to set.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {Function} [opts.noset] Set to `true` to NOT set the returned value in set method.
	 * @returns {Object} Formula configuration object
	 */
	foPropTwoWay: function(pathPrefix, propName, getFn, setFn, opts) {
		opts = opts || {};
		var path = Sonicle.String.join('.', pathPrefix, propName);
		return {
			bind: {bindTo: '{'+path+'}'},
			get: function(val) {
				return Ext.callback(getFn, this, [val]);
			},
			set: function(val) {
				var ret = Ext.callback(setFn, this, [val, path]);
				if (!opts.noset) this.set(path, ret);
			}
		};
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that is able   
	 * to setup binding within a ViewModel's property and return a value 
	 * computed by a customized function passed as parameter.
	 * @param {String} pathPrefix ViewModel's property prefix.
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {String} propName Property name to bind
	 * @param {Function} getFn Function that calculate and return the value to get.
	 * @param {Mixed} getFn.val Property value to process.
	 * @param {Object} [opts] An object containing configuration.
	 * @returns {Object} Formula configuration object
	 */
	foPropGet: function(pathPrefix, propName, getFn, opts) {
		opts = opts || {};
		var path = Sonicle.String.join('.', pathPrefix, propName);
		return {
			bind: {bindTo: '{'+path+'}'},
			get: function(val) {
				return Ext.callback(getFn, this, [val]);
			}
		};
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that returns the model field's 
	 * value if not empty, otherwise the specified default value.
	 * @param {String} pathPrefix ViewModel's property prefix.
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {String} propName Property name to bind
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {Boolean} [not=false] True to apply NOT operator
	 * @returns {Object} Formula configuration object
	 */
	foPropOrDefault: function(pathPrefix, propName, defaultValue) {
		return {
			bind: {bindTo: '{'+Sonicle.String.join('.', pathPrefix, propName)+'}'},
			get: function(val) {
				return Ext.isEmpty(val) ? defaultValue : val;
			}
		};
	},
	
	/**
	 * Defines a{@link Ext.app.bind.Formula} that checks the equality between 
	 * ViewModel's property value and a passed value.
	 * @param {String} pathPrefix ViewModel's property prefix.
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {String} propName Property name to bind
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {Mixed} equalsTo Value to match
	 * @param {Boolean} [not=false] True to negate tests applying NOT operator
	 * @returns {Object} Formula configuration object
	 */
	foPropIsEqual: function(pathPrefix, propName, equalsTo, not) {
		if (arguments.length === 3) not = false;
		return {
			bind: {bindTo: '{'+Sonicle.String.join('.', pathPrefix, propName)+'}'},
			get: function(val) {
				return (not === true) ? (val !== equalsTo) : (val === equalsTo);
			}
		};
	},
	
	/**
	 * Defines a{@link Ext.app.bind.Formula} that checks if ViewModel's property
	 * value is equal to one (or none for the negated form) of the passed list of values.
	 * @param {String} pathPrefix ViewModel's property prefix.
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {String} propName Property name to bind
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {Mixed[]|Mixed} values Allowed values list
	 * @param {Boolean} [not=false] Set to `true` to negate tests, applying NOT operator
	 * @returns {Object} Formula configuration object
	 */
	foPropIsIn: function(pathPrefix, propName, values, not) {
		if (arguments.length === 3) not = false;
		values = Ext.Array.from(values);
		return {
			bind: {bindTo: '{'+Sonicle.String.join('.', pathPrefix, propName)+'}'},
			get: function(val) {
				var iof = values.indexOf(val);
				return not === true ? iof === -1 : iof > -1;
			}
		};
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that checks 
	 * if specified ViewModel's property value is empty or not.
	 * @param {String} pathPrefix ViewModel's property prefix.
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {String} propName Property name to bind
	 * Specify as empty string if you're working directly with viewModel.
	 * @param {Boolean} [not=false] True to apply NOT operator
	 * @returns {Object} Formula configuration object
	 */
	foPropIsEmpty: function(pathPrefix, propName, not) {
		if (arguments.length === 2) not = false;
		return {
			bind: {bindTo: '{'+Sonicle.String.join('.', pathPrefix, propName)+'}'},
			get: function(val) {
				var ret = Ext.isEmpty(val);
				return (not === true) ? !ret : ret;
			}
		};
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that is able   
	 * to perform a two-way binding between form-field and a model's field.
	 * @param {String} modelProp ViewModel's property in which the model is stored.
	 * @param {String} fieldName Model's field name.
	 * @param {Function} getFn Function that calculate and return the value to get.
	 * @param {Mixed} getFn.value The candidate value to return (current field's value).
	 * @param {Ext.data.Model} getFn.record The model that owns the field.
	 * @param {String} getFn.fieldName Model's field name passed above.
	 * @param {Function} setFn Function that calculate and return the value to set.
	 * @param {Mixed} setFn.value The candidate value to set.
	 * @param {Ext.data.Model} setFn.record The models that owns the field.
	 * @param {String} setFn.fieldName Model's field name passed above.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {Function} [opts.modelProp] Override dafault property ('record') in which the model is stored.
	 * @returns {Object} Formula configuration object
	 */
	foFieldTwoWay: function(modelProp, fieldName, getFn, setFn, opts) {
		opts = opts || {};
		var path = Sonicle.String.join('.', modelProp, fieldName);
		return {
			bind: {bindTo: '{'+path+'}'},
			get: function(val) {
				return Ext.callback(getFn, this, [val, this.get(modelProp), fieldName]);
			},
			set: function(val) {
				var mo = this.get(modelProp);
				if (val !== undefined) mo.set(fieldName, Ext.callback(setFn, this, [val, mo, fieldName]));
			}
		};
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that looks into 
	 * an internal association and returns items' count.
	 * @param {String} modelProp ViewModel's property in which the model is stored
	 * @param {String} associationName Model's association name
	 * @returns {Object} Formula configuration object
	 */
	foAssociationCount: function(modelProp, associationName) {
		return {
			bind: {bindTo: '{'+Sonicle.String.join('.', modelProp, associationName, 'data')+'}', deep: true},
			get: function(data) {
				return (!data) ? 0 : data.length;
			}
		};
	},
	
	/**
	 * Helper method for defining a {@link Ext.app.bind.Formula} that returns a 
	 * value from an internal association computed by a customized function 
	 * passed as parameter.
	 * @param {String} modelProp ViewModel's property in which the model is stored
	 * @param {String} associationName Model's association name
	 * @param {Function} getFn A function to produce the desired value.
	 * @param {Object} getFn.data
	 * @param {Integer} getFn.count
	 * @param {Mixed...} [args] The arguments to append to getFn (after the 2nd argument).
	 * @returns {Object} Formula configuration object
	 */
	foAssociationGetFn: function(modelProp, associationName, getFn) {
		if (!Ext.isFunction(getFn)) getFn = function(v) {return v;};
		var moreArgs = arguments.length > 3 ? Ext.Array.slice(arguments, 3) : [];
		return {
			bind: {bindTo: '{'+Sonicle.String.join('.', modelProp, associationName, 'data')+'}', deep: true},
			get: function(data) {
				return getFn.apply(this, [data, (!data) ? 0 : data.length].concat(moreArgs));
			}
		};
	}
});
