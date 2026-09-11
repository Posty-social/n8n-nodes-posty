import type { INodeProperties } from 'n8n-workflow';
import { postIdProperty } from '../../shared/properties';
import { successOutput, unwrapListData } from '../../shared/utils';
import { commentCreateDescription } from './create';
import { commentDeleteDescription } from './delete';
import { commentGetAllDescription } from './getAll';

export const commentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: { resource: ['comment'] },
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a comment',
				description: 'Add a comment to a post',
				routing: {
					request: { method: 'POST', url: '=/v1/posts/{{$parameter.postId}}/comments' },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a comment',
				description: 'Delete a comment from a post',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/v1/posts/{{$parameter.postId}}/comments/{{$parameter.commentId}}',
					},
					output: { postReceive: [successOutput] },
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many comments',
				description: 'List the comments on a post',
				routing: {
					request: { method: 'GET', url: '=/v1/posts/{{$parameter.postId}}/comments' },
					output: { postReceive: [unwrapListData] },
				},
			},
		],
		default: 'getAll',
	},
	postIdProperty({
		description: 'ID of the post the comments belong to',
		displayOptions: { show: { resource: ['comment'] } },
	}),
	...commentCreateDescription,
	...commentDeleteDescription,
	...commentGetAllDescription,
];
