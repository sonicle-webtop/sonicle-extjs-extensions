/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.PrintMgr', {
	singleton: true,
	
	print: function(printable, type, opts) {
		var me = this, html = '';
		opts = opts || {};
		if (arguments.length === 1) {
			type = 'raw';
		}
		
		if (type === 'raw') {
			html += '<!DOCTYPE html>';
			html += '<html><head>';
			html += '<meta charset="UTF-8">';
			html += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			html += (Ext.isEmpty(opts.title) ? '' : '<title>'+opts.title+'</title>');
			html += '</head><body>';
			html += printable;
			html += '</body></html>';
			me.printRawHtml(html);
		}
		//TODO: add other types from print.js lib! :)
	},
	
	printRawHtml: function(html) {
		var ifId = Ext.id(null, 'so-printer-if-'),
				ifEl, cw;
		ifEl = Ext.getBody().appendChild({
			id: ifId,
			tag: 'iframe',
			width: '100%',
			height: '100%',
			// This fixes Chrome display bug: see https://bugs.chromium.org/p/chromium/issues/detail?id=735059
			style: 'visibility:hidden;pointer-events:none;border:none;'
		});
		
		cw = ifEl.dom.contentWindow;
		cw.document.open();
		cw.document.write(html);
		cw.document.close();
		
		Ext.defer(function() {
			cw.focus();
			cw.print();
			Ext.fly(ifId).destroy();
		}, 500);
	}
});
