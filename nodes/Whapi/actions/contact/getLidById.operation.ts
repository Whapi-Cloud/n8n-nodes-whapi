import type { IDataObject, INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { updateDisplayOptions } from '../../helpers/utils';
import { apiRequest } from '../../transport';
import { executeWhapiItems } from './contactExecute';

const properties: INodeProperties[] = [
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		default: '',
		description: 'User ID (phone number or WhatsApp ID) to resolve to a LID',
	},
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['getLidById'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions) {
	return executeWhapiItems.call(this, async (i) => {
		const contactId = this.getNodeParameter('contactId', i) as string;

		return (await apiRequest.call(
			this,
			'GET',
			`contacts/lids/${encodeURIComponent(contactId)}`,
			{},
			undefined,
			undefined,
			{},
			i,
		)) as IDataObject;
	});
}