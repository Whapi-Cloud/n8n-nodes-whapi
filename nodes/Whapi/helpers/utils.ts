import { URL } from 'node:url';

import {

	IDataObject,
	IExecuteFunctions,
	IDisplayOptions,
	INodeProperties,
	INode,
	NodeApiError,
	JsonObject
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';


export function updateDisplayOptions(
	displayOptions: IDisplayOptions,
	properties: INodeProperties[],
) {
	return properties.map((nodeProperty) => {
		return {
			...nodeProperty,
			displayOptions: Object.assign({}, nodeProperty.displayOptions, displayOptions),
		};
	});
}


export function getMethodEndpoint(method: string
) {
	return method.replace('-', '/')
}

const WHAPI_GATE_HOST = 'gate.whapi.cloud';
const WHAPI_GATE_ORIGIN = `https://${WHAPI_GATE_HOST}`;

function parseWhapiGateAbsoluteUrl(raw: string): string {
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new Error('Path is not a valid URL');
	}

	if (parsed.protocol !== 'https:') {
		throw new Error(`Only HTTPS requests to ${WHAPI_GATE_HOST} are allowed`);
	}

	if (parsed.hostname.toLowerCase() !== WHAPI_GATE_HOST) {
		throw new Error(`URL host must be exactly ${WHAPI_GATE_HOST}`);
	}

	if (parsed.username || parsed.password) {
		throw new Error('URL must not include username or password');
	}

	if (parsed.port !== '') {
		throw new Error('URL must not include a custom port');
	}

	return parsed.href;
}

function resolveRelativeWhapiPath(path: string): string {
	if (path.includes('://') || path.includes('@') || path.includes('\\')) {
		throw new Error(
			'Use a relative gate path (e.g. chats) or a full https://gate.whapi.cloud/… URL without @ or backslashes',
		);
	}

	const relative = path.replace(/^\/+/, '');
	if (!relative) {
		throw new Error('API path is empty');
	}

	return `${WHAPI_GATE_ORIGIN}/${relative}`;
}

/** Builds a full gate URL from a path segment or an already-qualified gate URL. */
export function resolveWhapiGateUrl(pathOrUrl: string): string {
	const trimmed = pathOrUrl.trim();
	if (!trimmed) {
		throw new Error('API path is empty');
	}

	if (/^https?:\/\//i.test(trimmed)) {
		return parseWhapiGateAbsoluteUrl(trimmed);
	}

	return resolveRelativeWhapiPath(trimmed);
}


export const createSimplifyFunction =
	(includedFields: string[]) =>
		(item: IDataObject): IDataObject => {
			const result: IDataObject = {};

			for (const field of includedFields) {
				if (item[field] === undefined) continue;

				result[field] = item[field];
			}

			return result;
		};

export function parseError(
	node: INode,
	error: unknown,
	itemIndex?: number,
): NodeApiError | NodeOperationError {
	if (error instanceof NodeApiError || error instanceof NodeOperationError) {
		return error;
	}

	const errorObject: JsonObject =
		typeof error === 'object' && error !== null
			? error as JsonObject
			: { message: String(error) };

	return new NodeApiError(
		node,
		errorObject,
		itemIndex === undefined ? {} : { itemIndex },
	);
}

export function prepareErrorData(this: IExecuteFunctions, error: any, i: number) {
	let description = error.description;

	try {
		description = JSON.parse(error.description as string);
	} catch {
		// description is not JSON; keep the raw value
	}

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({ error: error.message, description }),
		{ itemData: { item: i } },
	);
}


