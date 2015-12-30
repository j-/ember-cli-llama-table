import Em from 'ember';
import LlamaColumn from './llama-column';
import LlamaBodyCell from './llama-body-cell';
var get = Em.get;
var set = Em.set;
var computed = Em.computed;

var LlamaBodyColumn = LlamaColumn.extend({
	layoutName: 'components/llama-body-column',
	classNames: 'llama-body-column',

	rows: null,
	column: null,

	itemViewClass: computed({
		get: function () {
			var controller = this.get('root');
			var column = this.get('column');
			var type = get(column, 'type');
			return controller.getCellType(type);
		}
	}),

	// createChildView: function (View, attrs) {
	// 	var row = get(attrs, 'content');
	// 	set(attrs, 'root', this.get('root'));
	// 	set(attrs, 'row', row);
	// 	return this._super(View, attrs);
	// }
});

export default LlamaBodyColumn;
