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
	 * @cfg {String} iconCls
	 * One or more space separated CSS classes to be applied to the icon element.
	 */
	iconCls: null,
	
	/**
	 * @cfg {afterInput|beforeInput|afterLabel|beforeLabel} iconAlign [iconAlign=afterInput]
	 * Sets the position for where the icon will be displayed related to the field.
	 */
	iconAlign: 'afterInput',
	
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
	
	iconWrapElCls: 'so-'+'fieldicon-wrap',
	iconElCls: 'so-'+'fieldicon-icon',
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		Ext.apply(field, {
			setIconCls: Ext.bind(me.setIconCls, me),
			setIconTooltip: Ext.bind(me.setTooltip, me)
		});
		
		if (field.rendered) {
			me.setup();
		} else {
			field.on('render', me.onFieldRender, me, {single: true});
		}
	},
	
	destroy: function() {
		var me = this,
			field = me.getCmp();
		if (field.rendered) {
			me.clearTooltip();
		}
		delete field.iconEl;
		delete field.iconWrapEl;
		me.callParent();
	},
	
	setIconCls: function(iconCls) {
		var me = this,
			field = me.getCmp(),
			iconEl = field.iconEl;
		if (field.rendered && iconEl) {
			iconEl.replaceCls(me.iconCls, iconCls);
			// Updates 'display' style of the wrapper, or the icon, according to iconClass value
			if (field.iconWrapEl) {
				field.iconWrapEl.setStyle('display', Ext.isEmpty(iconCls) ? 'none' : null);
			} else {
				iconEl.setStyle('display', Ext.isEmpty(iconCls) ? 'none' : null);
			}
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
			field = me.getCmp(),
			el = field.iconEl;
		if (field.rendered && el) {
			if (!initial || !tooltip) me.clearTooltip();
			if (tooltip) {
				if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
					Ext.tip.QuickTipManager.register(Ext.apply({
						target: el.id
					}, tooltip));
					me.tooltip = tooltip;
				} else {
					el.dom.setAttribute(me.getTipAttr(), tooltip);
				}
				//cmp.iconEl.setStyle('cursor', 'pointer');
			}
		} else {
			me.tooltip = tooltip;
			//me.iconCursor = 'pointer';
		}
	},
	
	privates: {
		onFieldRender: function(s) {
			this.setup();
		},
		
		setup: function() {
			var me = this,
				field = me.getCmp(),
				isCheckbox = field.isXType('checkbox'),
				isTextArea = field.isXType('textarea'),
				icoElCfg = me.createIconElConfig(),
				wrapElCfg = me.createWrapElConfig([icoElCfg]),
				wrapEl, icoEl;
			
			if (isCheckbox) {
				wrapElCfg.cls += ' ' + me.iconWrapElCls + '-checkbox';
			} else if (isTextArea) {
				wrapElCfg.cls += ' ' + me.iconWrapElCls + '-textarea';
			}
			
			switch(me.iconAlign) {
				case 'afterInput':
					if (isCheckbox) {
						icoEl = field.inputEl.insertSibling(icoElCfg, 'after');
					} else {
						wrapEl = field.bodyEl.insertSibling(wrapElCfg, 'after');
						icoEl = wrapEl.down('i');
					}
					break;
				case 'beforeInput':
					wrapEl = field.labelEl.next().insertSibling(wrapElCfg, 'before');
					icoEl = wrapEl.down('i');
					break;
				case 'afterLabel':
					if (isCheckbox && field.boxLabelEl) {
						icoEl = field.boxLabelEl.insertSibling(icoElCfg, 'after');
					} else {
						wrapEl = field.labelEl.insertSibling(wrapElCfg, 'after');
						icoEl = wrapEl.down('i');
					}
					break;
				case 'beforeLabel':
					if (isCheckbox && field.boxLabelEl) {
						Ext.apply(icoElCfg.style, {
							marginLeft: (me.iconWidth + me.cellWidthAdjust / 2) + "px"
						});
						field.boxLabelEl.setStyle({
							paddingLeft: 0
						});
						icoEl = field.boxLabelEl.insertSibling(icoElCfg, 'before');
					} else {
						wrapEl = field.labelEl.insertSibling(wrapElCfg, 'before');
						icoEl = wrapEl.down('i');
					}
					break;
			}

			field.iconWrapEl = wrapEl;
			field.iconEl = icoEl;
			me.setIconCls(me.iconCls);
			me.setTooltip(me.tooltip, true);
		},
		
		clearTooltip: function() {
			var me = this,
				field = me.getCmp(),
				el = field.iconEl;
			if (field.rendered && el) {
				if (Ext.quickTipsActive && Ext.isObject(me.tooltip)) {
					Ext.tip.QuickTipManager.unregister(el);
				} else {
					el.dom.removeAttribute(me.getTipAttr());
				}
			}
		},
		
		createWrapElConfig: function(children) {
			var me = this,
				cls = me.iconWrapElCls;
			return {
				tag: 'div',
				cls: cls + ' ' + me.toAlignCls(cls, me.iconAlign),
				style: {
					//display: 'table-cell',
					//lineHeight: 0,
					//verticalAlign: 'middle',
					width: (me.iconWidth + me.cellWidthAdjust) + 'px'
				},
				cn: children
			};
		},
		
		createIconElConfig: function() {
			var me = this,
				cls = me.iconElCls;
			return {
				tag: 'i',
				cls: cls + ' ' + me.toAlignCls(cls, me.iconAlign) + ' ' + me.iconCls,
				style: {
					//display: 'inline-block',
					width: me.iconWidth + 'px',
					height: me.iconHeight + 'px',
					//backgroundSize: me.iconWidth + 'px ' + me.iconHeight + 'px', // Enable 32px aligned svg on 16x16
					fontSize: me.iconHeight + 'px'
					//margin: me.iconMargin
				}
			};
		},
		
		toAlignCls: function(baseCls, iconAlign) {
			switch(iconAlign) {
				case 'afterInput':
					return baseCls + '-ai';
				case 'beforeInput':
					return baseCls + '-bi';
				case 'afterLabel':
					return baseCls + '-al';
				case 'beforeLabel':
					return baseCls + '-bl';
				default:
					return '';
			}
		},
		
		getTipAttr: function() {
			return this.tooltipType === 'qtip' ? 'data-qtip' : 'title';
		}
	}
});
