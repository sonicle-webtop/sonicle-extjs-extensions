/**
 * Override original {@link Ext.Function}
 * 
 */
Ext.define('Sonicle.overrides.Function', {
	override: 'Ext.Function',
	
	/**
	 * Create a combined function call that wraps the original function and allows 
	 * to customize its return value.
	 * The passed function is called with the parameters of the original function 
	 * except for the first one which will be the return value of the wrapped function.
	 * Example usage:
	 * 
	 *     var introduceYourself = function(name) {
	 *	       return 'my name is ' + name;
	 *     }
	 *     
	 *     introduceYourself('Fred'); // returns "my name is Fred"
	 *     
	 *     var sayHiAndIntroduceYourself = Ext.Function.wrap(introduceYourself, function(origReturn, name) {
	 *         return 'Hi, ' + origReturn;
	 *     });
	 *     
	 *     sayHiAndIntroduceYourself('Fred'); // returns "Hi, my name is Fred"
	 * 
	 * @param {Function} originalFn The original function to be wrapped.
	 * @param {Function} newFn The function that wraps the original one.
	 * @param {Object} [scope] The scope (`this` reference) in which the passed function
	 * is executed. If omitted, defaults to the scope in which the original function is called
	 * or the default global environment object (usually the browser window).
	 * @returns {Function} The new function.
	 */
	wrap: function(originalFn, newFn, scope) {
		if (!newFn) {
			return originalFn;
		} else {
			return function() {
				var result = originalFn.apply(this, arguments);
				return newFn.apply(scope || this, Ext.Array.push([result], arguments || []));
			};
		}
	}
});