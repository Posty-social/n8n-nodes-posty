import type { INodeProperties } from 'n8n-workflow';
import { POST_STATUS_OPTIONS } from '../../shared/constants';
import { cursorPaginationProperties } from '../../shared/pagination';
import { channelIdProperty } from '../../shared/properties';

const toIsoExpression = '={{ new Date($value).toISOString() }}';

export const postGetAllDescription: INodeProperties[] = [
	...cursorPaginationProperties('post', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['post'], operation: ['getAll'] } },
		options: [
			channelIdProperty({
				required: false,
				description:
					'Only return posts that target this channel. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				routing: { send: { type: 'query', property: 'channelId' } },
			}),
			{
				displayName: 'Created After',
				name: 'createdAtGte',
				type: 'dateTime',
				default: '',
				description: 'Only return posts created at or after this time',
				routing: { send: { type: 'query', property: 'createdAt_gte', value: toIsoExpression } },
			},
			{
				displayName: 'Created Before',
				name: 'createdAtLte',
				type: 'dateTime',
				default: '',
				description: 'Only return posts created at or before this time',
				routing: { send: { type: 'query', property: 'createdAt_lte', value: toIsoExpression } },
			},
			{
				displayName: 'Scheduled After',
				name: 'scheduledAtGte',
				type: 'dateTime',
				default: '',
				description: 'Only return posts scheduled at or after this time',
				routing: { send: { type: 'query', property: 'scheduledAt_gte', value: toIsoExpression } },
			},
			{
				displayName: 'Scheduled Before',
				name: 'scheduledAtLte',
				type: 'dateTime',
				default: '',
				description: 'Only return posts scheduled at or before this time',
				routing: { send: { type: 'query', property: 'scheduledAt_lte', value: toIsoExpression } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'multiOptions',
				options: POST_STATUS_OPTIONS,
				default: [],
				description: 'Only return posts in one of these statuses',
				routing: {
					send: {
						type: 'query',
						property: 'status',
						value: '={{ Array.isArray($value) ? $value.join(",") : $value }}',
					},
				},
			},
		],
	},
];
