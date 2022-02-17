/**
 * Override default Ext.data.Model
 * - Add support to associations: provide setAssociated method, check in isValid and isDirty
 * - Add refresh option to isValid in order to make sure to have validation data recalculated
 */
Ext.define('Sonicle.overrides.data.Model', {
	override: 'Ext.data.Model',
	
	/**
	 * Sets the associated data, adding item's data into the Store implied by 
	 * the association. Data must be organized in sub-objects following the right 
	 * data structure.
	 * @param {Object} data An object containing data to be added to internal associations Stores.
	 */
	setAssociated: function(data) {
		var me = this, 
				getter, roleData;
		
		Ext.iterate(me.associations, function(name, assoc) {
			getter = me[assoc.getterName]();
			if (getter && getter.isStore) {
				roleData = data[assoc.role];
				if (roleData) getter.add(roleData);
			}
		});
	},
	
	/**
	 * Checks if the model is valid. See {@link #getValidation}.
	 * Also associated data will be taken into account.
	 * @param {Boolean} [refresh] Pass `true` to force a `refresh` of the validation instance before returning results. 
	 * @returns {Boolean} True if the model is valid.
	 */
	isValid: function(refresh) {
		var me = this,
				valid = me.getValidation(refresh === true ? true : undefined).isValid(),
				getter;
		
		if (!valid) return false; // If already invalid, return soon...
		// Otherwise evaluate model associations (if present)
		Ext.iterate(me.associations, function(name, assoc) {
			getter = me[assoc.getterName]();
			if (getter) {
				// NB: we need to check also fromSingle into association object, 
				// otherwise we run into a loop, exhausting the call-stack, due 
				// to presence of inverse association inside the inner model.
				if (getter.isModel && assoc.fromSingle && !getter.isValid(refresh)) {
					valid = false;
					return false;
				}
			}
		});
		return valid;
	},
	
	privates: {
		
		/**
		 * Checks if the model is dirty.
		 * Also associated data will be taken into account.
		 * @returns {Boolean} True if the model is dirty.
		 */
		isDirty: function() {
			var me = this, 
					dirty = me.dirty,
					getter;

			if (dirty) return true; // If already dirty, return soon...
			// Otherwise evaluate associations (if present)
			Ext.iterate(me.associations, function(name, assoc) {
				getter = me[assoc.getterName]();
				if (getter) {
					if (getter.isModel && assoc.fromSingle && getter.isDirty() === true) {
						dirty = true;
						return false;
					} else if (getter.isStore && getter.needsSync === true) {
						dirty = true;
						return false;
					}
				}
			});
			return dirty;
		}
	}
});
