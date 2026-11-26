import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';
import {
	parseError,
	prepareErrorData,
	updateDisplayOptions,
} from '../../helpers/utils';
import { apiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName: 'Contact',
		name: 'contact',
		type: 'string',
		required: true,
		default: '',
		description: 'Phone number to check',
	},
];

const displayOptions = {
	show: {
		resource: ['contact'],
		operation: ['check'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	const endpoint = 'contacts';

	for (let i = 0; i < items.length; i++) {
		try {
			const contact = this.getNodeParameter('contact', i);

			const responseData = await apiRequest.call(
				this,
				'POST',
				endpoint,
				{
					blocking: 'wait',
					contacts: [contact],
				},
				undefined,
				undefined,
				{},
				i,
			);
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		} catch (error) {
			const parsedError = parseError(this.getNode(), error, i);

			if (this.continueOnFail()) {
				returnData.push(...prepareErrorData.call(this, parsedError, i));
			} else {
				throw parsedError;
			}
		}
	}

	return [returnData];
}
