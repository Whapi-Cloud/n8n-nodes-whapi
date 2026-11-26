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

const WHAPI_GATE_PREFIX = 'https://gate.whapi.cloud';

/** Builds a full gate URL from a path segment or an already-qualified gate URL. */
export function resolveWhapiGateUrl(pathOrUrl: string): string {
	const trimmed = pathOrUrl.trim();
	if (!trimmed) {
		throw new Error('API path is empty');
	}

	if (/^https?:\/\//i.test(trimmed)) {
		const withoutTrailingSlash = trimmed.replace(/\/+$/, '');
		if (!withoutTrailingSlash.toLowerCase().startsWith(WHAPI_GATE_PREFIX)) {
			throw new Error(
				`URL must start with ${WHAPI_GATE_PREFIX}/. Only Whapi gate endpoints are allowed.`,
			);
		}
		return trimmed;
	}

	return `${WHAPI_GATE_PREFIX}/${trimmed.replace(/^\/+/, '')}`;
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


