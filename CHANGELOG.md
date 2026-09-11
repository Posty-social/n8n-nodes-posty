# Changelog

## 0.1.0

First release.

- **Post**: create, get, get many, update, delete, submit for approval, approve, request changes, publish, retry failed deliveries and get history.
- **Post Content**: update the body and platform metadata for one channel, replace its media, or remove the channel from the post.
- **Media**: one-step upload of a binary file, plus get, get many, delete, and the individual create-upload-URL and complete-upload steps.
- **Channel**: get and get many, filterable by platform and connection status.
- **Comment**: create, get many and delete.
- **Workspace**: get many, listing the workspaces an API key can reach.
- **Posty API credential**: workspace-scoped API key sent as a bearer token, with a configurable base URL and a connection test.
