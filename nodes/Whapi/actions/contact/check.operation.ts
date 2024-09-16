import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';
import {
	updateDisplayOptions
} from '../../helpers/utils';
import {apiRequest} from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName: 'Contact',
		name: 'contact',
		type: 'string',
		required: true,
		default: '',
		description: 'Phone number to check',
	}
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['check'],
	},
};


export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const endpoint = `contacts/`;
	const contact = this.getNodeParameter('contact', 0);
	const returnData: INodeExecutionData[] = [];


	try {
		let responseData = await apiRequest.call(this, 'POST', endpoint, {blocking: 'wait', contacts:[contact]});
		console.log({responseData})
		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData as IDataObject),
			{itemData: {item: 0}},
		);

		returnData.push(...executionData);
	} catch (error) {
		if (this.continueOnFail()) {
			const executionErrorData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray({error: error.message}),
				{itemData: {item: 0}},
			);
			returnData.push(...executionErrorData);

		}
		throw error;
	}


	return [returnData];
}

