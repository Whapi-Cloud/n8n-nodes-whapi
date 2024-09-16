import {
	type IDataObject
} from 'n8n-workflow';

/**
 *
 * @export
 * @interface Settings
 */
export interface Settings extends IDataObject{
	/**
	 * Backoff delay for a failed callback in milliseconds This setting is used to configure the amount of time the backoff delays before retrying a failed callback. The backoff delay increases linearly by this value each time a callback fails to get a HTTPS 200 OK response. The backoff delay is capped by the max_callback_backoff_delay_ms setting.
	 * @type {number}
	 * @memberof Settings
	 */
	callback_backoff_delay_ms?: number;
	/**
	 * Maximum delay for a failed callback in milliseconds
	 * @type {number}
	 * @memberof Settings
	 */
	max_callback_backoff_delay_ms?: number;
	/**
	 * Stores callbacks on disk until they are successfully acknowledged by the Webhook or not. Restart required.
	 * @type {boolean}
	 * @memberof Settings
	 */
	callback_persist?: boolean;
	/**
	 *
	 * @type {MediaSettings}
	 * @memberof Settings
	 */
	media?: MediaSettings;
	/**
	 *
	 * @type {Array<Webhook>}
	 * @memberof Settings
	 */
	webhooks?: Array<Webhook>;
	/**
	 * Use your Socks5 proxy if your account activity arouses suspicion from WhatsApp. This can help maintain anonymity and ensure smooth operation.
	 * @type {string}
	 * @memberof Settings
	 */
	proxy?: string;
	/**
	 * Service proxy for mobile authorization.
	 * @type {string}
	 * @memberof Settings
	 */
	mobile_proxy?: string;
	/**
	 * When true, API will not send online status to the server on connection. This will allow you to receive push notifications to devices connected to the number. Working after reconnect.
	 * @type {boolean}
	 * @memberof Settings
	 */
	offline_mode?: boolean;
	/**
	 * When true, all messages will be cached after the connection. If false, old messages will selectively not be cached, allowing large accounts to run faster. Working after reconnect.
	 * @type {boolean}
	 * @memberof Settings
	 */
	full_history?: boolean;
}

export interface MediaSettings {
	/**
	 * An array specifying which types of media to automatically download.
	 * @type {Array<string>}
	 * @memberof MediaSettings
	 */
	auto_download?: Array<MediaSettingsAutoDownloadEnum>;
	/**
	 * Set to true if you need to get avatars after channel authorization
	 * @type {boolean}
	 * @memberof MediaSettings
	 */
	init_avatars?: boolean;
}

export enum MediaSettingsAutoDownloadEnum {
	image = 'image',
	audio = 'audio',
	voice = 'voice',
	video = 'video',
	document = 'document',
	sticker = 'sticker'
}

export interface Webhook {
	/**
	 * Inbound and outbound notifications are routed to this URL.
	 * @type {string}
	 * @memberof Webhook
	 */
	url: string;
	/**
	 * Tracked events. <br/>"messages" - got new message/got offline messages/edit message/delete message;<br/>"statuses" - got message status/got offline message status;<br/>"chats" - got chat/chat update/chat remove;<br/>"contacts" - contact update;<br/>"presences" - got presences<br/>"groups" - new group/participants update/group update;<br/>"calls" - got call events<br/>labels" - new label/remove label<br/>"users" - login user/logout user<br/>"channel" - instance status changed/QR-code update<br/>"service" - special notifications<br/><br/>"message", "ack", "chat", "status" - is deprecated, use "messages", "statuses", "chats", "channel" instead.
	 * @type {Array<Event>}
	 * @memberof Webhook
	 */
	events?: Array<WebhookEvent>;
	/**
	 * Request method for sending hook.
	 * @type {string}
	 * @memberof Webhook
	 */
	mode?: WebhookModeEnum;
	/**
	 * Additional headers for webhook. Max 5 headers. <br/>Example: <br/>"Authorization - Bearer token" <br/>"Content-Type - application/json" <br/>"X-Header - value"
	 * @type {{ [key: string]: string; }}
	 * @memberof Webhook
	 */
	headers?: { [key: string]: string; };
}

export enum WebhookModeEnum {
	body = 'body',
	path = 'path',
	method = 'method'
}

export interface WebhookEvent {
	/**
	 *
	 * @type {string}
	 * @memberof Event
	 */
	type?: EventTypeEnum;
	/**
	 *
	 * @type {string}
	 * @memberof Event
	 */
	method?: EventMethodEnum;
}

export enum EventTypeEnum {
	messages = 'messages',
	statuses = 'statuses',
	chats = 'chats',
	contacts = 'contacts',
	groups = 'groups',
	presences = 'presences',
	calls = 'calls',
	channel = 'channel',
	users = 'users',
	labels = 'labels',
	service = 'service'
}

/**
 * @export
 * @enum {string}
 */
export enum EventMethodEnum {
	post = 'post',
	put = 'put',
	delete = 'delete',
	patch = 'patch'
}
