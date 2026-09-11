import type { ILoadOptionsFunctions, INodePropertyOptions } from "n8n-workflow";

import { PROVIDER_LABELS } from "../shared/constants";
import { postyApiRequestAllPages } from "../shared/transport";

interface ChannelSummary {
  id: string;
  name: string;
  provider: string;
  status: string;
  accountLabel: string | null;
}

export async function getChannels(
  this: ILoadOptionsFunctions
): Promise<INodePropertyOptions[]> {
  const channels = (await postyApiRequestAllPages.call(
    this,
    "/v1/channels"
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
