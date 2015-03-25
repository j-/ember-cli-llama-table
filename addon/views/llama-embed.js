import Em from 'ember';
var get = Em.get;

var LlamaEmbed = Em.View.extend({
	classNames: 'llama-embed',
	height: Em.computed.alias('row.subcontentHeight'),

	row: null,

	rows: Em.computed.alias('controller.sortedRows'),

	calculateRowHeight: function (row) {
		var result = get(row, 'height');
		if (get(row, 'isExpanded')) {
			result += get(row, 'subcontentHeight') || 0;
		}
		return result;
	},

	offsetTop: function () {
		var sortedRows = this.get('rows');
		var row = this.get('row');
		var index = sortedRows.indexOf(row);
		var previous = sortedRows.slice(0, index);
		var calc = this.calculateRowHeight;
		var previousHeight = previous.reduce(function (total, row) {
			return total + calc(row);
		}, 0);
		var thisHeight = get(row, 'height');
		var offsetTop = previousHeight + thisHeight;
		return offsetTop;
	}.property('rows.@each.isExpanded', 'rows.@each.height', 'rows.@each.subcontentHeight'),

	updateOffsetTop: function () {
		var $embed = this.$();
		if ($embed) {
			$embed.css('top', this.get('offsetTop'));
		}
	}.on('didInsertElement').observes('offsetTop'),

	updateHeight: function () {
		var $embed = this.$();
		if ($embed) {
			$embed.css('height', this.get('height'));
		}
	}.on('didInsertElement').observes('height')
});

export default LlamaEmbed;
