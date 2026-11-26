import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { parseError, prepareErrorData } from '../../helpers/utils';

export async function executeWhapiItems(
	this: IExecuteFunctions,
	request: (itemIndex: number) => Promise<IDataObject>,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const responseData = await request(i);
			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData),
				{ itemData: { item: i } },
			);
			returnData.push(...executionData);
		} catch (error) {
			const parsedError = parseError(this.getNode(), error, i);

			if (this.continueOnFail()) {
				returnData.push(...prepareErrorData.call(this, parsedError, i));
			} else {
				throw parsedError;
			}
		}
	}

	return [returnData];
}