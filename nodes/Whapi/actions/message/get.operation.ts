import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';
import { WHAPI_DOC_URLS } from '../../helpers/documentation';
import {
	updateDisplayOptions,
	parseError,
	prepareErrorData,
} from '../../helpers/utils';
import { apiRequest } from '../../transport';

const properties: INodeProperties[] = [
	{
		displayName: 'MessageID',
		name: 'messageID',
		type: 'string',
		required: true,
		default: '',
		description:
			'Message ID. See <a href="' +
			WHAPI_DOC_URLS.getMessage +
			'" target="_blank">retrieve chat history</a>.',
	},
];

const displayOptions = {
	show: {
		resource: ['message'],
		operation: ['get'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const id = this.getNodeParameter('messageID', i) as string;
			const endpoint = `messages/${id}`;

			const responseData = await apiRequest.call(this, 'GET', endpoint);
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
