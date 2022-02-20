import * as guilds from "../../database/guilds";
import { Guild, TextChannel, ThreadChannel } from "discord.js";

export default async (guild: Guild): Promise<void> => {
  const db = await guilds.get(guild.id);
};
