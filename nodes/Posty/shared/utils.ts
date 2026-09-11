import type {
	IDataObject,
	INode,
	IPostReceiveRootProperty,
	IPostReceiveSet,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/** Unwraps `{ object: 'list', data: [...] }` responses into one item per entry. */
export const unwrapListData: IPostReceiveRootProperty = {
	type: 'rootProperty',
	properties: { property: 'data' },
};

/** The API answers deletes with an empty 204; give the workflow something to branch on. */
export const successOutput: IPostReceiveSet = {
	type: 'set',
	properties: { value: '={{ { "success": true } }}' },
};

/** Accepts a comma/newline separated string or an array (from an expression). */
export function parseIdList(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.map((entry) => String(entry).trim()).filter((entry) => entry !== '');
	}
	if (typeof value === 'string') {
		return value
			.split(/[\n,]/)
			.map((entry) => entry.trim())
			.filter((entry) => entry !== '');
	}
	return [];
}

/** Accepts a JSON string or an already-parsed object; empty input yields undefined. */
export function parseJsonObject(
	value: unknown,
	node: INode,
	label: string,
): IDataObject | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			throw new NodeOperationError(node, `${label} is not valid JSON`);
		}
	}
	if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
		throw new NodeOperationError(node, `${label} must be a JSON object`);
	}
	if (Object.keys(parsed as object).length === 0) {
		return undefined;
	}
	return parsed as IDataObject;
}

/** Normalises n8n date-time parameter values to the RFC 3339 form the API expects. */
export function toIsoString(value: unknown, node: INode, label: string): string | undefined {
	if (value === undefined || value === null || value === '') {
		return undefined;
	}
	const date = new Date(value as string | number | Date);
	if (Number.isNaN(date.getTime())) {
		throw new NodeOperationError(node, `${label} is not a valid date`);
	}
	return date.toISOString();
}
