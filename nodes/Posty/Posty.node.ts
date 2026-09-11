import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { getChannels } from './methods/loadOptions';
import { channelDescription } from './resources/channel';
import { commentDescription } from './resources/comment';
import { mediaDescription } from './resources/media';
import { postDescription } from './resources/post';
import { postContentDescription } from './resources/postContent';
import { workspaceDescription } from './resources/workspace';

export class Posty implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Posty',
		name: 'posty',
		icon: { light: 'file:posty.svg', dark: 'file:posty.dark.svg' },
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Schedule and publish social media posts with Posty',
		defaults: {
			name: 'Posty',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'postyApi', required: true }],
		requestDefaults: {
			baseURL: '={{ ($credentials.baseUrl || "https://api.posty.social").replace(/[/]+$/, "") }}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Channel', value: 'channel' },
					{ name: 'Comment', value: 'comment' },
					{ name: 'Media', value: 'media' },
					{ name: 'Post', value: 'post' },
					{ name: 'Post Content', value: 'postContent' },
					{ name: 'Workspace', value: 'workspace' },
				],
				default: 'post',
			},
			...channelDescription,
			...commentDescription,
			...mediaDescription,
			...postDescription,
			...postContentDescription,
			...workspaceDescription,
		],
	};

	methods = {
		loadOptions: {
			getChannels,
		},
	};
}
