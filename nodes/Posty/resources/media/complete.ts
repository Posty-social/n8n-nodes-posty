import type { INodeProperties } from 'n8n-workflow';

export const mediaCompleteDescription: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['media'], operation: ['complete'] } },
		options: [
			{
				displayName: 'Duration (Seconds)',
				name: 'duration',
				type: 'number',
				default: 0,
				description: 'Length of the video in seconds, if known',
				routing: { send: { type: 'body', property: 'duration' } },
			},
			{
				displayName: 'ETag',
				name: 'etag',
				type: 'string',
				default: '',
				description: 'ETag returned by the storage PUT, used to deduplicate identical files',
				routing: { send: { type: 'body', property: 'etag' } },
			},
			{
				displayName: 'Height (Pixels)',
				name: 'height',
				type: 'number',
				default: 0,
				description: 'Height of the image or video, if known',
				routing: { send: { type: 'body', property: 'height' } },
			},
			{
				displayName: 'Width (Pixels)',
				name: 'width',
				type: 'number',
				default: 0,
				description: 'Width of the image or video, if known',
				routing: { send: { type: 'body', property: 'width' } },
			},
		],
	},
];
