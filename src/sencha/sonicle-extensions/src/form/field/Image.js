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
Ext.define('Sonicle.form.field.Image', {
	extend: 'Sonicle.form.field.DisplayImage',
	alias: ['widget.soimagefield'],
	requires: [
		'Sonicle.Utils',
		'Sonicle.form.trigger.Clear',
		'Sonicle.upload.Uploader'
	],
	
	fieldCls: 'so-' + 'form-image-field',
	fieldBodyCls: 'so-' + 'form-image-field-body',
	
	postSubTpl: [
			'</div>', // end inputWrap
			'<tpl for="triggers">{[values.renderTrigger(parent)]}</tpl>',
			'<div id={cmpId}-pluWrap data-ref="pluWrap" style="display:none;"></div>',
		'</div>' // end triggerWrap
	],
	childEls: ['triggerWrap','inputWrap','pluWrap'],
	
	/**
	 * @cfg {Boolean} [uploadDisabled=false]
	 * Set to `true` to completely disable Uploader component.
	 */
	uploadDisabled: false,
	
	/**
	 * @cfg {String} clearTriggerTooltip
	 * The tooltip text to apply to Clear trigger.
	 */
	clearTriggerTooltip: undefined,
	
	/**
	 * @cfg {String} clearTriggerCls
	 * The CSS icon class to apply to Clear trigger.
	 */
	clearTriggerCls: undefined,
	
	/**
	 * @cfg {String} uploadTriggerTooltip
	 * The tooltip text to apply to Upload trigger.
	 */
	uploadTriggerTooltip: undefined,
	
	/**
	 * @cfg {String} [uploadTriggerCls]
	 * The CSS icon class to apply to Upload trigger.
	 */
	uploadTriggerCls: undefined,
	
	/**
	 * @cfg {String} clearTriggerTooltip
	 * The CSS icon class to apply to trigger in addition to the default `x-form-trigger-over`.
	 */
	triggersOverCls: undefined,
	
	/**
	 * @readonly
	 * @property {Sonicle.upload.Uploader} uploader
	 * The uploader object.
	 */
	uploader: null,
	
	/**
	 * @event clear
	 */
	
	/**
	 * @event uploaderready
	 * @event beforeuploaderstart
	 * @event uploadstarted
	 * @event uploadcomplete
	 * @event uploaderror
	 * @event filesadded
	 * @event beforeupload
	 * @event fileuploaded
	 * @event overallprogress
	 * @event uploadprogress
	 * @event storeempty
	 */
	
	constructor: function(cfg) {
		var me = this,
				SoS = Sonicle.String,
				SoU = Sonicle.Utils,
				icfg = SoU.getConstructorConfigs(me, cfg, [
					{triggers: true}, {uploadDisabled: true}, {triggersOverCls: true}, {clearTriggerCls: true}, {uploadTriggerCls: true}, {clearTriggerTooltip: true}, {uploadTriggerTooltip: true}, {uploaderConfig: true}
				]),
				overCls = SoS.join(' ', Ext.baseCSSPrefix + 'form-trigger-over', icfg.triggersOverCls),
				triggers = {
					clear: {
						type: 'soclear',
						weight: -1,
						tooltip: icfg.clearTriggerTooltip,
						cls: icfg.clearTriggerCls,
						overCls: overCls,
						handler: me.onClearClick
					}
				};
		
		if (!icfg.uploadDisabled) {
			var tip = icfg.uploadTriggerTooltip;
			if (Ext.isString(tip) && Ext.isString(icfg.maxSizeTooltip) && icfg.uploaderConfig && Ext.isNumber(icfg.uploaderConfig.maxFileSize)) {
				tip = Ext.String.format(icfg.maxSizeTooltip, Sonicle.Bytes.format(icfg.uploaderConfig.maxFileSize));
			}
			triggers['upload'] = {
				type: 'sohideable',
				weight: -1,
				hideOn: 'value',
				tooltip: tip,
				cls: icfg.uploadTriggerCls,
				overCls: overCls,
				handler: me.onUploadClick
			};
		}
				
		cfg.triggers = SoU.mergeTriggers(icfg.triggers, triggers);
		me.callParent([cfg]);
	},
	
	destroy: function() {
		var me = this;
		if (me.uploader) {
			me.uploader.destroy();
			me.uploader = null;
		}
		me.callParent();
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		if (!me.uploadDisabled) {
			me.uploader = Ext.create('Sonicle.upload.Uploader', me, me.initialConfig.uploaderConfig);
			me.on('afterrender', function() {
				me.uploader.setBrowseButton(me.triggers['upload'].domId);
				me.uploader.setContainer(me.pluWrap.getId());
				me.uploader.setDropElement(me.inputWrap.getId());
				me.uploader.init();
			}, {single: true});

			me.relayEvents(me.uploader, [
				'uploaderready',
				'beforeuploaderstart',
				'uploadstarted',
				'uploadcomplete',
				'uploaderror',
				'filesadded',
				'beforeupload',
				'fileuploaded',
				'overallprogress',
				'uploadprogress',
				'storeempty'
			]);
		}
	},
	
	/**
	 * Sets the read-only state of this field.
	 * @param {Boolean} readOnly True to prevent the user changing the field, explicitly
	 * hide the trigger(s) and disable upload. See {@link Ext.form.field.Text#readOnly readOnly} for more info.
	 */
	setReadOnly: function(readOnly) {
		var me = this;
		me.callParent([readOnly]);
		
		if (me.rendered && me.uploader) {
			if (readOnly) me.uploader.disable();
			else me.uploader.enable();
		}
	},
	
	privates: {
		onClearClick: function(me) {
			me.setValue(null);
			me.fireEvent('clear', me);
		},

		onUploadClick: function(me) {
			//TODO: add upload event
		}
	}	
});
