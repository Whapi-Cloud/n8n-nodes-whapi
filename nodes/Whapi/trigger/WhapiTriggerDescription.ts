import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS } from '../helpers/documentation';

export const whapiTriggerDescription: INodeProperties[] = [
	{
		displayName: 'Trigger On',
		name: 'updates',
		type: 'multiOptions',
		required: true,
		default: [],
		description:
			'Choose which Whapi webhook event families this workflow should receive when activated. ' +
			'See <a href="' +
			WHAPI_DOC_URLS.webhooksOverview +
			'" target="_blank">incoming webhooks overview</a>.',
		options: [
			{
				name: 'Messages Events',
				value: 'messages',
				description:
					'Message webhooks. Payload format: <a href="' +
					WHAPI_DOC_URLS.webhooksMessages +
					'" target="_blank">incoming message</a>.',
			},
			{
				name: 'Groups Events',
				value: 'groups',
				description:
					'Group webhooks. Payload format: <a href="' +
					WHAPI_DOC_URLS.webhooksGroups +
					'" target="_blank">groups webhook</a>.',
			},
		],
	},
];
