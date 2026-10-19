import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';
import {
	parseError,
	prepareErrorData,
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
	const endpoint = `contacts`;
	const contact = this.getNodeParameter('contact', 0);
	const returnData: INodeExecutionData[] = [];


	try {
		let responseData = await apiRequest.call(this, 'POST', endpoint, {blocking: 'wait', contacts:[contact]});
		const executionData = this.helpers.constructExecutionMetaData(
			this.helpers.returnJsonArray(responseData as IDataObject),
			{itemData: {item: 0}},
		);

		returnData.push(...executionData);
	} catch (error) {
		const parsedError = parseError(this.getNode(), error, 0);

		if (this.continueOnFail()) {
			returnData.push(
				...prepareErrorData.call(this, parsedError, 0),
			);
		} else {
			throw parsedError;
		}
	}


	return [returnData];
}

