/// <reference lib="dom" />

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

function parseWhapiGateAbsoluteUrl(raw: string, node: INode, itemIndex?: number): string {
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		throw new NodeOperationError(node, 'Path is not a valid URL', { itemIndex });
	}

	if (parsed.protocol !== 'https:') {
		throw new NodeOperationError(
			node,
			`Only HTTPS requests to ${WHAPI_GATE_HOST} are allowed`,
			{ itemIndex },
		);
	}

	if (parsed.hostname.toLowerCase() !== WHAPI_GATE_HOST) {
		throw new NodeOperationError(node, `URL host must be exactly ${WHAPI_GATE_HOST}`, {
			itemIndex,
		});
	}

	if (parsed.username || parsed.password) {
		throw new NodeOperationError(node, 'URL must not include username or password', {
			itemIndex,
		});
	}

	if (parsed.port !== '') {
		throw new NodeOperationError(node, 'URL must not include a custom port', { itemIndex });
	}

	return parsed.href;
}

function resolveRelativeWhapiPath(path: string, node: INode, itemIndex?: number): string {
	if (path.includes('://') || path.includes('@') || path.includes('\\')) {
		throw new NodeOperationError(
			node,
			'Use a relative gate path (e.g. chats) or a full https://gate.whapi.cloud/… URL without @ or backslashes',
			{ itemIndex },
		);
	}

	const relative = path.replace(/^\/+/, '');
	if (!relative) {
		throw new NodeOperationError(node, 'API path is empty', { itemIndex });
	}

	return `${WHAPI_GATE_ORIGIN}/${relative}`;
}

/** Builds a full gate URL from a path segment or an already-qualified gate URL. */
export function resolveWhapiGateUrl(
	pathOrUrl: string,
	node: INode,
	itemIndex?: number,
): string {
	const trimmed = pathOrUrl.trim();
	if (!trimmed) {
		throw new NodeOperationError(node, 'API path is empty', { itemIndex });
	}

	if (/^https?:\/\//i.test(trimmed)) {
		return parseWhapiGateAbsoluteUrl(trimmed, node, itemIndex);
	}

	return resolveRelativeWhapiPath(trimmed, node, itemIndex);
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


