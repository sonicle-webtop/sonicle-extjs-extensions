/*
 * Sonicle ExtJs UX
 * Copyright (C) 2015 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.upload.Button', {
	extend: 'Ext.button.Button',
	alias: 'widget.souploadbutton',
	requires: [
		'Sonicle.upload.Uploader'
	],
	
	preventDefault: false,

	// Button element *looks* focused but it should never really receive focus itself,
	// and with it being a <div></div> we don't need to render tabindex attribute at all
	tabIndex: null,
	
	autoEl: {
		tag: 'div',
		unselectable: 'on'
	},
	
	/**
	 * @cfg {Boolean} [uploaderAutoInit = true]
	 * `False` to disable internal uploader component auto-initialization.
	 * A manual call to {@link #initUploader} is then required.
	 */
	uploaderAutoInit: true,
	
	uploader: null,
	
	initComponent: function() {
		var me = this, e;
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
	
	onDestroy: function() {
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
