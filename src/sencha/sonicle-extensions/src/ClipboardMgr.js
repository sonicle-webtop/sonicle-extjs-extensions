/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by: https://github.com/feross/clipboard-copy
 */
Ext.define('Sonicle.ClipboardMgr', {
	singleton: true,
	
	/**
	 * @readonly
	 * @property {Boolean} clipboardApi
	 * `true` if Clipboard API is supported, `false` otherwise.
	 * https://caniuse.com/#search=clipboard
	 */
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		me.clipboardApi = me.isApiSupported();
	},
	
	copy: function(text) {
		if (this.clipboardApi) {
			return navigator.clipboard.writeText(text);
			
		} else {
			var doc = document,
					win = window,
					success = false,
					span, iframe, iwin, sel, rng;
			
			// Put the text to copy into a <span>
			span = doc.createElement('span');
			span.textContent = text;
			span.style.whiteSpace = 'pre'; // Preserve consecutive spaces and newlines
			
			iframe = doc.createElement('iframe');
			iframe.sandbox = 'allow-same-origin';
			
			// Add the <iframe> to the page
			iframe = doc.body.appendChild(iframe);
			iwin = iframe.contentWindow;
			
			// Add the <span> to the <iframe>
			iwin.document.body.appendChild(span);
			
			// Get a Selection object representing the range of text selected by the user
			sel = iwin.getSelection();
			
			// Fallback for Firefox which fails to get a selection from an <iframe>
			if (!sel) {
				sel = win.getSelection();
				doc.body.appendChild(span);
			}
			
			rng = win.document.createRange();
			sel.removeAllRanges();
			rng.selectNode(span);
			sel.addRange(rng);

			try {
				success = win.document.execCommand('copy');
			} catch (err) {}

			sel.removeAllRanges();
			win.document.body.removeChild(span);
			doc.body.removeChild(iframe);

			// The Async Clipboard API returns a promise that may reject with `undefined` so we
			// match that here for consistency.
			return success ? Promise.resolve() : Promise.reject();
		}
	},
	
	privates: {
		isApiSupported: function() {
			try {
				return !!(navigator.clipboard);
			} catch(e) {
				return false;
			}
		}
	}
});
