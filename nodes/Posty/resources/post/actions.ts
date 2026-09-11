import type { INodeProperties } from 'n8n-workflow';

/** Parameters for the review / publish actions (POST /v1/posts/{id}/actions). */
export const postActionsDescription: INodeProperties[] = [
	{
		displayName: 'Skip Approval',
		name: 'skipApproval',
		type: 'boolean',
		default: false,
		description:
			'Whether to bypass the review stages and move the post straight to approved. Requires the matching workspace permission.',
		displayOptions: { show: { resource: ['post'], operation: ['submit'] } },
		routing: { send: { type: 'body', property: 'skipApproval' } },
	},
	{
		displayName: 'Feedback',
		name: 'changeRequestBody',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		description: 'What needs to change. Added to the post as a change-request comment.',
		displayOptions: { show: { resource: ['post'], operation: ['requestChanges'] } },
		routing: { send: { type: 'body', property: 'body' } },
	},
	{
		displayName: 'Visibility',
		name: 'visibility',
		type: 'options',
		options: [
			{ name: 'Everyone (Including Clients)', value: 'all' },
			{ name: 'Team Only', value: 'team' },
		],
		default: 'team',
		description: 'Who can see the change-request comment',
		displayOptions: { show: { resource: ['post'], operation: ['requestChanges'] } },
		routing: { send: { type: 'body', property: 'visibility' } },
	},
	{
		displayName: 'Publish',
		name: 'publishAt',
		type: 'options',
		options: [
			{ name: 'At the Scheduled Time', value: 'scheduled' },
			{ name: 'Now', value: 'now' },
		],
		default: 'now',
		description: 'Whether to deliver immediately or lock the post in for its scheduled time',
		displayOptions: { show: { resource: ['post'], operation: ['publish'] } },
		routing: { send: { type: 'body', property: 'at' } },
	},
];
