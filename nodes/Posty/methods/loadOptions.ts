import type {
  IDataObject,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from "n8n-workflow";

import { PROVIDER_LABELS } from "../shared/constants";
import { postyApiRequest, postyApiRequestAllPages } from "../shared/transport";

interface ChannelSummary {
  id: string;
  name: string;
  provider: string;
  status: string;
  accountLabel: string | null;
}

interface WorkspaceSummary {
  id: string;
  name?: string;
  permissions: string[];
}

/**
 * The workspace chosen on the node, when there is one. A key scoped to a
 * single workspace leaves this empty and the API supplies the workspace.
 */
function selectedWorkspace(context: ILoadOptionsFunctions): IDataObject {
  const value = context.getCurrentNodeParameter("workspaceId");
  return typeof value === "string" && value !== ""
    ? { workspaceId: value }
    : {};
}

export async function getWorkspaces(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {
  const response = (await postyApiRequest.call(
    this,
    "GET",
    "/v1/workspaces"
  )) as unknown as { workspaces: WorkspaceSummary[] };

  return response.workspaces
    .map((workspace) => ({
      name: workspace.name ?? workspace.id,
      value: workspace.id,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function getChannels(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {
  const channels = (await postyApiRequestAllPages.call(
    this,
    "/v1/channels",
    selectedWorkspace(this)
  )) as ChannelSummary[];

  return channels
    .map((channel) => {
      const provider = PROVIDER_LABELS[channel.provider] ?? channel.provider;
      const state = channel.status === "active" ? "" : `, ${channel.status}`;
      return {
        name: `${channel.name} (${provider}${state})`,
        value: channel.id,
        description: channel.accountLabel ?? undefined,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
