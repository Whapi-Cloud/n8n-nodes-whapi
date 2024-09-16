import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
	INodeTypeBaseDescription,
} from 'n8n-workflow';

import { versionDescription } from './actions/common.descriptions';
import { router } from './actions/router';

export class Whapi implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			...versionDescription,
		};
	}

	methods = {};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
