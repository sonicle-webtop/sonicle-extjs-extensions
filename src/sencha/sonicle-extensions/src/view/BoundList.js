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
	 * @cfg {Boolean} disableFocusSaving
	 */
	disableFocusSaving: false,
	
	/**
	 * @cfg {String} [groupField]
	 * The field from the store to group the view.
	 */
	
	/**
	 * @cfg {Function} [getGroup]
	 * A function which returns the group info in the view (eg. useful for computing title dynamically).
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #groupField}.
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
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #sourceField}.
	 */
	
	/**
	 * @cfg {Boolean} [enableButton]
	 * Enables or disables displaying an icon-button on item-row.
	 */
	enableButton: false,
	
	/**
	 * @cfg {String} [buttonIconCls]
	 * The icon Class to use with button.
	 */
	buttonIconCls: 'fas fa-times',
	
	/**
	 * @cfg {Function} [shouldShowButton]
	 * A function which returns `true` or `false` whether the button is enabled or not for the item.
	 * @param {Object} values An Object with item fields.
	 */
	
	/**
	 * @cfg {Function} [getButtonTooltip]
	 * A function which returns the tooltip to show on the row.
	 * @param {Object} values An Object with item fields.
	 */
	
	/**
	 * @cfg {Function/String} buttonHandler
	 * A function called when the button is clicked.
	 * @param {Sonicle.view.BoundList} list This list.
	 * @param {Ext.event.Event} e The click event.
	 * @param {Ext.data.Model} record The record that belongs to the item.
	 * @param {HTMLElement} item The item's element.
	 * @param {Number} index The item's index.
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
	itemRightDockedCls: 'so-'+'boundlist-right',
	itemSwatchCls: 'so-'+'boundlist-swatch',
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Change default itemSelector to our list-item CSS class.
		// This allows to use the original class within the new group-item 
		// and so make it look similar (across themes) to the other list-items.
		me.itemSelector = '.' + me.listItemCls;
	},
	
	saveFocusState: function() {
		var me = this,
			navModel = me.getNavigationModel();
		
		// Skip saving/restoring focused record
		if (me.disableFocusSaving) {
			if (navModel) navModel.setPosition(null);
			return Ext.emptyFn;
		} else {
			return me.callParent();
		}
	},
	
	refresh: function() {
		var me = this;
		me.callParent(arguments);
		if (me.tpl) {
			me.tpl.groupingThreshold = me.evalGroupThreshold();
			me.tpl.lastGroupValue = false;
		}
	},
	
	onItemClick: function(record, itm, idx, e, eo) {
		var me = this;
		if (e.getTarget('.so-boundlist-button')) {
			if (me.buttonHandler) {
				Ext.callback(me.buttonHandler, me.scope, [me, e, record, itm, idx], 0, me);
			}
			return false;
		} else {
			return me.callParent(arguments);
		}
	},
	
	generateTpl: function() {
		var me = this,
			hasGroup = !Ext.isEmpty(me.groupField),
			hasIcon = !Ext.isEmpty(me.iconField),
			hasColor = !Ext.isEmpty(me.colorField),
			showButtonTplGetterFn = function(getFn) {
				if (Ext.isFunction(getFn)) {
					return function(values) {
						return !!getFn.apply(me, [values]);
					};
				} else {
					return function() { return true; };
				}
			},
			tooltipAttrTplGetterFn = function(getFn) {
				if (Ext.isFunction(getFn)) {
					return function(values) {
						return Sonicle.Utils.generateTooltipAttrs(getFn.apply(me, [values]));
					};
				} else {
					return function() { return ''; };
				}
			},
			valueTplGetterFn = function(getFn, field, defValue) {
				if (Ext.isFunction(getFn)) {
					return function(values) {
						return Sonicle.String.deflt(getFn.apply(me, [values, values[field]]), defValue);
					};
				} else if (!Ext.isEmpty(field)) {
					return function(values) {
						return Sonicle.String.deflt(values[field], defValue);
					};
				} else {
					return Ext.emptyFn;
				}
			},
			liCls;
		
		if (hasGroup || hasIcon || hasColor) { // Setup modified template supporting new markup
			liCls = me.itemCls + ' ' + me.listItemCls;
			if (hasIcon || hasColor) liCls += (' ' + me.swatchListItemCls);
			me.tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<tpl if="this.grouping && this.groupingThreshold && this.showGroupItem(' + me.groupField + ')">',
						'<li class="' + me.itemCls + ' ' + me.groupListItemCls + '"> ' + me.generateGroupInnerTpl(me.groupField) + '</li>',
					'</tpl>',
					'<li role="option" unselectable="on" class="' + liCls + '">' + me.generateInnerTpl(me.displayField) + '</li>',
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
					showButton: showButtonTplGetterFn(me.shouldShowButton),
					buttonTipAttr: tooltipAttrTplGetterFn(me.getButtonTooltip),
					sourceValue: valueTplGetterFn(me.getSource, me.sourceField, '&nbsp;'),
					groupValue: valueTplGetterFn(me.getGroup, me.groupField, '&nbsp;')
				}
			);
			
		} else { // Setup original BoundList template + injected get functions
			// We cannot use callParent here because we have to inject our listItemCls 
			// in order to make hovering and selection compatible with new item selector.
			me.tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<li role="option" unselectable="on" class="' + me.itemCls + ' ' + me.listItemCls + '">' + me.generateInnerTpl(me.displayField) + '</li>',
				'</tpl>',
				{
					showButton: showButtonTplGetterFn(me.shouldShowButton),
					buttonTipAttr: tooltipAttrTplGetterFn(me.getButtonTooltip),
					sourceValue: valueTplGetterFn(me.getSource, me.sourceField, '&nbsp;'),
					groupValue: valueTplGetterFn(me.getGroup, me.groupField, '&nbsp;')
				}
			);
		}		
	},
	
	generateGroupInnerTpl: function(groupField) {
		return this.wrapGroupInnerTpl('{[this.groupValue(values)]}');
	},
	
	generateInnerTpl: function(displayField) {
		var me = this,
			origInnerTpl = me.getInnerTpl(displayField),
			hasIcon = !Ext.isEmpty(me.iconField),
			hasColor = !Ext.isEmpty(me.colorField),
			hasSource = !Ext.isEmpty(me.sourceField) || Ext.isFunction(me.getSource),
			useButton = me.enableButton,
			floating = hasSource || useButton,
			colorizeSwatch = (me.colorize === 'swatch'),
			geomSwatchCls, swatchStyle, displayStyle, source;
		
		if (hasIcon || hasColor || hasSource || useButton) { // Return modified innerTpl to support new features
			if (hasIcon && hasColor && colorizeSwatch) hasColor = false;
			geomSwatchCls = me.itemSwatchCls + '-' + me.swatchGeometry;
			swatchStyle = (hasColor && colorizeSwatch) ? '{[this.generateSwatchColorStyles(values, "' + me.colorField + '")]}' : '';
			displayStyle = (hasColor && !colorizeSwatch) ? '{[this.generateDisplayColorStyles(values, "' + me.colorField + '")]}' : '';
			source = '[this.sourceValue(values)]';
			
			return (floating ? '<div class="so-boundlist-floating">' : '')
				+ (hasIcon ? '<div class="' + me.itemIconCls + ' {' + me.iconField + '}"></div>' : '')
				+ (hasColor && colorizeSwatch ? '<div class="' + me.itemSwatchCls + ' ' + geomSwatchCls + '" style="' + swatchStyle + '"></div>' : '')
				+ '<span class="' + me.itemDisplayCls + '" style="' + displayStyle + '">' + origInnerTpl + '</span>'
				+ (floating ? '</div>' : '')
				+ (floating ? '<div class="' + me.itemRightDockedCls + '">' : '')
				+ (floating && hasSource ? '<span class="' + Sonicle.String.deflt(me.sourceCls, '') + '">{' + source + '}</span>' : '')
				+ (floating && useButton ? '<tpl if="this.showButton(values) === true"><i class="so-boundlist-button ' + me.buttonIconCls + '" {[this.buttonTipAttr(values)]}></i></tpl>' : '')
				+ (floating ? '</div>' : '');
			
		} else { // Return original innerTpl
			return origInnerTpl;
		}
	},
	
	privates: {
		wrapGroupInnerTpl: function(innerTpl) {
			return '<span class="' + this.itemDisplayCls + ' ' + Sonicle.String.deflt(this.groupCls, '') + '">' + innerTpl + '</span>';
		},
		
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
