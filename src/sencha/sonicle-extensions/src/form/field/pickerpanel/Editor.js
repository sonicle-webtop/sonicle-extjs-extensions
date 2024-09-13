/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.pickerpanel.Editor', {
	extend: 'Ext.panel.Panel',
	alias: ['widget.sopickerpanelfieldeditor'],
	
	border: false,
	
	config: {
		value: null
	},
	
	/**
	 * @cfg {Boolean} showButtons
	 * True to show ok and cancel buttons below the picker.
	 */
	showButtons: true,
	
	okText: 'OK',
	cancelText: 'Cancel',
	
	referenceHolder: true,
	defaultBindProperty: 'value',
	twoWayBindable: [
		'value'
	],
	
	keyMap: {
		scope: 'this',
		enter: 'onEnterKey'
	},
	
	/**
	 * @template
	 * @method
	 * @protected
	 * Allows addition of behaviour for focusing a field/component on expand.
	 */
	focusField: Ext.emptyFn,
	
	/**
	 * @template
	 * @method
	 * @protected
	 * Allows addition of behaviour for syncing value before firing ok event.
	 */
	syncValue: Ext.emptyFn,
	
	viewModel: {
		data: {
			data: {}
		}
	},
	
	constructor: function(cfg) {
		var me = this;
		me.callParent([cfg]);
		
		WTU.applyFormulas(me.getViewModel(), {
			isValid: {
				bind: {bindTo: '{data.data}', deep: true},
				get: function(data) {
					return me.doValidate(data);
				}
			}
		});
	},
	
	initComponent: function() {
		var me = this;
		if (me.showButtons) {
			me.buttons = [
				{
					xtype: 'button',
					bind: {
						disabled: '{!isValid}'
					},
					text: me.okText,
					handler: me.onOk,
					scope: me
				}, {
					xtype: 'button',
					text: me.cancelText,
					handler: me.onCancel,
					scope: me
				}
			];
		}
		me.callParent(arguments);
	},
	
	onDestroy: function() {
		this.clearListeners();
		this.callParent();
	},
	
	privates: {
		onEnterKey: function() {
			this.onOk();
		},
		
		onOk: function() {
			var me = this;
			me.syncValue();
			me.fireEvent('ok', me, me.getValue());
		},

		onCancel: function() {
			this.fireEvent('cancel', this);
		},
		
		doValidate: function() {
			return true;
		}
	}
});
