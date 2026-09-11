import type {
  IDataObject,
  IExecuteSingleFunctions,
  IHttpRequestOptions,
  IN8nHttpFullResponse,
  INodeExecutionData,
  INodeProperties,
} from "n8n-workflow";

import { NodeOperationError, sleep } from "n8n-workflow";

import {
  ALLOWED_MEDIA_CONTENT_TYPES,
  MEDIA_CONTENT_TYPE_OPTIONS,
} from "../../shared/constants";
import { postyApiRequest } from "../../shared/transport";

const show = { resource: ["media"], operation: ["upload"] };

const POLL_INTERVAL_MS = 2000;

interface CreatedUpload {
  id: string;
  uploadUrl: string;
  key: string;
  expiresAt: string;
}

interface MediaRecord extends IDataObject {
  id: string;
  status: "pending" | "processing" | "ready" | "failed" | "deduped";
}

export const mediaUploadDescription: INodeProperties[] = [
  {
    displayName: "Input Binary Field",
    name: "binaryPropertyName",
    type: "string",
    default: "data",
    required: true,
    hint: "The name of the input binary field containing the file to upload",
    displayOptions: { show },
  },
  {
    displayName: "Options",
    name: "options",
    type: "collection",
    placeholder: "Add option",
    default: {},
    displayOptions: { show },
    options: [
      {
        displayName: "Content Type",
        name: "contentType",
        type: "options",
        options: [
          { name: "Auto-Detect From Binary Data", value: "auto" },
          ...MEDIA_CONTENT_TYPE_OPTIONS,
        ],
        default: "auto",
        description: "MIME type to register the file as",
      },
      {
        displayName: "Title",
        name: "title",
        type: "string",
        default: "",
        description:
          "Name shown in the media library. Defaults to the file name.",
      },
      {
        displayName: "Wait Timeout (Seconds)",
        name: "waitTimeout",
        type: "number",
        typeOptions: { minValue: 1 },
        default: 120,
        description: "How long to wait for processing before failing",
      },
      {
        displayName: "Wait Until Ready",
        name: "waitUntilReady",
        type: "boolean",
        default: true,
        description:
          "Whether to wait for Posty to finish processing so the media can be attached to a post straight away",
      },
    ],
  },
];

/**
 * Turns the declarative request into the last step of the three-step upload:
 * reserve a media row, PUT the bytes to the presigned URL, then complete.
 */
export async function mediaUploadPreSend(
  this: IExecuteSingleFunctions,
  requestOptions: IHttpRequestOptions
): Promise<IHttpRequestOptions> {
  const node = this.getNode();
  const binaryPropertyName = this.getNodeParameter(
    "binaryPropertyName"
  ) as string;
  const binaryData = this.helpers.assertBinaryData(binaryPropertyName);
  const buffer = await this.helpers.getBinaryDataBuffer(binaryPropertyName);

  const requestedType = this.getNodeParameter(
    "options.contentType",
    "auto"
  ) as string;
  const contentType =
    requestedType === "auto" ? binaryData.mimeType : requestedType;
  if (!ALLOWED_MEDIA_CONTENT_TYPES.includes(contentType)) {
    throw new NodeOperationError(
      node,
      `Content type "${contentType}" is not supported by Posty`,
      {
        description: `Supported types: ${ALLOWED_MEDIA_CONTENT_TYPES.join(", ")}. Set "Content Type" under Options to override the detected type.`,
      }
    );
  }
  if (buffer.length === 0) {
    throw new NodeOperationError(node, "The binary file is empty");
  }

  const requestedTitle = this.getNodeParameter("options.title", "") as string;
  const title = (requestedTitle || binaryData.fileName || "Upload").slice(
    0,
    500
  );

  const created = (await postyApiRequest.call(this, "POST", "/v1/media", {
    body: { title, contentType, sizeBytes: buffer.length },
  })) as unknown as CreatedUpload;

  const putResponse = (await this.helpers.httpRequest({
    method: "PUT",
    url: created.uploadUrl,
    body: buffer,
    headers: { "Content-Type": contentType },
    returnFullResponse: true,
  })) as IN8nHttpFullResponse;

  const rawEtag = putResponse.headers.etag ?? putResponse.headers.ETag;
  const etag =
    typeof rawEtag === "string" ? rawEtag.replace(/"/g, "") : undefined;

  return {
    ...requestOptions,
    url: `/v1/media/${created.id}/complete`,
    body: etag ? { etag } : {},
  };
}

/** Polls the media record until processing settles, when "Wait Until Ready" is on. */
export async function mediaWaitUntilReady(
  this: IExecuteSingleFunctions,
  items: INodeExecutionData[]
): Promise<INodeExecutionData[]> {
  const wait = this.getNodeParameter("options.waitUntilReady", true) as boolean;
  if (!wait) {
    return items;
  }
  const timeoutSeconds = this.getNodeParameter(
    "options.waitTimeout",
    120
  ) as number;
  const deadline = Date.now() + timeoutSeconds * 1000;
  const node = this.getNode();

  const results: INodeExecutionData[] = [];
  for (const item of items) {
    let media = item.json as MediaRecord;
    while (media.status === "pending" || media.status === "processing") {
      if (Date.now() >= deadline) {
        throw new NodeOperationError(
          node,
          `Media ${media.id} was still "${media.status}" after ${timeoutSeconds} seconds`,
          {
            description:
              'Increase "Wait Timeout" or turn off "Wait Until Ready" and check the status later with the Get operation.',
          }
        );
      }
      await sleep(POLL_INTERVAL_MS);
      media = (await postyApiRequest.call(
        this,
        "GET",
        `/v1/media/${media.id}`
      )) as unknown as MediaRecord;
    }
    if (media.status === "failed") {
      throw new NodeOperationError(
        node,
        `Posty could not process media ${media.id}`
      );
    }
    results.push({ json: media, pairedItem: item.pairedItem });
  }
  return results;
}
