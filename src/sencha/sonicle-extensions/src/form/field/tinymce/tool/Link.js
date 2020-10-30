/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/link/main/ts/core/Utils.ts
 * https://github.com/tinymce/tinymce/blob/develop/modules/tinymce/src/plugins/autolink/main/ts/core/Keys.ts
 */
Ext.define('Sonicle.form.field.tinymce.tool.Link', {
	extend: 'Sonicle.form.field.tinymce.tool.base.Button',
	alias: ['widget.so-tmcetoollink'],
	mixins: {
		tmcetool: 'Sonicle.form.field.tinymce.tool.Mixin'
	},
	uses: [
		'Sonicle.String'
	],
	
	tooltip: 'Insert link',
	
	toolIconCls: 'fa fa-link',
	promptTitleText: undefined,
	promptMsgText: 'URL',
	suggestMailToText: 'The URL you entered seems to be an email address. Do you want to add the "mailto:" prefix?',
	suggestTelText: 'The URL you entered seems to be a telephone number. Do you want to add the "tel:" prefix?',
	suggestProtoText: 'The URL you entered seems to be an external link. Do you want to add the "{0}" prefix?',
	
	suggestMailTo: true,
	suggestTel: true,
	suggestProto: true,
	defaultLinkProto: 'http',
	arrowVisible: false,
	
	initComponent: function() {
		var me = this,
				SoS = Sonicle.String;
		Ext.apply(me, {
			iconCls: me.toolIconCls,
			handler: function() {
				var selectedText = me.getHtmlEditor().editorGetSelectionContent();
				Ext.Msg.prompt(me.promptTitleText || me.overflowText, me.promptMsgText, function(bid, url) {
					if (bid === 'ok' && !Ext.isEmpty(url)) {
						var suggestMailTo = me.suggestMailTo && url.indexOf('@') > 0 && url.indexOf('/'+'/') === -1 && url.indexOf('mailto:') === -1,
								suggestTel = me.suggestTel && Sonicle.String.rePhone.test(url),
								suggestProto =  me.suggestProto && !SoS.startsWith(url, 'http'), // !/^\w+:/i.test(url),
								applyLink = function(url, text) {
									var hed = me.getHtmlEditor();
									hed.editorInsertContent(hed.editorCreateHTML('a', {href: url, target: '_blank'}, SoS.htmlEncode(text || SoS.substrAfter(url, '/'+'/', false))));
									//hed.editorExecuteCommand('mceInsertLink', {href: url, text: text});
									//hed.editorExecuteCommand('createlink', url);
								};
						if (suggestMailTo) {
							Ext.Msg.show({
								message: me.suggestMailToText,
								buttons: Ext.Msg.YESNO,
								icon: Ext.Msg.QUESTION,
								fn: function(btn) {
									if (btn === 'yes') {
										applyLink('mailto:' + url, SoS.deflt(selectedText, url));
									} else {
										applyLink(url, SoS.deflt(selectedText, url));
									}
								}
							});
							
						} else if (suggestTel) {
							Ext.Msg.show({
								message: me.suggestTelText,
								buttons: Ext.Msg.YESNO,
								icon: Ext.Msg.QUESTION,
								fn: function(btn) {
									if (btn === 'yes') {
										applyLink('tel:' + url, SoS.deflt(selectedText, url));
									} else {
										applyLink(url, SoS.deflt(selectedText, url));
									}
								}
							});
							
						} else if (suggestProto) {
							Ext.Msg.show({
								message: Ext.String.format(me.suggestProtoText, me.defaultLinkProto),
								buttons: Ext.Msg.YESNO,
								icon: Ext.Msg.QUESTION,
								fn: function(btn) {
									if (btn === 'yes') {
										applyLink(me.defaultLinkProto + ':/'+'/' + url, SoS.deflt(selectedText, url));
									} else {
										applyLink(url, SoS.deflt(selectedText, url));
									}
								}
							});
							
						} else {
							applyLink(url, SoS.deflt(selectedText, url));
						}
					}
				}, me, false);
			}
		});
		me.callParent(arguments);
	}
});
