import type { INodeProperties } from "n8n-workflow";

import { unwrapListData } from "../../shared/utils";
import { channelGetDescription } from "./get";
import { channelGetAllDescription } from "./getAll";

export const channelDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: { resource: ["channel"] },
    },
    options: [
      {
        name: "Get",
        value: "get",
        action: "Get a channel",
        description: "Get a connected social channel",
        routing: {
          request: {
            method: "GET",
            url: "=/v1/channels/{{$parameter.channelId}}",
          },
        },
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many channels",
        description: "List the connected social channels in the workspace",
        routing: {
          request: { method: "GET", url: "/v1/channels" },
          output: { postReceive: [unwrapListData] },
        },
      },
    ],
    default: "getAll",
  },
  ...channelGetDescription,
  ...channelGetAllDescription,
];
