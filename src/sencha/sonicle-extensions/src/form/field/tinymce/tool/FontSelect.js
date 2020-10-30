/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/complex/FontSelect.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.FontSelect', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Select',
	alias: ['widget.so-tmcetoolfontselect'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	uses: [
		'Sonicle.String',
		'Sonicle.plugin.FieldTooltip'
	],
	plugins: ['sofieldtooltip'],
	
	tooltip: 'Font',
	nameField: 'name',
	formatField: 'format',
	width: 150,
	
	/**
	 * @cfg {String[]} [fontFormats]
	 * Array of String items in the form `name=font-family` of fonts to be displayed in this select.
	 */
	fontFormats: [
		"Andale Mono='andale mono',times",
		"Arial=arial,helvetica,sans-serif",
		"Arial Black='arial black','avant garde'",
		"Book Antiqua='book antiqua',palatino",
		"Comic Sans MS='comic sans ms',sans-serif",
		"Courier New='courier new',courier",
		"Georgia=georgia,palatino",
		"Helvetica=helvetica",
		"Impact=impact,chicago",
		"Symbol=symbol",
		"Tahoma=tahoma,arial,helvetica,sans-serif",
		"Terminal=terminal,monaco",
		"Times New Roman='times new roman',times",
		"Trebuchet MS='trebuchet ms',geneva",
		"Verdana=verdana,geneva",
		"Webdings=webdings",
		"Wingdings=wingdings,'zapf dingbats'"
	],
	
	defaultText: 'Default',
	
	constructor: function(cfg) {
		var me = this,
				icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, {'fontFormats': true});
		if (icfg.fontFormats) {
			var nameFld = me.nameField,
					data = Ext.Array.map(icfg.fontFormats, function(token) {
						var vals = token.replace(/;$/, '').split('=');
						if (vals.length > 1) {
							return [vals[0], vals[1]];
						}
					});
			cfg = Ext.apply(cfg, {
				store: {
					type: 'array',
					autoLoad: true,
					autoLoadOnValue: true,
					fields: [nameFld, me.formatField],
					data: data
				},
				valueField: nameFld,
				displayField: nameFld
			});
		}
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		me.listConfig = Ext.apply(me.listConfig || {}, {
			getInnerTpl: Sonicle.form.field.tinymce.tool.FontSelect.buildInnerTpl(me.valueField, me.formatField)
		});
		me.callParent(arguments);
		me.on('select', me.onSelectFont, me);
	},
	
	doDestroy: function() {
		var me = this;
		me.un('select', me.onSelectFont, me);
		me.callParent();
	},
	
	bindEditor: function(editor, htmlEditor) {
		var me = this,
				monCbks = me.getEditorMonitoredCallbacks();
		if (htmlEditor) {
			me.editor = editor;
			monCbks['onNodeChange'] = Ext.bind(me.onEditorNodeChange, me);
			editor.on('NodeChange', monCbks['onNodeChange']);
		} else if (editor) {
			editor.off('NodeChange', monCbks['onNodeChange']);
		}
	},
	
	setFontNameValue: function(fontName) {
		var me = this,
				mrec = me.findMatchingRec(Sonicle.String.lower(fontName));
		if (mrec) {
			me.setValue(mrec.get(me.valueField));
			me.setEmptyText(null);
		} else {
			me.setValue(null);
			me.setEmptyText(Sonicle.String.deflt(fontName, me.defaultText));
		}
	},
	
	privates: {
		onEditorNodeChange: function() {
			this.setFontNameValue(this.getHtmlEditor().editorQueryCommand('FontName'));
		},
		
		onSelectFont: function(s, rec) {
			this.getHtmlEditor().editorExecuteCommand('FontName', rec.get(s.formatField), {focus: true});
		},
		
		splitFonts: function(fontFamily) {
			var fonts = fontFamily.split(/\s*,\s*/);
			return Ext.Array.map(fonts, function(font) {
				return font.replace(/^['"]+|['"]+$/g, '');
			});
		},

		findMatchingRec: function(fontName) {
			var me = this,
					lower = Sonicle.String.lower,
					firstFont = function(fontName) {
						return fontName ? me.splitFonts(fontName)[0] : '';
					},
					font = fontName ? lower(fontName) : '',
					idx;

			idx = me.store.findBy(function(rec) {
				var format = rec.get(me.formatField);
				return (lower(format) === font) || (lower(firstFont(format)) === lower(firstFont(font)));
			});
			return idx > -1 ? me.store.getAt(idx) : undefined;
		}
	},
	
	statics: {
		buildInnerTpl: function(valueField, formatField) {
			return function(displayField) {
				return '<span style="{[Sonicle.form.field.tinymce.tool.FontSelect.computeListStyle(values, \"'+valueField+'\",\"'+formatField+'\")]}">{' + displayField + '}</span>';
			};
		},
		
		computeListStyle: function(values, valueField, formatField) {
			return values[valueField].indexOf('dings') === -1 ? 'font-family:' + values[formatField] : '';
		}
	}
});
