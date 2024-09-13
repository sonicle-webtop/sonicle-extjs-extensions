/**
 * Override original {@link Ext.Component}
 * - Support pseudo UIs and initialize namespace for UI mappings (Ext.theme.ui.*)
 * - Restore setReference availability: starting from Ext 6.5, reference NOT uses config system anymore
 */
Ext.define('Sonicle.overrides.Component', {
	override: 'Ext.Component',
	
	/**
	 * Regex to match a pattern like: "{psui-name(|psui-name-fallback)*}"
	 *  where `psui-name` is the name of pseudo UI to lookup and the following 
	 *  `psui-name-fallback` is the name on which fallback in case of missing lookup.
	 */
	rePseudoUI: /^\{([\w|-]+?)(?:\|([\w|-]+?)){0,1}\}/, // Do NOT append $-sign otherwise replace will not work!
	
	setUI: function(ui) {
		var me = this,
			pseudoUIRegex = me.rePseudoUI,
			match = ui.match(pseudoUIRegex),
			pseudoUIs, i, realUI;
		
		// Pseudo UIs are semantic names that map a real UI name value defined in themes.
		// Here, we initially try to match its pattern (name wrappen into curly braces) and 
		// then we replace it with the real UI name looked up in theme's meta infos.
		// A special RegEx is used to exclude any size suffix in the match that can 
		// be appended again to the real UI name: buttons uses this behaviour (eg. toolbar-default-small).
		
		if (match) {
			pseudoUIs = Ext.Array.slice(match, 1);
			for (i=0; i<pseudoUIs.length; i++) {
				if (!Ext.isEmpty(pseudoUIs[i]) && (realUI = me.findRealUi(pseudoUIs[i]))) {
					return me.callParent([ui.replace(pseudoUIRegex, realUI)]);
				}
			}
			// If no match was found, return the defined default UI value!
			return me.callParent([ui.replace(pseudoUIRegex, me.defaultUI)]);
		}
		return me.callParent(arguments);
	},
	
	findRealUi: function(pseudoUI) {
		var me = this, map, realUI;
		
		if (me.isXType('button')) map = Ext.theme.ui.button;
		else if (me.isXType('panel')) map = Ext.theme.ui.panel;
		
		if (map) realUI = map[pseudoUI];
		return realUI;
	},
	
	setReference: function(reference) {
		var me = this,
				validIdRe = me.validRefRe || Ext.validIdRe;
		if (reference && !validIdRe.test(reference)) {
			Ext.raise('Invalid reference "' + reference + '" for ' + me.getId() + ' - not a valid identifier');
		} else {
			me.reference = reference;
		}
	},
	
	/**
	 * Tests whether or not this Component is of a specific xtypes.
	 * @param {String[]|String} xtypes The xtypes to check for this Component.
	 * @param {Boolean} [shallow=false] Set to `true` to check whether this Component is strictly of the specified xtypes.
	 * @returns {Boolean}
	 */
	isXTypeOneOf: function(xtypes, shallow) {
		xtypes = Ext.Array.from(xtypes);
		for (var i=0; i<xtypes.length; i++) {
			if (this.isXType(xtypes[i], shallow)) return true;
		}
		return false;
	}
	
}, function() {
	Ext.util.Format.htmlAttributeEncode = Sonicle.String.htmlAttributeEncode;
	// Initialize UI namespace
	Ext.namespace('Ext.theme.ui.button');
	Ext.namespace('Ext.theme.ui.panel');
});
