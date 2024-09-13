Ext.define('Sonicle.form.Feedback', {
	extend: 'Ext.Component',
	alias: 'widget.soformfeedback',
    requires: [
		'Sonicle.String'
	],
	
	config: {
		accent: true,
		type: 'info',
		title: undefined,
		text: ''
	},
	
	baseCls: 'so-' + 'formfeedback',
	infoIconCls: 'fas fa-info-circle',
	alertIconCls: 'fas fa-times-circle',
	warningIconCls: 'fas fa-exclamation-triangle',
	successIconCls: 'fas fa-times-circle',
	
	renderTpl: [
		'<div id="{id}-wrapEl" data-ref="wrapEl" class="{baseCls}-wrap" role="presentation">',
			'<div id="{id}-iconEl" data-ref="iconEl" class="{baseCls}-icon {iconCls}" aria-hidden="true"></div>',
			'<div id="{id}-textWrapEl" data-ref="textWrapEl" class="{baseCls}-textwrap">',
			'<tpl if="hasTitle">',
				'<div id="{id}-titleEl" data-ref="titleEl" class="{baseCls}-title {titleCls}">{title}</div>',
			'</tpl>',
				'<div id="{id}-textEl" data-ref="textEl" class="{baseCls}-text {textCls}">{text}</div>',
			'</div>',
		'</div>'
	],
	childEls: ['iconEl', 'titleEl', 'textEl'],
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Make component unselectable and force a minimal height
		me.addCls('x-unselectable');
		me.addCls('x-form-item-body-default');
		me.addCls(me.baseCls + '-' + me.getType());
		if (me.accent === true) me.addCls(me.baseCls + '-accent');
	},
	
	initRenderData: function() {
		var me = this,
			SoS = Sonicle.String,
			iconCls = SoS.deflt(me[me.type+'IconCls'], me.infoIconCls),
			hasTitle = !Ext.isEmpty(me.title);
		
		return Ext.apply(me.callParent(), {
			iconCls: iconCls,
			titleCls: me.titleCls || '',
			textCls: me.textCls || '',
			hasTitle: hasTitle,
			title: SoS.htmlEncode(me.title),
			text: SoS.htmlEncode(SoS.htmlEncodeLineBreaks(me.text))
		});
	},
	
	updateAccent: function(v) {
		var me = this,
			accentCls = me.baseCls + '-accent';
		me[v === true ? 'addCls' : 'removeCls'](accentCls);
	},
	
	applyType: function(type) {
		return Sonicle.String.isIn(type, ['info', 'alert', 'warning', 'success']) ? type : 'info';
	},
	
	updateType: function(v, ov) {
		var me = this,
			baseCls = me.baseCls;
		me.removeCls(me.baseCls + '-' + ov);
		me.addCls(me.baseCls + '-' + v);
	},
	
	updateTitle: function(v) {
		var me = this;
		if (me.rendered) {
			if (me.titleEl) {
				me.titleEl.update(Sonicle.String.htmlEncode(v));
			} else {
				me.updateLayout();
			}
		}
	},
	
	updateText: function(v) {
		var me = this,
			SoS = Sonicle.String;
		if (me.rendered) {
			me.textEl.update(SoS.htmlEncode(SoS.htmlEncodeLineBreaks(v)));
		}
	}
});