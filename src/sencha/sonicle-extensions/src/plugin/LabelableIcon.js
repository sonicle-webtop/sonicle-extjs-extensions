/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.plugin.LabelableIcon', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.solabelableicon',
	requires: [
		'Sonicle.String'
	],
	
	/**
	 * @cfg {String} labelIcon
	 * Path to an image to use as an icon.
	 */
	labelIcon: null,
	
	/**
	 * @cfg {String} labelIconCls
	 * One or more space separated CSS classes to be applied to the icon element.
	 */
	labelIconCls: null,
	
	/*
	 * @cfg {Number} iconWidth
	 * The width in pixel of the icon.
	 */
	iconWidth: 16,
	
	/*
	 * @cfg {Number} iconHeight
	 * The height in pixel of the icon.
	 */
	iconHeight: 16,
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		if (field.isLabelable) {
			me.setupIconRenderTpl(field);
		}
	},
	
	_baseLabelIconCls: 'so-' + 'label-icon-el',
	_iconedLabelCls: 'so-' + 'item-label-iconed',
	
	setLabelIconCls: function(labelIconCls) {
		
	},
	
	setLabelIconTooltip: function(tooltip, initial) {
		
	},
	
	privates: {
		setupIconRenderTpl: function(field) {
			var me = this;
			field.addChildEl('labelIconEl');
			field.beforeLabelTextTpl = [
				'<span id="{id}-labelIconEl" data-ref="labelIconEl" role="presentation" unselectable="on" class="{baseLabelIconCls} ',
						'{baseLabelIconCls}-{ui} {labelIconCls}" style="',
					'<tpl if="labelIconUrl">background-image:url({labelIconUrl});</tpl>">',
				'</span>'
			];
			Ext.Function.interceptBefore(field, 'getInsertionRenderData', function(data, names) {
				var SoS = Sonicle.String,
					baseLabelIconCls = me._baseLabelIconCls;
				
				Ext.apply(data, {
					baseLabelIconCls: baseLabelIconCls,
					labelIconUrl: SoS.coalesce(me.labelIcon, field.labelIcon),
					labelIconCls: SoS.coalesce(me.labelIconCls, field.labelIconCls)
				});
				
				if (!Ext.isEmpty(data.labelIconUrl) || !Ext.isEmpty(data.labelIconCls)) {
					data.labelClsExtra += ' '+me._iconedLabelCls;
				}
			});

			Ext.apply(field, {
				setLabelIconCls: Ext.bind(me.setLabelIconCls, me),
				setLabelIconTooltip: Ext.bind(me.setLabelIconTooltip, me)
			});
		}
	}
});