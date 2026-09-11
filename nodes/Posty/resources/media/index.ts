import type { INodeProperties } from "n8n-workflow";

import { successOutput, unwrapListData } from "../../shared/utils";
import { mediaCompleteDescription } from "./complete";
import { mediaCreateUploadDescription } from "./createUpload";
import { mediaGetAllDescription } from "./getAll";
import {
  mediaUploadDescription,
  mediaUploadPreSend,
  mediaWaitUntilReady,
} from "./upload";

export const mediaDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: { resource: ["media"] },
    },
    options: [
      {
        name: "Complete Upload",
        value: "complete",
        action: "Complete a media upload",
        description:
          'Tell Posty the file has been uploaded to the URL from "Create Upload URL" so processing can start',
        routing: {
          request: {
            method: "POST",
            url: "=/v1/media/{{$parameter.mediaId}}/complete",
          },
        },
      },
      {
        name: "Create Upload URL",
        value: "createUpload",
        action: "Create a media upload URL",
        description:
          'Reserve a media item and get a presigned URL to PUT the file to. Use "Upload" to do all steps at once.',
        routing: {
          request: { method: "POST", url: "/v1/media" },
        },
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete a media item",
        description: "Delete a media item and its stored files",
        routing: {
          request: {
            method: "DELETE",
            url: "=/v1/media/{{$parameter.mediaId}}",
          },
          output: { postReceive: [successOutput] },
        },
      },
      {
        name: "Get",
        value: "get",
        action: "Get a media item",
        description: "Get a media item including its status and download URLs",
        routing: {
          request: { method: "GET", url: "=/v1/media/{{$parameter.mediaId}}" },
        },
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many media items",
        description: "List the media in the workspace library",
        routing: {
          request: { method: "GET", url: "/v1/media" },
          output: { postReceive: [unwrapListData] },
        },
      },
      {
        name: "Upload",
        value: "upload",
        action: "Upload a media file",
        description:
          "Upload a binary file from the input item to the media library",
        routing: {
          request: { method: "POST", url: "/v1/media" },
          send: { preSend: [mediaUploadPreSend] },
          output: { postReceive: [mediaWaitUntilReady] },
        },
      },
    ],
    default: "upload",
  },
  {
    displayName: "Media ID",
    name: "mediaId",
    type: "string",
    default: "",
    required: true,
    description: "ID of the media item",
    displayOptions: {
      show: { resource: ["media"], operation: ["complete", "delete", "get"] },
    },
  },
  ...mediaUploadDescription,
  ...mediaCreateUploadDescription,
  ...mediaCompleteDescription,
  ...mediaGetAllDescription,
];
