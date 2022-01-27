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
	 * Sets passed data object into 'data' property of specified viewModel.
	 * @param {Ext.data.ViewModel} vm The ViewModel instance.
	 * @param {Object} data The data object containing field data.
	 */
	setData: function(vm, data) {
		if (vm && vm.isViewModel && Ext.isObject(data)) {
			Ext.iterate(data, function(name, value) {
				vm.set('data.' + name, value);
			});
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
