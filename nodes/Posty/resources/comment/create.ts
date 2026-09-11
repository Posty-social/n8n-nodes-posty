import type { INodeProperties } from 'n8n-workflow';

const show = { resource: ['comment'], operation: ['create'] };

export const commentCreateDescription: INodeProperties[] = [
	{
		displayName: 'Comment',
		name: 'commentBody',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		description: 'Text of the comment (up to 10,000 characters)',
		displayOptions: { show },
		routing: { send: { type: 'body', property: 'body' } },
	},
	{
		displayName: 'Is Change Request',
		name: 'isChangeRequest',
		type: 'boolean',
		default: false,
		description: 'Whether to flag the comment as a change request on the post',
		displayOptions: { show },
		routing: { send: { type: 'body', property: 'isChangeRequest' } },
	},
];
