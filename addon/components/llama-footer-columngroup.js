import Em from 'ember';
import LlamaColumngroup from './llama-columngroup';
var set = Em.set;
var alias = Em.computed.alias;

var LlamaFooterColumngroup = LlamaColumngroup.extend({
	classNames: 'llama-footer-columngroup',
	itemViewClass: alias('root.FooterColumnView'),

	columns: null,
	data: null,

	createChildView: function (View, attrs) {
		var data = this.get('data');
		set(attrs, 'root', this.get('root'));
		set(attrs, 'data', data);
		return this._super(View, attrs);
	}
});

export default LlamaFooterColumngroup;
