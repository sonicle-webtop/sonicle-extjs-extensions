/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.TextCopy', {
	extend:'Ext.form.field.Text',
	alias: ['widget.sotextcopyfield', 'widget.sotextcopy'],
	requires: [
		'Sonicle.Utils'
	],
	
	editable: false,
	selectOnFocus: true,
	
	copyTriggerCls: 'so-textcopyfield-trigger-copy',
	
	constructor: function(cfg) {
		var me = this, 
				icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, [
					{copyTriggerCls: true}
				]),
				triggers = {};
		
		triggers = Ext.apply(triggers, {
			copy: {
				weight: -1,
				cls: icfg.copyTriggerCls + ' fa fa-clone',
				handler: me.onCopyClick
			}
		});
		Ext.apply(cfg, {triggers: triggers});
		me.callParent([cfg]);
	},
	
	onCopyClick: function(s) {
		var val = s.getValue();
		if (!Ext.isEmpty(val)) Sonicle.ClipboardMgr.copy(val);
	}
});
