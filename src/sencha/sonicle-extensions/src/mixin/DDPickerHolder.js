/*
 * ExtJs UX
 * Copyright (C) 2023 Matteo Albinola
 * matteo.albinola[at]gmail.com
 * Inspired by: https://docs.sencha.com/extjs/6.2.0/classic/src/Picker.js.html
 * This is originally conceived to be mixed into a Ext.field.Field, methods 
 * onEsc, onFocusLeave, doDestroy and initComponent are specific to that component.
 */
Ext.define('Sonicle.mixin.DDPickerHolder', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'ddpickerholder',
		before: {
			onEsc: 'beforeOnEsc',
			onFocusLeave: 'beforeOnFocusLeave',
			doDestroy: 'beforeDoDestroy'
		},
		on: {
			initComponent: 'onInitComponent'
		}
	},
	
	/**
	 * @cfg {Boolean} ddPickerMatchOwnerWidth
	 * Whether the picker dropdown's width should be explicitly set to match 
	 * the width of the field. Defaults to true.
	 */
	ddPickerMatchOwnerWidth: true,
	
	/**
	 * @cfg {String} ddPickerAlign
	 * The {@link Ext.util.Positionable#alignTo alignment position} with which 
	 * to align the picker. Defaults to "tl-bl?"
	 */
	ddPickerAlign: 'tl-bl?',
	
	/**
	 * @cfg {Number[]} ddPickerOffset
	 * An offset [x,y] to use in addition to the {@link #ddPickerAlign} when 
	 * positioning the picker. Defaults to undefined.
	 */
	
	/**
	 * @method
	 * Returns the owning component.
	 */
	getOwnerCmp: Ext.emptyFn,
	
	/**
	 * @method
	 * Returns the component's element use style application during open/close operations.
	 */
	getOwnerBodyEl: Ext.emptyFn,
	
	/**
	 * @method
	 * Returns the component's element use for alignment during open/close operations.
	 */
	getOwnerAlignEl: Ext.emptyFn,
	
	/**
	 * @method
	 * Creates and returns the component to be used as this field's picker.
	 * Must be implemented by mixing classes.
	 * @param {String} id The DD picker identifier.
	 */
	createDDPicker: Ext.emptyFn,
	
	/**
	 * @method
	 * Called when a DD picker is expanded. Hook point for mixing classes.
	 * @param {String} id The DD picker identifier.
	 */
	onExpandDDPicker: Ext.emptyFn,
	
	/**
	 * @method
	 * Called when a DD picker is collapsed. Hook point for mixing classes.
	 * @param {String} id The DD picker identifier.
	 */
	onCollapseDDPicker: Ext.emptyFn,
	
	/**
	 * @event expandDDPicker
	 * Fires when the component's DD picker is expanded.
	 * @param {Ext.Component} comp This component instance
	 * @param {String} id The DD picker identifier.
	 */

	/**
	 * @event collapseDDPicker
	 * Fires when the component's DD picker is collapsed.
	 * @param {Ext.Component} comp This component instance
	 * @param {String} id The DD picker identifier.
	 */
	
	/**
	 * @event selectDDPicker
	 * Fires when a value is selected via the picker.
	 * @param {Ext.Component} comp This component instance
	 * @param {String} id The DD picker identifier.
	 * @param {Object} value The value that was selected. The exact type of 
	 * this value is dependent on the individual field and picker implementations.
	 */
	
	/**
	 * @private
	 */
	ddPickers: null,
	
	/**
	 * Returns a reference to the DD picker component for this field, creating it 
	 * if necessary by calling {@link #createDDPicker}.
	 * @param {String} id The DD picker identifier.
	 * @return {Ext.Component} The picker component
	 */
	getDDPicker: function(id) {
		var me = this,
			picker = me.ddPickers[id];
		
		if (!picker) {
			me.creatingDDPicker = true;
			me.ddPickers[id] = picker = me.createDDPicker(id);
			// For upward component searches.
			picker.ownerCmp = me.getOwnerCmp();
			delete me.creatingDDPicker;
		}
		return picker;
	},
	
	/**
	 * Returns a reference to the DD picker component for this field, creating it 
	 * if necessary by calling {@link #createDDPicker}.
	 * @param {String} [id] The DD picker identifier to check, can be null to check if any DD picker is expanded.
	 * @return {Boolean}
	 */
	isDDPickerExpanded: function(id) {
		var me = this;
		return Ext.isEmpty(id) ? !!me.expandedDD : !!me.ddPickers[me.expandedDD];
	},
	
	/**
	 * Expands the specified DD picker.
	 * @param {String} id The DD picker identifier to be expanded.
	 */
	expandDDPicker: function(id) {
		var me = this,
			cmp = me.getOwnerCmp(),
			obodyEl = me.getOwnerBodyEl(),
			picker, doc;
		
		if (cmp && obodyEl && cmp.rendered && Ext.isEmpty(me.expandedDD) && !cmp.destroyed) {
			picker = me.getDDPicker(id);
			if (picker) {
				doc = Ext.getDoc();
				picker.setMaxHeight(picker.initialConfig.maxHeight);

				if (me.ddPickerMatchOwnerWidth) {
					picker.setWidth(obodyEl.getWidth());
				}

				// Show the picker and track expanded state. alignDDPicker only works if is expanded.
				picker.show();
				me.expandedDD = id;
				me.alignDDPicker();
				obodyEl.addCls(cmp.openCls);

				/*
				if (!me.ariaStaticRoles[me.ariaRole]) {
					if (!me.ariaEl.dom.hasAttribute('aria-owns')) {
						me.ariaEl.dom.setAttribute('aria-owns', picker.listEl ? picker.listEl.id : picker.el.id);
					}
					me.ariaEl.dom.setAttribute('aria-expanded', true);
				}
				*/

				// Collapse on touch outside this component tree.
				// Because touch platforms do not focus document.body on touch
				// so no focusleave would occur to trigger a collapse.
				me.ddpTouchListeners = doc.on({
					// Do not translate on non-touch platforms.
					// mousedown will blur the field.
					translate: false,
					touchstart: me.collapseDDPickerIf,
					scope: me,
					delegated: false,
					destroyable: true
				});

				// Scrolling of anything which causes this field to move should collapse
				me.ddpScrollListeners = Ext.on({
					scroll: me.onDDGlobalScroll,
					scope: me,
					destroyable: true
				});

				// Buffer is used to allow any layouts to complete before we align
				Ext.on('resize', me.alignDDPicker, me, {buffer: 1});
				cmp.fireEvent('expandDDPicker', me, id);
				me.onExpandDDPicker(id);
			}
		}
	},
	
	/**
	 * Collapses the expanded DD picker, if any.
	 */
	collapseDDPicker: function() {
		var me = this,
			cmp = me.getOwnerCmp(),
			obodyEl = me.getOwnerBodyEl(),
			aboveSfx = '-above',
			id = me.expandedDD,
			picker = me.ddPickers[id],
			openCls;
		
		if (cmp && obodyEl && !cmp.destroyed && !cmp.destroying && picker) {
			openCls = cmp.openCls;
			
			// hide the picker and cleas expanded flag
			picker.hide();
			delete me.expandedDD;
			
			// remove the openCls
			obodyEl.removeCls([openCls, openCls + aboveSfx]);
			picker.el.removeCls(picker.baseCls + aboveSfx);
			
			/*
			if (!me.ariaStaticRoles[me.ariaRole]) {
				me.ariaEl.dom.setAttribute('aria-expanded', false);
			}
			*/
			
			// remove event listeners
			me.ddpTouchListeners.destroy();
			me.ddpScrollListeners.destroy();
			
			Ext.un('resize', me.alignDDPicker, me);
			cmp.fireEvent('collapseDDPicker', me, id);
			
			me.onCollapseDDPicker(id);
		}
	},
	
	/**
	 * @protected
	 * Aligns the DD picker to the input element
	 */
	alignDDPicker: function() {
		var me = this,
			cmp = me.getOwnerCmp(),
			id = me.expandedDD,
			picker;
		
		if (cmp && cmp.rendered && !cmp.destroyed) {
			picker = me.ddPickers[id];
			if (picker.isVisible() && picker.isFloating()) {
				me.doAlignDDPicker(id);
			}
		}
	},
	
	privates: {
		onInitComponent: function() {
			var me = this;
			me.ddPickers = {};
		},
		
		beforeOnEsc: function(e) {
			if (this.isDDPickerExpanded()) {
				this.collapseDDPicker();
				e.stopEvent();
			}
		},
		
		beforeOnFocusLeave: function() {
			this.collapseDDPicker();
		},
		
		beforeDoDestroy: function() {
			delete this.expandedDD;
			delete this.ddPickers;
		},
		
		collapseDDPickerIf: function(e) {
			var me = this,
				cmp = me.getOwnerCmp(),
				obodyEl = me.getOwnerBodyEl();
			// If what was mousedowned on is outside of this Field, and is not focusable, then collapse.
			// If it is focusable, this Field will blur and collapse anyway.
			if (cmp && obodyEl && !cmp.destroyed && !e.within(obodyEl, false, true) && !cmp.owns(e.target) && !Ext.fly(e.target).isFocusable()) {
				me.collapseDDPicker();
			}
		},
		
		onDDGlobalScroll: function(scroller) {
			var me = this,
				id = me.expandedDD,
				picker = me.ddPickers[id],
				scrollEl = scroller.getElement();
			
			// Collapse if the scroll is anywhere but inside the picker
			if (picker && !picker.owns(scrollEl) && scrollEl.isAncestor(this.el)) {
				me.collapseDDPicker();
			}
		},
		
		/**
		 * Performs the alignment on the DD picker using the class defaults
		 */
		doAlignDDPicker: function(id) {
			var me = this,
				cmp = me.getOwnerCmp(),
				obodyEl = me.getOwnerBodyEl(),
				oalignEl = me.getOwnerAlignEl(),
				picker = me.ddPickers[id],
				aboveSfx = '-above',
				newPos,
				isAbove;

			if (cmp && obodyEl && oalignEl && picker) {
				// Align to the trigger wrap because the border isn't always on the input element, which
				// can cause the offset to be off
				picker.el.alignTo(oalignEl, me.ddPickerAlign, me.ddPickerOffset);

				// We used *element* alignTo to bypass the automatic reposition on scroll which
				// Floating#alignTo does. So we must sync the Component state.
				newPos = picker.floatParent ? picker.getOffsetsTo(picker.floatParent.getTargetEl()) : picker.getXY();

				picker.x = newPos[0];
				picker.y = newPos[1];

				// add the {openCls}-above class if the picker was aligned above
				// the field due to hitting the bottom of the viewport
				isAbove = picker.el.getY() < cmp.inputEl.getY();
				obodyEl[isAbove ? 'addCls' : 'removeCls'](cmp.openCls + aboveSfx);
				picker[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
			}
		}
	}	
});
