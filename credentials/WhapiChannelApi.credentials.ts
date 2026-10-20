import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WhapiChannelApi implements ICredentialType {
	name = 'whapiChannelApi';
	displayName = 'Whapi API';
	documentationUrl = 'https://whapi.cloud/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'Access Token',
			type: 'string',
			typeOptions: { password: true },
			name: 'channelApi',
			default: '',
			required: true,
			description:
				'Channel token from <a href="https://panel.whapi.cloud/" target="_blank">Whapi Panel</a>. See the <a href="https://whapi.cloud/docs" target="_blank">API documentation</a> for authorization.',
		},
		{
			displayName: 'Channel ID',
			type: 'string',
			name: 'channelId',
			default: '',
			required: false,
			description:
				'Optional. Channel ID from the channel URL: panel.whapi.cloud/channels/{channel-id}',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.channelApi}}',
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://gate.whapi.cloud',
			url: '/limits',
		},
	};
}
