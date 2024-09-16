import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { WhapiType } from './node.type';

import * as message from './message/Message.resource';
import * as contact from './contact/Contact.resource';

export async function router(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	let returnData: INodeExecutionData[][] = [];

	const resource = this.getNodeParameter<WhapiType>('resource', 0);
	const operation = this.getNodeParameter('operation', 0);

	const whapiNodeData = {
		resource,
		operation,
	} as WhapiType;

	try {
		switch (whapiNodeData.resource) {
			case 'message':
				returnData = await message[whapiNodeData.operation].execute.call(this);
				break;
			case 'contact':
				returnData = await contact[whapiNodeData.operation].execute.call(this);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} catch (error) {
		if (
			error.description &&
			(error.description as string).includes('cannot accept the provided value')
		) {
			error.description = `${error.description}. Consider using 'Typecast' option`;
		}
		throw error;
	}

	return returnData;
}
