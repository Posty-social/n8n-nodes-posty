import type { INodeProperties } from "n8n-workflow";

import { cursorPaginationProperties } from "../../shared/pagination";

export const commentGetAllDescription: INodeProperties[] = [
  ...cursorPaginationProperties("comment", "getAll"),
];
