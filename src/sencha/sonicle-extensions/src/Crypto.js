/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by:
 *	https://github.com/crypto-browserify/randombytes
 */
Ext.define('Sonicle.Crypto', {
	
	statics: {
		getRandomBytes: function(size) {
			var win = window,
					crypto = (win.crypto || win.msCrypto),
					bytes = new Uint8Array(size),
					QUOTA = 65536;
			
			for (var i = 0; i < size; i += QUOTA) {
				crypto.getRandomValues(bytes.subarray(i, i + Math.min(size - i, QUOTA)));
			}
			return bytes;
		}
	}
});
