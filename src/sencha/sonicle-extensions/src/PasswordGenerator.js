/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 * 
 * Inspired by:
 *	https://github.com/ahmadjoya/generate-password-lite
 * Alternative: https://github.com/omgovich/omgopass
 */
Ext.define('Sonicle.PasswordGenerator', {
	singleton: true,
	requires: [
		Sonicle.String
	],
	
	lowercaseChars: 'abcdefghijklmnopqrstuvwxyz',
	uppercaseChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	numberChars: '0123456789',
	specialChars: "!#$%&'()*+,-./:;<=>?@[]^_{|}~",
	
	/**
	 * Generates a password that adhere to the specified options.
	 * @param {Object} opts An object containing generation options:
	 * @param {Number} [opts.length] The length of the password. Defaults to 10.
	 * @param {Boolean} [opts.lowercase] Control wether to include lowercase chars in the password. Defaults to `true`.
	 * @param {Number} [opts.lowercaseMinLength] The minimum number of lowercase chars in the password. Defaults to 1.
	 * @param {String} [opts.lowercaseChars] Set of characters to use as lowercase chars. Defaults to {#link #lowercaseChars}.
	 * @param {Boolean} [opts.uppercase] Control wether to include uppercase chars in the password. Defaults to `true`.
	 * @param {Number} [opts.uppercaseMinLength] The minimum number of uppercase chars in the password. Defaults to 1.
	 * @param {String} [opts.uppercaseChars] Set of characters to use as uppercase chars. Defaults to {#link #uppercaseChars}.
	 * @param {Boolean} [opts.numbers] Control wether to include number chars in the password. Defaults to `true`.
	 * @param {Number} [opts.numbersMinLength] The minimum number of number chars in the password. Defaults to 1.
	 * @param {String} [opts.numberChars] Set of characters to use as number chars. Defaults to {#link #numberChars}.
	 * @param {Boolean} [opts.specials] Control wether to include special chars in the password. Defaults to `true`.
	 * @param {Number} [opts.specialsMinLength] The minimum number of special chars in the password. Defaults to 1.
	 * @param {String} [opts.specialChars] Set of characters to use as special chars. Defaults to {#link #specialChars}.
	 * @param {String} [opts.excludeChars] Characters to be excluded from password.
	 * @returns {String} The generated password
	 */
	generatePassword: function(opts) {
		opts = opts || {};
		
		if (!Ext.isNumber(opts.length) || opts.length < 0) opts.length = 10;
		if (!Ext.isBoolean(opts.lowercase)) opts.lowercase = true;
		if (!opts.lowercase) {
			opts.lowercaseMinLength = 0;
		} else if (!Ext.isNumber(opts.lowercaseMinLength) || opts.lowercaseMinLength < 0) opts.lowercaseMinLength = 1;
		if (!Ext.isBoolean(opts.uppercase)) opts.uppercase = true;
		if (!opts.uppercase) {
			opts.uppercaseMinLength = 0;
		} else if (!Ext.isNumber(opts.uppercaseMinLength) || opts.uppercaseMinLength < 0) opts.uppercaseMinLength = 1;
		if (!Ext.isBoolean(opts.numbers)) opts.numbers = true;
		if (!opts.numbers) {
			opts.numbersMinLength = 0;
		} else if (!Ext.isNumber(opts.numbersMinLength) || opts.numbersMinLength < 0) opts.numbersMinLength = 1;
		if (!Ext.isBoolean(opts.specials)) opts.specials = true;
		if (!opts.specials) {
			opts.specialsMinLength = 0;
		} else if (!Ext.isNumber(opts.specialsMinLength) || opts.specialsMinLength < 0) opts.specialsMinLength = 1;
		
		var me = this,
			SoS = Sonicle.String,
			random = Ext.Number.randomInt,
			lChars = me.removeExceptions(SoS.coalesce(opts.lowercaseChars, me.lowercaseChars), opts.excludeChars),
			uChars = me.removeExceptions(SoS.coalesce(opts.uppercaseChars, me.uppercaseChars), opts.excludeChars),
			nChars = me.removeExceptions(SoS.coalesce(opts.numberChars, me.numberChars), opts.excludeChars),
			sChars = me.removeExceptions(SoS.coalesce(opts.specialChars, me.specialChars), opts.excludeChars),
			psw = '',
			minChar = '',
			upperLimit, i;
		
		upperLimit = lChars.length;
		for (i=0; i < opts.lowercaseMinLength; i++) {
			minChar += lChars.charAt(random(0, upperLimit-1));
		}
		upperLimit = uChars.length;
		for (i=0; i < opts.uppercaseMinLength; i++) {
			minChar += uChars.charAt(random(0, upperLimit-1));
		}
		upperLimit = nChars.length;
		for (i=0; i < opts.numbersMinLength; i++)	 {
			minChar += nChars.charAt(random(0, upperLimit-1));
		}
		upperLimit = sChars.length;
		for (i=0; i < opts.specialsMinLength; i++) {
			minChar += sChars.charAt(random(0, upperLimit-1));
		}
		
		// Shuffling minChar to generate a password that holds minimum criteria.
		psw = psw + SoS.shuffle(minChar);
		
		var chars = '';
		chars = opts.lowercase ? chars + lChars : chars;
		chars = opts.uppercase ? chars + uChars : chars;
		chars = opts.numbers ? chars + nChars : chars;
		chars = opts.specials ? chars + sChars : chars;
		
		upperLimit = chars.length;
			var remaining = opts.length - psw.length;
		for (i=0; i < remaining; i++) {
			psw += chars.charAt(random(0, upperLimit-1));
		}
		
		return psw;
	},
	
	privates: {
		
		removeExceptions: function(s, exceptions) {
			if (Ext.isEmpty(exceptions) || !Ext.isString(exceptions)) return s;
			Ext.iterate(exceptions.split(''), function(exp) {
				s = s.replace(exp, '');
			});
			return s;
		}
	}
});