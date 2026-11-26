import type { IDataObject, INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { updateDisplayOptions } from '../../helpers/utils';
import { apiRequest } from '../../transport';
import { executeWhapiItems } from './contactExecute';

const properties: INodeProperties[] = [
	{
		displayName: 'Contact LID',
		name: 'contactLid',
		type: 'string',
		required: true,
		default: '',
		description: 'Linked ID, for example 123456789012345@lid',
	},
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['getPhoneByLid'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions) {
	return executeWhapiItems.call(this, async (i) => {
		const contactLid = this.getNodeParameter('contactLid', i) as string;

		return (await apiRequest.call(
			this,
			'GET',
			`contacts/ids/${encodeURIComponent(contactLid)}`,
			{},
			undefined,
			undefined,
			{},
			i,
		)) as IDataObject;
	});
}