/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * malbinola[at]sonicle.com
 * https://www.sonicle.com
 * 
 * Some modifications inspired by http://www.coding-ideas.de/2018/03/22/grouping-combobox-field/?cookie-state-change=1572450122746
 */
Ext.define('Sonicle.view.BoundList', {
	extend: 'Ext.view.BoundList',
	alias: 'widget.soboundlist',
	uses: [
		'Sonicle.String'
	],
	
	/**
	 * @cfg {Boolean} disableFocusSaving
	 * Disables saving/restoring of the previously focused item.
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
	 * @cfg {cls|src} [iconMode]
	 * Controls how to define the icon:
	 *  - cls: {@link #colorField} value returns a CSS class
	 *  - src: {@link #colorField} value returns the image URL
	 */
	iconMode: 'cls',
	
	/**
	 * @cfg {String} [iconField]
	 * The field from the store to show icon in the view.
	 */
	
	/**
	 * @cfg {Function} [getIcon]
	 * A function which returns the icon data in the view (eg. useful for computing icon dynamically).
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #iconField}.
	 */
	
	/**
	 * @cfg {String} [colorField]
	 * The field from the store to use as fill color or color CSS class.
	 */
	
	/**
	 * @cfg {Function} [getColor]
	 * A function which returns the color data in the view (eg. useful for computing icon dynamically).
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link colorField}.
	 */
	
	/**
	 * @cfg {hex|cls} [colorMode]
	 * Controls how to define the icon:
	 *  - hex: {@link colorField} value returns a HEX color string
	 *  - cls: {@link colorField} value returns a CSS class
	 */
	colorMode: 'hex',
	
	/**
	 * @cfg {String} [sourceField]
	 * The field from the store to show source/origin info in the view.
	 */
	
	/**
	 * @cfg {Function} [getSource]
	 * A function which returns the source/origin data in the view.
	 * @param {Object} values An Object with item fields.
	 * @param {Mixed} value The value sustained by {@link #sourceField}.
	 */
	
	/**
	 * @cfg {Boolean} [enableButton]
	 * Enables or disables displaying an icon-button on item-row.
	 */
	enableButton: false,
	
	/**
	 * @cfg {Boolean} [enableListTopButton=false]
	 * Set to `true` to enable displaying of a special button-item (with text and/or icon) in top of the list.
	 */
	enableListTopButton: false,
	
	/**
	 * @cfg {Boolean} [listTopButtonHidden=false]
	 * Controls the visibility of the top-button.
	 */
	listTopButtonHidden: false,
	
	/**
	 * @cfg {String} [listTopButtonExtraCls]
	 * An additional CSS class (or classes) to be added to the button element.
	 */
	
	/**
	 * @cfg {String} [listTopButtonIconCls]
	 * The icon CSS Class to apply to button icon element.
	 */
	listTopButtonIconCls: undefined,
	
	/**
	 * @cfg {String} [listTopButtonText]
	 * The text to apply to top button.
	 */
	listTopButtonText: 'Top static-item here',
	
	/**
	 * @cfg {Function/String} listTopButtonHandler
	 * A function called when the button is clicked.
	 * @param {Sonicle.view.BoundList} list This list.
	 * @param {Ext.event.Event} e The click event.
	 * @param {HTMLElement} el The item's element.
	 */
	
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
	 * @cfg {swatch|icon|text} colorize [colorize=swatch]
	 * Specify the target element on which apply the color: the marker itself, the icon or display text.
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
	
	listTopButtonCls: 'so-'+'boundlist-listtopbutton',
	listItemCls: 'so-'+'boundlist-item',
	groupListItemCls: 'so-'+'boundlist-groupitem',
	swatchListItemCls: 'so-'+'boundlist-swatchitem',
	itemIconCls: 'so-'+'boundlist-icon',
	itemDisplayCls: 'so-'+'boundlist-display',
	itemSourceCls: 'so-'+'boundlist-source',
	itemRightDockedCls: 'so-'+'boundlist-right',
	itemSwatchCls: 'so-'+'boundlist-swatch',
	
	/**
	 * @override Check me during ExtJs upgrade!
	 */
	/* eslint-disable indent, max-len */
	renderTpl: [
		'<div id="{id}-listWrap" data-ref="listWrap"',
				' class="{baseCls}-list-ct ', Ext.dom.Element.unselectableCls, '">',
		'<tpl if="enableListTopButton">', // <-- added
			'<div id="{id}-listTopBtnEl" data-ref="listTopBtnEl" class="{listTopButtonWrapCls}" style="{listTopButtonStyle}">', // <-- added
			'<tpl if="listTopButtonIconCls">', // <-- added
				'<i class="{listTopButtonCls}-icon {listTopButtonIconCls}"></i>', // <-- added
			'</tpl>', // <-- added
				'<span class="{listTopButtonCls}-text">{listTopButtonText}</span>', // <-- added
			'</div>', // <-- added
		'</tpl>', // <-- added
			'<ul id="{id}-listEl" data-ref="listEl" class="', Ext.baseCSSPrefix, 'list-plain"',
				'<tpl foreach="ariaAttributes"> {$}="{.}"</tpl>',
			'>',
			'</ul>',
		'</div>',
		'{%',
			'var pagingToolbar=values.$comp.pagingToolbar;',
			'if (pagingToolbar) {',
				'Ext.DomHelper.generateMarkup(pagingToolbar.getRenderTree(), out);',
			'}',
		'%}',
		{
			disableFormats: true
		}
	],
	/* eslint-enable indent, max-len */
	childEls: ['listWrap', 'listTopBtnEl', 'listEl'],
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Change default itemSelector to our list-item CSS class.
		// This allows to use the original class within the new group-item 
		// and so make it look similar (across themes) to the other list-items.
		me.itemSelector = '.' + me.listItemCls;
	},
	
	initRenderData: function() {
		var me = this;
		return Ext.apply(me.callParent(), {
			enableListTopButton: me.enableListTopButton,
			listTopButtonCls: me.listTopButtonCls,
			listTopButtonWrapCls: Sonicle.String.join(' ', me.itemCls, me.listTopButtonCls, me.listTopButtonExtraCls),
			listTopButtonStyle: me.listTopButtonHidden === true ? 'display:none;' : '',
			listTopButtonIconCls: me.listTopButtonIconCls,
			listTopButtonText: Ext.htmlEncode(me.listTopButtonText)
		});
	},
	
	setListTopButtonVisible: function(visible) {
		var me = this;
		if (me.rendered && me.listTopBtnEl) {
			me.listTopBtnEl.setVisibilityMode(Ext.dom.Element.DISPLAY)[visible ? 'show' : 'hide']();
		}
	},
	
	setListTopButtonText: function(text) {
		var me = this;
		text = text == null ? '' : String(text);
		if (me.rendered && me.listTopBtnEl) {
			me.listTopBtnEl.down('.' + me.listTopButtonCls + '-text').setHtml(Ext.htmlEncode(text) || '\x26#160;');
		}
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
	
	onContainerMouseDown: function(e) {
		var me = this;
		if (e.getTarget('.' + me.listTopButtonCls)) {
			if (me.listTopButtonHandler) {
				Ext.callback(me.listTopButtonHandler, me.scope, [me, e], 0, me);
			}
			return false;
		}
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 */
	generateTpl: function() {
		var me = this,
			SoU = Sonicle.Utils,
			hasGroup = !Ext.isEmpty(me.groupField) || Ext.isFunction(me.getGroup),
			hasIcon = !Ext.isEmpty(me.iconField) || Ext.isFunction(me.getIcon),
			hasColor = !Ext.isEmpty(me.colorField) || Ext.isFunction(me.getColor),
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
			iconValue = SoU.tplValueGetterFn(me.iconField, {fn: me.getIcon, scope: me}),
			sourceValue = SoU.tplValueGetterFn(me.sourceField, {fn: me.getSource, scope: me}, '&nbsp;'),
			groupValue = SoU.tplValueGetterFn(me.groupField, {fn: me.getGroup, scope: me}, '&nbsp;'),
			liCls;
		
		if (hasGroup || hasIcon || hasColor) { // Setup modified template supporting new markup
			liCls = me.itemCls + ' ' + me.listItemCls;
			if (hasIcon || hasColor) liCls += (' ' + me.swatchListItemCls);
			me.tpl = new Ext.XTemplate(
				'<tpl for=".">',
					'<tpl if="this.grouping && this.groupingThreshold && this.showGroupItem(' + me.groupField + ')">',
						'<li class="' + me.itemCls + ' ' + me.groupListItemCls + '">' + me.generateGroupInnerTpl(me.groupField) + '</li>',
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
					//TODO: support getColor here
					generateSwatchColorStyles: function(values, colorField) {
						return !Ext.isEmpty(colorField) ? Sonicle.view.BoundList.generateColorStyles('swatch', values[colorField]) : '';
					},
					//TODO: support getColor here
					generateDisplayColorStyles: function(values, colorField) {
						return !Ext.isEmpty(colorField) ? Sonicle.view.BoundList.generateColorStyles('text', values[colorField]) : '';
					},
					showButton: showButtonTplGetterFn(me.shouldShowButton),
					buttonTipAttr: tooltipAttrTplGetterFn(me.getButtonTooltip),
					iconValue: iconValue,
					sourceValue: sourceValue,
					groupValue: groupValue,
					colorValue: SoU.tplValueGetterFn(me.colorField, {fn: me.getColor, scope: me}, '')
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
					iconValue: iconValue,
					sourceValue: sourceValue,
					groupValue: groupValue
				}
			);
		}		
	},
	
	generateGroupInnerTpl: function(groupField) {
		return this.wrapGroupInnerTpl('{[this.groupValue(values)]}');
	},
	
	generateInnerTpl: function(displayField) {
		var me = this,
			iconMode = me.iconMode,
			colorModeIsCls = me.colorMode === 'cls',
			origInnerTpl = me.getInnerTpl(displayField),
			hasIcon = !Ext.isEmpty(me.iconField) || Ext.isFunction(me.getIcon),
			hasColor = !Ext.isEmpty(me.colorField) || Ext.isFunction(me.getColor),
			hasSource = !Ext.isEmpty(me.sourceField) || Ext.isFunction(me.getSource),
			useButton = me.enableButton,
			floating = hasSource || useButton,
			colorize = me.colorize,
			colorizeSwatch = (colorize === 'swatch'),
			geomSwatchCls, swatchStyle, iconStyle, displayStyle, icon, source, colorCls;
		
		if (hasIcon || hasColor || hasSource || useButton) { // Return modified innerTpl to support new features
			if (hasIcon && hasColor && colorizeSwatch) hasColor = false;
			geomSwatchCls = me.itemSwatchCls + '-' + me.swatchGeometry;
			swatchStyle = (hasColor && !colorModeIsCls && colorizeSwatch) ? '{[this.generateSwatchColorStyles(values, "' + me.colorField + '")]}' : '';
			displayStyle = (hasColor && !colorModeIsCls && colorize === 'text') ? '{[this.generateDisplayColorStyles(values, "' + me.colorField + '")]}' : '';
			iconStyle = (hasColor && !colorModeIsCls && colorize === 'icon') ? '{[this.generateDisplayColorStyles(values, "' + me.colorField + '")]}' : '';
			colorCls = (hasColor && colorModeIsCls) ? '{[this.colorValue(values)]}' : '';
			icon = '{[this.iconValue(values)]}',
			source = '{[this.sourceValue(values)]}';
			
			return (floating ? '<div class="so-boundlist-floating">' : '')
				+ (hasIcon ? '<div ' : '')
				+ (hasIcon && ('cls' === iconMode) ? 'class="' + me.itemIconCls + ' ' + colorCls + ' ' + icon + '"' : '')
				+ (hasIcon && ('src' === iconMode) ? 'class="' + me.itemIconCls + ' ' + me.itemIconCls + '-bg" style="background-image:url(' + icon + ');"' : '')
				+ (hasIcon ? ' style="' + iconStyle + '"></div>' : '')
				+ (hasColor && colorizeSwatch ? '<div class="' + me.itemSwatchCls + ' ' + geomSwatchCls + '" style="' + swatchStyle + '"></div>' : '')
				+ '<span class="' + me.itemDisplayCls + '" style="' + displayStyle + '">' + origInnerTpl + '</span>'
				+ (floating ? '</div>' : '')
				+ (floating ? '<div class="' + me.itemRightDockedCls + '">' : '')
				+ (floating && hasSource ? '<span class="' + Sonicle.String.deflt(me.sourceCls, '') + '">' + source + '</span>' : '')
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
