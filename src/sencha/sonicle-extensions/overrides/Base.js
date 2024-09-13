/**
 * Override original {@link Ext.Base}
 * - Add superclass retriever method base on its name
 * - Add callParent getter method (the function method that callParent would call!)
 */
Ext.define('Sonicle.overrides.Base', {
	override: 'Ext.Base',
	
	/**
	 * Check if this is an instance of the specified class name.
	 * @param {String} className The class name.
	 * @returns {Boolean}
	 */
	isInstanceOfClass: function(className) {
		if (this.$className === className) return true;
		return !!this.getSuperclass(className);
	},
	
	/**
	 * Inspect class hierarchy looking for the specified superclass.
	 * @param {String} className The class name.
	 * @returns {Ext.Base}
	 */
	getSuperclass: function(className) {
		var clazz = this, sclazz;
		while ((sclazz = clazz.superclass)) {
			if (sclazz.$className === className) break;
			clazz = sclazz;
		}
		return sclazz;
	},
	
	/**
	 * Returns the method that will be called in callParent; suitable for delaying invocation.
	 * @returns {Ext.Function}
	 */
	getCallParentMethod: function() {
		var method,
			superMethod = (method = this.getCallParentMethod.caller) && (method.$previous || ((method = method.$owner ? method : method.caller) && method.$owner.superclass[method.$name]));
		if (!superMethod) {
			method = this.getCallParentMethod.caller;
			/* eslint-disable-next-line vars-on-top */
			var parentClass, methodName;
			if (!method.$owner) {
				if (!method.caller) {
					throw new Error("Attempting to call a protected method from the " + "public scope, which is not allowed");
				}
				method = method.caller;
			}
			parentClass = method.$owner.superclass;
			methodName = method.$name;
			if (!(methodName in parentClass)) {
				throw new Error("this.callParent() was called but there's no such method (" + methodName + ") found in the parent class (" + (Ext.getClassName(parentClass) || 'Object') + ")");
			}
		}
		return superMethod;
	}
});
