/*
 * Sonicle ExtJs UX
 * Copyright (C) 2023 Sonicle S.r.l.
 * sonicle[at]sonicle.com
 * https://www.sonicle.com
 * Inspired by:
 *  - https://eliep.github.io/vue-avatar/
 *  - https://flatuicolors.com/
 *  - https://github.com/google/palette.js/tree/master
 */
Ext.define('Sonicle.mixin.Avatar', {
	extend: 'Ext.Mixin',
	
	mixinConfig: {
		id: 'so-avatar',
		before: {
			initComponent: 'avatarBeforeInitComponent'
		}
	},
	
	/**
	 * @cfg {circular|rounded|squared} [avatarStyle=circular]
	 */
	avatarStyle: 'circular',
	
	/**
	 * @deprecated use {@link #avatarStyle} instead
	 * @cfg {circle|square} [geometry]
	 * Changes avatar's geomerty.
	 */
	
	/**
	 * @cfg {Number} [lighten=80]
	 * The amount value used to lighten the initial text color (-255 to 255).
	 */
	//lighten: 80,
	
	/**
	 * @cfg {Number} [luminanceThreshold=0.64]
	 * The relative-luminance threshold (0-1) used to distinguish between a dark/light color.
	 * Colors with a computed relative-luminance below the threshold are considered dark, light otherwise.
	 */
	luminanceThreshold: 0.64,
	
	/**
	 * @cfg {Number/Number[]} [foreColorShade=0.4]
	 * The percentage increment (0-1) applied when calculating the (lighter/darker) foreground color shade.
	 */
	foreColorShade: 0.6,
	
	/**
	 * @cfg {String} [emptyColor=#F1F3F4]
	 * A 7-chars color hex code to be applied when initials cannot be computed.
	 */
	emptyColor: '#F1F3F4',
	
	/**
	 * @cfg {String} [pictureBgColor=#F1F3F4]
	 * A 7-chars color hex code to be applied as background color for picture.
	 */
	pictureBgColor: '#F1F3F4',
	
	/**
	 * @property {String[]} [colors]
	 * An array of 7-chars color hex code strings (with leading # symbol).
	 * This array can contain any number of colors, and each hex code should be unique.
	 * Defaults to {@link #palette color palette}.
	 */
	colors: undefined,
	
	/**
	 * @private
	 */
	seed: 0,
	
	avatarBeforeInitComponent: function() {
		var me = this;
		if ('circle' === me.geometry) me.avatarStyle = 'circular';
		if ('square' === me.geometry) me.avatarStyle = 'squared';
	},
	
	privates: {
		
		/**
		 * Configures an HTML element (span) that represents the avatar using passed configuration data.
		 * @param {Object} data An object containing data.
		 * @param {String} [data.pictureUrl] The picture URL to use to fill the avatar HTML element. It has precedence over {@link data.name}.
		 * @param {String} [data.iconCls] The icon Class to use to fill the avatar HTML element. It has precedence over {@link data.name}.
		 * @param {String} [data.name] The String name for which build the avatar.
		 * @param {Object} opts An object containing options.
		 * @param {String} [opts.wrapElType=span] The type of the returned HTML element: span or div.
		 * @param {String} [opts.dataRef] The data-ref attritute to apply to the returned HTML element.
		 * @param {String} [opts.wrapCls] The CSS Class that define the style of the returned HTML element (main wrap). Note that a Class like '<wrapCls>-empty' will be added when avatar cannot be computed.
		 * @param {String} [opts.pictureCls] The CSS Class to define the style of the returned HTML element when using a picture.
		 * @param {String} [opts.initialsCls] The CSS Class to define the style of the returned HTML element when initials are rendered.
		 * @param {Integer} [opts.size=32] The size in pixel of the returned HTML element (only useful when {@link #opts.forceWrapSize} is on).
		 * @param {Boolean} [opts.forceWrapSize=true] Set to `false` to not force any size to the returned HTML element.
		 * @returns {String}
		 */
		buildAvatarHtml: function(data, opts) {
			data = data || {};
			opts = opts || {};
			var me = this,
				SoS = Sonicle.String,
				wrapElType = opts.wrapElType || 'span',
				dataRef = Ext.isString(opts.dataRef) ? ('data-ref="' + SoS.htmlAttributeEncode(opts.dataRef) + '"') : '',
				wrapCls = opts.wrapCls || '',
				pictureCls = opts.pictureCls || '',
				initialsCls = opts.initialsCls || '',
				size = Ext.isNumber(opts.size) ? opts.size : 32,
				wrapStyles = {
					borderRadius: me.wrapRadius()
				},
				render = (!Ext.isEmpty(data.pictureUrl) || !Ext.isEmpty(data.iconCls)) ? 1 : (!Ext.isEmpty(data.name) ? 2 : 0),
				html = '',
				spanStyles;
			
			if (opts.forceWrapSize !== false) {
				Ext.apply(wrapStyles, {
					width: size + 'px',
					height: size + 'px',
					lineHeight: size + 'px'
				});
			}
			
			if (render === 1) {
				if (!Ext.isEmpty(data.iconCls)) {
					wrapCls += (' '+Ext.String.trim(data.iconCls));
				} else {
					wrapCls += (' '+pictureCls);
					Ext.apply(wrapStyles, {
						backgroundColor: me.pictureBgColor,
						backgroundImage: !Ext.isEmpty(data.pictureUrl) ? 'url(' + data.pictureUrl + ')' : null
					});
				}
				
			} else if (render === 2) {
				var bgColor = me.randomColor(data.name, me.colorPalette()) || me.emptyColor;
				wrapCls += (' '+initialsCls);
				wrapStyles.backgroundColor = bgColor;
				spanStyles = me.initialsStyles(bgColor, size);
				
			} else {
				if (!Ext.isEmpty(opts.wrapCls)) wrapCls += (' '+opts.wrapCls+'-empty');
				wrapStyles.backgroundColor = me.emptyColor;
			}
			
			html += '<' + wrapElType + ' ' + dataRef + ' class="' + wrapCls + '" style="' + Ext.dom.Helper.generateStyles(wrapStyles) + '">';
			if (render === 2) {
				html += '<span style="' + Ext.dom.Helper.generateStyles(spanStyles) + '">';
				html += Sonicle.mixin.Avatar.calcInitials(data.name, 2);
				html += '</span>';
			}
			html += '</' + wrapElType + '>';
			return html;
		},
		
		/**
		 * Selects a random color for the passed text.
		 * In case of empty colors or text, `undefined` will be returned.
		 * @param {String} text The source text.
		 * @param {Array} colors The palette of colors from which to choose.
		 * @returns {String|undefined}
		 */
		randomColor: function(text, colors) {
			if (!Ext.isArray(colors) || Ext.isEmpty(colors) || !Ext.isString(text) || Ext.isEmpty(text)) {
				return undefined;
			} else {
				return colors[text.length % (colors.length)];
			}
		},
		
		colorPalette: function() {
			return this.colors || Sonicle.mixin.Avatar.palette;
		},
		
		wrapRadius: function() {
			var style = this.avatarStyle;
			if ('circular' === style) return '50%';
			else if ('rounded' === style) return '15%';
			return null;
		},
		
		initialsStyles: function(bgColor, avatarSize) {
			var SoC = Sonicle.ColorUtils,
				thres = this.luminanceThreshold,
				shade = this.foreColorShade,
				lum = SoC.luminance(bgColor);
			return {
				color: SoC.shade(bgColor, (lum > thres) ? (shade * -1) : shade),
				//color: Sonicle.mixin.Avatar.lightenDarken(bgColor, this.lighten),
				fontSize: Math.floor(avatarSize/2) + 'px'
			};
		}
	},
	
	statics: {
		
		/**
		 * The default color palette consisting of an array of 
		 * 7-chars color hex code strings (with leading # symbol).
		 */
		palette: [
			'#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
			'#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
			'#8BC34A', '#CDDC39', /*'#FFEB3B',*/ '#FFC107', '#FF9800',
			'#FF5722', '#795548', '#9E9E9E', '#607D8B'
		],
		
		/**
		 * Compute initials of a name
		 * These rule will be followed:
		 *  - divide the username on space and hyphen
		 *  - use the first letter of each parts ignoring any text inside brackets
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
					// Skip any text inside brackets
					s = s.replace(/\(.*\)|\[.*\]|{.*}/, '');
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
		
		/*
		lightenDarken: function(color, amount) {
			var co = Ext.util.Color.create(color);
			co.setRGB(co.r + amount, co.g + amount, co.b + amount);
			return co.toHex();
		}
		*/
	}
});
