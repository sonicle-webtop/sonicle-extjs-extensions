/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 * 
 * https://stackoverflow.com/questions/468881/print-div-id-printarea-div-only/15900835#15900835
 * https://stackoverflow.com/questions/45642831/window-print-position-div-center-of-the-page
 * https://stackoverflow.com/questions/19798923/printing-text-in-html-in-the-center-of-the-page
 */
Ext.define('Sonicle.PrintMgr', {
	singleton: true,
	
	/**
	 * 
	 * @param {String} printable
	 * @param {String} type
	 * @param {Object} opts An object containing configuration.
	 * @param {top|center|bottom} [opts.verticalAlign]
	 * @param {left|center|right} [opts.horizontalAlign]
	 */
	print: function(printable, type, opts) {
		var me = this, html = '';
		opts = opts || {};
		if (arguments.length === 1) {
			type = 'raw';
		}
		
		if (type === 'raw') {
			var vaStyle = me.verticalAlignToCssProp(opts.verticalAlign),
					haStyle = me.horizontalAlignToCssProp(opts.horizontalAlign);
			
			html += '<!DOCTYPE html>';
			html += '<html><head>';
			html += '<meta charset="UTF-8">';
			html += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			html += (Ext.isEmpty(opts.title) ? '' : '<title>'+Ext.String.htmlEncode(opts.title)+'</title>');
			html += '<style media="print">';
			html += 'html, body { height:100%;width:100%;margin:0;padding:0; }';
			if (!Ext.isEmpty(vaStyle) || !Ext.isEmpty(haStyle)) {
				html += '#printable { display:flex;height:100%;' + vaStyle + haStyle + ' }';
			}
			html += '</style>';
			html += '</head><body>';
			html += '<div id="printable">';
			html += printable;
			html += '</div>';
			html += '</body></html>';
			me.printRawHtml(html);
		}
		//TODO: add other types from print.js lib! :)
	},
	
	privates: {
		printRawHtml: function(html) {
			var iframeId = Ext.id(null, 'so-printer-if-'),
				iframeEl = Ext.getBody().appendChild({
					id: iframeId,
					tag: 'iframe',
					width: '100%',
					height: '100%',
					// This fixes Chrome display bug: see https://bugs.chromium.org/p/chromium/issues/detail?id=735059
					style: 'visibility:hidden;pointer-events:none;border:none;'
				}),
				iframeCW = iframeEl.dom.contentWindow;
			
			iframeEl.dom.onload = function() {
				iframeCW.focus();
				iframeCW.print();
				Ext.fly(iframeId).destroy();
			};
			iframeCW.document.open();
			iframeCW.document.write(html);
			iframeCW.document.close();
		},
		
		verticalAlignToCssProp: function(va) {
			var value = null;
			if ('top' === va) {
				value = 'flex-start';
			} else if ('center' === va) {
				value = 'center';
			} else if ('bottom' === va) {
				value = 'flex-end';
			}
			return value ? 'align-items:'+value+';' : '';
		},
		
		horizontalAlignToCssProp: function(va) {
			var value = null;
			if ('left' === va) {
				value = 'start';
			} else if ('center' === va) {
				value = 'center';
			} else if ('right' === va) {
				value = 'end';
			}
			return value ? 'justify-content:'+value+';' : '';
		}
	}
});
