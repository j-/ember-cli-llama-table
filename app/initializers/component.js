import Em from 'ember';
import LlamaTable from 'llama-table/components/llama-table';
import LlamaTableView from 'llama-table/views/llama-table';

var initializer = {
	name: 'llama-table-component',
	initialize: function (container, app) {
		container.register('component:llama-table', LlamaTable);
		container.register('view:llama-table', LlamaTableView);
	}
};

export default initializer;
