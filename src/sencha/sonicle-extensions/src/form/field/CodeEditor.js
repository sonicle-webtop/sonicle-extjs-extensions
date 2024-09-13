/*
 * Sonicle ExtJs UX
 * Copyright (C) 2022 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 * 
 * Import libraries from https://codemirror.net/index.html
 */
Ext.define('Sonicle.form.field.CodeEditor', {
	extend: 'Ext.form.field.TextArea',
	alias: ['widget.socodeditor'],
	
	config: {
		
		/**
		 * @cfg {Object} [editor]
		 * CodeMirror's editor configuration options like described at https://codemirror.net/doc/manual.html#config
		 */
		editor: {}
	},
	
	onDestroy: function() {
		var me = this;
		me.setEditor(null);
		me.callParent();
	},
	
	afterRender: function() {
		var me = this,
			config = me.getEditor();
		
		Ext.defer(function() {
			me.setupEditor(config);
		}, 10);
	},
	
	applyEditor: function(config) {
		var me = this, ed;
		if (config === null) {
			ed = me.getEditor();
			if (ed && ed.isReady) {
				ed.toTextArea(); // Removes the editor restoring the original textarea
			}
			return null;
		}
		return config;
	},
	
	updateDisabled: function(disabled) {
		var ed = this.getEditor();
		if (ed) ed.setOption('readOnly', disabled === true);
	},
	
	setValue: function(value) {
		var me = this;
		me.syncValue(value);
		return me.callParent([value]);
	},
	
	focus: function(selectText, delay) {
		var me = this, ed;
		if (delay) {
			me.getFocusTask().delay(Ext.isNumber(delay) ? delay : 10, me.focus, me, [selectText, false]);
			
		} else {
			ed = me.getEditor();
			if (ed && ed.isReady) {
				ed.focus();
				if (selectText) ed.execCommand('selectAll');
			}
		}
		return me;
	},
	
	onResize: function(width, height, oldWidth, oldHeight) {
		var me = this,
			inputWrap = me.inputWrap,
			triggerWrap = me.triggerWrap,
			offw = width - oldWidth,
			offh = height - oldHeight,
			ed;
		me.callParent(arguments);
		ed = me.getEditor();
		if (ed && ed.isReady && inputWrap && triggerWrap) {
			// Height must be computed in relative way, taking into account resize 
			// offset, while width can be calculated using the new width value only.
			ed.setSize(
				offw === 0 ? null : width - (inputWrap.getBorderWidth('lr') + triggerWrap.getBorderWidth('lr')) -1, // decrease by 1px for rounding glyches
				offh === 0 ? null : ed.getWrapperElement().offsetHeight + offh
			);
			//ed.setSize(
			//	width - (inputWrap.getBorderWidth('lr') + triggerWrap.getBorderWidth('lr')) -1,
			//	height - (inputWrap.getBorderWidth('tb') + triggerWrap.getBorderWidth('tb'))
			//);
			ed.refresh();
		}
	},
	
	autoSize: function() {
		// Not supported!
	},
	
	privates: {
		onEditorDataChange: function(ed) {
			this.setValue(ed.getValue());
		},
		
		syncValue: function(value) {
			var me = this,
				ed = me.getEditor();

			if (ed && ed.isReady) {
				// Updates editor's value only if the updates does NOT 
				// come from editor's change event!
				if (value !== ed.getValue()) {
					// Add a whitespace during setValue in order to prevent an
					// internal error to CodeMirror ("Uncaught TypeError: Cannot read properties of null (reading 'split')")
					ed.setValue(value || '');
				}
				me.fireEvent('editorchange', me, value);
			}
		},
		
		setupEditor: function(config) {
			var me = this,
				inputEl = me.inputEl,
				defaultConfig = me.createDefaultEditorConfig(),
				bufferedChangeEvent = Ext.Function.createBuffered(me.onEditorDataChange, 50, me),
				cfg, size, ed;
			
			if (!inputEl) return;
			size = inputEl.getSize(); // Gets size before replacing text-area with editor
			
			cfg = Ext.merge(config || {}, defaultConfig || {});
			Ext.apply(cfg, {
				readOnly: me.disabled === true,
				value: me.value
			});
			
			ed = CodeMirror.fromTextArea(inputEl.dom, cfg);
			ed.setSize(size.width, size.height);
			ed.on('changes', bufferedChangeEvent);
			ed.isReady = true;
			me.editor = ed;
		},
		
		createDefaultEditorConfig: function() {
			return {
				lineNumbers: true
				//extraKeys: {"Ctrl-Space":"autocomplete"}
			};
		}
	}
});
