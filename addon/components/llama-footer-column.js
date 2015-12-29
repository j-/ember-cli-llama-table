import Em from 'ember';
import LlamaColumn from './llama-column';
var get = Em.get;
var set = Em.set;
var computed = Em.computed;
var alias = computed.alias;

var LlamaFooterColumn = LlamaColumn.extend({
	classNames: 'llama-footer-column',

	data: null,
	column: null,

	itemViewClass: computed({
		get: function () {
			var controller = this.get('root');
			var column = this.get('column');
			var type = get(column, 'type');
			return controller.getCellType(type);
		}
	}),

	createChildView: function (View, attrs) {
		var data = this.get('data');
		var column = this.get('column');
		set(attrs, 'root', this.get('root'));
		set(attrs, 'row', data);
		set(attrs, 'column', column);
		set(attrs, 'isFooter', true);
		return this._super(View, attrs);
	},

	init: function () {
		// override default assignment of `content` property
		this.set('content', Em.A([this.get('data')]));
		this._super();
	}
});

export default LlamaFooterColumn;
