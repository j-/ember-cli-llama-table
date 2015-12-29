import Em from 'ember';
var alias = Em.computed.alias;

var EmptyView = Em.Component.extend({
	layoutName: 'llama-empty',
	classNames: ['llama-empty'],
	content: alias('root.emptyText')
});

export default EmptyView;
