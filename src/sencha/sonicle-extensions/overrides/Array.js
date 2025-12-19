/**
 * Override original {@link Ext.Array}
 * 
 */
Ext.define('Sonicle.overrides.Array', {
	override: 'Ext.Array',
	
	/**
	 * Returns the index of the first item in the array which elicits a truthy 
	 * return value from the passed selection function.
	 * @param {Array} array The array to search
	 * @param {Function} fn The selection function to execute for each item.
	 * @param {Mixed} fn.item The array item.
	 * @param {Number} fn.index The index of the array item.
	 * @param {Object} scope (optional) The scope (<code>this</code> reference) in 
	 * which the function is executed. Defaults to the arrays
	 * @returns {undefined} The index of the first item in the array which returned 
	 * true from the selection function, or -1 if none was found.
	 */
	findIndexBy: function(array, fn, scope) {
		var i, len;
		if (Ext.isArray(array)) {
			for (i = 0, len = array.length; i < len; i++) {
				if (fn.call(scope || array, array[i], i)) {
					return i;
				}
			}
		}
		return -1;
	},
	
	/**
	 * Swaps the speficied elements of the passed Array.
	 * @param {Array} array The array in which to swap elements
	 * @param {Number} index1 The index of the 1st element to swap.
	 * @param {Number} index2 The index of the 2nd element to swap.
	 * @returns {Array} The array with swapped elements
	 */
	swap: function(array, index1, index2) {
		var item1;
		if (Ext.isArray(array) && (index1 >= 0) && (index1 < array.length) && (index2 >= 0) && (index2 < array.length) && index1 !== index2) {
			item1 = array[index1];
			array[index1] = array[index2];
			array[index2] = item1;
		}
		return array;
	},
	
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