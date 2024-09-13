/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 */
Ext.define('Sonicle.ThemeMgr', {
	singleton: true,
	
	/**
	 * @property {Object} builtInHierarchy
	 * The base hierarchy driven by Ext.theme.is.* of each built-in theme.
	 */
	builtInHierarchy: {
		'Aria': ['Aria', 'Neptune'],
		'Classic': ['Classic'],
		'Crisp': ['Crisp', 'Neptune'],
		'CrispTouch': ['CrispTouch', 'Crisp', 'Neptune'],
		'Graphite': ['Graphite', 'Triton', 'Neptune'],
		'Gray': ['Gray', 'Classic'],
		'Material': ['Material', 'Triton', 'Neptune'],
		'Neptune': ['Neptune'],
		'NeptuneTouch': ['NeptuneTouch', 'Neptune'],
		'Triton': ['Triton', 'Neptune']
	},
	
	/**
	 * The unique theme identifier.
	 * @returns {Ext.themeName}
	 */
	getId: function() {
		return Ext.themeName;
	},
	
	/**
	 * The unique theme name.
	 * @returns {Ext.theme.name}
	 */
	getName: function() {
		return Ext.theme.name;
	},
	
	/**
	 * Checks if current-theme inheriths from passed one (at any point of hierarchy).
	 * @param {String} name The theme's name to check.
	 * @returns {Boolean}
	 */
	themeIs: function(name) {
		return !!Ext.namespace('Ext.theme.is')[Ext.String.capitalize(name)];
	},
	
	/**
	 * Returns the root-theme name evaluating current-theme's inheritance hierarchy.
	 * @returns {String}
	 */
	getRootName: function() {
		return this.evalHierarchy(this.getName(), true);
	},
	
	/**
	 * Returns the parent-theme evaluating current-theme's inheritance hierarchy.
	 * @returns {String}
	 */
	getParentName: function() {
		return this.evalHierarchy(this.getName(), 1);
	},
	
	/**
	 * Returns current-theme's inheritance hierarchy array.
	 * @returns {String}
	 */
	getHierarchy: function() {
		return this.evalHierarchy(this.getName(), false);
	},
	
	/**
	 * Evaluates current-theme's inheritance hierarchy at precise level.
	 * @param {Number} level
	 * @returns {String}
	 */
	getHierarchyAt: function(level) {
		return this.evalHierarchy(this.getName(), level);
	},
	
	privates: {
		evalHierarchy: function(name, level) {
			var hierarchy;

			if (this.builtInHierarchy.hasOwnProperty(name)) { // Built-in themes use prepared hierarchy-map...
				hierarchy = this.builtInHierarchy[name];
			} else { // ...custom one must define their own hierarchy in Ext.theme.hierarchy property!
				hierarchy = Ext.theme.hierarchy;
			}

			if (hierarchy) {
				if (level === false) {
					return hierarchy;
				} else if (Ext.isNumber(level)) {
					return (level < hierarchy.length) ? hierarchy[level] : undefined;
				} else {
					return hierarchy[hierarchy.length-1];
				}
			}
			return null;
		}
	}
});
