/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.upload.Item', {
	extend: 'Ext.menu.Item',
	alias: 'widget.souploadmenuitem',
	requires: [
		'Sonicle.upload.Uploader'
	],
	
	/**
	 * @cfg {Boolean} [uploaderAutoInit = true]
	 * `False` to disable internal uploader component auto-initialization.
	 * A manual call to {@link #initUploader} is then required.
	 */
	uploaderAutoInit: true,
	
	uploader: null,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		me.uploader = Ext.create('Sonicle.upload.Uploader', me, me.initialConfig.uploaderConfig);
		me.relayEvents(me.uploader, [
			'uploaderready',
			'beforeuploaderstart',
			'overallprogress',
			'filesadded',
			'fileuploaded',
			'beforeupload',
			'uploadstarted',
			'uploadcomplete',
			'uploadprogress',
			'uploaderror',
			'storeempty',
			'invalidfilesize',
			'invalidfileext'
		]);
	},
	
	destroy: function() {
		var me = this;
		if (me.uploader) {
			me.uploader.destroy();
			me.uploader = null;
		}
		me.callParent();
	},
	
	onRender: function() {
		var me = this;
		me.callParent(arguments);
		if (me.uploaderAutoInit) {
			me.initUploader();
		}
	},
	
	initUploader: function() {
		var me = this;
		me.uploader.setBrowseButton(me.getId());
		me.uploader.init();
	}
});
