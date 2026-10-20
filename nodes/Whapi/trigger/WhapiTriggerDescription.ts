import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS, docNotice } from '../helpers/documentation';

export const whapiTriggerDescription: INodeProperties[] = [
	docNotice(
		'webhooksDocsNotice',
		`Documentation: <a href="${WHAPI_DOC_URLS.webhooksOverview}" target="_blank">Incoming webhooks overview</a> · ` +
			`<a href="${WHAPI_DOC_URLS.apiReference}" target="_blank">API reference</a>`,
	),
	{
		displayName: 'Trigger On',
		name: 'updates',
		type: 'multiOptions',
		required: true,
		default: [],
		description:
			'Choose which Whapi webhook event families this workflow should receive when activated',
		options: [
			{
				name: 'Messages Events',
				value: 'messages',
			},
			{
				name: 'Groups Events',
				value: 'groups',
			},
		],
	},
	docNotice(
		'messagesWebhookDocsNotice',
		`Message webhook payload: <a href="${WHAPI_DOC_URLS.webhooksMessages}" target="_blank">Incoming message format</a>`,
		{
			show: {
				updates: ['messages'],
			},
		},
	),
	docNotice(
		'groupsWebhookDocsNotice',
		`Group webhook payload: <a href="${WHAPI_DOC_URLS.webhooksGroups}" target="_blank">Groups webhook format</a>`,
		{
			show: {
				updates: ['groups'],
			},
		},
	),
];
