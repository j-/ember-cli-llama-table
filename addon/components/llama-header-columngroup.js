import Em from 'ember';
import LlamaColumngroup from './llama-columngroup';
var alias = Em.computed.alias;

var LlamaHeaderColumngroup = LlamaColumngroup.extend({
	layoutName: 'components/llama-header-columngroup',
	classNames: 'llama-header-columngroup',
	itemViewClass: alias('root.HeaderColumnView'),

	columns: null
});

export default LlamaHeaderColumngroup;
