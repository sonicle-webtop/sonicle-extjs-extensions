/*
 * Sonicle ExtJs UX
 * Copyright (C) 2018 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.DisplayImage', {
	extend: 'Ext.form.field.Text',
	alias: ['widget.sodisplayimage', 'widget.sodisplayimagefield'],
	
	ariaRole: 'img',
	focusable: false,
	maskOnDisable: false,
	
	config: {
		baseImageUrl: '',
		urlParam: 'id',
		urlExtraParams: null,
		placeholderImageUrl: Ext.BLANK_IMAGE_URL,
		usePlaceholder: true
	},
	
	/**
	 * @cfg {Number} [imageWidth=100]
	 * The pixel width of image.
	 */
	imageWidth: 100,
	
	/**
	 * @cfg {Number} [imageHeight=100]
	 * The pixel height of image.
	 */
	imageHeight: 100,
	
	/**
	 * @cfg {circle|square} [geometry=circle]
	 * Changes avatar's geomerty.
	 */
	geometry: 'square',
	
	/**
	 * @cfg {String} [fieldCls="so-form-displayimage-field"]
	 * The default CSS class for the field.
	 */
	fieldCls: 'so-' + 'form-displayimage-field',
	fieldBodyCls: 'so-' + 'form-displayimage-field-body',
	
	fieldSubTpl: [
		'<div id="{id}" role="{role}" data-ref="inputEl" {inputAttrTpl}',
		'<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
		' class="{fieldCls} {fieldCls}-{ui}"></div>',
		{
			compiled: true,
			disableFormats: true
		}
	],
	
	/**
	 * Overrides the method from the Ext.form.field.Base
	 */
	getFieldStyle: function() {
		var me = this,
				style = me.callParent(),
				styles = Ext.isString(style) ? Ext.dom.Element.parseStyles(style) : style,
				radius = me.buildRadius();
		
		styles.width = me.imageWidth + 'px';
		styles.height = me.imageHeight + 'px';
		if (!Ext.isEmpty(radius)) styles.borderRadius = radius;
		return Ext.DomHelper.generateStyles(styles, null, true);
	},
	
	getValueStyles: function(value) {
		var bgImage = this.buildBgImage(value);
		return !Ext.isEmpty(bgImage) ? {backgroundImage: bgImage} : {};
	},
	
	onRender: function() {
		var me = this;
		me.callParent();
		if (me.triggerWrap && (me.border === false)) me.triggerWrap.applyStyles({border: 'none'});
		if (me.inputWrap) me.inputWrap.applyStyles({padding: '5px'});
		if (me.inputEl) me.inputEl.applyStyles(me.getValueStyles(me.value));
	},
	
	setValue: function(value) {
		var me = this;
		if (me.inputEl) me.inputEl.applyStyles(me.getValueStyles(value));
		me.callParent(arguments);
		return me;
	},
	
	updateUrlExtraParams: function(nv, ov) {
		var me = this;
		if (me.rendered) me.setValue(me.getValue());
	},
	
	privates: {
		buildRadius: function() {
			return (this.geometry === 'circle') ? '50%' : null;
		},
		
		buildBgImage: function(value) {
			var me = this, args = [','];
			if (!Ext.isEmpty(value)) args.push('url(' + me.buildUrl(value) + ')');
			if (me.getUsePlaceholder()) args.push('url(' + me.getPlaceholderImageUrl() + ')');
			return Sonicle.String.join.apply(null, args);
		},
		
		buildUrl: function(value) {
			var me = this,
					defltParams = {},
					obj;
			defltParams[this.getUrlParam()] = value;
			obj = Ext.apply(me.urlExtraParams || {}, defltParams);
			return Ext.String.urlAppend(this.getBaseImageUrl(), Ext.Object.toQueryString(obj));
		}
	}
});	
