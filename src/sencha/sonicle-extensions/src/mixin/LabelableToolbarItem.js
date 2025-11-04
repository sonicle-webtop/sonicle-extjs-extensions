/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.mixin.LabelableToolbarItem', {
	extend: 'Ext.Mixin',
	requires: [
		'Sonicle.String'
	],
	
	mixinConfig: {
		id: 'so-labelabletbitem'
	},
	
	/**
	 * @cfg {String} labelSeparator
	 * Character(s) to be inserted at the end of the {@link #valueLabel label text}.
	 * Set to empty string to hide the separator completely.
	 */
	labelSeparator: ':',
	
	/**
	 * @cfg {String} labelClsExtra
	 * An optional string of one or more additional CSS classes to add to the label element. Defaults to empty.
	 */
	
	/**
	 * @cfg {String} labelStyle
	 * A CSS style specification string to apply directly to this field's label.
	 */
	
	/**
	 * @cfg {Boolean} hideLabel
	 * Set to true to completely hide the label element ({@link #valueLabel} and
	 * {@link #labelSeparator}). Also see {@link #hideEmptyLabel}, which controls whether space
	 * will be reserved for an empty valueLabel.
	 */
	hideLabel: false,
	
	/**
	 * @cfg {Boolean} hideEmptyLabel
	 * When set to true, the label element ({@link #valueLabel} and {@link #labelSeparator})
	 * will be automatically hidden if the {@link #valueLabel} is empty. Setting this to false
	 * will cause the empty label element to be rendered and space to be reserved for it;
	 * this is useful if you want a field without a label to line up with other labeled fields
	 * in the same toolbar.
	 * 
	 * If you wish to unconditionall hide the label even if a non-empty valueLabel is configured,
	 * then set the {@link #hideLabel} config to true.
	 */
	//hideEmptyLabel: true,
	
	getValueLabel: function() {
		return this.valueLabel;
	},
	
	setValueLabel: function(label) {
		label = label || '';
		this.valueLabel = label;
	},
	
	privates: {
		buildLabelableHtml: function() {
			var me = this,
				label = me.getValueLabel(),
				separator = me.labelSeparator || '',
				extraCls = me.labelClsExtra || '',
				style = me.labelStyle || '',
				html = '';
			
			if (!Ext.isEmpty(label) && me.hideLabel !== true) {
				html += '<span';
				html += ' class="' + Ext.Element.unselectableCls + ' ' + extraCls + '"';
				html += ' style="' + style + '">';
				html += Sonicle.String.htmlEncode(label + separator) + '&nbsp;';
				html += '</span>';
			}
			return html;
		}
	}
});