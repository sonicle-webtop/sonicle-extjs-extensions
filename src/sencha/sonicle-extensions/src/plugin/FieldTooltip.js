/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.FieldTooltip', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sofieldtooltip',
	
	/**
	 * @cfg {String/Object} tooltip
	 * This configuration option is to be applied to the **field `object`** 
	 * that uses {@link Sonicle.plugin.FieldTooltip this plugin}.
	 * It can be a string to be used as innerHTML (html tags are accepted) or 
	 * QuickTips config object.
	 */
	
	/**
	 * @cfg {field|field-bottom|label} tooltipTarget
	 * The target element on which display the tooltip.
	 */
	tooltipTarget: 'field',
	
	/**
	 * @cfg {String} tooltipType
	 * The type of tooltip to use. Either 'qtip' for QuickTips or 'title' 
	 * for title attribute, or 'text' to display a text under field.
	 */
	tooltipType: 'qtip',
	
	/**
	 * @cfg {String} tooltipWrapExtraCls
	 * An additional CSS class (or classes) to be added to the tooltip's text element.
	 * Can be a single class name (e.g. 'foo') or a space-separated list of class names (e.g. 'foo bar').
	 */
	
	/**
	 * @cfg {String} tooltipWrapStyle ???????????
	 */
	
	tooltipWrapCls: Ext.baseCSSPrefix + 'form-error-wrap',
	tooltipWrapUnderCls: Ext.baseCSSPrefix + 'form-error-wrap-under',
	tooltipWrapUnderSideLabelCls: Ext.baseCSSPrefix + 'form-error-wrap-under-side-label',
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		field.on('render', me.onCmpRender, me, {single: true});
	},
	
	destroy: function() {
		var me = this,
				cmp = me.getCmp();
		if (cmp.rendered) {
			me.clearTooltip();
		}
	},
	
	onCmpRender: function(s) {
		var me = this,
				cmp = me.getCmp();
		if (cmp.tooltip) {
			me.setTooltip(cmp.tooltip, true);
		}
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
				cmp = me.getCmp(),
				el;
		if (cmp.rendered) {
			if (!initial || !tooltip) me.clearTooltip();
			if (tooltip) {
				if ('field-bottom' === me.tooltipTarget && Ext.isString(tooltip)) {
					el = cmp.errorWrapEl || cmp.bodyEl;
					me.ttWrapEl = el.insertSibling({
						id: cmp.id + '-ttWrapEl',
						tag: 'div',
						cls: me.tooltipWrapCls + ' ' + me.tooltipWrapCls + '-' + me.ui + ' ' + me.tooltipWrapUnderCls + ' ' + me.tooltipWrapUnderSideLabelCls + (me.tooltipWrapExtraCls || ''),
						html: tooltip
					}, 'after');
					
				} else {
					el = me.getTooltipTgtEl();
					if (el) {
						if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
							Ext.tip.QuickTipManager.register(Ext.apply({
								target: el.id
							}, tooltip));
							cmp.tooltip = tooltip;

						} else {
							el.dom.setAttribute(me.getTooltipAttr(), tooltip);
						}
					}
				}
			}
			
		} else {
			cmp.tooltip = tooltip;
		}
	},
	
	privates: {
		clearTooltip: function() {
			var me = this,
					cmp = me.getCmp(),
					el;

			if ('field-bottom' === me.tooltipTarget) {
				if (cmp.ttWrapEl) {
					cmp.ttWrapEl.destroy();
					delete cmp.ttWrapEl;
				}
				
			} else {
				el = me.getTooltipTgtEl();
				if (el) {
					if (Ext.quickTipsActive && Ext.isObject(cmp.tooltip)) {
						Ext.tip.QuickTipManager.unregister(el);

					} else {
						el.dom.removeAttribute(me.getTooltipAttr());
					}
				}
			}
		},
		
		getTooltipTgtEl: function() {
			var cmp = this.getCmp(), tt = this.tooltipTarget;
			if ('field' === tt) return cmp.inputEl;
			if ('label' === tt) return cmp.boxLabelEl || cmp.labelEl;
			return null;
		},
		
		getTooltipAttr: function() {
			var tt = this.tooltipType;
			if ('qtip' === tt) return 'data-qtip';
			if ('title' === tt) return 'title';
			return null;
		}
	}
});
