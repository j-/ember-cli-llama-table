import LlamaHeaderCell from 'llama-table/components/llama-header-cell';

var RemoveButtonHeader = LlamaHeaderCell.extend({
	showButton: true,
	layoutName: 'button-cell',
	formatted: 'Remove all',
	actions: {
		click: function () {
			this.get('root').sendAction('removeAll');
		}
	}
});

export default RemoveButtonHeader;
