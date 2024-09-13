/**
 * Override original {@link Ext.Array}
 * 
 */
Ext.define('Sonicle.overrides.Array', {
	override: 'Ext.Array',
	
	/**
	 * Extracts the value of first item of passed array and returns it, 
	 * this is true only for single-item arrays. Otherwise `undefined` is returned. 
	 * This is the opposite method of {@link Ext.Array#from}. 
	 * @param {Mixed[]} array
	 * @returns {Mixed|undefined}
	 */
	toValue: function(array) {
		if (Ext.isArray(array) && array.length === 1) return array[0];
		return undefined;
	},
	
	/**
	 * Joins passed arrays' items into a single array.
	 * @param {Mixed[]...} arrays
	 * @returns {Mixed[]|undefined}
	 */
	join: function(arrays) {
		var args = arguments,
			len = args.length,
			array, i;
		for (i = 0; i < len; i++) {
			if (Ext.isArray(args[i]) || Ext.isDefined(args[i])) {
				if (!array) array = [];
				Ext.Array.push(array, args[i]);
			}
		}
		return array;
	}
});