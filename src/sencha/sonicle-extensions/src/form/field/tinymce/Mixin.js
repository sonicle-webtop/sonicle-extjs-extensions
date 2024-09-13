/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.form.field.tinymce.Mixin', {
	extend: 'Ext.Mixin',
	mixinConfig: {
		id: 'tinymce',
		on: {
			onRender: 'tmceOnOnRender'
			//onResize: 'tmceOnOnResize'
		}
	},
	
	config: {
		editor: {}
	},
	
	/**
	 * @readonly
	 * @property {Boolean} isTinyMCE
	 * Identifies this class and its subclasses.
	 */
	isTinyMCE: true,
	
	/**
	 * @event editorready
	 * Fired after the TinyMCE instance is initialized.
	 * @param {Sonicle.form.field.tinymce.Mixin} this This component.
	 * @param {Object} The TinyMCE instance.
	 */
	
	/**
	 * @event editorchange
	 * Fired after the TinyMCE editor's value changes.
	 * @param {Sonicle.form.field.tinymce.Mixin} this This component.
	 * @param {String} The value.
	 */
	
	applyEditor: function(config) {
		var me = this, ed;
		if (config === null) {
			ed = me.getEditor();
			if (ed && ed.isReady) {
				ed.destroy();
				// CKE leaves the innerHTML set to the html value. 
				// Since we're being destroyed, clean that up too.
				me.getEditorDomElement().innerHTML = '';
			}
			return null;
		}
		return config;
	},
	
	tmceOnOnRender: function(parentNode, containerIdx) {
		var me = this,
				config = me.getEditor();
		// Defer editor creation in order to avoid startup failures: missing 
		// init event fire and editor area non clickable
		Ext.defer(function() {
			me.createEditor(config);
		}, 10);
	},
	
	/*
	tmceOnOnResize: function(width, height, oldWidth, oldHeight) {
		//TODO: hide floating panels after resize! (like v.4 tinymce.ui.FloatPanel.hideAll())
		//https://github.com/tinymce/tinymce/issues/3592
	},
	*/
	
	createDefaultEditorConfig: function() {
		return {};
	},
	
	createEditor: function(config) {
		var me = this,
				domEl = me.getEditorDomElement(),
				defaultConfig = me.createDefaultEditorConfig(),
				bufferedChangeEvent = Ext.Function.createBuffered(me.onEditorDataChange, 50, me),
				cfg;
		
		if (!domEl) return;
		
		cfg = Ext.merge(config || {}, defaultConfig || {});
		Ext.apply(cfg, {
			selector: domEl.tagName + '#' + domEl.id,
			height: '100%',
			branding: false, // Hide 'Powered by Tiny' watermark
			resize: false, // Disable the resize handle
			menubar: '', // Hide top menu-bar
			custom_undo_redo_levels: 10
		});
		
		tinymce.init(cfg)
			.then(function(editors) {
				var editor = editors[0];
				editor.isReady = true; // Helps to distinguish if editor is really an instance and not a config
				editor.component = me;
				me.editor = editor;
				me.fireEvent('editorready', me, editor);
				// https://www.tiny.cloud/docs/advanced/events/
				editor.on('Paste Change input Undo Redo', bufferedChangeEvent);
				editor.setContent(me.getValue(), {format: 'html'});
			});
		
		/*
		Ext.apply(cfg, {
			//selector: domEl.tagName + '#' + domEl.id,
			target: domEl,
			height: '100%',
			branding: false, // Hide 'Powered by Tiny' watermark
			resize: false, // Disable the resize handle
			menubar: '', // Hide top menu-bar
			custom_undo_redo_levels: 10,
			
			init_instance_callback: function(editor) {
				editor.isReady = true; // Helps to distinguish if editor is really an instance and not a config
				editor.component = me;
				me.editor = editor;
				me.fireEvent('editorready', me, editor);
				// https://www.tiny.cloud/docs/advanced/events/
				editor.on('Paste Change input Undo Redo', bufferedChangeEvent);
				editor.setContent(me.getValue(), {format: 'html'});
			}
		});
		tinymce.init(cfg);
		*/
	},
	
	onEditorDataChange: function() {
		var me = this,
				ed = me.getEditor();
		if (ed) me.setValue(ed.getContent({format: 'html'}));
	},
	
	updateValue: function(value) {
		var me = this,
			ed = me.getEditor(),
			edvalue;
		//console.log('Mixin:updateValue');
		if (ed && ed.isReady) {
			edvalue = ed.getContent({format: 'html'});
			me.fireEvent('editorchange', me, value);
			// The value won't change if it came from
			// onEditorDataChange. Otherwise, someone
			// ran setValue() on the component and the
			// editor's html has to reflect that.
			if (value !== edvalue) {
				ed.setContent(value, {format: 'html'});
			}
		}
	},
	
	updateDisabled: function(disabled) {
		var ed = this.getEditor();
		if (ed) ed.isReadOnly = disabled === true;
	},
	
	getEditorDomElement: function() {
		Ext.raise('getEditorDomElement must be overridden in the class using tinymce/Mixins');
	}
});
