import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { WhapiType } from './node.type';
import { parseError } from '../helpers/utils';

import * as message from './message/Message.resource';
import * as contact from './contact/Contact.resource';
import * as customApi from './custom/Custom.resource';

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
			case 'customApi':
				returnData = await customApi[whapiNodeData.operation].execute.call(this);
				break;
			default:
				throw new NodeOperationError(
					this.getNode(),
					`The operation "${operation}" is not supported!`,
				);
		}
	} catch (error) {
		const nodeError = parseError(this.getNode(), error);
		if (
			nodeError.description &&
			String(nodeError.description).includes('cannot accept the provided value')
		) {
			nodeError.description = `${nodeError.description}. Check values match the Whapi API (recipient/chat ID, message ID, media URL or payload) and that expressions resolve to strings or numbers as required.`;
		}
		throw nodeError;
	}

	return returnData;
}
