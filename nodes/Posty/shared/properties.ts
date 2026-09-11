import type { INodeProperties } from "n8n-workflow";

/** Channel picker backed by the workspace's connected channels. */
export function channelIdProperty(
  overrides: Partial<INodeProperties> = {}
): INodeProperties {
  return {
    displayName: "Channel Name or ID",
    name: "channelId",
    type: "options",
    typeOptions: { loadOptionsMethod: "getChannels" },
    default: "",
    required: true,
    description:
      'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
    ...overrides,
  };
}

export function postIdProperty(
  overrides: Partial<INodeProperties> = {}
): INodeProperties {
  return {
    displayName: "Post ID",
    name: "postId",
    type: "string",
    default: "",
    required: true,
    description: "ID of the post",
    ...overrides,
  };
}
