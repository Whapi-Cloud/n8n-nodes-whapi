import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { WHAPI_ICON } from './constants';
import { router } from './actions/router';
import * as message from './actions/message/Message.resource';
import * as contact from './actions/contact/Contact.resource';

export class Whapi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whapi',
		name: 'whapi',
		icon: WHAPI_ICON,
		group: ['input'],
		version: [1],
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Use whapi channel services',
		usableAsTool: true,
		defaults: {
			name: 'Whapi',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'whapiChannelApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['whapiChannelApi'],
					},
				},
			},
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
					},
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
					},
				],
				default: 'message',
			},
			...message.description,
			...contact.description,
		],
	};

	methods = {};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
