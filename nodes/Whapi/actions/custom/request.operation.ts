import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	parseError,
	prepareErrorData,
	resolveWhapiGateUrl,
	updateDisplayOptions,
} from '../../helpers/utils';
import { apiRequest } from '../../transport';

const JSON_BODY_METHODS = new Set<IHttpRequestMethods>(['PATCH', 'POST', 'PUT']);

const properties: INodeProperties[] = [
	{
		displayName: 'Method',
		name: 'requestMethod',
		type: 'options',
		options: [
			{ name: 'DELETE', value: 'DELETE' },
			{ name: 'GET', value: 'GET' },
			{ name: 'PATCH', value: 'PATCH' },
			{ name: 'POST', value: 'POST' },
			{ name: 'PUT', value: 'PUT' },
		],
		default: 'GET',
		required: true,
		description: 'HTTP method for the request',
	},
	{
		displayName: 'Path',
		name: 'apiPath',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. chats or messages/MESSAGE_ID',
		description:
			'Path on the Whapi gate, without the host. Example: <code>chats</code> calls <code>https://gate.whapi.cloud/chats</code>. A full URL is accepted only when it is <code>https://gate.whapi.cloud/…</code> (exact host, no credentials or custom port).',
	},
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Parameter',
		default: {},
		options: [
			{
				name: 'parameter',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'JSON Body',
		name: 'jsonBody',
		type: 'json',
		default: '',
		displayOptions: {
			show: {
				requestMethod: ['PATCH', 'POST', 'PUT'],
			},
		},
		description: 'Request body. Leave empty for no body.',
	},
];

const displayOptions = {
	show: {
		resource: ['customApi'],
		operation: ['request'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

function buildQueryParameters(
	this: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const collection = this.getNodeParameter('queryParameters', itemIndex, {}) as IDataObject;
	const parameterList = (collection.parameter as IDataObject[] | undefined) ?? [];
	const query: IDataObject = {};

	for (const entry of parameterList) {
		const name = entry.name as string | undefined;
		if (!name) {
			continue;
		}
		query[name] = entry.value as string;
	}

	return query;
}

function parseJsonBody(
	this: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const raw = this.getNodeParameter('jsonBody', itemIndex) as IDataObject | string;

	if (raw === '' || raw === undefined || raw === null) {
		return {};
	}

	if (typeof raw === 'object') {
		return raw;
	}

	try {
		return JSON.parse(raw) as IDataObject;
	} catch {
		throw new NodeOperationError(
			this.getNode(),
			'JSON Body must be valid JSON',
			{ itemIndex },
		);
	}
}

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const requestMethod = this.getNodeParameter('requestMethod', i) as IHttpRequestMethods;
			const apiPath = this.getNodeParameter('apiPath', i) as string;

			const url = resolveWhapiGateUrl(apiPath, this.getNode(), i);

			const query = buildQueryParameters.call(this, i);
			const body = JSON_BODY_METHODS.has(requestMethod)
				? parseJsonBody.call(this, i)
				: {};

			const responseData = await apiRequest.call(
				this,
				requestMethod,
				'',
				body,
				query,
				url,
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