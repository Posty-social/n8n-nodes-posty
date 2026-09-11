import type { INodeProperties } from "n8n-workflow";

export const workspaceDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: { resource: ["workspace"] },
    },
    options: [
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many workspaces",
        description:
          "List the workspaces this API key can access, with their permissions",
        routing: {
          request: { method: "GET", url: "/v1/workspaces" },
          output: {
            postReceive: [
              { type: "rootProperty", properties: { property: "workspaces" } },
            ],
          },
        },
      },
    ],
    default: "getAll",
  },
];
