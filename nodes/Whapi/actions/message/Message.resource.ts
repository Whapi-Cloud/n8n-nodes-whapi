import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS, docNotice } from '../../helpers/documentation';
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
	docNotice(
		'sendDocsNotice',
		`Documentation: <a href="${WHAPI_DOC_URLS.sending}" target="_blank">Sending messages</a> · ` +
			`<a href="${WHAPI_DOC_URLS.sendingMedia}" target="_blank">Media messages</a> · ` +
			`<a href="${WHAPI_DOC_URLS.apiReference}" target="_blank">API reference</a>`,
		{
			show: {
				resource: ['message'],
				operation: ['send'],
			},
		},
	),
	docNotice(
		'getDocsNotice',
		`Documentation: <a href="${WHAPI_DOC_URLS.getMessage}" target="_blank">Get message / chat history</a> · ` +
			`<a href="${WHAPI_DOC_URLS.messageResync}" target="_blank">Resync missing messages</a> · ` +
			`<a href="${WHAPI_DOC_URLS.apiReference}" target="_blank">API reference</a>`,
		{
			show: {
				resource: ['message'],
				operation: ['get'],
			},
		},
	),
	...get.description,
	...send.description,
];
