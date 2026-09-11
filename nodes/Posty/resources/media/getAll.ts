import type { INodeProperties } from 'n8n-workflow';
import { MEDIA_CONTENT_TYPE_OPTIONS, MEDIA_STATUS_OPTIONS } from '../../shared/constants';
import { cursorPaginationProperties } from '../../shared/pagination';

export const mediaGetAllDescription: INodeProperties[] = [
	...cursorPaginationProperties('media', 'getAll'),
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['media'], operation: ['getAll'] } },
		options: [
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				options: MEDIA_CONTENT_TYPE_OPTIONS,
				default: 'image/jpeg',
				description: 'Only return media of this MIME type',
				routing: { send: { type: 'query', property: 'contentType' } },
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: MEDIA_STATUS_OPTIONS,
				default: 'ready',
				description: 'Only return media in this processing state',
				routing: { send: { type: 'query', property: 'status' } },
			},
		],
	},
];
