import type { INodeProperties } from 'n8n-workflow';

export const whapiTriggerDescription: INodeProperties[] = [
	{
		displayName: 'Trigger On',
		name: 'updates',
		type: 'multiOptions',
		required: true,
		default: [],
		options: [
			{
				name: 'Messages Events',
				value: 'messages',
			},
			{
				name: 'Groups Events',
				value: 'groups',
			}
		],
	},
];
