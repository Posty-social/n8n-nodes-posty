import type { INodeProperties } from "n8n-workflow";

import { postIdProperty } from "../../shared/properties";
import { successOutput, unwrapListData } from "../../shared/utils";
import { postActionsDescription } from "./actions";
import { postCreateDescription, postCreatePreSend } from "./create";
import { postGetAllDescription } from "./getAll";
import { postUpdateDescription, postUpdatePreSend } from "./update";

const actionsUrl = "=/v1/posts/{{$parameter.postId}}/actions";

export const postDescription: INodeProperties[] = [
  {
    displayName: "Operation",
    name: "operation",
    type: "options",
    noDataExpression: true,
    displayOptions: {
      show: { resource: ["post"] },
    },
    options: [
      {
        name: "Approve",
        value: "approve",
        action: "Approve a post",
        description: "Approve the current review stage of a post",
        routing: {
          request: {
            method: "POST",
            url: actionsUrl,
            body: { action: "approve" },
          },
        },
      },
      {
        name: "Create",
        value: "create",
        action: "Create a post",
        description: "Create a post with content for one or more channels",
        routing: {
          request: { method: "POST", url: "/v1/posts" },
          send: { preSend: [postCreatePreSend] },
        },
      },
      {
        name: "Delete",
        value: "delete",
        action: "Delete a post",
        description: "Delete a post",
        routing: {
          request: {
            method: "DELETE",
            url: "=/v1/posts/{{$parameter.postId}}",
          },
          output: { postReceive: [successOutput] },
        },
      },
      {
        name: "Get",
        value: "get",
        action: "Get a post",
        description:
          "Get a post including its per-channel content and delivery state",
        routing: {
          request: { method: "GET", url: "=/v1/posts/{{$parameter.postId}}" },
        },
      },
      {
        name: "Get History",
        value: "getHistory",
        action: "Get the history of a post",
        description:
          "Get the revisions, approvals and events recorded for a post",
        routing: {
          request: {
            method: "GET",
            url: "=/v1/posts/{{$parameter.postId}}/history",
          },
        },
      },
      {
        name: "Get Many",
        value: "getAll",
        action: "Get many posts",
        description: "List posts in the workspace",
        routing: {
          request: { method: "GET", url: "/v1/posts" },
          output: { postReceive: [unwrapListData] },
        },
      },
      {
        name: "Publish",
        value: "publish",
        action: "Publish a post",
        description: "Publish an approved post now or at its scheduled time",
        routing: {
          request: {
            method: "POST",
            url: actionsUrl,
            body: { action: "publish" },
          },
        },
      },
      {
        name: "Request Changes",
        value: "requestChanges",
        action: "Request changes on a post",
        description: "Send a post back to draft with feedback",
        routing: {
          request: {
            method: "POST",
            url: actionsUrl,
            body: { action: "request_changes" },
          },
        },
      },
      {
        name: "Retry Failed Deliveries",
        value: "retry",
        action: "Retry failed deliveries of a post",
        description:
          "Queue the channels whose delivery failed for another attempt",
        routing: {
          request: {
            method: "POST",
            url: actionsUrl,
            body: { action: "retry" },
          },
        },
      },
      {
        name: "Submit for Approval",
        value: "submit",
        action: "Submit a post for approval",
        description: "Move a draft into the review process",
        routing: {
          request: {
            method: "POST",
            url: actionsUrl,
            body: { action: "submit" },
          },
        },
      },
      {
        name: "Update",
        value: "update",
        action: "Update a post",
        description: "Change the schedule, approval mode or status of a post",
        routing: {
          request: { method: "PATCH", url: "=/v1/posts/{{$parameter.postId}}" },
          send: { preSend: [postUpdatePreSend] },
        },
      },
    ],
    default: "create",
  },
  postIdProperty({
    displayOptions: {
      show: {
        resource: ["post"],
        operation: [
          "approve",
          "delete",
          "get",
          "getHistory",
          "publish",
          "requestChanges",
          "retry",
          "submit",
          "update",
        ],
      },
    },
  }),
  ...postCreateDescription,
  ...postGetAllDescription,
  ...postUpdateDescription,
  ...postActionsDescription,
];
