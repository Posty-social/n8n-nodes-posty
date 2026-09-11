import type {
	IDataObject,
	IExecuteSingleFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

export const DEFAULT_BASE_URL = 'https://api.posty.social';

type PostyContext = ILoadOptionsFunctions | IExecuteSingleFunctions;

export interface PostyListResponse<T> {
	object: 'list';
	data: T[];
	has_more: boolean;
	next_cursor: string | null;
}

export async function getBaseUrl(this: PostyContext): Promise<string> {
	const credentials = await this.getCredentials<{ baseUrl?: string }>('postyApi');
	const configured =
		typeof credentials.baseUrl === 'string' && credentials.baseUrl.trim() !== ''
			? credentials.baseUrl.trim()
			: DEFAULT_BASE_URL;
	return configured.replace(/\/+$/, '');
}

/**
 * Authenticated request against the Posty API, for use outside the declarative
 * routing (dynamic option loaders, pre-send and post-receive hooks).
 */
export async function postyApiRequest<T = IDataObject>(
	this: PostyContext,
	method: IHttpRequestMethods,
	endpoint: string,
	options: { body?: IDataObject; qs?: IDataObject } = {},
): Promise<T> {
	const baseUrl = await getBaseUrl.call(this);
	const requestOptions: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: { Accept: 'application/json' },
		json: true,
	};
	if (options.body !== undefined) {
		requestOptions.body = options.body;
	}
	if (options.qs !== undefined) {
		requestOptions.qs = options.qs;
	}
	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'postyApi',
		requestOptions,
	)) as T;
}

/** Walks every page of a cursor-paginated list endpoint. */
export async function postyApiRequestAllPages<T>(
	this: PostyContext,
	endpoint: string,
	qs: IDataObject = {},
): Promise<T[]> {
	const results: T[] = [];
	let cursor: string | undefined;
	do {
		const page = await postyApiRequest.call(this, 'GET', endpoint, {
			qs: { ...qs, limit: 100, ...(cursor ? { starting_after: cursor } : {}) },
		});
		const typed = page as unknown as PostyListResponse<T>;
		results.push(...typed.data);
		cursor = typed.has_more && typed.next_cursor ? typed.next_cursor : undefined;
	} while (cursor);
	return results;
}
