import type { INodeProperties } from 'n8n-workflow';
import { channelIdProperty, postIdProperty } from '../../shared/properties';
import { successOutput } from '../../shared/utils';
import { postContentSetMediaDescription, postContentSetMediaPreSend } from './setMedia';
import { postContentUpdateDescription, postContentUpdatePreSend } from './update';

const contentUrl = '=/v1/posts/{{$parameter.postId}}/content/{{$parameter.channelId}}';

export const postContentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['postContent'] },
		},
		options: [
			{
				name: 'Remove',
				value: 'remove',
				action: 'Remove a channel from a post',
				description: 'Remove the content for one channel so the post no longer targets it',
				routing: {
					request: { method: 'DELETE', url: contentUrl },
					output: { postReceive: [successOutput] },
				},
			},
			{
				name: 'Set Media',
				value: 'setMedia',
				action: 'Set the media of a post channel',
				description: 'Replace the media attached to the content for one channel',
				routing: {
					request: { method: 'PUT', url: `${contentUrl}/media` },
					send: { preSend: [postContentSetMediaPreSend] },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update the content of a post channel',
				description: 'Change the text or platform settings for one channel',
				routing: {
					request: { method: 'PATCH', url: contentUrl },
					send: { preSend: [postContentUpdatePreSend] },
				},
			},
		],
		default: 'update',
	},
	postIdProperty({
		displayOptions: { show: { resource: ['postContent'] } },
	}),
	channelIdProperty({
		displayOptions: { show: { resource: ['postContent'] } },
	}),
	...postContentUpdateDescription,
	...postContentSetMediaDescription,
];
