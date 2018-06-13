/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.FieldIcon', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sofieldicon',
	
	/**
	 * @cfg {afterInput|beforeInput|afterLabel|beforeLabel} iconAlign [iconAlign=afterInput]
	 * Sets the position for where the icon will be displayed related to the field.
	 */
	iconAlign: 'afterInput',
	
	iconCls: null,
	
	iconType: 'font',
	
	iconColor: '#B3B3B3',
	
	/*
	 * @cfg {Number} width
	 * The width in pixel of the icon.
	 */
	iconWidth: 16,
	
	/*
	 * @cfg {Number} height
	 * The height in pixel of the icon.
	 */
	iconHeight: 16,
	
	iconCursor: null,
	
	iconMargin: '0 3px 0 3px',
	
	cellWidthAdjust: 6,
	
	/**
	 * @cfg {String/Object} tooltip
	 * It can be a string to be used as innerHTML (html tags are accepted) or 
	 * QuickTips config object.
	 */
	
	/**
	 * @cfg {String} tooltipType
	 * The type of tooltip to use. Either 'qtip' for QuickTips or 'title' 
	 * for title attribute.
	 */
	tooltipType: 'qtip',
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		field.on('render', me.onCmpRender, me, {single: true});
		
		Ext.apply(field, {
			setIconCls: function(iconCls) {
				me.setIconCls(iconCls);
			},
			setIconTooltip: function(tooltip) {
				me.setTooltip(tooltip);
			}
		});
	},
	
	destroy: function() {
		var me = this,
				cmp = me.getCmp();
		if (cmp.rendered) {
			me.clearTip();
		}
	},
	
	onCmpRender: function(s) {
		var me = this,
				cmp = me.getCmp(),
				isChk = cmp.isXType('checkbox'),
				isTA = cmp.isXType('textarea'),
				icoElCfg = me.createIconElConfig(),
				wrapElCfg = {
					tag: 'div',
					style: {
						display: 'table-cell',
						lineHeight: 0,
						verticalAlign: 'middle',
						width: (me.iconWidth + me.cellWidthAdjust) + 'px'
					},
					cn: [icoElCfg]
				},
				el;
		
		if (isTA) {
			Ext.apply(wrapElCfg.style, {
				verticalAlign: 'bottom',
				paddingTop: '3px'
			});
		}
		
		switch(me.iconAlign) {
			case 'afterInput':
				if (isChk) {
					el = cmp.inputEl.insertSibling(icoElCfg, 'after');
				} else {
					el = cmp.bodyEl.insertSibling(wrapElCfg, 'after');
					el = el.down('i');
				}
				break;
			case 'beforeInput':
				el = cmp.labelEl.next().insertSibling(wrapElCfg, 'before');
				el = el.down('i');
				break;
			case 'afterLabel':
				if (isChk && cmp.boxLabelEl) {
					Ext.apply(icoElCfg.style, {
						verticalAlign: 'middle'
					});
					el = cmp.boxLabelEl.insertSibling(icoElCfg, 'after');
				} else {
					el = cmp.labelEl.insertSibling(wrapElCfg, 'after');
				}
				break;
			case 'beforeLabel':
				if (isChk && cmp.boxLabelEl) {
					Ext.apply(icoElCfg.style, {
						marginLeft: (me.iconWidth + me.cellWidthAdjust / 2) + "px"
					});
					cmp.boxLabelEl.setStyle({
						paddingLeft: 0
					});
					el = cmp.boxLabelEl.insertSibling(icoElCfg, 'before');
				} else {
					el = cmp.labelEl.insertSibling(wrapElCfg, 'before');
					el = el.down('i');
				}
				break;
		}
		
		cmp.iconEl = el;
		if (me.tooltip) {
			me.setTooltip(me.tooltip, true);
		}
	},
	
	setIconCls: function(iconCls) {
		var me = this,
				cmp = me.getCmp();
		if (cmp.rendered) {
			cmp.iconEl.replaceCls(me.iconCls, iconCls);
		}
		me.iconCls = iconCls;
	},
	
	/**
	 * Sets the tooltip for this Button.
	 * @param {String/Object} tooltip This may be:
	 * 
	 *	- **String** : A string to be used as innerHTML (html tags are accepted) to show in a tooltip
	 *	- **Object** : A configuration object for {@link Ext.tip.QuickTipManager#register}.
	 */
	setTooltip: function(tooltip, initial) {
		var me = this,
				cmp = me.getCmp();
		if (cmp.rendered) {
			if (!initial || !tooltip) me.clearTip();
			if (tooltip) {
				if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
					Ext.tip.QuickTipManager.register(Ext.apply({
						target: cmp.iconEl.id
					}, tooltip));
					me.tooltip = tooltip;
				} else {
					cmp.iconEl.dom.setAttribute(me.getTipAttr(), tooltip);
				}
				//cmp.iconEl.setStyle('cursor', 'pointer');
			}
		} else {
			me.tooltip = tooltip;
			//me.iconCursor = 'pointer';
		}
	},
	
	/**
	 * @private
	 */
	clearTip: function() {
		var me = this,
				cmp = me.getCmp(),
				el = cmp.iconEl;
		if (Ext.quickTipsActive && Ext.isObject(me.tooltip)) {
			Ext.tip.QuickTipManager.unregister(el);
		} else {
			el.dom.removeAttribute(me.getTipAttr());
		}
	},
	
	getTipAttr: function() {
		return this.tooltipType === 'qtip' ? 'data-qtip' : 'title';
	},
	
	/**
	 * @private
	 */
	createIconElConfig: function() {
		var me = this,
				cfg = {
					tag: 'i',
					cls: me.iconCls,
					style: {
						display: 'inline-block',
						width: me.iconWidth + 'px',
						height: me.iconHeight + 'px',
						//backgroundSize: me.iconWidth + 'px ' + me.iconHeight + 'px', // Enable 32px aligned svg on 16x16
						fontSize: me.iconHeight + 'px',
						color: me.iconColor,
						margin: me.iconMargin
					}
				};
		if (!Ext.isEmpty(me.iconCursor)) cfg.style['cursor'] = me.iconCursor;
		return cfg;
	}
});
