import type { INodeProperties } from 'n8n-workflow';

import * as check from './check.operation';

export {  check };

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
			}
		],
		default: 'check',
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
	},
	...check.description
];
