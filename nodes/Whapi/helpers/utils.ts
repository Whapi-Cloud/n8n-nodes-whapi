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
	} catch (err) {}

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray({ error: error.message, description }),
		{ itemData: { item: i } },
	);
}


