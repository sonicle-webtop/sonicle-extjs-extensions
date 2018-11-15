/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * Inspired by:
 *  - https://eliep.github.io/vue-avatar/
 *  - https://flatuicolors.com/
 *  - https://github.com/google/palette.js/tree/master
 */
Ext.define('Sonicle.form.field.InitialsAvatar', {
	extend: 'Ext.form.field.Display',
	alias: ['widget.sointialsavatarfield', 'widget.sointialsavatardisplayfield'],
	uses: [
		'Sonicle.String',
		'Sonicle.ColorUtils'
	],
	
	/**
	 * @cfg {Number} [avatarSize=100]
	 * The pixel size of avatar.
	 */
	avatarSize: 100,
	
	/**
	 * @cfg {circle|square} [geometry=circle]
	 * Changes avatar's geomerty.
	 */
	geometry: 'circle',
	
	/**
	 * @cfg {Number} [lighten=80]
	 * The amount value used to lighten the initial text color (-255 to 255).
	 */
	lighten: 80,
	
	/**
	 * @cfg {String} [emptyColor=#F1F3F4]
	 * A 7-chars color hex code to be applied when initials cannot be computed.
	 */
	emptyColor: '#F1F3F4',
	
	/**
	 * @property {String[]} colors
	 * An array of 7-chars color hex code strings.
	 * This array can contain any number of colors, and each hex code should be unique.
	 */
	colors: [
		'#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
		'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
		'#8BC34A', '#CDDC39', /*'#FFEB3B',*/ '#FFC107', '#FF9800',
		'#FF5722', '#795548', '#9E9E9E', '#607D8B'
	],
	
	fieldCls: 'so-' + 'form-initialsavatar-field',
	fieldBodyCls: 'so-' + 'form-initialsavatar-field-body',
	
	/**
	 * @private
	 */
	seed: 0,
	
	onRender: function() {
		var me = this,
				size = me.avatarSize;
		me.callParent();
		if (me.inputEl) {
			me.inputEl.applyStyles({
				width: size + 'px',
				height: size + 'px',
				lineHeight: size + 'px',
				borderRadius: me.buildRadius()
			});
		}
	},
	
	setValue: function(value) {
		var me = this, ret;
		me.seed = Sonicle.String.deflt(value, '').length;
		ret = me.callParent(arguments);
		if (me.rendered) {
			me.inputEl.applyStyles({
				backgroundColor: !Ext.isEmpty(me.getRawValue()) ? me.randomColor(me.seed, me.colors) : me.emptyColor
			});
		}
		return ret;
	},
	
	valueToRaw: function(value) {
		return this.self.calcInitials(value, 2) || '';
	},
	
	getDisplayValue: function() {
		var me = this,
				display = me.callParent(),
				spanStyle;
		
		if (me.renderer) {
			return display;
		} else {
			spanStyle = Ext.DomHelper.generateStyles(me._getSpanStyles(me.randomColor(me.seed, me.colors)));
			return '<span style="' + spanStyle + '">' + Sonicle.String.deflt(display, '') + '</span>';
		}
	},
	
	_getSpanStyles: function(bgColor) {
		return {
			color: Sonicle.ColorUtils.lightenDarken(bgColor, this.lighten),
			fontSize: Math.floor(this.avatarSize/2) + 'px'
		};
	},
	
	privates: {
		buildRadius: function() {
			return (this.geometry === 'circle') ? '50%' : null;
		},
		
		randomColor: function(seed, colors) {
			return colors[(seed+3) % (colors.length)];
		}
	},
	
	statics: {
		/**
		 * Compute initials of a name
		 * These rule will be followed:
		 *  - divide the username on space and hyphen
		 *  - use the first letter of each parts
		 *  - never use more than three letters as initials
		 *  - if the username is divided in more than three parts and has part 
		 *    starting with an uppercase, skip parts starting with a lowercase
		 * @param {String} name The name to analyze.
		 * @param {2|3} [max] Maximum chars to returs, defaults to 3.
		 * @returns {String} The name's initials.
		 */
		calcInitials: function(name, max) {
			if (max === undefined) max = 3;
			if (Ext.isEmpty(name)) return null;
			var parts = name.split(/[ -]/),
					sntz = function(s) {
						// Returns the first letter or digit.
						var match = s.match(/[a-zA-Z0-9]/);
						return (match !== null) ? match[0] : '';
					},
					ini = '', i;
			
			for (i=0; i<parts.length; i++) {
				ini += sntz(parts[i]);
			}
			if (ini.length > max) {
				ini = ini[0] + ini[ini.length-1];
			}
			if (ini.length > 3 && ini.search(/[A-Z]/) !== -1) {
				ini = ini.replace(/[a-z]+/g, '');
			}
			return ini.substr(0, 3).toUpperCase();
		}
	}
});	
