import type { INodePropertyOptions } from "n8n-workflow";

export const PROVIDER_OPTIONS: INodePropertyOptions[] = [
  { name: "Bluesky", value: "bluesky" },
  { name: "Discord", value: "discord" },
  { name: "Facebook", value: "facebook" },
  { name: "Instagram", value: "instagram" },
  { name: "LinkedIn", value: "linkedin" },
  { name: "Pinterest", value: "pinterest" },
  { name: "Threads", value: "threads" },
  { name: "TikTok", value: "tiktok" },
  { name: "YouTube", value: "youtube" },
];

export const PROVIDER_LABELS: Record<string, string> = Object.fromEntries(
  PROVIDER_OPTIONS.map((option) => [option.value as string, option.name])
);

export const CHANNEL_STATUS_OPTIONS: INodePropertyOptions[] = [
  { name: "Active", value: "active" },
  { name: "Disconnected", value: "disconnected" },
  { name: "Error", value: "error" },
  { name: "Pending", value: "pending" },
];

export const POST_STATUS_OPTIONS: INodePropertyOptions[] = [
  { name: "Approved", value: "approved" },
  { name: "Delivered", value: "delivered" },
  { name: "Delivery Failed", value: "delivery_failed" },
  { name: "Draft", value: "draft" },
  { name: "Partially Delivered", value: "partially_delivered" },
  { name: "Pending Approval", value: "pending_approval" },
  { name: "Pending Client Approval", value: "pending_client_approval" },
  { name: "Scheduled", value: "scheduled" },
];

export const APPROVAL_MODE_OPTIONS: INodePropertyOptions[] = [
  { name: "Multi-Level", value: "multi_level" },
  { name: "None", value: "none" },
  { name: "Optional", value: "optional" },
  { name: "Required", value: "required" },
];

export const MEDIA_STATUS_OPTIONS: INodePropertyOptions[] = [
  { name: "Deduped", value: "deduped" },
  { name: "Failed", value: "failed" },
  { name: "Pending", value: "pending" },
  { name: "Processing", value: "processing" },
  { name: "Ready", value: "ready" },
];

export const MEDIA_CONTENT_TYPE_OPTIONS: INodePropertyOptions[] = [
  { name: "GIF Image", value: "image/gif", description: "MIME type image/gif" },
  {
    name: "JPEG Image",
    value: "image/jpeg",
    description: "MIME type image/jpeg",
  },
  { name: "MP4 Video", value: "video/mp4", description: "MIME type video/mp4" },
  { name: "PNG Image", value: "image/png", description: "MIME type image/png" },
  {
    name: "QuickTime Video",
    value: "video/quicktime",
    description: "MIME type video/quicktime",
  },
  {
    name: "WebP Image",
    value: "image/webp",
    description: "MIME type image/webp",
  },
];

export const ALLOWED_MEDIA_CONTENT_TYPES = MEDIA_CONTENT_TYPE_OPTIONS.map(
  (option) => option.value as string
);
