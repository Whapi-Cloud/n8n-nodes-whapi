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
		displayName: 'MessageID',
		name: 'messageID',
		type: 'string',
		default: '',
		description: 'Message ID',
	}
];

const displayOptions = {
	show: {
		resource: ['message'],
		operation: ['get'],
	},
};


export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const id = this.getNodeParameter('messageID', 0)!.toString();
	const endpoint = `messages/${id}`;
	const returnData: INodeExecutionData[] = [];


	try {
		let responseData = await apiRequest.call(this, 'GET', endpoint);
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

