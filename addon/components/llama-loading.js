import Em from 'ember';
import EmptyView from './llama-empty';
var alias = Em.computed.alias;

var LoadingView = EmptyView.extend({
	classNames: ['llama-loading'],
	content: alias('root.loadingText')
});

export default LoadingView;