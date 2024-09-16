import type { AllEntities } from 'n8n-workflow';

type NodeMap = {
	message: 'get' | 'send' ;
	contact: 'check'  ;
};

export type WhapiType = AllEntities<NodeMap>;
