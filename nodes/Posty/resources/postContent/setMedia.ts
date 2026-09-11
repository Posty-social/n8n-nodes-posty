import type { IExecuteSingleFunctions, IHttpRequestOptions, INodeProperties } from 'n8n-workflow';
import { parseIdList } from '../../shared/utils';

export const postContentSetMediaDescription: INodeProperties[] = [
	{
		displayName: 'Media IDs',
		name: 'mediaIds',
		type: 'string',
		default: '',
		description:
			'Comma-separated IDs of media to attach, in display order. Replaces the current attachments; leave empty to remove them all.',
		displayOptions: { show: { resource: ['postContent'], operation: ['setMedia'] } },
	},
];

export async function postContentSetMediaPreSend(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const mediaIds = parseIdList(this.getNodeParameter('mediaIds', ''));
	return { ...requestOptions, body: { mediaIds } };
}
