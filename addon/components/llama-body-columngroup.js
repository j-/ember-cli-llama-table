import Em from 'ember';
import LlamaColumngroup from './llama-columngroup';
var set = Em.set;

var LlamaBodyColumngroup = LlamaColumngroup.extend({
	layoutName: 'components/llama-body-columngroup',
	classNames: 'llama-body-columngroup',
	itemViewClass: Em.computed.alias('root.BodyColumnView'),

	columns: null,
	rows: null,

	// createChildView: function (View, attrs) {
	// 	var rows = this.get('rows');
	// 	set(attrs, 'root', this.get('root'));
	// 	set(attrs, 'rows', rows);
	// 	return this._super(View, attrs);
	// }
});

export default LlamaBodyColumngroup;
