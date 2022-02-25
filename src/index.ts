import * as guilds from "./database/guilds";
import { Client, Options } from "discord.js";
import { askForPermissionToInitialize, markClusterAsReady } from "./utils/cluster";
import config from "./config";
import { connection } from "./database";
import { hindenburgLogger } from "./utils/logger/hindenburg";
import { discordLogger } from "./utils/logger/discord";
import { getPresence } from "./utils/cluster/presence";
import { inspect } from "util";
import interactionsHandler from "./handlers/interactions";
import { inviteUrl } from "./constants/links";
import messageCommandHandler from "./handlers/messageCommands";
import { postStats } from "./utils/cluster/stats";
import prepareGuild from "./handlers/prepareGuild";
import {redis} from "./redis";

const client = new Client({
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
  userAgentSuffix: [],
  presence: { status: "dnd" },
  intents: [
      "GUILDS",
      "GUILD_MESSAGES",
      "GUILD_MEMBERS",
      "GUILD_BANS",
      "GUILD_INTEGRATIONS",
      "GUILD_MESSAGE_REACTIONS",
      "DIRECT_MESSAGES",
      "DIRECT_MESSAGE_REACTIONS"
  ],
  shards: config.cluster.shards,
  shardCount: config.cluster.shardCount,
});

redis.subscribe("test", (err, msg) => {
  if (err) {
    console.error(err);
  } else {
    console.log(msg)
  }
})

redis.on("message", (channel, message) => {
  console.log(`Received ${message} from ${channel}`);
});

let disabledGuilds = new Set();

client.once("ready", async client => {
  hindenburgLogger.info(`Ready as ${client.user.tag} on shards ${config.cluster.shards.join(", ")}! Caching guilds...`);
  markClusterAsReady();

  // stats
  setInterval(() => postStats(client, Boolean(disabledGuilds.size)), 10000);

  // prepare guilds
  if (client.guilds.cache.size) {
    disabledGuilds = new Set(client.guilds.cache.map(g => g.id)); // cache guilds

    const cacheStart = Date.now();
    await guilds.touch(client.guilds.cache.map(g => g.id));
    hindenburgLogger.info(`${client.guilds.cache.size} guilds cached in ${Math.ceil((Date.now() - cacheStart) / 1000)}s. Processing available guilds...`);

    // process guilds
    let completed = 0;
    const processingStart = Date.now(), presenceInterval = setInterval(() => {
      const percentage = completed / client.guilds.cache.size * 100;
      client.user.setPresence({
        status: "idle",
        activities: [
          {
            type: "WATCHING",
            name: `${Math.round(percentage)}% ${"|".repeat(Math.round(percentage / 5))}`,
          },
        ],
      });
    }, 1000);
    await Promise.all(client.guilds.cache.map(async guild => {
      await prepareGuild(guild);
      disabledGuilds.delete(guild.id);
      completed += 1;
    }));
    clearInterval(presenceInterval);
    hindenburgLogger.info(`${client.guilds.cache.size} guilds processed in ${Math.ceil((Date.now() - processingStart) / 1000)}s.`);

    // finish up
    disabledGuilds = new Set();
  } else hindenburgLogger.warn(`Add the bot with this link: ${inviteUrl}`);

  // presence
  updatePresence();
  setInterval(updatePresence, 1000 * 60);

  // interactions
  interactionsHandler(client).then(() => hindenburgLogger.info("Now listening to interactions."));
});

async function updatePresence() {
  const presence = await getPresence(client);
  return client.user?.setPresence(presence);
}

client.on("messageCreate", async message => {
  if (
    !message.guildId ||
    disabledGuilds?.has(message.guildId) ||
    message.author.bot ||
    message.type !== "DEFAULT"
  ) return;

  const document = await guilds.get(message.guildId);

  if (message.content.match(`^<@!?${client.user?.id}> `)) return messageCommandHandler(message, document);

  if (message.content.match(`^<@!?${client.user?.id}>`)) {
    return void message.reply({
      content: "Hello there!",
    });
  }
});

client
  .on("debug", info => void discordLogger.debug(info))
  .on("error", error => void discordLogger.error(`Cluster errored. ${inspect(error)}`))
  .on("rateLimit", rateLimitData => void discordLogger.warn(`Rate limit ${inspect(rateLimitData)}`))
  .on("ready", () => void discordLogger.info("All shards have been connected."))
  .on("shardDisconnect", (event, id) => void discordLogger.warn(`Shard ${id} disconnected. ${inspect(event)}`))
  .on("shardError", (error, id) => void discordLogger.error(`Shard ${id} errored. ${inspect(error)}`))
  .on("shardReady", id => void discordLogger.info(`Shard ${id} is ready.`))
  .on("shardReconnecting", id => void discordLogger.warn(`Shard ${id} is reconnecting.`))
  .on("shardResume", (id, replayed) => void discordLogger.info(`Shard ${id} resumed. ${replayed} events replayed.`))
  .on("warn", info => void discordLogger.warn(info));

Promise.all([
  connection,
  new Promise(resolve => {
    const timeout = setInterval(() => askForPermissionToInitialize().then(greenLight => {
      if (greenLight) {
        resolve(void 0);
        clearInterval(timeout);
      }
    }), 1000);
  }),
]).then(() => {
  hindenburgLogger.info("Green light received and connected to the database. Logging in to Discord.");
  client.login(config.client.token);
}).catch(error => {
  hindenburgLogger.error(`Failed to connect to database: ${inspect(error)}`);
  process.exit(1);
});

setInterval(() => postStats(client, Boolean(disabledGuilds.size)), 10000);

process.on("unhandledRejection", error => hindenburgLogger.error(`Unhandled rejection: ${inspect(error)}`));
