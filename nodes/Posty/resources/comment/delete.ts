import type { INodeProperties } from "n8n-workflow";

export const commentDeleteDescription: INodeProperties[] = [
  {
    displayName: "Comment ID",
    name: "commentId",
    type: "string",
    default: "",
    required: true,
    description: "ID of the comment to delete",
    displayOptions: { show: { resource: ["comment"], operation: ["delete"] } },
  },
];
