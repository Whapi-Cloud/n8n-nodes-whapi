import {
	IDataObject,
	IExecuteFunctions,
	IPollFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';
import type { Settings } from '../types';
import { parseError } from '../helpers/utils';

/**
 * Make an API request to Whapi
 *
 */
export async function apiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query?: IDataObject,
	url?: string,
	option: IDataObject = {},
) {
	query = query || {};

	const options: IHttpRequestOptions = {
		headers: {},
		method,
		body,
		qs: query,
		url: url || `https://gate.whapi.cloud/${endpoint}`,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			authenticationMethod,
			options,
		);
		return response;
	} catch (error) {
		throw parseError(this.getNode(), error);
	}
}

/**
 * Make an API request to Whapi settings (webhooks)
 */
export async function settingsRequest(
	this:
		| IHookFunctions
		| IExecuteFunctions
		| ILoadOptionsFunctions
		| IWebhookFunctions
		| IPollFunctions,
	method: IHttpRequestMethods,
	body: IDataObject = {},
	query?: IDataObject,
	url?: string,
	option: IDataObject = {},
): Promise<Settings> {
	query = query || {};

	const options: IHttpRequestOptions = {
		headers: {},
		method,
		body,
		qs: query,
		url: url || 'https://gate.whapi.cloud/settings',
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	const authenticationMethod = this.getNodeParameter('authentication', 0) as string;
	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			authenticationMethod,
			options,
		);
		return response;
	} catch (error) {
		throw parseError(this.getNode(), error);
	}
}
