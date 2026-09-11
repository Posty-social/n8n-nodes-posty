import type {
  IDataObject,
  IExecuteSingleFunctions,
  IHttpRequestOptions,
  INodeProperties,
} from "n8n-workflow";

import { NodeOperationError } from "n8n-workflow";

import { parseJsonObject } from "../../shared/utils";

export const postContentUpdateDescription: INodeProperties[] = [
  {
    displayName: "Update Fields",
    name: "updateFields",
    type: "collection",
    placeholder: "Add Field",
    default: {},
    displayOptions: {
      show: { resource: ["postContent"], operation: ["update"] },
    },
    options: [
      {
        displayName: "Body",
        name: "body",
        type: "string",
        typeOptions: { rows: 4 },
        default: "",
        description:
          "New text for this channel. Leave empty to clear the text.",
      },
      {
        displayName: "Metadata",
        name: "metadata",
        type: "json",
        default: "{}",
        description:
          "Platform-specific settings as a flat JSON object. Values may be strings, numbers, booleans or string arrays.",
      },
    ],
  },
];

export async function postContentUpdatePreSend(
  this: IExecuteSingleFunctions,
  requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
  const node = this.getNode();
  const fields = this.getNodeParameter("updateFields", {}) as IDataObject;
  const body: IDataObject = {};

  if (typeof fields.body === "string") {
    body.body = fields.body === "" ? null : fields.body;
  }
  if (fields.metadata !== undefined) {
    const metadata = parseJsonObject(fields.metadata, node, "Metadata");
    if (metadata) {
      body.metadata = metadata;
    }
  }

  if (Object.keys(body).length === 0) {
    throw new NodeOperationError(
      node,
      'Add at least one field under "Update Fields"'
    );
  }

  return { ...requestOptions, body };
}
