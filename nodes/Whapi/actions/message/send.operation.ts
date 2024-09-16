import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';
import {
	getMethodEndpoint,
	updateDisplayOptions
} from '../../helpers/utils';
import {apiRequest} from '../../transport/whapi.api';

const properties: INodeProperties[] = [
	{
		displayName: 'Recipient',
		name: 'to',
		type: 'string',
		required: true,
		default: '',
		description: 'Use the phone number or Chat ID of the contact/group/channel to which you want to send the message. Use Get groups to get the group ID.',
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
			}
		],
		default: 'text',
		required: true,
		description: 'Type of the message'
	},
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
		displayName: 'Ephemeral',
		name: 'ephemeral',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 604800,
		},
		default: '',
		description: 'Time in seconds for the message to be deleted. The Disappearing messages setting should be enabled in the chat where you are sending this message.',
	},
	/*{
		displayName: 'Mentions',
		name: 'to',
		type: 'collection',
		default: [],
		description: 'Use the phone numbers of the mentioned users',
	},*/
	{
		displayName: 'Body',
		name: 'body',
		type: 'string',
		displayOptions: {
			hide: {
				messageType: ['video', 'document', 'image', 'audio']
			}
		},
		default: '',
		description: 'Message text',
	},
	{
		displayName: 'Media String',
		name: 'media',
		type: 'string',
		displayOptions: {
			hide: {
				messageType: ['text']
			},
		},
		default: '',
		description: 'String representation of media. It can be URL to source, media ID of previously uploaded media file or base-64 string.',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		displayOptions: {
			hide: {
				messageType: ['text', 'audio']
			},
		},
		default: '',
		description: 'Caption for media file',
	}
];

const displayOptions = {
	show: {
		resource: ['message'],
		operation: ['send'],
	},
};


export const description = updateDisplayOptions(displayOptions, properties);

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const body = (({ operation, messageType, authentication, ...o }) => o)(this.getExecuteData().node.parameters)
	const returnData: INodeExecutionData[] = [];
	const type = this.getNodeParameter('messageType', 0)!.toString();
	const endpoint = `messages//${getMethodEndpoint(type)}`;


	console.dir({body: body}, {depth: 10})
		try {

			let responseData = await apiRequest.call(this, 'POST', endpoint, body,{}, );
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject),
				{itemData: {item: 0}},
			);

			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				const executionErrorData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({error: error.message}),
					{itemData: {item: 0}},
				);
				returnData.push(...executionErrorData);
			}
			throw error;
		}



	return [returnData];
}

