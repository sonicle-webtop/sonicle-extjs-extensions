/*
 * Sonicle ExtJs UX
 * Copyright (C) 2024 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 * Heavily inspired by: https://docs.sencha.com/extjs/7.5.0/classic/src/Cycle.js.html
 * The difference is that this is NOT a SplitButton!
 */
Ext.define('Sonicle.button.Combo', {
	extend: 'Ext.button.Button',
	alias: ['widget.socombobutton'],
	
	/**
	 * @cfg {Boolean} [showText=false]
	 * True to display the active item's text as the button text. The Button will show its
	 * configured {@link #text} if this config is omitted.
	 */
	
	/**
	 * @cfg {String} [prependText='']
	 * A static string to prepend before the active item's text when displayed as 
	 * the button's text (only applies when showText = true).
	 */
	
	/**
	 * @cfg {Function/String} [changeHandler=undefined]
	 * A callback function that will be invoked each time the active menu item in the button's menu
	 * has changed. If this callback is not supplied, the SplitButton will instead fire the
	 * {@link #change} event on active item change. The changeHandler function will be called with
	 * the following argument list: (ComboButton this, Ext.menu.CheckItem item)
	 */
	
	/**
	 * @cfg {String} forceIcon
	 * A css class which sets an image to be used as the static icon for this button.
	 * This icon will always be displayed regardless of which item is selected in the dropdown list.
	 * This overrides the default behavior of changing the button's icon to match the selected item's icon
	 * on change.
	 */
	
	/**
	 * @cfg {Number/String} forceGlyph
	 * The charCode to be used as the static icon for this button.
	 * This icon will always be displayed regardless of which item is selected in the dropdown list.
	 * This override the default behavior of changing the button's icon to match the selected item's icon
	 * the default behavior of changing the button's icon to match the selected item's icon
	 */
	
	/**
	 * @property {Ext.menu.Menu} menu
	 * The {@link Ext.menu.Menu Menu} object used to display the {@link Ext.menu.CheckItem CheckItems} representing the available choices.
	 */
	
	/**
	 * @event change
	 * Fires after the button's active menu item has changed.
	 * Note that if a {@link #changeHandler} function is set on this ComboButton, 
	 * it will be called instead on active item change and this change event will not be fired.
	 * @param {Ext.button.Combo} this 
	 * @param {Ext.menu.CheckItem} item The menu item that was selected
	 */
	
	initComponent: function() {
		var me = this,
			checked = 0,
			items, i, len, item;
		
		items = (me.menu.items || []);
		
		me.menu = Ext.applyIf({
			items: []
		}, me.menu);
		len = items.length;
		
		// Convert all items to CheckItems
		for (i = 0; i < len; i++) {
			item = items[i];
			item = Ext.applyIf({
				group: me.id,
				itemIndex: i,
				checkHandler: me.itemCheckHandler,
				scope: me,
				checked: item.checked || false
			}, item);
			
			me.menu.items.push(item);
			if (item.checked) checked = i;
		}
		
		me.itemCount = me.menu.items.length;
		me.callParent(arguments);
		//me.on('click', me.toggleSelected, me);
		me.setActiveItem(checked, true);
	},
	
	/**
	 * Gets the currently active menu item.
	 * @return {Ext.menu.CheckItem} The active item
	 */
	getActiveItem: function() {
		return this.activeItem;
	},
	
	/**
	 * Sets the button's active menu item.
	 * @param {Ext.menu.CheckItem} item The item to activate
	 * @param {Boolean} [suppressEvent=false] True to prevent the {@link #change} event and
	 * {@link #changeHandler} from firing.
	 */
	setActiveItem: function(item, suppressEvent) {
		var me = this,
			changeHandler = me.changeHandler,
			forceIcon = me.forceIcon,
			forceGlyph = me.forceGlyph;
		
		me.settingActive = true;
		
		if (!Ext.isObject(item)) {
			item = me.menu.getComponent(item);
		}
		
		if (item) {
			me.setText(me.getButtonText(item));
			me.setIconCls(forceIcon ? forceIcon : item.iconCls);
			me.setGlyph(forceGlyph ? forceGlyph : item.glyph);
			
			me.activeItem = item;
			
			if (!item.checked) {
				item.setChecked(true, false);
			}
			
			if (!suppressEvent) {
				if (changeHandler) {
					Ext.callback(changeHandler, me.scope, [me, item], 0, me);
				}
				me.fireEvent('change', me, item);
			}
		}
		
		me.settingActive = false;
	},
	
	toggleSelected: function() {
		var me = this,
			m = me.menu,
			checkItem;
		
		checkItem = me.activeItem.next(':not([disabled])') || m.items.getAt(0);
		checkItem.setChecked(true);
	},
	
	privates: {
		itemCheckHandler: function(s, checked) {
			if (checked && !this.settingActive) {
				this.setActiveItem(s);
			}
		},
		
		getButtonText: function(item) {
			var me = this, text = '';
			
			if (item && me.showText === true) {
				if (me.prependText) {
					text += me.prependText;
				}
				text += item.text;
				return text;
			}
			return me.text;
		}
	}
});