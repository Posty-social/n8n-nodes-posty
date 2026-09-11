# n8n-nodes-posty

This is an n8n community node. It lets you use [Posty](https://posty.social) in your n8n workflows.

Posty is a social media scheduling and approval tool. It publishes to Bluesky, Discord, Facebook, Instagram, LinkedIn, Pinterest, Threads, TikTok and YouTube, with a review process, a shared media library and per-channel content.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Post

A post is the shell: a schedule, an approval mode and a status. It holds one content row per channel it targets.

| Operation               | What it does                                                      |
| ----------------------- | ----------------------------------------------------------------- |
| Create                  | Creates a post with content for one or more channels              |
| Get                     | Returns a post with its per-channel content and delivery state    |
| Get Many                | Lists posts, with status, channel and date filters                |
| Update                  | Changes the schedule, approval mode or status                     |
| Delete                  | Deletes the post                                                  |
| Submit for Approval     | Moves a draft into the review process                             |
| Approve                 | Approves the current review stage                                 |
| Request Changes         | Sends the post back to draft with feedback                        |
| Publish                 | Publishes now, or locks the post in for its scheduled time        |
| Retry Failed Deliveries | Re-queues the channels whose delivery failed                      |
| Get History             | Returns the revisions, approvals and events recorded for the post |

### Post Content

The per-channel body, platform settings and attachments on an existing post.

| Operation | What it does                                          |
| --------- | ----------------------------------------------------- |
| Update    | Changes the text or platform settings for one channel |
| Set Media | Replaces the media attached to one channel, in order  |
| Remove    | Drops one channel from the post                       |

### Media

| Operation         | What it does                                                          |
| ----------------- | --------------------------------------------------------------------- |
| Upload            | Uploads a binary file from the input item and waits until it is ready |
| Get               | Returns a media item with its status and download URLs                |
| Get Many          | Lists the workspace media library                                     |
| Delete            | Deletes a media item and its stored files                             |
| Create Upload URL | Reserves a media item and returns a presigned upload URL              |
| Complete Upload   | Tells Posty the file has been uploaded so processing can start        |

Use **Upload** for the normal case. It runs all three steps in one operation. **Create Upload URL** and **Complete Upload** expose the individual steps for workflows that move the bytes themselves.

### Channel

| Operation | What it does                                                           |
| --------- | ---------------------------------------------------------------------- |
| Get       | Returns one connected social channel                                   |
| Get Many  | Lists connected channels, filterable by platform and connection status |

### Comment

| Operation | What it does                                           |
| --------- | ------------------------------------------------------ |
| Create    | Adds a comment, optionally flagged as a change request |
| Get Many  | Lists the comments on a post                           |
| Delete    | Deletes a comment                                      |

### Workspace

| Operation | What it does                                                       |
| --------- | ------------------------------------------------------------------ |
| Get Many  | Lists the workspaces the API key can reach, with their permissions |

## Credentials

Posty authenticates with an API key.

1. In Posty, open **API keys** in the team sidebar and create a key. It looks like `pk_live_...`. Only team owners and admins can create one.
2. Choose what the key can reach: a single workspace, or every workspace in the team.
3. In n8n, create a **Posty API** credential and paste the key.
4. Leave **Base URL** at `https://api.posty.social` unless you are pointing at a non-production Posty.

The key is sent as `Authorization: Bearer <key>`. API keys require a plan that includes programmatic access.

### Choosing a workspace

Every operation except **Workspace → Get Many** has a **Workspace** field.

- A key scoped to **one workspace** does not need it. Leave it empty and the API uses the key's own workspace. Naming a different workspace is refused.
- A key scoped to **every workspace** must have it set on every request, because the key alone does not say which workspace you mean. Pick one from the list, which is loaded from the workspaces the key can reach.

The channel picker follows the same choice, so set the workspace first and the list will show that workspace's channels.

## Compatibility

Built and tested against n8n 1.x with `n8n-workflow` 2.x. It targets version 1 of the Posty API and has no known version incompatibilities.

## Usage

### Creating a post

Add one entry under **Content** per channel. Pick the channel from the list, which loads the connected channels in your workspace. Each entry takes:

- **Body**: the text for that channel.
- **Media IDs**: comma-separated IDs from the media library. The media must have status `ready`.
- **Metadata**: platform-specific settings as a flat JSON object.

Leave **Scheduled At** empty to create a draft. Set it to schedule the post.

### Metadata

Metadata is a flat JSON object of platform settings. The keys differ per platform, for example `boardId`, `title`, `link` and `altText` on Pinterest, or `privacyStatus`, `categoryId`, `tags` and `madeForKids` on YouTube. Values may be strings, numbers, booleans or arrays of strings. See the [Posty API reference](https://docs.posty.social) for the keys each platform accepts.

### Attaching media

Upload the file first, then reference it:

1. **Media → Upload** with the binary field from a previous node. It returns the media record once processing finishes.
2. **Post → Create**, putting `{{ $json.id }}` in the **Media IDs** field of the right content entry.

To change the attachments on a post that already exists, use **Post Content → Set Media**. It replaces the whole list, so include every media ID you want to keep.

### Approval flow

Posts created with an approval mode of `optional`, `required` or `multi_level` go through review. The flow is **Submit for Approval**, then **Approve** or **Request Changes**, then **Publish**. The same permissions and readiness checks as the Posty app apply, so an operation can fail if the API key lacks the permission or the post is not ready.

### Pagination

Every list operation has **Return All**. Leave it off and set **Limit** to cap the results, or turn it on to walk every page.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Posty](https://posty.social)
- [Posty API reference](https://docs.posty.social)

## Version history

### 0.2.0

Adds the **Workspace** field, so one credential can drive every workspace in a team when the key is scoped that way. The channel picker and every request now follow that choice.

### 0.1.0

First release. Covers posts, per-channel post content, media, channels, comments and workspaces.
