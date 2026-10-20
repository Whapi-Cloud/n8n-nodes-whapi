import {
	type IDataObject,
	type IHookFunctions,
	type INodeType,
	type INodeTypeDescription,
	type IWebhookFunctions,
	type IWebhookResponseData
} from 'n8n-workflow';


import { WHAPI_ICON } from './constants';
import { WebhookEvent, Webhook, WebhookModeEnum, EventMethodEnum, EventTypeEnum} from './types';
import {settingsRequest} from './transport';

import {whapiTriggerDescription} from './trigger/WhapiTriggerDescription';

export class WhapiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Whapi Trigger',
		name: 'whapiTrigger',
		icon: WHAPI_ICON,
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["updates"].length ? $parameter["updates"].join(", ") : "events"}}',
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
				const webhookUrl = this.getNodeWebhookUrl('default');
				const settings = await settingsRequest.call(this, 'GET');
				const existingWebhook = settings.webhooks?.find(
					(webhook) => webhook.url === webhookUrl,
				);

				if (!existingWebhook) {
					return false;
				}

				const updates = this.getNodeParameter('updates', []) as EventTypeEnum[];
				const eventMethods = [
					EventMethodEnum.put,
					EventMethodEnum.post,
					EventMethodEnum.delete,
					EventMethodEnum.patch,
				];
				const expectedEvents: WebhookEvent[] = updates.flatMap((type) =>
					eventMethods.map((method) => ({ type, method })),
				);
				const existingEvents = existingWebhook.events ?? [];
				const eventsMatch =
					existingEvents.length === expectedEvents.length &&
					expectedEvents.every((expectedEvent) =>
						existingEvents.some(
							(existingEvent) =>
								existingEvent.type === expectedEvent.type &&
								existingEvent.method === expectedEvent.method,
						),
					);
				
				return (
					existingWebhook.mode === WebhookModeEnum.body &&
					eventsMatch
				);
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

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
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const settings = await settingsRequest.call(this, 'GET');
			
				settings.webhooks = settings.webhooks?.filter(
					(webhook) => webhook.url !== webhookUrl,
				) ?? [];
			
				await settingsRequest.call(this, 'PATCH', settings);
			
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		return {
			workflowData: [this.helpers.returnJsonArray(this.getBodyData())],
		};

	}
}
