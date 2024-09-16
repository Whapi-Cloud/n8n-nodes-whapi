import type {

	IDataObject,
	IExecuteFunctions,
	IDisplayOptions,
	INodeProperties
} from 'n8n-workflow';
import { jsonParse, NodeOperationError } from 'n8n-workflow';


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

export function parseError(this: IExecuteFunctions, error: any, itemIndex = 0) {
	let errorData = error.cause.error;
	const errorOptions: IDataObject = { itemIndex };

	if (!errorData && error.description) {
		try {
			const errorString = (error.description as string).split(' - ')[1];
			if (errorString) {
				errorData = jsonParse(errorString);
			}
		} catch (err) {}
	}

	if (errorData?.message) {
		errorOptions.message = errorData.message;
	}

	return new NodeOperationError(this.getNode(), errorData || error, errorOptions);
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


