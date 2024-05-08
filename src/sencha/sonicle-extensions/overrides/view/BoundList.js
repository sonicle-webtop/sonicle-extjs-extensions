/**
 * Override original {@link Ext.view.BoundList}
 * - Add support to HTML encoding for displayField
 */
Ext.define('Sonicle.overrides.view.BoundList', {
	override: 'Ext.view.BoundList',
	
	/**
	 * @cfg {Boolean} escapeDisplay
	 * Set to `true` to escape display value.
	 */
	escapeDisplay: false,
	
	/**
	 * @override Check me during ExtJs upgrade!
	 * Override original {@link Ext.view.BoundList#getInnerTpl}:
	 *  - support HTML encoding
	 */
	getInnerTpl: function(displayField) {
		return '{' + displayField + (this.escapeDisplay ? ':htmlEncode' : '') + '}';
	}
});