import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';
import {
	getMethodEndpoint,
	parseError,
	prepareErrorData,
	updateDisplayOptions,
} from '../../helpers/utils';
import { apiRequest } from '../../transport/whapi.api';

const properties: INodeProperties[] = [
	{
		displayName: 'Recipient',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		description:
			'Use the phone number or Chat ID of the contact/group/channel to which you want to send the message. Use Get groups to get the group ID.',
	},
	{
		displayName: 'Message Type',
		name: 'messageType',
		type: 'options',
		options: [
			{
				name: 'Audio',
				value: 'audio',
			},
			{
				name: 'Contact',
				value: 'contact',
			},
			{
				name: 'Document',
				value: 'document',
			},
			{
				name: 'Image',
				value: 'image',
			},
			{
				name: 'Text',
				value: 'text',
			},
			{
				name: 'Video',
				value: 'video',
			},
		],
		default: 'text',
		required: true,
		description: 'Type of the message',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		required: true,
		displayOptions: {
			hide: {
				messageType: ['video', 'document', 'image', 'audio'],
			},
		},
		default: '',
		description: 'Message text',
	},
	{
		displayName: 'Media String',
		name: 'media',
		type: 'string',
		required: true,
		displayOptions: {
			hide: {
				messageType: ['text'],
			},
		},
		default: '',
		description:
			'String representation of media. It can be URL to source, media ID of previously uploaded media file or base-64 string.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Typing Time',
				name: 'typing_time',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 60,
				},
				default: 0,
				description: 'Time in seconds to simulate typing',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				description: 'Caption for media file',
				displayOptions: {
					hide: {
						'/messageType': ['text', 'audio'],
					},
				},
			},
		],
	},
];

const displayOptions = {
	show: {
		resource: ['message'],
		operation: ['send'],
	},
};

export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const messageType = this.getNodeParameter('messageType', i) as string;
			const endpoint = `messages/${getMethodEndpoint(messageType)}`;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			const processed: IDataObject = {
				to: this.getNodeParameter('to', i),
			};

			const body = this.getNodeParameter('body', i, '') as string;
			if (body !== '') {
				processed.body = body;
			}

			const media = this.getNodeParameter('media', i, '') as string;
			if (media !== '') {
				processed.media = media;
			}

			if (additionalFields.typing_time !== undefined && additionalFields.typing_time !== '') {
				processed.typing_time = additionalFields.typing_time;
			}
			if (additionalFields.caption) {
				processed.caption = additionalFields.caption;
			}

			const responseData = await apiRequest.call(
				this,
				'POST',
				endpoint,
				processed,
				undefined,
				undefined,
				{},
				i,
			);
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		} catch (error) {
			const parsedError = parseError(this.getNode(), error, i);

			if (this.continueOnFail()) {
				returnData.push(...prepareErrorData.call(this, parsedError, i));
			} else {
				throw parsedError;
			}
		}
	}

	return [returnData];
}
