/*
 * WebTop Services is a Web Application framework developed by Sonicle S.r.l.
 * Copyright (C) 2014 Sonicle S.r.l.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by
 * the Free Software Foundation with the addition of the following permission
 * added to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED
 * WORK IN WHICH THE COPYRIGHT IS OWNED BY SONICLE, SONICLE DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program; if not, see http://www.gnu.org/licenses or write to
 * the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301 USA.
 *
 * You can contact Sonicle S.r.l. at email address sonicle@sonicle.com
 *
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * Sonicle logo and Sonicle copyright notice. If the display of the logo is not
 * reasonably feasible for technical reasons, the Appropriate Legal Notices must
 * display the words "Copyright (C) 2014 Sonicle S.r.l.".
 */

/* global undef */

Ext.define('Sonicle.form.field.HTMLEditor', {
    extend: 'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.field.Field'
    },
	alias: ['widget.sohtmleditor'],
	requires: [
		'Sonicle.form.field.TinyMCETextArea'
	],
	
	defaultBindProperty: 'value',
	
	layout: 'border',
    border: false,
	
	tmce: null,
	toolbar: null,
	tmceNotification: null,
	
	/**
	 * @cfg {String} language
	 * One of TinyMCE language codes.
	 */
	language: null,
	
	/**
	 * @cfg {boolean} spellcheck
	 * True to enable browser's native spell checker.
	 */
	spellcheck: true,
	
    /**
     * @cfg {Ext.button.Button[]} customButtons 
     * an array of custom buttons to append to the toolbar
     */
    customButtons: null,	
	
    /**
     * @cfg {String} initialContent 
     * The initial content for the editor
     */
    initialContent: null,	
	
    /**
     * @cfg {String} createLinkTitle 
     * The default title for the create link prompt
     */
    createLinkTitle: 'Create Hyperlink',	
	
	/**
     * @cfg {String} createLinkText 
     * The default text for the create link prompt
     */
    createLinkText: 'Please enter the URL for the link:',	
	
	/**
     * @cfg {String} [defaultLinkValue='http://']
     * The default value for the create link prompt
     */
    defaultLinkValue: 'http:/'+'/',
	
    /**
     * @cfg {String} insertImageTitle 
     * The default title for the insert image prompt
     */
    insertImageUrlTitle: 'Insert image from URL',	
	
	/**
     * @cfg {String} insertImageText 
     * The default text for the insert image prompt
     */
    insertImageUrlText: 'Please enter the URL for the image:',	
	
	/**
     * @cfg {String} [defaultImageValue='http://']
     * The default value for the insert image prompt
     */
    defaultImageUrlValue: 'http:/'+'/',
	
	/**
     * @cfg {String} defaultButtonUI
     * A default {@link Ext.Component#ui ui} to use for the HtmlEditor's toolbar
     * {@link Ext.button.Button Buttons}
     */
    defaultButtonUI: 'default-toolbar',
	
    /**
     * @cfg {Object} buttonTips
     * Object collection of toolbar tooltips for the buttons in the editor. The key is the command id associated with
     * that button and the value is a valid QuickTips object. For example:
     *
     *     {
     *         bold: {
     *             title: 'Bold (Ctrl+B)',
     *             text: 'Make the selected text bold.'
     *         },
     *         italic: {
     *             title: 'Italic (Ctrl+I)',
     *             text: 'Make the selected text italic.'
     *         }
     *         // ...
     *     }
     */
    buttonTips: {
        bold: {
            title: 'Bold (Ctrl+B)',
            text: 'Make the selected text bold.'
        },
        italic: {
            title: 'Italic (Ctrl+I)',
            text: 'Make the selected text italic.'
        },
        underline: {
            title: 'Underline (Ctrl+U)',
            text: 'Underline the selected text.'
        },
        backcolor: {
            title: 'Text Highlight Color',
            text: 'Change the background color of the selected text.'
        },
        forecolor: {
			title: 'Font Color',
            text: 'Change the color of the selected text.'
        },
		emoticon: {
			title: 'Emoticon',
			text: 'Input a emoticon in the text'
		}
		,
        justifyleft: {
            title: 'Align Text Left',
            text: 'Align text to the left.'
        },
        justifycenter: {
            title: 'Center Text',
            text: 'Center text in the editor.'
        },
        justifyright: {
            title: 'Align Text Right',
            text: 'Align text to the right.'
        },
        insertunorderedlist: {
            title: 'Bullet List',
            text: 'Start a bulleted list.'
        },
        insertorderedlist: {
            title: 'Numbered List',
            text: 'Start a numbered list.'
        },
        createlink: {
            title: 'Hyperlink',
            text: 'Make the selected text a hyperlink.'
        },
        unlink: {
            title: 'Remove hyperlink',
            text: 'Remove hyperlink from selected text.'
        },
        sourceedit: {
            title: 'Source Edit',
            text: 'Switch to source editing mode.'
        },
        clean: {
            title: 'Remove formatting',
			text: 'Clean selected text removing any undesired formatting.'
        },
        insertimageurl: {
            title: 'Image',
            text: 'Insert image from URL.'
        }
    },
	
	defaultFont: 'Arial',
	
    // This will strip any number of single or double quotes (in any order) from a string at the anchors.
    reStripQuotes: /^['"]*|['"]*$/g,	enableFont: false,
    textAlignRE: /text-align:(.*?);/i,
    safariNonsenseRE: /\sclass="(?:Apple-style-span|Apple-tab-span|khtml-block-placeholder)"/gi,
    nonDigitsRE: /\D/g,
	
	enableFontSize: false,
	enableFormat: false,
	enableColors: false,
	enableEmoticons: false,
	enableAlignments: false,
	enableLinks: false,
	enableLists: false,
	enableSourceEdit: false,
	enableClean: false,
	
	fontFamilies: [
		"Arial",
		"Comic Sans MS",
		"Courier New",
		"Helvetica",
		"Tahoma",
		"Times New Roman",
		"Verdana"
	],
	
	initComponent: function() {
		var me=this;
		
		me.items = [ me.createToolbar(), me.createTinyMCE() ];
		
		me.tmce.on("init", me.tmceInit, me);
		me.tmce.on("change", function(c,nv,ov,eopts) {
			me.mixins.field.setValue.call(me,nv);
			me.updateToolbar();
		});
		
		me.callParent(arguments);
		me.initField();
		
	},
	
	createTinyMCE: function(){
		this.tmce=Ext.create({
			xtype: 'tinymce_textarea',
			region: 'center',
			fieldStyle: 'font-family: Courier New; font-size: 12px;',
			style: { border: '0' },
			tinyMCEConfig: {
				plugins: [
					'advlist autolink lists link image charmap print preview hr anchor pagebreak',
					'searchreplace visualblocks visualchars code fullscreen',
					'insertdatetime media nonbreaking save table contextmenu directionality',
					'emoticons template paste textcolor'
				],
				contextmenu: 'inserttable | cell row column deletetable',
				entity_encoding: 'numeric', // we cannot use 'named+numeric' due to this https://github.com/tinymce/tinymce/issues/3213
				padd_empty_editor: false,
				paste_block_drop: true,
				paste_data_images: true,
				language: this.language,
				skin: Ext.themeName || 'lightgray',
				toolbar: false,
				statusbar: false,
				relative_urls: false,
				convert_urls: false,
				//toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
				//toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | inserttime preview | forecolor backcolor",
				//toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
				menubar: false,
				browser_spellcheck: (this.spellcheck === true),
				toolbar_items_size: 'small',
				//forced_root_block: false,
				forced_root_block: 'P',
				forced_root_block_attrs: {
					'style' : 'padding: 0; margin: 0;'
				},
				extended_valid_elements: 'span[style]',
				images_dataimg_filter: function(img) {
					return img.hasAttribute('internal-blob');
				}
			}/*,
			value: 'This is the WebTop-TinyMCE HTML Editor'*/
			
		});
		return this.tmce;
		
    },
	
	focusEditor: function() {
		this.tmce.focus();
	},
	
	getToolbar: function() {
		return this.toolbar;
	},
	
	/*
     * Called when the editor creates its toolbar. Override this method if you need to
     * add custom toolbar buttons.
     * @param {Ext.form.field.HtmlEditor} editor
     * @protected
     */
    createToolbar: function(){
        this.toolbar = Ext.widget(this.getToolbarCfg());
        return this.toolbar;
    },
	
	hideToolbar: function() {
		this.toolbar.setHidden(true);
	},
    
	showToolbar: function() {
		this.toolbar.setHidden(false);
	},
    
	_getTooltip: function(id) {
		var me=this,
		tipsEnabled = Ext.quickTipsActive && Ext.tip.QuickTipManager.isEnabled();
		return tipsEnabled ? ( me.buttonTips[id]? {
			title: me.buttonTips[id].title,
			text: me.buttonTips[id].text,
			cls: Ext.baseCSSPrefix + 'html-editor-tip'
		} : undefined ) : undefined;
	},
	
	_getOverflowText: function(id) {
		var me=this;
		return me.buttonTips[id]? me.buttonTips[id].title : undef;
	},
	
    getToolbarCfg: function(){
        var me = this,
		items = [], i,
		baseCSSPrefix = Ext.baseCSSPrefix,
		undef;
		
        function btn(id, toggle, handler){
            return {
                itemId: id,
                cls: baseCSSPrefix + 'btn-icon',
                iconCls: 'wt-icon-format-'+id+"-xs",
                enableToggle:toggle !== false,
                scope: me,
                handler:handler||me.relayBtnCmd,
                clickEvent: 'mousedown',
                tooltip: me._getTooltip(id),
                overflowText: me._getOverflowText(id),
                tabIndex: -1
            };
        }
		
		
        if (me.enableFont) {
			var fontData=[];
			for(i=0;i<me.fontFamilies.length;++i) {
				var fn=me.fontFamilies[i];
				fontData[i]={ id: fn };
			}
			
            items.push(
					me.fontCombo=Ext.widget({
						xtype: 'combo', 
				width: 140,
				store: Ext.create('Ext.data.Store', {
					fields: ['id'],
					data : fontData
				}),
				autoSelect: true,
				displayField: 'id',
				valueField: 'id',
				queryMode: 'local',
				listeners: {
					'select': function(c,r,o) {
						me.execCommand('fontname',false,r.get('id'));
						me.focusEditor();
					},
					'specialkey': function(f,e) {
						if (e.getKey() == e.ENTER) {
							me.execCommand('fontname',false,f.getValue());
							me.focusEditor();
						}
					}						
				}
			}),
			'-'
					);
        }
		
        if (me.enableFontSize) {
			items.push(
					me.fontSizeCombo=Ext.widget({
						xtype: 'combo', 
				width: 70,
				store: Ext.create('Ext.data.Store', {
					fields: ['id'],
					data : [
						{ id: "8px" },
						{ id: "10px" },
						{ id: "12px" },
						{ id: "14px" },
						{ id: "16px" },
						{ id: "18px" },
						{ id: "24px" },
						{ id: "36px" }
					]
				}),
				autoSelect: true,
				displayField: 'id',
				valueField: 'id',
				queryMode: 'local',
				listeners: {
					'select': function(c,r,o) {
						me.execCommand('fontsize',false,r.get('id'));
						me.focusEditor();
					},
					'specialkey': function(f,e) {
						if (e.getKey() == e.ENTER) {
							me.execCommand('fontsize',false,f.getValue());
							me.focusEditor();
						}
					}
				}
			}),
			'-'
					);
			
		}		
		
        if (me.enableFormat) {
            items.push(
					btn('bold'),
			btn('italic'),
			btn('underline')
					);
        }
		
        if (me.enableColors) {
            items.push(
					'-', {
						itemId: 'forecolor',
				cls: baseCSSPrefix + 'btn-icon',
				iconCls: 'wt-icon-format-forecolor-xs',
				tooltip: me._getTooltip('forecolor'),
				overflowText: me._getOverflowText('forecolor'),
				tabIndex:-1,
				arrowVisible:false,
				menu: Ext.widget('menu', {
					plain: true,
					
					items: [{
                            xtype: 'colorpicker',
                            allowReselect: true,
                            focus: Ext.emptyFn,
                            value: '000000',
                            plain: true,
                            clickEvent: 'mousedown',
                            handler: function(cp, color) {
                                me.execCommand('forecolor', false, Ext.isWebKit || Ext.isIE || Ext.isGecko ? '#'+color : color);
                                this.up('menu').hide();
                            }
                        }]
				})
			}, {
				itemId: 'backcolor',
				cls: baseCSSPrefix + 'btn-icon',
				iconCls: 'wt-icon-format-backcolor-xs',
				tooltip: me._getTooltip('backcolor'),
				overflowText: me._getOverflowText('backcolor'),
				tabIndex:-1,
				arrowVisible:false,
				menu: Ext.widget('menu', {
					plain: true,
					
					items: [{
                            xtype: 'colorpicker',
                            focus: Ext.emptyFn,
                            value: 'FFFFFF',
                            plain: true,
                            allowReselect: true,
                            clickEvent: 'mousedown',
                            handler: function(cp, color) {
                                if (Ext.isGecko) {
                                    me.execCommand('useCSS', false, false);
                                    me.execCommand('hilitecolor', false, '#'+color);
                                    me.execCommand('useCSS', false, true);
                                    me.deferFocus();
                                } else {
                                    me.execCommand(Ext.isOpera ? 'hilitecolor' : 'backcolor', false, Ext.isWebKit || Ext.isIE || Ext.isOpera ? '#'+color : color);
                                }
                                this.up('menu').hide();
                            }
                        }]
				}) 
			}
					);
        }
		if (me.enableEmoticons) {
            items.push(
					'-', {
						itemId: 'emoticon',
						cls: baseCSSPrefix + 'btn-icon',
						iconCls: 'wt-icon-format-emoticon-xs',
						tooltip: me._getTooltip('emoticon'),
						overflowText: me._getOverflowText('emoticon'),
						tabIndex:-1,
						arrowVisible:false,
						menu: Ext.widget('menu', {
							plain: true,

							items: [{
									xtype: 'soemojipicker',
									reference: 'pnlemojis',
									header: false,
									recentsText: WT.res('soemojipicker.recents.tip'),
									peopleText: WT.res('soemojipicker.people.tip'),
									natureText: WT.res('soemojipicker.nature.tip'),
									foodsText: WT.res('soemojipicker.foods.tip'),
									activityText: WT.res('soemojipicker.activity.tip'),
									placesText: WT.res('soemojipicker.places.tip'),
									objectsText: WT.res('soemojipicker.objects.tip'),
									symbolsText: WT.res('soemojipicker.symbols.tip'),
									flagsText: WT.res('soemojipicker.flags.tip'),
									listeners: {
										select: function(s, emoji) {
											me.execCommand('inserthtml', false, emoji);
										}
									}
								}] 
						})
					}
				);
        }
		
		
        if (me.enableAlignments) {
            items.push(
					'-',
			btn('justifyleft'),
			btn('justifycenter'),
			btn('justifyright')
					);
        }
		
        if (!Ext.isSafari2) {
            if (me.enableLists) {
                items.push(
						'-',
				btn('insertorderedlist'),
				btn('insertunorderedlist')
						);
            }
        }
        
		if (me.enableClean) {
			items.push(
					'-',
			btn('clean', false, function(){
				me.execCommand('RemoveFormat',true,true);
			})
					);
		}
		
        if (!Ext.isSafari2) {
            if (me.enableSourceEdit) {
                items.push(
						'-',
				btn('sourceedit', false, function(){
					//me.toggleSourceEdit(!me.sourceEditMode);
					me.execCommand('mceCodeEditor',true,true);
				})
						);
            }
			
			if (me.enableLinks) {
				items.push(
						'-',
				btn('createlink', false, function() {
					Ext.Msg.prompt(
							me.createLinkTitle,
					me.createLinkText,
					function(bid,url) {
						if (bid==='ok' && url && url !== 'http:/'+'/') {
							me.execCommand('createlink',false,url);
						}
					},
					me,
					false,
					me.defaultLinkValue
							);
				}),
				btn('unlink')
						);
			}
			
			if (me.enableImageUrls) {
				items.push(
						'-',
				btn('insertimageurl', false, function() {
					Ext.Msg.prompt(
							me.insertImageUrlTitle,
					me.insertImageUrlText,
					function(bid,url) {
						if (bid==='ok' && url && url !== 'http:/'+'/') {
							me.execCommand('insertimage',false,url);
						}
					},
					me,
					false,
					me.defaultImageUrlValue
							);
				})
						);
			}
			
			if (me.customButtons) {
				Ext.each(me.customButtons, function(b) {
					items.push(b);
				});
			}
			
		}
		
		/*        // Everything starts disabled.
        for (i = 0; i < items.length; i++) {
            if (items[i].itemId !== 'sourceedit') {
                items[i].disabled = true;
            }
        }*/
		
        // build the toolbar
        // Automatically rendered in Component.afterRender's renderChildren call
        return {
            xtype: 'toolbar',
			region: 'north',
            defaultButtonUI: me.defaultButtonUI,
			cls: Ext.baseCSSPrefix + 'html-editor-tb',
			//            bodyCls: 'wt-theme-bg-2',
            enableOverflow: true,
            items: items
			
            // stop form submits
            //listeners: {
            //    click: function(e){
            //        e.preventDefault();
            //    },
            //    element: 'el'
            //}
        }; 
    },	
	
	showProgress: function(text) {
		var me=this;
		
		if (!me.tmceNotification) {
			me.tmceNotification=me.tmce.openNotification({
				text: text,
				progressBar: true
			});
		}
	},
	
	setProgress: function(value) {
		var me=this;
		
		if (me.tmceNotification) {
			me.tmceNotification.progressBar.value(value);
		}
	},
	
	hideProgress: function() {
		var me=this;
		
		if (me.tmceNotification) {
			me.tmceNotification.close();
			me.tmceNotification=null;
		}
	},
	
    disableItems: function(disabled) {
        var items = this.getToolbar().items.items,
		i,
		iLen  = items.length,
		item;
		
        for (i = 0; i < iLen; i++) {
            item = items[i];
			
            if (item.getItemId() !== 'sourceedit') {
                item.setDisabled(disabled);
            }
        }
    },
	
	onEditorEvent: function() {
		this.updateToolbar();
	},
	
	tmceInit: function() {
        var me = this, fn,
		ed = tinymce.get(me.tmce.getInputId()),
		doc = ed.getDoc(),
		docEl = Ext.get(doc);
		
		fn = me.onEditorEvent.bind(me);
		docEl.on({
			mousedown: fn,
			dblclick: fn,
			click: fn,
			keyup: fn,
			delegated: false,
			buffer:100
		});
		if (me.initialContent) me.setValue(me.initialContent);
		me.updateToolbar();
		me.fireEvent('init',me);
	},
	
	getComputedProperty: function(propname) {
		var ed=this.getTinyMCEEditor();
		var sel=ed.getDoc().getSelection();
		if (sel.rangeCount>0) {
			var el=sel.getRangeAt(0).commonAncestorContainer;
			if (el.nodeType == 3) {
				el=el.parentElement;
			}
			return window.getComputedStyle(el,null)[propname];
		}
		return "";
	},
	
	setSelectionStyle: function(style) {
		this.tmce.setSelectionStyle(style);
	},
	
    /**
     * Triggers a toolbar update by reading the markup state of the current selection in the editor.
     * @protected
     */
    updateToolbar: function() {
        var me = this,
		i, l, btns, ed, doc, name, queriedName, fontSelect,
		toolbarSubmenus;
		
		//			console.log("updateToolbar");
		
		//        if (me.readOnly) {
		//            return;
		//        }
		
		//        if (!me.activated) {
		//            me.onFirstFocus();
		//            return;
		//        }
		
		
        btns = me.getToolbar().items.map;
		ed = tinymce.get(this.tmce.getInputId());
		if (!ed) return;
		
		doc = ed.getDoc();
		if (!doc) return;
		
        if (me.enableFont && !Ext.isSafari2) {
			/*            // When querying the fontName, Chrome may return an Array of font names
            // with those containing spaces being placed between single-quotes.
            queriedName = doc.queryCommandValue('fontName');
            name = (queriedName ? queriedName.split(",")[0].replace(me.reStripQuotes, '') : me.defaultFont).toLowerCase();
            fontCombo = me.fontCombo;
            if (name !== fontCombo.getValue() || name !== queriedName) {
                fontCombo.setValue(name);
            }*/
			me.fontCombo.setValue(me.getComputedProperty("fontFamily").replace(/['"]+/g, ''));
        }
        if (me.enableFontSize && !Ext.isSafari2) {
            //var six = doc.queryCommandValue('fontSize'),
			//	fontSizeCombo = me.fontSizeCombo;
			//var ix=parseInt(six)+1;
            //if (ix !== fontSizeCombo.getValue()) {
            //    fontSizeCombo.setValue(ix);
            //}
			me.fontSizeCombo.setValue(me.getComputedProperty("fontSize"));
        }
		
        function updateButtons() {
            var state;
            
            for (i = 0, l = arguments.length, name; i < l; i++) {
                name  = arguments[i];
                
                // Firefox 18+ sometimes throws NS_ERROR_INVALID_POINTER exception
                // See https://sencha.jira.com/browse/EXTJSIV-9766
                try {
                    state = ed.queryCommandState(name);
                }
                catch (e) {
                    state = false;
                }
                
                btns[name].toggle(state);
            }
        }
        if(me.enableFormat){
            updateButtons('bold', 'italic', 'underline');
        }
        if(me.enableAlignments){
            updateButtons('justifyleft', 'justifycenter', 'justifyright');
        }
        if(!Ext.isSafari2 && me.enableLists){
            updateButtons('insertorderedlist', 'insertunorderedlist');
        }
		
        // Ensure any of our toolbar's owned menus are hidden.
        // The overflow menu must control itself.
        toolbarSubmenus = me.toolbar.query('menu');
        for (i = 0; i < toolbarSubmenus.length; i++) {
            toolbarSubmenus[i].hide();
        }
        me.syncValue();
    },
	
	setValue: function(val) {
		var me=this;
		
		if (val!==me.value) {
			me.mixins.field.setValue.call(me,val);
			//console.log("updating tmce too!");
			me.tmce.setValue(val);
		}
	},
	
	//this call seems to break binding
	//html mode is the default, no need to call it.
	/*enableHtmlMode: function() {
		var me=this;
		me.tmce.noWysiwyg=false;
		me.tmce.showEditor();
		me.showToolbar();
	},*/
	
	enableTextMode: function() {
		var me=this;
		me.tmce.noWysiwyg=true;
		me.tmce.hideEditor();
		me.hideToolbar();
	},
	
	getEditingValue: function() {
		var me=this,ed=me.tmce.getEditor();
		if (ed) return ed.getContent();
		return null;
	},
	
    isAutosaveDirty: function() {
		var me=this,ed=me.tmce.getEditor();
        if (ed) return ed.getContent()!=me.autosaveValue;
		return false;
    },
    
    clearAutosaveDirty: function() {
		var me=this,ed=me.tmce.getEditor();
        if (ed) me.autosaveValue=ed.getContent();
    },
	
	/*	setHtml: function(html) {
		//Ext.raise('Stop here!');
		this.tmce.setValue(html);
	},
	
	getHtml: function() {
		return this.tmce.getValue();
	},*/
	
    /*initHtmlValue: function(html) {
		var me=this;
        me.setValue(html);
        //me.initValue=me.getValue();
    },
	
    isDirty: function() {
        return this.getValue()!=this.initValue;
    },*/
	
	isReady: function() {
		return this.getTinyMCEEditor();
	},
	
	getTinyMCEEditor: function() {
		return tinymce.get(this.tmce.getInputId());
	},
	
	getDoc: function() {
		return this.getTinyMCEEditor().getDoc();
	},
	
	cleanUpHtml: function(html) {
		return this.getTinyMCEEditor().serializer.serialize(Ext.DomHelper.createDom({html: html}), { format: 'html', get: true, getInner: true });
	},
	
	cleanUpHtmlFromDom: function(dom) {
		return this.getTinyMCEEditor().serializer.serialize(dom, { format: 'html', get: true, getInner: true });
	},
	
	syncValue: function() {
		//do nothing here for now
	},
	
    // @private
    relayBtnCmd: function(btn) {
        this.execCommand(btn.getItemId());
    },	
	
	execCommand: function(cmd, ui, value, obj) {
		var ed = tinymce.get(this.tmce.getInputId());
		ed.execCommand(cmd,ui,value,obj);
	},
	
	/**
	 * Retrieves text related info based on current selection.
	 * @param {boolean} clip
	 * @returns {Object} An object containing textContent, hasHTML flag and the html text.
	 */
	getSelection: function(clip) {
		var me=this,
		ed=me.getTinyMCEEditor(),
		sel=ed.getDoc().getSelection(),
		txt = '', hasHTML = false, html = '',selDocFrag=null;
		
		if (sel) {
			if (clip) {
				selDocFrag = sel.getRangeAt(0).extractContents();
			} else {
				selDocFrag = sel.getRangeAt(0).cloneContents();
			}
			Ext.each(selDocFrag.childNodes, function(n){
				if (n.nodeType !== 3) {
					hasHTML = true;
				}
			});
			if (hasHTML) {
				var div = document.createElement('div');
				div.appendChild(selDocFrag);
				html = div.innerHTML;
				txt = sel + '';
			} else {
				html = txt = selDocFrag.textContent;
			}
			return {
				textContent: txt,
				hasHTML: hasHTML,
				html: html
			};
		} else {
			return {
				textContent: '',
				hasHTML: false,
				html: ''
			};
		}
	}//,
	
    /**
     * @property {Object} buttonTips
     * Object collection of toolbar tooltips for the buttons in the editor. The key is the command id associated with
     * that button and the value is a valid QuickTips object. For example:
     *
     *     {
     *         bold: {
     *             title: 'Bold (Ctrl+B)',
     *             text: 'Make the selected text bold.'
     *         },
     *         italic: {
     *             title: 'Italic (Ctrl+I)',
     *             text: 'Make the selected text italic.'
     *         }
     *         // ...
     *     }
     */
	/*
    buttonTips: {
        bold: {
            title: 'Bold (Ctrl+B)',
            text: 'Make the selected text bold.'
        },
        italic: {
            title: 'Italic (Ctrl+I)',
            text: 'Make the selected text italic.'
        },
        underline: {
            title: 'Underline (Ctrl+U)',
            text: 'Underline the selected text.'
        },
        backcolor: {
            title: 'Text Highlight Color',
            text: 'Change the background color of the selected text.'
        },
        forecolor: {
			title: 'Font Color',
            text: 'Change the color of the selected text.'
        },
        justifyleft: {
            title: 'Align Text Left',
            text: 'Align text to the left.'
        },
        justifycenter: {
            title: 'Center Text',
            text: 'Center text in the editor.'
        },
        justifyright: {
            title: 'Align Text Right',
            text: 'Align text to the right.'
        },
        insertunorderedlist: {
            title: 'Bullet List',
            text: 'Start a bulleted list.'
        },
        insertorderedlist: {
            title: 'Numbered List',
            text: 'Start a numbered list.'
        },
        createlink: {
            title: 'Hyperlink',
            text: 'Make the selected text a hyperlink.'
        },
        unlink: {
            title: 'Remove hyperlink',
            text: 'Remove hyperlink from selected text.'
        },
        sourceedit: {
            title: 'Source Edit',
            text: 'Switch to source editing mode.'
        },
        clean: {
            title: 'Remove formatting',
			text: 'Clean selected text removing any undesired formatting.'
        },
        insertimageurl: {
            title: 'Image',
            text: 'Insert image from URL.'
        }
    }
	 */
});
