/*
 * Sonicle ExtJs UX
 * Copyright (C) 2021 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.plugin.FieldTabOut', {
	extend: 'Ext.plugin.Abstract',
	alias: 'plugin.sofieldtabout',
	uses: [
		'Sonicle.Utils'
	],
	
	/**
	 * @cfg {Ext.container.Container} rootHierarchyContainer
	 * The root container where to search for a {@link #nextReference} using {@link Ext.container.Container#lookupReference} method.
	 */
	rootHierarchyContainer: undefined,
	
	/**
	 * @cfg {String} nextReference
	 * The {@link Ext.Component#reference} of the component that must be focused when TAB out occurs.
	 */
	nextReference: undefined,
	
	/**
	 * @cfg {Boolean} [focusSelectText]
	 * The 1st parameter to pass to {@link Ext.mixin.Focusable#focus} method when called. Defaults to `false`.
	 */
	focusSelectText: false,
	
	/**
	 * @cfg {Boolean/Number} [focusDelay]
	 * The 2nd parameter to pass to {@link Ext.Component#focus} method when called. Defaults to `true`.
	 */
	focusDelay: true,
	
	init: function(field) {
		var me = this;
		me.setCmp(field);
		if (!field.enableKeyEvents) {
			field.enableKeyEvents = true;
			Ext.log.warn('Key events are needed: config enableKeyEvents is forcibly set to \'true\'');
		}
		if (!me.rootHierarchyContainer) {
			Ext.log.warn('Config \'rootHierarchyContainer\' NOT set: root container is needed for looking-up reference');
		}
		field.on('keydown', me.onCmpKeyDown, me, {priority: 100});
	},
	
	destroy: function() {
		var me = this,
				cmp = me.getCmp();
		cmp.un('keydown', me.onCmpKeyDown, me);
	},
	
	privates: {
		onCmpKeyDown: function(s, e, eopts) {
			var me = this,
					rhc = me.rootHierarchyContainer,
					cmp;
			if (e.getKey() === e.TAB) {
				e.stopEvent();
				if (rhc && rhc.isContainer && Ext.isString(me.nextReference)) {
					cmp = Sonicle.Utils.lookupReference(rhc, me.nextReference);
					if (cmp && cmp.isComponent) cmp.focus(me.focusSelectText, me.focusDelay);
				}
			}
		}
	}
});
