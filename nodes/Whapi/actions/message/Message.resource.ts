import type { INodeProperties } from 'n8n-workflow';

import * as get from './get.operation';
import * as send from './send.operation';

export {  get , send};

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			/*{
				name: 'Get List',
				value: 'list',
				description: 'Get list of messages',
				action: 'Get list of messages',
			},*/
			{
				name: 'Get Message',
				value: 'get',
				description: 'Get the message by ID',
				action: 'Get the message',
			},
			{
				name: 'Send Message',
				value: 'send',
				description: 'Send message to any chat',
				action: 'Send the message',
			},
		],
		default: 'get',
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
	},
	...get.description,
	...send.description,
];
