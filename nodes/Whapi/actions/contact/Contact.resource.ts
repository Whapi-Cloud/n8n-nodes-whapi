import type { INodeProperties } from 'n8n-workflow';

import { WHAPI_DOC_URLS } from '../../helpers/documentation';
import * as check from './check.operation';
import * as list from './list.operation';
import * as get from './get.operation';
import * as add from './add.operation';
import * as edit from './edit.operation';
import * as deleteContact from './delete.operation';
import * as getLidById from './getLidById.operation';
import * as getPhoneByLid from './getPhoneByLid.operation';

export { check, list, get, add, edit, getLidById, getPhoneByLid };
export { deleteContact as delete };

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Add Contact',
				value: 'add',
				description:
					'Add or update a contact in the address book. See <a href="' +
					WHAPI_DOC_URLS.addContact +
					'" target="_blank">add contact</a>.',
				action: 'Add a contact',
			},
			{
				name: 'Check Contact',
				value: 'check',
				description:
					'Check whether a phone number is registered on WhatsApp. See <a href="' +
					WHAPI_DOC_URLS.checkContact +
					'" target="_blank">check if a number has WhatsApp</a>.',
				action: 'Check contact',
			},
			{
				name: 'Delete Contact',
				value: 'delete',
				description:
					'Remove a contact from the address book. See <a href="' +
					WHAPI_DOC_URLS.deleteContact +
					'" target="_blank">delete contact</a>.',
				action: 'Delete a contact',
			},
			{
				name: 'Edit Contact',
				value: 'edit',
				description:
					'Edit a contact name in the address book. See <a href="' +
					WHAPI_DOC_URLS.editContact +
					'" target="_blank">edit contact</a>.',
				action: 'Edit a contact',
			},
			{
				name: 'Get Contact',
				value: 'get',
				description:
					'Get contact info by ID. See <a href="' +
					WHAPI_DOC_URLS.getContact +
					'" target="_blank">get contact</a>.',
				action: 'Get a contact',
			},
			{
				name: 'Get Contacts',
				value: 'list',
				description:
					'List contacts in the address book. See <a href="' +
					WHAPI_DOC_URLS.getContacts +
					'" target="_blank">get contacts</a>.',
				action: 'Get contacts',
			},
			{
				name: 'Get LID by ID',
				value: 'getLidById',
				description:
					'Get Linked ID (LID) for a contact ID. See <a href="' +
					WHAPI_DOC_URLS.getLidById +
					'" target="_blank">get LID by ID</a>.',
				action: 'Get LID by ID',
			},
			{
				name: 'Get Phone Number by LID',
				value: 'getPhoneByLid',
				description:
					'Resolve phone number or WhatsApp ID from a LID. See <a href="' +
					WHAPI_DOC_URLS.getPhoneByLid +
					'" target="_blank">get phone number by LID</a>.',
				action: 'Get phone number by LID',
			},
		],
		default: 'list',
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
	},
	...check.description,
	...list.description,
	...get.description,
	...add.description,
	...edit.description,
	...deleteContact.description,
	...getLidById.description,
	...getPhoneByLid.description,
];