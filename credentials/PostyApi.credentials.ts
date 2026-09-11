import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class PostyApi implements ICredentialType {
	name = 'postyApi';

	displayName = 'Posty API';

	documentationUrl = 'https://github.com/Posty-social/n8n-nodes-posty?tab=readme-ov-file#credentials';

	icon: Icon = { light: 'file:../nodes/Posty/posty.svg', dark: 'file:../nodes/Posty/posty.dark.svg' };

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'pk_live_...',
			description:
				'Workspace-scoped API key created in your Posty workspace settings. All requests act on that workspace.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.posty.social',
			description: 'Only change this when pointing at a non-production Posty API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{ ($credentials.baseUrl || "https://api.posty.social").replace(/[/]+$/, "") }}',
			url: '/v1/workspaces',
			method: 'GET',
		},
	};
}
