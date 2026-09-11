import type { INodeProperties } from 'n8n-workflow';
import { MEDIA_CONTENT_TYPE_OPTIONS } from '../../shared/constants';

const show = { resource: ['media'], operation: ['createUpload'] };

export const mediaCreateUploadDescription: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		required: true,
		description: 'Name shown in the media library (up to 500 characters)',
		displayOptions: { show },
		routing: { send: { type: 'body', property: 'title' } },
	},
	{
		displayName: 'Content Type',
		name: 'contentType',
		type: 'options',
		options: MEDIA_CONTENT_TYPE_OPTIONS,
		default: 'image/jpeg',
		required: true,
		description: 'MIME type of the file that will be uploaded',
		displayOptions: { show },
		routing: { send: { type: 'body', property: 'contentType' } },
	},
	{
		displayName: 'Size (Bytes)',
		name: 'sizeBytes',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 1,
		required: true,
		description: 'Exact size of the file in bytes',
		displayOptions: { show },
		routing: { send: { type: 'body', property: 'sizeBytes' } },
	},
];
