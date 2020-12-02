/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.HTMLEditor', {
	extend: 'Ext.form.FieldContainer',
	alias: ['widget.sotmcehtmleditor'],
	mixins: {
        field: 'Ext.form.field.Field'
    },
	requires: [
		'Sonicle.form.field.tinymce.TextArea',
		'Sonicle.form.field.tinymce.TextAreaPlain',
		'Sonicle.form.field.tinymce.tool.base.Button',
		'Sonicle.form.field.tinymce.tool.base.MenuItem',
		'Sonicle.form.field.tinymce.tool.base.Select',
		'Sonicle.form.field.tinymce.tool.base.SplitButton',
		'Sonicle.form.field.tinymce.tool.base.StateButton',
		'Sonicle.form.field.tinymce.tool.base.StateMenuItem'
	],
	uses: [
		'Sonicle.String',
		'Sonicle.Object',
		'Sonicle.form.field.tinymce.tool.FontSelect',
		'Sonicle.form.field.tinymce.tool.FontSizeSelect',
		'Sonicle.form.field.tinymce.tool.ColorFore',
		'Sonicle.form.field.tinymce.tool.ColorBack',
		'Sonicle.form.field.tinymce.tool.FormatBold',
		'Sonicle.form.field.tinymce.tool.FormatItalic',
		'Sonicle.form.field.tinymce.tool.FormatUnderline',
		'Sonicle.form.field.tinymce.tool.FormatTools',
		'Sonicle.form.field.tinymce.tool.AlignSelect',
		'Sonicle.form.field.tinymce.tool.NumListSelect',
		'Sonicle.form.field.tinymce.tool.BullListSelect',
		'Sonicle.form.field.tinymce.tool.Emoticons',
		'Sonicle.form.field.tinymce.tool.Symbols',
		'Sonicle.form.field.tinymce.tool.Link',
		'Sonicle.form.field.tinymce.tool.Image',
		'Sonicle.form.field.tinymce.tool.Table',
		'Sonicle.form.field.tinymce.tool.DevTools'
	],
	
	focusable: true,
	defaultBindProperty: 'value',
	
	/**
	 * @cfg {Boolean} [wysiwyg=true]
	 * Set to `false` to disable WYSIWYG mode activating plain-text mode.
	 */
	wysiwyg: true,
	
	/**
     * @cfg {String} defaultButtonUI
     * A default {@link Ext.Component#ui ui} to use for the HtmlEditor's toolbar
     * {@link Ext.button.Button Buttons}
     */
    defaultButtonUI: 'default-toolbar',
	
	/**
	 * @cfg {String} [language=en]
	 * One of TinyMCE language codes.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	language: 'en',
	
	/**
	 * @cfg {String} [skin=oxide]
	 * One of available TinyMCE skins.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	skin: 'oxide',
	
	/**
	 * @cfg {Boolean} [showElementPath=true]
	 * Set to `false` to hide HTML elements breadcrumb in footer.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	showElementPath: true,
	
	/**
	 * @cfg {Boolean} [showWordCount=true]
	 * Set to `false` to hide words count info in footer.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	showWordCount: true,
	
	/**
	 * @cfg {Boolean} [enableFont=true]
	 * Set to `false` to hide font select.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableFont: true,
	
	/**
	 * @cfg {Boolean} [enableFontSize=true]
	 * Set to `false` to hide font-size select.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableFontSize: true,
	
	/**
	 * @cfg {Boolean} [enableColors=true]
	 * Set to `false` to hide color controls.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableColors: true,
	
	/**
	 * @cfg {Boolean} [enableFormats=true]
	 * Set to `false` to hide format controls.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableFormats: true,
	
	/**
	 * @cfg {Boolean} [enableAlignments=true]
	 * Set to `false` to hide text alignment controls.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableAlignments: true,
	
	/**
	 * @cfg {Boolean} [enableLists=true]
	 * Set to `false` to hide lists controls.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableLists: true,
	
	/**
	 * @cfg {Boolean} [enableEmoticons=true]
	 * Set to `false` to hide emoticons button.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableEmoticons: true,
	
	/**
	 * @cfg {Boolean} [enableEmoticons=true]
	 * Set to `false` to hide symbols button.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableSymbols: true,
	
	/**
	 * @cfg {Boolean} [enableLink=true]
	 * Set to `false` to hide link-insert button.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableLink: true,
	
	/**
	 * @cfg {Boolean} [enableImage=true]
	 * Set to `false` to hide image-insert button.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableImage: true,
	
	/**
	 * @cfg {Boolean} [enableTable=true]
	 * Set to `false` to hide table-insert button.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableTable: true,
	
	/**
	 * @cfg {Boolean} [enableDevTools=true]
	 * Set to `false` to hide developer button.
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	enableDevTools: true,
	
	/**
	 * @cfg {String[]} fonts
	 * Array of Font items (in form 'name=family') to display in select.
	 * Useful only when {@link #wysiwyg} is `true` and {@link #enableFont} is active.
	 */
	
	/**
	 * @cfg {String[]} fontSizes
	 * Array of Font sizes to display in select.
	 * Useful only when {@link #wysiwyg} is `true` and {@link #enableFont} is active.
	 */
	
	/**
	 * @cfg {String[]} fontColors
	 * Array of {@link Ext.picker.Color#colors}.
	 * Useful only when {@link #wysiwyg} is `true` and {@link #enableColors} is active.
	 */
	
	/**
	 * @cfg {String[]} fontColorsTilesPerRow
	 * Desired {@link Sonicle.picker.Color#tilesPerRow number of tiles} to display.
	 * Useful only when {@link #wysiwyg} is `true` and {@link #enableColors} is active.
	 */
	
	/**
	 * @cfg {Boolean} [pluginAdvCodeEditor=false]
	 * Set to `true` to enable AdvanceCodeEditor plugin.
	 */
	pluginAdvCodeEditor: false,
	
	/**
	 * @cfg {Boolean} [pluginPowerPaste=false]
	 * Set to `true` to enable PowerPaste plugin.
	 */
	pluginPowerPaste: false,
	
	/**
	 * @cfg {Boolean} [pasteAllowBlobImages=true]
	 * Set to `false` to avoid that pasted images are inserted as blob images (data:url)
	 */
	pasteAllowBlobImages: true,
	
	/**
	 * @cfg {Boolean} [uploadBlobImages=true]
	 * Set to `false` to disable blob-images upload using {@link #imagesUploadHandler} function.
	 */
	uploadBlobImages: true,
	
	/**
	 * @cfg {Function} [imagesUploadHandler]
	 * A function called in order to perform upload of blob images resulting 
	 * from paste (or drag) operations directly into the editor. Config 
	 * {@link #uploadBlobImages} must be set to `true` in oder to make this 
	 * function callable by internal flow. Please notify update status using 
	 * provided callbacks.
	 * 
	 * @param {Object} blobInfo Blob-info data object.
	 * @param {Function} success Success callback function that takes the URL value to be referenced.
	 * @param {Function} failure Failure callback function that takes an optional message.
	 * @param {Function} [progress] Progress callback function that takes a value between 1 and 100.
	 */
	
	/**
	 * @cfg {clean|merge|prompt} pasteWordMode
	 * Controls how content pasted from Microsoft Word is filtered.
	 */
	
	/**
	 * @cfg {clean|merge|prompt} pasteHtmlMode
	 * Controls how content pasted from sources other than Microsoft Word is filtered.
	 */
	
	/**
	 * @cfg {String} contentStyle
	 * Allows you to set custom CSS styles as a string that is injected into the editor’s iframe.
	 */
	
	/**
	 * @cfg {Object} tmceExtraConfig
	 * Specify optional custom button {@link Sonicle.form.field.tinymce.TextArea} editor config for TinyMCE
	 */
	
	/**
	 * @cfg {Object} [toolIcons]
	 * Object collection of icons for buttons and items in editor's toolbar.
	 * The key is the itemId name associated with tool, and value is object 
	 * containing one or more icons:
	 * 
	 *     {
	 *         bold: {
	 *             toolIconCls: 'my-bold-icon',
	 *         },
	 *         // ...
	 *     }
	 * 
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	
	/**
	 * @cfg {Object} [toolTexts]
	 * Object collection of tooltips/texts for buttons and items in editor's toolbar.
	 * The key is the itemId name associated with tool, and value is object 
	 * containing properties like tooltipTitle and tooltipText (both uses if 
	 * QuickTips enabled) or other properties to lookup specific text values:
	 * 
	 *     {
	 *         bold: {
	 *             tooltipTitle: 'Bold (Ctrl+B)',
	 *             tooltipText: 'Make the selected text bold.'
	 *         },
	 *         italic: {
	 *             tooltipTitle: 'Italic (Ctrl+I)',
	 *             tooltipText: 'Make the selected text italic.'
	 *         }
	 *         // ...
	 *     }
	 * 
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	toolTexts: {
		fontselect: {
			tooltipTitle: 'Font',
			defaultText: 'Default'
		},
		fontsizeselect: {
			tooltipTitle: 'Font size',
			defaultText: 'Default'
		},
		forecolor: {
			tooltipTitle: 'Font Color',
			tooltipText: 'Change the color of the selected text',
			removeColorText: 'Remove color'
		},
		backcolor: {
			tooltipTitle: 'Text Highlight Color',
			tooltipText: 'Change the background color of the selected text',
			removeColorText: 'Remove color'
		},
		bold: {
			tooltipTitle: 'Bold (Ctrl+B)',
			tooltipText: 'Make the selected text bold'
		},
		italic: {
			tooltipTitle: 'Italic (Ctrl+I)',
			tooltipText: 'Make the selected text italic'
		},
		underline: {
			tooltipTitle: 'Underline (Ctrl+U)',
			tooltipText: 'Underline the selected text'
		},
		formattools: {
			tooltipTitle: 'More formatting tools',
			strikethroughText: 'Strikethrough',
			subscriptText: 'Subscript',
			superscriptText: 'Superscript',
			blockquoteText: 'Citation',
			outdentText: 'Outdent',
			indentText: 'Indent',
			clearformatText: 'Clear formatting'
		},
		alignselect: {
			tooltipTitle: 'Align',
			alignLeftText: 'Left',
			alignCenterText: 'Center',
			alignRightText: 'Right',
			alignJustifyText: 'Justify'
		},
		bulllistselect: {
			tooltipTitle: 'Bullet lists',
			tooltipText: 'Insert an unordered list',
			defaultText: 'Default',
			circleText: 'Circle',
			squareText: 'Square'
		},
		numlistselect: {
			tooltipTitle: 'Numbered list',
			tooltipText: 'Insert an ordered list',
			defaultText: 'Default',
			lowerAlphaText: 'Lower Alpha',
			lowerGreekText: 'Lower Greek',
			lowerRomanText: 'Lower Roman',
			upperAlphaText: 'Upper Alpha',
			upperRomanText: 'Upper Roman'
		},
		emoticons: {
			tooltipTitle: 'Emoticons',
			tooltipText: 'Insert an emoticon in the text'
		},
		symbols: {
			tooltipTitle: 'Symbols',
			tooltipText: 'Insert a symbol in the text'
		},
		link: {
			tooltipTitle: 'Hyperlink',
			tooltipText: 'Insert a hyperlink in the text',
			promptTitleText: 'Insert a hyperlink',
			promptMsgText: 'URL',
			suggestMailToText: 'The URL you entered seems to be an email address. Do you want to add the "mailto:" prefix?',
			suggestTelText: 'The URL you entered seems to be a telephone number. Do you want to add the "tel:" prefix?',
			suggestProtoText: 'The URL you entered seems to be an external link. Do you want to add the "{0}" prefix?'
		},
		image: {
			tooltipTitle: 'Inline image',
			tooltipText: 'Insert an image from link or file',
			insertImageUrlText: 'Link image from URL',
			insertImageUrlPromptTitleText: 'Insert an image',
			insertImageUrlPromptMsgText: 'Image URL',
			insertImageFileText: 'Upload from file'
		},
		table: {
			tooltipTitle: 'Table',
			tooltipText: 'Insert a table in the text'
		},
		devtools: {
			tooltipTitle: 'Developer tools',
			tooltipText: 'Show sources or insert a piece of code',
			codeSampleText: 'Insert/Edit code sample',
			sourceCodeText: 'Source code'
		}
	},
	
	/**
	 * @cfg {Object} [customTools]
	 * Object collection of custom tool items in editor's toolbar, to be appended
	 * between the last displayed tool and the right-most tool (devtools if present).
	 * The key is the itemId name associated with tool, and value is tool config.
	 * 
	 *     {
	 *         mycustomtool: {
	 *             xtype: 'x-mycustomtool',
	 *             // With optional position...
	 *             // pos: 18
	 *             // ...
	 *         }
	 *     }
	 * 
	 * Position is affected by the enabling status of each tool and of built-in separators.
	 * The sequence below may help to find the right pos value:
	 * [fontselect][fontsizeselect][-,forecolor,backcolor][bold,italic,underline,formattools][-,[alignselect],[bulllistselect,numlistselect]],[[-],[emoticons],[link],[image],[table],[symbols]]
	 * 
	 * Useful only when {@link #wysiwyg} is `true`.
	 */
	
	/**
	 * @cfg {String} [defaultFont]
	 * The default fontFamily to set.
	 */
	defaultFont: undefined,
	
	/**
	 * @cfg {String} [defaultFontSize]
	 * The default fontSize to set.
	 */
	defaultFontSize: undefined,
	
	/**
	 * @cfg {String} [defaultForeColor]
	 * The default fontSize to set.
	 */
	defaultForeColor: undefined,
	
	constructor: function(cfg) {
		var me = this,
				icfg = Sonicle.Utils.getConstructorConfigs(me, cfg, [
					{wysiwyg: true, enableFormat: true, enableClean: true, enableLinks: true, enableSourceEdit: true}
				]),
				evalOldCfg = function(icfg, cfg, oldname, newname) {
					if (icfg[oldname] === true) {
						cfg[newname] = true;
						Ext.warn('Config \'' + oldname + '\' is deprecated. Use \'' + newname + '\' instead.');
					}
				};
		
		me.isWysiwyg = icfg.wysiwyg === false ? false : true;
		
		// Support legacy configs
		evalOldCfg(icfg, cfg, 'enableFormat', 'enableFormats');
		evalOldCfg(icfg, cfg, 'enableClean', 'enableFormats');
		evalOldCfg(icfg, cfg, 'enableLinks', 'enableLink');
		evalOldCfg(icfg, cfg, 'enableSourceEdit', 'enableDevTools');
		
		me.callParent([cfg]);
	},
	
	initComponent: function() {
		var me = this,
				HE = Sonicle.form.field.tinymce.HTMLEditor;
		
		me.defFontFamily = HE.getContentFontFamily(me.fonts, me.defaultFont);
		me.defFontSize = me.defaultFontSize; // Do NOT be strict, allow any font sizes!
		//me.defFontSize = HE.getContentFontSize(me.fontSizes, me.defaultFontSize); // BE strict, allow only a set of font sizes!
		me.defColor = HE.getContentColor(me.fontColors, me.defaultForeColor);
		
		if (me.isWysiwyg) {
			Ext.apply(me, {
				layout: 'border',
				items: [
					me.getToolbarCfg({region: 'north'}),
					me.getTextAreaCfg({region: 'center'})
				]
			});
		} else {
			Ext.apply(me, {
				layout: 'fit',
				items: [
					me.getTextAreaCfg({region: 'center'})
				]
			});
		}
		me.callParent(arguments);
		me.initField();
	},
	
	getToolbar: function() {
		return this.isWysiwyg ? this.getComponent(0) : null;
	},
	
	getToolbarCmp: function(name) {
		var tb = this.getToolbar();
		return tb ? tb.getComponent(name) || null : null;
	},
	
	getTextArea: function() {
		var me = this;
		return me.isWysiwyg ? me.getComponent(1) : me.getComponent(0);
	},
	
	getEditor: function() {
		var cmp = this.getTextArea();
		return cmp && cmp.isXType('sotmcetextarea') ? cmp.getEditor() : undefined;
	},
	
	isReady: function() {
		var cmp = this.getTextArea(), ready = false;
		if (cmp) {
			ready = cmp.isXType('sotmcetextarea') ? cmp.getEditor().isReady : cmp.rendered;
		}
		return ready;
	},
	
	resetHistoryBookmark: function() {
		var me = this,
				cmp = this.getTextArea();
		me.historyBookmark = cmp.changeCounter;
	},
	
	isHistoryBookmarkDirty: function() {
		var me = this,
				cmp = this.getTextArea();
		return me.historyBookmark !== cmp.changeCounter;
	},
	
	onTMCETextAreaEdReady: function(s, editor) {
		var me = this,
				toolEditor = function(id) {
					var cmp = me.getToolbarCmp(id);
					if (cmp) cmp.setHtmlEditor(me);
				};
		
		//editor.on('keydown', Ext.bind(me.onTMCETextAreaEdKeyDown, me, editor, true));
		//editor.on('NodeChange', Ext.bind(me.onTMCETextAreaEdNodeChange, me));
		//editor.on('OpenWindow', me.onTMCETextAreaEdOpenWindow);
		//editor.on('CloseWindow', me.onTMCETextAreaEdCloseWindow);
		
		toolEditor('fontselect');
		toolEditor('fontsizeselect');
		toolEditor('forecolor');
		toolEditor('backcolor');
		toolEditor('bold');
		toolEditor('italic');
		toolEditor('underline');
		toolEditor('formattools');
		toolEditor('alignselect');
		toolEditor('numlistselect');
		toolEditor('bulllistselect');
		toolEditor('emoticons');
		toolEditor('symbols');
		toolEditor('link');
		toolEditor('image');
		toolEditor('table');
		toolEditor('devtools');
		
		if (Ext.isObject(me.customTools)) {
			Ext.iterate(me.customTools, function(key) {
				toolEditor(key);
			});
		}
		
		// Invoke focus if there was a pending call started before get ready
		if (me.pendingFocusOnTMCETextArea) {
			me.focus.apply(me, me.pendingFocusOnTMCETextArea);
			delete me.pendingFocusOnTMCETextArea;
		}
	},
	
	/*
	onTMCETextAreaEdKeyDown: function(e, editor) {
		var me = this;
		if (e.keyCode === Ext.event.Event.BACKSPACE || e.keyCode === Ext.event.Event.DELETE) {
			return;
			Ext.defer(function() {
				var content = editor.getContent({format: 'text'}), node;
				if (Ext.isEmpty(content) || content === '\n' || content === ' &#13;') {
					editor.setContent('');
					me.editorSetBodyFormatting({editor: editor});
					editor.selection.setCursorLocation(editor.getBody().firstChild, 0);
					me.editorApplyDefaultFormatting({editor: editor});
					
				} else {
					node = me.editorGetSelection({editor: editor});
					if ('P' === node.nodeName || 'DIV' === node.nodeName) {
						if (!node.hasChildNodes() || 'BR' === node.firstChild.nodeName) {
							me.editorApplyDefaultFormatting({editor: editor});
							me.editorGetDocument({editor: editor}).execCommand('Delete', false, null);
						}
					} else if ('SPAN' === node.nodeName && node.hasChildNodes() && node.firstChild.nodeName === 'BR') {
						var textNode = me.editorGetDocument({editor: editor}).createTextNode('');
						node.insertBefore(textNode, node.firstChild);
					}
				}
			}, 1);
			
		} else if (e.keyCode === Ext.event.Event.ENTER) {
			Ext.defer(function() {
				var node = me.editorGetSelection({editor: editor});
				if ('P' === node.nodeName || 'DIV' === node.nodeName) {
					if (!node.hasChildNodes() || 'BR' === node.firstChild.nodeName) {
						
						//mmmmmmmmmmmmmmmmmmmm
						me.editorGetDocument({editor: editor}).execCommand('Delete', false, null);
						node = me.editorGetSelection({editor: editor});
						if ('P' === node.nodeName || 'DIV' === node.nodeName) {
							node.appendChild(me.editorGetDocument({editor: editor}).createElement('br'));
						}
						////////////////////////
						//me.editorApplyDefaultFormatting({editor: editor});
					}
				}
			}, 1);
		}
	},
	*/
	
	onTMCETextAreaEdChange: function(s, value) {
		var me = this;
		me.mixins.field.setValue.call(me, value);
		if (!Ext.isNumber(s.changeCounter)) s.changeCounter = 0;
		s.changeCounter++;
	},
	
	onTextAreaChange: function(s, newValue, oldValue) {
		var me = this;
		me.mixins.field.setValue.call(me, newValue);
		if (!Ext.isNumber(s.changeCounter)) s.changeCounter = 0;
		s.changeCounter++;
	},
	
	setValue: function(value) {
		var me = this;
		// Only update the field if the value has changed
		if (me.value !== value) {
			me.getTextArea().setValue(value);
			me.mixins.field.setValue.call(me, value);
		}
		return me;
	},
	
	onDisable: function() {
		var me = this;
		me.callParent();
		me.getTextArea().setDisabled(true);
	},
	
	onEnable: function() {
		var me = this;
		me.callParent();
		me.getTextArea().setDisabled(false);
	},
	
	focus: function(selectText, delay) {
		var me = this,
				cmp = me.getTextArea();
		
		if (me.isReady()) {
			cmp.focus([0, 0], delay);
		} else {
			if (cmp.isXType('sotmcetextarea')) {
				me.pendingFocusOnTMCETextArea = arguments;
			}
		}
	},
	
	getTextAreaCfg: function(cfg) {
		var me = this;
		if (me.isWysiwyg) {
			return Ext.apply({
				xtype: 'sotmcetextarea',
				editor: Ext.merge({
					language: me.language,
					skin: me.skin,
					plugins: me.buildTMCEPlugins(),
					quickbars_selection_toolbar: me.buildTMCEQuickbarSelToolbar(),
					quickbars_insert_toolbar: false,
					contextmenu: me.buildTMCEContextMenu(),
					toolbar: false,
					image_advtab: true,
					elementpath: me.showElementPath,
					statusbar: me.showElementPath || me.showWordCount,
					/*
					// NB: uppercase letter is used because this value is used to 
					// compare node name at many places in tinymce library (specially 
					// in createNewTextBlock function of 'lists' plugin).
					// Default value was small 'p'.
					forced_root_block : 'P',
					forced_root_block_attrs: {
						'style': 'padding:0; margin:0;' // Flatten space between paragraph blocks (like using </br> line-break)
					},
					*/
					forced_root_block : 'DIV',
					forced_root_block_attrs: {
						'style': me.generateDefaultStyles({color: false})
					},
					
					valid_children: '+body[style]',
					entity_encoding : 'numeric', // Force numeric encoding usage, we cannot use 'named+numeric' due to this https://github.com/tinymce/tinymce/issues/3213
					extended_valid_elements : 'a[name|href|target|title|onclick|dir],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style],table[style|dir|class|border=1|cellspacing|cellpadding|bgcolor|id],colgroup,col[style|dir|width],tbody,tr[style|dir|class],td[style|dir|class|colspan|rowspan|width|height],hr[class|width|size|noshade],font[face|size|color|style|dir],span[class|align|style|dir|br],p[class|style|dir|span|br]',
					invalid_elements: 'object,iframe,script,embed', // Avoid unsafe elements
					convert_fonts_to_spans: true, // Font elements are deprecated, avoid them!
					end_container_on_empty_block: true, // Split blocks after pressing ENTER two times (eg. useful for spliting BLOCKQUOTEs)
					convert_urls: false, // Disable any conversion by the editor
					relative_urls : false, // When conversion enabled (not this case), try to determine the absolute form of any URL
					remove_script_host: true, // When conversion enabled & relative_urls is active (not this case), try to remove host and proto from relative URLs
					link_assume_external_targets: true, // link/autolink: assume URLs to be external
					target_list: false, // link/autolink: disable named targets
					default_link_target: '_blank', // link/autolink: set default target
					link_default_protocol: 'http', // link/autolink: set default protocol
					link_title: false, // link/autolink: hide title field in edit dialg
					link_context_toolbar: true, // link/autolink: shows a context management toolbar over links
					
					browser_spellcheck: true,
					// Default <table> styles
					table_default_styles: {
						width: '70%',
						borderSpacing: '0'
					},
					paste_data_images: me.pasteAllowBlobImages, // paste: allow pasted images to be inserted as blob images (data:url)
					powerpaste_allow_local_images: me.pasteAllowBlobImages, // powerpaste: allow pasted images to be inserted as blob images (data:url)
					powerpaste_word_import: me.pasteWordMode || 'merge',
					powerpaste_html_import: me.pasteHtmlMode || 'merge',
					automatic_uploads: true, // Enable automatic upload of inline blob (data:url) using 'images_upload_handler' handler
					//OLDautomatic_uploads: false, // Disable automatic uploads of images represented by data URLs or blob URIs.
					images_upload_handler: function(blobInfo, success, failure, progress) {
						if (!me.uploadBlobImages) {
							failure(); // Simply signal upload failure, image is left as blob image
						} else if (Ext.isFunction(me.imagesUploadHandler)) {
							Ext.callback(me.imagesUploadHandler, me, [blobInfo, success, failure, progress]);
						} else {
							failure('imagesUploadHandler callback NOT provided');
						}
					},
					content_style: me.buildContentStyle() + Sonicle.String.deflt(me.contentStyle, '')
				}, me.tmceExtraConfig || {}),
				value: me.value,
				listeners: {
					editorready: me.onTMCETextAreaEdReady,
					editorchange: me.onTMCETextAreaEdChange,
					scope: me
				}
			}, cfg || {});
			
		} else {
			return Ext.apply({
				xtype: 'sotmceplaintextarea',
				value: me.value,
				listeners: {
					change: me.onTextAreaChange,
					scope: me
				}
			}, cfg || {});
		}
	},
	
	buildTMCEPlugins: function() {
		var me = this;
		return [
			'template quickbars',
			me.pluginPowerPaste ? 'powerpaste' : 'paste',
			me.enableLists ? 'advlist lists' : '',
			me.enableEmoticons ? 'emoticons' : '',
			me.enableSymbols ? 'charmap' : '',
			me.enableLink ? 'link autolink' : '',
			me.enableImage ? 'image' : '',
			me.enableTable ? 'table' : '',
			me.enableDevTools ? 'codesample ' + (me.pluginAdvCodeEditor ? 'advcode' : 'code') : '',
			me.showWordCount ? 'wordcount' : ''
		].join(' ');
	},
	
	buildTMCEQuickbarSelToolbar: function() {
		var me = this;
		return [
			me.enableFormats ? 'bold italic blockquote' : ''
			// Quicklink plugin seems that does not observe default protocol: 
			// when the user types an URL without specifying leading protocol, 
			// newly link become relative to browser base URL.
			// For now, keep it disabled.
			//'|',
			//me.enableLink ? 'quicklink' : ''
		].join(' ');
	},
	
	buildTMCEContextMenu: function() {
		var me = this;
		return [
			me.enableTable ? 'table' : ''
		].join(' ');
	},
	
	generateDefaultStyles: function(opts) {
		opts = opts || {};
		var me = this;
		return [
			me.defFontFamily ? 'font-family:' + me.defFontFamily + ';' : '',
			me.defFontSize ? 'font-size:' + me.defFontSize + ';' : '',
			me.defColor && opts.color !== false ? 'color:' + me.defColor + ';' : ''
		].join('');
	},
	
	buildContentStyle: function() {
		return [
			'body{',
				'margin:5px;',
				'word-wrap:break-word;',
				this.generateDefaultStyles(),
			'}',
			'td, th, p{',
				'font-family:inherit !important;',
				'font-size:inherit !important;',
			'}'
		].join('');
	},
	
	getToolbarCfg: function(cfg) {
		var me = this,
				SoU = Sonicle.Utils,
				qtipsEnabled = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled(),
				tool = function(key, xtype, cfg) {
					var extraCfg = Ext.apply(cfg || {}, me[key+'Config']),
							icons = me.toolIcons[key],
							mainCfg = {
								xtype: xtype,
								itemId: key,
								tooltip: me.getToolTooltip(key, qtipsEnabled),
								overflowText: me.getToolOvflText(key),
								tabIndex: -1
							};
					if (Ext.isObject(icons)) Ext.apply(mainCfg, icons);
					return Ext.merge(mainCfg, Ext.apply(me.getToolTexts(key) || {}, extraCfg));
				},
				items = [];
		
		if (me.enableFont) {
			items.push(
				tool('fontselect', 'so-tmcetoolfontselect', SoU.applyIfDefined({}, {
					fontFormats: me.fonts
				}))
			);
		}
		if (me.enableFontSize) {
			items.push(
				tool('fontsizeselect', 'so-tmcetoolfontsizeselect', SoU.applyIfDefined({}, {
					fontsizeFormats: me.fontSizes
				}))
			);
		}
		if (me.enableColors) {
			if (items.length > 0) items.push('-');
			items.push(
				tool('forecolor', 'so-tmcetoolforecolor', SoU.applyIfDefined({}, {
					colors: me.fontColors,
					tilesPerRow: me.fontColorsTilesPerRow
				})),
				tool('backcolor', 'so-tmcetoolbackcolor', SoU.applyIfDefined({}, {
					colors: me.fontColors,
					tilesPerRow: me.fontColorsTilesPerRow
				}))
			);
		}
		if (me.enableFormats) {
			if (items.length > 0) items.push('-');
			items.push(
				tool('bold', 'so-tmcetoolbold'),
				tool('italic', 'so-tmcetoolitalic'),
				tool('underline', 'so-tmcetoolunderline'),
				tool('formattools', 'so-tmcetoolformattools')
			);
		}
		if (me.enableAlignments || me.enableLists) {
			if (items.length > 0) items.push('-');
			if (me.enableAlignments) {
				items.push(
					tool('alignselect', 'so-tmcetoolalignselect')
				);
			}
			if (me.enableLists) {
				items.push(
					tool('bulllistselect', 'so-tmcetoolbulllistselect'),
					tool('numlistselect', 'so-tmcetoolnumlistselect')
				);
			}
		}
		if (me.enableLink || me.enableImage || me.enableEmoticons || me.enableSymbols || me.enableTable) {
			if (items.length > 0) items.push('-');
			if (me.enableEmoticons) {
				items.push(
					tool('emoticons', 'so-tmcetoolemoticons')
				);
			}
			if (me.enableLink) {
				items.push(
					tool('link', 'so-tmcetoollink')
				);
			}
			if (me.enableImage) {
				items.push(
					tool('image', 'so-tmcetoolimage')
				);
			}
			if (me.enableTable) {
				items.push(
					tool('table', 'so-tmcetooltable')
				);
			}
			if (me.enableSymbols) {
				items.push(
					tool('symbols', 'so-tmcetoolsymbols')
				);
			}
		}
		if (Ext.isObject(me.customTools)) {
			Ext.iterate(me.customTools, function(key, value) {
				var indx = Ext.isNumber(value.pos) ? value.pos-1 : -1,
					ovflText = undefined,
					item;
				if (Ext.isString(value.tooltip)) {
					ovflText = value.tooltip;
				} else if (qtipsEnabled && Ext.isObject(value.tooltip)) {
					ovflText = value.tooltip.title;
				}
				item = SoU.applyIfDefined(value, {
						itemId: key
					}, {
						overflowText: ovflText,
						tabIndex: -1
				});
				if (indx > -1) {
					items.splice(indx, -1, item);
				} else {
					items.push(item);
				}
			});
		}
		if (me.enableDevTools) {
			items.push('->');
			items.push(
				tool('devtools', 'so-tmcetooldevtools')
			);
		}
		
		return Ext.apply({
			xtype: 'toolbar',
			defaultButtonUI: me.defaultButtonUI,
			enableOverflow: true,
			items: items,
			// stop form submits
			listeners: {
				click: function(e) {
					e.preventDefault();
				},
				element: 'el'
			}
		}, cfg || {});
	},
	
	/**
	 * Sets default formatting to editor's body.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 */
	editorSetBodyFormatting: function(opts) {
		opts = opts || {};
		var me =  this,
				ed = opts.editor || me.getEditor(),
				ebody = me.editorGetBody({editor: ed}),
				style = {};
		
		if (ebody) {
			if (me.defFontFamily) style['fontFamily'] = me.defFontFamily;
			if (me.defFontSize) style['fontSize'] = me.defFontSize;
			if (me.defColor) style['color'] = me.defColor;
			Ext.fly(ebody).setStyle(style);
		}
	},
	
	/**
	 * Applies default formatting to current node.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 */
	editorApplyDefaultFormatting: function(opts) {
		opts = opts || {};
		var me =  this,
				ed = opts.editor || me.getEditor();
		if (me.defFontFamily) {
			me.editorExecuteCommand('FontName', me.defFontFamily, {editor: ed});
		}
		if (me.defFontSize) {
			me.editorExecuteCommand('FontSize', me.defFontSize, {editor: ed});
		}
	},
	
	/**
	 * Returns the document element of the editor.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {HTMLDocument} It will return document element of the editor iframe
	 */
	editorGetDocument: function(opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.getDoc() : undefined;
	},
	
	/**
	 * Returns the body element of the editor.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {HTMLBodyElement} It will return body element of the editor iframe
	 */
	editorGetBody: function(opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.getBody() : undefined;
	},
	
	/**
	 * Executes the specified command.
	 * @param {String} command Command to execute.
	 * @param {Object} [value] Optional value to pass.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {Boolean} [opts.focus] `true` to focus the editor before issuing the command.
	 * @param {Boolean} [opts.plain] `true` to use the 3-args signature of execCommand method.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {Boolean} Boolean whether the command was found or not. Undefined if editor is not available.
	 */
	editorExecuteCommand: function(command, value, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		if (ed) {
			if (opts.focus === true) ed.focus();
			if (opts.plain === true) {
				return ed.execCommand(command, value, opts.args);
			} else {
				return ed.execCommand(command, false, value, opts.args);
			}
		}
	},
	
	/**
	 * Queries the current value for a command.
	 * @param {String} command Command to check the value of.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {Object|Boolean} Command value of false if it's not found. Undefined if editor is not available.
	 */
	editorQueryCommand: function(command, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.queryCommandValue(command) : undefined;
	},
	
	/**
	 * Queries the current state for a command.
	 * @param {String} command Command to check the state of.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {Boolean|Number} Boolean value if the selected contents has specific command state or not, -1 if it's not found. Undefined if editor is not available.
	 */
	editorQueryCommandState: function(command, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.queryCommandState(command) : undefined;
	},
	
	/**
	 * Inserts content at caret position.
	 * @param {String} content Content to insert.
	 * @param {Object} [args] Optional args to pass to insert call.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 */
	editorInsertContent: function(content, args, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		if (ed) {
			ed.insertContent(content, args);
		}
	},
	
	/**
	 * Creates HTML string for element. The element will be closed unless an empty inner HTML string is passed in.
	 * @param {String} name Name of new element.
	 * @param {Object} [attrs] Optional object name/value collection with element attributes.
	 * @param {String} [html] Optional HTML string to set as inner HTML of the element.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {String} String of new HTML element. Undefined if editor is not available.
	 */
	editorCreateHTML: function(name, attrs, html, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.dom.createHTML(name, attrs, html) : undefined;
	},
	
	/**
	 * Selects specific elements by a CSS level 3 pattern.
	 * @param {String} selector CSS level 3 pattern to select/find elements by.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {Boolean} [opts.scope] Optional root element/scope element to search in.
	 * @param {Boolean} [opts.first] `true` to return directly the first result, if any.
	 * @param {Boolean} [opts.last] `true` to return directly the last result, if any.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {Element[]|Element} A single matching element or an array. Undefined if editor is not available.
	 */
	editorDomQuery: function(selector, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor(), arr;
		if (ed) {
			arr = ed.dom.select(selector, opts.scope);
			if (opts.first) {
				return arr.length > 0 ? arr[0] : null;
			} else if (opts.last) {
				return arr.length > 0 ? arr[arr.length-1] : null;
			} else {
				return arr;
			}
		} else {
			return undefined;
		}
	},
	
	/**
	 * Returns the currently selected element or the common ancestor element for both start and end of the selection.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {Element} The selected element. Undefined if editor is not available.
	 */
	editorGetSelection: function(opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.selection.getNode() : undefined;
	},
	
	/**
	 * Returns the selected contents using the configured DOM serializer.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {String} The content of selected element. Undefined if editor is not available.
	 */
	editorGetSelectionContent: function(opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed ? ed.selection.getContent({format:'html'}) : undefined;
	},
	
	/**
	 * Serializes the specified node into a string.
	 * @param {tinymce.html.Node} node Node instance to serialize.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {Boolean} [opts.inner] Set to `false` to serialize also node's root markup.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 * @return {String} String with HTML based on DOM tree. Undefined if editor is not available.
	 */
	editorSerialize: function(node, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		return ed && node ? ed.serializer.serialize(node, {format: 'html', getInner: Ext.isBoolean(opts.inner) ? opts.inner : true}) : undefined;
	},
	
	/**
	 * Sets the specified HTML content inside the element or elements.
	 * @param {HTMLElement|String|String[]} el DOM element, element id string or array of elements/ids to set HTML inside of.
	 * @param {String} html HTML content to set as inner HTML of the element.
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 */
	editorSetHtml: function(el, html, opts) {
		opts = opts || {};
		var ed = opts.editor || this.getEditor();
		if (ed) ed.dom.setHTML(el, html);
	},
	
	/**
	 * Shows a progressbar in the editor and control its parameters.
	 * When the arg is string a progress with specified text and default (cogs)
	 * icons is shown, passing `false` will hide/close the progress notification 
	 * and a number updates the progress percentage. Finally passing an object 
	 * you can control also the icon:
	 * 
	 *     {
	 *         text: 'progress text',
	 *         icon: 'upload'
	 *     }
	 * 
	 * You can refer {@link https://www.tiny.cloud/docs/advanced/editor-icon-identifiers/ here} for icons list.
	 * @param {String|Boolean|Number|Object} cfg
	 * @param {Object} [opts] An object containing configuration.
	 * @param {tinymce.Editor} [opts.editor] The editor instance to work with.
	 */
	editorProgress: function(cfg, opts) {
		opts = opts || {};
		var me = this,
				progress = me.edProgress,
				ed = opts.editor || me.getEditor();
		if (ed) {
			if (cfg === false) {
				if (progress) ed.notificationManager.close();
			} else if (Ext.isNumber(cfg) && progress) {
				progress.progressBar.value(cfg);
			} else {
				if (progress) ed.notificationManager.close();
				
				var txt, ico;
				if (Ext.isString(cfg)) {
					txt = cfg;
				} else if (Ext.isObject(cfg)) {
					txt = cfg.text;
					ico = cfg.icon;
				}
				me.edProgress = ed.notificationManager.open({
					text: txt || '',
					icon: ico || 'preferences',
					progressBar: true
				});
			}
		}
	},
	
	privates: {
		getToolTooltip: function(key, qtips) {
			var gval = Sonicle.Object.getValue,
					tt = this.toolTexts,
					title = gval(tt[key], 'tooltipTitle'),
					text = gval(tt[key], 'tooltipText');
			return qtips && !Ext.isEmpty(text) ? {title: title, text: text} : title;
		},
		
		getToolOvflText: function(key) {
			return Sonicle.Object.getValue(this.toolTexts[key], 'tooltipTitle');
		},
		
		getToolTexts: function(key) {
			return Sonicle.Object.pluck(this.toolTexts[key], ['tooltipTitle', 'tooltipText'], true);
		}
	},
	
	statics: {
		generateInitialContent: function(fontFamily, fontSize, color, defaultColor) {
			var div = '<div style="';
			if (fontFamily) div += 'font-family:'+fontFamily+';';
			if (fontSize) div += 'font-size:'+fontSize+';';
			if (color && color !== defaultColor) div += 'color:'+color+';';
			div += '"></div>';
			return div + div;
		},
		
		getContentFontFamily: function(fonts, name) {
			var ret = undefined;
			if (Ext.isString(name)) {
				Ext.iterate(fonts, function(value) {
					if (Ext.String.startsWith(value, name+'=')) {
						ret = Sonicle.String.substrAfterLast(value, '=');
						return;
					}
				});
			}
			return ret;
		},
		
		getContentFontSize: function(sizes, size) {
			var ret = undefined;
			if (Ext.isString(size)) {
				if (sizes.indexOf(size) > -1) ret = size;
			}
			return ret;
		},
		
		getContentColor: function(colors, color) {
			var ret = undefined;
			if (Ext.isString(color)) {
				if (colors.indexOf(color) > -1) ret = Sonicle.String.prepend(color, '#', true);
			}
			return ret;
		}
	}
});
