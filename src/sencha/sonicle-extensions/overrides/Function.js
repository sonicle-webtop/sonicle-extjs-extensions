/**
 * Override original {@link Ext.Function}
 * 
 */
Ext.define('Sonicle.overrides.Function', {
	override: 'Ext.Function',
	
	wrap: function(originalFn, newFn, scope) {
		if (!newFn) {
			return originalFn;
		} else {
			return function() {
				var result = originalFn.apply(this, arguments);
				return newFn.apply(scope || this, Ext.Array.union([result], arguments));
			};
		}
	}
});