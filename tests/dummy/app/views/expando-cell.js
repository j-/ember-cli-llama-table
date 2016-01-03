import Em from 'ember';
import LlamaBodyCell from 'llama-table/components/llama-body-cell';

var ExpandoCell = LlamaBodyCell.extend({
	layoutName: 'expando-cell',
	classNames: 'no-padding',
	isExpanded: Em.computed.alias('content.isExpanded'),
	actions: {
		primaryAction: function (e) {
			e.preventDefault();
			this.send('toggle');
		},
		toggle: function () {
			this.toggleProperty('isExpanded');
		}
	}
});

export default ExpandoCell;
