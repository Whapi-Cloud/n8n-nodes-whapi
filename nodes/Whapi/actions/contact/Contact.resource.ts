import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS, docNotice } from '../../helpers/documentation';
import * as check from './check.operation';

export { check };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Check Contact',
				value: 'check',
				description: 'Check phone number',
				action: 'Check contact',
			},
		],
		default: 'check',
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
	},
	docNotice(
		'checkDocsNotice',
		`Documentation: <a href="${WHAPI_DOC_URLS.checkContact}" target="_blank">Check if a number has WhatsApp</a> · ` +
			`<a href="${WHAPI_DOC_URLS.apiReference}" target="_blank">API reference</a>`,
		{
			show: {
				resource: ['contact'],
				operation: ['check'],
			},
		},
	),
	...check.description,
];
