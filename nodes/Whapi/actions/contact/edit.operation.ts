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
		description: 'WhatsApp contact ID to update',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'New contact name in the address book',
	},
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['edit'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions) {
	return executeWhapiItems.call(this, async (i) => {
		const contactId = this.getNodeParameter('contactId', i) as string;
		const name = this.getNodeParameter('name', i) as string;

		return (await apiRequest.call(
			this,
			'PATCH',
			`contacts/${encodeURIComponent(contactId)}`,
			{ name },
			undefined,
			undefined,
			{},
			i,
		)) as IDataObject;
	});
}