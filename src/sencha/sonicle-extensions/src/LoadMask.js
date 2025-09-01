/**
 * Sonicle ExtJs UX
 * Copyright (C) 2025 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.LoadMask', {
	extend: 'Ext.LoadMask',
	alias: ['widget.soloadmask'],
	
	/**
	 * @cfg {Boolean} [useButton=false]
	 * Whether or not to use a button next to the loading message.
	 */
	useButton: false,
	
	/**
	 * @cfg {String} [buttonText="Cancel"]
	 * The text to display as clickable button.
	 */
	buttonText: 'Cancel',
	
	msgButtonCls: 'so-' + 'mask-button',
	
	/* eslint-disable indent, max-len */
	renderTpl: [
		'<div id="{id}-msgWrapEl" data-ref="msgWrapEl" class="{[values.$comp.msgWrapCls]}" role="presentation">',
			'<div id="{id}-msgEl" data-ref="msgEl" class="{[values.$comp.msgCls]} ',
				Ext.baseCSSPrefix, 'mask-msg-inner {childElCls}" role="presentation">',
				'<div id="{id}-msgTextEl" data-ref="msgTextEl" class="',
					Ext.baseCSSPrefix, 'mask-msg-text',
					'{childElCls}" role="presentation">{msg}</div>',
				'<tpl if="useButton">', // <-- added
				'<div id="{id}-msgButtonWrapEl" data-ref="msgButtonWrapEl" class="x-unselectable {[values.$comp.msgButtonCls]}-wrap" role="presentation">', // <-- added
					'<a id="{id}-msgButtonEl" data-ref="msgButtonEl" class="', // <-- added
						'{[values.$comp.msgButtonCls]}', // <-- added
						'" role="presentation"><span class="{[values.$comp.msgButtonCls]}-text">{buttonText}</span></a>', // <-- added
				'</div>', // <-- added
				'</tpl>', // <-- added
			'</div>',
		'</div>'
	],
	/* eslint-enable indent, max-len */
	childEls: ['msgWrapEl', 'msgEl', 'msgTextEl', 'msgButtonWrapEl', 'msgButtonEl'],
	
	initRenderData: function() {
		var me = this,
			SoS = Sonicle.String,
			data = me.callParent(arguments);
		
		data.useButton = Ext.isBoolean(me.useButton) ? me.useButton : false;
		data.buttonText = me.buttonText || '';
		if (me.encodeText) data.buttonText = SoS.htmlEncode(data.buttonText);
        return data;
	},
	
	onRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.msgButtonEl) {
			me.msgButtonEl.on('click', me.onButtonElClick, me, {
				preventDefault: true,
				stopEvent: true
			});
		}
	},
	
	setMessage: function(msg) {
		if (this.msgTextEl) {
			this.msgTextEl.setHtml(msg);
		}
	},
	
	privates: {
		onButtonElClick: function(e) {
			var me = this;
			me.fireEvent('buttonclick', me);
		}
	}
});