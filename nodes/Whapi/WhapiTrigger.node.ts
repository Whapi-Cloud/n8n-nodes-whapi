import {
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData
} from 'n8n-workflow';


import { WebhookEvent, Webhook, WebhookModeEnum} from './types';
import {settingsRequest} from './transport';

import {whapiTriggerDescription} from './trigger/WhapiTriggerDescription';

export class WhapiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whapi Trigger',
		name: 'whapiTrigger',
		icon: 'file:Whapi.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle Whapi events via webhooks',
		defaults: {
			name: 'Whapi Trigger',
		},
		inputs: [],
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
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
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
					}
				],
				default: 'whapiChannelApi',
			},
			...whapiTriggerDescription,
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const settings = await settingsRequest.call(this, 'GET');
				const webhooks = settings.webhooks && settings.webhooks.find(
					(webhook) => webhook.url === webhookUrl
				);
				return !!webhooks;

			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				try {
					const settings = await settingsRequest.call(this, 'GET');

					const updates = this.getNodeParameter('updates', []) as IDataObject[];

					const eventMethods = [
						'put', 'post', 'delete', 'patch'
					]

					let events = [];
					for (let type of updates) {
						for (let method of eventMethods) {
							events.push({type, method} as
								unknown as WebhookEvent
							)
						}
					}

					let newHook: Webhook = {
						url: webhookUrl,
						events,
						mode: WebhookModeEnum.body
					};

					settings.webhooks = settings.webhooks && settings.webhooks.filter(
						(webhook: Webhook) => {
							return webhook.url != webhookUrl
						}).concat(newHook) || [newHook];


					await settingsRequest.call(this, 'PATCH', settings);

					return true;
				} catch (e) {
					console.log(e)
				}
				return false;

			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				try {
					const settings = await settingsRequest.call(this, 'GET');
					settings.webhooks = settings.webhooks && settings.webhooks.filter(
						(webhook: Webhook) => {
							return webhook.url != webhookUrl
						}) || [];


					await settingsRequest.call(this, 'PATCH', {
						settings
					});

					return true;
				} catch (e) {
					console.log(e)
				}
				return false;

			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return {
			workflowData: [this.helpers.returnJsonArray(this.getBodyData())],
		};

	}
}
