/*
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.form.field.Password', {
	extend:'Ext.form.field.Text',
	alias: 'widget.sopasswordfield',
	requires: [
		'Sonicle.Utils'
	],
	
	inputType: 'password',
	
	config: {
		showPassword: false
	},
	
	eyeTriggerCls: 'so-passwordfield-trigger-eye',
	eyeTriggerClsOn: 'far fa-eye-slash',
	eyeTriggerClsOff: 'far fa-eye',
	
	constructor: function(cfg) {
		var me = this,
			SoU = Sonicle.Utils,
			icfg = SoU.getConstructorConfigs2(this, cfg, ['triggers', 'eyeTriggerCls', 'eyeTriggerClsOff']);
		
		cfg.triggers = SoU.mergeTriggers(icfg.triggers, {
			eye: {
				weight: -1,
				cls: icfg.eyeTriggerCls + ' ' + icfg.eyeTriggerClsOff,
				handler: function(s) {
					me.setShowPassword(!me.showPassword);
				}
			}
		});
		me.callParent([cfg]);
	},
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.setShowPassword(me.showPassword);
	},
	
	updateShowPassword: function(nv, ov) {
		this.refreshShowPassword(nv);
	},
	
	privates: {
		refreshShowPassword: function(show) {
			var me = this,
				onCls = me.eyeTriggerClsOn,
				offCls = me.eyeTriggerClsOff,
				trigger = me.getTrigger('eye'),
				tel;
			
			if (trigger && (tel = trigger.getEl())) {
				tel.removeCls(onCls);
				tel.removeCls(offCls);
				tel.addCls(show ? onCls : offCls);
			}
			if (me.inputEl) me.inputEl.set({type: show ? 'text' : 'password'});
		}
	}
});
