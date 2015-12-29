import Em from 'ember';
var alias = Em.computed.alias;

var EmptyView = Em.Component.extend({
	layoutName: 'components/llama-empty',
	classNames: ['llama-empty'],
	content: alias('root.emptyText')
});

export default EmptyView;
