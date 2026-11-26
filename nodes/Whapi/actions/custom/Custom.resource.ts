import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS } from '../../helpers/documentation';
import * as request from './request.operation';

export { request };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Custom API Call',
				value: 'request',
				description:
					'Call any Whapi gate endpoint. See the <a href="' +
					WHAPI_DOC_URLS.apiReference +
					'" target="_blank">API reference</a> for paths and payloads.',
				action: 'Make a custom API call',
			},
		],
		default: 'request',
		displayOptions: {
			show: {
				resource: ['customApi'],
			},
		},
	},
	...request.description,
];