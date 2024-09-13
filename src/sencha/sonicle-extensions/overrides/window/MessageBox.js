/**
 * Override original {@link Ext.window.MessageBox}
 * - Add support to button reversing (show order inverted)
 * - Add option to split Cancel button from other buttons
 * - Add support to pseudo UIs
 */
Ext.define('Sonicle.overrides.window.MessageBox', {
	override: 'Ext.window.MessageBox',
	
	/**
	 * @cfg {Boolean} [reverseButtons]
	 * Set to `true` to invert buttons ordering: from `ok > yes > no > cancel` to `cancel > no > yes > ok`.
	 */
	reverseButtons: false,
	
	/**
	 * @cfg {Boolean} splitCancelButton
	 * Set to `true` to separate cancel button from others.
	 */
	//splitCancelButton: false,
	
	/**
	 * @cfg {left|center|right} [buttonsAlign]
	 * Controls buttons horizontal alignment.
	 */
	buttonsAlign: 'center',
	
	/**
	 * @property
	 * An object containing the default button pseudo UIs that can be overriden 
	 * for customization purposes. Supported properties are: ok, cancel, yes and no.
	 */
	buttonPseudoUi: {
		ok: '{primary}',
		yes: '{primary}',
		no: '{secondary}',
		cancel: '{tertiary}'
	},
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.window.MessageBox#initComponent}
	 * - If enabled, reverse button items in bottomTb
	 * (code is like the original except for the items order)
	 */
	initComponent: function(cfg) {
        var me = this,
            baseId = me.id,
            i, button;
		
		// A title or iconCls could have been passed in the config to the constructor.
		me.title = me.title || '&#160;';
		me.iconCls = me.iconCls || '';

		me.topContainer = new Ext.container.Container({
			layout: 'hbox',
			padding: 10,
			style: {
				overflow: 'hidden'
			},
			items: [
				me.iconComponent = new Ext.Component({
					cls: me.baseIconCls
				}),
				me.promptContainer = new Ext.container.Container({
					flex: 1,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						me.msg = new Ext.Component({
							id: baseId + '-msg',
							cls: me.baseCls + '-text'
						}),
						me.textField = new Ext.form.field.Text({
							id: baseId + '-textfield',
							enableKeyEvents: true,
							ariaAttributes: {
								'aria-labelledby': me.msg.id
							},
							listeners: {
								keydown: me.onPromptKey,
								scope: me
							}
						}),
						me.textArea = new Ext.form.field.TextArea({
							id: baseId + '-textarea',
							height: 75,
							ariaAttributes: {
								'aria-labelledby': me.msg.id
							}
						})
					]
				})
			]
		});

		me.progressBar = new Ext.ProgressBar({
			id: baseId + '-progressbar',
			margin: '0 10 10 10'
		});

		me.items = [me.topContainer, me.progressBar];

		// Create the buttons based upon passed bitwise config
		me.msgButtons = [];

		for (i = 0; i < 4; i++) {
			button = me.makeButton(i);
			me.msgButtons[button.itemId] = button;
			me.msgButtons.push(button);
		}

		me.bottomTb = new Ext.toolbar.Toolbar({
			id: baseId + '-toolbar',
			ui: 'footer',
			dock: 'bottom',
			focusableContainer: false,
			ariaRole: null,
			layout: {
				pack: { left: 'start', right: 'end' }[me.buttonAlign] || 'center'
			},
			// Button indexes: 0 - ok, 1 - yes, 2 - no, 3 - cancel
			items: (me.reverseButtons === true) ? Ext.Array.union(
					// Invert button order respect to the original sequence!
					('right' === me.buttonsAlign) ? ['->'] : [],
					[me.msgButtons[3], me.msgButtons[2], me.msgButtons[1], me.msgButtons[0]],
					('left' === me.buttonsAlign) ? ['<-'] : []
					//(me.splitCancelButton === true) ? [me.msgButtons[3], '->'] : [me.msgButtons[3]],
					//[me.msgButtons[2], me.msgButtons[1], me.msgButtons[0]]
				) : Ext.Array.union(
					// Original button order!
					('right' === me.buttonsAlign) ? ['->'] : [],
					[me.msgButtons[0], me.msgButtons[1], me.msgButtons[2], me.msgButtons[3]],
					('left' === me.buttonsAlign) ? ['<-'] : []
					//[me.msgButtons[0], me.msgButtons[1], me.msgButtons[2]],
					//(me.splitCancelButton === true) ? ['<-', me.msgButtons[3]] : [me.msgButtons[3]],
				)
		});

		me.dockedItems = [me.bottomTb];
		me.on('close', me.onClose, me);

		me.callSuper();
    },
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.window.MessageBox#makeButton}
	 * - Add pseudo UI in created button
	 */
	makeButton: function(btnIdx) {
		var me = this,
			btnId = me.buttonIds[btnIdx];
		
		return new Ext.button.Button({
			itemId: btnId,
			ui: me.buttonPseudoUi[btnId],
			text: me.buttonText[btnId],
			handler: me.btnCallback,
			scope: me,
			minWidth: 75
		});
	}
});