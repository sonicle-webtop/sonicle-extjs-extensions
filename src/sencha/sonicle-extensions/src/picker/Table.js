/*
 * Sonicle ExtJs UX
 * Copyright (C) 2020 Sonicle S.r.l.
 * sonicle@sonicle.com
 * http://www.sonicle.com
 */
Ext.define('Sonicle.picker.Table', {
	extend: 'Ext.Component',
	alias: 'widget.sotablepicker',
	uses: [
		'Sonicle.String'
	],
	
	border: false,
	
	baseCls: 'so-' + 'tablepicker',
	cellSelectedCls: 'so-'+'tablepicker-cell-selected',
	selectionText: '{0}x{1}',
	
	childEls: ['innerEl', 'tableEl', 'footerEl'],
	renderTpl: [
		'<div id="{id}-innerEl" data-ref="innerEl" role="presentation">',
			'<table role="grid" id="{id}-tableEl" data-ref="tableEl" class="{baseCls}-table" cellspacing="0" cellpadding="0" tabindex="0" aria-readonly="true">',
				'<tbody>',
					'<tr role="row">',
						'<tpl for="cells">',
							'{#:this.isEndOfRow}',
							'<td role="gridcell">',
								'<div hidefocus="on" id="{parent.id}-cell-{#:this.cellCoords}" class="{parent.baseCls}-cell"></div>',
							'</td>',
						'</tpl>',
					'</tr>',
				'</tbody>',
			'</table>',
			'<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer"></div>',
		'</div>',
		{
			cellCoords: function(value) {
				value--;
				var row = Math.floor(value / 10),
						col = (value % 10);
				return row + '_' + col;
			},
			isEndOfRow: function(value) {
				value--;
				var end = value % 10 === 0 && value !== 0;
				return end ? '</tr><tr role="row">' : '';
			}
		}
	],
	
	beforeRender: function() {
		var me = this;
		me.callParent();
		Ext.applyIf(me, {
			renderData: {}
		});
		Ext.apply(me.renderData, {
			cells: new Array(100)
		});
	},
	
	onRender: function(container, position) {
		var me = this,
            cellSelector = 'div.' + me.baseCls + '-cell';
		me.callParent(arguments);
		me.mon(me.tableEl, {
			scope: me,
			click: {
				fn: me.handleCellClick,
				delegate: cellSelector
			},
			mouseover: {
				fn: me.handleCellOver,
				delegate: cellSelector
			}
		});
		me.footerEl.setHtml(Ext.String.format(me.selectionText, 0, 0));
	},
	
	clearSelection: function() {
		var me = this;
		if (me.rendered) {
			me.selectCells(-1, -1);
			me.footerEl.setHtml(Ext.String.format(me.selectionText, 0, 0));
		}
	},
	
	privates: {
		extractCellCoords: function(id) {
			var coords = Sonicle.String.substrAfterLast(id, '-').split('_');
			return {row: parseInt(coords[0]), col: parseInt(coords[1])};
		},
		
		handleCellOver: function(e, t) {
			e.stopEvent();
			var me = this,
					coords = me.extractCellCoords(t.id);
			
			me.selectCells(coords.row, coords.col);
			me.footerEl.setHtml(Ext.String.format(me.selectionText, coords.row+1, coords.col+1));
		},
		
		handleCellClick: function(e, t) {
			e.stopEvent();
			var me = this,
					coords = me.extractCellCoords(t.id),
					handler = me.handler;
			
			if (!me.disabled && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)) {
				me.fireEvent('select', me, coords.row+1, coords.col+1);
				if (handler) {
					Ext.callback(handler, me.scope, [me, coords.row+1, coords.col+1], null, me, me);
				}
				
				// event handling is turned off on hide
				// when we are using the picker in a field
				// therefore onSelect comes AFTER the select
				// event.
				if (me.hideOnSelect) {
					this.hide();
				}
			}
		},
		
		selectCells: function(selectedRow, selectedCol) {
			var me = this, baseId = me.id + '-cell-', i, j;
			for (i=0; i < 10; i++) {
				for (j=0; j < 10; j++) {
					Ext.fly(baseId + i + '_' + j).toggleCls(me.cellSelectedCls, i <= selectedRow && j <= selectedCol);
				}
			}
		}
	}
});
