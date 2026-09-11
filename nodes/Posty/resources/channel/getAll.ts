import type { INodeProperties } from "n8n-workflow";

import {
  CHANNEL_STATUS_OPTIONS,
  PROVIDER_OPTIONS,
} from "../../shared/constants";
import { cursorPaginationProperties } from "../../shared/pagination";

export const channelGetAllDescription: INodeProperties[] = [
  ...cursorPaginationProperties("channel", "getAll"),
  {
    displayName: "Filters",
    name: "filters",
    type: "collection",
    placeholder: "Add Filter",
    default: {},
    displayOptions: { show: { resource: ["channel"], operation: ["getAll"] } },
    options: [
      {
        displayName: "Provider",
        name: "provider",
        type: "options",
        options: PROVIDER_OPTIONS,
        default: "bluesky",
        description: "Only return channels for this social platform",
        routing: { send: { type: "query", property: "provider" } },
      },
      {
        displayName: "Status",
        name: "status",
        type: "options",
        options: CHANNEL_STATUS_OPTIONS,
        default: "active",
        description: "Only return channels in this connection state",
        routing: { send: { type: "query", property: "status" } },
      },
    ],
  },
];
