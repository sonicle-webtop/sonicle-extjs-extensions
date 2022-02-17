/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/image/main/ts/core/Utils.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.Image', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetoolimage'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	requires: [
		'Sonicle.form.field.tinymce.tool.base.MenuItem'
	],
	uses: [
		'Sonicle.String',
		'Sonicle.upload.Item'
	],
	
	tooltip: 'Insert image',
	
	toolIconCls: 'far fa-image',
	insertImageUrl: true,
	insertImageUrlIconCls: 'fas fa-link',
	insertImageUrlText: 'Link image from URL',
	insertImageUrlPromptTitleText: undefined,
	insertImageUrlPromptMsgText: 'Image URL',
	insertImageFile: true,
	insertImageFileIconCls: 'fas fa-upload',
	insertImageFileText: 'Upload from file',
	
	/*
	 * @cfg {Object} uploaderConfig
	 * Uploader configuration object.
	 */
	
	/**
	 * @cfg {Function} [prepareImageData]
	 * A function called in order to prepare IMG data from upload results: it 
	 * must return an object with `url` and `name` properties. If not provided, 
	 * `url` property is looked into upload's response data.
	 * 
	 * @param {Object} file File data.
	 * @param {Object} json Server response.
	 */
	
	/**
	 * @cfg {Boolean} [useEditorProgress=true]
	 * Set to `false` to not use internal editor's progressbar for tracking upload process.
	 */
	useEditorProgress: true,
	
	/**
	 * @event imagebeforeupload
	 * Before image upload process has been started
	 * @param {Sonicle.form.field.tinymce.tool.Image} this This component.
	 * @param {Sonicle.upload.Uploader} up The Uploader component.
	 * @param {Object} file File data.
	 */
	
	/**
	 * @event imageuploadcomplete
	 * When an image upload has been completed (status changed to completed)
	 * @param {Sonicle.form.field.tinymce.tool.Image} this This component.
	 * @param {Sonicle.upload.Uploader} up The Uploader component.
	 * @param {Object[]} succeededfiles Succeeded files data
	 * @param {Object[]} failedfiles Failed files data
	 */
	
	/**
	 * @event imageuploaded
	 * When image is successfully uploaded
	 * @param {Sonicle.form.field.tinymce.tool.Image} this This component.
	 * @param {Sonicle.upload.Uploader} up The Uploader component.
	 * @param {Object} file File data.
	 * @param {Object} json Server response.
	 * @param {Object} json.data Custom response data.
	 * @param {Object} response The server raw HTTP response object.
	 */
	
	/**
	 * @event imageuploaderror
	 * When image upload encounters an error
	 * @param {Sonicle.form.field.tinymce.tool.Image} this This component.
	 * @param {Sonicle.upload.Uploader} up The Uploader component.
	 * @param {Object} file File data.
	 * @param {String} cause The error cause (size, ext, server or null).
	 * @param {Object} json Response JSON if present.
	 */
	
	initComponent: function() {
		var me = this,
				SoS = Sonicle.String,
				items = [];
		
		if (me.insertImageUrl) {
			items.push({
				xtype: 'so-tmcetoolmenuitem',
				itemId: 'inserturl',
				iconCls: me.insertImageUrlIconCls,
				text: me.insertImageUrlText,
				handler: function() {
					Ext.Msg.prompt(me.insertImageUrlPromptTitleText || me.insertImageUrlText, me.insertImageUrlPromptMsgText, function(bid, url) {
						if (bid === 'ok' && !Ext.isEmpty(url)) {
							var hed = me.getHtmlEditor();
							hed.editorInsertContent(hed.editorCreateHTML('img', {src: url, alt: SoS.htmlEncode(SoS.deflt(SoS.substrAfterLast(url, '/', false), 'image'))}));
						}
					}, me, false);
				}
			});
		}
		if (me.insertImageFile) {
			items.push({
				xtype: 'souploadmenuitem',
				itemId: 'insertfile',
				iconCls: me.insertImageFileIconCls,
				text: me.insertImageFileText,
				uploaderConfig: me.uploaderConfig || {},
				listeners: {
					beforeupload: function(s, file) {
						if (me.useEditorProgress) me.getHtmlEditor().editorProgress({text: file.name, icon: 'upload'});
						me.fireEvent('imagebeforeupload', me, s, file);
					},
					uploadcomplete: function(s, fok, ffailed) {
						me.fireEvent('imageuploadcomplete', me, s, fok, ffailed);
					},
					uploaderror: function(s, file, cause) {
						if (me.useEditorProgress) me.getHtmlEditor().editorProgress(false);
						me.fireEvent('imageuploaderror', me, s, file, cause);
					},
					uploadprogress: function(s, file) {
						if (me.useEditorProgress) me.getHtmlEditor().editorProgress(file.percent);
						me.fireEvent('imageuploadprogress', me, s, file);
					},
					fileuploaded: function(s, file, resp) {
						if (me.useEditorProgress) me.getHtmlEditor().editorProgress(false);
						var data = Ext.callback(me.prepareImageData, me, [file, resp]),
								url = Ext.isObject(data) ? data.url : resp.data.url,
								name = Ext.isObject(data) ? data.name : file.name;
						if (!Ext.isEmpty(url)) {
							var hed = me.getHtmlEditor();
							hed.editorInsertContent(hed.editorCreateHTML('img', {src: url, alt: SoS.htmlEncode(name || SoS.substrAfterLast(src, '/', false) || 'image')}));
						}
						me.fireEvent('imageuploaded', me, s, file, resp);
					}
				}
			});
		}
		
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			menu: {
				items: items
			}
		});
		me.callParent(arguments);
	}
});
