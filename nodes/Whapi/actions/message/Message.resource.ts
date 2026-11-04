import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS } from '../../helpers/documentation';
import * as get from './get.operation';
import * as send from './send.operation';

export { get, send };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Message',
				value: 'get',
				description:
					'Get the message by ID. See <a href="' +
					WHAPI_DOC_URLS.getMessage +
					'" target="_blank">retrieve chat history</a> and <a href="' +
					WHAPI_DOC_URLS.messageResync +
					'" target="_blank">resync missing messages</a>.',
				action: 'Get the message',
			},
			{
				name: 'Send Message',
				value: 'send',
				description:
					'Send message to any chat. See <a href="' +
					WHAPI_DOC_URLS.sending +
					'" target="_blank">sending messages</a> and <a href="' +
					WHAPI_DOC_URLS.sendingMedia +
					'" target="_blank">media messages</a>.',
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
