import type { INodeProperties } from 'n8n-workflow';

/** Official Whapi documentation URLs used in node UI and codex. */
export const WHAPI_DOC_URLS = {
	apiReference: 'https://whapi.cloud/docs',
	sending: 'https://support.whapi.cloud/help-desk/sending/introduction',
	sendingMedia:
		'https://support.whapi.cloud/help-desk/sending/send-video-audio-image-document',
	checkContact:
		'https://support.whapi.cloud/help-desk/faq/checking-if-the-number-has-whatsapp',
	getMessage:
		'https://support.whapi.cloud/help-desk/receiving/http-api/retrieve-a-specific-users-chat-history',
	messageResync:
		'https://support.whapi.cloud/help-desk/receiving/http-api/restoring-missing-messages-using-resync',
	webhooksOverview:
		'https://support.whapi.cloud/help-desk/receiving/webhooks/incoming-webhooks-format',
	webhooksMessages:
		'https://support.whapi.cloud/help-desk/receiving/webhooks/incoming-webhooks-format/incoming-message',
	webhooksGroups:
		'https://support.whapi.cloud/help-desk/receiving/webhooks/incoming-webhooks-format/groups',
	panelChannels: 'https://panel.whapi.cloud/',
} as const;

/** Renders a non-blocking documentation hint in the node parameter panel. */
export function docNotice(
	name: string,
	html: string,
	displayOptions?: INodeProperties['displayOptions'],
): INodeProperties {
	return {
		displayName: html,
		name,
		type: 'notice',
		default: '',
		...(displayOptions ? { displayOptions } : {}),
	};
}
