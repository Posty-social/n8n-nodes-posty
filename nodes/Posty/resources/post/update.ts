import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestOptions,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { APPROVAL_MODE_OPTIONS, POST_STATUS_OPTIONS } from '../../shared/constants';
import { toIsoString } from '../../shared/utils';

export const postUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['post'], operation: ['update'] } },
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
				displayName: 'Clear Scheduled Time',
				name: 'clearScheduledAt',
				type: 'boolean',
				default: false,
				description: 'Whether to remove the scheduled time from the post',
			},
			{
				displayName: 'Scheduled At',
				name: 'scheduledAt',
				type: 'dateTime',
				default: '',
				description: 'New time the post should be published',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: POST_STATUS_OPTIONS,
				default: 'draft',
				description:
					'Move the post to this status. Only valid transitions are accepted; use the approval and publish operations for reviewed workflows.',
			},
		],
	},
];

export async function postUpdatePreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const node = this.getNode();
	const fields = this.getNodeParameter('updateFields', {}) as IDataObject;
	const body: IDataObject = {};

	if (typeof fields.status === 'string' && fields.status !== '') {
		body.status = fields.status;
	}
	if (typeof fields.approvalMode === 'string' && fields.approvalMode !== '') {
		body.approvalMode = fields.approvalMode;
	}
	if (fields.clearScheduledAt === true) {
		body.scheduledAt = null;
	} else {
		const scheduledAt = toIsoString(fields.scheduledAt, node, 'Scheduled At');
		if (scheduledAt) {
			body.scheduledAt = scheduledAt;
		}
	}

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(node, 'Add at least one field under "Update Fields"');
	}

	return { ...requestOptions, body };
}
