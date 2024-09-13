/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.Number', {
	singleton: true,
	
	/**
	 * Returns first valid Number value of provided arguments.
	 * @param {Mixed...} numbers List of numbers.
	 * @returns {Mixed} The first valid value.
	 */
	coalesce: function(values) {
		for (var i=0; i<arguments.length; i++) {
			if (Ext.isNumber(arguments[i])) return arguments[i];
		}
		return null;
	},
	
	/**
	 * Checks if passed number is between the specified values.
	 * Begin and end values are included.
	 * @param {Number} number The number to check.
	 * @param {Number} value1 The first number limit.
	 * @param {Number} value2 The second number limit.
	 * @returns {Boolean}
	 */
	isBetween: function(number, value1, value2) {
		if (!Ext.isNumber(number) || !Ext.isNumber(value1) || !Ext.isNumber(value2)) return false;
		var min = Math.min(value1, value2),
			max = Math.max(value1, value2);
		return number >= min && number <= max;
	},
	
	/**
	 * Rounds a number to specified precision (decimal places).
	 * @param {Number} number The number
	 * @param {Integer} [precision] The desired precision (num of decimal places)
	 * @returns {Number}
	 */
	round: function(number, precision) {
		if (!Number.isInteger(precision) || (precision < 0)) precision = 0;
		if (!('' + number).includes('e')) {
			return +(Math.round(number + 'e+' + precision) + 'e-' + precision);
		} else {
			var arr = ('' + number).split('e'),
					sig = '';
			if (+arr[1] + precision > 0) sig = '+';
			return +(Math.round(+arr[0] + 'e' + sig + (+arr[1] + precision)) + 'e-' + precision);
		}
	},
	
	compare: function(number1, number2) {
		return number1 < number2 ? -1 : (number1 > number2 ? 1 : 0);
	}
});
