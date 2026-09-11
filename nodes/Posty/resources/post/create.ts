import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { APPROVAL_MODE_OPTIONS } from '../../shared/constants';
import { channelIdProperty } from '../../shared/properties';
import { parseIdList, parseJsonObject, toIsoString } from '../../shared/utils';

const show = { resource: ['post'], operation: ['create'] };

interface ContentEntry {
	channelId?: string;
	body?: string;
	mediaIds?: string | string[];
	metadata?: string | IDataObject;
}

export const postCreateDescription: INodeProperties[] = [
	{
		displayName: 'Content',
		name: 'content',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		placeholder: 'Add Channel',
		default: {},
		required: true,
		description: 'One entry per channel the post should go out on',
		displayOptions: { show },
		options: [
			{
				displayName: 'Channel',
				name: 'items',
				values: [
					channelIdProperty(),
					{
						displayName: 'Body',
						name: 'body',
						type: 'string',
						typeOptions: { rows: 4 },
						default: '',
						description: 'Text of the post for this channel',
					},
					{
						displayName: 'Media IDs',
						name: 'mediaIds',
						type: 'string',
						default: '',
						description:
							'Comma-separated IDs of media in the workspace library to attach. Media must have status "ready".',
					},
					{
						displayName: 'Metadata',
						name: 'metadata',
						type: 'json',
						default: '{}',
						description:
							'Platform-specific settings as a flat JSON object, for example a Pinterest board ID or YouTube privacy status. Values may be strings, numbers, booleans or string arrays.',
					},
				],
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show },
		options: [
			{
				displayName: 'Approval Mode',
				name: 'approvalMode',
				type: 'options',
				options: APPROVAL_MODE_OPTIONS,
				default: 'none',
				description: 'Review process the post must pass before it can be published',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'dateTime',
				default: '',
				description: 'When the post should be published. Leave empty to create a draft.',
			},
		],
	},
];

export async function postCreatePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const node = this.getNode();
	const entries = this.getNodeParameter('content.items', []) as ContentEntry[];
	if (!Array.isArray(entries) || entries.length === 0) {
		throw new NodeOperationError(node, 'Add at least one channel under "Content"');
	}

	const content = entries.map((entry, index) => {
		const label = `Content entry ${index + 1}`;
		const channelId = typeof entry.channelId === 'string' ? entry.channelId.trim() : '';
		if (channelId === '') {
			throw new NodeOperationError(node, `${label} has no channel selected`);
		}
		const item: IDataObject = { channelId };
		if (typeof entry.body === 'string' && entry.body !== '') {
			item.body = entry.body;
		}
		const mediaIds = parseIdList(entry.mediaIds);
		if (mediaIds.length > 0) {
			item.mediaIds = mediaIds;
		}
		const metadata = parseJsonObject(entry.metadata, node, `${label} metadata`);
		if (metadata) {
			item.metadata = metadata;
		}
		return item;
	});

	const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;
	const body: IDataObject = { content };
	if (typeof additionalFields.approvalMode === 'string' && additionalFields.approvalMode !== '') {
		body.approvalMode = additionalFields.approvalMode;
	}
	const scheduledAt = toIsoString(additionalFields.scheduledAt, node, 'Scheduled At');
	if (scheduledAt) {
		body.scheduledAt = scheduledAt;
	}

	return { ...requestOptions, body };
}
