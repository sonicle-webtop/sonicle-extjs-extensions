/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.VMUtils', {
    singleton: true,
	
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
	}
});
