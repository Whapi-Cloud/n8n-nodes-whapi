import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS } from '../../helpers/documentation';
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
				description:
					'Check whether a phone number is registered on WhatsApp. See <a href="' +
					WHAPI_DOC_URLS.checkContact +
					'" target="_blank">check if a number has WhatsApp</a>.',
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
	...check.description,
];
