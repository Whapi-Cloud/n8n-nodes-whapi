import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	message: 'get' | 'send';
	contact:
		| 'check'
		| 'list'
		| 'get'
		| 'add'
		| 'edit'
		| 'delete'
		| 'getLidById'
		| 'getPhoneByLid';
	customApi: 'request';
};

export type WhapiType = AllEntities<NodeMap>;
