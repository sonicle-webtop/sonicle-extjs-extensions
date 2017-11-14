/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.PrintMgr', {
	singleton: true,
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		
		if(!me.printer) {
			me.printer = Ext.create({
				xtype: 'component',
				id: 'printer',
				// This fixes Chrome display bug: see https://bugs.chromium.org/p/chromium/issues/detail?id=735059
				style: 'visibility:hidden;pointer-events:none;border:none;',
				html: {
					tag: 'iframe',
					id: 'printer-iframe',
					width: '100%',
					height: '100%',
					frameborder: '0'
				},
				renderTo: Ext.getBody()
			});
		}
	},
	
	destroy: function() {
		Ext.destroy(this.printer);
		this.printer = undefined;
	},
	
	print: function(html) {
		var me = this, iframe, cw;
		if(me.printing) {
			Ext.log.warn('Printer is busy. Retry later...');
			return;
		}
		
		me.printing = true;
		iframe = me.printer.getEl().down('#printer-iframe');
		cw = iframe.dom.contentWindow;
		cw.document.open();
		cw.document.write(html);
		cw.document.close();
		
		Ext.defer(function() {
			cw.focus();
			cw.print();
			me.printing = false;
		}, 500);
	}
});
