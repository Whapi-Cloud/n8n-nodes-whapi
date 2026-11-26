import type { IDataObject, INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { updateDisplayOptions } from '../../helpers/utils';
import { apiRequest } from '../../transport';
import { executeWhapiItems } from './contactExecute';

const properties: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Count',
				name: 'count',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 500 },
				default: 100,
				description: 'Number of contacts to return (1–500)',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
				description: 'Offset for pagination',
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['list'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions) {
	return executeWhapiItems.call(this, async (i) => {
		const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
		const query: IDataObject = {};

		if (additionalFields.count !== undefined && additionalFields.count !== '') {
			query.count = additionalFields.count;
		}
		if (additionalFields.offset !== undefined && additionalFields.offset !== '') {
			query.offset = additionalFields.offset;
		}

		return (await apiRequest.call(
			this,
			'GET',
			'contacts',
			{},
			query,
			undefined,
			{},
			i,
		)) as IDataObject;
	});
}