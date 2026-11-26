import type { IDataObject, INodeProperties, IExecuteFunctions } from 'n8n-workflow';
import { updateDisplayOptions } from '../../helpers/utils';
import { apiRequest } from '../../transport';
import { executeWhapiItems } from './contactExecute';

const properties: INodeProperties[] = [
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		default: '',
		description: 'Phone number or WhatsApp contact ID',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Contact name in the address book',
	},
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['add'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions) {
	return executeWhapiItems.call(this, async (i) => {
		const phone = this.getNodeParameter('phone', i) as string;
		const name = this.getNodeParameter('name', i) as string;

		return (await apiRequest.call(
			this,
			'PUT',
			'contacts',
			{ phone, name },
			undefined,
			undefined,
			{},
			i,
		)) as IDataObject;
	});
}