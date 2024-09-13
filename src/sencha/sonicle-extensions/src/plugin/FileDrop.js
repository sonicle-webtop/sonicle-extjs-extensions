/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * @deprecated Use Sonicle.plugin.DropMask instead (DropMask is more generic and needs to be configured properly for filtering unwanted drag operations)
 */
Ext.define('Sonicle.plugin.FileDrop', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.sofiledrop',
	
	text: 'Drop files here',
	
	init: function(cmp) {
		var me = this;
		Ext.log.warn('"Sonicle.plugin.FileDrop" is deprecated. Use "Sonicle.plugin.DropMask" instead.');
		me.setCmp(cmp);
		cmp.on({
			element: 'el',
			drop: me.onDrop,
			dragenter: me.onDragEnter,
			dragleave: me.onDragLeave,
			scope: me
		});
	},
	
	destroy: function() {
		var me = this,
			el = this.getCmp().getEl();
		if(el) {
			el.un({
				drop: me.onDrop,
				dragenter: me.onDragEnter,
				dragleave: me.onDragLeave
			});
		}
	},
	
	first: false,
	second: false,
	
	reset: function() {
		var me = this;
		me.first = false;
		me.second = false;
		me.getCmp().unmask();
	},
	
	onDrop: function(e) {
		this.reset();
	},
	
	onDragEnter: function(e) {
		var me = this;
		if (!e.browserEvent.dataTransfer || Ext.Array.from(e.browserEvent.dataTransfer.types).indexOf('Files') === -1) return;
		e.stopEvent();
		if(me.first) {
			me.second = true;
		} else {
			me.first = true;
			me.getCmp().mask(me.text, 'so-filedrop');
			/*
			el = this.getCmp().getEl();
			if(el) {
				el.dom.pseudoStyle('before', 'content', '');
				el.addCls('so-filedrop-drophere');
			}
			*/
		}
	},
	
	onDragLeave: function(e) {
		var me = this;
		e.stopEvent();
		if(me.second) {
			me.second = false;
		} else if (me.first) {
			me.first = false;
		}
		if(!me.first && !me.second) {
			me.getCmp().unmask();
			
			/*
			el = this.getCmp().getEl();
			if(el) {
				el.dom.pseudoStyle('before', 'content', "'"+me.dropHereText+"'");
				el.removeCls('so-filedrop-drophere');
			}
			*/
		}
	}
});
