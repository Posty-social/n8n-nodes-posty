import type { INodeProperties } from "n8n-workflow";

/**
 * The workspace a request acts on.
 *
 * A key scoped to one workspace does not need this: the API already knows
 * which workspace it is for, and naming a different one is refused. A key
 * scoped to the whole team has to be told, on every request.
 */
export const workspaceIdProperty: INodeProperties = {
  displayName: "Workspace Name or ID",
  name: "workspaceId",
  type: "options",
  typeOptions: { loadOptionsMethod: "getWorkspaces" },
  default: "",
  description:
    'Leave empty when the API key is scoped to a single workspace. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
  displayOptions: {
    hide: { resource: ["workspace"] },
  },
  routing: {
    send: {
      type: "query",
      property: "workspaceId",
      // An empty value must not become `?workspaceId=`, which the API reads
      // as naming a workspace with an empty id.
      value: "={{ $value || undefined }}",
    },
  },
};
