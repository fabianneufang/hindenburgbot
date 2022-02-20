import { Config } from "./@types/config";
import { config } from "dotenv";
config(); // load env variables

export default {
  client: {
    token: process.env.BOT_TOKEN,
  },
  cluster: {
    id: parseInt(process.env.CLUSTER || "") || 0,
    shards: process.env.SHARDS?.split(",").map(s => parseInt(s)) || [0],
    shardCount: parseInt(process.env.SHARD_COUNT || "") || 1,
  },
  databaseUri: process.env.DATABASE_URI,

  admins: (process.env.ADMINS || "").split(","),
  guild: process.env.GUILD || null,

  apiPort: parseInt(process.env.API_PORT || ""),
  apiUri: process.env.API_URI,

  colors: {
    primary: parseInt("e93c93", 16),
    success: parseInt("43B581", 16),
    error: parseInt("F14747", 16),
    warning: parseInt("FAA619", 16),
    info: parseInt("5865F2", 16),
  }
} as Config;
