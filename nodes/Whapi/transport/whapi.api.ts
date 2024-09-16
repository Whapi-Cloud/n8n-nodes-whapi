import type {
	IDataObject,
	IExecuteFunctions,
	IPollFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IRequestOptions, IHookFunctions, IWebhookFunctions,
	IHttpRequestOptions
}
	from 'n8n-workflow';
import type {
	Settings
} from '../types';
import {ApplicationError} from 'n8n-workflow';

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
		const response = await this.helpers.httpRequestWithAuthentication.call(this, authenticationMethod, options);

		return response;
	} catch (error) {
		throw new ApplicationError(error.message);
	}

}


/**
 * Make an API request to Whapi
 *
 */
export async function settingsRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	body: IDataObject = {},
	query?: IDataObject,
	uri?: string,
	option: IDataObject = {},
):Promise<Settings> {
	query = query || {};

	const options: IRequestOptions = {
		headers: {},
		method,
		body,
		qs: query,
		uri: uri || `https://gate.whapi.cloud/settings`,
		useQuerystring: false,
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
		const response = await this.helpers.requestWithAuthentication.call(this, authenticationMethod, options);

		return response.body || {success: true};
	} catch (error) {
		throw new ApplicationError(error.message);
	}

}
