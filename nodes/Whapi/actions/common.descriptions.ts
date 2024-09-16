/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import { NodeConnectionType, type INodeTypeDescription } from 'n8n-workflow';

import * as message from './message/Message.resource';
import * as contact from './contact/Contact.resource';

export const versionDescription: INodeTypeDescription = {
	displayName: 'whapi',
	name: 'whapi',
	icon: 'file:whapi.svg',
	group: ['input'],
	version: [1],
	subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
	description: 'Use whapi channel services',
	defaults: {
		name: 'whapi',
	},
	inputs: [NodeConnectionType.Main],
	outputs: ['main'],
	credentials: [
		{
			name: 'whapiChannelApi',
			required: true,
			displayOptions: {
				show: {
					authentication: ['whapiChannelApi'],
				},
			},
		}
	],
	properties: [
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'options',
			options: [
				{
					name: 'Access Token',
					value: 'whapiChannelApi',
				}
			],
			default: 'whapiChannelApi',
		},
		{
			displayName: 'Resource',
			name: 'resource',
			type: 'options',
			noDataExpression: true,
			options: [
				{
					name: 'Message',
					value: 'message',
				},
				{
					name: 'Contact',
					value: 'contact',
				}
			],
			default: 'message',
		},
		...message.description,
		...contact.description
	],
};
