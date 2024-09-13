/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/themes/silver/main/ts/ui/core/complex/FontsizeSelect.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.FontSizeSelect', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Select',
	alias: ['widget.so-tmcetoolfontsizeselect'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	uses: [
		'Sonicle.plugin.FieldTooltip'
	],
	plugins: ['sofieldtooltip'],
	
	tooltip: 'Size',
	labelField: 'label',
	formatField: 'format',
	width: 80,
	
	/**
	 * @cfg {String[]} [fontsizeFormats]
	 * Array of String font-size items to be displayed in this select.
	 */
	fontsizeFormats: ['10px', '12px', '14px', '16px', '18px', '24px', '36px', '48px'],
	
	defaultText: 'Default',
	
	constructor: function(cfg) {
		var me = this,
				icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, {fontsizeFormats: true});
		if (icfg.fontsizeFormats) {
			var formatField = me.formatField,
					data = Ext.Array.map(icfg.fontsizeFormats, function(token) {
						return [token.replace(/;$/, '')];
					});
			cfg = Ext.apply(cfg, {
				store: {
					type: 'array',
					autoLoad: true,
					autoLoadOnValue: true,
					fields: [formatField],
					data: data
				},
				valueField: formatField,
				displayField: formatField
			});
		}
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		me.on('select', me.onSelectFontSize, me);
	},
	
	onDestroy: function() {
		var me = this;
		me.un('select', me.onSelectFontSize, me);
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
	
	setFontSizeValue: function(fontSize) {
		var me = this,
				mrec = me.findMatchingRec(fontSize);
		if (mrec) {
			me.setValue(mrec.get(me.valueField));
			me.setEmptyText(null);
		} else {
			me.setValue(null);
			me.setEmptyText(Sonicle.String.deflt(fontSize, me.defaultText));
		}
	},
	
	privates: {
		onEditorNodeChange: function() {
			this.setFontSizeValue(this.getHtmlEditor().editorQueryCommand('FontSize'));
		},
		
		onSelectFontSize: function(s, rec) {
			this.getHtmlEditor().editorExecuteCommand('FontSize', rec.get(s.formatField), {focus: true});
		},
		
		round: function(number, precision) {
			var factor = Math.pow(10, precision);
			return Math.round(number * factor) / factor;
		},
		
		toPt: function(fontSize, precision) {
			if (/[0-9.]+px$/.test(fontSize)) {
				// Round to the nearest 0.5
				return this.round(parseInt(fontSize, 10) * 72 / 96, precision || 0) + 'pt';
			}
			return fontSize;
		},
		
		findMatchingRec: function(fontSize) {
			var me = this,
				prec, pt, idx;
		
			// checking for three digits after decimal point, should be precise enough
			for (prec = 3; prec >= 0; prec--) {
				pt = me.toPt(fontSize, prec);
				idx = me.store.findBy(function(rec) {
					var format = rec.get(me.formatField);
					return format === fontSize || format === pt;
				});
				if (idx > -1) return me.store.getAt(idx);
			}
			return undefined;
		}
	}
});
