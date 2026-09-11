import type { INodeProperties } from "n8n-workflow";

import { channelIdProperty } from "../../shared/properties";

export const channelGetDescription: INodeProperties[] = [
  channelIdProperty({
    displayOptions: { show: { resource: ["channel"], operation: ["get"] } },
  }),
];
