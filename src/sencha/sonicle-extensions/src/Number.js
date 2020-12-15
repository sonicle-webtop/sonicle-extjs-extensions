/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.Number', {
	singleton: true,
	
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
