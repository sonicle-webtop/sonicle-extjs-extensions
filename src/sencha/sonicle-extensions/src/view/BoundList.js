/*
 * Sonicle ExtJs UX
 * Copyright (C) 2019 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * Inspired by http://www.coding-ideas.de/2018/03/22/grouping-combobox-field/?cookie-state-change=1572450122746
 */
Ext.define('Sonicle.view.BoundList', {
	extend: 'Ext.view.BoundList',
	alias: 'widget.soboundlist',
	uses: [
		'Sonicle.String'
	],
	
	/**
	 * @cfg {String} [groupField]
	 * The field from the store to group the view.
	 */
	
	/**
	 * @cfg {String} [iconField]
	 * The field from the store to show icon in the view.
	 */
	
	/**
	 * @cfg {String} [colorField]
	 * The field from the store to use as swatch fill color.
	 */
	
	/**
	 * @cfg {String} [sourceField]
	 * The field from the store to show source/origin info in the view.
	 */
	
	/**
	 * @cfg {Function} [getSource]
	 * A function which returns the source/origin info in the view.
	 */
	
	/**
	 * @cfg {Integer} groupingThreshold [groupingThreshold=1]
	 * The minimun number of groups count in order to activate grouping feature.
	 * `true` to enable grouping for 
	 */
	groupingThreshold: 1,
	
	/**
	 * @cfg {swatch|text} colorize [colorize=swatch]
	 * Specify the target element on which apply the color: the marker itself or display text.
	 */
	colorize: 'swatch',
	
	/**
	 * @cfg {rounded|square|circle} [swatchGeometry=rounded]
	 * Changes the geometry of the swatch that displays the color.
	 */
	swatchGeometry: 'rounded',
	
	/**
	 * @cfg {String} [groupCls]
	 * An additional CSS class (or classes) to be added to group element.
	 */
	
	/**
	 * @cfg {String} [sourceCls]
	 * An additional CSS class (or classes) to be added to source element.
	 */
	
	listItemCls: 'so-'+'boundlist-item',
	groupListItemCls: 'so-'+'boundlist-groupitem',
	swatchListItemCls: 'so-'+'boundlist-swatchitem',
	itemIconCls: 'so-'+'boundlist-icon',
	itemDisplayCls: 'so-'+'boundlist-display',
	itemSourceCls: 'so-'+'boundlist-source',
	itemSwatchCls: 'so-'+'boundlist-swatch',
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Change default itemSelector to our list-item CSS class.
		// This allows to use the original class within the new group-item 
		// and so make it look similar (across themes) to the other list-items.
		me.itemSelector = '.' + me.listItemCls;
	},
	
	refresh: function() {
		var me = this;
		me.callParent(arguments);
		if (me.tpl) {
			me.tpl.groupingThreshold = me.evalGroupThreshold();
			me.tpl.lastGroupValue = false;
		}
	},
	
	generateTpl: function() {
		var me = this,
				hasGroup = !Ext.isEmpty(me.groupField),
				hasIcon = !Ext.isEmpty(me.iconField),
				hasColor = !Ext.isEmpty(me.colorField),
				fnGetSource = !Ext.isFunction(me.getSource) ? Ext.emptyFn : function(values) {
					return me.getSource.apply(me, [values]);
				},
				liCls;
		
		if (hasGroup || hasIcon || hasColor) { // Setup modified template supporting new markup
			liCls = me.itemCls + ' ' + me.listItemCls;
			if (hasIcon || hasColor) liCls += (' ' + me.swatchListItemCls);
			me.tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<tpl if="this.grouping && this.groupingThreshold && this.showGroupItem(' + me.groupField + ')">',
						'<li class="' + me.itemCls + ' ' + me.groupListItemCls + '"> ' + me.getGroupInnerTpl(me.groupField) + '</li>',
					'</tpl>',
					'<li role="option" unselectable="on" class="' + liCls + '">' + me.getInnerTpl(me.displayField) + '</li>',
				'</tpl>',
				// <tpl if="this.grouping && this.showGroupTitle(' + me.groupField + ')">style="padding-left:15px"</tpl>
				{
					grouping: hasGroup,
					groupingThreshold: me.evalGroupThreshold(),
					lastGroupValue: false,
					showGroupItem: function(groupValue) {
						//if (!this.grouping) return false;
						if (!this.lastGroupValue || (groupValue !== this.lastGroupValue)) {
							this.lastGroupValue = groupValue;
							return true;
						} else {
							return false;
						}
					},
					generateSwatchColorStyles: function(values, colorField) {
						return !Ext.isEmpty(colorField) ? Sonicle.view.BoundList.generateColorStyles('swatch', values[colorField]) : '';
					},
					generateDisplayColorStyles: function(values, colorField) {
						return !Ext.isEmpty(colorField) ? Sonicle.view.BoundList.generateColorStyles('text', values[colorField]) : '';
					},
					getSource: fnGetSource
				}
			);
			
		} else { // Setup original BoundList template + injected get functions
			// We cannot use callParent here because we have to inject our listItemCls 
			// in order to make hovering and selection compatible with new item selector.
			me.tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<li role="option" unselectable="on" class="' + me.itemCls + ' ' + me.listItemCls + '">' + me.getInnerTpl(me.displayField) + '</li>',
				'</tpl>',
				{
					getSource: fnGetSource
				}
			);
		}		
	},
	
	getGroupInnerTpl: function(groupField) {
		return '<span class="' + this.itemDisplayCls + ' ' + Sonicle.String.deflt(this.groupCls, '') + '">{' + groupField + '}</span>';
	},
	
	getInnerTpl: function(displayField) {
		var me = this,
				hasIcon = !Ext.isEmpty(me.iconField),
				hasColor = !Ext.isEmpty(me.colorField),
				hasSource = !Ext.isEmpty(me.sourceField) || Ext.isFunction(me.getSource),
				colorizeSwatch = (me.colorize === 'swatch'),
				geomSwatchCls, swatchStyle, displayStyle, source;
		
		if (hasIcon || hasColor || hasSource) { // Return modified innerTpl to support new features
			if (hasIcon && hasColor && colorizeSwatch) hasColor = false;
			geomSwatchCls = me.itemSwatchCls + '-' + me.swatchGeometry;
			swatchStyle = (hasColor && colorizeSwatch) ? '{[this.generateSwatchColorStyles(values, "' + me.colorField + '")]}' : '';
			displayStyle = (hasColor && !colorizeSwatch) ? '{[this.generateDisplayColorStyles(values, "' + me.colorField + '")]}' : '';
			source = Ext.isFunction(me.getSource) ? '[this.getSource(values)]' : me.sourceField;
			
			return (hasSource ? '<div style="float:left; white-space: pre;">' : '')
					+ (hasIcon ? '<div class="' + me.itemIconCls + ' {' + me.iconField + '}"></div>' : '')
					+ (hasColor && colorizeSwatch ? '<div class="' + me.itemSwatchCls + ' ' + geomSwatchCls + '" style="' + swatchStyle + '")]}"></div>' : '')
					+ '<span class="' + me.itemDisplayCls + '" style="' + displayStyle + '">{' + displayField + '}</span>'
					+ (hasSource ? '</div>' : '')
					+ (hasSource ? '<div class="' + me.itemSourceCls + ' ' + Sonicle.String.deflt(me.sourceCls, '') + '">{' + source + '}</div>' : '');
			
		} else { // Return original innerTpl
			return me.callParent(arguments);
		}
	},
	
	privates: {
		evalGroupThreshold: function() {
			var me = this, groups;
			if (me.store) {
				groups = me.store.getGroups();
				if (groups) return groups.length >= me.groupingThreshold;
			}
			return false;
		}
	},
	
	statics: {
		generateColorStyles: function(colorize, color) {
			if (colorize === 'swatch') {
				if (color === '#FFFFFF') {
					return Ext.dom.Helper.generateStyles({
							backgroundColor: '#FFFFFF',
							border: '1px solid #A8A8A8'
						});
				} else {
					return Ext.dom.Helper.generateStyles({
							backgroundColor: color,
							border: 'none'
						});
				}
			} else if (colorize === 'text') {
				return Ext.dom.Helper.generateStyles({
					color: color
				});
			} else {
				return '';
			}
		}
	}
});
