/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.trigger.Menu', {
	extend: 'Ext.form.trigger.Trigger',
	alias: 'trigger.somenu',
	requires: [
		'Ext.menu.Menu'
	],
	
	/**
	 * @cfg {String} menuAlign
	 * The position to align the menu to (see {@link Ext.util.Positionable#alignTo} for more details).
	 */
	menuAlign: 'tl-bl?',
	
	/**
	 * @cfg {Boolean} showEmptyMenu
	 * True to force an attached {@link #cfg-menu} with no items to be shown when clicking
	 * this button. By default, the menu will not show if it is empty.
	 */
	showEmptyMenu: false,
		
	/**
	 * @cfg {Boolean} [destroyMenu]
	 * Whether or not to destroy any associated menu when this trigger is destroyed.
	 * In addition, a value of `true` for this config will destroy the currently bound menu
	 * when a new menu is set in {@link #setMenu} unless overridden by that method's destroyMenu
	 * function argument.
	 */
	destroyMenu: true,
	
	/**
	 * @cfg {Ext.menu.Menu/String/Object} menu
	 * Standard menu attribute consisting of a reference to a menu object, a menu id
	 * or a menu config blob. Note that using menus with handlers or click event listeners
	 * violates WAI-ARIA 1.0 requirements for accessible Web applications, and is not
	 * recommended.
	 */
	
	/**
	 * @property {Ext.menu.Menu} menu
	 * The {@link Ext.menu.Menu Menu} object associated with this Button when configured 
	 * with the {@link #cfg-menu} config option.
	 */
	
	cls: 'so-' + 'form-menu-trigger',
	extraCls: 'fa fa-bars',
	
	destroy: function() {
		this.setMenu(null);
		this.callParent();
	},
	
	onFieldRender: function() {
		var me = this;
		me.callParent();
		if (me.menu) {
			me.setMenu(me.menu, /*destroyMenu*/false, true);
		}
	},
	
	/**
	 * Get the {@link #cfg-menu} for this button.
	 * @return {Ext.menu.Menu} The menu. `null` if no menu is configured.
	 */
	getMenu: function() {
		return this.menu || null;
	},
	
	setMenu: function(menu, destroyMenu, /* private */ initial) {
		var me = this,
				field = me.field,
				oldMenu = me.menu,
				instanced;
		
		if (oldMenu && !initial) {
			if (destroyMenu !== false && me.destroyMenu) {
				oldMenu.destroy();
			}
			oldMenu.ownerCmp = null;
		}
		
		if (menu) {
			instanced = menu.isMenu;
			// Retrieve menu by id or instantiate instance if needed.
			menu = Ext.menu.Manager.get(menu, {
				// Use ownerCmp as the upward link. Menus *must have no ownerCt* - they are global floaters.
				// Upward navigation is done using the up() method.
				ownerCmp: field
			});
			// We need to forcibly set this here because we could be passed an existing menu, which means
			// the config above won't get applied during creation.
			menu.setOwnerCmp(field, instanced);
			me.menu = menu;
		} else {
			me.menu = null;
		}
	},
	
	onClick: function(e) {
		var me = this,
				menu = me.getMenu();
		me.callParent(arguments);
		if (menu && me.isFieldEnabled()) {
			me.showMenu(e, menu);
		}
	},
	
	showMenu: function(clickEvent) {
		var me = this,
				field = me.field,
				menu = me.menu,
				isPointerEvent = !clickEvent || clickEvent.pointerType;
		
		if (menu && field.rendered) {
			if (menu.isVisible()) {
				// Click/tap toggles the menu visibility.
				if (isPointerEvent) {
					menu.hide();
				} else {
					menu.focus();
				}
			} else if (!clickEvent || me.showEmptyMenu || menu.items.getCount() > 0) {
				menu.autoFocus = !isPointerEvent;
				menu.showBy(me.el, me.menuAlign);
			}
		}
		return me;
	}
});
