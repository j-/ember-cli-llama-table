import Em from 'ember';
import LlamaBodyCell from 'llama-table/components/llama-body-cell';
var computed = Em.computed;
var gt = computed.gt;
var not = computed.not;

var ButtonCell = LlamaBodyCell.extend({
	showButton: not('isFooter'),
	layoutName: 'button-cell',
	actions: {
		click: function () {
			var controller = this.get('root');
			var rows = controller.get('rows');
			var row = this.get('content');
			var index = rows.indexOf(row);
			controller.sendAction(this.get('actionName'), index);
		}
	}
});

export default ButtonCell;
