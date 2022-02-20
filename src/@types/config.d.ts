import { CacheWithLimitsOptions } from "discord.js";
import { ClientCluster } from "./cluster";

export interface Config {
  client: {
    id: string,
    secret: string,
    token: string,
  },
  cluster: ClientCluster,
  databaseUri: string,

  admins: Array<string>,
  guild?: string | null,

  apiPort?: number | null,
  apiUri?: string | null,

  colors: {
    primary: number,
    success: number,
    error: number,
    warning: number,
    info: number,
  },

  progressIcons: {
    complete: string,
    selected: string,
    incomplete: string,
  }
}
